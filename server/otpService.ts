import { db } from "./db";
import { 
  otpVerifications, 
  otpPreferences, 
  trustedDevices,
  type InsertOtpVerification,
  type InsertOtpPreferences,
  type InsertTrustedDevice,
  type OtpVerification,
  type OtpPreferences,
  type TrustedDevice
} from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

export class OtpService {
  // Generate 6-digit OTP code
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate device fingerprint based on request headers
  private generateDeviceFingerprint(userAgent: string, ip: string): string {
    return crypto
      .createHash('sha256')
      .update(`${userAgent}:${ip}`)
      .digest('hex')
      .substring(0, 32);
  }

  // Check if device is trusted (within 14 days)
  async isDeviceTrusted(userId: string, userAgent: string, ip: string): Promise<boolean> {
    const deviceFingerprint = this.generateDeviceFingerprint(userAgent, ip);
    const now = new Date();

    const [trustedDevice] = await db
      .select()
      .from(trustedDevices)
      .where(
        and(
          eq(trustedDevices.userId, userId),
          eq(trustedDevices.deviceFingerprint, deviceFingerprint),
          gt(trustedDevices.trustExpiresAt, now)
        )
      );

    return !!trustedDevice;
  }

  // Get user's OTP preferences
  async getUserOtpPreferences(userId: string): Promise<OtpPreferences | null> {
    const [preferences] = await db
      .select()
      .from(otpPreferences)
      .where(eq(otpPreferences.userId, userId));

    return preferences || null;
  }

  // Create or update OTP preferences
  async setOtpPreferences(userId: string, method: 'sms' | 'email', phoneNumber?: string): Promise<OtpPreferences> {
    const existingPrefs = await this.getUserOtpPreferences(userId);
    
    if (existingPrefs) {
      const [updated] = await db
        .update(otpPreferences)
        .set({
          preferredMethod: method,
          phoneNumber: phoneNumber || existingPrefs.phoneNumber,
          updatedAt: new Date(),
        })
        .where(eq(otpPreferences.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(otpPreferences)
        .values({
          userId,
          preferredMethod: method,
          phoneNumber,
          isEnabled: true,
        })
        .returning();
      return created;
    }
  }

  // Generate and send OTP
  async generateOtp(userId: string, method: 'sms' | 'email', contact: string): Promise<{ success: boolean; message: string }> {
    // Clean up expired OTPs for this user
    await this.cleanupExpiredOtps(userId);

    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      // Store OTP in database
      await db.insert(otpVerifications).values({
        userId,
        code,
        method,
        contact,
        expiresAt,
        isVerified: false,
      });

      // Send OTP via chosen method
      if (method === 'email') {
        await this.sendEmailOtp(contact, code);
      } else if (method === 'sms') {
        await this.sendSmsOtp(contact, code);
      }

      return { 
        success: true, 
        message: `OTP sent to your ${method === 'email' ? 'email' : 'phone number'}` 
      };
    } catch (error) {
      console.error('Error generating OTP:', error);
      return { 
        success: false, 
        message: 'Failed to send OTP. Please try again.' 
      };
    }
  }

  // Verify OTP code
  async verifyOtp(userId: string, code: string): Promise<{ success: boolean; message: string }> {
    const now = new Date();

    try {
      const [otpRecord] = await db
        .select()
        .from(otpVerifications)
        .where(
          and(
            eq(otpVerifications.userId, userId),
            eq(otpVerifications.code, code),
            eq(otpVerifications.isVerified, false),
            gt(otpVerifications.expiresAt, now)
          )
        );

      if (!otpRecord) {
        return { 
          success: false, 
          message: 'Invalid or expired OTP code' 
        };
      }

      // Mark OTP as verified
      await db
        .update(otpVerifications)
        .set({ isVerified: true })
        .where(eq(otpVerifications.id, otpRecord.id));

      return { 
        success: true, 
        message: 'OTP verified successfully' 
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { 
        success: false, 
        message: 'Verification failed. Please try again.' 
      };
    }
  }

  // Trust device for 14 days
  async trustDevice(userId: string, userAgent: string, ip: string): Promise<void> {
    const deviceFingerprint = this.generateDeviceFingerprint(userAgent, ip);
    const trustExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    // Remove existing trust for this device
    await db
      .delete(trustedDevices)
      .where(
        and(
          eq(trustedDevices.userId, userId),
          eq(trustedDevices.deviceFingerprint, deviceFingerprint)
        )
      );

    // Add new trust entry
    await db.insert(trustedDevices).values({
      userId,
      deviceFingerprint,
      deviceInfo: {
        userAgent,
        ipAddress: ip,
        trustedAt: new Date().toISOString(),
      },
      trustExpiresAt,
    });
  }

  // Clean up expired OTPs
  private async cleanupExpiredOtps(userId: string): Promise<void> {
    const now = new Date();
    await db
      .delete(otpVerifications)
      .where(
        and(
          eq(otpVerifications.userId, userId),
          gt(now, otpVerifications.expiresAt)
        )
      );
  }

  // Clean up expired trusted devices
  async cleanupExpiredTrustedDevices(): Promise<void> {
    const now = new Date();
    await db
      .delete(trustedDevices)
      .where(gt(now, trustedDevices.trustExpiresAt));
  }

  // Send SMS OTP (requires Twilio or similar service)
  private async sendSmsOtp(phoneNumber: string, code: string): Promise<void> {
    // Note: This requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER
    // For now, we'll log it (in production, integrate with actual SMS service)
    console.log(`SMS OTP to ${phoneNumber}: Your ParaFort verification code is ${code}. This code expires in 10 minutes.`);
    
    // TODO: Implement actual SMS sending when user provides Twilio credentials
    // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilioClient.messages.create({
    //   body: `Your ParaFort verification code is ${code}. This code expires in 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });
  }

  // Send Email OTP (requires SendGrid or similar service)
  private async sendEmailOtp(email: string, code: string): Promise<void> {
    // Note: This requires SENDGRID_API_KEY
    // For now, we'll log it (in production, integrate with actual email service)
    console.log(`Email OTP to ${email}: Your ParaFort verification code is ${code}. This code expires in 10 minutes.`);
    
    // TODO: Implement actual email sending when user provides SendGrid credentials
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: email,
    //   from: 'security@parafort.com',
    //   subject: 'ParaFort Security Verification',
    //   text: `Your verification code is ${code}. This code expires in 10 minutes.`,
    //   html: `<p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`
    // });
  }
}

export const otpService = new OtpService();