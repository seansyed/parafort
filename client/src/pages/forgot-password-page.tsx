import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Mail, Key } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  resetCode: z.string().min(6, "Reset code must be 6 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forgotForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onForgotPasswordSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", {
        email: data.email,
      });

      setEmail(data.email);
      setStep('reset');
      resetForm.setValue('email', data.email);
      
      console.log('Password reset code sent - check server logs for the 6-digit code');
      toast({
        title: "Reset Code Sent",
        description: "Please check your email for the password reset code. Development mode: Check browser console or server logs for the 6-digit reset code.",
        duration: 8000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordForm) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password", {
        email: data.email,
        resetCode: data.resetCode,
        newPassword: data.newPassword,
      });

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now login with your new password.",
      });

      // Redirect to login page after successful reset
      window.location.href = "/auth";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {step === 'request' ? (
                <Mail className="h-6 w-6 text-blue-600" />
              ) : (
                <Key className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {step === 'request' ? 'Forgot Password' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'request' 
                ? 'Enter your email address to receive a password reset code'
                : 'Enter the reset code and your new password'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 'request' ? (
              <Form {...forgotForm}>
                <form onSubmit={forgotForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={forgotForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email address"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Reset Code"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled
                            className="h-11 bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="resetCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reset Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter 6-digit reset code"
                            className="h-11"
                            maxLength={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter new password"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm new password"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  if (step === 'reset') {
                    setStep('request');
                    forgotForm.reset();
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {step === 'reset' ? 'Send New Reset Code' : 'Need help? Contact support'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}