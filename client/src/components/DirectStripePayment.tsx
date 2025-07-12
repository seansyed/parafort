import React, { useState } from 'react';

interface DirectStripePaymentProps {
  totalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function DirectStripePayment({ totalAmount, onSuccess, onError }: DirectStripePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholder, setCardholder] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!cardholder.trim() || !cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
        throw new Error('Please fill in all payment fields');
      }

      if (cardNumber.replace(/\s/g, '').length < 13) {
        throw new Error('Please enter a valid card number');
      }

      if (expiry.length !== 5 || !expiry.includes('/')) {
        throw new Error('Please enter a valid expiry date (MM/YY)');
      }

      if (cvc.length < 3) {
        throw new Error('Please enter a valid CVC');
      }

      console.log('=== PAYMENT SUBMISSION STARTED ===');
      
      // Get the client secret
      const clientSecret = (window as any).stripeClientSecret;
      console.log('Client secret status:', clientSecret ? 'Present' : 'Missing');
      console.log('Client secret value:', clientSecret);
      
      if (!clientSecret) {
        throw new Error('Payment intent not found. Please refresh the page.');
      }

      console.log('Fetching Stripe configuration...');
      const response = await fetch('/api/stripe/config');
      const config = await response.json();
      console.log('Stripe config received:', config);
      
      // Load Stripe only if not already loaded
      if (!(window as any).Stripe) {
        console.log('Loading Stripe.js script...');
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
        console.log('Stripe.js loaded successfully');
      } else {
        console.log('Stripe.js already loaded');
      }

      console.log('Initializing Stripe instance...');
      const stripe = (window as any).Stripe(config.publishableKey);
      console.log('Stripe instance created:', !!stripe);

      console.log('Creating payment method...');
      console.log('Card data:', {
        number: cardNumber.replace(/\s/g, '').substring(0, 4) + '****',
        exp_month: parseInt(expiry.split('/')[0]),
        exp_year: parseInt('20' + expiry.split('/')[1]),
        cvc: '***',
        cardholder: cardholder
      });

      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(expiry.split('/')[0]),
          exp_year: parseInt('20' + expiry.split('/')[1]),
          cvc: cvc,
        },
        billing_details: {
          name: cardholder,
        },
      });

      console.log('Payment method creation result:', {
        error: paymentMethodError,
        paymentMethod: paymentMethod ? { id: paymentMethod.id, type: paymentMethod.type } : null
      });

      if (paymentMethodError) {
        console.error('Payment method error:', paymentMethodError);
        throw new Error(paymentMethodError.message);
      }

      console.log('Confirming payment with client secret:', clientSecret);
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      console.log('Payment confirmation result:', {
        error: confirmError,
        paymentIntent: paymentIntent ? { id: paymentIntent.id, status: paymentIntent.status } : null
      });

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        throw new Error(confirmError.message);
      }

      console.log('Payment intent status:', paymentIntent.status);
      
      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded! Calling onSuccess...');
        onSuccess();
      } else {
        console.error('Payment not successful, status:', paymentIntent.status);
        throw new Error(`Payment status: ${paymentIntent.status}. Please try again.`);
      }

    } catch (error: any) {
      console.error('=== PAYMENT ERROR ===', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      onError(error.message || 'Payment failed');
    } finally {
      console.log('=== PAYMENT SUBMISSION COMPLETE ===');
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
      <p className="text-sm text-gray-600 mb-6">Enter your payment details to complete your business formation order</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardholder}
            onChange={(e) => setCardholder(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: '#34de73',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              width: '100%',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Processing Payment...' : `Pay $${totalAmount}`}
          </button>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}