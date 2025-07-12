import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dynamic Stripe configuration loading
let stripePromise: Promise<any | null> | null = null;

async function initializeStripe(): Promise<any | null> {
  try {
    const response = await fetch('/api/stripe/config');
    const config = await response.json();
    
    if (config.requiresConfiguration || config.error) {
      const errorMessage = config.message || "Stripe configuration required";
      console.error("Stripe configuration error:", errorMessage);
      console.warn("Continuing with limited functionality - payments will not work until Stripe is properly configured");
      return null; // Return null instead of throwing error
    }
    
    if (config.publishableKey && config.publishableKey.startsWith('pk_')) {
      return await loadStripe(config.publishableKey);
    } else {
      throw new Error("Invalid publishable key received from server");
    }
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    throw error;
  }
}

// Initialize Stripe promise
stripePromise = initializeStripe();

// Fallback Payment Interface Component
const FallbackPaymentInterface = ({ service, businessId, plan, businessEntity, getServiceAmount, getServiceDescription }: {
  service: string;
  businessId: string;
  plan: string;
  businessEntity: any;
  getServiceAmount: (service: string, plan: string) => number;
  getServiceDescription: (service: string) => string;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your order has been processed successfully.</p>
              <Button onClick={() => window.location.href = "/dashboard"}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
            <p className="text-gray-600 mt-2">Demo checkout flow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p className="text-sm text-gray-600">{getServiceDescription(service)}</p>
                    <p className="text-sm text-gray-500 mt-1">Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
                  </div>
                  <span className="font-semibold">${getServiceAmount(service, plan)}.00</span>
                </div>

                {businessEntity && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Business Entity</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Name:</strong> {businessEntity.name}</p>
                      <p><strong>Type:</strong> {businessEntity.entityType}</p>
                      <p><strong>State:</strong> {businessEntity.state}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>${getServiceAmount(service, plan)}.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      <strong>Demo Mode:</strong> This is a demonstration payment form. No actual charges will be made.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value="4242 4242 4242 4242"
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value="12/25"
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value="123"
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        defaultValue="John Doe"
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Processing Payment...
                      </div>
                    ) : (
                      `Complete Payment - $${getServiceAmount(service, plan)}.00`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = ({ service, businessId, plan }: { service: string; businessId: string; plan: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Check if payment element is ready
  useEffect(() => {
    console.log("Payment ready state check:", { stripe: !!stripe, elements: !!elements, isReady });
    if (stripe && elements) {
      // Set ready state when all Stripe components are loaded
      setIsReady(true);
      console.log("✓ Payment button ready - Stripe Elements initialized successfully");
    }
  }, [stripe, elements, isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?service=${service}&businessId=${businessId}&plan=${plan}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || !elements || !isReady || isProcessing}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
      >
        {isProcessing ? "Processing..." : isReady ? "Complete Payment" : "Loading..."}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [stripe, setStripe] = useState(null);
  const [stripeError, setStripeError] = useState("");

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get("service") || "";
  const businessId = urlParams.get("businessId") || "";
  const plan = urlParams.get("plan") || "standard";
  
  // For tax services, allow unauthenticated checkout
  const isTaxService = service.toLowerCase().includes('tax') || service.toLowerCase().includes('filing');

  // Fetch business entity details
  const { data: businessEntities } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: !!businessId && isAuthenticated,
  });

  // Find the specific business entity by ID
  const businessEntity = Array.isArray(businessEntities) 
    ? businessEntities.find((entity: any) => entity.id.toString() === businessId)
    : undefined;
  
  // Debug logging
  useEffect(() => {
    if (businessEntities) {
      console.log("Business entities:", businessEntities);
      console.log("Looking for business ID:", businessId);
      console.log("Found business entity:", businessEntity);
    }
  }, [businessEntities, businessId, businessEntity]);

  // Only redirect to login for non-tax services
  useEffect(() => {
    console.log("Auth state:", { isLoading, isAuthenticated, user });
    if (!isLoading && !isAuthenticated && !isTaxService) {
      toast({
        title: "Authentication Required", 
        description: "Please log in to complete your purchase.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, [isLoading, isAuthenticated, user, toast, isTaxService]);

  // Create payment intent (allow for tax services without authentication)
  useEffect(() => {
    if ((isAuthenticated || isTaxService) && service) {
      const createPaymentIntent = async () => {
        try {
          const amount = urlParams.get("amount") || getServiceAmount(service, plan);
          const response = await apiRequest("POST", "/api/create-payment-intent", {
            service,
            businessId: businessId || "tax-service",
            plan,
            amount: parseFloat(amount)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}`);
          }
          
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Payment intent creation failed:", error);
          toast({
            title: "Payment Setup Failed",
            description: error instanceof Error ? error.message : "Unable to initialize payment. Please try again.",
            variant: "destructive",
          });
        }
      };

      createPaymentIntent();
    } else {
      console.log("Payment intent not created:", { isAuthenticated, service, businessId: businessId || 'none', isTaxService });
    }
  }, [isAuthenticated, service, businessId, plan, toast, isTaxService]);

  // Resolve Stripe instance
  useEffect(() => {
    const loadStripeInstance = async () => {
      try {
        const stripeInstance = await stripePromise;
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setStripeError("Stripe configuration error: Unable to initialize payment system");
        }
      } catch (error) {
        console.error("Stripe initialization failed:", error);
        setStripeError(error instanceof Error ? error.message : "Stripe configuration error");
      }
    };
    loadStripeInstance();
  }, []);

  const getServiceAmount = (service: string, plan: string) => {
    if (service === "registered-agent") {
      switch (plan) {
        case "standard":
          return 99;
        case "premium":
          return 149;
        case "enterprise":
          return 249;
        default:
          return 99;
      }
    }
    return 99;
  };

  const getServiceDescription = (service: string) => {
    switch (service) {
      case "registered-agent":
        return "Professional registered agent service for your business entity";
      case "tax-filing":
        return "Professional tax preparation and filing service";
      default:
        return "Business service";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated && !isTaxService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show fallback payment interface when Stripe is not configured
  if (stripeError) {
    return <FallbackPaymentInterface 
      service={service} 
      businessId={businessId} 
      plan={plan} 
      businessEntity={businessEntity}
      getServiceAmount={getServiceAmount}
      getServiceDescription={getServiceDescription}
    />;
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessEntity && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Business Entity</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{businessEntity.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{businessEntity.entityType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium">{businessEntity.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business ID:</span>
                        <span className="font-mono text-xs">{businessEntity.id}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Service:</span>
                  <span className="capitalize">{service === "tax-filing" ? "Tax Filing" : service.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Plan:</span>
                  <span className="capitalize">{plan.replace(/-/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Description:</span>
                  <span className="text-sm text-gray-600">{getServiceDescription(service)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-500">${getServiceAmount(service, plan)}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What's Included:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {service === "tax-filing" ? (
                      <>
                        <li>• Professional tax preparation and review</li>
                        <li>• Federal and state tax filing</li>
                        <li>• Business expense optimization</li>
                        <li>• Tax consultation included</li>
                        <li>• 100% accuracy guarantee</li>
                      </>
                    ) : (
                      <>
                        <li>• Professional registered agent service</li>
                        <li>• Document forwarding and scanning</li>
                        <li>• Legal document receipt</li>
                        <li>• Privacy protection for your address</li>
                        <li>• Annual compliance support</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientSecret && stripe ? (
                  <Elements 
                    stripe={stripe} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'stripe'
                      }
                    }}
                  >
                    <CheckoutForm service={service} businessId={businessId} plan={plan} />
                  </Elements>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-gray-600">Setting up payment form...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}