import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, emailVerifications } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
// Email functionality will be handled by nodemailer directly
import "./session-types";

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate verification token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function setupEmailAuth(app: express.Application) {
  
  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
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
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user (unverified)
      const [newUser] = await db.insert(users).values({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isEmailVerified: false,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store OTP
      await db.insert(emailVerifications).values({
        userId: newUser.id,
        email,
        otp,
        otpExpiry,
        type: 'registration',
        createdAt: new Date()
      });
      
      // TODO: Send OTP email
      console.log('Would send OTP email to:', email, 'with verification code');
      /* await emailService.sendEmail({
        to: email,
        subject: "Welcome to ParaFort - Verify Your Email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #34de73 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ParaFort</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Business Formation & Compliance Platform</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Hello ${firstName},<br><br>
                Thank you for joining ParaFort! To complete your registration and secure your account, please verify your email address using the code below:
              </p>
              
              <div style="background: #f8fafc; border: 2px dashed #34de73; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Verification Code:</p>
                <div style="font-size: 32px; font-weight: bold; color: #34de73; letter-spacing: 3px; font-family: monospace;">
                  ${otp}
                </div>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">This code expires in 10 minutes</p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Enter this code on the verification page to activate your account and start accessing our business formation services.
              </p>
              
              <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>Security Note:</strong> If you didn't create an account with ParaFort, please ignore this email.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ParaFort Inc. All rights reserved.</p>
              <p>9175 Elk Grove Florin Road, Ste 5, Elk Grove, CA 95624</p>
            </div>
          </div>
        `
      });
      */
      
      res.json({ 
        message: "Registration successful. Please check your email for verification code.",
        userId: newUser.id 
      });
      
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  // Verify OTP endpoint
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }
      
      // Find valid OTP
      const verification = await db.select()
        .from(emailVerifications)
        .where(
          and(
            eq(emailVerifications.email, email),
            eq(emailVerifications.otp, otp),
            gt(emailVerifications.otpExpiry, new Date())
          )
        );
      
      if (verification.length === 0) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
      
      const [verificationRecord] = verification;
      
      // Update user as verified
      await db.update(users)
        .set({ 
          isEmailVerified: true, 
          updatedAt: new Date() 
        })
        .where(eq(users.id, String(verificationRecord.userId)));
      
      // Delete used OTP
      await db.delete(emailVerifications)
        .where(eq(emailVerifications.id, verificationRecord.id));
      
      // Get user data
      const userResult = await db.select()
        .from(users)
        .where(eq(users.id, String(verificationRecord.userId)));
      const user = userResult[0];
      
      // Set session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        isEmailVerified: user.isEmailVerified || false,
        role: user.role || 'client'
      };
      
      res.json({ 
        message: "Email verified successfully",
        user: req.session.user
      });
      
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });
  
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email));
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check password
      if (!user.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check if email is verified
      if (!user.isEmailVerified) {
        // Generate new OTP for login
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        
        await db.insert(emailVerifications).values({
          userId: user.id,
          email,
          otp,
          otpExpiry,
          type: 'login',
          createdAt: new Date()
        });
        
        // TODO: Send email with OTP
        console.log('Would send login email to:', email, 'with code:', otp);
        
        /*
        await emailService.sendEmail({
          to: email,
          subject: "ParaFort Login - Verify Your Email",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #34de73 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">ParaFort</h1>
                <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Secure Login Verification</p>
              </div>
              
              <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px;">Login Verification Required</h2>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                  Hello ${user.firstName},<br><br>
                  We received a login attempt for your account. To ensure security, please verify your identity using the code below:
                </p>
                
                <div style="background: #f8fafc; border: 2px dashed #34de73; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
                  <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Login Code:</p>
                  <div style="font-size: 32px; font-weight: bold; color: #34de73; letter-spacing: 3px; font-family: monospace;">
                    ${otp}
                  </div>
                  <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">This code expires in 10 minutes</p>
                </div>
                
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #dc2626; font-size: 14px;">
                    <strong>Security Alert:</strong> If this wasn't you, please change your password immediately.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p>© 2025 ParaFort Inc. All rights reserved.</p>
              </div>
            </div>
          `
        });
        */
        
        return res.status(403).json({ 
          error: "Email verification required",
          requiresVerification: true,
          userId: user.id
        });
      }
      
      // Set session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        isEmailVerified: user.isEmailVerified || false,
        role: user.role || 'client'
      };
      
      res.json({ 
        message: "Login successful",
        user: req.session.user
      });
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // Resend OTP endpoint
  app.post("/api/auth/resend-otp", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      const [user] = await db.select().from(users).where(eq(users.email, email));
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Delete existing OTPs
      await db.delete(emailVerifications).where(eq(emailVerifications.email, email));
      
      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      
      await db.insert(emailVerifications).values({
        userId: user.id,
        email,
        otp,
        otpExpiry,
        type: 'resend',
        createdAt: new Date()
      });
      
      // TODO: Implement email sending
      console.log('Would send email:', {
        to: email,
        subject: "ParaFort - New Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #34de73 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">ParaFort</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Verification Code</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">New Verification Code</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                Hello ${user.firstName},<br><br>
                You requested a new verification code. Please use the code below:
              </p>
              
              <div style="background: #f8fafc; border: 2px dashed #34de73; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your New Verification Code:</p>
                <div style="font-size: 32px; font-weight: bold; color: #34de73; letter-spacing: 3px; font-family: monospace;">
                  ${otp}
                </div>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">This code expires in 10 minutes</p>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p>© 2025 ParaFort Inc. All rights reserved.</p>
            </div>
          </div>
        `
      });
      
      res.json({ message: "New verification code sent" });
      
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({ error: "Failed to resend code" });
    }
  });
  
  // Get current user - DISABLED: This endpoint is now handled in otp-routes.ts
  /*
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      // Check if user is authenticated via session
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const actualUserId = req.session.userId;
      
      // Fetch fresh user data from database
      const [user] = await db.select().from(users).where(eq(users.id, actualUserId));
        
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        
        console.log('Raw user data from database:', user);
        
        // Return user data in consistent format with explicit field mapping
        const userData = {
          id: user.id,
          email: user.email,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          phone: user.phone || '',
          profileImageUrl: user.profile_image_url || '',
          isEmailVerified: user.is_email_verified || false,
          role: user.role || 'user',
          isAdmin: user.role === 'admin' || user.role === 'super_admin',
          clientId: user.client_id || null,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        };
        
        console.log('Sending user data to frontend:', userData);
        return res.json(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  */
  
  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });
}