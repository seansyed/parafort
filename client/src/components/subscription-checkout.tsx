import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

interface CheckoutFormProps {
  businessId: number;
  planId: number;
  planName: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ businessId, planId, planName, amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent.status === "succeeded") {
        // Confirm the subscription upgrade on the backend
        await apiRequest("POST", `/api/business-entities/${businessId}/confirm-upgrade`, {
          paymentIntentId: paymentIntent.id,
          planId: planId,
        });

        toast({
          title: "Subscription Upgraded",
          description: `Successfully upgraded to ${planName} plan`,
        });
        
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{planName} Plan</h3>
        <p className="text-2xl font-bold text-green-500">${amount}/year</p>
      </div>
      
      <PaymentElement />
      
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-green-500 hover:bg-[#E64E00]"
        >
          {isProcessing ? "Processing..." : `Pay $${amount}`}
        </Button>
      </div>
    </form>
  );
}

interface SubscriptionCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: number;
  planId: number;
  planName: string;
  clientSecret?: string;
  amount?: number;
  onSuccess: () => void;
}

export function SubscriptionCheckout({
  isOpen,
  onClose,
  businessId,
  planId,
  planName,
  clientSecret,
  amount = 0,
  onSuccess,
}: SubscriptionCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clientSecret) {
      setIsLoading(false);
    }
  }, [clientSecret]);

  // Check if Stripe is properly configured
  if (!stripePromise) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Configuration Required</DialogTitle>
            <DialogDescription>
              Payment processing is currently being configured. Please contact support to complete your subscription upgrade.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!clientSecret) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Processing...</DialogTitle>
            <DialogDescription>
              Preparing your subscription upgrade...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#27884b',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade Subscription</DialogTitle>
          <DialogDescription>
            Complete your payment to upgrade to the {planName} plan
          </DialogDescription>
        </DialogHeader>
        
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance,
          }}
        >
          <CheckoutForm
            businessId={businessId}
            planId={planId}
            planName={planName}
            amount={amount}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            onCancel={onClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}