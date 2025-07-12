import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
      role?: string;
      claims?: any; // For compatibility with existing code
    };
    pendingRegistration?: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
    loginAttempt?: {
      userId: string;
      email: string;
      timestamp: number;
    };
    pendingAdminLogin?: string; // email for admin login
    pendingLogin?: string; // user ID for login verification
    isAdmin?: boolean;
    adminRole?: string;
  }
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  role?: string;
  claims?: any; // For compatibility with existing code
}