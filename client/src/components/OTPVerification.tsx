import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface OTPVerificationProps {
  email: string;
  type: 'registration' | 'login';
  onVerificationComplete: (user?: any) => void;
  onCancel: () => void;
}

export function OTPVerification({ email, type, onVerificationComplete, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/auth/verify-otp", {
        email,
        otp: otp.trim()
      });

      const data = await response.json();
      
      if (response.ok) {
        onVerificationComplete(data.user);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/auth/resend-otp", {
        email
      });

      if (response.ok) {
        setOtp("");
        setResendCooldown(60);
        
        // Countdown timer
        const timer = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to resend code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-[#34de73]" />
        </div>
        <CardTitle className="text-2xl font-bold">
          {type === 'registration' ? 'Verify Your Email' : 'Secure Login'}
        </CardTitle>
        <CardDescription className="text-gray-600">
          We've sent a 6-digit verification code to<br />
          <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={handleInputChange}
              className="text-center text-2xl font-mono tracking-widest h-12"
              maxLength={6}
              autoComplete="one-time-code"
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full bg-[#34de73] hover:bg-[#2bc464] text-white h-12 text-lg font-semibold"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
        </form>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
          </p>
          
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={isResending || resendCooldown > 0}
            className="text-[#34de73] hover:text-[#2bc464]"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Code
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="block w-full text-gray-500 hover:text-gray-700"
          >
            Back to {type === 'registration' ? 'Registration' : 'Login'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
          <p>Code expires in 10 minutes</p>
          <p>For security, never share this code with anyone</p>
        </div>
      </CardContent>
    </Card>
  );
}