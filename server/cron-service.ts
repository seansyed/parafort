import cron from 'node-cron';
import nodemailer from 'nodemailer';

// Email configuration using environment variables
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_FROM_EMAIL,
      pass: process.env.OUTLOOK_SMTP_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
};

// Generate professional email template for compliance reminders
const generateEmailTemplate = (event: any, userInfo: any, businessInfo: any, daysUntilDue: number) => {
  const dueDate = new Date(event.dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const urgencyLevel = daysUntilDue <= 7 ? 'URGENT' : daysUntilDue <= 14 ? 'Important' : 'Upcoming';
  const urgencyColor = daysUntilDue <= 7 ? '#dc2626' : daysUntilDue <= 14 ? '#ea580c' : '#2563eb';

  const subject = `${urgencyLevel}: ${event.title} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;

  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">ParaFort Compliance Alert</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Business Compliance Management</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <div style="background-color: ${urgencyColor}; color: white; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
          <h2 style="margin: 0; font-size: 18px;">${urgencyLevel} Compliance Reminder</h2>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${userInfo.firstName || 'Business Owner'},</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          This is a friendly reminder that you have an upcoming compliance requirement for <strong>${businessInfo.legalName}</strong>.
        </p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid ${urgencyColor}; margin: 25px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937;">${event.title}</h3>
          <p style="margin: 5px 0;"><strong>Due Date:</strong> ${dueDate}</p>
          <p style="margin: 5px 0;"><strong>Days Remaining:</strong> ${daysUntilDue}</p>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${event.category}</p>
          ${event.description ? `<p style="margin: 15px 0 5px 0;"><strong>Description:</strong></p><p style="margin: 5px 0;">${event.description}</p>` : ''}
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ Action Required</p>
          <p style="margin: 10px 0 0 0; color: #92400e;">Please ensure this compliance requirement is completed before the due date to avoid potential penalties or legal issues.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://your-domain.com'}/compliance" 
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Compliance Dashboard
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 30px;">
          If you have any questions or need assistance with this compliance requirement, please don't hesitate to contact our support team.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Best regards,</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;"><strong>ParaFort Compliance Team</strong></p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
          This is an automated compliance reminder. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
  
  return { subject, body };
};

// Fetch user and business information from your actual database
const getUserAndBusinessInfo = async (businessEntityId: string) => {
  try {
    const { db } = await import('./db.js');
    const { businessEntities, users } = await import('../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    
    // Get business entity information
    const businessResult = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, parseInt(businessEntityId)))
      .limit(1);
    
    if (!businessResult.length) {
      console.warn(`Business entity not found: ${businessEntityId}`);
      return null;
    }
    
    const business = businessResult[0];
    
    // Get user information based on userId from business entity
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, business.userId))
      .limit(1);
    
    if (!userResult.length) {
      console.warn(`User not found for business: ${businessEntityId}`);
      return null;
    }
    
    const user = userResult[0];
    
    return {
      userInfo: {
        firstName: user.firstName || 'Business Owner',
        lastName: user.lastName || '',
        email: user.email
      },
      businessInfo: {
        legalName: business.legalName,
        entityType: business.entityType,
        stateOfIncorporation: business.stateOfIncorporation
      }
    };
  } catch (error) {
    console.error('Error fetching user and business info:', error);
    return null;
  }
};

// Main function to process compliance reminders
const processComplianceReminders = async () => {
  try {
    console.log('🔄 Processing compliance reminders...');
    
    const transporter = createEmailTransporter();
    const reminderIntervals = [30, 14, 7, 1]; // Days before due date
    const currentDate = new Date();
    
    let totalEmailsSent = 0;
    
    // Import database and schema
    const { db } = await import('./db.js');
    const { complianceCalendar } = await import('../shared/schema.js');
    const { and, eq, gte, lte, lt, or, isNull } = await import('drizzle-orm');
    
    for (const interval of reminderIntervals) {
      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() + interval);
      
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
      
      // Query for compliance events due in X days
      const events = await db
        .select()
        .from(complianceCalendar)
        .where(
          and(
            gte(complianceCalendar.dueDate, startOfDay),
            lte(complianceCalendar.dueDate, endOfDay),
            eq(complianceCalendar.status, 'Upcoming')
          )
        );
      
      console.log(`📅 Found ${events.length} events due in ${interval} days`);
      
      for (const event of events) {
        try {
          const daysUntilDue = Math.ceil((event.dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Skip if reminder already sent for this interval
          const lastReminderDate = event.lastReminderSent ? new Date(event.lastReminderSent) : null;
          if (lastReminderDate) {
            const daysSinceLastReminder = Math.floor((currentDate.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceLastReminder < 1) {
              console.log(`⏭️ Skipping ${event.title} - reminder sent recently`);
              continue;
            }
          }
          
          // Get user and business information
          const info = await getUserAndBusinessInfo(event.businessEntityId);
          
          if (!info || !info.userInfo.email) {
            console.warn(`⚠️ No email found for event: ${event.title}`);
            continue;
          }
          
          // Generate email content
          const { subject, body } = generateEmailTemplate(
            event, 
            info.userInfo, 
            info.businessInfo, 
            daysUntilDue
          );
          
          // Send email
          const mailOptions = {
            from: `"ParaFort Compliance" <${process.env.OUTLOOK_FROM_EMAIL}>`,
            to: info.userInfo.email,
            subject: subject,
            html: body
          };
          
          await transporter.sendMail(mailOptions);
          
          // Update reminder count and last sent date using Drizzle
          const { eq } = await import('drizzle-orm');
          await db
            .update(complianceCalendar)
            .set({
              remindersSent: (event.remindersSent || 0) + 1,
              lastReminderSent: new Date()
            })
            .where(eq(complianceCalendar.id, event.id));
          
          totalEmailsSent++;
          console.log(`✅ Sent reminder for: ${event.title} (${daysUntilDue} days) to ${info.userInfo.email}`);
          
          // Small delay to avoid overwhelming email server
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (emailError) {
          console.error(`❌ Failed to send reminder for event ${event.title}:`, emailError);
        }
      }
    }
    
    console.log(`📊 Compliance reminder processing complete. Total emails sent: ${totalEmailsSent}`);
    
  } catch (error) {
    console.error('❌ Fatal error in compliance reminder service:', error);
  }
};

// Test function for immediate execution
const testComplianceReminders = async () => {
  console.log('🧪 Running compliance reminder test...');
  await processComplianceReminders();
};

// Variable to track cron job
let reminderJob: any = null;

// Schedule the cron job to run daily at 8:00 AM
const startComplianceReminderService = () => {
  console.log('🚀 Starting Compliance Reminder Service...');
  
  // Run daily at 8:00 AM (0 8 * * *)
  reminderJob = cron.schedule('0 8 * * *', () => {
    console.log('⏰ Daily compliance reminder job triggered at', new Date().toISOString());
    processComplianceReminders();
  }, {
    scheduled: true,
    timezone: "America/New_York" // Adjust timezone as needed
  });
  
  console.log('✅ Compliance reminder service scheduled to run daily at 8:00 AM EST');
  
  // Optional: Run immediately on startup for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Development mode: Running initial check in 10 seconds...');
    setTimeout(() => {
      processComplianceReminders();
    }, 10000);
  }
};

// Track cron job status
let cronJobStatus = {
  isRunning: false,
  lastRun: null,
  nextRun: null,
  schedule: '0 8 * * *', // Daily at 8:00 AM
  status: 'stopped'
};

// Get cron job status for monitoring
const getCronStatus = () => {
  return {
    ...cronJobStatus,
    currentTime: new Date().toISOString()
  };
};

export {
  startComplianceReminderService,
  testComplianceReminders,
  processComplianceReminders,
  getCronStatus
};