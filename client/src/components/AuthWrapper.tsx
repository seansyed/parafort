import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OTPVerification } from "./OTPVerification";
import { ParaFortLoader } from "./ParaFortLoader";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !otpVerified) {
      // If user is authenticated with a valid session, skip OTP verification
      // Only require OTP for new login attempts or suspicious activity
      if (user.isEmailVerified) {
        setOtpVerified(true);
        sessionStorage.setItem('otp_verification_completed', 'true');
      } else {
        // Check if we need OTP verification for this session
        const otpSkipped = sessionStorage.getItem('otp_verification_completed');
        if (!otpSkipped) {
          setShowOtpVerification(true);
        } else {
          setOtpVerified(true);
        }
      }
    }
  }, [isAuthenticated, user, otpVerified]);

  const handleOtpVerificationComplete = () => {
    setShowOtpVerification(false);
    setOtpVerified(true);
    // Mark OTP as completed for this session
    sessionStorage.setItem('otp_verification_completed', 'true');
  };

  const handleOtpSkip = () => {
    setShowOtpVerification(false);
    setOtpVerified(true);
    // Mark OTP as completed for this session (even if skipped)
    sessionStorage.setItem('otp_verification_completed', 'true');
  };

  // Show loading state only for a short time, then proceed
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ParaFortLoader size="lg" />
      </div>
    );
  }

  // Show OTP verification if user is authenticated but not verified
  if (isAuthenticated && user && showOtpVerification && !otpVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <OTPVerification
          email={user.email || ''}
          type="login"
          onVerificationComplete={handleOtpVerificationComplete}
          onCancel={handleOtpSkip}
        />
      </div>
    );
  }

  // Render children if authenticated and verified (or verification not needed)
  if (isAuthenticated && user && (otpVerified || !showOtpVerification)) {
    return <>{children}</>;
  }

  // Not authenticated, let the app handle normal flow
  return <>{children}</>;
}