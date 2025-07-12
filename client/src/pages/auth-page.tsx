import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, Shield, Building2 } from "lucide-react";
const parafortLogo = "/parafort-logo-white.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type LoginForm = z.infer<typeof loginSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [otpError, setOtpError] = useState("");

  // Check if user is already logged in
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: false, // Disable automatic query execution
  });

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // OTP form
  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  // Login mutation - sends OTP code
  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      setLoginError(""); // Clear previous errors
      const res = await apiRequest("POST", "/api/send-verification-email", data);
      return res.json();
    },
    onSuccess: (data) => {
      setUserEmail(loginForm.getValues("email"));
      setVerificationId(data.verificationId);
      setIsOTPMode(true);
      setLoginError(""); // Clear any errors
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code.",
      });
    },
    onError: (error: any) => {
      setLoginError(error.message || "Failed to send verification code. Please check your email address.");
    },
  });

  // OTP verification mutation
  const otpMutation = useMutation({
    mutationFn: async (data: OTPForm) => {
      setOtpError(""); // Clear previous errors
      const res = await apiRequest("POST", "/api/verify-code", {
        verificationId: verificationId,
        code: data.otp,
      });
      return res.json();
    },
    onSuccess: async (data) => {
      console.log("OTP verification success:", data);
      
      if (data.user) {
        // User login successful
        queryClient.setQueryData(["/api/auth/user"], data.user);
        // Force refresh of user data to get clientId
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        
        // Redirect based on user role
        if (data.user.isAdmin) {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      } else {
        // Email verification only
        toast({
          title: "Email Verified",
          description: "Your account has been verified successfully!",
        });
        setLocation("/");
      }
    },
    onError: (error: any) => {
      setOtpError(error.message || "Invalid or expired verification code. Please try again.");
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/resend-otp", {
        email: userEmail,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Resend",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if already logged in - use useEffect to avoid hooks after return
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Show loading spinner only when explicitly checking auth status
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Checking authentication...</p>
      </div>
    </div>;
  }

  if (isOTPMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-gray-100">
              <img src={parafortLogo} alt="ParaFort" className="w-12 h-12 rounded-lg object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to <span className="font-medium">{userEmail}</span>
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              <form onSubmit={otpForm.handleSubmit((data) => otpMutation.mutate(data))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    {...otpForm.register("otp")}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-red-600">{otpForm.formState.errors.otp.message}</p>
                  )}
                  {otpError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-700 font-medium">{otpError}</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={otpMutation.isPending}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '8px 16px',
                    backgroundColor: '#34de73',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: otpMutation.isPending ? 'not-allowed' : 'pointer',
                    opacity: otpMutation.isPending ? '0.5' : '1',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!otpMutation.isPending) {
                      e.currentTarget.style.backgroundColor = '#2bc866';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!otpMutation.isPending) {
                      e.currentTarget.style.backgroundColor = '#34de73';
                    }
                  }}
                >
                  {otpMutation.isPending ? "Verifying..." : "Verify Email"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => resendMutation.mutate()}
                    disabled={resendMutation.isPending}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    {resendMutation.isPending ? "Sending..." : "Resend code"}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOTPMode(false);
                      setUserEmail("");
                      otpForm.reset();
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700 underline"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <div className="w-48 h-32 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-gray-100">
              <img src={parafortLogo} alt="ParaFort" className="w-44 h-28 rounded-2xl object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-green-600">ParaFort</span>
            </h1>
            <p className="text-xl text-gray-600">
              Your comprehensive business formation and compliance management platform
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Business Formation</h3>
                <p className="text-gray-600">Streamlined entity creation across all 50 states</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Compliance Management</h3>
                <p className="text-gray-600">Automated tracking and reminders for all requirements</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Professional Services</h3>
                <p className="text-gray-600">Expert support for your business needs</p>
              </div>
            </div>
          </div>


        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...loginForm.register("email")}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              {loginError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{loginError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '8px 16px',
                  backgroundColor: '#34de73',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loginMutation.isPending ? 'not-allowed' : 'pointer',
                  opacity: loginMutation.isPending ? '0.5' : '1',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!loginMutation.isPending) {
                    e.currentTarget.style.backgroundColor = '#2bc866';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loginMutation.isPending) {
                    e.currentTarget.style.backgroundColor = '#34de73';
                  }
                }}
              >
                {loginMutation.isPending ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>

            <div className="text-center pt-4 space-y-3">
              <div>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Forgot Password?
                </Link>
              </div>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/" className="text-blue-600 hover:text-blue-700 underline">
                  Start Your Business Today
                </a>
              </p>
              
              {/* Back to Home Button */}
              <div className="pt-4">
                <button
                  onClick={() => window.location.href = '/'}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '8px 16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  Back to Home Page
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Hero Section */}
        <div className="lg:hidden text-center space-y-4 order-first">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-gray-100">
            <img src={parafortLogo} alt="ParaFort" className="w-20 h-20 rounded-xl object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to <span className="text-green-600">ParaFort</span>
          </h1>
          <p className="text-gray-600">
            Your comprehensive business formation and compliance platform
          </p>
        </div>
      </div>
    </div>
  );
}