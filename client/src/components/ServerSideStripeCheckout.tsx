import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface ServerSideStripeCheckoutProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function ServerSideStripeCheckout({ 
  clientSecret, 
  onSuccess, 
  onError 
}: ServerSideStripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [elementsLoaded, setElementsLoaded] = useState(false);

  useEffect(() => {
    console.log('Elements setup starting with clientSecret:', !!clientSecret);
    
    if (elements && stripe && clientSecret) {
      console.log('All prerequisites available - setting up PaymentElement');
      
      // Force PaymentElement to be ready after short delay
      const quickTimeout = setTimeout(() => {
        console.log('Force setting elements loaded to true');
        setElementsLoaded(true);
      }, 2000);

      return () => {
        clearTimeout(quickTimeout);
      };
    }
  }, [elements, stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting payment confirmation");
      
      // Use Stripe's confirmPayment method for live payments
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/formation-success`,
          payment_method_data: {
            billing_details: {
              email: undefined, // Let customer enter their real email
              name: undefined,  // Let customer enter their real name
            }
          }
        },
        redirect: 'if_required'
      });
      
      if (error) {
        throw new Error(error.message || "Payment confirmation failed");
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log("Payment confirmation successful");
        setPaymentMessage("Payment successful! Processing your order...");
        setPaymentSucceeded(true);
        
        localStorage.setItem('paymentSuccess', JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          timestamp: Date.now()
        }));
        
        // Small delay to show success message before redirecting
        setTimeout(() => {
          console.log("PAYMENT SUCCESSFUL - REDIRECTING TO SUCCESS PAGE");
          window.location.href = `/formation-success?payment_intent=${paymentIntent.id}`;
        }, 1500);
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        setPaymentMessage("Please complete additional authentication steps...");
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        setPaymentMessage("Your payment is being processed...");
      } else {
        throw new Error("Payment was not completed successfully");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentMessage("Payment failed. Please try again.");
      onError(error.message || "Payment processing failed. Please try again.");
    } finally {
      if (!paymentSucceeded) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Payment Mode Banner */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-green-800">Secure Live Payment Processing</span>
        </div>
        <p className="text-sm text-green-700">
          Your payment will be processed securely through Stripe. Enter your real payment information to complete your order.
        </p>
      </div>

      {/* Payment Status Message */}
      {paymentMessage && (
        <div className={`p-4 rounded-lg ${paymentSucceeded ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          <div className="flex items-center">
            {paymentSucceeded ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{paymentMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border">
        {!elementsLoaded && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading payment form...</span>
          </div>
        )}
        <div style={{ minHeight: '300px', width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }} id="payment-element-container">
          {clientSecret ? (
            <PaymentElement 
              id="payment-element"
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: 'auto'
                }
              }}
            />
          ) : (
            <div className="text-center text-gray-500">
              Preparing payment form...
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={!stripe || !elements || isLoading}
        style={{
          backgroundColor: isLoading ? '#9ca3af' : '#34de73',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          width: '100%',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#22c55e';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#34de73';
          }
        }}
      >
        {isLoading ? 'Processing Payment...' : 'Complete Payment'}
      </button>
    </div>
  );
}