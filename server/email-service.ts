import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log('🔧 Initializing EmailService with production configuration');
    console.log(`📧 SMTP User: ${process.env.OUTLOOK_FROM_EMAIL ? 'SET' : 'NOT SET'}`);
    console.log(`🔑 SMTP Password: ${process.env.OUTLOOK_SMTP_PASSWORD ? 'SET' : 'NOT SET'}`);
    
    // Enhanced production-ready configuration
    this.transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_FROM_EMAIL,
        pass: process.env.OUTLOOK_SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp-mail.outlook.com'
      },
      requireTLS: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      debug: process.env.NODE_ENV === 'production',
      logger: process.env.NODE_ENV === 'production'
    });

    // Test connection on startup with detailed logging
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP Connection Failed:', {
          error: error.message,
          code: error.code,
          command: error.command,
          response: error.response
        });
      } else {
        console.log('✅ SMTP Connection Verified Successfully');
        console.log('Production SMTP Config:', {
          host: 'smtp-mail.outlook.com',
          port: 587,
          userSet: !!process.env.OUTLOOK_FROM_EMAIL,
          passwordSet: !!process.env.OUTLOOK_SMTP_PASSWORD,
          environment: process.env.NODE_ENV
        });
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      console.log(`=== EMAIL SEND ATTEMPT ===`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Timestamp: ${new Date().toISOString()}`);
      
      // Validate credentials before attempting send
      if (!process.env.OUTLOOK_FROM_EMAIL || !process.env.OUTLOOK_SMTP_PASSWORD) {
        console.error('CRITICAL: Missing email credentials');
        console.error(`FROM_EMAIL: ${process.env.OUTLOOK_FROM_EMAIL ? 'SET' : 'MISSING'}`);
        console.error(`SMTP_PASSWORD: ${process.env.OUTLOOK_SMTP_PASSWORD ? 'SET' : 'MISSING'}`);
        return false;
      }
      
      const mailOptions = {
        from: options.from || process.env.OUTLOOK_FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        // Add additional delivery options for production reliability
        envelope: {
          from: process.env.OUTLOOK_FROM_EMAIL,
          to: options.to
        },
        // Force text alternative for better deliverability
        text: options.html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      };

      console.log(`Mail Options:`);
      console.log(`- From: ${mailOptions.from}`);
      console.log(`- To: ${mailOptions.to}`);
      console.log(`- Envelope From: ${mailOptions.envelope.from}`);
      console.log(`- Envelope To: ${mailOptions.envelope.to}`);
      
      // Attempt to send with comprehensive error handling
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`=== EMAIL SEND SUCCESS ===`);
      console.log(`Message ID: ${result.messageId}`);
      console.log(`Response: ${result.response}`);
      console.log(`Accepted: ${JSON.stringify(result.accepted)}`);
      console.log(`Rejected: ${JSON.stringify(result.rejected)}`);
      console.log(`Pending: ${JSON.stringify(result.pending)}`);
      console.log(`Envelope: ${JSON.stringify(result.envelope)}`);
      console.log(`=== EMAIL SEND COMPLETE ===`);
      
      // Check if email was actually accepted
      if (result.rejected && result.rejected.length > 0) {
        console.error('EMAIL REJECTED:', result.rejected);
        return false;
      }
      
      return true;
      
    } catch (error: any) {
      console.error('=== EMAIL SEND FAILURE ===');
      console.error(`Error Type: ${error.constructor.name}`);
      console.error(`Error Message: ${error.message}`);
      console.error(`Error Code: ${error.code}`);
      console.error(`Error Command: ${error.command}`);
      console.error(`Error Response: ${error.response}`);
      console.error(`Error ResponseCode: ${error.responseCode}`);
      console.error(`Error Stack: ${error.stack}`);
      
      // Specific error type handling
      if (error.code === 'EAUTH') {
        console.error('AUTHENTICATION FAILURE: Invalid credentials');
      } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
        console.error('CONNECTION FAILURE: Cannot reach SMTP server');
      } else if (error.code === 'EMESSAGE') {
        console.error('MESSAGE FAILURE: Invalid message format');
      } else {
        console.error('UNKNOWN FAILURE: Unexpected error type');
      }
      
      console.error('=== EMAIL FAILURE END ===');
      return false;
    }
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #34de73; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ParaFort Verification</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="color: #666; font-size: 16px;">Please use the following verification code to complete your login:</p>
          <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #34de73; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div style="background-color: #333; padding: 20px; text-align: center;">
          <p style="color: #ccc; font-size: 12px; margin: 0;">ParaFort Inc. | 9175 Elk Grove Florin Road, Ste 5, Elk Grove, CA 95624</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'ParaFort Verification Code',
      html,
    });
  }
}

export const emailService = new EmailService();