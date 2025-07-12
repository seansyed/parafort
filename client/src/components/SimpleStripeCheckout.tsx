import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface SimpleStripeCheckoutProps {
  clientSecret: string;
  totalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function SimpleStripeCheckout({ clientSecret, totalAmount, onSuccess, onError }: SimpleStripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Payment system not ready. Please try again.');
      return;
    }

    if (!clientSecret) {
      onError('Payment session expired. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Submit the payment element to validate
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message || 'Please check your payment details.');
        setIsProcessing(false);
        return;
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Call the order completion API
        try {
          const response = await fetch('/api/complete-formation-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id
            }),
          });

          if (!response.ok) {
            console.error('Order completion failed, but payment succeeded');
          }
        } catch (orderError) {
          console.error('Order completion API error:', orderError);
        }

        // Redirect to success page
        window.location.href = '/formation-success';
        onSuccess();
      } else {
        onError('Payment was not completed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      onError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="p-4 border rounded-lg">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isProcessing || !stripe || !elements
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${totalAmount}`}
      </button>
    </form>
  );
}