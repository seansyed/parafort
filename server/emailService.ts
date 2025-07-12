import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface OrderConfirmationData {
  orderId: string;
  businessName: string;
  entityType: string;
  state: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  paymentIntentId: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private getEmailSignature(): string {
    return `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
        <div style="margin-bottom: 15px;">
          <strong style="color: #333;">ParaFort LLC</strong><br>
          Phone: 844-444-5411<br>
          Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
          Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
        </div>
        <div style="margin-bottom: 15px;">
          <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
          <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
        </div>
        <div style="font-size: 11px; color: #888; line-height: 1.4;">
          This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
        </div>
      </div>
    `;
  }

  private initializeTransporter() {
    const smtpHost = 'smtp-mail.outlook.com';
    const smtpPort = 587;
    const fromEmail = process.env.OUTLOOK_FROM_EMAIL;
    const password = process.env.OUTLOOK_SMTP_PASSWORD;

    console.log('Initializing email transporter...');
    console.log('Email:', fromEmail ? 'configured' : 'missing');
    console.log('Password:', password ? 'configured' : 'missing');

    if (!fromEmail || !password) {
      console.warn('Outlook SMTP credentials not configured - email sending disabled');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: fromEmail,
          pass: password,
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });
      
      console.log('Email transporter initialized successfully');
    } catch (error) {
      console.error('Error initializing email transporter:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email transporter not available - email not sent');
      console.log(`Would send email to: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.OUTLOOK_FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
    console.log('sendOrderConfirmation called with data:', {
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      businessName: data.businessName
    });

    if (!this.transporter) {
      console.error('Email transporter not initialized - cannot send emails');
      return false;
    }

    const customerEmailHtml = this.generateCustomerConfirmationEmail(data);
    const adminEmailHtml = this.generateAdminNotificationEmail(data);

    console.log('Attempting to send customer confirmation email...');
    // Send customer confirmation
    const customerEmailSent = await this.sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.businessName} Formation`,
      html: customerEmailHtml,
    });

    console.log('Customer email sent:', customerEmailSent);

    console.log('Attempting to send admin notification email...');
    // Send admin notification
    const adminEmailSent = await this.sendEmail({
      to: process.env.OUTLOOK_FROM_EMAIL || 'admin@parafort.com',
      subject: `New Formation Order - ${data.businessName}`,
      html: adminEmailHtml,
    });

    console.log('Admin email sent:', adminEmailSent);

    const allEmailsSent = customerEmailSent && adminEmailSent;
    console.log('All emails sent successfully:', allEmailsSent);
    
    return allEmailsSent;
  }

  private generateCustomerConfirmationEmail(data: OrderConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #FF5A00; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { padding: 20px; text-align: center; color: #666; }
          .button { background: #FF5A00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Your business formation order has been received!</p>
          </div>
          
          <div class="content">
            <h2>Thank you for choosing ParaFort!</h2>
            <p>Dear ${data.customerName},</p>
            <p>We've successfully received your order for business formation services. Our team will begin processing your request immediately.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Business Name:</strong> ${data.businessName}</p>
              <p><strong>Entity Type:</strong> ${data.entityType}</p>
              <p><strong>State:</strong> ${data.state}</p>
              <p><strong>Total Amount:</strong> $${data.amount.toFixed(2)}</p>
              <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
            </div>
            
            <h3>What Happens Next?</h3>
            <ol>
              <li><strong>Processing Your Filing:</strong> We'll prepare and submit your formation documents to the state within 1-2 business days.</li>
              <li><strong>State Review:</strong> The state will review your application. Processing typically takes 5-15 business days.</li>
              <li><strong>Documents Delivered:</strong> Once approved, we'll send your official formation documents and EIN confirmation.</li>
            </ol>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://your-domain.com/dashboard" class="button">View Your Dashboard</a>
            </p>
          </div>
          
          <div class="footer">
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">ParaFort LLC</strong><br>
                Phone: 844-444-5411<br>
                Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
                Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
              </div>
              <div style="margin-bottom: 15px;">
                <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
              </div>
              <div style="font-size: 11px; color: #888; line-height: 1.4;">
                This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminNotificationEmail(data: OrderConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .alert { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Formation Order</h1>
            <p>Action Required - New Business Formation</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚠️ Action Required:</strong> A new business formation order has been placed and requires processing.
            </div>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
              <p><strong>Business Name:</strong> ${data.businessName}</p>
              <p><strong>Entity Type:</strong> ${data.entityType}</p>
              <p><strong>State:</strong> ${data.state}</p>
              <p><strong>Amount Paid:</strong> $${data.amount.toFixed(2)}</p>
              <p><strong>Payment ID:</strong> ${data.paymentIntentId}</p>
              <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <h3>Next Steps</h3>
            <ol>
              <li>Review order details in the admin dashboard</li>
              <li>Prepare formation documents</li>
              <li>Submit to state within 1-2 business days</li>
              <li>Update customer on filing status</li>
            </ol>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">ParaFort LLC</strong><br>
                Phone: 844-444-5411<br>
                Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
                Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
              </div>
              <div style="margin-bottom: 15px;">
                <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
              </div>
              <div style="font-size: 11px; color: #888; line-height: 1.4;">
                This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(customerEmail: string, customerName: string): Promise<boolean> {
    const welcomeEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #FF5A00; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { background: #FF5A00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ParaFort!</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${customerName}!</h2>
            <p>Welcome to ParaFort! Your account has been successfully created.</p>
            <p>You now have access to our comprehensive business formation and compliance platform.</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://your-domain.com/dashboard" class="button">Access Your Dashboard</a>
            </p>
            
            <p>If you have any questions, our support team is here to help.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">ParaFort LLC</strong><br>
                Phone: 844-444-5411<br>
                Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
                Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
              </div>
              <div style="margin-bottom: 15px;">
                <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
              </div>
              <div style="font-size: 11px; color: #888; line-height: 1.4;">
                This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: customerEmail,
      subject: 'Welcome to ParaFort!',
      html: welcomeEmailHtml,
    });
  }

  async sendServiceOrderConfirmation(orderData: any): Promise<boolean> {
    const serviceOrderHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #FF5A00; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .service-item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: #FF5A00; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Service Order Confirmation</h1>
            <p>Order #${orderData.orderId}</p>
          </div>
          
          <div class="content">
            <h2>Thank you for your order, ${orderData.customerName}!</h2>
            <p>We've received your service order and our team will begin processing it shortly.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Business:</strong> ${orderData.businessName}</p>
              <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
              
              <h4>Services Ordered:</h4>
              ${orderData.services.map((service: any) => `
                <div class="service-item">
                  <span>${service.name}</span>
                  <span style="float: right;">$${service.price}</span>
                </div>
              `).join('')}
              
              <div class="total" style="text-align: right; margin-top: 15px;">
                Total: $${parseFloat(orderData.totalAmount).toFixed(2)}
              </div>
            </div>
            
            <h3>What's Next?</h3>
            <ol>
              <li>Our team will review your order within 24 hours</li>
              <li>We'll contact you to arrange payment and gather any additional information</li>
              <li>Once payment is processed, we'll begin working on your services</li>
              <li>You'll receive regular updates via email</li>
            </ol>
            
            <p>If you have any questions, please contact us or reply to this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">ParaFort LLC</strong><br>
                Phone: 844-444-5411<br>
                Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
                Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
              </div>
              <div style="margin-bottom: 15px;">
                <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
              </div>
              <div style="font-size: 11px; color: #888; line-height: 1.4;">
                This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: orderData.customerEmail,
      subject: `Service Order Confirmation - ${orderData.orderId}`,
      html: serviceOrderHtml,
    });
  }

  async sendAdminServiceOrderNotification(orderData: any): Promise<boolean> {
    const adminNotificationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #FF5A00; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .alert { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .service-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Service Order</h1>
            <p>Action Required - Service Order Processing</p>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚠️ Action Required:</strong> A new service order has been placed and requires processing.
            </div>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Customer:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
              <p><strong>Business:</strong> ${orderData.businessName}</p>
              <p><strong>Total Amount:</strong> $${parseFloat(orderData.totalAmount).toFixed(2)}</p>
              <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
              
              <h4>Services Ordered:</h4>
              ${orderData.services.map((service: any) => `
                <div class="service-item">
                  <span>${service.name}</span>
                  <span style="float: right;">$${service.price}</span>
                </div>
              `).join('')}
            </div>
            
            <h3>Next Steps</h3>
            <ol>
              <li>Review order details in the admin dashboard</li>
              <li>Contact customer to arrange payment</li>
              <li>Begin processing services once payment is confirmed</li>
              <li>Update customer on service progress</li>
            </ol>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">ParaFort LLC</strong><br>
                Phone: 844-444-5411<br>
                Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
                Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
              </div>
              <div style="margin-bottom: 15px;">
                <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
              </div>
              <div style="font-size: 11px; color: #888; line-height: 1.4;">
                This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin email - you'll need to configure this
    const adminEmail = process.env.ADMIN_EMAIL || process.env.OUTLOOK_FROM_EMAIL;
    if (!adminEmail) {
      console.log('No admin email configured for notifications');
      return false;
    }

    return await this.sendEmail({
      to: adminEmail,
      subject: `New Service Order - ${orderData.orderId}`,
      html: adminNotificationHtml,
    });
  }

  async sendPriorityNotification(userId: string, title: string, message: string, priority: string): Promise<boolean> {
    try {
      const { users } = await import('../shared/schema');
      const { db } = await import('./db');
      const { eq } = await import('drizzle-orm');
      
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user?.email) {
        throw new Error('User email not found');
      }

      const priorityColors: { [key: string]: string } = {
        critical: '#FF4444',
        high: '#FF8800',
        normal: '#0066CC',
        low: '#888888'
      };

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: linear-gradient(135deg, #FF5A00, #FF8800); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">ParaFort Notification</h1>
            <div style="background: ${priorityColors[priority] || '#0066CC'}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 10px; font-weight: bold; text-transform: uppercase;">
              ${priority} Priority
            </div>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">${message}</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This is a ${priority} priority notification from your ParaFort business management platform.
              </p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'https://parafort.com'}" 
                 style="background: #FF5A00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Dashboard
              </a>
            </div>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">ParaFort LLC</strong><br>
              Phone: 844-444-5411<br>
              Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
              Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
            </div>
            <div style="margin-bottom: 15px;">
              <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
              <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
            </div>
            <div style="font-size: 11px; color: #888; line-height: 1.4;">
              This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
            </div>
          </div>
        </div>
      `;

      await this.sendEmail({
        to: user.email,
        subject: `[${priority.toUpperCase()}] ${title}`,
        text: message,
        html: emailContent
      });

      return true;
    } catch (error) {
      console.error('Error sending priority notification:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetCode: string): Promise<boolean> {
    console.log(`Attempting to send password reset email to: ${email}`);

    if (!this.transporter) {
      console.log('Email transporter not available - simulating password reset email');
      console.log(`=== PASSWORD RESET CODE FOR ${email}: ${resetCode} ===`);
      console.log(`Use this code in the forgot password form to complete the reset process.`);
      return true; // Return true in development to simulate success
    }

    const mailOptions = {
      from: process.env.OUTLOOK_FROM_EMAIL,
      to: email,
      subject: 'ParaFort - Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #34de73 0%, #2bb564 100%); color: white; padding: 20px; text-align: center;">
            <h1>Password Reset</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h2>Reset Your Password</h2>
            <p>You requested a password reset for your ParaFort account. Use the code below to reset your password:</p>
            <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px solid #34de73;">
              <h1 style="color: #34de73; font-size: 32px; margin: 0; letter-spacing: 4px;">${resetCode}</h1>
            </div>
            <p><strong>This code will expire in 15 minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email or contact our support team.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">ParaFort LLC</strong><br>
                Phone: 844-444-5411<br>
                Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
                Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
              </div>
              <div style="margin-bottom: 15px;">
                <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
              </div>
              <div style="font-size: 11px; color: #888; line-height: 1.4;">
                This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
              </div>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  async sendDocumentUploadNotification(userId: string, documentName: string, businessName: string): Promise<boolean> {
    // Get user's email from database
    const { users } = await import('../shared/schema');
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user || !user.email) {
      console.log('No email found for user:', userId);
      return false;
    }

    const documentNotificationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #FF5A00; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .document-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { padding: 20px; text-align: center; color: #666; }
          .button { background: #FF5A00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Document Available</h1>
            <p>A document has been uploaded to your account</p>
          </div>
          
          <div class="content">
            <h2>Hello ${user.firstName || 'Valued Client'}!</h2>
            <p>We've uploaded a new document to your ParaFort account.</p>
            
            <div class="document-details">
              <h3>Document Details</h3>
              <p><strong>Document Name:</strong> ${documentName}</p>
              <p><strong>Business:</strong> ${businessName}</p>
              <p><strong>Upload Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>You can access this document by logging into your ParaFort dashboard.</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://your-domain.com/dashboard" class="button">View Document</a>
            </p>
            
            <p>If you have any questions about this document, please contact our support team.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-family: Arial, sans-serif; font-size: 12px; color: #666;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #333;">ParaFort LLC</strong><br>
                Phone: 844-444-5411<br>
                Help Center: <a href="https://help.parafort.com/en" style="color: #34de73;">https://help.parafort.com/en</a><br>
                Website: <a href="https://www.parafort.com" style="color: #34de73;">www.parafort.com</a>
              </div>
              <div style="margin-bottom: 15px;">
                <a href="https://www.parafort.com/privacy" style="color: #34de73; text-decoration: none;">Privacy Policy</a> | 
                <a href="https://www.parafort.com/terms" style="color: #34de73; text-decoration: none;">Terms & Conditions</a>
              </div>
              <div style="font-size: 11px; color: #888; line-height: 1.4;">
                This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete all copies. Unauthorized use, disclosure, or copying of this email or its attachments is strictly prohibited. ParaFort LLC is not liable for any direct, indirect, or consequential damages resulting from the use of this email or its contents.
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>ParaFort - Intelligent Business Entity Formation Platform</p>
            <p>&copy; 2025 ParaFort. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: `New Document Available - ${documentName}`,
      html: documentNotificationHtml,
    });
  }
}

export const emailService = new EmailService();