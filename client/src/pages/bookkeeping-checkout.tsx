import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Link, useLocation } from "wouter";

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

interface CheckoutData {
  planId: string;
  businessEntityId: string;
  billingCycle: string;
  planName: string;
  businessName: string;
  amount: number;
}

const BookkeepingCheckoutForm = ({ checkoutData }: { checkoutData: CheckoutData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm subscription on backend
        await apiRequest("POST", "/api/bookkeeping/confirm-subscription", {
          paymentIntentId: paymentIntent.id
        });

        toast({
          title: "Payment Successful",
          description: "You have successfully subscribed to the bookkeeping plan!",
        });

        // Redirect back to bookkeeping dashboard
        setLocation("/bookkeeping");
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            Complete Your Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Order Summary</h4>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium">{checkoutData.planName}</span>
            </div>
            <div className="flex justify-between">
              <span>Business:</span>
              <span className="font-medium">{checkoutData.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span>Billing:</span>
              <span className="font-medium capitalize">{checkoutData.billingCycle}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${(checkoutData.amount / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setLocation("/bookkeeping")}
                disabled={isProcessing}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-[#E54F00]"
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay $${(checkoutData.amount / 100).toFixed(2)}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function BookkeepingCheckout() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    // Get checkout data from sessionStorage
    const storedData = sessionStorage.getItem('bookkeeping-checkout-data');
    if (!storedData) {
      toast({
        title: "Invalid Checkout",
        description: "No checkout data found. Redirecting to plans...",
        variant: "destructive",
      });
      setLocation("/bookkeeping");
      return;
    }

    const data = JSON.parse(storedData);
    setCheckoutData(data);

    // Create payment intent
    console.log("Sending payment intent request with data:", {
      planId: data.planId,
      businessEntityId: data.businessEntityId,
      billingCycle: data.billingCycle,
      types: {
        planId: typeof data.planId,
        businessEntityId: typeof data.businessEntityId,
        billingCycle: typeof data.billingCycle
      }
    });
    
    apiRequest("POST", "/api/bookkeeping/create-payment-intent", {
      planId: data.planId,
      billingCycle: data.billingCycle
    })
      .then((response) => response.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Payment Setup Failed",
          description: error.message || "Failed to setup payment",
          variant: "destructive",
        });
        setLocation("/bookkeeping");
      });
  }, [authLoading, isAuthenticated, setLocation, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clientSecret || !checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bookkeeping Subscription</h1>
          <p className="text-gray-600 mt-2">Secure payment powered by Stripe</p>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <BookkeepingCheckoutForm checkoutData={checkoutData} />
        </Elements>
      </div>
    </div>
  );
}