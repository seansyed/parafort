import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useAIFeatures } from "@/hooks/useAIFeatures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { isUnauthorizedError } from "@/lib/authUtils";
import SmartFieldInput from "@/components/ai/SmartFieldInputFixed";
import PersonalizedRecommendations from "@/components/ai/PersonalizedRecommendations";
import AbandonmentPredictor from "@/components/ai/AbandonmentPredictor";
import type { Service, ServiceField } from "@shared/schema";

// Annual Report Filing Fees by State - Updated to match stateFilingFees.ts
const ANNUAL_REPORT_FILING_FEES: Record<string, number> = {
  AL: 25, AK: 100, AZ: 0, AR: 150, CA: 20, CO: 10, CT: 80, DE: 300, FL: 150, GA: 50,
  HI: 8, ID: 30, IL: 75, IN: 30, IA: 30, KS: 40, KY: 15, LA: 30, ME: 85, MD: 100,
  MA: 125, MI: 25, MN: 0, MS: 25, MO: 45, MT: 15, NE: 25, NV: 200, NH: 100, NJ: 50,
  NM: 25, NY: 9, NC: 25, ND: 50, OH: 0, OK: 25, OR: 100, PA: 70, RI: 50, SC: 10,
  SD: 25, TN: 20, TX: 0, UT: 15, VT: 35, VA: 50, WA: 60, WV: 25, WI: 25, WY: 50
};

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }
];

// Load Stripe
// Initialize Stripe with server configuration
let stripePromise: Promise<any | null> | null = null;

async function initializeStripe(): Promise<any | null> {
  try {
    const response = await fetch('/api/stripe/config');
    const config = await response.json();
    
    if (config.error) {
      console.error("Stripe configuration error:", config.error);
      return null;
    }
    
    if (config.publishableKey && config.publishableKey.startsWith('pk_')) {
      return await loadStripe(config.publishableKey);
    } else {
      console.error("Invalid publishable key received from server");
      return null;
    }
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    return null;
  }
}

function getStripe() {
  if (!stripePromise) {
    stripePromise = initializeStripe();
  }
  return stripePromise;
}

// Dynamic form schema - built at runtime based on service fields
const createDynamicSchema = (serviceFields: ServiceField[], isAuthenticated: boolean, serviceId?: string) => {
  const schemaFields: Record<string, z.ZodType<any>> = {};
  
  // Add account creation fields for non-authenticated users
  if (!isAuthenticated) {
    schemaFields.firstName = z.string().min(1, "First name is required");
    schemaFields.lastName = z.string().min(1, "Last name is required");
    schemaFields.email = z.string().email("Valid email is required");
    schemaFields.phone = z.string().min(10, "Valid phone number is required");
  }
  
  // Add state selection for Annual Report Filing (service ID: 5)
  if (serviceId === "5") {
    schemaFields.filingState = z.string().min(1, "Filing state is required");
  }
  
  // Add service-specific fields
  serviceFields.forEach(field => {
    if (field.isRequired) {
      switch (field.fieldType) {
        case "email":
          schemaFields[field.fieldName] = z.string().email(`Valid ${field.fieldLabel} is required`);
          break;
        case "number":
          schemaFields[field.fieldName] = z.string().min(1, `${field.fieldLabel} is required`);
          break;
        case "phone":
          schemaFields[field.fieldName] = z.string().min(10, `Valid ${field.fieldLabel} is required`);
          break;
        default:
          schemaFields[field.fieldName] = z.string().min(1, `${field.fieldLabel} is required`);
      }
    } else {
      schemaFields[field.fieldName] = z.string().optional();
    }
  });
  
  // Add business details
  schemaFields.businessName = z.string().min(1, "Business name is required");
  schemaFields.customerNotes = z.string().optional();
  
  return z.object(schemaFields);
};

// Payment form component
const PaymentForm = ({ onSuccess, totalAmount }: { onSuccess: () => void; totalAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      onSuccess();
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function DynamicCheckout() {
  const [, params] = useRoute("/dynamic-checkout/:serviceId");
  const serviceId = params?.serviceId;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Don't redirect - handle authentication inline

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Login function for existing users
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return;
    
    setIsLoggingIn(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        email: loginEmail,
        password: loginPassword
      });
      
      if (response.ok) {
        // Redirect to step-by-step checkout for authenticated users
        window.location.href = `/multi-step-checkout/${serviceId}`;
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your email and password",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [isExpedited, setIsExpedited] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showSimplifiedForm, setShowSimplifiedForm] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  // AI-powered features
  const aiFeatures = useAIFeatures(serviceId ? parseInt(serviceId) : undefined);

  // Fetch service details and fields
  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: [`/api/services/${serviceId}/with-fields`],
    enabled: !!serviceId,
    retry: false,
  });

  const service = (serviceData?.service || {}) as Service;
  const serviceFields: ServiceField[] = serviceData?.fields || [];

  // Create dynamic form schema
  const dynamicSchema = createDynamicSchema(serviceFields, isAuthenticated, serviceId);
  type FormData = z.infer<typeof dynamicSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: isAuthenticated ? {
      customerNotes: "",
      businessName: "",
      ...(serviceId === "5" && { filingState: "" }),
    } : {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      customerNotes: "",
      businessName: "",
      ...(serviceId === "5" && { filingState: "" }),
    },
  });

  // Track form changes to detect unsaved data
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle browser navigation and page refresh warnings
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !showPayment) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges && !showPayment) {
        e.preventDefault();
        setShowExitWarning(true);
        setPendingNavigation(() => () => window.history.back());
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, showPayment]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders/create-dynamic", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowPayment(true);
      setHasUnsavedChanges(false); // Clear unsaved changes flag
      toast({
        title: "Order Created",
        description: isAuthenticated 
          ? "Order created successfully. Please complete payment."
          : "Account created and order prepared. Please complete payment.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Session Expired",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }
      toast({
        title: "Order Creation Failed",
        description: "There was an error creating your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!service) return;

    // Extract custom fields
    const customFields: Record<string, any> = {};
    serviceFields.forEach(field => {
      if (data[field.fieldName as keyof FormData]) {
        customFields[field.fieldName] = data[field.fieldName as keyof FormData];
      }
    });

    const orderData = {
      serviceId: parseInt(serviceId!),
      customFields,
      businessName: data.businessName || "",
      customerNotes: data.customerNotes || "",
      isExpedited,
      // For Annual Report Filing, include state and filing fee
      ...(serviceId === "5" && data.filingState && {
        filingState: data.filingState,
        stateFilingFee: ANNUAL_REPORT_FILING_FEES[data.filingState as keyof typeof ANNUAL_REPORT_FILING_FEES],
      }),
      // For non-authenticated users
      ...(!isAuthenticated && {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      }),
    };

    createOrderMutation.mutate(orderData);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Your order has been completed successfully!",
    });
    // Redirect to success page or order confirmation
    window.location.href = "/checkout-success";
  };

  // Render field based on type
  const renderField = (field: ServiceField) => {
    const fieldName = field.fieldName as keyof FormData;
    
    return (
      <FormField
        key={field.id}
        control={form.control}
        name={fieldName}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.fieldLabel}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {field.fieldType === "textarea" ? (
                <Textarea
                  placeholder={field.placeholder || ""}
                  {...formField}
                />
              ) : field.fieldType === "select" && field.options ? (
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || `Select ${field.fieldLabel}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options as any)?.values?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.fieldType}
                  placeholder={field.placeholder || ""}
                  {...formField}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  if (authLoading || serviceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600">The requested service could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order for {service.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>
                {isAuthenticated 
                  ? "Please provide the required information for your order."
                  : "We'll create an account for you and send you login details."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Login section for existing users */}
                  {!isAuthenticated && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Already have an account?</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-3">Sign in to your existing account</h4>
                          <div className="space-y-3">
                            <div>
                              <input
                                type="email"
                                placeholder="Email address"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleLogin}
                              disabled={isLoggingIn || !loginEmail || !loginPassword}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                              {isLoggingIn ? "Signing In..." : "Sign In"}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">or create a new account</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">New Customer - Create Account</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <SmartFieldInput
                                    name="firstName"
                                    placeholder="First name"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onFocus={() => aiFeatures.startFieldTracking('firstName')}
                                    onBlur={() => aiFeatures.trackFieldInteraction('firstName', 'text', field.value)}
                                    smartPrediction={aiFeatures.getFieldSuggestion('firstName') || undefined}
                                    voiceResult={aiFeatures.voiceCommand?.extractedValue || ""}
                                    onVoiceStart={() => aiFeatures.startVoiceInput('firstName')}
                                    onVoiceStop={aiFeatures.stopVoiceInput}
                                    isListening={aiFeatures.isListening}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <SmartFieldInput
                                    name="lastName"
                                    placeholder="Last name"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onFocus={() => aiFeatures.startFieldTracking('lastName')}
                                    onBlur={() => aiFeatures.trackFieldInteraction('lastName', 'text', field.value)}
                                    smartPrediction={aiFeatures.getFieldSuggestion('lastName') || undefined}
                                    voiceResult={aiFeatures.voiceCommand?.extractedValue || ""}
                                    onVoiceStart={() => aiFeatures.startVoiceInput('lastName')}
                                    onVoiceStop={aiFeatures.stopVoiceInput}
                                    isListening={aiFeatures.isListening}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* State selection for Annual Report Filing */}
                  {serviceId === "5" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Filing State</h3>
                      <FormField
                        control={form.control}
                        name="filingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Filing State *</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedState(value);
                                }} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose the state where your business is registered" />
                                </SelectTrigger>
                                <SelectContent>
                                  {US_STATES.map((state) => (
                                    <SelectItem key={state.code} value={state.code}>
                                      {state.name} - ${ANNUAL_REPORT_FILING_FEES[state.code]} state fee
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Service-specific fields */}
                  {serviceFields.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
                      {serviceFields
                        .sort((a, b) => a.order - b.order)
                        .map(renderField)
                      }
                    </div>
                  )}

                  {/* Business and additional information */}
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any special instructions or notes for your order" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Expedited Service Option - Available for all services */}
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Processing Options</h3>
                    <div className="space-y-3">
                      {/* Standard Processing */}
                      <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50">
                        <input
                          type="radio"
                          id="standard"
                          name="processingType"
                          checked={!isExpedited}
                          onChange={() => setIsExpedited(false)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="standard" className="font-medium text-gray-900 cursor-pointer">
                            Standard Processing
                          </label>
                          <p className="text-sm text-gray-600 mt-1">
                            {serviceId === "17" ? "Complete EIN application in 7-10 business days" : 
                             serviceId === "11" ? "BOIR filing processed in 7-10 business days" :
                             serviceId === "5" ? "Annual report filed in 7-10 business days" :
                             "Standard processing timeframe - 7-10 business days"}
                          </p>
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            Included
                          </p>
                        </div>
                      </div>

                      {/* Expedited Processing */}
                      <div className="flex items-start space-x-3 p-4 border rounded-lg border-orange-200 bg-orange-50">
                        <input
                          type="radio"
                          id="expedited"
                          name="processingType"
                          checked={isExpedited}
                          onChange={() => setIsExpedited(true)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="expedited" className="font-medium text-gray-900 cursor-pointer">
                            Expedited Processing
                          </label>
                          <p className="text-sm text-gray-600 mt-1">
                            {serviceId === "17" ? "Rush EIN application - complete in 1-2 business days" : 
                             serviceId === "11" ? "Priority BOIR filing - processed in 2-3 business days" :
                             serviceId === "5" ? "Expedited annual report filing - 2-3 business days" :
                             "Rush processing with priority handling - 2-3 business days"}
                          </p>
                          <p className="text-sm font-semibold text-orange-600 mt-1">
                            +${service.expeditedPrice?.toString() || "75"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI-Powered Recommendations */}
                  {aiFeatures.recommendations.length > 0 && (
                    <>
                      <Separator />
                      <PersonalizedRecommendations
                        recommendations={aiFeatures.recommendations}
                        onAcceptRecommendation={(serviceId) => {
                          console.log('Accepted recommendation for service:', serviceId);
                        }}
                        onDismissRecommendation={(serviceId) => {
                          console.log('Dismissed recommendation for service:', serviceId);
                        }}
                      />
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? "Creating Order..." : "Continue to Payment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900">
                      ${service.oneTimePrice?.toString() || service.recurringPrice?.toString() || "0"}
                    </p>
                  </div>
                </div>

                {/* State Filing Fee for Annual Report Filing */}
                {serviceId === "5" && selectedState && (
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">State Filing Fee</h4>
                      <p className="text-sm text-gray-600">{US_STATES.find(s => s.code === selectedState)?.name} filing fee</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg text-gray-900">
                        ${ANNUAL_REPORT_FILING_FEES[selectedState as keyof typeof ANNUAL_REPORT_FILING_FEES]}
                      </p>
                    </div>
                  </div>
                )}

                {isExpedited && (
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">Expedited Processing</h4>
                      <p className="text-sm text-gray-600">
                        {serviceId === "17" ? "Rush EIN application (1-2 business days)" : 
                         serviceId === "11" ? "Priority BOIR filing (2-3 business days)" :
                         serviceId === "5" ? "Expedited annual report filing (2-3 business days)" :
                         "Rush processing fee (2-3 business days)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg text-gray-900">
                        +${service.expeditedPrice?.toString() || "75"}
                      </p>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">
                    ${(() => {
                      const basePrice = parseFloat(service.oneTimePrice?.toString() || service.recurringPrice?.toString() || "0");
                      const expeditedPrice = isExpedited ? parseFloat(service.expeditedPrice?.toString() || "75") : 0;
                      const stateFilingFee = (serviceId === "5" && selectedState) ? 
                        ANNUAL_REPORT_FILING_FEES[selectedState as keyof typeof ANNUAL_REPORT_FILING_FEES] : 0;
                      return (basePrice + expeditedPrice + stateFilingFee).toFixed(2);
                    })()}
                  </span>
                </div>

                {/* Payment Section */}
                {showPayment && clientSecret && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">Payment Information</h4>
                    <Elements stripe={getStripe()} options={{ clientSecret }}>
                      <PaymentForm 
                        onSuccess={handlePaymentSuccess}
                        totalAmount={(() => {
                          const basePrice = parseFloat(service.oneTimePrice?.toString() || service.recurringPrice?.toString() || "0");
                          const expeditedPrice = isExpedited ? parseFloat(service.expeditedPrice?.toString() || "0") : 0;
                          const stateFilingFee = (serviceId === "5" && selectedState) ? 
                            ANNUAL_REPORT_FILING_FEES[selectedState as keyof typeof ANNUAL_REPORT_FILING_FEES] : 0;
                          return basePrice + expeditedPrice + stateFilingFee;
                        })()}
                      />
                    </Elements>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>



      {/* Beautiful Exit Warning Modal */}
      <Dialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-orange-600">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              Unsaved Changes
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-3">
              You have unsaved information on this page. If you leave now, all your progress will be lost and you'll need to start over.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-3">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-orange-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-800">Information at risk:</p>
                  <ul className="text-sm text-orange-700 mt-1 space-y-1">
                    <li>• Personal and business details</li>
                    <li>• Service selections and customizations</li>
                    <li>• Special requirements and notes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowExitWarning(false);
                if (pendingNavigation) {
                  setHasUnsavedChanges(false);
                  pendingNavigation();
                  setPendingNavigation(null);
                }
              }}
              className="w-full sm:w-auto"
            >
              Leave Anyway
            </Button>
            <Button
              onClick={() => {
                setShowExitWarning(false);
                setPendingNavigation(null);
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              Continue Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}