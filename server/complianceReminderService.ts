import { db } from "./db";
import { 
  complianceCalendar, 
  complianceNotifications, 
  businessEntities,
  type ComplianceCalendar,
  type ComplianceNotification,
  type InsertComplianceCalendar,
  type InsertComplianceNotification
} from "@shared/schema";
import { eq, lte, gte, and, sql, desc, asc } from "drizzle-orm";
import nodemailer from "nodemailer";
import { addDays, addMonths, addYears, format, isBefore, isAfter } from "date-fns";

export interface ComplianceReminderConfig {
  reminderDays: number[]; // Days before due date to send reminders (e.g., [90, 30, 7, 1])
  notificationMethods: ("email" | "dashboard" | "sms")[];
  emailTemplate?: string;
  smsTemplate?: string;
}

export interface ComplianceEvent {
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  category: string;
  isRecurring: boolean;
  recurringInterval?: "annual" | "quarterly" | "monthly";
  reminderConfig: ComplianceReminderConfig;
}

export class ComplianceReminderService {
  private emailTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeEmailTransporter();
  }

  private initializeEmailTransporter() {
    if (process.env.OUTLOOK_FROM_EMAIL && process.env.OUTLOOK_SMTP_PASSWORD) {
      this.emailTransporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.OUTLOOK_FROM_EMAIL,
          pass: process.env.OUTLOOK_SMTP_PASSWORD,
        },
      });
    }
  }

  // Schedule compliance reminders for a business entity
  async scheduleComplianceReminders(
    businessEntityId: number,
    events: ComplianceEvent[]
  ): Promise<void> {
    for (const event of events) {
      await this.createComplianceCalendarEntry(businessEntityId, event);
    }
  }

  // Create a compliance calendar entry with automated reminders
  async createComplianceCalendarEntry(
    businessEntityId: number,
    event: ComplianceEvent
  ): Promise<ComplianceCalendar> {
    // Calculate reminder dates
    const reminderDates = event.reminderConfig.reminderDays.map(days => 
      addDays(event.dueDate, -days)
    );

    const calendarEntry: InsertComplianceCalendar = {
      businessEntityId,
      eventType: event.eventType,
      eventTitle: event.eventTitle,
      eventDescription: event.eventDescription,
      dueDate: event.dueDate,
      reminderDates: JSON.stringify(reminderDates),
      isRecurring: event.isRecurring,
      recurringInterval: event.recurringInterval,
      status: "pending",
      priority: event.priority,
      category: event.category,
    };

    const [createdEntry] = await db
      .insert(complianceCalendar)
      .values(calendarEntry)
      .returning();

    // Schedule notification reminders
    await this.scheduleNotificationReminders(
      businessEntityId,
      createdEntry.id,
      reminderDates,
      event
    );

    return createdEntry;
  }

  // Schedule notification reminders for a compliance event
  private async scheduleNotificationReminders(
    businessEntityId: number,
    complianceCalendarId: number,
    reminderDates: Date[],
    event: ComplianceEvent
  ): Promise<void> {
    const business = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, businessEntityId))
      .then(results => results[0]);

    if (!business) return;

    for (const reminderDate of reminderDates) {
      for (const method of event.reminderConfig.notificationMethods) {
        const daysUntilDue = Math.ceil(
          (event.dueDate.getTime() - reminderDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const notification: InsertComplianceNotification = {
          businessEntityId,
          complianceCalendarId,
          notificationType: method,
          title: this.generateNotificationTitle(event.eventTitle, daysUntilDue),
          message: this.generateNotificationMessage(event, daysUntilDue, business.name || ""),
          scheduledDate: reminderDate,
          recipientEmail: business.contactEmail,
          recipientPhone: business.contactPhone,
        };

        await db.insert(complianceNotifications).values(notification);
      }
    }
  }

  // Process pending notifications that are due to be sent
  async processPendingNotifications(): Promise<void> {
    const now = new Date();
    
    const pendingNotifications = await db
      .select({
        notification: complianceNotifications,
        business: businessEntities,
        calendar: complianceCalendar,
      })
      .from(complianceNotifications)
      .leftJoin(businessEntities, eq(complianceNotifications.businessEntityId, businessEntities.id))
      .leftJoin(complianceCalendar, eq(complianceNotifications.complianceCalendarId, complianceCalendar.id))
      .where(
        and(
          eq(complianceNotifications.status, "pending"),
          lte(complianceNotifications.scheduledDate, now)
        )
      );

    for (const { notification, business, calendar } of pendingNotifications) {
      try {
        await this.sendNotification(notification, business, calendar);
        
        // Mark as sent
        await db
          .update(complianceNotifications)
          .set({ 
            status: "sent", 
            sentDate: now,
            deliveryAttempts: notification.deliveryAttempts + 1
          })
          .where(eq(complianceNotifications.id, notification.id));

      } catch (error) {
        console.error(`Failed to send notification ${notification.id}:`, error);
        
        // Mark as failed and increment attempts
        await db
          .update(complianceNotifications)
          .set({ 
            status: notification.deliveryAttempts >= 2 ? "failed" : "pending",
            deliveryAttempts: notification.deliveryAttempts + 1
          })
          .where(eq(complianceNotifications.id, notification.id));
      }
    }
  }

  // Send individual notification
  private async sendNotification(
    notification: any,
    business: any,
    calendar: any
  ): Promise<void> {
    switch (notification.notificationType) {
      case "email":
        await this.sendEmailNotification(notification, business, calendar);
        break;
      case "sms":
        await this.sendSmsNotification(notification, business);
        break;
      case "dashboard":
        // Dashboard notifications are handled by querying the database
        break;
    }
  }

  // Send email notification
  private async sendEmailNotification(
    notification: any,
    business: any,
    calendar: any
  ): Promise<void> {
    if (!this.emailTransporter || !notification.recipientEmail) {
      throw new Error("Email configuration not available");
    }

    const emailHtml = this.generateEmailTemplate(notification, business, calendar);

    await this.emailTransporter.sendMail({
      from: process.env.OUTLOOK_FROM_EMAIL,
      to: notification.recipientEmail,
      subject: notification.title,
      html: emailHtml,
    });
  }

  // Send SMS notification using Telnyx
  private async sendSmsNotification(
    notification: any,
    business: any
  ): Promise<void> {
    if (!process.env.TELNYX_API_KEY || !notification.recipientPhone) {
      throw new Error("SMS configuration not available");
    }

    const response = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.TELNYX_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.TELNYX_PHONE_NUMBER,
        to: notification.recipientPhone,
        text: notification.message,
        messaging_profile_id: process.env.TELNYX_MESSAGING_PROFILE_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`SMS sending failed: ${response.statusText}`);
    }
  }

  // Generate compliance events based on business entity type and state
  async generateComplianceEventsForBusiness(businessEntityId: number): Promise<void> {
    const business = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, businessEntityId))
      .then(results => results[0]);

    if (!business) return;

    const events: ComplianceEvent[] = [];

    // Annual Report filing (varies by state)
    const annualReportDueDate = this.calculateAnnualReportDueDate(business.state!, business.entityType!);
    if (annualReportDueDate) {
      events.push({
        eventType: "annual_report",
        eventTitle: "Annual Report Filing",
        eventDescription: `File your ${business.entityType} annual report with the ${business.state} Secretary of State.`,
        dueDate: annualReportDueDate,
        priority: "high",
        category: "compliance",
        isRecurring: true,
        recurringInterval: "annual",
        reminderConfig: {
          reminderDays: [90, 30, 14, 7, 1],
          notificationMethods: ["email", "dashboard"],
        },
      });
    }

    // Tax filing deadlines
    const taxDeadline = new Date(new Date().getFullYear(), 2, 15); // March 15 for corporations, April 15 for others
    if (business.entityType === "Corporation" || business.entityType === "Professional Corporation") {
      events.push({
        eventType: "tax_filing",
        eventTitle: "Corporate Tax Return (Form 1120)",
        eventDescription: "File your corporate tax return with the IRS.",
        dueDate: taxDeadline,
        priority: "high",
        category: "tax",
        isRecurring: true,
        recurringInterval: "annual",
        reminderConfig: {
          reminderDays: [60, 30, 14, 7, 1],
          notificationMethods: ["email", "dashboard"],
        },
      });
    }

    // BOIR filing (if applicable)
    const boirDeadline = new Date(new Date().getFullYear() + 1, 0, 1); // January 1 next year
    events.push({
      eventType: "boir_filing",
      eventTitle: "Beneficial Ownership Information Report",
      eventDescription: "File your BOIR with FinCEN as required by the Corporate Transparency Act.",
      dueDate: boirDeadline,
      priority: "high",
      category: "compliance",
      isRecurring: true,
      recurringInterval: "annual",
      reminderConfig: {
        reminderDays: [90, 60, 30, 14, 7, 1],
        notificationMethods: ["email", "dashboard"],
      },
    });

    // Registered agent annual verification
    const agentVerificationDate = addYears(business.createdAt || new Date(), 1);
    events.push({
      eventType: "registered_agent_verification",
      eventTitle: "Registered Agent Verification",
      eventDescription: "Verify your registered agent information is current and accurate.",
      dueDate: agentVerificationDate,
      priority: "medium",
      category: "compliance",
      isRecurring: true,
      recurringInterval: "annual",
      reminderConfig: {
        reminderDays: [30, 14, 7],
        notificationMethods: ["email", "dashboard"],
      },
    });

    await this.scheduleComplianceReminders(businessEntityId, events);
  }

  // Calculate annual report due date based on state
  private calculateAnnualReportDueDate(state: string, entityType: string): Date | null {
    const currentYear = new Date().getFullYear();
    
    // State-specific annual report due dates
    const stateDueDates: Record<string, { month: number; day: number }> = {
      CA: { month: 1, day: 31 }, // January 31
      DE: { month: 2, day: 28 }, // February 28
      FL: { month: 4, day: 30 }, // April 30
      TX: { month: 4, day: 15 }, // April 15
      NY: { month: 3, day: 15 }, // March 15
      // Add more states as needed
    };

    const dueDate = stateDueDates[state];
    if (!dueDate) return null;

    return new Date(currentYear, dueDate.month - 1, dueDate.day);
  }

  // Generate notification title
  private generateNotificationTitle(eventTitle: string, daysUntilDue: number): string {
    if (daysUntilDue === 0) {
      return `⚠️ DUE TODAY: ${eventTitle}`;
    } else if (daysUntilDue === 1) {
      return `🔔 Due Tomorrow: ${eventTitle}`;
    } else if (daysUntilDue <= 7) {
      return `⏰ Due in ${daysUntilDue} days: ${eventTitle}`;
    } else {
      return `📅 Upcoming: ${eventTitle} (${daysUntilDue} days)`;
    }
  }

  // Generate notification message
  private generateNotificationMessage(
    event: ComplianceEvent,
    daysUntilDue: number,
    businessName: string
  ): string {
    const urgencyText = daysUntilDue <= 7 ? "URGENT: " : "";
    const dueDateText = format(event.dueDate, "MMMM d, yyyy");
    
    return `${urgencyText}${event.eventTitle} for ${businessName} is due on ${dueDateText} (${daysUntilDue} days from now).

${event.eventDescription}

Priority: ${event.priority.toUpperCase()}
Category: ${event.category}

Please ensure you complete this requirement on time to maintain your business compliance.`;
  }

  // Generate email template
  private generateEmailTemplate(notification: any, business: any, calendar: any): string {
    const dueDateFormatted = format(new Date(calendar.dueDate), "MMMM d, yyyy");
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${notification.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF5A00; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .priority-high { border-left: 4px solid #dc3545; padding-left: 15px; }
        .priority-medium { border-left: 4px solid #ffc107; padding-left: 15px; }
        .priority-low { border-left: 4px solid #28a745; padding-left: 15px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .button { display: inline-block; background: #FF5A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ParaFort Compliance Reminder</h1>
        </div>
        
        <div class="content">
          <div class="priority-${calendar.priority}">
            <h2>${notification.title}</h2>
            <p><strong>Business:</strong> ${business.name}</p>
            <p><strong>Due Date:</strong> ${dueDateFormatted}</p>
            <p><strong>Category:</strong> ${calendar.category}</p>
            <p><strong>Priority:</strong> ${calendar.priority.toUpperCase()}</p>
          </div>
          
          <h3>Description:</h3>
          <p>${calendar.eventDescription}</p>
          
          <p>Please log into your ParaFort dashboard to manage this compliance requirement.</p>
          
          <a href="${process.env.CLIENT_URL || 'https://your-domain.com'}/dashboard" class="button">
            View Dashboard
          </a>
        </div>
        
        <div class="footer">
          <p>This is an automated reminder from ParaFort. If you have questions, please contact support.</p>
        </div>
      </div>
    </body>
    </html>`;
  }

  // Get upcoming compliance events for a business
  async getUpcomingComplianceEvents(businessEntityId: number, days: number = 90): Promise<any[]> {
    const futureDate = addDays(new Date(), days);
    
    return await db
      .select()
      .from(complianceCalendar)
      .where(
        and(
          eq(complianceCalendar.businessEntityId, businessEntityId),
          gte(complianceCalendar.dueDate, new Date()),
          lte(complianceCalendar.dueDate, futureDate),
          eq(complianceCalendar.status, "pending")
        )
      )
      .orderBy(asc(complianceCalendar.dueDate));
  }

  // Get dashboard notifications for a business
  async getDashboardNotifications(businessEntityId: number): Promise<any[]> {
    return await db
      .select({
        notification: complianceNotifications,
        calendar: complianceCalendar,
      })
      .from(complianceNotifications)
      .leftJoin(complianceCalendar, eq(complianceNotifications.complianceCalendarId, complianceCalendar.id))
      .where(
        and(
          eq(complianceNotifications.businessEntityId, businessEntityId),
          eq(complianceNotifications.notificationType, "dashboard"),
          gte(complianceNotifications.scheduledDate, addDays(new Date(), -30)) // Last 30 days
        )
      )
      .orderBy(desc(complianceNotifications.scheduledDate));
  }

  // Mark compliance event as completed
  async markComplianceEventCompleted(calendarId: number): Promise<void> {
    await db
      .update(complianceCalendar)
      .set({ 
        status: "completed", 
        completedDate: new Date() 
      })
      .where(eq(complianceCalendar.id, calendarId));

    // Cancel any pending notifications for this event
    await db
      .update(complianceNotifications)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(complianceNotifications.complianceCalendarId, calendarId),
          eq(complianceNotifications.status, "pending")
        )
      );
  }

  // Create recurring events for next period
  async createRecurringEvents(): Promise<void> {
    const completedRecurringEvents = await db
      .select()
      .from(complianceCalendar)
      .where(
        and(
          eq(complianceCalendar.status, "completed"),
          eq(complianceCalendar.isRecurring, true)
        )
      );

    for (const event of completedRecurringEvents) {
      if (!event.recurringInterval) continue;

      let nextDueDate: Date;
      switch (event.recurringInterval) {
        case "annual":
          nextDueDate = addYears(event.dueDate, 1);
          break;
        case "quarterly":
          nextDueDate = addMonths(event.dueDate, 3);
          break;
        case "monthly":
          nextDueDate = addMonths(event.dueDate, 1);
          break;
        default:
          continue;
      }

      // Check if next occurrence already exists
      const existingEvent = await db
        .select()
        .from(complianceCalendar)
        .where(
          and(
            eq(complianceCalendar.businessEntityId, event.businessEntityId),
            eq(complianceCalendar.eventType, event.eventType),
            eq(complianceCalendar.dueDate, nextDueDate)
          )
        )
        .then(results => results[0]);

      if (!existingEvent) {
        const reminderDates = JSON.parse(event.reminderDates || "[]").map((date: string) => 
          addYears(new Date(date), 1)
        );

        await db.insert(complianceCalendar).values({
          businessEntityId: event.businessEntityId,
          eventType: event.eventType,
          eventTitle: event.eventTitle,
          eventDescription: event.eventDescription,
          dueDate: nextDueDate,
          reminderDates: JSON.stringify(reminderDates),
          isRecurring: event.isRecurring,
          recurringInterval: event.recurringInterval,
          status: "pending",
          priority: event.priority,
          category: event.category,
        });
      }
    }
  }
}

export const complianceReminderService = new ComplianceReminderService();