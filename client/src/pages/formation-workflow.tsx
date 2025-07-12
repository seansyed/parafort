import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, ArrowLeft, ArrowRight, DollarSign, AlertTriangle, MessageSquare, X, Send, CreditCard, Shield, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertBusinessEntitySchema, type BusinessEntity, type SubscriptionPlan } from "@shared/schema";
import { stateFilingFees } from "@/stateFilingFees";
import { stateFilingRequirements, isFilingRequired, getFilingRequirement } from "@/stateFilingRequirements";
import { z } from "zod";
import { useLocation, useRouter } from "wouter";
import { useUnsavedChanges } from "@/contexts/UnsavedChangesContext";
import { OtpVerificationModal } from "@/components/OtpVerificationModal";
import { LoadingSpinner, LoadingPage } from "@/components/ui/loading-spinner";
import { ParaFortLoader, ParaFortPageLoader, ParaFortInlineLoader } from "@/components/ParaFortLoader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCheckoutForm } from "@/components/StripeCheckoutForm";
import { DigitalMailboxModal } from "@/components/DigitalMailboxModal";

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

// Initialize Stripe promise
stripePromise = initializeStripe();

// Helper function to get state filing fee using the comprehensive system
function getFormationStateFee(stateCode: string, entityType: string): number {
  try {
    const stateName = STATES_WITH_NAMES.find(s => s.code === stateCode)?.name;
    if (!stateName) return 0;
    
    const stateData = stateFilingFees[stateName];
    if (!stateData) return 0;
    
    const entityFee = stateData[entityType as keyof typeof stateData];
    return entityFee ? (entityFee as any).fee : 0;
  } catch (error) {
    console.error('Error getting formation state fee:', error);
    return 0;
  }
}

const STATES_WITH_NAMES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
];

const STATES = STATES_WITH_NAMES.map(state => state.code);

// Form schemas for each step
const subscriptionPlanSchema = z.object({
  subscriptionPlan: z.string().min(1, "Please select a subscription plan"),
});

const emailVerificationSchema = z.object({
  contactEmail: z.string().email("Please enter a valid email address"),
});

const stateAndEntitySchema = z.object({
  state: z.enum(STATES as [string, ...string[]], {
    required_error: "Please select a state",
  }),
  entityType: z.enum(["LLC", "Corporation", "Professional Corporation", "Non-Profit Corporation"], {
    required_error: "Please select a business entity type",
  }),
});

const businessInfoSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  businessPurpose: z.string().min(10, "Business purpose must be at least 10 characters"),
  numberOfShares: z.number().optional(),
});

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.enum(STATES as [string, ...string[]], {
    required_error: "Please select a state",
  }),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),
});

const registeredAgentSchema = z.object({
  registeredAgent: z.string().min(1, "Registered agent is required"),
});

const businessLeadershipSchema = z.object({
  ownerFirstName: z.string().min(1, "Owner first name is required"),
  ownerLastName: z.string().min(1, "Owner last name is required"),
  ownerAddress: z.string().min(1, "Owner address is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  registeredAgentType: z.enum(["self", "third_party"]),
  registeredAgentName: z.string().optional(),
  registeredAgentAddress: z.string().optional(),
  // Corporation-specific fields
  presidentName: z.string().optional(),
  presidentAddress: z.string().optional(),
  secretaryName: z.string().optional(),
  secretaryAddress: z.string().optional(),
  treasurerName: z.string().optional(),
  treasurerAddress: z.string().optional(),
  directorNames: z.array(z.string()).optional(),
  directorAddresses: z.array(z.string()).optional(),
  // LLC-specific fields
  memberNames: z.array(z.string()).optional(),
  memberAddresses: z.array(z.string()).optional(),
  ownershipPercentages: z.array(z.string()).optional(),
});

const paymentSchema = z.object({
  // Payment fields will be handled by Stripe
});

type FormData = {
  subscriptionPlanId?: number;
  entityType?: "LLC" | "Corporation" | "Professional Corporation" | "Non-Profit Corporation";
  name?: string;
  businessPurpose?: string;
  numberOfShares?: number;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  registeredAgent?: string;
  status?: string;
  currentStep?: number;
  totalSteps?: number;
  selectedServices?: number[];
  // Business Leadership fields (Step 6)
  ownerFirstName?: string;
  ownerLastName?: string;
  ownerAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  registeredAgentType?: "self" | "third_party";
  registeredAgentName?: string;
  registeredAgentAddress?: string;
  // Corporation-specific officers
  presidentName?: string;
  presidentAddress?: string;
  secretaryName?: string;
  secretaryAddress?: string;
  treasurerName?: string;
  treasurerAddress?: string;
  directorNames?: string[];
  directorAddresses?: string[];
  // LLC-specific information
  memberNames?: string[];
  memberAddresses?: string[];
  ownershipPercentages?: string[];
  // Terms and conditions
  agreeToTerms?: boolean;
  // Digital mailbox plan selection
  selectedDigitalMailboxPlanId?: number;
  selectedDigitalMailboxPlanName?: string;
};

interface FormationWorkflowProps {
  editEntityId?: number;
}

export default function FormationWorkflow({ editEntityId }: FormationWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    // Try to load saved form data from localStorage on initial load
    try {
      const saved = localStorage.getItem('parafort_formation_data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        console.log('Loaded saved form data from localStorage:', parsedData);
        return {
          selectedServices: [],
          agreeToTerms: false,
          ...parsedData,
        };
      }
    } catch (e) {
      console.warn('Failed to load saved form data:', e);
    }
    
    return {
      selectedServices: [],
      agreeToTerms: false
    };
  });
  const [entityId, setEntityId] = useState<number | null>(null);
  const [location, setLocation] = useLocation();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChanges();

  // Payment handler functions
  const createPaymentIntent = async () => {
    console.log('=== createPaymentIntent called ===');
    console.log('Current formData state:', JSON.stringify(formData, null, 2));
    console.log('Available subscription plans:', subscriptionPlans);
    
    // Validate Terms of Service agreement
    if (!formData.agreeToTerms) {
      console.log('Terms not agreed, showing toast');
      toast({
        title: "Terms Required",
        description: "You must agree to the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Show payment calculation start
    toast({
      title: "Processing Payment",
      description: "Calculating payment amount...",
      duration: 2000,
    });
    
    setPaymentProcessing(true);
    try {
      console.log('Looking for subscription plan with ID:', formData.subscriptionPlanId);
      const subscriptionPlan = subscriptionPlans.find(p => p.id === formData.subscriptionPlanId);
      console.log('Found subscription plan:', subscriptionPlan);
      
      const subscriptionPrice = parseFloat(subscriptionPlan?.yearlyPrice || '0');
      const stateFilingFee = parseFloat(getStateFilingFee().toString());
      const selectedServicesCost = parseFloat(calculateSelectedServicesCost().toString());
      const digitalMailboxPrice = getDigitalMailboxPrice();
      
      console.log('=== Payment calculation breakdown ===');
      console.log('- Subscription plan:', subscriptionPlan);
      console.log('- Subscription price:', subscriptionPrice);
      console.log('- State filing fee:', stateFilingFee);
      console.log('- Selected services cost:', selectedServicesCost);
      console.log('- Digital mailbox price:', digitalMailboxPrice);
      console.log('- Form data subscription plan ID:', formData.subscriptionPlanId);
      console.log('- Form data state:', formData.state);
      console.log('- Form data entity type:', formData.entityType);
      
      const totalAmount = subscriptionPrice + stateFilingFee + selectedServicesCost + digitalMailboxPrice;
      console.log('Total amount:', totalAmount);
      
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount: totalAmount,
        customerEmail: formData.contactEmail,
        customerName: `${formData.ownerFirstName} ${formData.ownerLastName}`.trim(),
        businessName: formData.name,
        entityType: formData.entityType,
        state: formData.state,
        metadata: {
          subscriptionPlanId: formData.subscriptionPlanId?.toString() || '2',
          selectedServices: JSON.stringify(formData.selectedServices || []),
          formData: JSON.stringify(formData)
        }
      });

      const data = await response.json();
      console.log('Payment intent response:', data);

      if (data.clientSecret) {
        console.log('Setting client secret:', data.clientSecret);
        setClientSecret(data.clientSecret);
      } else {
        console.error('No client secret in response:', data);
      }
    } catch (error) {
      console.error('Payment intent error:', error);
      toast({
        title: "Payment Setup Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    console.log("handlePaymentSuccess called with:", paymentIntentId);
    
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully. Completing formation...",
    });
    
    try {
      console.log("Calling complete-formation-order API...");
      // Complete the formation order
      const response = await apiRequest('POST', '/api/complete-formation-order', {
        paymentIntentId,
        businessEntityId: entityId
      });
      
      console.log("Order completion response:", response);

      // Redirect to success page using window.location.href for more reliable navigation
      console.log("Redirecting to success page...");
      window.location.href = `/formation-success?payment_intent=${paymentIntentId}`;
    } catch (error) {
      console.error('Error completing order:', error);
      toast({
        title: "Order Processing Error",
        description: "Payment successful, but there was an issue completing your order. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setClientSecret("");
    setPaymentProcessing(false);
  };
  
  // AI Assistant state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  // Address verification state
  const [addressVerification, setAddressVerification] = useState<{
    status: 'idle' | 'verifying' | 'verified' | 'error';
    message?: string;
    suggestions?: string[];
  }>({ status: 'idle' });
  const [useDifferentMailingAddress, setUseDifferentMailingAddress] = useState(false);
  
  // Email verification state
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<{
    status: 'idle' | 'checking' | 'verified' | 'exists' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);
  
  // Digital mailbox modal state
  const [showDigitalMailboxModal, setShowDigitalMailboxModal] = useState(false);
  
  // Address help state
  const [showAddressHelp, setShowAddressHelp] = useState(false);

  // Handle digital mailbox plan selection
  const handleDigitalMailboxPlanSelection = (planId: number, planName: string) => {
    // Update the digital mailbox plan selection in formData
    setFormData(prev => ({
      ...prev,
      selectedDigitalMailboxPlanId: planId,
      selectedDigitalMailboxPlanName: planName
    }));
    
    toast({
      title: "Digital Mailbox Plan Selected",
      description: `${planName} plan added to your order with digital mailbox services included.`,
    });
  };
  
  // Minimum loading state to ensure spinner is visible
  const [showMinimumLoading, setShowMinimumLoading] = useState(true);
  
  // Payment state
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  // Debug client secret changes
  useEffect(() => {
    console.log('Client secret changed:', clientSecret ? 'SET' : 'EMPTY');
  }, [clientSecret]);
  const [otpVerificationCallback, setOtpVerificationCallback] = useState<(() => void) | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Mailing address autocomplete state
  const [mailingAddressSuggestions, setMailingAddressSuggestions] = useState<string[]>([]);
  const [showMailingSuggestions, setShowMailingSuggestions] = useState(false);
  const [mailingTypingTimeout, setMailingTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Address autocomplete function using real address API
  const getAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Call our backend API for address suggestions
      const response = await fetch('/api/address-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setAddressSuggestions(data.suggestions || []);
        setShowSuggestions((data.suggestions || []).length > 0);
      } else {
        // Fallback to no suggestions if API fails
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Address suggestions error:', error);
      // Fallback to no suggestions if API fails
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAddressInputChange = (value: string, field: any) => {
    field.onChange(value);
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout for address suggestions
    const newTimeout = setTimeout(() => {
      getAddressSuggestions(value);
    }, 300); // Wait 300ms after user stops typing

    setTypingTimeout(newTimeout);
  };

  const selectAddressSuggestion = (suggestion: string, field: any) => {
    field.onChange(suggestion);
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Mailing address autocomplete functions
  const getMailingAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setMailingAddressSuggestions([]);
      setShowMailingSuggestions(false);
      return;
    }

    try {
      // Call our backend API for mailing address suggestions
      const response = await fetch('/api/address-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setMailingAddressSuggestions(data.suggestions || []);
        setShowMailingSuggestions((data.suggestions || []).length > 0);
      } else {
        // Fallback to no suggestions if API fails
        setMailingAddressSuggestions([]);
        setShowMailingSuggestions(false);
      }
    } catch (error) {
      console.error('Mailing address suggestions error:', error);
      // Fallback to no suggestions if API fails
      setMailingAddressSuggestions([]);
      setShowMailingSuggestions(false);
    }
  };

  const handleMailingAddressInputChange = (value: string, field: any) => {
    field.onChange(value);
    
    // Clear previous timeout
    if (mailingTypingTimeout) {
      clearTimeout(mailingTypingTimeout);
    }

    // Set new timeout for address suggestions
    const newTimeout = setTimeout(() => {
      getMailingAddressSuggestions(value);
    }, 300); // Wait 300ms after user stops typing

    setMailingTypingTimeout(newTimeout);
  };

  const selectMailingAddressSuggestion = (suggestion: string, field: any) => {
    field.onChange(suggestion);
    setShowMailingSuggestions(false);
    setMailingAddressSuggestions([]);
  };

  // Address verification function
  const verifyAddress = async (address: { streetAddress: string; city: string; state: string; zipCode: string }) => {
    if (!address.streetAddress || !address.city || !address.state || !address.zipCode) {
      return;
    }

    setAddressVerification({ status: 'verifying' });

    try {
      const response = await apiRequest("POST", "/api/verify-address", {
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode
      });

      const data = await response.json();
      
      if (data.valid) {
        setAddressVerification({
          status: 'verified',
          message: 'Address verified successfully'
        });
      } else {
        setAddressVerification({
          status: 'error',
          message: data.message || 'Address could not be verified',
          suggestions: data.suggestions || []
        });
      }
    } catch (error) {
      setAddressVerification({
        status: 'error',
        message: 'Unable to verify address at this time'
      });
    }
  };

  // Email verification function
  const verifyEmail = async (email: string) => {
    if (!email) return;

    setEmailVerificationStatus({ status: 'checking' });

    try {
      // If user is already authenticated, skip email check and mark as verified
      if (isAuthenticated && user?.email === email) {
        setEmailVerificationStatus({
          status: 'verified',
          message: 'Email verified successfully!'
        });
        setVerifiedEmail(email);
        setFormData(prev => ({ ...prev, contactEmail: email }));
        toast({
          title: "Email Verified",
          description: "Your email has been verified and you can proceed to the next step.",
        });
        return;
      }

      // For non-authenticated users, check if email already exists
      const response = await apiRequest("POST", "/api/check-email", { email });
      const data = await response.json();

      if (data.exists) {
        setEmailVerificationStatus({
          status: 'exists',
          message: 'An account with this email already exists.'
        });
        setShowEmailExistsModal(true);
      } else {
        // Email is available, now require OTP verification
        setEmailVerificationStatus({
          status: 'idle',
          message: 'Click "Verify Email" to receive your verification code.'
        });
        setShowOtpVerification(true);
      }
    } catch (error) {
      setEmailVerificationStatus({
        status: 'error',
        message: 'Unable to verify email at this time.'
      });
    }
  };

  // Handle OTP verification completion
  const handleOtpVerificationComplete = () => {
    const currentEmail = form.getValues('contactEmail');
    setVerifiedEmail(currentEmail); // Store the verified email
    setFormData(prev => ({ ...prev, contactEmail: currentEmail })); // Update form data
    setShowOtpVerification(false);
    setEmailVerificationStatus({
      status: 'verified',
      message: 'Email verified successfully!'
    });
    toast({
      title: "Email Verified",
      description: "Your email has been verified and you can proceed to the next step.",
    });
  };

  // Handle OTP verification cancellation
  const handleOtpVerificationCancel = () => {
    setShowOtpVerification(false);
    setEmailVerificationStatus({
      status: 'idle',
      message: ''
    });
  };

  // AI Assistant functions
  const openAIAssistant = () => {
    setShowAIAssistant(true);
    if (aiMessages.length === 0) {
      setAiMessages([{
        role: 'assistant',
        content: "Hello! I'm here to help you with business name questions. I can assist with name requirements, availability considerations, and compliance guidelines for your business entity type. What would you like to know?"
      }]);
    }
  };

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiLoading(true);

    try {
      const response = await apiRequest("POST", "/api/ai-business-name-assistant", {
        message: userMessage,
        context: {
          entityType: formData.entityType,
          state: formData.state,
          businessName: formData.name
        }
      });

      const data = await response.json();
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later or contact support if the issue persists."
      }]);
    } finally {
      setAiLoading(false);
    }
  };


  // Only redirect to login when submitting, not when accessing the form
  // Users can view and fill out the formation workflow without being authenticated

  // Note: Browser navigation protection removed to prioritize custom modal

  // Load existing entity if editing
  const { data: existingEntity } = useQuery<BusinessEntity>({
    queryKey: ["/api/business-entities", editEntityId],
    enabled: !!editEntityId && isAuthenticated,
    retry: false,
  });

  // Fetch subscription plans for step 1 - available to all users
  const { 
    data: subscriptionPlans = [], 
    isLoading: plansLoading, 
    isError: plansError, 
    error: plansErrorDetails 
  } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error fetching subscription plans:", error);
      toast({
        title: "Error Loading Plans",
        description: "Unable to load subscription plans. Please refresh the page.",
        variant: "destructive",
      });
    }
  });

  // Auto-select first subscription plan if none is selected
  useEffect(() => {
    if (subscriptionPlans.length > 0 && !formData.subscriptionPlanId) {
      console.log('🎯 AUTO-SELECTING FIRST SUBSCRIPTION PLAN:', subscriptionPlans[0]);
      console.log('🎯 Available plans:', subscriptionPlans.map(p => ({ id: p.id, name: p.name })));
      toast({
        title: "Auto-selected Plan",
        description: `Automatically selected: ${subscriptionPlans[0].name}`,
        duration: 3000,
      });
      setFormData(prev => ({
        ...prev,
        subscriptionPlanId: subscriptionPlans[0].id
      }));
    }
  }, [subscriptionPlans, formData.subscriptionPlanId]);

  // Fetch services to show in plan selection and add-ons - available to all users
  const { 
    data: allServices = [], 
    isLoading: servicesLoading, 
    isError: servicesError, 
    error: servicesErrorDetails 
  } = useQuery<any[]>({
    queryKey: ["/api/services"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error fetching services:", error);
      toast({
        title: "Error Loading Services",
        description: "Unable to load available services. Please refresh the page.",
        variant: "destructive",
      });
    }
  });

  // Fetch formation services with subscription plan relationships
  const { 
    data: servicesWithPlans = [], 
    isLoading: servicesWithPlansLoading, 
    isError: servicesWithPlansError, 
    error: servicesWithPlansErrorDetails 
  } = useQuery<any[]>({
    queryKey: ["/api/services-with-plans", { category: "Formation" }],
    queryFn: async () => {
      const response = await fetch("/api/services-with-plans?category=Formation");
      if (!response.ok) {
        throw new Error("Failed to fetch formation services");
      }
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error fetching services with plans:", error);
      toast({
        title: "Error Loading Service Plans",
        description: "Unable to load service plan information. Please refresh the page.",
        variant: "destructive",
      });
    }
  });

  // Fetch all services with plans (all categories) to show included services
  const { 
    data: allServicesWithPlans = [], 
    isLoading: allServicesLoading, 
    isError: allServicesError 
  } = useQuery<any[]>({
    queryKey: ["/api/services-with-plans"],
    queryFn: async () => {
      const response = await fetch("/api/services-with-plans");
      if (!response.ok) {
        throw new Error("Failed to fetch all services with plans");
      }
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error fetching all services with plans:", error);
      toast({
        title: "Error Loading Services",
        description: "Unable to load service information. Please refresh the page.",
        variant: "destructive",
      });
    }
  });

  // Fetch mailbox plans for digital mailbox pricing
  const { 
    data: mailboxPlans = [], 
    isLoading: mailboxPlansLoading, 
    isError: mailboxPlansError 
  } = useQuery<any[]>({
    queryKey: ["/api/mailbox-plans"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Error fetching mailbox plans:", error);
      toast({
        title: "Error Loading Mailbox Plans",
        description: "Unable to load mailbox plans. Please refresh the page.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (existingEntity) {
      console.log('Loading existing entity data:', existingEntity);
      
      // Don't override user's current form selections if they exist
      setFormData(prev => {
        // Check if user has already made selections that shouldn't be overridden
        const hasUserSelections = prev.state || prev.entityType || prev.name;
        
        if (hasUserSelections) {
          console.log('User has existing selections, preserving them over existing entity data');
          return {
            ...existingEntity,
            subscriptionPlanId: existingEntity.subscriptionPlanId || undefined,
            selectedServices: existingEntity.selectedServices || [],
            // Preserve user's current selections - NEVER override with existingEntity
            state: prev.state,
            entityType: prev.entityType,
            name: prev.name,
          };
        } else {
          console.log('No user selections detected, loading existing entity data');
          return {
            ...existingEntity,
            subscriptionPlanId: existingEntity.subscriptionPlanId || undefined,
            selectedServices: existingEntity.selectedServices || []
          };
        }
      });
      
      setCurrentStep(existingEntity.currentStep || 1);
      setEntityId(existingEntity.id);
    }
  }, [existingEntity]);

  // Auto-select included services when subscription plan changes
  useEffect(() => {
    if (formData.subscriptionPlanId && servicesWithPlans.length > 0) {
      console.log('servicesWithPlans data:', servicesWithPlans);
      console.log('current subscriptionPlanId:', formData.subscriptionPlanId);
      
      const includedServiceIds = servicesWithPlans
        .filter((swp: any) => swp.planId === formData.subscriptionPlanId && swp.includedInPlan === true)
        .map((swp: any) => swp.serviceId);
      
      console.log('includedServiceIds:', includedServiceIds);
      
      // Add included services to selectedServices if not already present
      const currentSelected = formData.selectedServices || [];
      const newSelectedServices = [...new Set([...currentSelected, ...includedServiceIds])];
      
      if (newSelectedServices.length !== currentSelected.length) {
        setFormData(prev => ({
          ...prev,
          selectedServices: newSelectedServices
        }));
      }
    }
  }, [formData.subscriptionPlanId, servicesWithPlans]);

  // Ensure minimum loading time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMinimumLoading(false);
    }, 1500); // Show loading for at least 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Also ensure loading shows when data is not ready
  useEffect(() => {
    if (!plansLoading && subscriptionPlans && subscriptionPlans.length > 0) {
      // Data is ready, but still respect minimum loading time
    }
  }, [plansLoading, subscriptionPlans]);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Auto-save formData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('parafort_formation_data', JSON.stringify(formData));
      console.log('Auto-saved form data to localStorage:', formData);
    } catch (e) {
      console.warn('Failed to auto-save form data to localStorage:', e);
    }
  }, [formData]);

  // Auto-populate authenticated user's email
  useEffect(() => {
    if (isAuthenticated && user?.email && !formData.contactEmail) {
      console.log('Auto-populating authenticated user email:', user.email);
      form.setValue('contactEmail', user.email);
      setFormData(prev => ({ ...prev, contactEmail: user.email }));
      setEmailVerificationStatus({
        status: 'verified',
        message: 'Email verified (authenticated user)'
      });
      setVerifiedEmail(user.email);
    }
  }, [isAuthenticated, user?.email, formData.contactEmail]);

  const getFormSchema = () => {
    switch (currentStep) {
      case 1:
        return subscriptionPlanSchema;
      case 2:
        return emailVerificationSchema;
      case 3:
        return stateAndEntitySchema;
      case 4:
        return businessInfoSchema;
      case 5:
        return addressSchema;
      case 6:
        return registeredAgentSchema;
      case 7:
        return businessLeadershipSchema;
      case 8:
        return paymentSchema;
      default:
        return subscriptionPlanSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: formData,
    mode: "onChange",
  });

  // Sync form with formData changes
  useEffect(() => {
    form.reset(formData);
  }, [form, formData]);

  // Watch the state field to trigger filing fee display
  const selectedState = form.watch("state");

  // Track form changes to enable exit warning
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && currentStep < 5) {
        setHasUnsavedChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, currentStep, setHasUnsavedChanges]);

  // Sync form values to formData state for real-time updates
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(prev => ({ ...prev, ...value }));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Add browser navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Note: beforeunload removed to use only enhanced modal warning

  // Monitor for route changes to detect navigation attempts
  const [initialLocation] = useState(location);
  
  // Note: Location change handler removed to use only enhanced modal

  // Note: Click and popstate handlers removed to use only enhanced modal system

  // No form reset to prevent infinite re-render

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        currentStep,
        totalSteps: 8,
        status: currentStep === 8 ? "completed" : "in_progress",
      };

      if (entityId) {
        return await apiRequest("PUT", `/api/business-entities/${entityId}`, payload);
      } else {
        return await apiRequest("POST", "/api/business-entities", payload);
      }
    },
    onSuccess: (response) => {
      // Handle both direct data and response objects
      const data = response?.data || response;
      
      if (!entityId && data?.id) {
        setEntityId(data.id);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities"] });
      
      if (currentStep === 8) {
        // Only redirect after final checkout completion
        setHasUnsavedChanges(false); // Clear unsaved changes when completed
        toast({
          title: "Formation Complete!",
          description: "Your business formation has been successfully submitted.",
        });
        setLocation("/dashboard");
      } else {
        setHasUnsavedChanges(false); // Clear unsaved changes after save
        // Automatically move to next step
        setCurrentStep(prev => prev + 1);
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getProgressPercentage = () => {
    // Step 1: Show 0% until a subscription plan is selected
    if (currentStep === 1 && !form.getValues("subscriptionPlanId")) {
      return 0;
    }
    
    // For all other steps, calculate normal progress
    return (currentStep / 8) * 100;
  };

  const onSubmit = (stepData: any) => {
    // Prevent form submission if current step validation fails
    if (!canProceedToNextStep) {
      return;
    }
    
    // Ensure selected services are preserved from formData state
    const updatedData = { 
      ...formData, 
      ...stepData, 
      selectedServices: formData.selectedServices || [] 
    };
    setFormData(updatedData);
    console.log('Submitting form data with selected services:', updatedData.selectedServices);
    saveMutation.mutate(updatedData);
  };





  // Step validation functions
  const validateCurrentStep = useCallback(() => {
    const formValues = form.getValues();
    
    switch (currentStep) {
      case 1:
        return !!formValues.subscriptionPlanId;
      case 2:
        return !!formValues.contactEmail && emailVerificationStatus.status === 'verified';
      case 3:
        return !!formValues.state && !!formValues.entityType;
      case 4:
        return true; // Add-ons are optional, no validation required
      case 5:
        return !!formValues.name && !!formValues.businessPurpose;
      case 6:
        return !!formValues.streetAddress && !!formValues.city && !!formValues.state && !!formValues.zipCode;
      case 7:
        return !!formValues.ownerFirstName && !!formValues.ownerLastName && !!formValues.ownerAddress && 
               !!formValues.contactEmail && !!formValues.contactPhone;
      case 8:
        return true; // Checkout step validation handled separately
      default:
        return false;
    }
  }, [currentStep, form, emailVerificationStatus.status]);

  const canProceedToNextStep = validateCurrentStep();

  const nextStep = () => {
    if (!canProceedToNextStep) {
      return;
    }
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStateFilingFee = () => {
    if (formData.state && formData.entityType) {
      return getFormationStateFee(formData.state, formData.entityType) || 0;
    }
    return 0;
  };

  // Handle service selection for add-ons
  const handleServiceSelection = (serviceId: number, isSelected: boolean) => {
    const currentSelected = formData.selectedServices || [];
    let updatedSelected = currentSelected;
    
    if (isSelected) {
      // Add service if not already selected
      if (!currentSelected.includes(serviceId)) {
        updatedSelected = [...currentSelected, serviceId];
      }
    } else {
      // Remove service from selection
      updatedSelected = currentSelected.filter(id => id !== serviceId);
    }
    
    // Update form data and mark as having unsaved changes
    setFormData(prev => ({
      ...prev,
      selectedServices: updatedSelected
    }));
    setHasUnsavedChanges(true);
    
    console.log('Service selection updated:', { serviceId, isSelected, updatedSelected });
  };

  // Calculate total cost for selected services
  const calculateSelectedServicesCost = () => {
    if (!formData.selectedServices || !servicesWithPlans) return 0;
    
    return formData.selectedServices.reduce((total: number, serviceId: number) => {
      // Find service with plan information
      const serviceWithPlan = servicesWithPlans.find((swp: any) => 
        swp.serviceId === serviceId && 
        swp.planId === formData.subscriptionPlanId &&
        swp.availableAsAddon === true
      );
      
      if (serviceWithPlan) {
        const price = parseFloat(serviceWithPlan.oneTimePrice) || parseFloat(serviceWithPlan.recurringPrice) || 0;
        return total + price;
      }
      
      return total;
    }, 0);
  };

  // Get digital mailbox plan price
  const getDigitalMailboxPrice = () => {
    if (!formData.selectedDigitalMailboxPlanId || !mailboxPlans) return 0;
    
    const selectedPlan = mailboxPlans.find((plan: any) => 
      plan.id === formData.selectedDigitalMailboxPlanId
    );
    
    return selectedPlan ? parseFloat(selectedPlan.monthlyPrice) : 0;
  };

  // Allow unauthenticated users to access the formation workflow
  // Authentication is only required when submitting the final application

  // Show loading state if plans are still loading, if we don't have data yet, or if we're within minimum loading time
  if (showMinimumLoading || plansLoading || !subscriptionPlans || subscriptionPlans.length === 0) {
    return <ParaFortPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-36">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {editEntityId ? "Edit Business Entity" : "Launch Your Business: A Seamless Formation Journey"}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {editEntityId 
              ? "Update your business entity information" 
              : "Transform your business idea into reality with our streamlined, eight-step formation process. Each stage is designed to guide you confidently from inspiration to official launch, ensuring you build a strong foundation for lasting success."
            }
          </p>
        </div>



        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 8</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step <= currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-300"
                }`}
              >
                {step < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              {step < 8 && (
                <div
                  className={`w-8 h-0.5 ${
                    step < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Subscription Plan Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    {plansLoading ? (
                      <div className="text-center py-8">
                        <LoadingSpinner size="lg" />
                        <p className="text-gray-500 mt-4">Loading subscription plans...</p>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="subscriptionPlanId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Choose Your Subscription Plan *</FormLabel>
                            <div className="grid gap-6 mt-4">
                              {subscriptionPlans
                                .sort((a, b) => parseFloat(a.yearlyPrice) - parseFloat(b.yearlyPrice)) // Sort by price ascending (Free first)
                                .map((plan, index) => {
                                const isPopular = plan.name === 'Gold'; // Mark Gold plan as popular
                                return (
                                  <div 
                                    key={plan.id}
                                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                                      field.value === plan.id 
                                        ? "border-green-500" 
                                        : "border-gray-200 hover:border-gray-300"
                                    } ${isPopular ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
                                    onClick={() => field.onChange(plan.id)}
                                  >
                                    {isPopular && (
                                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                                          MOST POPULAR
                                        </span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                          <input
                                            type="radio"
                                            checked={field.value === plan.id}
                                            onChange={() => field.onChange(plan.id)}
                                            className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500"
                                          />
                                          <h3 className="ml-3 text-xl font-bold text-gray-900">{plan.name}</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                          {plan.description}
                                        </p>
                                        
                                        <div className="space-y-3 text-sm">
                                          <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
                                          {allServicesWithPlans
                                            .filter(service => service.planId === plan.id && service.includedInPlan)
                                            .map((service) => (
                                              <div key={service.serviceId} className="flex items-start">
                                                <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{service.serviceName}</span>
                                              </div>
                                            ))}
                                          {allServicesWithPlans.filter(service => service.planId === plan.id && service.includedInPlan).length === 0 && (
                                            <div className="flex items-start">
                                              <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                              <span className="text-gray-700">Basic business formation filing</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right ml-6">
                                        <div className="text-3xl font-bold text-green-500 mb-1">
                                          ${parseFloat(plan.yearlyPrice).toFixed(0)}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-2">per year</div>
                                        <div className="text-sm text-gray-500">+ state fees</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* Step 2: Email Verification */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                      <p className="text-gray-600">We'll use this email to send you updates about your business formation.</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Email Address *</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="flex space-x-3">
                                <div className="relative flex-1">
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="pr-10"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setEmailVerificationStatus({ status: 'idle', message: '' });
                                    }}
                                  />
                                  {emailVerificationStatus.status === 'checking' && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                      <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                                    </div>
                                  )}
                                  {emailVerificationStatus.status === 'verified' && (
                                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                  )}
                                  {emailVerificationStatus.status === 'exists' && (
                                    <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                                  )}
                                  {emailVerificationStatus.status === 'error' && (
                                    <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    const email = field.value;
                                    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                                      verifyEmail(email);
                                    } else {
                                      toast({
                                        title: "Invalid Email",
                                        description: "Please enter a valid email address first.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  disabled={!field.value || emailVerificationStatus.status === 'checking' || emailVerificationStatus.status === 'verified'}
                                  className="px-6"
                                >
                                  {emailVerificationStatus.status === 'checking' ? 'Checking...' : 'Verify Email'}
                                </Button>
                              </div>
                              {emailVerificationStatus.message && (
                                <div className={`text-sm ${
                                  emailVerificationStatus.status === 'verified' ? 'text-green-600' :
                                  emailVerificationStatus.status === 'exists' ? 'text-orange-600' :
                                  emailVerificationStatus.status === 'error' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}>
                                  {emailVerificationStatus.message}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {emailVerificationStatus.status === 'verified' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-800 font-medium">Email verified! You can proceed to the next step.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: State Selection and Business Type */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    {/* State Selection First */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Select Your State of Formation *</FormLabel>
                          <FormDescription className="text-gray-600">
                            Filing fees vary by state, so we need to know where you want to form your business first.
                          </FormDescription>
                          <Select onValueChange={(value) => {
                            try {
                              console.log('State selected:', value);
                              field.onChange(value);
                              setFormData(prev => {
                                const newData = { ...prev, state: value };
                                console.log('Updated formData with state:', newData);
                                
                                // Immediately save to localStorage to prevent override
                                try {
                                  localStorage.setItem('parafort_formation_data', JSON.stringify(newData));
                                  console.log('State selection saved to localStorage:', value);
                                } catch (e) {
                                  console.warn('Failed to save to localStorage:', e);
                                }
                                
                                return newData;
                              });
                            } catch (error) {
                              console.error('Error handling state selection:', error);
                              toast({
                                title: "Error",
                                description: "Failed to select state. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full h-14 text-lg bg-green-500/10 border-2 border-green-500 hover:bg-green-500/20 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/30 transition-all font-semibold shadow-md">
                                <SelectValue placeholder="🏛️ Choose your state of formation" className="text-gray-700 font-semibold" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {STATES_WITH_NAMES.map((state) => (
                                <SelectItem key={state.code} value={state.code}>
                                  {state.code} - {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* State Filing Fees & Requirements Display */}
                    {selectedState && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          State Filing Fees & Requirements for {STATES_WITH_NAMES.find(s => s.code === selectedState)?.name || selectedState}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {['LLC', 'Corporation', 'Professional Corporation', 'Non-Profit Corporation'].map((entityType) => {
                            try {
                              const stateName = STATES_WITH_NAMES.find(s => s.code === selectedState)?.name || '';
                              const fee = getFormationStateFee(selectedState, entityType);
                              const requirement = getFilingRequirement(stateName, entityType);
                              const isRequired = isFilingRequired(stateName, entityType);
                            
                              return (
                              <div key={entityType} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-center mb-3">
                                  <div className="text-sm font-medium text-gray-900 mb-2">
                                    {entityType === 'Professional Corporation' ? 'Professional Corp.' : 
                                     entityType === 'Non-Profit Corporation' ? 'Non-Profit' : entityType}
                                  </div>
                                  
                                  {/* Filing Fee */}
                                  <div className="mb-3">
                                    <div className="text-xs text-gray-500 mb-1">Filing Fee</div>
                                    <div className="text-lg font-bold text-green-500">
                                      ${fee || "N/A"}
                                    </div>
                                  </div>
                                  
                                  {/* Filing Requirement Status */}
                                  <div className="mb-2">
                                    <div className="text-xs text-gray-500 mb-1">Annual Filing</div>
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      isRequired 
                                        ? 'bg-red-100 text-red-800 border border-red-200' 
                                        : 'bg-green-100 text-green-800 border border-green-200'
                                    }`}>
                                      {isRequired ? 'REQUIRED' : 'NOT REQUIRED'}
                                    </div>
                                  </div>
                                  
                                  {/* Filing Frequency & Notes */}
                                  {requirement && isRequired && (
                                    <div className="text-xs text-gray-600 mt-2">
                                      <div className="font-medium">{requirement.frequency || 'Annual'}</div>
                                      {requirement.notes && (
                                        <div className="mt-1 text-gray-500 leading-tight">
                                          {requirement.notes.length > 50 
                                            ? `${requirement.notes.substring(0, 50)}...` 
                                            : requirement.notes}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {!isRequired && (
                                    <div className="text-xs text-gray-500 mt-2">
                                      No ongoing filing requirements
                                    </div>
                                  )}
                                </div>
                              </div>
                              );
                            } catch (error) {
                              console.error(`Error rendering entity type ${entityType}:`, error);
                              return (
                                <div key={entityType} className="bg-white border border-red-200 rounded-lg p-4">
                                  <div className="text-center text-red-600">
                                    Error loading {entityType} data
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-sm text-gray-600 text-center mb-2">
                            <strong>Filing Fees:</strong> State government fees paid during formation. Our service fees are separate and depend on your chosen subscription plan.
                          </p>
                          <p className="text-xs text-gray-500 text-center">
                            <strong>Filing Requirements:</strong> Ongoing annual/biennial reports verified through AI analysis of state regulations (OpenAI, Gemini). Requirements may change - consult current state regulations.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Entity Type Selection (only show if state is selected) */}
                    {selectedState && (
                      <FormField
                        control={form.control}
                        name="entityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Choose Your Business Entity Type *</FormLabel>
                            <FormDescription className="text-gray-600">
                              Filing fees shown below are for {formData.state}. Each entity type has different requirements and benefits.
                            </FormDescription>
                            <div className="grid gap-4 mt-4">
                              {/* LLC Option */}
                              <div 
                                className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                                  field.value === "LLC" 
                                    ? "border-green-500 bg-green-500/5" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("LLC")}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                      <input
                                        type="radio"
                                        checked={field.value === "LLC"}
                                        onChange={() => field.onChange("LLC")}
                                        className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500"
                                      />
                                      <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                        Limited Liability Company (LLC)
                                      </h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                      Flexible business structure with personal liability protection and tax advantages.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Limited personal liability</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Pass-through taxation</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Flexible management structure</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-gray-700 mb-2">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      <span className="text-sm">State Filing Fee</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                      ${formData.state ? getFormationStateFee(formData.state, "LLC") || "N/A" : "Select State"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Corporation Option */}
                              <div 
                                className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                                  field.value === "Corporation" 
                                    ? "border-green-500 bg-green-500/5" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("Corporation")}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                      <input
                                        type="radio"
                                        checked={field.value === "Corporation"}
                                        onChange={() => field.onChange("Corporation")}
                                        className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500"
                                      />
                                      <h3 className="ml-3 text-lg font-semibold text-gray-900">Corporation</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                      Traditional business structure ideal for companies seeking investment or planning to go public.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Strong liability protection</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Easy to raise capital</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Perpetual existence</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-gray-700 mb-2">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      <span className="text-sm">State Filing Fee</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                      ${formData.state ? getFormationStateFee(formData.state, "Corporation") || "N/A" : "Select State"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Professional Corporation Option */}
                              <div 
                                className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                                  field.value === "Professional Corporation" 
                                    ? "border-green-500 bg-green-500/5" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("Professional Corporation")}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                      <input
                                        type="radio"
                                        checked={field.value === "Professional Corporation"}
                                        onChange={() => field.onChange("Professional Corporation")}
                                        className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500"
                                      />
                                      <h3 className="ml-3 text-lg font-semibold text-gray-900">Professional Corporation</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                      Specialized entity for licensed professionals like doctors, lawyers, accountants, and architects.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Professional liability protection</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Tax benefits for professionals</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Credibility with clients</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-gray-700 mb-2">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      <span className="text-sm">State Filing Fee</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                      ${formData.state ? getFormationStateFee(formData.state, "Professional Corporation") || "N/A" : "Select State"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Non-Profit Corporation Option */}
                              <div 
                                className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                                  field.value === "Non-Profit Corporation" 
                                    ? "border-green-500 bg-green-500/5" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("Non-Profit Corporation")}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                      <input
                                        type="radio"
                                        checked={field.value === "Non-Profit Corporation"}
                                        onChange={() => field.onChange("Non-Profit Corporation")}
                                        className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500"
                                      />
                                      <h3 className="ml-3 text-lg font-semibold text-gray-900">Non-Profit Corporation</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                      Tax-exempt organization for charitable, educational, religious, or other qualifying purposes.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Tax-exempt status eligible</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Grant funding opportunities</span>
                                      </div>
                                      <div className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span>Public trust and credibility</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-gray-700 mb-2">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      <span className="text-sm">State Filing Fee</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                      ${formData.state ? getFormationStateFee(formData.state, "Non-Profit Corporation") || "N/A" : "Select State"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* Step 4: Add-ons Selection */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Show selected plan info with all included services */}
                    {formData.subscriptionPlanId && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-3">Your Selected Plan</h3>
                        <p className="text-blue-800 mb-3">
                          {subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.name} Plan includes these services:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {allServicesWithPlans
                            .filter((swp: any) => swp.planId === formData.subscriptionPlanId && swp.includedInPlan === true)
                            .map((includedService: any) => (
                              <div key={includedService.serviceId} className="flex items-center text-blue-700">
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                                <span className="text-sm">{includedService.serviceName}</span>
                              </div>
                            ))}
                        </div>
                        <p className="text-blue-600 text-sm mt-3">
                          Below you can add additional services not included in your plan.
                        </p>
                      </div>
                    )}

                    <div className="grid gap-6">
                      {servicesWithPlansLoading ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Loading formation services...</p>
                        </div>
                      ) : allServicesWithPlans && allServicesWithPlans.length > 0 ? (
                        // Show ALL services that are available as addons for the selected plan
                        Object.values(
                          allServicesWithPlans
                            .filter((swp: any) => 
                              swp.planId === formData.subscriptionPlanId &&
                              (swp.includedInPlan === true || swp.availableAsAddon === true)
                            )
                            .reduce((acc: any, swp: any) => {
                              const key = swp.serviceId;
                              if (!acc[key]) {
                                acc[key] = swp;
                              }
                              return acc;
                            }, {})
                        )
                          .sort((a: any, b: any) => a.serviceName.localeCompare(b.serviceName))
                          .map((service: any) => {
                          // Check if this service is included in the selected subscription plan
                          const isIncluded = service.includedInPlan === true;
                          const price = service.oneTimePrice || service.recurringPrice || 0;
                          const interval = service.recurringPrice ? `/${service.recurringInterval}` : 'one-time';
                          const serviceName = service.serviceName;
                          const serviceDescription = service.serviceDescription;
                          const serviceId = service.serviceId;
                          
                          return (
                            <div 
                              key={serviceId}
                              className={`border-2 rounded-lg p-6 hover:shadow-md transition-all ${
                                isIncluded 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-gray-200 hover:border-green-500'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-3">
                                    <input
                                      type="checkbox"
                                      disabled={isIncluded}
                                      checked={isIncluded || (formData.selectedServices || []).includes(serviceId)}
                                      onChange={(e) => handleServiceSelection(serviceId, e.target.checked)}
                                      className="h-4 w-4 text-green-500 border-gray-300 focus:ring-green-500 rounded disabled:opacity-50"
                                    />
                                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                      {serviceName}
                                    </h3>
                                    {isIncluded && (
                                      <div className="ml-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                          Included
                                        </span>
                                        <div className="text-xs text-green-600 mt-1">
                                          in your selected plan
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-gray-600 mb-3">
                                    {serviceDescription}
                                  </p>
                                  <div className="space-y-2 text-sm">
                                    {serviceName?.includes('EIN') && (
                                      <>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Same-day processing available</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>IRS direct submission</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Required for business banking</span>
                                        </div>
                                      </>
                                    )}
                                    {serviceName?.includes('Registered Agent') && (
                                      <>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Professional business address</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Document forwarding</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Compliance monitoring</span>
                                        </div>
                                      </>
                                    )}
                                    {serviceName?.includes('Operating Agreement') && (
                                      <>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Customized to your business</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>State-specific compliance</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Attorney-reviewed templates</span>
                                        </div>
                                      </>
                                    )}
                                    {service.serviceName?.includes('License') && (
                                      <>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Federal, state, and local requirements</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Industry-specific licenses</span>
                                        </div>
                                        <div className="flex items-center text-green-600">
                                          <Check className="h-4 w-4 mr-2" />
                                          <span>Detailed compliance report</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {isIncluded ? (
                                    <div className="text-2xl font-bold text-green-600">Included</div>
                                  ) : (
                                    <>
                                      <div className="text-2xl font-bold text-gray-900">${price}</div>
                                      <div className="text-sm text-gray-500">{interval}</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Loading available services...</p>
                        </div>
                      )}
                    </div>

                    {/* Comprehensive Cost Breakdown */}
                    <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-lg p-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                      <div className="space-y-3">
                        {/* Subscription Plan Cost */}
                        {formData.subscriptionPlanId && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">
                              {subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.name} Plan
                            </span>
                            <span className="font-medium text-gray-900">
                              ${subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.yearlyPrice}
                            </span>
                          </div>
                        )}
                        
                        {/* State Filing Fee */}
                        {formData.state && formData.entityType && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">State Filing Fee ({formData.state})</span>
                            <span className="font-medium text-gray-900">${getStateFilingFee()}</span>
                          </div>
                        )}
                        
                        {/* Additional Services */}
                        {formData.selectedServices && formData.selectedServices.length > 0 && (
                          <>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <h4 className="font-medium text-gray-900 mb-2">Additional Services:</h4>
                              {allServices
                                .filter((service: any) => formData.selectedServices?.includes(service.id))
                                .map((service: any) => (
                                  <div key={service.id} className="flex justify-between items-center ml-4 mb-1">
                                    <span className="text-gray-700">{service.name}</span>
                                    <span className="font-medium text-gray-900">
                                      ${parseFloat(service.oneTimePrice || service.recurringPrice || 0).toFixed(2)}
                                      {service.recurringPrice ? `/${service.recurringInterval}` : ''}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                        
                        {/* Total */}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between items-center font-semibold text-lg">
                            <span className="text-gray-900">Total Cost:</span>
                            <span className="text-green-500">
                              ${(
                                parseFloat(subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.yearlyPrice || '0') +
                                parseFloat(getStateFilingFee().toString()) +
                                parseFloat(calculateSelectedServicesCost())
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          Get Free Registered Agent Service for Your Business!
                        </h3>
                        <p className="text-sm text-green-700">
                          Protect your privacy and stay compliant—our Free Registered Agent Service ensures you never miss an important legal notice. Included with every business formation, at no extra cost!
                        </p>
                        <div className="flex justify-center mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            📞 394 265-39
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-600">
                        <strong>Note:</strong> Services marked as "Included" are part of your selected subscription plan. 
                        Additional services can be selected now or added later from your dashboard. 
                        Services are grouped by category (Formation, Corporate, Compliance, Business Services) and some may have additional processing time and requirements.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Business Information */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Business Name *</FormLabel>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="Enter your business name"
                            className="mt-2"
                          />
                          <FormMessage />
                          
                          {/* Business Name Registration Message - Moved directly under field */}
                          {formData.entityType && field.value && (
                            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <p className="text-sm text-gray-700">
                                Your name will be registered as "
                                <span className="font-semibold text-orange-600">
                                  {field.value}{" "}
                                  {formData.entityType === "LLC" ? "LLC" : 
                                   formData.entityType === "Corporation" ? "Inc." :
                                   formData.entityType === "Professional Corporation" ? "P.C." :
                                   formData.entityType === "Non-Profit Corporation" ? "Inc." : ""}
                                </span>
                                " unless you specify otherwise.
                              </p>
                            </div>
                          )}
                          
                          {/* Entity-specific name requirements */}
                          {formData.entityType && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                              {formData.entityType === "LLC" && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">LLC Name Requirements:</h4>
                                  <ul className="text-sm text-gray-700 space-y-2">
                                    <li><strong>Entity Identifier:</strong> The name must end with "Limited Liability Company," "LLC," "L.L.C.," or permitted abbreviations like "Ltd. Liability Co." or "Limited Liability Co."</li>
                                    <li><strong>Distinctiveness:</strong> Must be unique and distinguishable from other business names in the state.</li>
                                    <li><strong>Prohibited Words:</strong> Cannot include words that imply a different business type (e.g., "Corporation," "Inc.," "Bank," "Trust," etc.) or government affiliation (e.g., "FBI," "Treasury"). Some words require additional approval or licensing.</li>
                                    <li><strong>No Misleading Terms:</strong> The name must not mislead the public about the business's nature or services.</li>
                                  </ul>
                                </div>
                              )}
                              
                              {formData.entityType === "Corporation" && (
                                <div>
                                  <h4 className="font-semibold text-blue-900 mb-2">Corporation Name Requirements:</h4>
                                  <ul className="text-sm text-blue-800 space-y-2">
                                    <li><strong>Entity Identifier:</strong> Must include "Corporation," "Incorporated," "Company," or "Limited," or abbreviations such as "Corp.," "Inc.," "Co.," or "Ltd."</li>
                                    <li><strong>Distinctiveness:</strong> Name must be distinguishable from other entities registered in the state.</li>
                                    <li><strong>Prohibited Words:</strong> Cannot use misleading terms, words implying a different entity type (e.g., "LLC"), or restricted words (like "bank," "trust," etc.) without appropriate approval.</li>
                                    <li><strong>Other Rules:</strong> Some states require the name to reflect the business purpose or avoid terms that could mislead the public.</li>
                                  </ul>
                                </div>
                              )}
                              
                              {formData.entityType === "Professional Corporation" && (
                                <div>
                                  <h4 className="font-semibold text-blue-900 mb-2">Professional Corporation Name Requirements:</h4>
                                  <p className="text-sm text-blue-800 mb-3">
                                    The name must include the words "Professional Corporation" or the abbreviation "P.C." (or similar, depending on state) to clearly indicate its status as a professional corporation.
                                  </p>
                                  
                                  <h5 className="font-medium text-blue-900 mb-2">Professional corporation name requirements generally include the following:</h5>
                                  <ul className="text-sm text-blue-800 space-y-2">
                                    <li><strong>Entity Identifier:</strong> The name must include the words "Professional Corporation" or the abbreviation "P.C." (or similar, depending on state) to clearly indicate its status as a professional corporation.</li>
                                    <li><strong>Licensing Compliance:</strong> The name must comply with rules set by the professional licensing board relevant to the corporation's field (e.g., medical, legal, accounting). Some professions may require or restrict certain words in the name.</li>
                                    <li><strong>Distinctiveness:</strong> The name must be distinguishable from other business entities already registered in the state, and must not be misleading or imply an unauthorized purpose.</li>
                                    <li><strong>Descriptive Content:</strong> In some states, the name must include a description of the professional service offered or the surnames of one or more shareholders.</li>
                                    <li><strong>Prohibited Words:</strong> Names cannot include certain restricted words (like "bank," "trust," or "trustee") without special approval and may not deceive the public.</li>
                                    <li><strong>Language and Characters:</strong> The name must use the English alphabet or Arabic numerals and approved symbols.</li>
                                  </ul>
                                  
                                  <p className="text-sm text-blue-700 mt-3 font-medium bg-blue-100 p-2 rounded">
                                    <strong>Note:</strong> Specific requirements and allowed abbreviations can vary by state and by profession. Always check both your state's business entity regulations and your professional licensing board's rules before filing.
                                  </p>
                                </div>
                              )}
                              
                              {formData.entityType === "Non-Profit Corporation" && (
                                <div>
                                  <h4 className="font-semibold text-blue-900 mb-2">Non-Profit Corporation Name Requirements:</h4>
                                  <ul className="text-sm text-blue-800 space-y-2">
                                    <li><strong>Entity Identifier:</strong> Most states require the name to include "Corporation," "Incorporated," "Company," "Limited," or an abbreviation (Corp., Inc., Co., Ltd.), unless specifically exempted for non-profits.</li>
                                    <li><strong>Distinctiveness:</strong> The name must be distinguishable from other registered entities in the state.</li>
                                    <li><strong>Purpose/Restrictions:</strong> The name should not mislead the public about the corporation's purpose. Some states restrict or require approval for certain words (such as "bank" or "insurance").</li>
                                    <li><strong>Prohibited Words:</strong> Cannot include words implying it is organized for purposes other than those permitted for non-profits (e.g., "LLC," "Partnership," etc.).</li>
                                    <li><strong>Compliance:</strong> Must comply with state-specific rules and, in some cases, with IRS requirements for charitable organizations.</li>
                                  </ul>
                                </div>
                              )}
                              
                              {/* AI Assistant Button */}
                              <div className="mt-4 pt-4 border-t border-blue-200">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={openAIAssistant}
                                  className="w-full bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  I have Questions
                                </Button>
                              </div>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Business Purpose *</FormLabel>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            placeholder="Describe the purpose and activities of your business"
                            className="mt-2 min-h-[100px]"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(formData.entityType === "Corporation" || formData.entityType === "Professional Corporation") && (
                      <div className="space-y-6">
                        {/* Information Tip */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-blue-800 mb-2">Corporation Share Information</h4>
                              <p className="text-sm text-blue-700">
                                In corporation formation, the "Number of Authorized Shares" refers to the total number of shares a corporation is permitted to issue. This information is a required detail that is typically included in the Articles of Incorporation when you file to form a corporation. Additionally, the amount or number of shares is also a common content requirement for a corporation's annual report.
                              </p>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="numberOfShares"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold">Number of Authorized Shares</FormLabel>
                              <Input
                                {...field}
                                type="number"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                placeholder="e.g., 1000"
                                className="mt-2"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="parValuePerShare"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold">Par Value Per Share</FormLabel>
                              <div className="relative mt-2">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={field.value || ""}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  placeholder="0.01"
                                  className="pl-8"
                                />
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Par value is the minimum price per share. Many corporations use $0.01 or "no par value."
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 6: Business Address */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Address</h3>
                      <p className="text-sm text-gray-600">
                        This will be the official registered address for your business entity.
                      </p>
                    </div>

                    {/* Privacy Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800 mb-2">Privacy Notice</h4>
                          <p className="text-sm text-yellow-700 mb-3">
                            Your business addresses and mailing addresses provided in business formation filings are generally public information. When you register a business (such as an LLC or corporation), the addresses you list—whether a physical business address, mailing address, or registered agent address—become part of the public record maintained by the Secretary of State or similar agency in most states.
                          </p>
                          <div className="bg-white rounded-lg p-3 border border-yellow-300">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-900 mb-1">Protect Your Privacy with Digital Mailbox</h5>
                                <p className="text-xs text-gray-600 mb-2">
                                  Keep your personal address private by using our secure digital mailbox service as your business mailing address.
                                </p>
                                <div className="text-xs text-gray-500">
                                  Starting at $29/month • Mail scanning • Package receiving • Professional address
                                </div>
                              </div>
                              {formData.selectedDigitalMailboxPlanName ? (
                                <div className="ml-3 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-medium flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Added: {formData.selectedDigitalMailboxPlanName}
                                </div>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  className="ml-3 bg-green-500 hover:bg-green-500/90 text-white text-xs"
                                  onClick={() => setShowDigitalMailboxModal(true)}
                                >
                                  Add to Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Type Explanations - Simplified */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-blue-900">Address Requirements</h4>
                        <button
                          type="button"
                          onClick={() => setShowAddressHelp(!showAddressHelp)}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          {showAddressHelp ? 'Hide details' : 'Need help?'}
                        </button>
                      </div>
                      
                      <p className="text-xs text-blue-700 mt-1">
                        Business address must be a physical location (not P.O. Box). Mailing address can be different for privacy.
                      </p>

                      {showAddressHelp && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <h5 className="font-semibold text-blue-800 mb-1">Business Address</h5>
                              <p className="text-blue-700">Physical location for legal registration and operations</p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-blue-800 mb-1">Mailing Address</h5>
                              <p className="text-blue-700">Where you receive mail - can be P.O. Box or different location</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel className="text-lg font-semibold">Street Address *</FormLabel>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="Start typing your street address..."
                            className="mt-2"
                            onChange={(e) => handleAddressInputChange(e.target.value, field)}
                            onBlur={() => {
                              // Hide suggestions after a short delay to allow clicking on them
                              setTimeout(() => {
                                setShowSuggestions(false);
                              }, 200);
                              
                              const formValues = form.getValues();
                              if (formValues.streetAddress && formValues.city && formValues.state && formValues.zipCode) {
                                verifyAddress({
                                  streetAddress: formValues.streetAddress,
                                  city: formValues.city,
                                  state: formValues.state,
                                  zipCode: formValues.zipCode
                                });
                              }
                            }}
                            onFocus={() => {
                              if (addressSuggestions.length > 0) {
                                setShowSuggestions(true);
                              }
                            }}
                          />
                          
                          {/* Address Suggestions Dropdown */}
                          {showSuggestions && addressSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                              {addressSuggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                                  onClick={() => selectAddressSuggestion(suggestion, field)}
                                >
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {suggestion}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">City *</FormLabel>
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="Enter city"
                              className="mt-2"
                              onBlur={() => {
                                const formValues = form.getValues();
                                if (formValues.streetAddress && formValues.city && formValues.state && formValues.zipCode) {
                                  verifyAddress({
                                    streetAddress: formValues.streetAddress,
                                    city: formValues.city,
                                    state: formValues.state,
                                    zipCode: formValues.zipCode
                                  });
                                }
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">State *</FormLabel>
                            <Select 
                              value={field.value || ""} 
                              onValueChange={(value) => {
                                field.onChange(value);
                                const formValues = form.getValues();
                                if (formValues.streetAddress && formValues.city && value && formValues.zipCode) {
                                  verifyAddress({
                                    streetAddress: formValues.streetAddress,
                                    city: formValues.city,
                                    state: value,
                                    zipCode: formValues.zipCode
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="mt-2 bg-orange-100 border-2 border-green-500 text-gray-900 hover:bg-orange-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all font-medium">
                                <SelectValue placeholder="Choose your state" className="text-gray-700 font-medium" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATES.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">ZIP Code *</FormLabel>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="Enter ZIP code"
                            className="mt-2 max-w-xs"
                            onBlur={() => {
                              const formValues = form.getValues();
                              if (formValues.streetAddress && formValues.city && formValues.state && formValues.zipCode) {
                                verifyAddress({
                                  streetAddress: formValues.streetAddress,
                                  city: formValues.city,
                                  state: formValues.state,
                                  zipCode: formValues.zipCode
                                });
                              }
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address Verification Status */}
                    {addressVerification.status !== 'idle' && (
                      <div className={`rounded-lg p-4 ${
                        addressVerification.status === 'verified' 
                          ? 'bg-green-50 border border-green-200' 
                          : addressVerification.status === 'verifying'
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {addressVerification.status === 'verified' && (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                            {addressVerification.status === 'verifying' && (
                              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            )}
                            {addressVerification.status === 'error' && (
                              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className={`text-sm font-medium ${
                              addressVerification.status === 'verified' 
                                ? 'text-green-800' 
                                : addressVerification.status === 'verifying'
                                ? 'text-blue-800'
                                : 'text-yellow-800'
                            }`}>
                              {addressVerification.status === 'verified' && 'Address Verified'}
                              {addressVerification.status === 'verifying' && 'Verifying Address...'}
                              {addressVerification.status === 'error' && 'Address Verification'}
                            </p>
                            {addressVerification.message && (
                              <p className={`text-sm ${
                                addressVerification.status === 'verified' 
                                  ? 'text-green-600' 
                                  : addressVerification.status === 'verifying'
                                  ? 'text-blue-600'
                                  : 'text-yellow-600'
                              }`}>
                                {addressVerification.message}
                              </p>
                            )}
                          </div>
                        </div>
                        {addressVerification.suggestions && addressVerification.suggestions.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-yellow-800 mb-2">Suggested addresses:</p>
                            <ul className="space-y-1">
                              {addressVerification.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-yellow-700">
                                  • {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mailing Address Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Mailing Address</h4>
                          <p className="text-sm text-gray-600">Where should we send important business documents?</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="useDifferentMailing"
                            checked={useDifferentMailingAddress}
                            onChange={(e) => setUseDifferentMailingAddress(e.target.checked)}
                            className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="useDifferentMailing" className="ml-2 text-sm text-gray-700">
                            Use different mailing address
                          </label>
                        </div>
                      </div>

                      {!useDifferentMailingAddress && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">
                            Documents will be mailed to your business address above.
                          </p>
                        </div>
                      )}

                      {useDifferentMailingAddress && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="mailingStreetAddress"
                            render={({ field }) => (
                              <FormItem className="relative">
                                <FormLabel className="text-lg font-semibold">Mailing Street Address</FormLabel>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Start typing your mailing address..."
                                  className="mt-2"
                                  onChange={(e) => handleMailingAddressInputChange(e.target.value, field)}
                                  onBlur={() => {
                                    // Hide suggestions after a short delay to allow clicking on them
                                    setTimeout(() => {
                                      setShowMailingSuggestions(false);
                                    }, 200);
                                  }}
                                  onFocus={() => {
                                    if (mailingAddressSuggestions.length > 0) {
                                      setShowMailingSuggestions(true);
                                    }
                                  }}
                                />
                                
                                {/* Mailing Address Suggestions Dropdown */}
                                {showMailingSuggestions && mailingAddressSuggestions.length > 0 && (
                                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                    {mailingAddressSuggestions.map((suggestion, index) => (
                                      <div
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                                        onClick={() => selectMailingAddressSuggestion(suggestion, field)}
                                      >
                                        <div className="flex items-center">
                                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                          </svg>
                                          {suggestion}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="mailingCity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold">Mailing City</FormLabel>
                                  <Input
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Enter mailing city"
                                    className="mt-2"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="mailingState"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-lg font-semibold">Mailing State</FormLabel>
                                  <Select value={field.value || ""} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="Select mailing state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {STATES.map((state) => (
                                        <SelectItem key={state} value={state}>
                                          {state}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="mailingZipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold">Mailing ZIP Code</FormLabel>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Enter mailing ZIP code"
                                  className="mt-2 max-w-xs"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 7: Business Leadership & Legal Information */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    {/* Owner Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Owner Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="ownerFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner First Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter first name" 
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData(prev => ({ ...prev, ownerFirstName: e.target.value }));
                                    setHasUnsavedChanges(true);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ownerLastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner Last Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter last name" 
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData(prev => ({ ...prev, ownerLastName: e.target.value }));
                                    setHasUnsavedChanges(true);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="ownerAddress"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Owner Address *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter full address" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData(prev => ({ ...prev, ownerAddress: e.target.value }));
                                  setHasUnsavedChanges(true);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <p className="text-gray-600 mb-6">This information will be used to create your client account.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Email Address *
                                {verifiedEmail && (
                                  <div className="flex items-center gap-1 text-green-600 text-sm">
                                    <Check className="h-4 w-4" />
                                    <span className="text-xs font-normal">Verified</span>
                                  </div>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="Enter your email address" 
                                  value={verifiedEmail || field.value || ''}
                                  disabled={!!verifiedEmail}
                                  className={verifiedEmail ? 'bg-gray-50 text-gray-600' : ''}
                                  onChange={(e) => {
                                    if (!verifiedEmail) {
                                      field.onChange(e.target.value);
                                      setFormData(prev => ({ ...prev, contactEmail: e.target.value }));
                                      setHasUnsavedChanges(true);
                                    }
                                  }}
                                />
                              </FormControl>
                              {verifiedEmail && (
                                <p className="text-xs text-green-600 mt-1">
                                  This email was verified in step 2 and cannot be changed for security reasons.
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel"
                                  placeholder="Enter your phone number" 
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData(prev => ({ ...prev, contactPhone: e.target.value }));
                                    setHasUnsavedChanges(true);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Registered Agent Selection */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Registered Agent Selection</h3>
                      
                      <FormField
                        control={form.control}
                        name="registeredAgentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Choose Registered Agent Option *</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setFormData(prev => ({ ...prev, registeredAgentType: value as "self" | "third_party" }));
                                  setHasUnsavedChanges(true);
                                }}
                                value={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="self" id="self" />
                                  <label htmlFor="self">Act as my own registered agent</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="third_party" id="third_party" />
                                  <label htmlFor="third_party" className="flex items-center gap-2">
                                    Use ParaFort registered agent service
                                    {(() => {
                                      // Check if registered agent service is included in the selected plan
                                      const registeredAgentService = servicesWithPlans.find(
                                        (swp: any) => swp.planId === formData.subscriptionPlanId && 
                                        swp.serviceName?.toLowerCase().includes('registered agent') && 
                                        swp.includedInPlan === true
                                      );
                                      
                                      if (registeredAgentService) {
                                        return (
                                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            Included in your plan
                                          </span>
                                        );
                                      } else {
                                        // Find the registered agent service in allServices to get the correct price
                                        const registeredAgentServiceData = allServices.find(
                                          (service: any) => service.name?.toLowerCase().includes('registered agent')
                                        );
                                        
                                        if (registeredAgentServiceData) {
                                          const price = registeredAgentServiceData.recurringPrice || registeredAgentServiceData.oneTimePrice || 0;
                                          const interval = registeredAgentServiceData.recurringInterval || 'year';
                                          return (
                                            <span className="text-gray-600 text-sm">
                                              (+${parseFloat(price).toFixed(2)}/{interval})
                                            </span>
                                          );
                                        } else {
                                          return (
                                            <span className="text-gray-600 text-sm">
                                              (Price available upon selection)
                                            </span>
                                          );
                                        }
                                      }
                                    })()}
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Corporation Officers (if Corporation is selected) */}
                    {formData.entityType?.includes("Corporation") && (
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Corporate Officers</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="presidentName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>President Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter president's full name" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setFormData(prev => ({ ...prev, presidentName: e.target.value }));
                                      setHasUnsavedChanges(true);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="secretaryName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secretary Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter secretary's full name" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setFormData(prev => ({ ...prev, secretaryName: e.target.value }));
                                      setHasUnsavedChanges(true);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="treasurerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Treasurer Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter treasurer's full name (optional)" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setFormData(prev => ({ ...prev, treasurerName: e.target.value }));
                                      setHasUnsavedChanges(true);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 8: Checkout & Payment */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                      
                      {/* Business Formation Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Entity Type:</span>
                          <span className="font-medium">{formData.entityType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Business Name:</span>
                          <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">State of Formation:</span>
                          <span className="font-medium">{formData.state}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Business Address:</span>
                          <span className="font-medium text-right max-w-sm">
                            {formData.streetAddress}<br />
                            {formData.city}, {formData.state} {formData.zipCode}
                          </span>
                        </div>
                      </div>

                      {/* Filer Contact Information */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Filer Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{formData.ownerFirstName} {formData.ownerLastName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{formData.contactEmail}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{formData.contactPhone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Pricing Breakdown</h4>
                        
                        {/* Subscription Plan */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">
                            {subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.name} Plan (Annual)
                          </span>
                          <span className="font-medium">
                            ${subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.yearlyPrice || '0'}
                          </span>
                        </div>

                        {/* State Filing Fee */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">State Filing Fee ({formData.state})</span>
                          <span className="font-medium">${getStateFilingFee()}</span>
                        </div>

                        {/* Additional Services */}
                        {formData.selectedServices && formData.selectedServices.length > 0 && servicesWithPlans && (
                          <>
                            {formData.selectedServices.map((serviceId: number) => {
                              // Find service with plan information
                              const serviceWithPlan = servicesWithPlans.find((swp: any) => 
                                swp.serviceId === serviceId && 
                                swp.planId === formData.subscriptionPlanId &&
                                swp.availableAsAddon === true
                              );
                              
                              if (serviceWithPlan) {
                                const price = parseFloat(serviceWithPlan.oneTimePrice) || parseFloat(serviceWithPlan.recurringPrice) || 0;
                                return (
                                  <div key={serviceId} className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">{serviceWithPlan.serviceName}</span>
                                    <span className="font-medium">
                                      ${price.toFixed(2)}
                                      {serviceWithPlan.recurringPrice ? `/${serviceWithPlan.recurringInterval}` : ''}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </>
                        )}

                        {/* Digital Mailbox Subscription */}
                        {formData.selectedDigitalMailboxPlanName && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Digital Mailbox ({formData.selectedDigitalMailboxPlanName})</span>
                            <span className="font-medium">${getDigitalMailboxPrice().toFixed(2)}/month</span>
                          </div>
                        )}

                        {/* Due Today Total */}
                        <div className="border-t border-gray-200 pt-3 mt-4">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span className="text-gray-900">Due Today:</span>
                            <span className="text-green-500">
                              ${(
                                parseFloat(subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.yearlyPrice || '0') +
                                parseFloat(getStateFilingFee().toString()) +
                                parseFloat(calculateSelectedServicesCost().toString()) +
                                getDigitalMailboxPrice()
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Recurring Amounts - Only show if there are recurring items */}
                        {(() => {
                          const hasDigitalMailbox = formData.selectedDigitalMailboxPlanName;
                          const hasRecurringServices = formData.selectedServices && servicesWithPlans && 
                            formData.selectedServices.some(serviceId => {
                              const serviceWithPlan = servicesWithPlans.find((swp: any) => 
                                swp.serviceId === serviceId && 
                                swp.planId === formData.subscriptionPlanId &&
                                swp.availableAsAddon === true &&
                                swp.recurringPrice
                              );
                              return serviceWithPlan;
                            });

                          if (hasDigitalMailbox || hasRecurringServices) {
                            const monthlyRecurring = getDigitalMailboxPrice() + 
                              (formData.selectedServices?.reduce((total: number, serviceId: number) => {
                                const serviceWithPlan = servicesWithPlans?.find((swp: any) => 
                                  swp.serviceId === serviceId && 
                                  swp.planId === formData.subscriptionPlanId &&
                                  swp.availableAsAddon === true &&
                                  swp.recurringPrice &&
                                  (swp.recurringInterval === 'month' || swp.recurringInterval === 'monthly')
                                );
                                return total + (serviceWithPlan ? parseFloat(serviceWithPlan.recurringPrice) : 0);
                              }, 0) || 0);

                            const yearlyRecurring = formData.selectedServices?.reduce((total: number, serviceId: number) => {
                              const serviceWithPlan = servicesWithPlans?.find((swp: any) => 
                                swp.serviceId === serviceId && 
                                swp.planId === formData.subscriptionPlanId &&
                                swp.availableAsAddon === true &&
                                swp.recurringPrice &&
                                (swp.recurringInterval === 'year' || swp.recurringInterval === 'yearly')
                              );
                              return total + (serviceWithPlan ? parseFloat(serviceWithPlan.recurringPrice) : 0);
                            }, 0) || 0;

                            return (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Recurring Charges:</h5>
                                {monthlyRecurring > 0 && (
                                  <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="text-gray-600">Monthly billing:</span>
                                    <span className="font-medium text-gray-900">${monthlyRecurring.toFixed(2)}/month</span>
                                  </div>
                                )}
                                {yearlyRecurring > 0 && (
                                  <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="text-gray-600">Yearly billing:</span>
                                    <span className="font-medium text-gray-900">${yearlyRecurring.toFixed(2)}/year</span>
                                  </div>
                                )}
                                {monthlyRecurring > 0 && (
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Yearly equivalent:</span>
                                    <span className="font-medium text-gray-900">${(monthlyRecurring * 12 + yearlyRecurring).toFixed(2)}/year</span>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      {clientSecret ? (
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Payment</h3>
                          <p className="text-gray-600 mb-6">
                            Your business formation details are ready. Complete your secure payment to finish setting up your business.
                          </p>
                          
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                            <div className="text-lg font-semibold text-gray-900 mb-2">
                              Total Amount: ${(
                                parseFloat(subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.yearlyPrice || '0') +
                                parseFloat(getStateFilingFee().toString()) +
                                parseFloat(calculateSelectedServicesCost().toString()) +
                                getDigitalMailboxPrice()
                              ).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formData.entityType} formation in {formData.state}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              // Debug current form data before saving
                              console.log('Current formData before saving to localStorage:', formData);
                              console.log('Current formData.state:', formData.state);
                              
                              // Save formation data to localStorage for the payment page
                              const formationDataForPayment = {
                                ...formData,
                                totalAmount: (
                                  parseFloat(subscriptionPlans.find(p => p.id === formData.subscriptionPlanId)?.yearlyPrice || '0') +
                                  parseFloat(getStateFilingFee().toString()) +
                                  parseFloat(calculateSelectedServicesCost().toString()) +
                                  getDigitalMailboxPrice()
                                ).toFixed(2)
                              };
                              
                              console.log('Formation data being saved to localStorage:', formationDataForPayment);
                              console.log('Formation data state being saved:', formationDataForPayment.state);
                              
                              localStorage.setItem('parafort_formation_data', JSON.stringify(formationDataForPayment));
                              window.location.href = '/formation-payment-dedicated';
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '12px 32px',
                              backgroundColor: '#34de73',
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: '600',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLButtonElement).style.backgroundColor = '#10b981';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLButtonElement).style.backgroundColor = '#34de73';
                            }}
                          >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Continue to Payment
                          </button>
                          
                          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-1" />
                              Secure Payment
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              2-3 Minutes
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h3>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-blue-800">
                                  <strong>Secure Payment Processing</strong> - Your payment information is protected with bank-level encryption.
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={createPaymentIntent}
                            disabled={paymentProcessing}
                            style={{
                              width: '100%',
                              backgroundColor: paymentProcessing ? '#9ca3af' : '#34de73',
                              color: 'white',
                              padding: '12px 24px',
                              fontSize: '18px',
                              fontWeight: '600',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: paymentProcessing ? 'not-allowed' : 'pointer',
                              transition: 'background-color 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                              if (!paymentProcessing) {
                                (e.target as HTMLButtonElement).style.backgroundColor = '#10b981';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!paymentProcessing) {
                                (e.target as HTMLButtonElement).style.backgroundColor = '#34de73';
                              }
                            }}
                          >
                            {paymentProcessing ? (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Preparing Payment...
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CreditCard className="w-5 h-5 mr-2" />
                                Continue to Payment
                              </div>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={formData.agreeToTerms || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                          className={`mt-1 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded ${
                            !formData.agreeToTerms ? 'border-red-500' : ''
                          }`}
                          required
                        />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                          I agree to the <a href="/terms" target="_blank" className="text-green-500 hover:underline">Terms of Service</a> and 
                          <a href="/privacy" target="_blank" className="text-green-500 hover:underline ml-1">Privacy Policy</a>. 
                          I understand that the subscription is annual and includes the services listed above.
                        </label>
                      </div>
                      {!formData.agreeToTerms && currentStep === 8 && (
                        <p className="text-red-600 text-sm mt-2">
                          You must agree to the Terms of Service and Privacy Policy to continue.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep !== 8 && currentStep !== 7 && (
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousStep}
                      disabled={currentStep === 1}
                      className="flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        const formValues = form.getValues();
                        onSubmit(formValues);
                      }}
                      disabled={saveMutation.isPending || !canProceedToNextStep}
                      className={`flex items-center ${
                        canProceedToNextStep 
                          ? "bg-green-500 hover:bg-green-500/90" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      title={!canProceedToNextStep ? "Please complete all required fields" : ""}
                    >
                      {saveMutation.isPending ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Step 7 specific navigation */}
                {currentStep === 7 && (
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousStep}
                      className="flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        const formValues = form.getValues();
                        onSubmit(formValues);
                      }}
                      disabled={saveMutation.isPending || !canProceedToNextStep}
                      className={`flex items-center ${
                        canProceedToNextStep 
                          ? "bg-green-500 hover:bg-green-500/90" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      title={!canProceedToNextStep ? "Please complete all required fields" : ""}
                    >
                      {saveMutation.isPending ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Email Exists Modal */}
      <Dialog open={showEmailExistsModal} onOpenChange={setShowEmailExistsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Account Already Exists
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              An account with this email address already exists. Please log in to continue with your business formation or use a different email address.
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => window.location.href = '/login'}
                className="flex-1 bg-green-500 hover:bg-green-500/90"
              >
                Log In
              </Button>
              <Button
                onClick={() => {
                  setShowEmailExistsModal(false);
                  setEmailVerificationStatus({ status: 'idle' });
                  form.setValue('contactEmail', '');
                }}
                variant="outline"
                className="flex-1"
              >
                Use Different Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant Dialog */}
      <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Business Name Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg mb-4">
              {aiMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAISubmit} className="flex gap-2">
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about business name requirements..."
                className="flex-1"
                disabled={aiLoading}
              />
              <Button type="submit" disabled={!aiInput.trim() || aiLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal */}
      {showOtpVerification && (
        <OtpVerificationModal
          email={form.getValues('contactEmail') || ''}
          onVerificationComplete={handleOtpVerificationComplete}
          onCancel={handleOtpVerificationCancel}
        />
      )}

      {/* Digital Mailbox Modal */}
      <DigitalMailboxModal
        isOpen={showDigitalMailboxModal}
        onClose={() => setShowDigitalMailboxModal(false)}
        onSelectPlan={handleDigitalMailboxPlanSelection}
      />
    </div>
  );
}