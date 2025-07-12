import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Phone, Shield, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OtpVerificationModalProps {
  email: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

export function OtpVerificationModal({ email, onVerificationComplete, onCancel }: OtpVerificationModalProps) {
  const [step, setStep] = useState<'method' | 'verify'>('method');
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  const sendVerification = async () => {
    if (method === 'sms' && !phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to receive SMS verification.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting verification request:', { method, email, phoneNumber });
      
      const endpoint = method === 'email' ? '/api/send-verification-email' : '/api/send-verification-sms';
      const payload = method === 'email' ? { email } : { phone: phoneNumber };
      
      console.log('Making request to:', endpoint, 'with payload:', payload);
      
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('Response received:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        setVerificationId(data.verificationId);
        setStep('verify');
        setTimeLeft(15 * 60); // 15 minutes
        
        // Start countdown timer
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast({
          title: "Verification Sent",
          description: data.message,
        });
      } else {
        toast({
          title: "Failed to Send",
          description: data.error || "Failed to send verification code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification request error:', error);
      let errorMessage = "Failed to send verification code. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/verify-code', {
        verificationId,
        code: code.trim()
      });
      const data = await response.json();

      if (data.success && data.verified) {
        toast({
          title: "Verification Successful",
          description: "Your contact information has been verified.",
        });
        onVerificationComplete();
      } else {
        toast({
          title: "Invalid Code",
          description: data.message || "Please check your code and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/resend-verification', {
        verificationId
      });
      const data = await response.json();

      if (data.success) {
        setTimeLeft(15 * 60);
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast({
          title: "Code Resent",
          description: data.message,
        });
      } else {
        toast({
          title: "Failed to Resend",
          description: data.error || "Failed to resend verification code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle>Verify Your Contact</CardTitle>
          <CardDescription>
            {step === 'method' 
              ? "Choose how you'd like to receive your verification code" 
              : "Enter the verification code sent to your device"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'method' ? (
            <>
              <RadioGroup value={method} onValueChange={(value: 'email' | 'sms') => setMethod(value)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="email" id="email" />
                  <Mail className="w-4 h-4 text-gray-500" />
                  <Label htmlFor="email" className="flex-1 cursor-pointer">
                    <div className="font-medium">Email Verification</div>
                    <div className="text-sm text-gray-500">{email}</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="sms" id="sms" />
                  <Phone className="w-4 h-4 text-gray-500" />
                  <Label htmlFor="sms" className="flex-1 cursor-pointer">
                    <div className="font-medium">SMS Verification</div>
                    <div className="text-sm text-gray-500">Receive code via text message</div>
                  </Label>
                </div>
              </RadioGroup>

              {method === 'sms' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={sendVerification} 
                  disabled={loading}
                  className="flex-1 bg-green-700 hover:bg-orange-700"
                >
                  {loading ? "Sending..." : "Send Code"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Code sent to {method === 'email' ? email : phoneNumber}
                </p>
                {timeLeft > 0 && (
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Expires in {formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center tracking-wider text-lg"
                  maxLength={6}
                />
              </div>

              {timeLeft === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Code expired. Please request a new one.</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={resendCode} 
                  disabled={loading || timeLeft > 13 * 60}
                  className="flex-1"
                >
                  {loading ? "Sending..." : "Resend Code"}
                </Button>
                <Button 
                  onClick={verifyCode} 
                  disabled={loading || code.length !== 6 || timeLeft === 0}
                  className="flex-1 bg-green-700 hover:bg-orange-700"
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setStep('method')}
                className="w-full text-sm"
              >
                ← Change verification method
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}