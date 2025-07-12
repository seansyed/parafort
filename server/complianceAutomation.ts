import cron from "node-cron";
import { db } from "./db";
import { 
  complianceCalendar, 
  businessEntities, 
  users, 
  userNotificationPreferences,
  notifications 
} from "@shared/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { addDays, addMonths, addYears, format, startOfDay, endOfDay } from "date-fns";
import nodemailer from "nodemailer";

interface ComplianceTemplate {
  eventType: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  isRecurring: boolean;
  recurringInterval?: string;
  daysBeforeDue?: number;
  entityTypes?: string[];
  states?: string[];
}

// Compliance event templates based on business entity types and states
const COMPLIANCE_TEMPLATES: ComplianceTemplate[] = [
  // Federal Requirements (All Entities)
  {
    eventType: "tax_filing",
    title: "Annual Income Tax Return Filing",
    description: "File federal income tax return for your business entity",
    category: "tax",
    priority: "high",
    isRecurring: true,
    recurringInterval: "yearly",
    daysBeforeDue: 30,
    entityTypes: ["LLC", "Corporation", "S-Corp", "C-Corp"]
  },
  {
    eventType: "quarterly_taxes",
    title: "Quarterly Estimated Tax Payment",
    description: "Submit quarterly estimated tax payments to IRS",
    category: "tax",
    priority: "high",
    isRecurring: true,
    recurringInterval: "quarterly",
    daysBeforeDue: 7,
    entityTypes: ["LLC", "Corporation", "S-Corp", "C-Corp"]
  },
  {
    eventType: "boir_filing",
    title: "Beneficial Ownership Information Report",
    description: "File BOIR with FinCEN as required by Corporate Transparency Act",
    category: "compliance",
    priority: "high",
    isRecurring: false,
    daysBeforeDue: 30,
    entityTypes: ["LLC", "Corporation", "S-Corp", "C-Corp"]
  },
  
  // State-Specific Requirements
  {
    eventType: "annual_report",
    title: "Annual Report Filing",
    description: "File annual report with Secretary of State",
    category: "state_filing",
    priority: "high",
    isRecurring: true,
    recurringInterval: "yearly",
    daysBeforeDue: 14,
    entityTypes: ["LLC", "Corporation", "S-Corp", "C-Corp"],
    states: ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"]
  },
  {
    eventType: "franchise_tax",
    title: "Franchise Tax Payment",
    description: "Pay state franchise tax to maintain good standing",
    category: "tax",
    priority: "high",
    isRecurring: true,
    recurringInterval: "yearly",
    daysBeforeDue: 14,
    entityTypes: ["LLC", "Corporation", "S-Corp", "C-Corp"],
    states: ["CA", "TX", "DE", "NY"]
  },
  {
    eventType: "business_license_renewal",
    title: "Business License Renewal",
    description: "Renew business license with local authorities",
    category: "licensing",
    priority: "medium",
    isRecurring: true,
    recurringInterval: "yearly",
    daysBeforeDue: 30,
    entityTypes: ["LLC", "Corporation", "S-Corp", "C-Corp"]
  },
  
  // California Specific
  {
    eventType: "ca_llc_fee",
    title: "California LLC Annual Fee",
    description: "Pay California LLC annual fee to Franchise Tax Board",
    category: "tax",
    priority: "high",
    isRecurring: true,
    recurringInterval: "yearly",
    daysBeforeDue: 14,
    entityTypes: ["LLC"],
    states: ["CA"]
  },
  {
    eventType: "ca_statement_of_information",
    title: "California Statement of Information",
    description: "File Statement of Information with California Secretary of State",
    category: "state_filing",
    priority: "high",
    isRecurring: true,
    recurringInterval: "biennial",
    daysBeforeDue: 14,
    entityTypes: ["LLC", "Corporation"],
    states: ["CA"]
  }
];

class ComplianceAutomationService {
  private emailTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeEmailTransporter();
    this.startScheduledJobs();
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

  // Generate compliance events for a new business entity
  async generateComplianceEventsForBusiness(businessId: string): Promise<void> {
    try {
      console.log(`Starting compliance event generation for business ID: ${businessId}`);
      
      const business = await db
        .select()
        .from(businessEntities)
        .where(eq(businessEntities.id, businessId))
        .limit(1);

      console.log(`Business query result:`, business);

      if (!business[0]) {
        console.error(`Business entity not found for ID: ${businessId}`);
        throw new Error("Business entity not found");
      }

      const entity = business[0];
      console.log(`Found business entity:`, {
        id: entity.id,
        name: entity.name,
        entityType: entity.entityType,
        state: entity.state,
        filedDate: entity.filedDate
      });

      const currentYear = new Date().getFullYear();
      const events: any[] = [];

      console.log(`Checking ${COMPLIANCE_TEMPLATES.length} templates...`);

      for (const template of COMPLIANCE_TEMPLATES) {
        console.log(`Checking template: ${template.title} for entity type: ${entity.entityType}, state: ${entity.state}`);
        
        // Check if template applies to this entity type
        if (template.entityTypes && !template.entityTypes.includes(entity.entityType)) {
          console.log(`Template ${template.title} skipped - entity type mismatch`);
          continue;
        }

        // Check if template applies to this state
        if (template.states && !template.states.includes(entity.state)) {
          console.log(`Template ${template.title} skipped - state mismatch`);
          continue;
        }

        console.log(`Template ${template.title} matches - generating events`);

        const baseDate = entity.filedDate || new Date();
        const dueDates = this.calculateDueDates(template, baseDate, currentYear);

        console.log(`Generated ${dueDates.length} due dates for template ${template.title}:`, dueDates);

        for (const dueDate of dueDates) {
          const event = {
            businessEntityId: businessId,
            eventType: template.eventType,
            eventTitle: template.title,
            eventDescription: template.description,
            dueDate: dueDate,
            status: "pending",
            priority: template.priority,
            category: template.category,
            isRecurring: template.isRecurring,
            recurringInterval: template.recurringInterval,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          console.log(`Adding event:`, event);
          events.push(event);
        }
      }

      console.log(`Total events to insert: ${events.length}`);

      if (events.length > 0) {
        console.log(`Inserting ${events.length} events into database...`);
        const result = await db.insert(complianceCalendar).values(events);
        console.log(`Database insert result:`, result);
      } else {
        console.log(`No events generated - no matching templates found`);
      }

      console.log(`Completed compliance event generation for business ID ${businessId} - Generated ${events.length} events`);
    } catch (error) {
      console.error("Error generating compliance events:", error);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }

  private calculateDueDates(template: ComplianceTemplate, baseDate: Date, currentYear: number): Date[] {
    const dates: Date[] = [];
    
    switch (template.eventType) {
      case "quarterly_taxes":
        // Q1: April 15, Q2: June 15, Q3: September 15, Q4: January 15 (next year)
        dates.push(
          new Date(currentYear, 3, 15), // April 15
          new Date(currentYear, 5, 15), // June 15
          new Date(currentYear, 8, 15), // September 15
          new Date(currentYear + 1, 0, 15) // January 15 next year
        );
        break;
        
      case "annual_report":
        // Most states require annual reports by end of anniversary month
        const anniversaryMonth = baseDate.getMonth();
        const lastDayOfMonth = new Date(currentYear, anniversaryMonth + 1, 0).getDate();
        dates.push(new Date(currentYear, anniversaryMonth, lastDayOfMonth));
        break;
        
      case "ca_llc_fee":
        // California LLC fee due by 15th day of 4th month (April 15)
        dates.push(new Date(currentYear, 3, 15));
        break;
        
      case "ca_statement_of_information":
        // Due during anniversary month (biennial for LLCs, biennial for Corps)
        const statementMonth = baseDate.getMonth();
        dates.push(new Date(currentYear, statementMonth, 1));
        if (template.recurringInterval === "biennial") {
          dates.push(new Date(currentYear + 2, statementMonth, 1));
        }
        break;
        
      case "franchise_tax":
        // Typically due by March 15 for most states
        dates.push(new Date(currentYear, 2, 15));
        break;
        
      case "annual_income_tax":
        // Corporate tax returns typically due March 15, some extensions to September 15
        dates.push(new Date(currentYear, 2, 15));
        break;
        
      case "boir_filing":
        // BOIR due within 90 days of entity formation or by January 1, 2025 for existing entities
        const boirDeadline = new Date(Math.max(
          addDays(baseDate, 90).getTime(),
          new Date(2025, 0, 1).getTime()
        ));
        dates.push(boirDeadline);
        break;
        
      default:
        // Default: one year from base date
        dates.push(addYears(baseDate, 1));
        break;
    }
    
    return dates.filter(date => date > new Date()); // Only future dates
  }

  // Check for upcoming deadlines and send reminders
  async checkAndSendReminders(): Promise<void> {
    try {
      const now = new Date();
      const thirtyDaysFromNow = addDays(now, 30);
      const sevenDaysFromNow = addDays(now, 7);
      const tomorrow = addDays(now, 1);

      // Get upcoming events within 30 days
      const upcomingEvents = await db
        .select({
          id: complianceCalendar.id,
          businessEntityId: complianceCalendar.businessEntityId,
          eventType: complianceCalendar.eventType,
          eventTitle: complianceCalendar.eventTitle,
          eventDescription: complianceCalendar.eventDescription,
          dueDate: complianceCalendar.dueDate,
          priority: complianceCalendar.priority,
          businessName: businessEntities.name,
          businessEntityType: businessEntities.entityType,
          userId: businessEntities.userId,
          userEmail: users.email,
          userFirstName: users.firstName,
          userLastName: users.lastName
        })
        .from(complianceCalendar)
        .innerJoin(businessEntities, eq(complianceCalendar.businessEntityId, businessEntities.id))
        .innerJoin(users, eq(businessEntities.userId, users.id))
        .where(
          and(
            eq(complianceCalendar.status, "pending"),
            gte(complianceCalendar.dueDate, now),
            lte(complianceCalendar.dueDate, thirtyDaysFromNow)
          )
        )
        .orderBy(asc(complianceCalendar.dueDate));

      for (const event of upcomingEvents) {
        const daysUntilDue = Math.ceil((event.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Determine if we should send a reminder based on urgency
        let shouldSend = false;
        let urgencyLevel = "info";
        
        if (daysUntilDue <= 1) {
          shouldSend = true;
          urgencyLevel = "urgent";
        } else if (daysUntilDue <= 7 && event.priority === "high") {
          shouldSend = true;
          urgencyLevel = "high";
        } else if (daysUntilDue <= 14 && event.priority === "high") {
          shouldSend = true;
          urgencyLevel = "medium";
        } else if (daysUntilDue <= 30) {
          shouldSend = true;
          urgencyLevel = "low";
        }

        if (shouldSend) {
          await this.sendComplianceReminder(event, daysUntilDue, urgencyLevel);
          await this.createInAppNotification(event, daysUntilDue, urgencyLevel);
        }
      }

      console.log(`Processed ${upcomingEvents.length} upcoming compliance events`);
    } catch (error) {
      console.error("Error checking compliance reminders:", error);
    }
  }

  private async sendComplianceReminder(event: any, daysUntilDue: number, urgencyLevel: string): Promise<void> {
    if (!this.emailTransporter || !event.userEmail) return;

    const subject = `${urgencyLevel === "urgent" ? "URGENT: " : ""}Compliance Reminder: ${event.eventTitle}`;
    const dueText = daysUntilDue === 0 ? "today" : 
                   daysUntilDue === 1 ? "tomorrow" : 
                   `in ${daysUntilDue} days`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FF5A00; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">ParaFort Compliance Alert</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: ${urgencyLevel === "urgent" ? "#dc2626" : "#FF5A00"};">
            ${event.eventTitle} Due ${dueText.charAt(0).toUpperCase() + dueText.slice(1)}
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Business:</strong> ${event.businessName} (${event.businessEntityType})</p>
            <p><strong>Due Date:</strong> ${format(event.dueDate, "MMMM d, yyyy")}</p>
            <p><strong>Priority:</strong> ${event.priority.toUpperCase()}</p>
            <p><strong>Description:</strong> ${event.eventDescription}</p>
          </div>
          
          ${urgencyLevel === "urgent" ? 
            '<div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;"><p style="margin: 0; color: #dc2626;"><strong>Immediate Action Required!</strong> This compliance deadline is due very soon.</p></div>' :
            ''
          }
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-domain.com/compliance-dashboard" 
               style="background-color: #FF5A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Compliance Dashboard
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Stay compliant and avoid penalties. Log in to your ParaFort dashboard to track all your business obligations.
          </p>
        </div>
        
        <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© ParaFort - Business Formation & Compliance Management</p>
        </div>
      </div>
    `;

    try {
      await this.emailTransporter.sendMail({
        from: process.env.OUTLOOK_FROM_EMAIL,
        to: event.userEmail,
        subject: subject,
        html: htmlContent
      });

      console.log(`Compliance reminder sent to ${event.userEmail} for event: ${event.eventTitle}`);
    } catch (error) {
      console.error("Error sending compliance reminder email:", error);
    }
  }

  private async createInAppNotification(event: any, daysUntilDue: number, urgencyLevel: string): Promise<void> {
    try {
      const title = `Compliance Due: ${event.eventTitle}`;
      const message = `${event.businessName}: ${event.eventDescription}. Due ${daysUntilDue === 0 ? "today" : daysUntilDue === 1 ? "tomorrow" : `in ${daysUntilDue} days`}.`;

      await db.insert(notifications).values({
        userId: event.userId,
        type: "compliance_reminder",
        category: "compliance",
        title: title,
        message: message,
        priority: urgencyLevel === "urgent" ? "high" : event.priority,
        actionUrl: "/compliance-dashboard",
        isRead: false,
        createdAt: new Date()
      });

      console.log(`In-app notification created for user ${event.userId}`);
    } catch (error) {
      console.error("Error creating in-app notification:", error);
    }
  }

  // Start scheduled jobs for automated reminders
  private startScheduledJobs(): void {
    // Check for compliance reminders daily at 9 AM
    cron.schedule("0 9 * * *", async () => {
      console.log("Running daily compliance reminder check...");
      await this.checkAndSendReminders();
    });

    // Generate compliance events for new businesses (weekly on Sundays)
    cron.schedule("0 10 * * 0", async () => {
      console.log("Running weekly compliance event generation...");
      await this.generateEventsForNewBusinesses();
    });

    console.log("Compliance automation scheduled jobs started");
  }

  private async generateEventsForNewBusinesses(): Promise<void> {
    try {
      // Find businesses created in the last week that don't have compliance events
      const lastWeek = addDays(new Date(), -7);
      
      const newBusinesses = await db
        .select()
        .from(businessEntities)
        .where(gte(businessEntities.createdAt, lastWeek));

      for (const business of newBusinesses) {
        // Check if compliance events already exist
        const existingEvents = await db
          .select()
          .from(complianceCalendar)
          .where(eq(complianceCalendar.businessEntityId, business.id))
          .limit(1);

        if (existingEvents.length === 0) {
          await this.generateComplianceEventsForBusiness(business.id);
        }
      }
    } catch (error) {
      console.error("Error generating events for new businesses:", error);
    }
  }

  // Get upcoming compliance events for dashboard
  async getUpcomingComplianceEvents(businessId: string, days: number = 90): Promise<any[]> {
    try {
      const now = startOfDay(new Date());
      const futureDate = endOfDay(addDays(now, days));

      const events = await db
        .select()
        .from(complianceCalendar)
        .where(
          and(
            eq(complianceCalendar.businessEntityId, businessId),
            gte(complianceCalendar.dueDate, now),
            lte(complianceCalendar.dueDate, futureDate)
          )
        )
        .orderBy(asc(complianceCalendar.dueDate));

      return events;
    } catch (error) {
      console.error("Error fetching upcoming compliance events:", error);
      return [];
    }
  }

  // Get dashboard notifications for compliance
  async getDashboardNotifications(businessId: string): Promise<any[]> {
    try {
      const now = new Date();
      const thirtyDaysFromNow = addDays(now, 30);

      const events = await db
        .select()
        .from(complianceCalendar)
        .where(
          and(
            eq(complianceCalendar.businessEntityId, businessId),
            eq(complianceCalendar.status, "pending"),
            gte(complianceCalendar.dueDate, now),
            lte(complianceCalendar.dueDate, thirtyDaysFromNow)
          )
        )
        .orderBy(asc(complianceCalendar.dueDate));

      return events.map(event => {
        const daysUntilDue = Math.ceil((event.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...event,
          daysUntilDue,
          urgency: daysUntilDue <= 7 ? "high" : daysUntilDue <= 14 ? "medium" : "low"
        };
      });
    } catch (error) {
      console.error("Error fetching dashboard notifications:", error);
      return [];
    }
  }
}

// Export singleton instance
export const complianceReminderService = new ComplianceAutomationService();