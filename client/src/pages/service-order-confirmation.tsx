import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Phone, FileText, Calendar } from "lucide-react";
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

export default function ServiceOrderConfirmation() {
  const [location] = useLocation();
  const [orderId, setOrderId] = useState<string>("");
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
    
    // Hide fireworks after 4 seconds
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ['/api/service-order', orderId],
    enabled: !!orderId,
    queryFn: async () => {
      if (!orderId) return null;
      const response = await fetch(`/api/service-order/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      {showFireworks && <Fireworks />}
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Service Order Received!
          </h1>
          <p className="text-lg text-gray-600">
            Your service order has been successfully submitted and is being processed.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="text-lg font-semibold">{orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Order Date</p>
                <p className="text-lg">{new Date().toLocaleDateString()}</p>
              </div>
              {orderDetails?.businessName && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Business</p>
                  <p className="text-lg">{orderDetails.businessName}</p>
                </div>
              )}
              {orderDetails?.totalAmount && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-green-500">
                    ${orderDetails.totalAmount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {orderDetails?.services && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Services Ordered</p>
                <div className="space-y-2">
                  {orderDetails.services.map((service: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Order Review</p>
                  <p className="text-sm text-gray-600">
                    Our team will review your order within 24 hours and verify all details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Contact & Payment</p>
                  <p className="text-sm text-gray-600">
                    We'll contact you to arrange payment and gather any additional information needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Service Delivery</p>
                  <p className="text-sm text-gray-600">
                    Once payment is confirmed, we'll begin working on your services and provide regular updates.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium">Email Confirmation</p>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation with all order details within the next few minutes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium">Questions?</p>
                <p className="text-sm text-gray-600">
                  Contact our support team at support@parafort.com or call (555) 123-4567
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Button asChild className="bg-green-500 hover:bg-green-600">
            <Link href="/dashboard">
              View Dashboard
            </Link>
          </Button>
          
          <div className="text-sm text-gray-500">
            <Link href="/services-marketplace" className="text-green-500 hover:underline">
              ← Back to Services Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}