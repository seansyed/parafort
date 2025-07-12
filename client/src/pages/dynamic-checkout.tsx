import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getStateSpecificFields, hasStateSpecificConfig, type StateFieldCategory } from "@/stateFieldsConfig";
import { getStateFilingFee } from "@/stateFilingFees";

// Initialize Stripe using backend configuration - made lazy
let stripePromise: Promise<any | null> | null = null;

async function getStripePromise() {
  if (!stripePromise) {
    stripePromise = (async () => {
      try {
        const response = await fetch('/api/stripe/config');
        const config = await response.json();
        
        if (config.configured && config.publishableKey && config.publishableKey.startsWith('pk_')) {
          return await loadStripe(config.publishableKey);
        }
        return null;
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        return null;
      }
    })();
  }
  return stripePromise;
}

// Validation schemas for each step
const step1Schema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const step2Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required")
});

// Step components
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex justify-center mb-8">
    <div className="flex items-center space-x-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? "bg-green-600 text-white"
                : step < currentStep
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 mx-2 ${
                step < currentStep ? "bg-green-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const Step1EmailVerification = ({ 
  onNext, 
  onShowLogin, 
  checkoutData, 
  updateData 
}: {
  onNext: () => void;
  onShowLogin: (email: string) => void;
  checkoutData: any;
  updateData: (field: string, value: any) => void;
}) => {
  const [email, setEmail] = useState(checkoutData.email || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiRequest('POST', '/api/auth/check-email', { email });
      const data = await response.json();
      
      if (data.exists) {
        onShowLogin(email);
      } else {
        updateData('email', email);
        onNext();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Welcome! Let's get started</CardTitle>
        <CardDescription>Enter your email address to begin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Continue"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onShowLogin(email || "")}
          >
            Already Have An Account? LOGIN
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LoginForm = ({ 
  email, 
  onBack, 
  serviceId 
}: {
  email: string;
  onBack: () => void;
  serviceId: string;
}) => {
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoggingIn(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        email,
        password
      });
      
      if (response.ok) {
        window.location.href = `/multi-step-checkout/${serviceId}`;
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your password",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label>Email Address</Label>
            <Input value={email} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              Use Different Email
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const Step2GeneralInfo = ({ 
  onNext, 
  onPrev, 
  checkoutData, 
  updateData 
}: {
  onNext: () => void;
  onPrev: () => void;
  checkoutData: any;
  updateData: (field: string, value: any) => void;
}) => {
  const form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: checkoutData.firstName || "",
      lastName: checkoutData.lastName || "",
      phone: checkoutData.phone || "",
      address: checkoutData.address || "",
      city: checkoutData.city || "",
      state: checkoutData.state || "",
      zipCode: checkoutData.zipCode || ""
    }
  });

  const onSubmit = (data: any) => {
    Object.keys(data).forEach(key => {
      updateData(key, data[key]);
    });
    onNext();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>Tell us a bit about yourself</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                placeholder="First name"
              />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                placeholder="Last name"
              />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              placeholder="(555) 123-4567"
            />
            {form.formState.errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              {...form.register("address")}
              placeholder="123 Main Street"
            />
            {form.formState.errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...form.register("city")}
                placeholder="City"
              />
              {form.formState.errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...form.register("state")}
                placeholder="CA"
              />
              {form.formState.errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                {...form.register("zipCode")}
                placeholder="12345"
              />
              {form.formState.errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.zipCode.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const Step3ServiceOptions = ({ 
  onNext, 
  onPrev, 
  service, 
  checkoutData, 
  updateData,
  serviceId 
}: {
  onNext: () => void;
  onPrev: () => void;
  service: any;
  checkoutData: any;
  updateData: (field: string, value: any) => void;
  serviceId: string;
}) => {
  const [isExpedited, setIsExpedited] = useState(checkoutData.isExpedited || false);

  const handleNext = () => {
    updateData('isExpedited', isExpedited);
    onNext();
  };

  const basePrice = Number(service?.oneTimePrice || service?.recurringPrice) || 0;
  const expeditedFee = 75;
  
  // Check if this is a bookkeeping plan by serviceId
  const isBookkeepingPlan = serviceId.startsWith('bookkeeping-');
  
  // Don't add expedited fee for bookkeeping plans since they're subscription services
  const totalPrice = basePrice + (isExpedited && !isBookkeepingPlan ? expeditedFee : 0);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Service Options</CardTitle>
        <CardDescription>Choose your service preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Service Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{service?.name}</h3>
            <p className="text-gray-600">{service?.description}</p>
            <div className="mt-3">
              <span className="text-2xl font-bold text-green-600">
                ${basePrice.toFixed(2)}
              </span>
              {service?.recurringInterval && (
                <span className="text-sm text-gray-500 ml-2">/{service.recurringInterval}</span>
              )}
            </div>
            {service?.name === "Annual Report Filing" && (
              <div className="mt-2 text-sm text-gray-600 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                <p><strong>Important:</strong> State filing fees vary by state and are paid directly to the state.</p>
                <p><strong>Common state fees:</strong> $25-$500 depending on your state of incorporation.</p>
                <p><strong>Payment:</strong> You'll pay state fees separately to your state government.</p>
              </div>
            )}
          </div>

          {/* Processing Speed - Hide for bookkeeping plans and Business Licenses */}
          {!isBookkeepingPlan && serviceId !== '8' && service?.name !== "Business Licenses" && (
            <div>
              <Label className="text-base font-semibold">Processing Speed</Label>
              <RadioGroup
                value={isExpedited ? "expedited" : "standard"}
                onValueChange={(value) => setIsExpedited(value === "expedited")}
                className="mt-2"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Standard Processing</div>
                        <div className="text-sm text-gray-500">7-10 business days</div>
                      </div>
                      <div className="text-green-600 font-semibold">Included</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="expedited" id="expedited" />
                  <Label htmlFor="expedited" className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Expedited Processing</div>
                        <div className="text-sm text-gray-500">1-3 business days</div>
                      </div>
                      <div className="text-green-600 font-semibold">+${expeditedFee}</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{service?.name}</span>
                <span>${basePrice.toFixed(2)}{service?.recurringInterval && `/${service.recurringInterval}`}</span>
              </div>
              {isExpedited && !isBookkeepingPlan && (
                <div className="flex justify-between">
                  <span>Expedited Processing</span>
                  <span>+${expeditedFee.toFixed(2)}</span>
                </div>
              )}
              {service?.name === "Annual Report Filing" && (
                <div className="flex justify-between text-gray-600">
                  <span>State Filing Fee</span>
                  <span>Varies by state</span>
                </div>
              )}
              <div className="border-t pt-1 mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${basePrice.toFixed(2)}{service?.recurringInterval && `/${service.recurringInterval}`}{isExpedited && !service?.isBookkeepingPlan ? ` +$${expeditedFee.toFixed(2)}` : ''}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Step4ServiceFields = ({ 
  onNext, 
  onPrev, 
  service, 
  checkoutData, 
  updateData 
}: {
  onNext: () => void;
  onPrev: () => void;
  service: any;
  checkoutData: any;
  updateData: (field: string, value: any) => void;
}) => {
  const [formData, setFormData] = useState(checkoutData.serviceFields || {});
  const [isExpedited, setIsExpedited] = useState(checkoutData.isExpedited || false);
  const [stateFilingFee, setStateFilingFee] = useState<number | null>(null);
  const [selectedLicensePlan, setSelectedLicensePlan] = useState<string>(checkoutData.selectedLicensePlan || 'guidance');
  
  // Check if this is a bookkeeping plan
  const isBookkeepingPlan = service?.id && service.id.toString().startsWith('bookkeeping');
  
  // Update state filing fee when state selection changes
  useEffect(() => {
    const selectedState = checkoutData.serviceFields?.stateOfIncorporation || 
                         checkoutData.serviceFields?.stateOfFormation ||
                         formData.stateOfIncorporation || 
                         formData.stateOfFormation;
    if (selectedState) {
      const stateInfo = getStateFilingFee(selectedState);
      setStateFilingFee(stateInfo?.fee || null);
    } else {
      setStateFilingFee(null);
    }
  }, [checkoutData.serviceFields, formData.stateOfIncorporation, formData.stateOfFormation]);

  // State-specific field generation using comprehensive configuration
  const getServiceFields = () => {
    // For Annual Report Filing, we need state-specific fields
    if (service?.name === "Annual Report Filing") {
      // First, we need a state selection field
      return [
        { 
          name: "stateOfIncorporation", 
          label: "State of Incorporation", 
          type: "select", 
          options: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"], 
          required: true,
          helpText: "Select your state to show state-specific filing requirements"
        }
      ];
    }

    // Other service types with their specific fields
    switch (service?.name) {
      case "EIN (Tax ID) Service":
        return [
          { name: "businessName", label: "Legal Business Name", type: "text", required: true },
          { name: "businessType", label: "Business Type", type: "select", options: ["LLC", "Corporation", "Partnership", "Sole Proprietorship"], required: true },
          { name: "responsibleParty", label: "Responsible Party", type: "text", required: true },
          { name: "businessPurpose", label: "Business Purpose", type: "textarea", required: true }
        ];
      case "BOIR Filing Service":
        return [
          { name: "companyName", label: "Company Name", type: "text", required: true },
          { name: "incorporationState", label: "State of Incorporation", type: "select", options: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"], required: true },
          { name: "beneficialOwners", label: "Beneficial Owners Information", type: "textarea", required: true }
        ];
      default:
        return [
          { name: "businessName", label: "Business Name", type: "text", required: true },
          { name: "additionalInfo", label: "Additional Information", type: "textarea", required: false }
        ];
    }
  };

  const serviceFields = getServiceFields();
  console.log("Service fields:", serviceFields); // Debug log

  // Get state-specific fields when state is selected for Annual Report Filing
  const [stateSpecificFields, setStateSpecificFields] = useState<StateFieldCategory[]>([]);
  
  useEffect(() => {
    if (service?.name === "Annual Report Filing" && formData.stateOfIncorporation) {
      const stateFields = getStateSpecificFields("Annual Report Filing", formData.stateOfIncorporation);
      setStateSpecificFields(stateFields);
      console.log("State-specific fields for", formData.stateOfIncorporation, ":", stateFields);
    }
  }, [formData.stateOfIncorporation, service?.name]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleExpediteChange = (expedited: boolean) => {
    setIsExpedited(expedited);
    updateData('isExpedited', expedited);
  };

  const handleNext = () => {
    // Validate required fields
    const missingFields = serviceFields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      return; // Show validation errors
    }

    updateData('serviceFields', formData);
    updateData('isExpedited', isExpedited);
    updateData('selectedLicensePlan', selectedLicensePlan);
    onNext();
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
              <CardDescription>Please provide the required information for {service?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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

                {/* Only basic service fields - detailed form moved to post-payment */}
                {serviceFields.map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.helpText && (
                      <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
                    )}
                    
                    {field.type === "text" && (
                      <Input
                        id={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                        className="mt-2"
                      />
                    )}
                    
                    {field.type === "textarea" && (
                      <Textarea
                        id={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                        rows={3}
                        className="mt-2"
                      />
                    )}
                    
                    {field.type === "select" && (
                      <select
                        id={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onPrev}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charges Summary - Takes 1/3 of the width */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            {/* Only show Processing Speed for non-bookkeeping services and exclude Legal Documents and Business Licenses */}
            {!isBookkeepingPlan && serviceId !== '9' && serviceId !== '8' && (
              <>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Speed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={isExpedited ? "expedited" : "standard"} onValueChange={(value) => handleExpediteChange(value === "expedited")}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Standard Processing</div>
                            <div className="text-sm text-gray-500">
                              {service?.name === "EIN (Tax ID) Service" ? "3-5 business days" : 
                               service?.name === "BOIR Filing" ? "7-10 business days" :
                               service?.name === "Annual Report Filing" ? "7-10 business days" : 
                               "7-10 business days"}
                            </div>
                          </div>
                          <div className="text-green-600 font-semibold">Included</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="expedited" id="expedited" />
                      <Label htmlFor="expedited" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Expedited Processing</div>
                            <div className="text-sm text-gray-500">
                              {service?.name === "EIN (Tax ID) Service" ? "1-2 business days" : 
                               service?.name === "BOIR Filing" ? "2-3 business days" :
                               service?.name === "Annual Report Filing" ? "2-3 business days" : 
                               "1-3 business days"}
                            </div>
                          </div>
                          <div className="text-green-600 font-semibold">+$75</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </>
            )}
            
            {/* Order Summary - Show for all services */}
            <CardContent className={isBookkeepingPlan ? "pt-6" : ""}>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{service?.name === "Business Licenses" ? (selectedLicensePlan === "filing" ? "ParaFort License Filing" : "ParaFort License Guidance") : service?.name}</span>
                    <span>${service?.name === "Business Licenses" ? (selectedLicensePlan === "filing" ? "599.00" : "199.00") : Number(service?.oneTimePrice || service?.recurringPrice || 0).toFixed(2)}{service?.recurringInterval && `/${service.recurringInterval}`}</span>
                  </div>
                  {isExpedited && !isBookkeepingPlan && !isLegalDocumentsService && !isBusinessLicenseService && (
                    <div className="flex justify-between">
                      <span>Expedited Processing</span>
                      <span>+$75.00</span>
                    </div>
                  )}
                  {service?.name === "Annual Report Filing" && (() => {
                    const selectedState = checkoutData.serviceFields?.stateOfIncorporation || 
                                       checkoutData.serviceFields?.stateOfFormation ||
                                       formData.stateOfIncorporation || 
                                       formData.stateOfFormation;
                    const entityType = checkoutData.serviceFields?.businessEntityType || 
                                     formData.businessEntityType || 
                                     'LLC';
                    
                    let stateFee = 0;
                    if (selectedState && entityType) {
                      const stateFilingInfo = getStateFilingFee(selectedState, entityType as any);
                      stateFee = stateFilingInfo?.fee || 0;
                    }
                    
                    return stateFee > 0 ? (
                      <div className="flex justify-between">
                        <span>State Filing Fee ({selectedState})</span>
                        <span>${stateFee}</span>
                      </div>
                    ) : null;
                  })()}
                  <div className="border-t pt-1 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(() => {
                      let basePrice = 0;
                      
                      // Handle Business License pricing
                      if (service?.name === "Business Licenses") {
                        basePrice = selectedLicensePlan === "filing" ? 599 : 199;
                      } else {
                        basePrice = Number(service?.oneTimePrice || service?.recurringPrice || 0);
                      }
                      
                      let expeditedFee = (isExpedited && !isBookkeepingPlan && !isBusinessLicenseService) ? 75 : 0;
                      let stateFee = 0;
                      
                      if (service?.name === "Annual Report Filing") {
                        const selectedState = checkoutData.serviceFields?.stateOfIncorporation || 
                                           checkoutData.serviceFields?.stateOfFormation ||
                                           formData.stateOfIncorporation || 
                                           formData.stateOfFormation;
                        const entityType = checkoutData.serviceFields?.businessEntityType || 
                                         formData.businessEntityType || 
                                         'LLC';
                        
                        if (selectedState && entityType) {
                          const stateFilingInfo = getStateFilingFee(selectedState, entityType as any);
                          stateFee = stateFilingInfo?.fee || 0;
                        }
                      }
                      
                      const total = basePrice + expeditedFee + stateFee;
                      return total.toFixed(2);
                    })()}{service?.recurringInterval && `/${service.recurringInterval}`}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Step5Payment = ({ 
  onPrev, 
  service, 
  checkoutData,
  onOrderComplete
}: {
  onPrev: () => void;
  service: any;
  checkoutData: any;
  onOrderComplete: (orderData: any) => void;
}) => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stripeReady, setStripeReady] = useState<any>(null);
  const { toast } = useToast();

  // Use the appropriate price - check both fields as some services use recurringPrice even for one-time
  const basePrice = parseFloat(service?.oneTimePrice || service?.recurringPrice || '0') || 0;
  const expeditedFee = checkoutData.isExpedited ? 75 : 0;
  const totalPrice = basePrice + expeditedFee;

  useEffect(() => {
    // Load Stripe when component mounts
    const loadStripeAndCreateIntent = async () => {
      try {
        // Load Stripe first
        const stripe = await getStripePromise();
        setStripeReady(stripe);
        
        // Then create payment intent
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          amount: totalPrice,
          serviceId: service.id,
          orderData: checkoutData
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStripeAndCreateIntent();
  }, [totalPrice, service.id, checkoutData]);

  // Check if Stripe is configured
  if (!stripeReady) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Setup Required</h3>
            <p className="text-gray-600 mb-4">
              Please provide the correct Stripe publishable key to enable payments.
            </p>
            <Button onClick={onPrev} variant="outline">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Preparing payment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{service?.name}</span>
              <span>${basePrice}</span>
            </div>
            {checkoutData.isExpedited && (
              <div className="flex justify-between">
                <span>Expedited Processing</span>
                <span>+${expeditedFee}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-green-600">${totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Enter your payment details to complete the order</CardDescription>
        </CardHeader>
        <CardContent>
          {clientSecret && stripeReady && (
            <Elements 
              stripe={stripeReady} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe'
                }
              }}
            >
              <PaymentForm
                onPrev={onPrev}
                totalAmount={totalPrice}
                onOrderComplete={onOrderComplete}
                checkoutData={checkoutData}
                service={service}
              />
            </Elements>
          )}
          {clientSecret && !stripeReady && (
            <div className="text-center">
              <p className="text-red-600 mb-4">Payment system configuration error. Please check console for details.</p>
              <Button onClick={onPrev} variant="outline">
                Go Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PaymentForm = ({ 
  onPrev, 
  totalAmount, 
  onOrderComplete,
  checkoutData,
  service 
}: {
  onPrev: () => void;
  totalAmount: number;
  onOrderComplete: (orderData: any) => void;
  checkoutData: any;
  service: any;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent?.status === "succeeded") {
        // Create order in database
        const orderData = {
          serviceId: service.id,
          userId: null, // Will be created
          amount: totalAmount,
          paymentIntentId: paymentIntent.id,
          customerData: checkoutData,
          status: "completed"
        };

        try {
          const response = await apiRequest('POST', '/api/orders', orderData);
          const order = await response.json();
          onOrderComplete(order);
        } catch (error) {
          toast({
            title: "Order Error",
            description: "Payment succeeded but order creation failed. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1"
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

const ThankYouPage = ({ orderData }: { orderData: any }) => (
  <Card className="max-w-2xl mx-auto">
    <CardHeader className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <CardTitle className="text-2xl">Thank You!</CardTitle>
      <CardDescription>Your order has been successfully submitted</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Order Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono">{orderData.id || "ORD-" + Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{orderData.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>${orderData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600">Confirmed</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            We'll send you updates via email as we process your order.
          </p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="bg-green-600 hover:bg-green-700"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DynamicCheckout() {
  const [, params] = useRoute("/dynamic-checkout/:serviceId");
  const serviceId = params?.serviceId;
  const { isAuthenticated } = useAuth();

  // Define service type checks
  const isBookkeepingPlan = serviceId?.startsWith('bookkeeping-');
  const isRegisteredAgentPlan = serviceId?.startsWith('registered-agent-');
  const isMailboxPlan = serviceId?.startsWith('mailbox-');
  const isLegalDocumentsService = serviceId === '9';
  const isBusinessLicenseService = serviceId === '8';

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const [checkoutData, setCheckoutData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isExpedited: false,
    serviceFields: {}
  });

  // Fetch service data - handle regular services, bookkeeping plans, registered agent plans, and mailbox plans
  const actualServiceId = isBookkeepingPlan ? serviceId?.replace('bookkeeping-', '') : 
                          isRegisteredAgentPlan ? serviceId?.replace('registered-agent-', '') : 
                          isMailboxPlan ? serviceId?.replace('mailbox-', '') :
                          serviceId;
  
  console.log('Main - URL location:', window.location.pathname);
  console.log('Main - serviceId extracted:', serviceId, 'Type:', typeof serviceId);
  console.log('Main - actualServiceId:', actualServiceId);
  console.log('Main - isMailboxPlan:', isMailboxPlan);
  
  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: isBookkeepingPlan ? [`/api/bookkeeping/plans/${actualServiceId}`] : 
              isRegisteredAgentPlan ? [`/api/registered-agent-plans`] :
              isMailboxPlan ? [`/api/mailbox-plans`] :
              [`/api/services/${serviceId}`],
    enabled: !!serviceId,
    select: (data) => {
      console.log('Main - service data loaded:', data, 'Keys:', Object.keys(data || {}));
      console.log('Main - has service id property:', !!(data && typeof data === 'object' && 'id' in data));
      
      if (isBookkeepingPlan && data) {
        // Transform bookkeeping plan data to match service format
        return {
          id: `bookkeeping-${data.id}`,
          name: `${data.name} Bookkeeping Plan`,
          description: data.description,
          oneTimePrice: null,
          recurringPrice: (data.monthlyPrice / 100).toFixed(2), // Convert from cents
          recurringInterval: 'month',
          features: data.features || [],
          isBookkeepingPlan: true
        };
      } else if (isRegisteredAgentPlan && data) {
        // Find the specific registered agent plan and transform to match service format
        const planId = parseInt(serviceId?.replace('registered-agent-', '') || '0');
        const plan = data.find((p: any) => p.id === planId);
        if (plan) {
          return {
            id: `registered-agent-${plan.id}`,
            name: `${plan.displayName || plan.name}`,
            description: plan.description,
            oneTimePrice: null,
            recurringPrice: plan.yearlyPrice,
            recurringInterval: 'year',
            features: plan.features || [],
            isRegisteredAgentPlan: true
          };
        }
      } else if (isMailboxPlan && data && Array.isArray(data)) {
        // Find the specific mailbox plan and transform to match service format
        const planId = parseInt(serviceId?.replace('mailbox-', '') || '0');
        console.log('Main - looking for planId:', planId, 'in data:', data);
        const plan = data.find((p: any) => p.id === planId);
        console.log('Main - found plan:', plan);
        if (plan) {
          return {
            id: `mailbox-${plan.id}`,
            name: plan.displayName,
            description: `Digital mailbox service with ${plan.businessAddresses} business address and ${plan.mailItemsPerMonth} mail items per month`,
            oneTimePrice: null,
            recurringPrice: plan.monthlyPrice,
            recurringInterval: 'month',
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
      }
      return data;
    }
  });
  
  console.log('Main - service loading state:', serviceLoading);

  // Redirect authenticated users to multi-step checkout (except for registered agent plans)
  useEffect(() => {
    if (isAuthenticated && serviceId && !isRegisteredAgentPlan) {
      window.location.href = `/multi-step-checkout/${serviceId}`;
    }
  }, [isAuthenticated, serviceId, isRegisteredAgentPlan]);

  const updateCheckoutData = (field: string, value: any) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }));
  };

  const handleShowLogin = (email: string) => {
    setLoginEmail(email);
    setShowLogin(true);
  };

  const handleOrderComplete = (order: any) => {
    // Services that require post-payment questionnaire forms
    const servicesWithPostPaymentForms = [5]; // Annual Report Filing
    
    const requiresAdditionalForm = servicesWithPostPaymentForms.includes(parseInt(serviceId!));
    
    if (requiresAdditionalForm) {
      // Redirect to post-payment form for detailed state-specific requirements
      window.location.href = `/post-payment-form/${order.orderId}`;
    } else {
      // Show thank you page for services that don't require additional information
      setOrderData(order);
      setOrderCompleted(true);
    }
  };

  if (serviceLoading) {
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

  if (orderCompleted && orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThankYouPage orderData={orderData} />
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoginForm
            email={loginEmail}
            onBack={() => setShowLogin(false)}
            serviceId={serviceId!}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">{service.name}</p>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={5} />

        {currentStep === 1 && (
          <Step1EmailVerification
            onNext={() => setCurrentStep(2)}
            onShowLogin={handleShowLogin}
            checkoutData={checkoutData}
            updateData={updateCheckoutData}
          />
        )}

        {currentStep === 2 && (
          <Step2GeneralInfo
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
            checkoutData={checkoutData}
            updateData={updateCheckoutData}
          />
        )}

        {currentStep === 3 && (
          <Step3ServiceOptions
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
            service={service}
            checkoutData={checkoutData}
            updateData={updateCheckoutData}
            serviceId={serviceId}
          />
        )}

        {currentStep === 4 && (
          <Step4ServiceFields
            onNext={() => setCurrentStep(5)}
            onPrev={() => setCurrentStep(3)}
            service={service}
            checkoutData={checkoutData}
            updateData={updateCheckoutData}
          />
        )}

        {currentStep === 5 && (
          <Step5Payment
            onPrev={() => setCurrentStep(4)}
            service={service}
            checkoutData={checkoutData}
            onOrderComplete={handleOrderComplete}
          />
        )}
      </div>
    </div>
  );
}