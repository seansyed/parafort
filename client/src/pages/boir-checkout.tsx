import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';

export default function BoirCheckout() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: boirService, isLoading: serviceLoading } = useQuery({
    queryKey: ['/api/services/all'],
    enabled: isAuthenticated,
  });

  const service = Array.isArray(boirService) ? boirService.find((s: any) => s.name === 'BOIR Filing') : null;

  const handleProceedToPayment = () => {
    if (!service) return;
    
    // Navigate to service purchase page with service ID
    setLocation(`/service-purchase/${service.id}`);
  };

  const handleBackToService = () => {
    setLocation('/boir-filing');
  };

  if (isLoading || serviceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Not Found</h2>
            <p className="text-gray-600 mb-4">The BOIR Filing service could not be found.</p>
            <button
              onClick={handleBackToService}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Back to Services
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <button
              onClick={handleBackToService}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Service
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      BOIR filing reports company owners and control parties to FinCEN for CTA compliance. 
                      Processes in 7 to 10 business days.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Service Fee:</span>
                        <span>${service.oneTimePrice}</span>
                      </div>
                      {service.expeditedPrice && parseFloat(service.expeditedPrice) > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Expedited Option Available:</span>
                          <span>+${service.expeditedPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">${service.oneTimePrice}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What's Included:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Complete BOIR filing preparation</li>
                    <li>• FinCEN submission</li>
                    <li>• Compliance verification</li>
                    <li>• Filing confirmation</li>
                    <li>• Customer support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white">
                        <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-yellow-800">Important Deadline Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        BOIR filing deadlines are approaching. Don't risk penalties up to $10,000 daily.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Processing Timeline</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Standard Processing:</span>
                        <span className="font-medium">7-10 business days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expedited Processing:</span>
                        <span className="font-medium">2 business days</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ 
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e: any) => {
                        e.target.style.backgroundColor = '#059669';
                      }}
                      onMouseLeave={(e: any) => {
                        e.target.style.backgroundColor = '#10b981';
                      }}
                    >
                      <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Proceed to Payment
                      </span>
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    <p>🔒 Secure payment processing</p>
                    <p>Your information is protected with bank-level security</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}