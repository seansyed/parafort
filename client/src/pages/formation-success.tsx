import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Phone } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from "@tanstack/react-query";

// Fireworks animation component
const Fireworks = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Animated firework particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full animate-ping"
          style={{
            left: `${20 + (i * 6)}%`,
            top: `${15 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2s'
          }}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`spark-${i}`}
          className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"
          style={{
            right: `${15 + (i * 8)}%`,
            top: `${25 + (i % 2) * 30}%`,
            animationDelay: `${0.5 + i * 0.3}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
      {/* Celebration sparkles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute text-yellow-400 animate-pulse"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 60 + 20}%`,
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${Math.random() * 10 + 8}px`
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default function FormationSuccess() {
  const [location] = useLocation();
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const piId = urlParams.get('payment_intent');
    if (piId) {
      setPaymentIntentId(piId);
    }
    
    // Hide fireworks after 4 seconds
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  const { data: orderDetails, isLoading, error } = useQuery({
    queryKey: ['/api/formation-order', paymentIntentId],
    queryFn: async () => {
      if (!paymentIntentId) throw new Error('No payment intent ID');
      
      console.log("Fetching order details for payment intent:", paymentIntentId);
      
      // First complete the formation order
      try {
        const completeResponse = await fetch('/api/complete-formation-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId
          }),
        });
        
        if (completeResponse.ok) {
          console.log("Formation order completed successfully");
        } else {
          console.log("Formation order may already be completed");
        }
      } catch (error) {
        console.log("Error completing formation order (may already be completed):", error);
      }
      
      // Then fetch order details
      const response = await fetch(`/api/formation-order/${paymentIntentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      console.log("Order details fetched:", data);
      return data;
    },
    enabled: !!paymentIntentId,
    retry: 3,
    retryDelay: 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-lg text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      {showFireworks && <Fireworks />}
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Complete!
          </h1>
          <p className="text-lg text-gray-600">
            Your business formation order has been successfully submitted.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              What Happens Next
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Processing Your Filing</h3>
                <p className="text-gray-600">We'll prepare and submit your formation documents to the state within 1-2 business days.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">State Review</h3>
                <p className="text-gray-600">The state will review your application. Processing typically takes 5-15 business days.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Documents Delivered</h3>
                <p className="text-gray-600">Once approved, we'll send your official formation documents and EIN confirmation.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            {orderDetails ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-semibold">{orderDetails.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entity Type:</span>
                  <span className="font-semibold">{orderDetails.entityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State:</span>
                  <span className="font-semibold">{orderDetails.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-sm">{paymentIntentId}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Order details will be sent to your email shortly.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Check Your Email</h3>
                  <p className="text-sm text-gray-600">Confirmation and updates will be sent to your email address.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-gray-600">Contact our support team for any questions about your order.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Link href="/dashboard">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
              View Dashboard
            </Button>
          </Link>
          
          <div>
            <Link href="/">
              <Button variant="outline">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}