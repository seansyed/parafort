import nodeCron from 'node-cron';
import { complianceMongooseService } from './compliance-mongoose-service';
import { mongoDb } from './mongoose-db';
import { ComplianceEvent, Business } from '../shared/mongoose-schemas';
import { notificationService } from './notificationService';
import { emailService } from './emailService';

export class ComplianceNotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Ensure MongoDB connection
      await mongoDb.connect();

      // Schedule daily compliance check at 9:00 AM
      nodeCron.schedule('0 9 * * *', async () => {
        console.log('Running daily compliance check...');
        await this.processComplianceReminders();
      }, {
        timezone: 'America/New_York'
      });

      // Schedule weekly compliance reports on Mondays at 8:00 AM
      nodeCron.schedule('0 8 * * 1', async () => {
        console.log('Running weekly compliance report...');
        await this.generateWeeklyComplianceReport();
      }, {
        timezone: 'America/New_York'
      });

      // Schedule monthly recurring event generation on the 1st at 6:00 AM
      nodeCron.schedule('0 6 1 * *', async () => {
        console.log('Generating monthly recurring events...');
        await complianceMongooseService.generateRecurringEvents();
      }, {
        timezone: 'America/New_York'
      });

      // Schedule overdue event updates every hour
      nodeCron.schedule('0 * * * *', async () => {
        console.log('Updating overdue compliance events...');
        await complianceMongooseService.updateOverdueEvents();
      });

      this.isInitialized = true;
      console.log('Compliance notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize compliance notification service:', error);
    }
  }

  /**
   * Process compliance reminders for events that need notifications
   */
  async processComplianceReminders() {
    try {
      const eventsNeedingReminders = await complianceMongooseService.getEventsNeedingReminders();
      
      if (eventsNeedingReminders.length === 0) {
        console.log('No compliance events need reminders at this time');
        return;
      }

      console.log(`Processing ${eventsNeedingReminders.length} compliance reminders`);

      for (const event of eventsNeedingReminders) {
        await this.sendComplianceReminder(event);
        await complianceMongooseService.markReminderSent(event._id.toString());
      }

      console.log(`Sent ${eventsNeedingReminders.length} compliance reminders`);
    } catch (error) {
      console.error('Error processing compliance reminders:', error);
    }
  }

  /**
   * Send a compliance reminder for a specific event
   */
  private async sendComplianceReminder(event: any) {
    try {
      // Get business details
      const business = await Business.findById(event.businessId);
      if (!business) {
        console.error(`Business not found for event ${event._id}`);
        return;
      }

      const daysUntilDue = Math.ceil((new Date(event.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      let urgencyLevel = 'medium';
      let subject = '';
      
      if (daysUntilDue <= 7) {
        urgencyLevel = 'high';
        subject = `🚨 URGENT: ${event.title} Due in ${daysUntilDue} Day${daysUntilDue !== 1 ? 's' : ''}`;
      } else if (daysUntilDue <= 30) {
        urgencyLevel = 'medium';
        subject = `⚠️ Reminder: ${event.title} Due in ${daysUntilDue} Days`;
      } else {
        urgencyLevel = 'low';
        subject = `📅 Upcoming: ${event.title} Due in ${daysUntilDue} Days`;
      }

      // Create in-app notification
      await notificationService.createNotification({
        userId: business.userId.toString(),
        type: 'compliance_reminder',
        category: 'compliance',
        title: subject,
        message: `${event.description} for ${business.legalName}`,
        priority: urgencyLevel as 'high' | 'medium' | 'low',
        metadata: {
          eventId: event._id.toString(),
          businessId: business._id.toString(),
          dueDate: event.dueDate,
          category: event.category,
          estimatedCost: event.estimatedCost
        }
      });

      // Send email notification
      const emailContent = this.generateReminderEmailContent(event, business, daysUntilDue);
      
      try {
        await emailService.sendEmail({
          to: business.contactEmail || 'admin@parafort.com', // Fallback to admin if no business email
          subject,
          html: emailContent,
          priority: urgencyLevel === 'high' ? 'high' : 'normal'
        });
      } catch (emailError) {
        console.error('Failed to send email reminder:', emailError);
        // Continue processing even if email fails
      }

      console.log(`Sent compliance reminder for ${event.title} (${business.legalName})`);
    } catch (error) {
      console.error(`Error sending compliance reminder for event ${event._id}:`, error);
    }
  }

  /**
   * Generate HTML email content for compliance reminder
   */
  private generateReminderEmailContent(event: any, business: any, daysUntilDue: number): string {
    const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const urgencyColor = daysUntilDue <= 7 ? '#dc2626' : daysUntilDue <= 30 ? '#f59e0b' : '#3b82f6';
    const urgencyText = daysUntilDue <= 7 ? 'URGENT' : daysUntilDue <= 30 ? 'IMPORTANT' : 'UPCOMING';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compliance Reminder - ${event.title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FF5A00 0%, #FF7A33 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">ParaFort Compliance Alert</h1>
                <p style="color: #FFE5D6; margin: 10px 0 0 0; font-size: 16px;">${urgencyText} Compliance Filing Due</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
                <!-- Urgency Banner -->
                <div style="background-color: ${urgencyColor}15; border-left: 4px solid ${urgencyColor}; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                    <p style="margin: 0; color: ${urgencyColor}; font-weight: bold; font-size: 14px;">
                        ⏰ ${urgencyText}: Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}
                    </p>
                </div>

                <!-- Event Details -->
                <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">${event.title}</h2>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 30%;">Business:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${business.legalName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Due Date:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${formatDate(event.dueDate)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Category:</td>
                            <td style="padding: 8px 0; color: #1f2937;">${event.category}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Priority:</td>
                            <td style="padding: 8px 0; color: ${urgencyColor}; font-weight: 600;">${event.priority}</td>
                        </tr>
                        ${event.estimatedCost ? `
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Est. Cost:</td>
                            <td style="padding: 8px 0; color: #1f2937;">$${event.estimatedCost}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>

                <!-- Description -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">Description:</h3>
                    <p style="color: #4b5563; line-height: 1.6; margin: 0;">${event.description}</p>
                </div>

                <!-- Action Buttons -->
                <div style="text-align: center; margin: 30px 0;">
                    ${event.filingLink ? `
                    <a href="${event.filingLink}" style="display: inline-block; background-color: #FF5A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 10px;">
                        File Now
                    </a>
                    ` : ''}
                    <a href="https://parafort.com/compliance-dashboard" style="display: inline-block; background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 10px;">
                        View Dashboard
                    </a>
                </div>

                <!-- Help Section -->
                <div style="background-color: #eff6ff; padding: 20px; border-radius: 6px; margin-top: 25px;">
                    <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">Need Help?</h3>
                    <p style="color: #1e40af; margin: 0; line-height: 1.5;">
                        Our compliance experts are here to assist you. Contact us at 
                        <a href="mailto:compliance@parafort.com" style="color: #1e40af; font-weight: 600;">compliance@parafort.com</a> 
                        or call (555) 123-4567.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    © 2025 ParaFort. All rights reserved.<br>
                    <a href="https://parafort.com/unsubscribe" style="color: #6b7280;">Unsubscribe</a> | 
                    <a href="https://parafort.com/privacy" style="color: #6b7280;">Privacy Policy</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate weekly compliance report for admin
   */
  async generateWeeklyComplianceReport() {
    try {
      const dashboardData = await complianceMongooseService.getComplianceDashboardData('admin');
      
      // Create admin notification
      await notificationService.createNotification({
        userId: 'admin',
        type: 'compliance_report',
        category: 'system',
        title: 'Weekly Compliance Report',
        message: `This week: ${dashboardData.upcomingEvents} upcoming, ${dashboardData.overdueEvents} overdue events`,
        priority: 'medium',
        metadata: dashboardData
      });

      console.log('Weekly compliance report generated');
    } catch (error) {
      console.error('Error generating weekly compliance report:', error);
    }
  }

  /**
   * Send immediate compliance alert for urgent events
   */
  async sendUrgentComplianceAlert(eventId: string) {
    try {
      const event = await ComplianceEvent.findById(eventId).populate('businessId');
      if (!event) return;

      const business = event.businessId as any;
      const daysUntilDue = Math.ceil((new Date(event.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDue <= 3) {
        await this.sendComplianceReminder(event);
        await complianceMongooseService.markReminderSent(eventId);
      }
    } catch (error) {
      console.error('Error sending urgent compliance alert:', error);
    }
  }

  /**
   * Get compliance notification statistics
   */
  async getNotificationStatistics() {
    try {
      const totalEvents = await ComplianceEvent.countDocuments();
      const upcomingEvents = await ComplianceEvent.countDocuments({ status: 'Upcoming' });
      const overdueEvents = await ComplianceEvent.countDocuments({ status: 'Overdue' });
      const eventsNeedingReminders = await complianceMongooseService.getEventsNeedingReminders();

      return {
        totalEvents,
        upcomingEvents,
        overdueEvents,
        eventsNeedingReminders: eventsNeedingReminders.length,
        lastProcessed: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting notification statistics:', error);
      return null;
    }
  }

  /**
   * Manually trigger compliance reminder processing (for testing)
   */
  async triggerManualReminderProcessing() {
    console.log('Manually triggering compliance reminder processing...');
    await this.processComplianceReminders();
  }
}

export const complianceNotificationService = new ComplianceNotificationService();