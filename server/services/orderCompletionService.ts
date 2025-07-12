import { GoogleGenAI } from "@google/genai";
import { db } from "../db";
import { 
  formationOrders, 
  serviceOrders, 
  completionCertificates, 
  complianceDueDates, 
  orderWorkflows,
  notificationTemplates,
  users,
  businessEntities,
  userSubscriptions
} from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface OrderCompletionData {
  orderId: string;
  orderType: 'formation' | 'service';
  userId: string;
  businessName: string;
  entityType: string;
  state: string;
  customerEmail: string;
  customerName: string;
}

// State filing requirements and compliance data
const getStateFilingRequirements = (state: string, entityType: string) => {
  const requirements: { [key: string]: any } = {
    "Delaware": {
      "LLC": { frequency: "annual", dueDate: "June 1", fee: 300, description: "Annual franchise tax" },
      "Corporation": { frequency: "annual", dueDate: "March 1", fee: 175, description: "Annual franchise tax" },
      "S-Corporation": { frequency: "annual", dueDate: "March 1", fee: 175, description: "Annual franchise tax" },
      "C-Corporation": { frequency: "annual", dueDate: "March 1", fee: 175, description: "Annual franchise tax" }
    },
    "California": {
      "LLC": { frequency: "annual", dueDate: "Anniversary month", fee: 800, description: "Annual LLC tax and statement of information" },
      "Corporation": { frequency: "annual", dueDate: "Anniversary month", fee: 800, description: "Annual minimum tax and statement of information" },
      "S-Corporation": { frequency: "annual", dueDate: "March 15", fee: 800, description: "Annual minimum tax and statement of information" },
      "C-Corporation": { frequency: "annual", dueDate: "March 15", fee: 800, description: "Annual minimum tax and statement of information" }
    },
    "Nevada": {
      "LLC": { frequency: "annual", dueDate: "Last day of anniversary month", fee: 325, description: "Annual list of managers" },
      "Corporation": { frequency: "annual", dueDate: "Last day of anniversary month", fee: 325, description: "Annual list of officers" },
      "S-Corporation": { frequency: "annual", dueDate: "Last day of anniversary month", fee: 325, description: "Annual list of officers" },
      "C-Corporation": { frequency: "annual", dueDate: "Last day of anniversary month", fee: 325, description: "Annual list of officers" }
    },
    "Texas": {
      "LLC": { frequency: "none", description: "No annual filing required" },
      "Corporation": { frequency: "none", description: "No annual filing required" },
      "S-Corporation": { frequency: "none", description: "No annual filing required" },
      "C-Corporation": { frequency: "none", description: "No annual filing required" }
    },
    "Florida": {
      "LLC": { frequency: "annual", dueDate: "May 1", fee: 138.75, description: "Annual report" },
      "Corporation": { frequency: "annual", dueDate: "Anniversary month", fee: 150, description: "Annual report" },
      "S-Corporation": { frequency: "annual", dueDate: "Anniversary month", fee: 150, description: "Annual report" },
      "C-Corporation": { frequency: "annual", dueDate: "Anniversary month", fee: 150, description: "Annual report" }
    }
  };

  return requirements[state]?.[entityType] || { frequency: "annual", dueDate: "Anniversary month", fee: 0, description: "Annual filing requirements vary by state" };
};

export class OrderCompletionService {
  private emailTransporter: nodemailer.Transporter;

  constructor() {
    this.emailTransporter = nodemailer.createTransport({
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
  }

  async completeOrder(orderData: OrderCompletionData): Promise<void> {
    console.log(`🎉 Starting order completion process for ${orderData.orderId}`);

    try {
      // 0. Create business entity record (required for multi-business dashboard)
      await this.createBusinessEntity(orderData);

      // 1. Generate completion certificate
      await this.generateCompletionCertificate(orderData);

      // 2. Create compliance due dates using AI
      await this.createComplianceDueDates(orderData);

      // 3. Send completion email to customer
      await this.sendCompletionEmail(orderData);

      // 4. Set up automated follow-up workflows
      await this.setupFollowUpWorkflows(orderData);

      // 5. Create completion notifications
      await this.createCompletionNotifications(orderData);

      console.log(`✅ Order completion process finished for ${orderData.orderId}`);
    } catch (error) {
      console.error(`❌ Error completing order ${orderData.orderId}:`, error);
      throw error;
    }
  }

  async createBusinessEntity(orderData: OrderCompletionData): Promise<number> {
    console.log(`🏢 Creating business entity record for ${orderData.businessName}`);

    try {
      // Check the user's actual subscription plan from user_subscriptions
      let subscriptionPlanId = null;
      let subscriptionStatus = 'free';
      
      // Get the user's current active subscription
      const userSubscription = await db.select()
        .from(userSubscriptions)
        .where(and(
          eq(userSubscriptions.userId, orderData.userId),
          eq(userSubscriptions.status, 'active')
        ))
        .limit(1);
        
      if (userSubscription[0]) {
        subscriptionPlanId = userSubscription[0].planId;
        subscriptionStatus = 'active';
        console.log(`✅ User has active subscription: Plan ID ${subscriptionPlanId}`);
      } else {
        console.log(`ℹ️ User has no active subscription, defaulting to free plan`);
      }

      // Create business entity record (ID is auto-generated as integer)
      const newEntity = await db.insert(businessEntities).values({
        userId: orderData.userId,
        subscriptionPlanId: subscriptionPlanId,
        subscriptionStatus: subscriptionStatus,
        name: orderData.businessName,
        entityType: orderData.entityType,
        state: orderData.state,
        status: 'completed', // Order is completed, business is formed
        currentStep: 10, // All steps completed
        totalSteps: 10,
        createdAt: new Date()
      }).returning();

      const businessEntityId = newEntity[0]?.id;
      console.log(`✅ Business entity created: ID ${businessEntityId} for ${orderData.businessName}`);
      
      // Update the formation order to link it to the business entity
      if (orderData.orderType === 'formation') {
        await db.update(formationOrders)
          .set({ businessEntityId: businessEntityId.toString() })
          .where(eq(formationOrders.orderId, orderData.orderId));
        console.log(`✅ Formation order ${orderData.orderId} linked to business entity ${businessEntityId}`);
      }
      
      return businessEntityId;

    } catch (error) {
      console.error(`❌ Error creating business entity for ${orderData.businessName}:`, error);
      throw error;
    }
  }

  async generateCompletionCertificate(orderData: OrderCompletionData): Promise<string> {
    console.log(`📜 Generating completion certificate for ${orderData.businessName}`);

    try {
      // Create PDF certificate
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // Standard letter size
      const { width, height } = page.getSize();
      
      // Load fonts
      const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // ParaFort colors
      const parafortGreen = rgb(0.125, 0.875, 0.451); // #20df73
      const darkGray = rgb(0.2, 0.2, 0.2);
      
      // Header
      page.drawText('CERTIFICATE OF COMPLETION', {
        x: 50,
        y: height - 100,
        size: 28,
        font: titleFont,
        color: parafortGreen,
      });
      
      // ParaFort logo area
      page.drawRectangle({
        x: 450,
        y: height - 120,
        width: 120,
        height: 60,
        color: parafortGreen,
      });
      
      page.drawText('ParaFort', {
        x: 470,
        y: height - 95,
        size: 18,
        font: titleFont,
        color: rgb(1, 1, 1),
      });
      
      // Certificate content
      const currentDate = new Date().toLocaleDateString();
      const certificateText = [
        '',
        'This certifies that the business formation for:',
        '',
        `${orderData.businessName}`,
        '',
        `Entity Type: ${orderData.entityType}`,
        `State of Formation: ${orderData.state}`,
        `Order ID: ${orderData.orderId}`,
        '',
        'has been successfully completed by ParaFort Professional Services.',
        '',
        `Date of Completion: ${currentDate}`,
        '',
        'This certificate confirms that all required documentation has been',
        'filed with the appropriate state authorities and your business entity',
        'is now officially registered and in good standing.',
        '',
        'Important: Please retain this certificate for your business records.',
        'This document serves as proof of your successful business formation.',
      ];
      
      let yPosition = height - 180;
      certificateText.forEach((line, index) => {
        const isBusinessName = line === orderData.businessName;
        const isImportantInfo = line.includes('Entity Type:') || line.includes('State of:') || line.includes('Order ID:');
        
        page.drawText(line, {
          x: 80,
          y: yPosition,
          size: isBusinessName ? 20 : (isImportantInfo ? 14 : 12),
          font: isBusinessName || isImportantInfo ? titleFont : bodyFont,
          color: isBusinessName ? parafortGreen : darkGray,
        });
        yPosition -= isBusinessName ? 30 : (isImportantInfo ? 20 : 18);
      });
      
      // Footer
      page.drawText('ParaFort Professional Business Services', {
        x: 50,
        y: 100,
        size: 10,
        font: bodyFont,
        color: darkGray,
      });
      
      page.drawText('www.parafort.com | support@parafort.com | (844) 444-5411', {
        x: 50,
        y: 80,
        size: 10,
        font: bodyFont,
        color: darkGray,
      });
      
      // Save certificate
      const pdfBytes = await pdfDoc.save();
      const certificateFileName = `completion_certificate_${orderData.orderId}_${Date.now()}.pdf`;
      const certificatePath = path.join(process.cwd(), 'uploads', certificateFileName);
      
      await fs.writeFile(certificatePath, pdfBytes);
      
      // Save certificate record to database
      await db.insert(completionCertificates).values({
        orderId: orderData.orderId,
        orderType: orderData.orderType,
        certificateType: 'formation_completion',
        certificateUrl: `/uploads/${certificateFileName}`,
        certificateData: JSON.stringify({
          businessName: orderData.businessName,
          entityType: orderData.entityType,
          state: orderData.state,
          completionDate: currentDate,
          customerId: orderData.userId
        }),
      });
      
      console.log(`✅ Certificate generated: ${certificateFileName}`);
      return `/uploads/${certificateFileName}`;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  }

  async createComplianceDueDates(orderData: OrderCompletionData): Promise<void> {
    console.log(`📅 Creating compliance due dates for ${orderData.businessName} using AI`);

    try {
      // Use Gemini AI to get comprehensive compliance requirements
      const prompt = `
        As a business compliance expert, provide a comprehensive list of future compliance due dates for a ${orderData.entityType} formed in ${orderData.state}.
        
        Business Details:
        - Business Name: ${orderData.businessName}
        - Entity Type: ${orderData.entityType}
        - State: ${orderData.state}
        - Formation Date: ${new Date().toISOString().split('T')[0]}
        
        Please provide ALL applicable compliance requirements including:
        1. Annual reports/franchise taxes
        2. Tax filing deadlines
        3. License renewals
        4. State-specific filings
        5. Federal requirements
        
        Format as JSON array with this structure:
        [
          {
            "complianceType": "annual_report",
            "dueDate": "2025-03-01",
            "frequency": "annual",
            "description": "Annual franchise tax filing",
            "filingFee": 175,
            "notificationDays": 30
          }
        ]
        
        Include realistic due dates starting from 2025 and appropriate fees. Be comprehensive and accurate for ${orderData.state} state requirements.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const complianceData = JSON.parse(response.text || '[]');
      
      // Fallback compliance requirements if AI fails
      const fallbackRequirements = this.getFallbackComplianceRequirements(orderData);
      const finalRequirements = complianceData.length > 0 ? complianceData : fallbackRequirements;
      
      // Insert compliance due dates into database
      for (const requirement of finalRequirements) {
        await db.insert(complianceDueDates).values({
          userId: orderData.userId,
          orderId: orderData.orderId,
          businessName: orderData.businessName,
          entityType: orderData.entityType,
          state: orderData.state,
          complianceType: requirement.complianceType,
          dueDate: new Date(requirement.dueDate),
          frequency: requirement.frequency,
          description: requirement.description,
          filingFee: requirement.filingFee?.toString() || null,
          notificationDays: requirement.notificationDays || 30,
        });
      }
      
      console.log(`✅ Created ${finalRequirements.length} compliance due dates`);
    } catch (error) {
      console.error('Error creating compliance due dates:', error);
      // Create fallback requirements even if AI fails
      const fallbackRequirements = this.getFallbackComplianceRequirements(orderData);
      for (const requirement of fallbackRequirements) {
        await db.insert(complianceDueDates).values({
          userId: orderData.userId,
          orderId: orderData.orderId,
          businessName: orderData.businessName,
          entityType: orderData.entityType,
          state: orderData.state,
          complianceType: requirement.complianceType,
          dueDate: new Date(requirement.dueDate),
          frequency: requirement.frequency,
          description: requirement.description,
          filingFee: requirement.filingFee?.toString() || null,
          notificationDays: requirement.notificationDays || 30,
        });
      }
    }
  }

  private getFallbackComplianceRequirements(orderData: OrderCompletionData) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const stateReq = getStateFilingRequirements(orderData.state, orderData.entityType);
    
    const requirements = [];
    
    // Add state-specific annual filing if required
    if (stateReq.frequency !== 'none') {
      requirements.push({
        complianceType: 'annual_report',
        dueDate: `${nextYear}-06-01`, // Default to June 1st of next year
        frequency: 'annual',
        description: stateReq.description || 'Annual state filing requirement',
        filingFee: stateReq.fee || 0,
        notificationDays: 30
      });
    }
    
    // Add federal tax filing deadlines
    const taxDeadline = orderData.entityType.includes('Corporation') || orderData.entityType.includes('Corp') 
      ? `${nextYear}-03-15` 
      : `${nextYear}-04-15`;
      
    requirements.push({
      complianceType: 'tax_filing',
      dueDate: taxDeadline,
      frequency: 'annual',
      description: `Federal income tax return filing deadline`,
      filingFee: 0,
      notificationDays: 45
    });
    
    return requirements;
  }

  async sendCompletionEmail(orderData: OrderCompletionData): Promise<void> {
    console.log(`📧 Sending completion email to ${orderData.customerEmail}`);

    try {
      const certificateRecord = await db.select()
        .from(completionCertificates)
        .where(eq(completionCertificates.orderId, orderData.orderId))
        .limit(1);

      const certificateUrl = certificateRecord[0]?.certificateUrl || '';
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #34de73, #20df73); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .button { display: inline-block; background: #34de73; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
            .success-badge { background: #34de73; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Business Formation Complete!</h1>
            <div class="success-badge">✅ ORDER COMPLETED</div>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>Congratulations, ${orderData.customerName}!</h2>
              <p>Your business formation for <strong>${orderData.businessName}</strong> has been successfully completed.</p>
              
              <h3>Order Details:</h3>
              <ul>
                <li><strong>Business Name:</strong> ${orderData.businessName}</li>
                <li><strong>Entity Type:</strong> ${orderData.entityType}</li>
                <li><strong>State:</strong> ${orderData.state}</li>
                <li><strong>Order ID:</strong> ${orderData.orderId}</li>
                <li><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>
            
            <div class="section">
              <h3>📜 Your Completion Certificate</h3>
              <p>We've generated your official completion certificate. This document serves as proof that your business has been successfully formed and is in good standing.</p>
              ${certificateUrl ? `<a href="${process.env.BASE_URL || 'https://parafort.com'}${certificateUrl}" class="button">Download Certificate</a>` : ''}
            </div>
            
            <div class="section">
              <h3>📅 Important Upcoming Deadlines</h3>
              <p>We've automatically set up compliance tracking for your business. You'll receive reminders for:</p>
              <ul>
                <li>Annual state filing requirements</li>
                <li>Federal tax filing deadlines</li>
                <li>License renewals (if applicable)</li>
                <li>Other state-specific compliance requirements</li>
              </ul>
              <p>You can view all your upcoming deadlines in your <a href="${process.env.BASE_URL || 'https://parafort.com'}/client-dashboard" style="color: #34de73;">ParaFort Dashboard</a>.</p>
            </div>
            
            <div class="section">
              <h3>🚀 Next Steps</h3>
              <ol>
                <li><strong>Download your completion certificate</strong> and save it to your business records</li>
                <li><strong>Access your dashboard</strong> to view upcoming compliance deadlines</li>
                <li><strong>Consider additional services</strong> like EIN application, business banking, or ongoing compliance management</li>
                <li><strong>Stay informed</strong> - we'll send you automatic reminders for all important deadlines</li>
              </ol>
            </div>
            
            <div class="section">
              <h3>💼 Recommended Services</h3>
              <p>Now that your business is formed, consider these additional services:</p>
              <ul>
                <li><strong>EIN (Tax ID) Service</strong> - Required for business banking and taxes</li>
                <li><strong>Business Banking Setup</strong> - Open your business bank account</li>
                <li><strong>Registered Agent Service</strong> - Professional business address and mail handling</li>
                <li><strong>Ongoing Compliance Management</strong> - Never miss a deadline again</li>
              </ul>
              <a href="${process.env.BASE_URL || 'https://parafort.com'}/services-marketplace" class="button">Explore Services</a>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>ParaFort Professional Business Services</strong></p>
            <p>Phone: (844) 444-5411 | Email: support@parafort.com | Website: www.parafort.com</p>
            <p>This email was sent regarding your business formation order ${orderData.orderId}.</p>
            <p>© ${new Date().getFullYear()} ParaFort. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;

      await this.emailTransporter.sendMail({
        from: `"ParaFort Business Services" <${process.env.OUTLOOK_FROM_EMAIL}>`,
        to: orderData.customerEmail,
        subject: `🎉 Business Formation Complete - ${orderData.businessName} | Order ${orderData.orderId}`,
        html: htmlContent,
      });

      console.log(`✅ Completion email sent to ${orderData.customerEmail}`);
    } catch (error) {
      console.error('Error sending completion email:', error);
    }
  }

  async setupFollowUpWorkflows(orderData: OrderCompletionData): Promise<void> {
    console.log(`🔄 Setting up follow-up workflows for ${orderData.orderId}`);

    try {
      const workflows = [
        {
          workflowType: 'completion_email',
          scheduledAt: new Date(),
          workflowData: JSON.stringify({
            emailType: 'completion_confirmation',
            recipientEmail: orderData.customerEmail,
            businessName: orderData.businessName,
            orderId: orderData.orderId
          })
        },
        {
          workflowType: 'follow_up_sequence',
          scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
          workflowData: JSON.stringify({
            emailType: 'next_steps_reminder',
            recipientEmail: orderData.customerEmail,
            businessName: orderData.businessName,
            suggestions: ['EIN application', 'Business banking', 'Compliance calendar setup']
          })
        },
        {
          workflowType: 'compliance_reminder_setup',
          scheduledAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
          workflowData: JSON.stringify({
            emailType: 'compliance_calendar_intro',
            recipientEmail: orderData.customerEmail,
            businessName: orderData.businessName,
            entityType: orderData.entityType,
            state: orderData.state
          })
        }
      ];

      for (const workflow of workflows) {
        await db.insert(orderWorkflows).values({
          orderId: orderData.orderId,
          orderType: orderData.orderType,
          ...workflow,
        });
      }

      console.log(`✅ Created ${workflows.length} follow-up workflows`);
    } catch (error) {
      console.error('Error setting up workflows:', error);
    }
  }

  async createCompletionNotifications(orderData: OrderCompletionData): Promise<void> {
    console.log(`🔔 Creating completion notifications for ${orderData.orderId}`);

    try {
      // Create admin notification about completion
      const adminEmailContent = `
        <h2>Order Completion Notification</h2>
        <p>Order ${orderData.orderId} has been automatically marked as complete and all completion workflows have been executed.</p>
        
        <h3>Order Details:</h3>
        <ul>
          <li><strong>Business Name:</strong> ${orderData.businessName}</li>
          <li><strong>Entity Type:</strong> ${orderData.entityType}</li>
          <li><strong>State:</strong> ${orderData.state}</li>
          <li><strong>Customer:</strong> ${orderData.customerName} (${orderData.customerEmail})</li>
          <li><strong>Completion Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <h3>Automated Actions Completed:</h3>
        <ul>
          <li>✅ Completion certificate generated</li>
          <li>✅ Compliance due dates created</li>
          <li>✅ Customer completion email sent</li>
          <li>✅ Follow-up workflows scheduled</li>
        </ul>
        
        <p>No further action required - the system has handled all completion processes automatically.</p>
      `;

      await this.emailTransporter.sendMail({
        from: `"ParaFort System" <${process.env.OUTLOOK_FROM_EMAIL}>`,
        to: 'admin@parafort.com, support@parafort.com',
        subject: `✅ Order Completion Notification - ${orderData.businessName} | ${orderData.orderId}`,
        html: adminEmailContent,
      });

      console.log(`✅ Admin notification sent for order completion`);
    } catch (error) {
      console.error('Error creating completion notifications:', error);
    }
  }
}