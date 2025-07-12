import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, Shield, Crown } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
const ParaFortLogo = "/parafort-main-logo.svg";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function AdminAuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check if user is already logged in
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Redirect if already logged in as admin
  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    setLocation("/admin");
    return null;
  }

  // Admin login form
  const adminLoginForm = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
    },
  });

  // OTP verification form
  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: async (data: AdminLoginForm) => {
      const response = await apiRequest("POST", "/api/admin/login", { email: data.email });
      return response.json();
    },
    onSuccess: (data) => {
      setUserEmail(data.email || adminLoginForm.getValues("email"));
      setIsOTPMode(true);
      toast({
        title: "Verification Required",
        description: "Please check your email for the verification code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or insufficient privileges",
        variant: "destructive",
      });
    },
  });

  // OTP verification mutation
  const otpVerificationMutation = useMutation({
    mutationFn: async (data: OTPForm) => {
      const response = await apiRequest("POST", "/api/admin/verify-login", {
        email: userEmail,
        otp: data.otp,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Force refetch user data after successful admin login
      queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard.",
      });
      // Small delay to ensure user data is updated before redirect
      setTimeout(() => {
        setLocation("/admin/dashboard");
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification code",
        variant: "destructive",
      });
    },
  });

  const handleAdminLogin = (data: AdminLoginForm) => {
    adminLoginMutation.mutate(data);
  };

  const handleOTPVerification = (data: OTPForm) => {
    otpVerificationMutation.mutate(data);
  };

  const handleBackToLogin = () => {
    setIsOTPMode(false);
    setUserEmail("");
    otpForm.reset();
  };

  const goToClientLogin = () => {
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <img 
                src={ParaFortLogo} 
                alt="ParaFort" 
                className="mx-auto h-12 w-auto mb-6"
              />
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="h-6 w-6 text-yellow-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Access
                </h1>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Secure administrative portal
              </p>
            </div>

            {!isOTPMode ? (
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Administrator Login
                  </CardTitle>
                  <CardDescription>
                    Enter your admin email to receive verification code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={adminLoginForm.handleSubmit(handleAdminLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Admin Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@parafort.com"
                          className="pl-10"
                          {...adminLoginForm.register("email")}
                        />
                      </div>
                      {adminLoginForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {adminLoginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>



                    <button
                      type="submit"
                      disabled={adminLoginMutation.isPending}
                      style={{
                        width: '100%',
                        backgroundColor: '#34de73',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: adminLoginMutation.isPending ? 'not-allowed' : 'pointer',
                        opacity: adminLoginMutation.isPending ? 0.6 : 1,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!adminLoginMutation.isPending) {
                          e.target.style.backgroundColor = '#059669';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!adminLoginMutation.isPending) {
                          e.target.style.backgroundColor = '#34de73';
                        }
                      }}
                    >
                      {adminLoginMutation.isPending ? "Sending Code..." : "Send Verification Code"}
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={goToClientLogin}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: '8px 16px',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#2563eb';
                      }}
                    >
                      Client Login
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl font-semibold">
                    Two-Factor Verification
                  </CardTitle>
                  <CardDescription>
                    Enter the 6-digit code sent to {userEmail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={otpForm.handleSubmit(handleOTPVerification)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                        {...otpForm.register("otp")}
                      />
                      {otpForm.formState.errors.otp && (
                        <p className="text-sm text-red-500">
                          {otpForm.formState.errors.otp.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={otpVerificationMutation.isPending}
                      style={{
                        width: '100%',
                        backgroundColor: '#34de73',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: otpVerificationMutation.isPending ? 'not-allowed' : 'pointer',
                        opacity: otpVerificationMutation.isPending ? 0.6 : 1,
                        transition: 'all 0.2s',
                        marginBottom: '12px'
                      }}
                      onMouseEnter={(e) => {
                        if (!otpVerificationMutation.isPending) {
                          e.target.style.backgroundColor = '#2bc866';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!otpVerificationMutation.isPending) {
                          e.target.style.backgroundColor = '#34de73';
                        }
                      }}
                    >
                      {otpVerificationMutation.isPending ? "Verifying..." : "Verify & Login"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      style={{
                        width: '100%',
                        backgroundColor: 'white',
                        color: '#374151',
                        padding: '12px 24px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#9ca3af';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#d1d5db';
                      }}
                    >
                      Back to Login
                    </button>
                  </form>
                  
                  <div className="mt-6 space-y-3">
                    <div className="text-center">
                      <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 underline">
                        Forgot Password?
                      </Link>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-sm text-gray-700 mb-2">Admin Login Info:</h3>
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Email:</strong> rashidkazi@outlook.com
                      </p>
                      <p className="text-xs text-gray-600">
                        Admin access with email verification enabled
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This is a secure administrative area. All access attempts are logged.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Right Side - Admin Info */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-red-600 to-red-800 text-white p-12">
          <div className="max-w-md text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <Crown className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold">
              Administrative Dashboard
            </h2>
            <p className="text-lg text-red-100">
              Manage business entities, monitor compliance, oversee operations, and maintain system security.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span>Secure multi-factor authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 flex-shrink-0" />
                <span>Full administrative privileges</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span>Encrypted session management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}