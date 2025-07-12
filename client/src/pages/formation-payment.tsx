import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Check, CreditCard, Shield, Clock, AlertTriangle } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { stateFilingFees } from "@/stateFilingFees";
import { ParaFortLoader } from "@/components/ParaFortLoader";

// State name mapping for fee lookup
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

// Helper function to get state filing fee using the same logic as formation workflow
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

// Initialize Stripe
let stripePromise: Promise<any | null> | null = null;

async function initializeStripe(): Promise<any | null> {
  try {
    const response = await fetch('/api/stripe/config');
    const config = await response.json();
    
    if (config.requiresConfiguration || config.error) {
      console.error("Stripe configuration error:", config.message);
      return null;
    }
    
    if (config.publishableKey && config.publishableKey.startsWith('pk_')) {
      return await loadStripe(config.publishableKey);
    }
    
    throw new Error("Invalid Stripe configuration");
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    return null;
  }
}

// Initialize Stripe promise
if (!stripePromise) {
  stripePromise = initializeStripe();
}

interface FormationData {
  entityType: string;
  name: string;
  state: string;
  subscriptionPlanId: number;
  contactEmail: string;
  contactPhone: string;
  ownerFirstName: string;
  ownerLastName: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  businessPurpose: string;
  selectedServices: number[];
  selectedDigitalMailboxPlanId?: number;
  selectedDigitalMailboxPlanName?: string;
  registeredAgentType?: string;
  totalAmount: number;
}

// Payment Form Component
const PaymentForm = ({ 
  formationData, 
  clientSecret, 
  onSuccess, 
  onError 
}: { 
  formationData: FormationData;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Debug logging
  console.log('PaymentForm rendered with:', { 
    stripe: !!stripe, 
    elements: !!elements, 
    isProcessing,
    clientSecret: clientSecret ? 'SET' : 'EMPTY'
  });

  // Reset processing state when component mounts
  useEffect(() => {
    if (isProcessing) {
      console.log('Resetting isProcessing to false on mount');
      setIsProcessing(false);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('PaymentForm handleSubmit called', { stripe: !!stripe, elements: !!elements, isProcessing });

    if (!stripe || !elements || isProcessing) {
      console.log('PaymentForm submit blocked:', { stripe: !!stripe, elements: !!elements, isProcessing });
      return;
    }

    console.log('PaymentForm starting payment processing...');
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      console.log('Starting payment elements submission...');
      
      // Submit payment elements first with timeout
      const submitPromise = elements.submit();
      const submitTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Payment submission timeout')), 30000)
      );
      
      const submitResult = await Promise.race([submitPromise, submitTimeoutPromise]) as { error?: any };
      if (submitResult.error) {
        console.error('Submit error:', submitResult.error);
        throw new Error(submitResult.error.message || 'Payment submission failed');
      }

      console.log('Payment elements submitted successfully, confirming payment...');

      // Confirm payment with timeout
      const confirmPromise = stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/formation-success`,
        },
        redirect: 'if_required'
      });
      
      const confirmTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Payment confirmation timeout')), 30000)
      );

      const confirmResult = await Promise.race([confirmPromise, confirmTimeoutPromise]) as { error?: any; paymentIntent?: any };

      if (confirmResult.error) {
        console.error('Confirmation error:', confirmResult.error);
        throw new Error(confirmResult.error.message || 'Payment confirmation failed');
      }

      const paymentIntent = confirmResult.paymentIntent;
      console.log('Payment intent status:', paymentIntent?.status);

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        console.log('Payment requires additional authentication');
        throw new Error('Payment requires additional authentication. Please try again.');
      } else {
        console.log('Payment intent:', paymentIntent);
        throw new Error('Payment was not completed successfully');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Payment failed';
      console.error('Payment error:', errorMsg);
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      console.log('Resetting processing state to false');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border rounded-lg p-4">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        style={{
          width: '100%',
          padding: '16px 24px',
          backgroundColor: isProcessing ? '#9ca3af' : '#34de73',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Complete Payment - ${formationData.totalAmount}
          </>
        )}
      </button>
    </form>
  );
};

export default function FormationPayment() {
  const [location] = useLocation();
  const { toast } = useToast();
  
  const [formationData, setFormationData] = useState<FormationData | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Get formation data from sessionStorage or URL params
  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Try to get formation data from localStorage (where formation workflow saves it)
        const storedData = localStorage.getItem('formation_data');
        if (!storedData) {
          toast({
            title: "Session Expired",
            description: "Your formation session has expired. Please start over.",
            variant: "destructive",
          });
          window.location.href = '/formation-workflow';
          return;
        }

        const data = JSON.parse(storedData) as FormationData;
        setFormationData(data);

        // Create payment intent
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          amount: data.totalAmount,
          serviceId: 'formation',
          orderData: {
            businessName: data.name,
            entityType: data.entityType,
            state: data.state,
            subscriptionPlanId: data.subscriptionPlanId,
            selectedServices: data.selectedServices || [],
            digitalMailboxPlanId: data.selectedDigitalMailboxPlanId,
            registeredAgentType: data.registeredAgentType,
            customerInfo: {
              email: data.contactEmail,
              firstName: data.ownerFirstName,
              lastName: data.ownerLastName,
              phone: data.contactPhone,
              address: data.streetAddress,
              city: data.city,
              zipCode: data.zipCode
            },
            businessPurpose: data.businessPurpose,
            totalAmount: data.totalAmount
          },
          metadata: {
            businessName: data.name,
            entityType: data.entityType,
            state: data.state,
            customerEmail: data.contactEmail,
            customerName: `${data.ownerFirstName} ${data.ownerLastName}`.trim(),
            subscriptionPlanId: data.subscriptionPlanId?.toString()
          }
        });

        const paymentData = await response.json();
        
        if (paymentData.clientSecret) {
          setClientSecret(paymentData.clientSecret);
        } else {
          throw new Error('Failed to create payment intent');
        }
      } catch (error) {
        console.error('Payment initialization error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to initialize payment';
        setPaymentError(errorMsg);
        toast({
          title: "Payment Setup Error",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializePayment();
  }, [toast]);

  // Fetch subscription plans for display
  const { data: subscriptionPlans = [] } = useQuery<any[]>({
    queryKey: ["/api/subscription-plans"],
    retry: false,
  });

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Complete the formation order
      const response = await apiRequest('POST', '/api/complete-formation-order', {
        paymentIntentId,
        businessEntityId: null // Will be created from payment metadata
      });

      const result = await response.json();
      
      if (result.success) {
        // Clear formation data from localStorage
        localStorage.removeItem('formation_data');
        localStorage.removeItem('formation_client_secret');
        
        // Redirect to success page
        window.location.href = '/formation-success';
      } else {
        throw new Error(result.message || 'Failed to complete order');
      }
    } catch (error) {
      console.error('Order completion error:', error);
      toast({
        title: "Order Completion Error",
        description: "Payment succeeded but order completion failed. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  const goBack = () => {
    window.location.href = '/formation-workflow';
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ParaFortLoader />
          <p className="text-gray-600 mt-4">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  if (paymentError || !formationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle size={48} className="mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Setup Failed</h2>
            <p className="text-gray-600 mb-4">
              {paymentError || "Unable to load payment information."}
            </p>
            <button
              onClick={goBack}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Formation
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPlan = subscriptionPlans.find(p => p.id === formationData.subscriptionPlanId);
  
  // Calculate state filing fee using proper lookup function
  const stateFilingFee = formationData.state && formationData.entityType 
    ? getFormationStateFee(formationData.state, formationData.entityType)
    : 0;
    
  // Debug state data
  console.log('Formation data state:', formationData.state);
  console.log('Formation data entityType:', formationData.entityType);
  console.log('Calculated state filing fee:', stateFilingFee);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Formation
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">
            Secure your business formation with our encrypted payment system
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Business Information */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Business Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entity Type:</span>
                    <span className="font-medium">{formationData.entityType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Name:</span>
                    <span className="font-medium">{formationData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium">{formationData.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formationData.contactEmail}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Pricing Breakdown</h3>
                
                <div className="space-y-3">
                  {/* Subscription Plan */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {selectedPlan?.name || 'Selected'} Plan (Annual)
                    </span>
                    <span className="font-medium">
                      ${selectedPlan?.yearlyPrice || '0'}
                    </span>
                  </div>

                  {/* State Filing Fee */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">State Filing Fee ({formationData.state})</span>
                    <span className="font-medium">${Number(stateFilingFee)}</span>
                  </div>

                  {/* Digital Mailbox */}
                  {formationData.selectedDigitalMailboxPlanId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Digital Mailbox ({formationData.selectedDigitalMailboxPlanName})
                      </span>
                      <span className="font-medium">Included</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-600">
                        ${formationData.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Security Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} className="text-green-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-green-600" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-green-600" />
                    <span>Instant processing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
              
              {clientSecret && stripePromise ? (
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#34de73',
                      }
                    }
                  }}
                >
                  <PaymentForm
                    formationData={formationData}
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <ParaFortLoader />
                  <p className="text-gray-500 mt-4">Loading payment form...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}