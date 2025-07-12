import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface StripeCheckoutFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  totalAmount: number;
  isProcessing?: boolean;
}

export function StripeCheckoutForm({ 
  onSuccess, 
  onError, 
  totalAmount, 
  isProcessing = false 
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [initialPaymentIntentClientSecret, setInitialPaymentIntentClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle cases where a redirect brings the user back with payment_intent_client_secret in URL
  useEffect(() => {
    if (!stripe || !elements) return;

    const urlParams = new URLSearchParams(window.location.search);
    const clientSecretFromUrl = urlParams.get('payment_intent_client_secret');

    if (clientSecretFromUrl && clientSecretFromUrl !== initialPaymentIntentClientSecret) {
      setInitialPaymentIntentClientSecret(clientSecretFromUrl);
      setIsLoading(true);

      stripe.retrievePaymentIntent(clientSecretFromUrl).then(({ paymentIntent }) => {
        if (paymentIntent) {
          switch (paymentIntent.status) {
            case 'succeeded':
              console.log("Payment succeeded after redirect:", paymentIntent.id);
              toast({
                title: "Payment Successful",
                description: "Your business formation payment has been processed.",
              });
              onSuccess(paymentIntent.id);
              break;
            case 'processing':
              console.log("Payment is processing after redirect:", paymentIntent.id);
              toast({
                title: "Payment Processing",
                description: "Your payment is processing. We will notify you once it's complete.",
              });
              onSuccess(paymentIntent.id);
              break;
            case 'requires_payment_method':
              console.log("Payment requires payment method after redirect:", paymentIntent.id);
              onError("Payment failed: Please try another payment method.");
              toast({
                title: "Payment Failed",
                description: "Payment failed. Please try another payment method.",
                variant: "destructive",
              });
              break;
            default:
              console.log("Unhandled payment status after redirect:", paymentIntent.status);
              onError(`Payment status: ${paymentIntent.status}. Please contact support.`);
              toast({
                title: "Payment Issue",
                description: `Payment status: ${paymentIntent.status}. Please contact support.`,
                variant: "destructive",
              });
              break;
          }
        } else {
          onError("Could not retrieve payment intent after redirect.");
          toast({
            title: "Payment Error",
            description: "Could not retrieve payment intent after redirect.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }).catch(err => {
        console.error("Error retrieving payment intent after redirect:", err);
        onError(err.message || "Error retrieving payment details.");
        setIsLoading(false);
      });
    }
  }, [stripe, elements, onSuccess, onError, toast, initialPaymentIntentClientSecret]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("handleSubmit called - starting payment process");

    if (!stripe || !elements) {
      console.error("Stripe or elements not ready");
      onError("Payment system not ready. Please try again.");
      return;
    }

    setIsLoading(true);
    console.log("Starting payment confirmation...");

    try {
      console.log("Checking elements and stripe readiness...");
      
      // Validate Stripe configuration before proceeding
      try {
        console.log("Testing Stripe configuration...");
        const configResponse = await fetch('/api/stripe/config');
        const configData = await configResponse.json();
        console.log("Stripe config response:", configData);
        
        if (!configData.configured || !configData.publishableKey) {
          throw new Error("Stripe not properly configured");
        }
        
        if (configData.publishableKey.startsWith('sk_')) {
          throw new Error("Invalid key type - secret key detected instead of publishable key");
        }
      } catch (configError) {
        console.error("Stripe configuration error:", configError);
        onError("Payment system configuration error. Please contact support at (844) 444-5411.");
        setIsLoading(false);
        return;
      }
      
      console.log("Stripe instance available:", !!stripe);
      console.log("Elements instance available:", !!elements);
      
      if (!stripe || !elements) {
        console.error("Stripe or elements not available");
        onError("Payment system not properly initialized. Please refresh and try again.");
        setIsLoading(false);
        return;
      }

      console.log("Attempting payment confirmation...");
      console.log("Using return URL:", window.location.origin + "/formation-success");

      // Try alternative payment confirmation approach
      console.log("Attempting payment confirmation with enhanced error handling...");
      
      let confirmError, confirmedPaymentIntent;
      
      try {
        console.log("Skipping elements.submit() - proceeding directly to payment confirmation...");
        
        // Add timeout wrapper to detect hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Payment confirmation timeout after 30 seconds")), 30000)
        );
        
        const paymentPromise = stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin + "/formation-success",
          },
          redirect: "if_required",
        });
        
        console.log("Payment confirmation started, waiting for response...");
        
        // Race between payment and timeout
        const result = await Promise.race([paymentPromise, timeoutPromise]);
        
        console.log("Raw Stripe confirmPayment result:", result);
        
        if (result && typeof result === 'object' && 'error' in result) {
          confirmError = result.error;
          confirmedPaymentIntent = result.paymentIntent;
        } else {
          // Handle timeout case
          throw result;
        }
        
      } catch (stripeError) {
        console.error("Stripe confirmPayment exception:", stripeError);
        
        // Handle different types of Stripe errors
        if (!stripeError || Object.keys(stripeError).length === 0) {
          console.error("Empty Stripe error object - configuration issue detected");
          onError("Payment system configuration error. Please contact support at (844) 444-5411.");
          setIsLoading(false);
          return;
        }
        
        const errorMessage = stripeError.message || stripeError.type || "Unknown payment error";
        console.error("Stripe error details:", errorMessage);
        onError(`Payment failed: ${errorMessage}`);
        setIsLoading(false);
        return;
      }

      if (confirmError) {
        console.error("Stripe confirmPayment error:", confirmError);
        
        // Log comprehensive error details for debugging
        console.error("Error type:", confirmError.type);
        console.error("Error code:", confirmError.code);
        console.error("Error decline code:", confirmError.decline_code);
        console.error("Error message:", confirmError.message);
        console.error("Full error object:", JSON.stringify(confirmError, null, 2));
        
        // Handle specific error types with user-friendly messages
        let errorMessage = "Payment failed. Please try again.";
        
        if (confirmError.type === "card_error") {
          switch (confirmError.code) {
            case "card_declined":
              errorMessage = "Your card was declined. Please try a different card or contact your bank.";
              break;
            case "insufficient_funds":
              errorMessage = "Payment failed due to insufficient funds. Please try a different card.";
              break;
            case "invalid_cvc":
              errorMessage = "Invalid security code. Please check your CVC and try again.";
              break;
            case "expired_card":
              errorMessage = "Your card has expired. Please use a different card.";
              break;
            case "incorrect_number":
              errorMessage = "Invalid card number. Please check and try again.";
              break;
            default:
              errorMessage = confirmError.message || "Card payment failed. Please check your details and try again.";
          }
        } else if (confirmError.type === "validation_error") {
          errorMessage = "Please complete all required payment fields.";
        } else if (confirmError.type === "api_error") {
          errorMessage = "Payment system temporarily unavailable. Please try again in a moment.";
        } else if (!confirmError.message || confirmError.message.trim() === "" || Object.keys(confirmError).length === 0) {
          console.error("CRITICAL: Empty/minimal error object - likely Stripe configuration issue");
          errorMessage = "Payment system configuration error. Please contact support at (844) 444-5411.";
        } else {
          errorMessage = confirmError.message;
        }
        
        onError(errorMessage);
        toast({
          title: "Payment Failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (confirmedPaymentIntent) {
        console.log("Payment intent confirmed with status:", confirmedPaymentIntent.status);
        switch (confirmedPaymentIntent.status) {
          case 'succeeded':
            console.log("Payment succeeded directly:", confirmedPaymentIntent.id);
            toast({
              title: "Payment Successful",
              description: "Your business formation payment has been processed.",
            });
            onSuccess(confirmedPaymentIntent.id);
            break;
          case 'processing':
            console.log("Payment is processing directly:", confirmedPaymentIntent.id);
            toast({
              title: "Payment Processing",
              description: "Your payment is processing. We will notify you once it's complete.",
            });
            onSuccess(confirmedPaymentIntent.id);
            break;
          case 'requires_action':
            console.log("Payment requires action directly:", confirmedPaymentIntent.id);
            const { error: handleActionError, paymentIntent: nextActionPaymentIntent } = await stripe.handleNextAction({
              clientSecret: confirmedPaymentIntent.client_secret!,
            });
            if (handleActionError) {
              console.error("Handle next action error:", handleActionError);
              onError(handleActionError.message || "Payment authentication failed.");
              toast({
                title: "Authentication Failed",
                description: handleActionError.message,
                variant: "destructive",
              });
            } else if (nextActionPaymentIntent?.status === 'succeeded') {
              console.log("Payment succeeded after manual next action:", nextActionPaymentIntent.id);
              onSuccess(nextActionPaymentIntent.id);
            } else {
              console.error("Payment requires action, unclear status:", nextActionPaymentIntent?.status);
              onError(`Payment requires action, status: ${nextActionPaymentIntent?.status}`);
              toast({
                title: "Payment Issue",
                description: "Payment requires action, but completion is unclear.",
                variant: "destructive",
              });
            }
            break;
          case 'requires_payment_method':
          default:
            console.error("Payment failed or unhandled status directly:", confirmedPaymentIntent.status);
            onError(`Payment failed with status: ${confirmedPaymentIntent.status}. Please try again.`);
            toast({
              title: "Payment Failed",
              description: `Payment status: ${confirmedPaymentIntent.status}. Please try again.`,
              variant: "destructive",
            });
            break;
        }
      } else {
        console.warn("Stripe confirmPayment returned no error and no paymentIntent. A redirect might be imminent or occurred.");
        onError("Payment initiated, but status unclear. Please check your bank statement or contact support.");
        toast({
          title: "Payment Initiated",
          description: "Payment initiated, but status unclear. Please check your bank statement or contact support.",
          variant: "warning",
        });
      }

    } catch (err: any) {
      console.error("Critical payment processing error:", err);
      onError(err.message || "An unexpected error occurred during payment processing.");
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      console.log("Payment process completed, setting loading to false");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-green-500" />
          Payment Information
        </h3>
        
        <PaymentElement 
          options={{
            layout: "tabs"
          }}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Lock className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-800 font-medium mb-1">
              Secure Payment Processing
            </p>
            <p className="text-sm text-green-700">
              Your payment information is encrypted and processed securely through Stripe. 
              We never store your credit card details.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || !elements || isLoading || isProcessing}
        style={{
          width: '100%',
          backgroundColor: !stripe || !elements || isLoading || isProcessing ? '#9ca3af' : '#34de73',
          color: 'white',
          padding: '12px 24px',
          fontSize: '18px',
          fontWeight: '600',
          border: 'none',
          borderRadius: '8px',
          cursor: !stripe || !elements || isLoading || isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!(!stripe || !elements || isLoading || isProcessing)) {
            e.currentTarget.style.backgroundColor = '#10b981';
          }
        }}
        onMouseLeave={(e) => {
          if (!(!stripe || !elements || isLoading || isProcessing)) {
            e.currentTarget.style.backgroundColor = '#34de73';
          }
        }}
      >
        {isLoading || isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Lock className="w-5 h-5 mr-2" />
            Complete Payment - ${totalAmount.toFixed(2)}
          </div>
        )}
      </button>
    </div>
  );
}