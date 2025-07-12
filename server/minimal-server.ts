import express from "express";
import nodemailer from "nodemailer";

// Direct SMTP implementation for production email delivery
async function sendProductionOTP(email: string, otp: string): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.OUTLOOK_FROM_EMAIL,
        pass: process.env.OUTLOOK_SMTP_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

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

    await transporter.sendMail({
      from: process.env.OUTLOOK_FROM_EMAIL,
      to: email,
      subject: 'ParaFort Verification Code',
      html,
    });

    return true;
  } catch (error) {
    console.error('Production OTP email error:', error);
    return false;
  }
}

const app = express();
app.use(express.json());

// Test email endpoint
app.post('/api/test-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Testing OTP email service for:', email);
    
    // Generate test OTP
    const testCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send OTP email
    const emailSent = await sendProductionOTP(email, testCode);
    
    if (emailSent) {
      console.log('✅ OTP email sent successfully to:', email);
      res.json({ 
        success: true, 
        message: 'OTP email sent successfully',
        code: testCode
      });
    } else {
      console.error('❌ Failed to send OTP email to:', email);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send OTP email' 
      });
    }
  } catch (error) {
    console.error('OTP email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'OTP email service error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});