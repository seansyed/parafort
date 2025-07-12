import { useState, useEffect, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';
import SimpleStripeCheckout from '../components/SimpleStripeCheckout';

// Stable Stripe initialization - only create once
let stripePromise: Promise<any | null> | null = null;

const getStripePromise = async (): Promise<any | null> => {
  if (!stripePromise) {
    stripePromise = (async () => {
      try {
        console.log('Fetching Stripe configuration from server...');
        const response = await fetch('/api/stripe/config');
        const config = await response.json();
        
        if (config.error) {
          console.error("Stripe configuration error:", config.error);
          return null;
        }
        
        if (config.publishableKey && config.publishableKey.startsWith('pk_')) {
          console.log(`Loading Stripe with ${config.environment} key:`, config.publishableKey.substring(0, 20) + "...");
          return await loadStripe(config.publishableKey);
        } else {
          console.error("Invalid publishable key received from server");
          return null;
        }
      } catch (error) {
        console.error("Failed to initialize Stripe:", error);
        return null;
      }
    })();
  }
  return stripePromise;
};

// Stable Elements wrapper component to prevent prop mutations
interface StableStripeElementsWrapperProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function StableStripeElementsWrapper({ clientSecret, onSuccess, onError }: StableStripeElementsWrapperProps) {
  const [stripeInstance, setStripeInstance] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Stripe instance once and store it
  useEffect(() => {
    let isMounted = true;

    const initStripe = async () => {
      try {
        const stripe = await getStripePromise();
        if (isMounted && stripe) {
          setStripeInstance(stripe);
          setIsReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        if (isMounted) {
          onError('Failed to load payment system');
        }
      }
    };

    initStripe();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once

  // Wrap SimpleStripeCheckout with Elements provider
  if (!stripeInstance || !isReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripeInstance} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#10b981',
          }
        }
      }}
    >
      <SimpleStripeCheckout
        clientSecret={clientSecret}
        totalAmount={395}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}

// Main Payment Page Component
export default function FormationPaymentDedicated() {
  const [, setLocation] = useLocation();
  const [formationData, setFormationData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Load formation data from localStorage
        const savedData = localStorage.getItem('parafort_formation_data');
        console.log('Raw formation data from localStorage:', savedData);
        
        if (!savedData) {
          console.error('No formation data found in localStorage');
          setError('No formation data found. Please start over.');
          setIsLoading(false);
          return;
        }

        const data = JSON.parse(savedData);
        console.log('Loaded formation data for payment:', data);
        console.log('Data keys:', Object.keys(data));
        console.log('Data.name:', data.name);
        console.log('Data.businessName:', data.businessName);
        console.log('Data.state:', data.state);
        console.log('Data.entityType:', data.entityType);
        console.log('Data.totalAmount:', data.totalAmount);
        
        // Verify that state selection is preserved
        if (data.state) {
          console.log('State selection preserved in payment page:', data.state);
        }

        setFormationData(data);

        // Create payment intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderData: {
              businessName: data.name || data.businessName || data.companyName || 'Business Formation',
              totalAmount: data.totalAmount || 325,
              entityType: data.entityType || 'Corporation',
              state: data.state || 'AK',
              subscriptionPlanId: String(data.subscriptionPlanId || ''),
              contactEmail: data.contactEmail || '',
              source: 'formation_workflow'
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`Payment intent creation failed: ${response.status}`);
        }

        const { clientSecret } = await response.json();
        console.log('Payment intent created:', { clientSecret });
        
        if (!clientSecret) {
          throw new Error('No client secret received');
        }

        // Validate client secret format as recommended by ChatGPT
        if (!clientSecret.startsWith('pi_') || !clientSecret.includes('_secret_')) {
          console.error('Invalid client secret format:', clientSecret);
          throw new Error('Invalid payment intent format');
        }

        console.log('Client secret validated - correct format detected');
        
        // Store client secret globally for CardElement access
        (window as any).stripeClientSecret = clientSecret;
        console.log('Client secret stored globally:', clientSecret);
        
        setClientSecret(clientSecret);
        setIsLoading(false);
        setHasInitialized(true);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize payment');
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    initializePayment();
  }, []);

  const handlePaymentSuccess = async () => {
    console.log('=== PAYMENT SUCCESS HANDLER CALLED ===');
    
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully. Completing formation...",
    });
    
    try {
      // Call the backend to complete the formation order
      console.log('Calling complete-formation-order API...');
      const response = await fetch('/api/complete-formation-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: (window as any).stripeClientSecret?.split('_secret_')[0], // Extract payment intent ID from client secret
          businessEntityId: null // Will be created from payment metadata
        }),
      });
      
      console.log('Order completion response status:', response.status);
      const result = await response.json();
      console.log('Order completion result:', result);

      if (result.success) {
        // Clear formation data from localStorage
        localStorage.removeItem('parafort_formation_data');
        
        // Redirect to success page using window.location.href for more reliable navigation
        console.log('Redirecting to formation success page...');
        window.location.href = '/formation-success';
      } else {
        throw new Error(result.message || 'Failed to complete order');
      }
    } catch (error) {
      console.error('=== ORDER COMPLETION ERROR ===', error);
      toast({
        title: "Order Processing Error",
        description: "Payment successful, but there was an issue completing your order. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('=== PAYMENT ERROR HANDLER CALLED ===', errorMessage);
    
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    setError(errorMessage);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-600">Initializing secure payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - only show after initialization attempt
  if (error && hasInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Setup Failed</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => setLocation('/formation-workflow')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Return to Formation
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Secure your business formation with our encrypted payment system</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Name:</span>
                      <span className="font-medium">{formationData?.name || formationData?.businessName || formationData?.companyName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entity Type:</span>
                      <span className="font-medium">{formationData?.entityType || 'Corporation'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">{formationData?.state || 'Idaho'}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">${formationData?.totalAmount || '325.00'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Payment Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>PCI DSS compliant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Protected by Stripe</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter your payment details to complete your business formation order
                  </CardDescription>
                </CardHeader>
                <CardContent>
{clientSecret && hasInitialized ? (
                    <StableStripeElementsWrapper 
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  ) : (
                    <div className="loading p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading secure payment form...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}