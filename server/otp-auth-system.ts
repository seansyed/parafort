import express from "express";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, emailVerifications } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import nodemailer from "nodemailer";
import { emailService } from "./emailService";
import "./session-types";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendProductionOTP(email: string, otp: string): Promise<boolean> {
  try {
    console.log(`=== PRODUCTION OTP SEND ===`);
    console.log(`Target: ${email}`);
    console.log(`OTP: ${otp}`);
    
    // Create transporter with production-tested configuration
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
        rejectUnauthorized: false
      }
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #34de73; margin: 0;">ParaFort</h1>
          <p style="color: #666; margin: 5px 0;">Business Compliance Platform</p>
        </div>
        
        <h2 style="color: #333; text-align: center;">Your Verification Code</h2>
        
        <div style="background: #f8f9fa; border: 2px dashed #34de73; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 32px; font-weight: bold; color: #34de73; margin: 0; letter-spacing: 3px;">${otp}</h1>
        </div>
        
        <p style="color: #666; text-align: center; margin: 20px 0;">
          Enter this 6-digit code to complete your authentication.
        </p>
        
        <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
          This code expires in 10 minutes. If you didn't request this code, please ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <div style="text-align: center; color: #666; font-size: 12px;">
          <p><strong>ParaFort Business Services</strong></p>
          <p>Phone: (844) 444-5411 | Email: support@parafort.com</p>
          <p>Website: <a href="https://parafort.com" style="color: #34de73;">parafort.com</a></p>
          <p style="margin-top: 15px; color: #999;">
            This email was sent to ${email}. ParaFort is a registered business formation and compliance service provider.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.OUTLOOK_FROM_EMAIL,
      to: email,
      subject: 'ParaFort - Your Verification Code',
      html,
      text: `Your ParaFort verification code is: ${otp}. This code expires in 10 minutes.`
    };

    console.log('Sending OTP email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`=== OTP EMAIL SUCCESS ===`);
    console.log(`Message ID: ${result.messageId}`);
    console.log(`Response: ${result.response}`);
    
    return true;
    
  } catch (error: any) {
    console.error('=== OTP EMAIL FAILURE ===');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    return false;
  }
}

export function setupOTPAuth(app: express.Application) {
  
  // Step 1: Request registration OTP
  app.post("/api/auth/request-registration", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store verification request
      await db.insert(emailVerifications).values({
        email,
        otp,
        otpExpiry,
        type: 'registration',
        verified: false
      });
      
      // Store user data temporarily in session
      req.session.pendingRegistration = {
        email,
        password: await bcrypt.hash(password, 12),
        firstName,
        lastName
      };
      
      // Send OTP email with error handling
      const emailSent = await sendProductionOTP(email, otp);
      
      if (!emailSent) {
        console.error("Failed to send OTP email to:", email);
        return res.status(500).json({ 
          error: "Failed to send verification code. Please check your email address and try again." 
        });
      }
      
      res.json({ 
        message: "Verification code sent to your email",
        requiresOTP: true 
      });
      
    } catch (error) {
      console.error("Registration request error:", error);
      res.status(500).json({ error: "Failed to send verification code. Please try again." });
    }
  });
  
  // Step 2: Verify OTP and complete registration
  app.post("/api/auth/verify-registration", async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }
      
      if (!req.session.pendingRegistration || req.session.pendingRegistration.email !== email) {
        return res.status(400).json({ error: "No pending registration for this email" });
      }
      
      // Verify OTP
      const [verification] = await db.select()
        .from(emailVerifications)
        .where(
          and(
            eq(emailVerifications.email, email),
            eq(emailVerifications.otp, otp),
            eq(emailVerifications.type, 'registration'),
            eq(emailVerifications.verified, false),
            gt(emailVerifications.otpExpiry, new Date())
          )
        );
      
      if (!verification) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }
      
      // Mark verification as used
      await db.update(emailVerifications)
        .set({ verified: true })
        .where(eq(emailVerifications.id, verification.id));
      
      // Create user account
      const { email: userEmail, password, firstName, lastName } = req.session.pendingRegistration;
      
      const [newUser] = await db.insert(users).values({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userEmail,
        password,
        firstName,
        lastName,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      // Clear pending registration
      delete req.session.pendingRegistration;
      
      // Set session
      req.session.userId = newUser.id;
      req.session.user = {
        id: newUser.id,
        email: newUser.email!,
        firstName: newUser.firstName!,
        lastName: newUser.lastName!,
        isEmailVerified: true
      };
      
      res.json({ 
        message: "Registration completed successfully",
        user: req.session.user
      });
      
    } catch (error) {
      console.error("Registration verification error:", error);
      res.status(500).json({ error: "Registration verification failed" });
    }
  });
  
  // NOTE: /api/auth/request-login endpoint moved to otp-routes.ts with proper password validation
  // This duplicate insecure endpoint has been removed to prevent security vulnerabilities
  
  // Step 2: Verify OTP and complete login
  app.post("/api/auth/verify-login", async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }
      
      if (!req.session.pendingLogin) {
        return res.status(400).json({ error: "No pending login session" });
      }
      
      // Verify OTP
      const [verification] = await db.select()
        .from(emailVerifications)
        .where(
          and(
            eq(emailVerifications.email, email),
            eq(emailVerifications.otp, otp),
            eq(emailVerifications.type, 'login'),
            eq(emailVerifications.verified, false),
            gt(emailVerifications.otpExpiry, new Date())
          )
        );
      
      if (!verification) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }
      
      // Get user
      const [user] = await db.select().from(users).where(eq(users.id, req.session.pendingLogin));
      
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      
      // Mark verification as used
      await db.update(emailVerifications)
        .set({ verified: true })
        .where(eq(emailVerifications.id, verification.id));
      
      // Clear pending login
      delete req.session.pendingLogin;
      
      // Set session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        isEmailVerified: user.isEmailVerified || false
      };
      
      res.json({ 
        message: "Login successful",
        user: req.session.user
      });
      
    } catch (error) {
      console.error("Login verification error:", error);
      res.status(500).json({ error: "Login verification failed" });
    }
  });
  
  // Get current user (updated to handle admin sessions)
  app.get("/api/auth/user", (req, res) => {
    if (!req.session.userId || !req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Include role information for admin users
    const userData = {
      ...req.session.user,
      role: req.session.adminRole || req.session.user.role || 'client',
      isAdmin: !!req.session.isAdmin
    };
    
    res.json(userData);
  });
  
  // Logout (unchanged)
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });
  
  // Resend OTP
  app.post("/api/auth/resend-otp", async (req, res) => {
    try {
      const { email, type } = req.body;
      
      if (!email || !type) {
        return res.status(400).json({ error: "Email and type are required" });
      }
      
      // Validate session based on type
      if (type === 'registration' && (!req.session.pendingRegistration || req.session.pendingRegistration.email !== email)) {
        return res.status(400).json({ error: "No pending registration for this email" });
      }
      
      if (type === 'login' && !req.session.pendingLogin) {
        return res.status(400).json({ error: "No pending login session" });
      }
      
      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      
      // Store new verification request
      await db.insert(emailVerifications).values({
        userId: type === 'login' ? req.session.pendingLogin : undefined,
        email,
        otp,
        otpExpiry,
        type,
        verified: false
      });
      
      // Send OTP email with error handling
      const emailSent = await sendProductionOTP(email, otp);
      
      if (!emailSent) {
        console.error("Failed to send resend OTP email to:", email);
        return res.status(500).json({ 
          error: "Failed to send verification code. Please check your email address and try again." 
        });
      }
      
      res.json({ message: "New verification code sent" });
      
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({ error: "Failed to resend verification code" });
    }
  });

  // Admin Login - Send OTP
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Check if user exists and has admin role
      const [user] = await db.select().from(users).where(eq(users.email, email));
      
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      
      // Check if user has admin or super_admin role
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return res.status(403).json({ error: "Access denied. Admin privileges required." });
      }
      
      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store verification request
      await db.insert(emailVerifications).values({
        userId: user.id,
        email: user.email!,
        otp,
        otpExpiry,
        type: 'admin_login',
        verified: false
      });
      
      // Store pending admin login
      req.session.pendingAdminLogin = user.email!;
      
      // Send OTP email with error handling
      const emailSent = await sendProductionOTP(user.email!, otp);
      
      if (!emailSent) {
        console.error("Failed to send admin OTP email to:", user.email);
        return res.status(500).json({ 
          error: "Failed to send verification code. Please check your email address and try again." 
        });
      }
      
      res.json({ 
        message: "Admin verification code sent to your email",
        email: user.email
      });
      
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Admin login failed" });
    }
  });

  // Admin Login - Verify OTP
  app.post("/api/admin/verify-login", async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and verification code are required" });
      }
      
      if (!req.session.pendingAdminLogin) {
        return res.status(400).json({ error: "No pending admin login session" });
      }
      
      // Verify OTP
      const [verification] = await db.select()
        .from(emailVerifications)
        .where(
          and(
            eq(emailVerifications.email, email),
            eq(emailVerifications.otp, otp),
            eq(emailVerifications.type, 'admin_login'),
            eq(emailVerifications.verified, false),
            gt(emailVerifications.otpExpiry, new Date())
          )
        );
      
      if (!verification) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }
      
      // Get admin user by email (session stores email for admin login)
      const pendingEmail = req.session.pendingAdminLogin;
      if (!pendingEmail) {
        return res.status(400).json({ error: "No pending admin login found" });
      }
      
      const [user] = await db.select().from(users).where(eq(users.email, pendingEmail));
      
      if (!user) {
        return res.status(400).json({ error: "Admin user not found" });
      }
      
      // Double-check admin role
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return res.status(403).json({ error: "Access denied. Admin privileges required." });
      }
      
      // Mark verification as used
      await db.update(emailVerifications)
        .set({ verified: true })
        .where(eq(emailVerifications.id, verification.id));
      
      // Clear pending admin login
      delete req.session.pendingAdminLogin;
      
      // Set admin session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        isEmailVerified: user.isEmailVerified || false,
        role: user.role
      };
      req.session.isAdmin = true;
      req.session.adminRole = user.role;
      
      res.json({ 
        message: "Admin login successful",
        user: req.session.user,
        role: user.role
      });
      
    } catch (error) {
      console.error("Admin login verification error:", error);
      res.status(500).json({ error: "Admin login verification failed" });
    }
  });

  // Get current admin user
  app.get("/api/admin/user", (req, res) => {
    if (!req.session.userId || !req.session.user || !req.session.isAdmin) {
      return res.status(401).json({ error: "Not authenticated as admin" });
    }
    
    res.json({ 
      user: req.session.user,
      role: req.session.adminRole
    });
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Admin logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Admin logout successful" });
    });
  });
}