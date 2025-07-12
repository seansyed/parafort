import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, Check, Mail, User, Settings, CreditCard, CheckCircle, Plus, Minus, Eye, EyeOff, FileText, Building, Building2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ParaFortLoader from "@/components/ParaFortLoader";
import AnnualReportForm from "@/components/AnnualReportForm";
import { getStateFilingFee } from "@/stateFilingFees";

// Initialize Stripe using backend configuration
let stripePromise: Promise<any | null> | null = null;

async function initializeStripe(): Promise<any | null> {
  try {
    const response = await fetch('/api/stripe/config');
    const config = await response.json();
    
    if (config.requiresConfiguration || config.error) {
      console.error("Stripe configuration error:", config.message || "Stripe configuration required");
      console.warn("Continuing with limited functionality - payments will not work until Stripe is properly configured");
      return null;
    }
    
    if (config.publishableKey && config.publishableKey.startsWith('pk_')) {
      return await loadStripe(config.publishableKey);
    } else {
      throw new Error("Invalid publishable key received from server");
    }
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    return null;
  }
}

// Types
interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  oneTimePrice: number | null;
  recurringPrice: number | null;
  recurringInterval: string | null;
  isActive: boolean;
}

interface ServiceAddOn {
  id: number;
  serviceId: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

interface ServiceCustomField {
  id: number;
  serviceId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  isRequired: boolean;
  options: string[] | null;
  placeholder: string | null;
  helpText: string | null;
  validation: any;
  displayOrder: number;
  isActive: boolean;
}

// Step definitions
const CHECKOUT_STEPS = [
  { id: 1, title: "Account Check", description: "Login or create account", icon: User },
  { id: 2, title: "Service & Add-Ons", description: "Select service options", icon: Settings },
  { id: 3, title: "Information", description: "Provide required details", icon: Mail },
  { id: 4, title: "Review & Payment", description: "Complete your order", icon: CreditCard },
  { id: 5, title: "Confirmation", description: "Order confirmed", icon: CheckCircle }
];

// US States data
const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" }, { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" }, { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" }, { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" }, { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" }, { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" }, { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" }, { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" }, { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" }, { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" }, { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" }, { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" }, { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" }, { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" }, { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" }, { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" }
];

// Password strength checker
interface PasswordStrength {
  score: number;
  feedback: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
  color: string;
}

function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];
  
  // Length check
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push("At least 8 characters");
  }
  
  // Uppercase letter
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("One uppercase letter");
  }
  
  // Lowercase letter
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push("One lowercase letter");
  }
  
  // Numbers
  if (/\d/.test(password)) {
    score += 20;
  } else {
    feedback.push("One number");
  }
  
  // Special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20;
  } else {
    feedback.push("One special character (!@#$%^&*)");
  }
  
  // Bonus points for length
  if (password.length >= 12) {
    score += 10;
  }
  
  // Determine strength level and color
  let strength: 'weak' | 'fair' | 'good' | 'strong';
  let color: string;
  
  if (score < 40) {
    strength = 'weak';
    color = 'red';
  } else if (score < 60) {
    strength = 'fair';
    color = 'orange';
  } else if (score < 80) {
    strength = 'good';
    color = 'yellow';
  } else {
    strength = 'strong';
    color = 'green';
  }
  
  return { score: Math.min(score, 100), feedback, strength, color };
}

// Complex Password Input Component
function PasswordInput({ 
  id, 
  placeholder, 
  value, 
  onChange 
}: { 
  id: string; 
  placeholder: string; 
  value: string; 
  onChange: (value: string) => void; 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    strength: 'weak',
    color: 'red'
  });

  useEffect(() => {
    if (value) {
      setPasswordStrength(checkPasswordStrength(value));
    } else {
      setPasswordStrength({
        score: 0,
        feedback: [],
        strength: 'weak',
        color: 'red'
      });
    }
  }, [value]);

  const getStrengthColor = () => {
    switch (passwordStrength.color) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthTextColor = () => {
    switch (passwordStrength.color) {
      case 'red': return 'text-red-600';
      case 'orange': return 'text-orange-600';
      case 'yellow': return 'text-yellow-600';
      case 'green': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>

      {value && (
        <div className="space-y-2">
          {/* Password Strength Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${passwordStrength.score}%` }}
              />
            </div>
            <span className={`text-sm font-medium capitalize ${getStrengthTextColor()}`}>
              {passwordStrength.strength}
            </span>
          </div>

          {/* Password Requirements */}
          {passwordStrength.feedback.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password must include:
              </p>
              <ul className="space-y-1">
                {passwordStrength.feedback.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Message */}
          {passwordStrength.strength === 'strong' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Great! Your password is strong and secure.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep - 1) / (CHECKOUT_STEPS.length - 1)) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        {CHECKOUT_STEPS.map((step) => {
          const IconComponent = step.icon;
          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  step.id < currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : step.id === currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <IconComponent className="w-6 h-6" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="h-3" />
    </div>
  );
}

// Step 1: Account Check & Verification
function Step1AccountCheck({ onNext }: { onNext: (data: any) => void }) {
  const [email, setEmail] = useState("");
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const checkEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      console.log('Email check response:', data);
      setIsExistingUser(data.exists);
      if (data.exists) {
        console.log('Setting showLoginForm to true');
        setShowLoginForm(true);
        setShowSignupForm(false);
      } else {
        console.log('Setting showSignupForm to true');
        setShowSignupForm(true);
        setShowLoginForm(false);
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Login Successful",
        description: "Welcome back! Proceeding to service selection.",
      });
      onNext({ 
        user: data.user, 
        isExistingUser: true,
        email: email
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; firstName: string; lastName: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      return response.json();
    },
    onSuccess: () => {
      setVerificationSent(true);
      toast({
        title: "Verification Email Sent",
        description: "Please check your email and click the verification link to continue.",
      });
    }
  });

  const passwordResetMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/reset-password", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      });
      setShowPasswordReset(false);
      setIsExistingUser(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEmailCheck = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    checkEmailMutation.mutate(email);
  };

  const handleLogin = (data: { password: string }) => {
    loginMutation.mutate({ email, password: data.password });
  };

  const handleSignup = (data: { firstName: string; lastName: string; password: string }) => {
    signupMutation.mutate({ email, ...data });
  };

  const handleVerificationComplete = () => {
    onNext({ 
      isExistingUser: false,
      email: email,
      requiresVerification: true
    });
  };

  // Debug logging
  console.log('Render state:', { 
    isExistingUser, 
    showLoginForm, 
    showSignupForm, 
    verificationSent,
    email 
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Account Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isExistingUser === null && !showSignupForm && !verificationSent && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEmailCheck()}
              />
            </div>
            <button 
              onClick={handleEmailCheck} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={checkEmailMutation.isPending}
              style={{
                backgroundColor: checkEmailMutation.isPending ? '#9ca3af' : '#16a34a',
                color: 'white',
                fontWeight: '600',
                cursor: checkEmailMutation.isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {checkEmailMutation.isPending ? "Checking..." : "Continue"}
            </button>
          </div>
        )}

        {showLoginForm && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Welcome back! Please enter your password to continue.
              </AlertDescription>
            </Alert>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin({ password: (e.target as HTMLInputElement).value });
                  }
                }}
              />
            </div>
            <button 
              onClick={(e) => {
                const passwordInput = document.getElementById('password') as HTMLInputElement;
                handleLogin({ password: passwordInput.value });
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loginMutation.isPending}
              style={{
                backgroundColor: loginMutation.isPending ? '#9ca3af' : '#16a34a',
                color: 'white',
                fontWeight: '600',
                cursor: loginMutation.isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  // Reset to show email input for password reset
                  setIsExistingUser(null);
                  setShowLoginForm(false);
                  setShowPasswordReset(true);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        )}

        {showSignupForm && !verificationSent && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Create your account to continue with your order.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="First name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Last name" />
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">Password</Label>
              <PasswordInput
                id="newPassword"
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
              />
            </div>
            <button 
              onClick={() => {
                const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
                const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
                handleSignup({ firstName, lastName, password });
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={signupMutation.isPending}
              style={{
                backgroundColor: signupMutation.isPending ? '#9ca3af' : '#16a34a',
                color: 'white',
                fontWeight: '600',
                cursor: signupMutation.isPending ? 'not-allowed' : 'pointer'
              }}
            >
              {signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        )}

        {showPasswordReset && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Enter your email address and we'll send you a link to reset your password.
              </AlertDescription>
            </Alert>
            <div>
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    passwordResetMutation.mutate(email);
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => passwordResetMutation.mutate(email)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={passwordResetMutation.isPending || !email}
                style={{
                  backgroundColor: (passwordResetMutation.isPending || !email) ? '#9ca3af' : '#16a34a',
                  color: 'white',
                  fontWeight: '600',
                  cursor: (passwordResetMutation.isPending || !email) ? 'not-allowed' : 'pointer'
                }}
              >
                {passwordResetMutation.isPending ? "Sending..." : "Send Reset Link"}
              </button>
              <button 
                onClick={() => {
                  setShowPasswordReset(false);
                  setIsExistingUser(null);
                  setEmail("");
                }}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: 'transparent',
                  color: '#374151',
                  fontWeight: '600',
                  border: '2px solid #d1d5db'
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {verificationSent && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Check Your Email</h3>
              <p className="text-gray-600 mt-2">
                We've sent a verification link to <strong>{email}</strong>. 
                Please click the link in your email to verify your account.
              </p>
            </div>
            <button 
              onClick={handleVerificationComplete} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                fontWeight: '600'
              }}
            >
              I've Verified My Email - Continue
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Step 2: Service & Add-On Selection
function Step2ServiceSelection({ 
  service, 
  addOns, 
  onNext, 
  onBack 
}: { 
  service: Service; 
  addOns: ServiceAddOn[];
  onNext: (data: any) => void; 
  onBack: () => void; 
}) {
  const [selectedLicensePlan, setSelectedLicensePlan] = useState('guidance');
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [processingSpeed, setProcessingSpeed] = useState("standard");

  const toggleAddOn = (addOnId: number) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  // Calculate base price based on service type and selected plan
  let basePrice = Number(service.oneTimePrice || service.recurringPrice || 0);
  if (service?.name === "Business Licenses") {
    basePrice = selectedLicensePlan === 'filing' ? 599 : 199;
  }
  
  const addOnTotal = addOns
    .filter(addOn => selectedAddOns.includes(addOn.id))
    .reduce((sum, addOn) => sum + addOn.price, 0);
  const expeditedFee = processingSpeed === "expedited" ? Number((service as any).expeditedPrice || 75) : 0;
  const totalPrice = basePrice + addOnTotal + expeditedFee;

  const handleNext = () => {
    onNext({
      selectedAddOns: addOns.filter(addOn => selectedAddOns.includes(addOn.id)),
      processingSpeed,
      selectedLicensePlan: service?.name === "Business Licenses" ? selectedLicensePlan : undefined,
      pricing: {
        basePrice,
        addOnTotal,
        expeditedFee,
        totalPrice
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Service Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Service */}
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                </div>
              </div>


            </div>

            {/* Processing Speed - Hide for Business Licenses, Digital Mailbox, and Bookkeeping Plans */}
            {service?.name !== "Business Licenses" && !(service as any)?.isMailboxPlan && !(service as any)?.isBookkeepingPlan && !service.id?.toString().startsWith('mailbox-') && !service.id?.toString().startsWith('bookkeeping-') && (
            <div>
              <Label className="text-base font-medium">Processing Speed</Label>
              <RadioGroup 
                value={processingSpeed} 
                onValueChange={setProcessingSpeed} 
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard Processing (7-10 business days) - Included</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expedited" id="expedited" />
                  <Label htmlFor="expedited">Expedited Processing (1-3 business days) - Add ${Number((service as any).expeditedPrice || 75).toFixed(0)}</Label>
                </div>
              </RadioGroup>
            </div>
            )}

            {/* Business License Plan Selection */}
            {service?.name === "Business Licenses" && (
              <div>
                <Label className="text-base font-semibold">Select License Service Plan</Label>
                <p className="text-sm text-gray-600 mb-4">Choose the level of service that best fits your needs</p>
                <RadioGroup 
                  value={selectedLicensePlan} 
                  onValueChange={setSelectedLicensePlan}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="guidance" id="guidance" className="mt-1" />
                    <Label htmlFor="guidance" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-semibold text-lg">ParaFort License Guidance</div>
                        <div className="text-2xl font-bold text-green-600 my-2">$199.00</div>
                        <div className="text-sm text-gray-600 mb-3">
                          Discover your license requirements and how to submit applications. Processes in 7 to 10 business days. Expedited service reduces processing to 2 business days.
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-2">What's Included:</div>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Professional Service</li>
                            <li>• Fast Processing</li>
                            <li>• 7-10 Business Day Processing</li>
                            <li>• Expert Review & Support</li>
                            <li>• Compliance Guarantee</li>
                            <li>• Compliance Deadline Assistance</li>
                          </ul>
                        </div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="filing" id="filing" className="mt-1" />
                    <Label htmlFor="filing" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-semibold text-lg">ParaFort License Filing</div>
                        <div className="text-2xl font-bold text-green-600 my-2">$599.00</div>
                        <div className="text-sm text-gray-600 mb-3">
                          Complete license application filing service with expert guidance and submission. Full-service license acquisition support.
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-2">What's Included:</div>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Complete Application Filing</li>
                            <li>• Expert Preparation & Submission</li>
                            <li>• Government Communication</li>
                            <li>• Status Tracking & Updates</li>
                            <li>• Compliance Monitoring</li>
                            <li>• Priority Support</li>
                          </ul>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Add-Ons */}
            {addOns.length > 0 && (
              <div>
                <h4 className="text-base font-medium mb-3">Optional Add-Ons</h4>
                <div className="space-y-3">
                  {addOns.map((addOn) => (
                    <div 
                      key={addOn.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddOns.includes(addOn.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleAddOn(addOn.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            checked={selectedAddOns.includes(addOn.id)}
                            onChange={() => toggleAddOn(addOn.id)}
                          />
                          <div>
                            <h5 className="font-medium">{addOn.name}</h5>
                            <p className="text-sm text-gray-600">{addOn.description}</p>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          +${addOn.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button type="button" onClick={onBack} className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors hover:bg-gray-50 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button onClick={handleNext} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                Continue to Information
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Summary Sidebar */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>
                {service?.name === "Business Licenses" 
                  ? (selectedLicensePlan === 'filing' ? 'License Filing Service' : 'License Guidance Service')
                  : service.name
                }
              </span>
              <span>${basePrice.toFixed(2)}</span>
            </div>

            {selectedAddOns.length > 0 && (
              <>
                <Separator />
                {addOns
                  .filter(addOn => selectedAddOns.includes(addOn.id))
                  .map(addOn => (
                    <div key={addOn.id} className="flex justify-between text-sm">
                      <span>{addOn.name}</span>
                      <span>+${addOn.price.toFixed(2)}</span>
                    </div>
                  ))
                }
              </>
            )}

            {expeditedFee > 0 && (
              <>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Expedited Processing</span>
                  <span>+${expeditedFee.toFixed(2)}</span>
                </div>
              </>
            )}

            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Step 3: Provide Information (Custom Fields)
function Step3Information({ 
  customFields, 
  userProfile, 
  onNext, 
  onBack,
  service
}: { 
  customFields: ServiceCustomField[];
  userProfile?: any;
  onNext: (data: any) => void; 
  onBack: () => void; 
  service: Service;
}) {
  // Check if this is EIN service to show specialized form
  const isEINService = service.id === 17;
  // Check if this is Business License service to show jurisdiction-specific form
  const isBusinessLicenseService = service.id === 8;
  // Check if this is FBN/DBA service to show jurisdiction-specific form
  const isFBNService = service.id === 25;
  // Check if this is Registered Agent service to show specialized form
  const isRegisteredAgentService = service.id === 30;
  // Check if this is Mailbox service to show specialized form
  const isMailboxService = (service as any)?.isMailboxPlan || service.id?.toString().startsWith('mailbox-');
  // Check if this is Bookkeeping service to show specialized form
  const isBookkeepingService = (service as any)?.isBookkeepingPlan || service.id?.toString().startsWith('bookkeeping-');
  
  // Debug: Log service info to help identify why FBN form isn't showing
  console.log('Step 3 - Service ID:', service.id, 'Type:', typeof service.id);
  console.log('Step 3 - Is FBN Service (ID 25):', isFBNService);
  console.log('Step 3 - Service object keys:', Object.keys(service));
  console.log('Step 3 - Full service object:', JSON.stringify(service));
  
  // If service ID doesn't exist but we're trying to access service ID 25, force enable FBN form
  const forceFBNForm = !service?.id && (serviceId === '25' || window.location.pathname.includes('/25'));

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Pre-populate with user profile data
    const initialData: Record<string, any> = {};
    if (userProfile) {
      initialData.firstName = userProfile.firstName || "";
      initialData.lastName = userProfile.lastName || "";
      initialData.email = userProfile.email || "";
      initialData.phone = userProfile.phone || "";
    }
    return initialData;
  });

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNext = () => {
    if (isEINService) {
      // Validate EIN specific required fields
      const requiredEINFields = [
        'legalName', 'entityType', 'reasonForApplying', 'physicalAddress', 
        'responsiblePartySSN', 'stateOfFormation', 'principalActivity', 
        'dateBusinessStarted', 'accountingYear'
      ];
      
      const missingFields = requiredEINFields
        .filter(field => !formData[field])
        .map(field => {
          const fieldLabels: Record<string, string> = {
            'legalName': 'Legal Name of Entity',
            'entityType': 'Type of Entity',
            'reasonForApplying': 'Reason for Applying',
            'physicalAddress': 'Physical Street Address',
            'responsiblePartySSN': 'Responsible Party SSN/ITIN/EIN',
            'stateOfFormation': 'State of Formation',
            'principalActivity': 'Principal Activity',
            'dateBusinessStarted': 'Date Business Started',
            'accountingYear': 'Accounting Year End'
          };
          return fieldLabels[field] || field;
        });

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (isBusinessLicenseService) {
      // Validate Business License specific required fields
      const requiredLicenseFields = [
        'businessName', 'businessType', 'industryCategory', 'primaryActivity',
        'businessState', 'businessCity', 'businessAddress', 'ownerName', 'contactEmail', 'contactPhone'
      ];
      
      const missingFields = requiredLicenseFields
        .filter(field => !formData[field])
        .map(field => {
          const fieldLabels: Record<string, string> = {
            'businessName': 'Business Name',
            'businessType': 'Business Type',
            'industryCategory': 'Industry Category',
            'primaryActivity': 'Primary Business Activity',
            'businessState': 'Business State',
            'businessCity': 'Business City',
            'businessAddress': 'Business Address',
            'ownerName': 'Owner/Applicant Name',
            'contactEmail': 'Contact Email',
            'contactPhone': 'Contact Phone'
          };
          return fieldLabels[field] || field;
        });

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (isFBNService) {
      // Validate FBN specific required fields
      const requiredFBNFields = [
        'fictitiousBusinessName', 'businessOwnerName', 'businessStructure', 
        'businessState', 'businessAddress', 'businessCity', 'businessZip',
        'ownerAddress', 'ownerCity', 'ownerState', 'ownerZip', 'businessActivity'
      ];
      
      const missingFields = requiredFBNFields
        .filter(field => !formData[field])
        .map(field => {
          const fieldLabels: Record<string, string> = {
            'fictitiousBusinessName': 'Fictitious Business Name',
            'businessOwnerName': 'Business Owner Name',
            'businessStructure': 'Business Structure',
            'businessState': 'Business State',
            'businessAddress': 'Business Address',
            'businessCity': 'Business City',
            'businessZip': 'Business ZIP Code',
            'ownerAddress': 'Owner Address',
            'ownerCity': 'Owner City',
            'ownerState': 'Owner State',
            'ownerZip': 'Owner ZIP Code',
            'businessActivity': 'Nature of Business Activity'
          };
          return fieldLabels[field] || field;
        });

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (isRegisteredAgentService) {
      // Validate Registered Agent specific required fields
      const requiredRAFields = [
        'businessEntityName', 'businessEntityType', 'stateOfFormation',
        'businessAddress', 'businessCity', 'businessZip',
        'contactName', 'contactPhone', 'contactEmail', 'serviceAgreement'
      ];
      
      const missingFields = requiredRAFields
        .filter(field => !formData[field])
        .map(field => {
          const fieldLabels: Record<string, string> = {
            'businessEntityName': 'Business Entity Name',
            'businessEntityType': 'Business Entity Type',
            'stateOfFormation': 'State of Formation',
            'businessAddress': 'Business Street Address',
            'businessCity': 'City',
            'businessZip': 'ZIP Code',
            'contactName': 'Contact Name',
            'contactPhone': 'Phone Number',
            'contactEmail': 'Email Address',
            'serviceAgreement': 'I authorize ParaFort Inc. to serve as registered agent'
          };
          return fieldLabels[field] || field;
        });

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (isMailboxService) {
      // Validate Mailbox specific required fields
      const requiredMailboxFields = [
        'fullName', 'phoneNumber', 'dateOfBirth', 'governmentId', 
        'mailingNames', 'termsConsent'
      ];
      
      const missingFields = requiredMailboxFields
        .filter(field => !formData[field])
        .map(field => {
          const fieldLabels: Record<string, string> = {
            'fullName': 'Full Name (as shown on ID)',
            'phoneNumber': 'Phone Number',
            'dateOfBirth': 'Date of Birth',
            'governmentId': 'Government-Issued Photo ID',
            'mailingNames': 'Mailing Name(s)',
            'termsConsent': 'Consent to Terms of Use & Privacy Policy'
          };
          return fieldLabels[field] || field;
        });

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (isBookkeepingService) {
      // Validate Bookkeeping specific required fields
      const requiredBookkeepingFields = [
        'businessName', 'businessType', 'businessIndustry', 'businessEin', 
        'businessAddress', 'businessCity', 'businessState', 'businessZip',
        'primaryContactName', 'primaryContactEmail', 'primaryContactTitle'
      ];
      
      const missingFields = requiredBookkeepingFields
        .filter(field => !formData[field])
        .map(field => {
          const fieldLabels: Record<string, string> = {
            'businessName': 'Business Name',
            'businessType': 'Business Type',
            'businessIndustry': 'Business Industry',
            'businessEin': 'EIN (Employer ID Number)',
            'businessAddress': 'Business Address',
            'businessCity': 'Business City',
            'businessState': 'Business State',
            'businessZip': 'Business ZIP Code',
            'primaryContactName': 'Primary Contact Name',
            'primaryContactEmail': 'Primary Contact Email',
            'primaryContactTitle': 'Primary Contact Title/Role'
          };
          return fieldLabels[field] || field;
        });

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else {
      // Validate regular custom fields
      const missingFields = customFields
        .filter(field => field.isRequired && !formData[field.fieldName])
        .map(field => field.fieldLabel);

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
    }

    onNext(formData);
  };

  const renderCustomField = (field: ServiceCustomField) => {
    const key = `field-${field.id}`;
    
    switch (field.fieldType) {
      case "text":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={field.fieldName}>
              {field.fieldLabel}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.fieldName}
              placeholder={field.placeholder || ""}
              value={formData[field.fieldName] || ""}
              onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
              required={field.isRequired}
            />
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
          </div>
        );
      
      case "select":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={field.fieldName}>
              {field.fieldLabel}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select onValueChange={(value) => handleFieldChange(field.fieldName, value)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.fieldLabel}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
          </div>
        );
      
      case "state":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={field.fieldName}>
              {field.fieldLabel}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select onValueChange={(value) => handleFieldChange(field.fieldName, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
          </div>
        );
      
      case "textarea":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={field.fieldName}>
              {field.fieldLabel}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.fieldName}
              placeholder={field.placeholder || ""}
              value={formData[field.fieldName] || ""}
              onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
              required={field.isRequired}
            />
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
          </div>
        );
      
      case "checkbox":
        return (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={field.fieldName}
              checked={formData[field.fieldName] || false}
              onCheckedChange={(checked) => handleFieldChange(field.fieldName, checked)}
            />
            <Label htmlFor={field.fieldName} className="text-sm">
              {field.fieldLabel}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.helpText && <p className="text-sm text-gray-500 ml-6">{field.helpText}</p>}
          </div>
        );
      
      default:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={field.fieldName}>
              {field.fieldLabel}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.fieldName}
              placeholder={field.placeholder || ""}
              value={formData[field.fieldName] || ""}
              onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
              required={field.isRequired}
            />
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
          </div>
        );
    }
  };

  // Special handling for Registered Agent Service (service ID 30)
  if (isRegisteredAgentService) {
    const businessEntityTypes = [
      "Limited Liability Company (LLC)",
      "Corporation (C-Corp)",
      "Corporation (S-Corp)",
      "Limited Partnership (LP)",
      "Limited Liability Partnership (LLP)",
      "Professional Corporation (PC)",
      "Professional Limited Liability Company (PLLC)",
      "Nonprofit Corporation",
      "Benefit Corporation (B-Corp)",
      "Series LLC",
      "Other"
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Registered Agent Service Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete all required fields for designating your registered agent
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>ParaFort Inc.</strong> will serve as your registered agent. Please provide your business information below to complete the registered agent designation.
              </AlertDescription>
            </Alert>

            {/* ParaFort as Registered Agent Information */}
            <div className="border border-green-500 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-600 mb-3">Your Registered Agent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Company Name:</strong> ParaFort Inc.</p>
                  <p><strong>Address:</strong> 9175 Elk Grove Florin Road, Ste 5</p>
                  <p><strong>City, State, ZIP:</strong> Elk Grove, CA 95624</p>
                </div>
                <div>
                  <p><strong>Business Hours:</strong> 9:00 AM - 5:00 PM PST</p>
                  <p><strong>Services:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Document receipt & notification</li>
                    <li>Email & phone alerts</li>
                    <li>Document scanning & forwarding</li>
                    <li>Online dashboard access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Business Information */}
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-medium">Your Business Information</h3>
                <p className="text-sm text-gray-600">
                  Please provide accurate information about your business entity that ParaFort will represent.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEntityName">
                  Business Entity Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessEntityName"
                  placeholder="Legal business name"
                  value={formData.businessEntityName || ""}
                  onChange={(e) => handleFieldChange('businessEntityName', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  The exact legal name of your business entity as registered with the state.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEntityType">
                  Business Entity Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('businessEntityType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessEntityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stateOfFormation">
                  State of Formation <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('stateOfFormation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  The state where your business entity was formed/incorporated.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEin">
                  Federal EIN (if available)
                </Label>
                <Input
                  id="businessEin"
                  placeholder="XX-XXXXXXX (optional)"
                  value={formData.businessEin || ""}
                  onChange={(e) => handleFieldChange('businessEin', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Your Federal Employer Identification Number if already obtained.
                </p>
              </div>

              {/* Business Address */}
              <div className="space-y-2 md:col-span-2">
                <h4 className="text-md font-medium">Business Principal Address</h4>
                <p className="text-sm text-gray-600">
                  The primary business address (where you conduct business operations).
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessAddress">
                  Business Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessAddress"
                  placeholder="Street address where business operates"
                  value={formData.businessAddress || ""}
                  onChange={(e) => handleFieldChange('businessAddress', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessCity">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessCity"
                  placeholder="City"
                  value={formData.businessCity || ""}
                  onChange={(e) => handleFieldChange('businessCity', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessZip">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessZip"
                  placeholder="ZIP Code"
                  value={formData.businessZip || ""}
                  onChange={(e) => handleFieldChange('businessZip', e.target.value)}
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-2 md:col-span-2">
                <h4 className="text-md font-medium">Primary Contact Information</h4>
                <p className="text-sm text-gray-600">
                  We'll use this information to notify you when we receive legal documents.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">
                  Contact Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="Primary contact person"
                  value={formData.contactName || ""}
                  onChange={(e) => handleFieldChange('contactName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactTitle">
                  Title/Position
                </Label>
                <Input
                  id="contactTitle"
                  placeholder="e.g., Owner, CEO, Manager"
                  value={formData.contactTitle || ""}
                  onChange={(e) => handleFieldChange('contactTitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="(XXX) XXX-XXXX"
                  value={formData.contactPhone || ""}
                  onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                  required
                />
              </div>

              {/* Registered Agent Information */}
              <div className="space-y-2 md:col-span-2">
                <h4 className="text-md font-medium">Registered Agent Information</h4>
                <p className="text-sm text-gray-600">
                  ParaFort Inc. will serve as your registered agent at the following address:
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredAgentName">
                  Registered Agent Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="registeredAgentName"
                  value="ParaFort Inc."
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredAgentState">
                  Physical State <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="registeredAgentState"
                  value="California"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="registeredAgentAddress">
                  Physical Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="registeredAgentAddress"
                  value="9175 Elk Grove Florin Road, Ste 5"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredAgentCity">
                  Physical City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="registeredAgentCity"
                  value="Elk Grove"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredAgentZip">
                  Physical ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="registeredAgentZip"
                  value="95624"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Service Agreement */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviceAgreement"
                    checked={formData.serviceAgreement || false}
                    onCheckedChange={(checked) => handleFieldChange('serviceAgreement', checked)}
                    required
                  />
                  <Label htmlFor="serviceAgreement" className="text-sm">
                    I authorize ParaFort Inc. to serve as registered agent <span className="text-red-500">*</span>
                  </Label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  I authorize ParaFort Inc. to serve as the registered agent for my business entity and to accept service of process and other legal documents on behalf of the entity. I understand that ParaFort will promptly notify me of any documents received.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
              <button
                onClick={handleNext}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '600',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease-in-out',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Continue to Review & Payment
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Special handling for EIN Service (service ID 17)
  if (isEINService) {
    const entityTypes = [
      "Sole Proprietorship",
      "Partnership", 
      "Corporation (C-Corp)",
      "Corporation (S-Corp)",
      "Limited Liability Company (LLC)",
      "Estate",
      "Trust",
      "Non-Profit Organization",
      "Government Agency",
      "Other"
    ];

    const reasonsForApplying = [
      "Started a new business",
      "Hired employees",
      "Banking purposes",
      "Formed an LLC",
      "Formed a corporation", 
      "Created a trust",
      "Estate administration",
      "Non-profit organization",
      "Other"
    ];

    const accountingYearMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            EIN Application Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete all required fields for your Federal Employer Identification Number application
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <AlertDescription>
                All information must be accurate and match your business formation documents. 
                The Responsible Party must be a natural person who ultimately owns or controls the entity.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Legal Name of Entity */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="legalName">
                  Legal Name of Entity/Responsible Party <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="legalName"
                  placeholder="Enter the legal name as registered with your state"
                  value={formData.legalName || ""}
                  onChange={(e) => handleFieldChange('legalName', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  For entities: The legal name registered with your state. For sole proprietors: Your full legal name.
                </p>
              </div>

              {/* 2. Type of Entity */}
              <div className="space-y-2">
                <Label htmlFor="entityType">
                  Type of Entity <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('entityType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Reason for Applying */}
              <div className="space-y-2">
                <Label htmlFor="reasonForApplying">
                  Reason for Applying <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('reasonForApplying', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonsForApplying.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Physical Street Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="physicalAddress">
                  Physical Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="physicalAddress"
                  placeholder="Street address where business is conducted (cannot be P.O. Box)"
                  value={formData.physicalAddress || ""}
                  onChange={(e) => handleFieldChange('physicalAddress', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  The physical location where the business is conducted. Cannot be a P.O. Box.
                </p>
              </div>

              {/* 5. Mailing Address (Optional) */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mailingAddress">
                  Mailing Address (if different from physical address)
                </Label>
                <Input
                  id="mailingAddress"
                  placeholder="P.O. Box or different street address for mail"
                  value={formData.mailingAddress || ""}
                  onChange={(e) => handleFieldChange('mailingAddress', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Can be a P.O. Box or different street address where you receive mail.
                </p>
              </div>

              {/* 6. Responsible Party SSN/ITIN/EIN */}
              <div className="space-y-2">
                <Label htmlFor="responsiblePartySSN">
                  Responsible Party SSN/ITIN/EIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="responsiblePartySSN"
                  placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                  value={formData.responsiblePartySSN || ""}
                  onChange={(e) => handleFieldChange('responsiblePartySSN', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  SSN, ITIN, or existing EIN of the responsible party (natural person who controls the entity).
                </p>
              </div>

              {/* 7. State of Formation */}
              <div className="space-y-2">
                <Label htmlFor="stateOfFormation">
                  State/Country of Formation <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('stateOfFormation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  State where the entity was legally formed (incorporated/organized).
                </p>
              </div>

              {/* 8. Principal Activity */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="principalActivity">
                  Principal Activity of Business <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="principalActivity"
                  placeholder="e.g., Restaurant, Real Estate Investment, Software Development"
                  value={formData.principalActivity || ""}
                  onChange={(e) => handleFieldChange('principalActivity', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Brief description of what the business primarily does.
                </p>
              </div>

              {/* 9. Date Business Started */}
              <div className="space-y-2">
                <Label htmlFor="dateBusinessStarted">
                  Date Business Started <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateBusinessStarted"
                  type="date"
                  value={formData.dateBusinessStarted || ""}
                  onChange={(e) => handleFieldChange('dateBusinessStarted', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Date you began operating the business or acquired an existing business.
                </p>
              </div>

              {/* 10. Accounting Year End */}
              <div className="space-y-2">
                <Label htmlFor="accountingYear">
                  Closing Month of Accounting Year <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('accountingYear', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountingYearMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  The month your business tax year ends (most businesses use December).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue to Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Special handling for S-Corporation Election Service (service ID 10)
  if (service.id === 10) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            S-Corporation Election Information (Form 2553)
          </CardTitle>
          <p className="text-gray-600">
            Please provide the required information for your S-Corporation election filing with the IRS.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Part I: Election Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Part I: Election Information
                </h3>
              </div>

              {/* Line 1a: Legal Name of Corporation */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="legalName">
                  Legal Name of Corporation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="legalName"
                  placeholder="Enter the exact legal name as shown on EIN application or Form SS-4"
                  value={formData.legalName || ""}
                  onChange={(e) => handleFieldChange('legalName', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Must match exactly as shown on your EIN application (Form SS-4).
                </p>
              </div>

              {/* Line 1b: EIN */}
              <div className="space-y-2">
                <Label htmlFor="ein">
                  Employer Identification Number (EIN) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ein"
                  placeholder="XX-XXXXXXX"
                  value={formData.ein || ""}
                  onChange={(e) => handleFieldChange('ein', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Your corporation's 9-digit EIN in XX-XXXXXXX format.
                </p>
              </div>

              {/* Line 2a & 2b: Mailing Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mailingAddress">
                  Mailing Address of Corporation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mailingAddress"
                  placeholder="Street address, city, state, ZIP code"
                  value={formData.mailingAddress || ""}
                  onChange={(e) => handleFieldChange('mailingAddress', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Complete mailing address including street, city, state, and ZIP code.
                </p>
              </div>

              {/* Line 3: Date Incorporated */}
              <div className="space-y-2">
                <Label htmlFor="dateIncorporated">
                  Date Incorporated <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateIncorporated"
                  type="date"
                  value={formData.dateIncorporated || ""}
                  onChange={(e) => handleFieldChange('dateIncorporated', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  The date your corporation was legally incorporated.
                </p>
              </div>

              {/* Line 4: State of Incorporation */}
              <div className="space-y-2">
                <Label htmlFor="stateOfIncorporation">
                  State or Country of Incorporation <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('stateOfIncorporation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Line 5: Effective Date of S-Election */}
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">
                  Effective Date of S-Election <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate || ""}
                  onChange={(e) => handleFieldChange('effectiveDate', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Must align with the start of your tax year (typically January 1).
                </p>
              </div>

              {/* Line 6: Number of Shares */}
              <div className="space-y-2">
                <Label htmlFor="numberOfShares">
                  Number of Shares Issued/Voting on Election Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numberOfShares"
                  type="number"
                  placeholder="Total number of shares"
                  value={formData.numberOfShares || ""}
                  onChange={(e) => handleFieldChange('numberOfShares', e.target.value)}
                  required
                />
              </div>

              {/* Part II: Shareholder Consents */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Part II: Shareholder Information
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> All shareholders must consent to the S-Corporation election. 
                    This is the most common reason for rejection!
                  </p>
                </div>
              </div>

              {/* Shareholder 1 Information */}
              <div className="space-y-2">
                <Label htmlFor="shareholder1Name">
                  Shareholder 1 - Full Legal Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shareholder1Name"
                  placeholder="Full legal name"
                  value={formData.shareholder1Name || ""}
                  onChange={(e) => handleFieldChange('shareholder1Name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shareholder1SSN">
                  Shareholder 1 - SSN/ITIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shareholder1SSN"
                  placeholder="XXX-XX-XXXX"
                  value={formData.shareholder1SSN || ""}
                  onChange={(e) => handleFieldChange('shareholder1SSN', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shareholder1Address">
                  Shareholder 1 - Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shareholder1Address"
                  placeholder="Street address, city, state, ZIP code"
                  value={formData.shareholder1Address || ""}
                  onChange={(e) => handleFieldChange('shareholder1Address', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shareholder1Shares">
                  Shareholder 1 - Number of Shares Owned <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shareholder1Shares"
                  type="number"
                  placeholder="Number of shares"
                  value={formData.shareholder1Shares || ""}
                  onChange={(e) => handleFieldChange('shareholder1Shares', e.target.value)}
                  required
                />
              </div>

              {/* Additional Shareholders */}
              <div className="space-y-2">
                <Label htmlFor="additionalShareholders">
                  Additional Shareholders
                </Label>
                <Textarea
                  id="additionalShareholders"
                  placeholder="If there are additional shareholders, list their full legal name, SSN/ITIN, address, and number of shares owned for each"
                  value={formData.additionalShareholders || ""}
                  onChange={(e) => handleFieldChange('additionalShareholders', e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  For each additional shareholder, include: Full legal name, SSN/ITIN, complete address, and number of shares owned.
                </p>
              </div>

              {/* Part III: Tax Year */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Part III: Tax Year
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxYear">
                  Tax Year <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('taxYear', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calendar">Calendar Year (January 1 - December 31)</SelectItem>
                    <SelectItem value="fiscal">Fiscal Year (Other - requires IRS approval)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Most corporations use the calendar year. Fiscal year requires IRS approval and justification.
                </p>
              </div>

              {/* Part IV: Signatures */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Part IV: Officer Signature Information
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerName">
                  Officer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signerName"
                  placeholder="Full name of corporate officer"
                  value={formData.signerName || ""}
                  onChange={(e) => handleFieldChange('signerName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerTitle">
                  Officer Title <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('signerTitle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="President">President</SelectItem>
                    <SelectItem value="Vice President">Vice President</SelectItem>
                    <SelectItem value="Secretary">Secretary</SelectItem>
                    <SelectItem value="Treasurer">Treasurer</SelectItem>
                    <SelectItem value="CFO">Chief Financial Officer (CFO)</SelectItem>
                    <SelectItem value="CEO">Chief Executive Officer (CEO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatureDate">
                  Date Signed <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signatureDate"
                  type="date"
                  value={formData.signatureDate || ""}
                  onChange={(e) => handleFieldChange('signatureDate', e.target.value)}
                  required
                />
              </div>

              {/* Consent Statement */}
              <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentStatement"
                    checked={formData.consentStatement || false}
                    onCheckedChange={(checked) => handleFieldChange('consentStatement', checked)}
                    required
                  />
                  <Label htmlFor="consentStatement" className="text-sm leading-relaxed">
                    I acknowledge that all shareholders listed above consent to the S-Corporation election, 
                    and I certify that the information provided is accurate and complete. I understand that 
                    this election will be effective for the tax year specified above. <span className="text-red-500">*</span>
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue to Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Special handling for FBN/DBA Service (service ID 25) - also force if URL contains /25
  if (isFBNService || forceFBNForm) {
    const businessStructures = [
      "Sole Proprietorship",
      "Partnership", 
      "Limited Liability Company (LLC)",
      "Corporation",
      "Limited Partnership (LP)",
      "Limited Liability Partnership (LLP)"
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Fictitious Business Name Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete all required fields for your Fictitious Business Name (DBA) filing
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Notification about jurisdiction fees */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-700">
                🔹 <strong>Fictitious Business Name & Publication Fees</strong><br />
                Jurisdiction-specific fees will be calculated and charged later based on your business location.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fictitious Business Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fictitiousBusinessName">
                  Fictitious Business Name (DBA) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fictitiousBusinessName"
                  placeholder="Enter the desired fictitious business name"
                  value={formData.fictitiousBusinessName || ""}
                  onChange={(e) => handleFieldChange('fictitiousBusinessName', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  The name you want to do business under (different from your legal name)
                </p>
              </div>

              {/* Business Owner/Registrant Information */}
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Business Owner Information
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessOwnerName">
                  Business Owner Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessOwnerName"
                  placeholder="Full legal name of business owner"
                  value={formData.businessOwnerName || ""}
                  onChange={(e) => handleFieldChange('businessOwnerName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessStructure">
                  Business Structure <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('businessStructure', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessStructures.map((structure) => (
                      <SelectItem key={structure} value={structure}>
                        {structure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Business Address Information */}
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Business Address
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">
                  Business Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessAddress"
                  placeholder="Street address where business is conducted"
                  value={formData.businessAddress || ""}
                  onChange={(e) => handleFieldChange('businessAddress', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessCity">
                  Business City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessCity"
                  placeholder="City"
                  value={formData.businessCity || ""}
                  onChange={(e) => handleFieldChange('businessCity', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessState">
                  Business State <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('businessState', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessZip">
                  Business ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessZip"
                  placeholder="ZIP Code"
                  value={formData.businessZip || ""}
                  onChange={(e) => handleFieldChange('businessZip', e.target.value)}
                  required
                />
              </div>

              {/* Owner Address Information */}
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Owner Address
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerAddress">
                  Owner Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerAddress"
                  placeholder="Owner's residential or business address"
                  value={formData.ownerAddress || ""}
                  onChange={(e) => handleFieldChange('ownerAddress', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerCity">
                  Owner City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerCity"
                  placeholder="City"
                  value={formData.ownerCity || ""}
                  onChange={(e) => handleFieldChange('ownerCity', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerState">
                  Owner State <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('ownerState', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerZip">
                  Owner ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerZip"
                  placeholder="ZIP Code"
                  value={formData.ownerZip || ""}
                  onChange={(e) => handleFieldChange('ownerZip', e.target.value)}
                  required
                />
              </div>

              {/* Business Activity */}
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Business Activity
                </h3>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessActivity">
                  Nature of Business Activity <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="businessActivity"
                  placeholder="Describe the nature of business to be conducted under the fictitious name"
                  value={formData.businessActivity || ""}
                  onChange={(e) => handleFieldChange('businessActivity', e.target.value)}
                  required
                  className="min-h-[100px]"
                />
                <p className="text-sm text-gray-500">
                  Provide a clear description of what your business does or will do
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue to Payment
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use specialized Annual Report Form for service ID 5
  if (service.id === 5) {
    return (
      <div className="w-full">
        <AnnualReportForm
          onSubmit={(data) => {
            // Transform the Annual Report Form data to match expected format
            const transformedData = {
              state: data.state,
              entityType: data.entityType,
              businessName: data.businessName,
              fileNumber: data.fileNumber,
              principalAddress: `${data.principalAddress.street}, ${data.principalAddress.city}, ${data.principalAddress.state} ${data.principalAddress.zipCode}`,
              mailingAddress: data.mailingAddress ? `${data.mailingAddress.street}, ${data.mailingAddress.city}, ${data.mailingAddress.state} ${data.mailingAddress.zipCode}` : '',
              registeredAgentName: data.registeredAgent.name,
              registeredAgentAddress: `${data.registeredAgent.address.street}, ${data.registeredAgent.address.city}, ${data.registeredAgent.address.state} ${data.registeredAgent.address.zipCode}`,
              officers: data.membersOrOfficers,
              businessPurpose: data.businessPurpose || '',
              naicsCode: data.naicsCode || '',
              stateOfFormation: data.stateOfFormation || '',
              signerName: data.signerName,
              signerTitle: data.signerTitle,
              filingFee: data.filingFee,
              // Include all form data for reference
              annualReportFormData: data
            };
            onNext(transformedData);
          }}
          loading={false}
        />
        {/* Custom navigation for Annual Report Form */}
        <div className="mt-6 flex gap-4 max-w-4xl mx-auto">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Special handling for Business License Service (service ID 8)
  if (isBusinessLicenseService) {
    const businessTypes = [
      "Sole Proprietorship",
      "Partnership",
      "Limited Liability Company (LLC)",
      "Corporation (C-Corp)",
      "Corporation (S-Corp)",
      "Professional Corporation (PC)",
      "Limited Partnership (LP)",
      "Limited Liability Partnership (LLP)",
      "Non-Profit Organization"
    ];

    const industryCategories = [
      "Restaurant & Food Service",
      "Retail & Commercial",
      "Professional Services",
      "Construction & Contracting",
      "Healthcare & Medical",
      "Beauty & Personal Care",
      "Automotive Services",
      "Real Estate",
      "Technology & Software",
      "Manufacturing",
      "Transportation & Logistics",
      "Entertainment & Recreation",
      "Education & Training",
      "Financial Services",
      "Home-Based Business",
      "Online/E-commerce",
      "Other"
    ];

    // Get jurisdiction-specific fields based on selected state
    const getJurisdictionFields = (state: string) => {
      const commonFields = {
        licenseTypes: ["General Business License", "Professional License", "Trade License", "Home Occupation Permit"],
        additionalRequirements: []
      };

      switch (state) {
        case "CA": // California
          return {
            ...commonFields,
            licenseTypes: [...commonFields.licenseTypes, "Seller's Permit", "Resale Certificate", "ABC License (Alcohol)", "Contractor's License"],
            additionalRequirements: ["Worker's Compensation Insurance", "Professional Liability Insurance", "Environmental Permits"]
          };
        case "NY": // New York
          return {
            ...commonFields,
            licenseTypes: [...commonFields.licenseTypes, "Certificate of Authority", "Sales Tax Certificate", "Liquor License", "Professional License"],
            additionalRequirements: ["Certificate of Good Standing", "Publication Requirements", "Workers' Compensation Coverage"]
          };
        case "TX": // Texas
          return {
            ...commonFields,
            licenseTypes: [...commonFields.licenseTypes, "Sales and Use Tax Permit", "Franchise Tax Account", "Assumed Name Certificate", "Professional License"],
            additionalRequirements: ["Texas State Registration", "Local Municipal Permits", "Zoning Compliance"]
          };
        case "FL": // Florida
          return {
            ...commonFields,
            licenseTypes: [...commonFields.licenseTypes, "Sales Tax Registration", "Fictitious Name Registration", "Professional License", "Local Business Tax Receipt"],
            additionalRequirements: ["Workers' Compensation Exemption/Coverage", "Professional Registration", "Environmental Permits"]
          };
        default:
          return commonFields;
      }
    };

    const selectedState = formData.businessState || "";
    const jurisdictionData = getJurisdictionFields(selectedState);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Business License Application Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete all required fields for your business license application. Fields may vary based on your jurisdiction and business type.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <AlertDescription>
                Business license requirements vary significantly by state, county, and municipality. 
                We'll help identify the specific licenses needed for your business and location.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Business Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Basic Business Information
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">
                  Legal Business Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessName"
                  placeholder="Enter your legal business name"
                  value={formData.businessName || ""}
                  onChange={(e) => handleFieldChange('businessName', e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  Use the exact legal name as registered with your state
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">
                  Business Entity Type <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industryCategory">
                  Industry Category <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('industryCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry category" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryActivity">
                  Primary Business Activity <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="primaryActivity"
                  placeholder="Describe what your business does (e.g., sell handmade jewelry, provide consulting services, operate a restaurant)"
                  value={formData.primaryActivity || ""}
                  onChange={(e) => handleFieldChange('primaryActivity', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              {/* Business Location */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Business Location
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessState">
                  Business Operating State <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('businessState', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  State where your business primarily operates
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessCity">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessCity"
                  placeholder="Enter city name"
                  value={formData.businessCity || ""}
                  onChange={(e) => handleFieldChange('businessCity', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessAddress">
                  Business Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessAddress"
                  placeholder="Enter complete business address"
                  value={formData.businessAddress || ""}
                  onChange={(e) => handleFieldChange('businessAddress', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessZip">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessZip"
                  placeholder="12345"
                  value={formData.businessZip || ""}
                  onChange={(e) => handleFieldChange('businessZip', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">
                  County
                </Label>
                <Input
                  id="county"
                  placeholder="Enter county name"
                  value={formData.county || ""}
                  onChange={(e) => handleFieldChange('county', e.target.value)}
                />
              </div>

              {/* Contact Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Contact Information
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">
                  Owner/Applicant Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  placeholder="Full legal name"
                  value={formData.ownerName || userProfile?.firstName + " " + userProfile?.lastName || ""}
                  onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  Contact Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="business@example.com"
                  value={formData.contactEmail || userProfile?.email || ""}
                  onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  Contact Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="(555) 123-4567"
                  value={formData.contactPhone || ""}
                  onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="federalEIN">
                  Federal EIN (if available)
                </Label>
                <Input
                  id="federalEIN"
                  placeholder="12-3456789"
                  value={formData.federalEIN || ""}
                  onChange={(e) => handleFieldChange('federalEIN', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Enter if you already have an EIN. We can help you obtain one if needed.
                </p>
              </div>

              {/* Jurisdiction-Specific Requirements */}
              {selectedState && (
                <>
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                      {US_STATES.find(s => s.value === selectedState)?.label} Specific Requirements
                    </h3>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      License Types Needed (Check all that apply)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {jurisdictionData.licenseTypes.map((licenseType) => (
                        <div key={licenseType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`license-${licenseType}`}
                            checked={formData.selectedLicenses?.includes(licenseType) || false}
                            onCheckedChange={(checked) => {
                              const currentLicenses = formData.selectedLicenses || [];
                              if (checked) {
                                handleFieldChange('selectedLicenses', [...currentLicenses, licenseType]);
                              } else {
                                handleFieldChange('selectedLicenses', currentLicenses.filter((l: string) => l !== licenseType));
                              }
                            }}
                          />
                          <Label htmlFor={`license-${licenseType}`} className="text-sm">
                            {licenseType}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {jurisdictionData.additionalRequirements.length > 0 && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>
                        Additional Requirements (Check if applicable)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {jurisdictionData.additionalRequirements.map((requirement) => (
                          <div key={requirement} className="flex items-center space-x-2">
                            <Checkbox
                              id={`req-${requirement}`}
                              checked={formData.additionalRequirements?.includes(requirement) || false}
                              onCheckedChange={(checked) => {
                                const currentReqs = formData.additionalRequirements || [];
                                if (checked) {
                                  handleFieldChange('additionalRequirements', [...currentReqs, requirement]);
                                } else {
                                  handleFieldChange('additionalRequirements', currentReqs.filter((r: string) => r !== requirement));
                                }
                              }}
                            />
                            <Label htmlFor={`req-${requirement}`} className="text-sm">
                              {requirement}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Business Operations */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Business Operations
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">
                  Number of Employees
                </Label>
                <Select onValueChange={(value) => handleFieldChange('employeeCount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Just me (no employees)</SelectItem>
                    <SelectItem value="1-5">1-5 employees</SelectItem>
                    <SelectItem value="6-10">6-10 employees</SelectItem>
                    <SelectItem value="11-25">11-25 employees</SelectItem>
                    <SelectItem value="26-50">26-50 employees</SelectItem>
                    <SelectItem value="51+">51+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Expected Business Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialRequirements">
                  Special Requirements or Notes
                </Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special requirements, existing licenses, or additional information about your business"
                  value={formData.specialRequirements || ""}
                  onChange={(e) => handleFieldChange('specialRequirements', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Timeline and Service Level */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 mt-6">
                  Service Preferences
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">
                  How soon do you need the license? <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleFieldChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASAP">ASAP (Rush processing)</SelectItem>
                    <SelectItem value="1-2 weeks">Within 1-2 weeks</SelectItem>
                    <SelectItem value="1 month">Within 1 month</SelectItem>
                    <SelectItem value="2-3 months">Within 2-3 months</SelectItem>
                    <SelectItem value="flexible">I'm flexible with timing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assistanceLevel">
                  Level of Assistance Needed
                </Label>
                <Select onValueChange={(value) => handleFieldChange('assistanceLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assistance level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guidance">Guidance only - I'll handle applications myself</SelectItem>
                    <SelectItem value="partial">Partial assistance - Help with research and preparation</SelectItem>
                    <SelectItem value="full">Full service - Handle everything for me</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue to Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mailbox Service Form
  if (isMailboxService) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Digital Mailbox Service - Customer Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            For USPS Form 1583 & KYC compliance, we need to verify your identity and collect mailing preferences.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {userProfile && (
              <Alert>
                <AlertDescription>
                  Some fields have been pre-filled with your profile information. You can edit them if needed.
                </AlertDescription>
              </Alert>
            )}

            {/* Customer Identification Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                1. Customer Identification (USPS Form 1583 & KYC Compliance)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name (as shown on ID) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    value={formData.fullName || (userProfile ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() : '')}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.emailAddress || userProfile?.email || ""}
                    onChange={(e) => handleFieldChange('emailAddress', e.target.value)}
                    required
                    disabled
                  />
                  <p className="text-sm text-gray-500">Pre-populated from your account</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="(555) 123-4567"
                    value={formData.phoneNumber || ""}
                    onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">For identity verification purposes</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="governmentId">
                    Government-Issued Photo ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="governmentId"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFieldChange('governmentId', file);
                    }}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Upload a clear scan or photo of your driver's license, passport, or state ID
                  </p>
                </div>
              </div>
            </div>

            {/* Mailing & Forwarding Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                2. Mailing & Forwarding Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mailingNames">
                    Mailing Name(s) <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="mailingNames"
                    placeholder="Enter all names that should receive mail at this address (e.g., John Smith, ABC Company, Jane Smith)"
                    value={formData.mailingNames || ""}
                    onChange={(e) => handleFieldChange('mailingNames', e.target.value)}
                    rows={3}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    List all recipients for this mailbox (business names, spouse names, etc.)
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessName">
                    Business Name (if applicable)
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="ABC Company LLC"
                    value={formData.businessName || ""}
                    onChange={(e) => handleFieldChange('businessName', e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Enter if this mailbox will be used for commercial mail handling
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="forwardingAddress">
                    Forwarding Address (optional)
                  </Label>
                  <Textarea
                    id="forwardingAddress"
                    placeholder="123 Main St, Anytown, State 12345"
                    value={formData.forwardingAddress || ""}
                    onChange={(e) => handleFieldChange('forwardingAddress', e.target.value)}
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    Enter where physical mail should be forwarded (leave blank for digital-only service)
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Service Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                3. Service Agreement & Legal Information
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Digital Mailbox Address Information</h4>
                  <p className="text-sm text-blue-800">
                    <strong>Provider:</strong> ParaFort Inc.<br/>
                    <strong>Your Digital Mailbox Address:</strong> 9175 Elk Grove Florin Road, Ste 5, Elk Grove, CA 95624<br/>
                    <strong>Service:</strong> ParaFort Inc. will provide secure digital mailbox services at this address.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="termsConsent"
                    checked={formData.termsConsent || false}
                    onCheckedChange={(checked) => handleFieldChange('termsConsent', checked)}
                    required
                  />
                  <div className="space-y-1">
                    <Label htmlFor="termsConsent" className="text-sm leading-relaxed">
                      I consent to the Terms of Use & Privacy Policy <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-gray-600">
                      I authorize ParaFort Inc. to receive mail on my behalf and understand that this service includes digital mail processing, 
                      forwarding, and secure handling of my correspondence. I acknowledge that ParaFort Inc. will provide digital mailbox services 
                      at the specified address and I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                      <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue to Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Special handling for Bookkeeping Services
  if (isBookkeepingService) {
    const businessTypes = [
      "Sole Proprietorship",
      "Partnership", 
      "Limited Liability Company (LLC)",
      "Corporation (C-Corp)",
      "Corporation (S-Corp)",
      "Professional Corporation (PC)",
      "Nonprofit Organization",
      "Other"
    ];

    const industries = [
      "Accounting & Finance",
      "Agriculture & Farming",
      "Architecture & Engineering",
      "Arts & Entertainment",
      "Automotive",
      "Construction & Real Estate",
      "Consulting & Professional Services",
      "Education & Training",
      "Energy & Utilities",
      "Food & Beverage",
      "Government & Public Administration",
      "Healthcare & Medical",
      "Information Technology",
      "Insurance",
      "Legal Services",
      "Manufacturing",
      "Marketing & Advertising",
      "Media & Communications",
      "Nonprofit & Social Services",
      "Retail & E-commerce",
      "Transportation & Logistics",
      "Travel & Hospitality",
      "Other"
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Business Information for Bookkeeping Services
          </CardTitle>
          <p className="text-sm text-gray-600">
            Please provide comprehensive business information to set up your bookkeeping and accounting services
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {userProfile && (
              <Alert>
                <AlertDescription>
                  Some fields have been pre-filled with your profile information. You can edit them if needed.
                </AlertDescription>
              </Alert>
            )}

            {/* Section 1: Business Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                1. Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Business Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Your business name"
                    value={formData.businessName || ""}
                    onChange={(e) => handleFieldChange('businessName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">
                    Business Type <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleFieldChange('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessIndustry">
                    Business Industry <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleFieldChange('businessIndustry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEin">
                    EIN (Employer ID Number) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessEin"
                    placeholder="XX-XXXXXXX"
                    value={formData.businessEin || ""}
                    onChange={(e) => handleFieldChange('businessEin', e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Required for bookkeeping services. If you don't have one, we can help you apply.
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessAddress">
                    Business Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessAddress"
                    placeholder="Street address"
                    value={formData.businessAddress || ""}
                    onChange={(e) => handleFieldChange('businessAddress', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessCity">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessCity"
                    placeholder="City"
                    value={formData.businessCity || ""}
                    onChange={(e) => handleFieldChange('businessCity', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessState">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleFieldChange('businessState', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessZip">
                    ZIP Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessZip"
                    placeholder="ZIP Code"
                    value={formData.businessZip || ""}
                    onChange={(e) => handleFieldChange('businessZip', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stateOfIncorporation">
                    State of Incorporation/Formation
                  </Label>
                  <Select onValueChange={(value) => handleFieldChange('stateOfIncorporation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    The state where your business entity was formed
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Owner/Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                2. Owner/Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryContactName">
                    Primary Contact Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="primaryContactName"
                    placeholder="Full name"
                    value={formData.primaryContactName || (userProfile ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() : '')}
                    onChange={(e) => handleFieldChange('primaryContactName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryContactTitle">
                    Title/Role <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="primaryContactTitle"
                    placeholder="e.g., Owner, CEO, Manager"
                    value={formData.primaryContactTitle || ""}
                    onChange={(e) => handleFieldChange('primaryContactTitle', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryContactEmail">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="primaryContactEmail"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.primaryContactEmail || userProfile?.email || ""}
                    onChange={(e) => handleFieldChange('primaryContactEmail', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryContactPhone">
                    Phone Number
                  </Label>
                  <Input
                    id="primaryContactPhone"
                    placeholder="(555) 123-4567"
                    value={formData.primaryContactPhone || ""}
                    onChange={(e) => handleFieldChange('primaryContactPhone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerSSN">
                    Owner SSN/ITIN (for tax purposes)
                  </Label>
                  <Input
                    id="ownerSSN"
                    placeholder="XXX-XX-XXXX"
                    value={formData.ownerSSN || ""}
                    onChange={(e) => handleFieldChange('ownerSSN', e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Required for certain tax filings and reports
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownershipPercentage">
                    Ownership Percentage
                  </Label>
                  <Input
                    id="ownershipPercentage"
                    placeholder="100%"
                    value={formData.ownershipPercentage || ""}
                    onChange={(e) => handleFieldChange('ownershipPercentage', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Document Uploads */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                3. Document Uploads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="articlesOfIncorporation">
                    Articles of Incorporation/Organization
                  </Label>
                  <Input
                    id="articlesOfIncorporation"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFieldChange('articlesOfIncorporation', file);
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Upload your formation documents (PDF, JPG, PNG)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingAgreement">
                    Operating Agreement/Bylaws
                  </Label>
                  <Input
                    id="operatingAgreement"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFieldChange('operatingAgreement', file);
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Upload your operating agreement or corporate bylaws
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="einConfirmationLetter">
                    EIN Confirmation Letter
                  </Label>
                  <Input
                    id="einConfirmationLetter"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFieldChange('einConfirmationLetter', file);
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Upload your IRS EIN confirmation letter (Form CP575)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankStatements">
                    Recent Bank Statements
                  </Label>
                  <Input
                    id="bankStatements"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleFieldChange('bankStatements', files);
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Upload last 3 months of business bank statements
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousTaxReturns">
                    Previous Tax Returns (if available)
                  </Label>
                  <Input
                    id="previousTaxReturns"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleFieldChange('previousTaxReturns', files);
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Upload previous year's tax returns if available
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalDocuments">
                    Additional Business Documents
                  </Label>
                  <Input
                    id="additionalDocuments"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleFieldChange('additionalDocuments', files);
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Upload any other relevant business documents
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default form for other services
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Required Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {userProfile && (
            <Alert>
              <AlertDescription>
                Some fields have been pre-filled with your profile information. You can edit them if needed.
              </AlertDescription>
            </Alert>
          )}

          {customFields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customFields
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map(renderCustomField)}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No additional information required for this service.
            </p>
          )}
          
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="flex-1">
              Continue to Review
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Step 4: Final Review & Checkout (with Payment)
function Step4ReviewPayment({ 
  service,
  step1Data,
  step2Data, 
  step3Data,
  clientSecret,
  onBack,
  onSuccess 
}: { 
  service: Service;
  step1Data: any;
  step2Data: any; 
  step3Data: any;
  clientSecret: string;
  onBack: () => void;
  onSuccess: (paymentIntentId?: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout-success`,
        },
        redirect: "if_required"
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Pass the payment intent ID to the success handler
        onSuccess(paymentIntent.id);
      } else {
        // Fallback for cases where paymentIntent might not be available
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <PaymentElement 
                options={{
                  layout: "tabs",
                  wallets: {
                    applePay: "never",
                    googlePay: "never"
                  }
                }}
              />
              
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack} 
                  className="flex-1" 
                  disabled={isProcessing}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={!stripe || isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay $${(() => {
                    // Only use the service pricing, not state filing fees (paid separately to state)
                    return step2Data.pricing.totalPrice.toFixed(2);
                  })()}`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Order Review Sidebar */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Order Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Details */}
            <div>
              <h4 className="font-semibold mb-2">Service</h4>
              <p className="text-sm">{service.name}</p>
              <div className="text-right">${step2Data.pricing.basePrice.toFixed(2)}</div>
            </div>

            {/* Annual Report Specific Fees */}
            {service.id === 5 && step3Data?.annualReportFormData && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Additional Fees</h4>
                  
                  {/* State Filing Fee - Show actual fee based on state and entity type */}
                  <div className="flex justify-between text-sm">
                    <span>State Filing Fee ({step3Data.annualReportFormData.state})</span>
                    <span>
                      {(() => {
                        const state = step3Data.annualReportFormData.state;
                        const entityType = step3Data.annualReportFormData.entityType;
                        
                        if (state && entityType) {
                          const stateFilingInfo = getStateFilingFee(state, entityType as any);
                          if (stateFilingInfo) {
                            return `$${stateFilingInfo.fee.toFixed(2)}`;
                          }
                        }
                        
                        return "$0.00"; // Default for unknown combinations
                      })()}
                    </span>
                  </div>
                  
                  {/* Registered Agent Fee - Free if ParaFort selected */}
                  {step3Data.annualReportFormData.registeredAgent?.type === 'parafort' && (
                    <div className="flex justify-between text-sm">
                      <span>Registered Agent Fee (1st Year)</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  )}
                </div>
                
                {/* Recurring Fee Notice */}
                {step3Data.annualReportFormData.registeredAgent?.type === 'parafort' && (
                  <>
                    <Separator />
                    <div className="bg-white border-2 border-green-500 p-3 rounded-lg">
                      <h4 className="font-semibold mb-1 text-sm text-green-800">Recurring Fees</h4>
                      <div className="text-xs text-green-700 space-y-1">
                        <div>• Registered Agent: $75/year (after 1st year)</div>
                        <div>• Can cancel anytime</div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Add-ons */}
            {step2Data.selectedAddOns?.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Add-ons</h4>
                  {step2Data.selectedAddOns.map((addOn: any) => (
                    <div key={addOn.id} className="flex justify-between text-sm">
                      <span>{addOn.name}</span>
                      <span>+${addOn.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Processing Speed - Hide for Business Licenses */}
            {service?.name !== "Business Licenses" && step2Data.pricing.expeditedFee > 0 && (
              <>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Expedited Processing</span>
                  <span>+${step2Data.pricing.expeditedFee.toFixed(2)}</span>
                </div>
              </>
            )}

            <Separator />

            {/* Contact Information */}
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <div className="text-sm space-y-1">
                {step3Data ? (
                  <>
                    <p>{step3Data.firstName} {step3Data.lastName}</p>
                    <p>{step1Data.email}</p>
                    {step3Data.phone && <p>{step3Data.phone}</p>}
                  </>
                ) : (
                  <>
                    <p>{step1Data.user?.firstName} {step1Data.user?.lastName}</p>
                    <p>{step1Data.email}</p>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Total - Service fee only (state fees paid separately) */}
            <div className="flex justify-between font-bold text-lg">
              <span>Total (Service Fee)</span>
              <span className="text-green-600">
                ${step2Data.pricing.totalPrice.toFixed(2)}
              </span>
            </div>
            
            {/* Note about state fees */}
            {service.id === 5 && step3Data?.annualReportFormData && (
              <div className="text-xs text-gray-500 mt-2">
                <p>* State filing fees are paid separately to your state government</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Step 5: Confirmation & Notification
function Step5Confirmation({ orderData }: { orderData: any }) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've sent a confirmation email to {orderData.email} 
          with your order details and next steps.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          <div className="text-left space-y-2">
            <p>• Your order has been added to our admin dashboard</p>
            <p>• Our team has been notified and will begin processing your request</p>
            <p>• You'll receive updates via email as we progress</p>
            <p>• Estimated completion: {orderData.processingSpeed === 'expedited' ? '1-3 business days' : '7-10 business days'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = '/dashboard'} 
            className="w-full"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'} 
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Multi-Step Checkout Component
export default function MultiStepCheckout() {
  const [location] = useLocation();
  // Extract serviceId from URL path manually since useParams seems to have issues
  const pathParts = location.split('/');
  const serviceId = pathParts[pathParts.length - 1]; // Get the last part of the path
  
  // Define service type checks
  const isRegisteredAgentPlan = serviceId?.startsWith('registered-agent-');
  const isMailboxPlan = serviceId?.startsWith('mailbox-');
  const isBookkeepingPlan = serviceId?.startsWith('bookkeeping-');
  
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripe, setStripe] = useState<any>(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const { toast } = useToast();

  // Initialize Stripe when component mounts
  useEffect(() => {
    const loadStripe = async () => {
      try {
        const stripeInstance = await initializeStripe();
        setStripe(stripeInstance);
        setStripeLoaded(true);
      } catch (error) {
        console.error("Failed to load Stripe:", error);
        setStripeLoaded(true); // Still set to true to prevent infinite loading
      }
    };
    
    loadStripe();
  }, []);

  // Fetch service data - handle regular services, registered agent plans, mailbox plans, and bookkeeping plans
  const { data: service = {} as Service, isLoading: serviceLoading } = useQuery({
    queryKey: isRegisteredAgentPlan ? [`/api/registered-agent-plans`] : isMailboxPlan ? [`/api/mailbox-plans`] : isBookkeepingPlan ? [`/api/bookkeeping/plans`] : [`/api/services/${serviceId}`],
    enabled: !!serviceId,
    select: (data: any) => {
      if (isRegisteredAgentPlan && Array.isArray(data)) {
        // Find the specific registered agent plan and transform to match service format
        const planId = parseInt(serviceId?.replace('registered-agent-', '') || '0');
        const plan = data.find((p: any) => p.id === planId);
        if (plan) {
          return {
            id: `registered-agent-${plan.id}`,
            name: `${plan.displayName || plan.name}`,
            description: plan.description,
            oneTimePrice: null,
            recurringPrice: parseFloat(plan.yearlyPrice),
            recurringInterval: 'year',
            category: 'Business Services',
            isActive: true,
            features: plan.features || [],
            isRegisteredAgentPlan: true
          };
        }
      } else if (isMailboxPlan && Array.isArray(data)) {
        // Find the specific mailbox plan and transform to match service format
        const planId = parseInt(serviceId?.replace('mailbox-', '') || '0');
        const plan = data.find((p: any) => p.id === planId);
        if (plan) {
          return {
            id: `mailbox-${plan.id}`,
            name: plan.displayName,
            description: `Digital mailbox service with ${plan.businessAddresses} business address and ${plan.mailItemsPerMonth} mail items per month`,
            oneTimePrice: null,
            recurringPrice: plan.monthlyPrice,
            recurringInterval: 'month',
            category: 'Digital Services',
            isActive: true,
            features: [
              `${plan.businessAddresses} business address`,
              `${plan.mailItemsPerMonth} mail items per month`,
              `$${plan.costPerExtraItem} per additional item`,
              `$${plan.shippingCost} shipping cost`,
              plan.secureShredding ? 'Secure shredding included' : null,
              `Check deposit: $${plan.checkDepositFee}/month`,
              `${plan.checksIncluded} checks included`,
              `$${plan.additionalCheckFee} per additional check`
            ].filter(Boolean),
            isMailboxPlan: true
          };
        }
      } else if (isBookkeepingPlan && Array.isArray(data)) {
        // Find the specific bookkeeping plan and transform to match service format
        const planId = parseInt(serviceId?.replace('bookkeeping-', '') || '0');
        const plan = data.find((p: any) => p.id === planId);
        if (plan) {
          return {
            id: `bookkeeping-${plan.id}`,
            name: plan.name,
            description: plan.description,
            oneTimePrice: null,
            recurringPrice: plan.monthlyPrice / 100, // Convert from cents
            recurringInterval: 'month',
            category: 'Accounting Services',
            isActive: true,
            features: plan.features || [],
            isBookkeepingPlan: true
          };
        }
      }
      return data;
    }
  });

  // Initialize registered agent form data with ParaFort information
  useEffect(() => {
    if (serviceId === '30' && service && typeof service === 'object' && 'id' in service) {
      setFormData(prevData => ({
        ...prevData,
        // ParaFort registered agent information (read-only fields)
        registeredAgentName: 'ParaFort Inc.',
        physicalStreetAddress: '9175 Elk Grove Florin Road, Ste 5',
        physicalCity: 'Elk Grove',
        physicalState: 'California',
        physicalZip: '95624'
      }));
    }
  }, [serviceId, service]);

  // Debug main component to see serviceId extraction
  console.log('Main - URL location:', location);
  console.log('Main - serviceId extracted:', serviceId, 'Type:', typeof serviceId);
  console.log('Main - service data loaded:', service, 'Keys:', service && typeof service === 'object' ? Object.keys(service) : []);
  console.log('Main - has service id property:', !!(service as any)?.id);
  console.log('Main - service loading state:', serviceLoading);

  // Fetch service add-ons (skip for registered agent plans, mailbox plans, and bookkeeping plans)
  const { data: addOns = [] as ServiceAddOn[], isLoading: addOnsLoading } = useQuery({
    queryKey: [`/api/services/${serviceId}/add-ons`],
    enabled: !!serviceId && !isRegisteredAgentPlan && !isMailboxPlan && !isBookkeepingPlan,
  });

  // Fetch custom fields (skip for registered agent plans, mailbox plans, and bookkeeping plans)
  const { data: customFields = [] as ServiceCustomField[], isLoading: fieldsLoading } = useQuery({
    queryKey: [`/api/services/${serviceId}/custom-fields`],
    enabled: !!serviceId && !isRegisteredAgentPlan && !isMailboxPlan && !isBookkeepingPlan,
  });

  // Create payment intent when reaching payment step
  const createPaymentMutation = useMutation({
    mutationFn: async (orderData: any) => {
      console.log("Creating payment intent with data:", orderData);
      
      // Ensure we have valid pricing data
      if (!orderData.step2Data?.pricing?.totalPrice) {
        throw new Error("Missing pricing data for payment intent");
      }
      
      const paymentData = {
        amount: orderData.step2Data.pricing.totalPrice.toFixed(2),
        currency: "usd",
        serviceId: parseInt(serviceId!),
        serviceName: (service as any)?.name || "Service",
        metadata: orderData
      };
      
      console.log("Payment request data:", paymentData);
      const response = await apiRequest("POST", "/api/create-payment-intent", paymentData);
      const responseData = await response.json();
      console.log("Payment response data:", responseData);
      return responseData;
    },
    onSuccess: (responseData: any) => {
      console.log("Payment intent created successfully:", responseData);
      if (responseData.clientSecret) {
        setClientSecret(responseData.clientSecret);
        setCurrentStep(4);
      } else {
        throw new Error("No client secret received from payment intent");
      }
    },
    onError: (error) => {
      console.error("Payment intent creation failed:", error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStepComplete = (stepNumber: number, data: any) => {
    const updatedFormData = { ...formData, [`step${stepNumber}Data`]: data };
    setFormData(updatedFormData);
    
    console.log(`Step ${stepNumber} completed with data:`, data);
    console.log("Updated form data:", updatedFormData);
    
    // For BOIR Filing (service ID 11), skip Step 3 and go directly to payment
    if (stepNumber === 2 && serviceId === "11") {
      // Validate we have all required data before creating payment intent
      if (!updatedFormData.step2Data?.pricing?.totalPrice) {
        toast({
          title: "Error", 
          description: "Missing pricing information. Please go back and select service options.",
          variant: "destructive",
        });
        return;
      }
      
      // Create payment intent and skip to payment step
      createPaymentMutation.mutate(updatedFormData);
      return;
    }
    
    if (stepNumber === 3) {
      // Validate we have all required data before creating payment intent
      if (!updatedFormData.step2Data?.pricing?.totalPrice) {
        toast({
          title: "Error", 
          description: "Missing pricing information. Please go back and select service options.",
          variant: "destructive",
        });
        return;
      }
      
      // Create payment intent before showing payment step
      createPaymentMutation.mutate(updatedFormData);
    } else {
      setCurrentStep(stepNumber + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handlePaymentSuccess = async (paymentIntentId?: string) => {
    if (!paymentIntentId) {
      toast({
        title: "Error",
        description: "Payment completed but order creation failed. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create order record in database after successful payment
      const orderData = {
        serviceId: parseInt(serviceId!),
        userId: formData.step1Data?.user?.id || null,
        customerEmail: formData.step1Data?.email || formData.step1Data?.user?.email,
        customerName: `${formData.step1Data?.user?.firstName || formData.step1Data?.firstName || ''} ${formData.step1Data?.user?.lastName || formData.step1Data?.lastName || ''}`.trim(),
        businessName: formData.step3Data?.businessName || '',
        customFieldData: formData.step3Data || {},
        isExpedited: formData.step2Data?.processingSpeed === 'expedited',
        expeditedFee: formData.step2Data?.processingSpeed === 'expedited' ? '75.00' : '0.00',
        totalAmount: formData.step2Data?.pricing?.totalPrice?.toString() || '0.00',
        paymentIntentId: paymentIntentId,
        orderStatus: 'pending',
        paymentStatus: 'completed'
      };

      const response = await apiRequest("POST", "/api/orders/create-from-payment", orderData);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }

      // For BOIR Filing (service ID 11), redirect to post-payment information form
      if (serviceId === "11") {
        toast({
          title: "Payment Successful",
          description: "Now let's collect your BOIR filing information.",
        });
        // Redirect to post-payment BOIR form with payment intent ID
        window.location.href = `/post-payment-form/${paymentIntentId}`;
        return;
      }
      
      // For all other services, show success step
      setCurrentStep(5);
      toast({
        title: "Payment Successful",
        description: "Your order has been processed successfully!",
      });
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Payment Successful",
        description: "Payment completed but there was an issue creating your order. Please contact support with payment ID: " + paymentIntentId,
        variant: "destructive",
      });
    }
  };

  if (serviceLoading || addOnsLoading || fieldsLoading) {
    return <ParaFortLoader />;
  }

  if (!(service as any)?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Service Not Found</h1>
          <p>The requested service (ID: {serviceId}) could not be found.</p>
          <p className="mt-2 text-sm text-gray-500">Debug: service object = {JSON.stringify(service)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">{(service as any)?.name || "Service"}</h1>
        <p className="text-center text-gray-600">{(service as any)?.description || "Complete your service order following the steps below"}</p>
      </div>

      <ProgressBar currentStep={currentStep} />

      {currentStep === 1 && (
        <Step1AccountCheck
          onNext={(data) => handleStepComplete(1, data)}
        />
      )}

      {currentStep === 2 && (
        <Step2ServiceSelection
          service={service as Service}
          addOns={addOns as ServiceAddOn[]}
          onNext={(data) => handleStepComplete(2, data)}
          onBack={handleBack}
        />
      )}

      {currentStep === 3 && (
        <Step3Information
          customFields={customFields as ServiceCustomField[]}
          userProfile={formData.step1Data?.user}
          service={service as Service}
          onNext={(data) => handleStepComplete(3, data)}
          onBack={handleBack}
        />
      )}

      {currentStep === 4 && clientSecret && stripe && stripeLoaded && (
        <Elements 
          stripe={stripe} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe'
            }
          }}
        >
          <Step4ReviewPayment
            service={service as Service}
            step1Data={formData.step1Data}
            step2Data={formData.step2Data}
            step3Data={formData.step3Data}
            clientSecret={clientSecret}
            onBack={handleBack}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}

      {currentStep === 4 && (!clientSecret || !stripeLoaded) && (
        <div className="text-center">
          <ParaFortLoader />
          <p className="mt-4">Preparing payment...</p>
        </div>
      )}

      {currentStep === 5 && (
        <Step5Confirmation
          orderData={{
            ...formData,
            processingSpeed: formData.step2Data?.processingSpeed,
            email: formData.step1Data?.email
          }}
        />
      )}
    </div>
  );
}