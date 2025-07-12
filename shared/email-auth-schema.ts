import { pgTable, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// Email verification table for OTP storage
export const emailVerifications = pgTable("email_verifications", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email").notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  otpExpiry: timestamp("otp_expiry").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'registration', 'login', 'resend'
  createdAt: timestamp("created_at").defaultNow(),
});

// Registration schema - use main users table structure
// export const registerSchema = createInsertSchema(users, {
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
// }).omit({
//   id: true,
//   clientId: true,
//   phone: true,
//   profileImageUrl: true,
//   role: true,
//   permissions: true,
//   stripeCustomerId: true,
//   stripeSubscriptionId: true,
//   isActive: true,
//   isEmailVerified: true,
//   lastLoginAt: true,
//   passwordResetAt: true,
//   dataRetentionUntil: true,
//   createdAt: true,
//   updatedAt: true,
// });

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// OTP verification schema
export const otpVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Types
// export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type OTPVerificationData = z.infer<typeof otpVerificationSchema>;
export type EmailVerification = typeof emailVerifications.$inferSelect;