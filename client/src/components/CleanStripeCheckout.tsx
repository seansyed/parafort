import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface CleanStripeCheckoutProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function CleanStripeCheckout({ onSuccess, onError }: CleanStripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const cardElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get publishable key from server
        const configResponse = await fetch('/api/stripe/config');
        const config = await configResponse.json();
        
        console.log('Stripe config received:', config);
        
        if (config.error) {
          throw new Error(config.error);
        }
        
        if (!config.publishableKey) {
          throw new Error('No publishable key received');
        }
        
        const stripeInstance = await loadStripe(config.publishableKey);
        console.log('Stripe instance loaded:', !!stripeInstance);
        setStripe(stripeInstance);

        if (stripeInstance) {
          const clientSecret = (window as any).stripeClientSecret;
          if (clientSecret) {
            const elementsInstance = stripeInstance.elements({
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#34de73',
                  colorBackground: '#ffffff',
                  colorText: '#1f2937',
                  colorDanger: '#ef4444',
                  fontFamily: 'system-ui, sans-serif',
                }
              }
            });
            setElements(elementsInstance);

            const cardElementInstance = elementsInstance.create('card', {
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            });

            // Wait and retry mounting with better error handling
            const mountCard = () => {
              if (cardElementRef.current) {
                console.log('Mounting card element to DOM');
                try {
                  cardElementInstance.mount(cardElementRef.current);
                  setCardElement(cardElementInstance);
                  setIsReady(true);
                  console.log('Card element mounted successfully');
                } catch (mountError) {
                  console.error('Card mounting error:', mountError);
                  onError('Payment form initialization failed');
                }
              } else {
                console.log('Card element ref not available, retrying...');
                // Retry after a short delay
                setTimeout(mountCard, 100);
              }
            };

            // Start mounting process
            setTimeout(mountCard, 100);
          }
        }
      } catch (error) {
        console.error('Stripe initialization error:', error);
        onError('Failed to initialize payment system');
      }
    };

    // Only initialize if we haven't already
    if (!stripe) {
      initializeStripe();
    }
  }, [onError, stripe]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements || !cardElement) {
      onError('Payment system not ready');
      setIsProcessing(false);
      return;
    }

    try {
      const clientSecret = (window as any).stripeClientSecret;
      
      if (!clientSecret) {
        onError('Payment session expired. Please refresh and try again.');
        setIsProcessing(false);
        return;
      }

      // Confirm payment with Stripe Elements
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Business Formation Customer',
            email: 'seansyed@outlook.com',
          },
        }
      });

      if (error) {
        onError(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        window.location.href = '/formation-success';
        onSuccess();
      } else {
        onError('Payment processing failed');
        setIsProcessing(false);
      }
    } catch (err: any) {
      onError('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isReady) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-center">Loading payment form...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
      <p className="text-sm text-gray-600 mb-6">Enter your payment details to complete your business formation order</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Element Container */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div 
            ref={cardElementRef}
            className="p-3 border border-gray-300 rounded-lg bg-white"
            style={{ minHeight: '40px' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          style={{
            backgroundColor: isProcessing || !stripe ? '#9ca3af' : '#34de73',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            width: '100%',
            cursor: isProcessing || !stripe ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '24px'
          }}
        >
          {isProcessing ? 'Processing Payment...' : 'Complete Payment - $395.00'}
        </button>
      </form>
    </div>
  );
}