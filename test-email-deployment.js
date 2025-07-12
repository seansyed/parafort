import nodemailer from 'nodemailer';

async function testEmailConfiguration() {
  console.log('Testing email configuration...');
  
  // Check environment variables
  console.log('OUTLOOK_FROM_EMAIL:', process.env.OUTLOOK_FROM_EMAIL ? 'SET' : 'NOT SET');
  console.log('OUTLOOK_SMTP_PASSWORD:', process.env.OUTLOOK_SMTP_PASSWORD ? 'SET' : 'NOT SET');
  
  if (!process.env.OUTLOOK_FROM_EMAIL || !process.env.OUTLOOK_SMTP_PASSWORD) {
    console.error('❌ Missing email credentials');
    return;
  }

  // Create transporter with detailed logging
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_FROM_EMAIL,
      pass: process.env.OUTLOOK_SMTP_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
    debug: true,
    logger: true
  });

  try {
    // Test connection
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');

    // Test sending actual email
    console.log('Sending test email...');
    const testEmail = {
      from: process.env.OUTLOOK_FROM_EMAIL,
      to: process.env.OUTLOOK_FROM_EMAIL, // Send to self for testing
      subject: 'ParaFort Email Service Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #34de73; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">ParaFort Email Test</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>This is a test email from the deployed ParaFort application.</p>
            <p><strong>Test Code:</strong> 123456</p>
            <p>If you receive this email, the email service is working correctly.</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);

  } catch (error) {
    console.error('❌ Email service error:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
  }
}

testEmailConfiguration();