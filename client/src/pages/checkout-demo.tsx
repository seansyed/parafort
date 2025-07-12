import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Demo payment form without Stripe dependency
const DemoPaymentForm = ({ service, businessId, plan }: { service: string; businessId: string; plan: string }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          Your order has been processed successfully.
        </p>
        <Button onClick={() => window.location.href = "/dashboard"}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> This is a demonstration payment form. No actual charges will be made.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="4242 4242 4242 4242"
            value="4242 4242 4242 4242"
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value="12/25"
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              value="123"
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="name">Cardholder Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            defaultValue="John Doe"
            className="bg-gray-50"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Processing Payment...
          </div>
        ) : (
          `Complete Payment - $99.00`
        )}
      </Button>
    </form>
  );
};

export default function CheckoutDemo() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get("service") || "";
  const businessId = urlParams.get("businessId") || "";
  const plan = urlParams.get("plan") || "standard";

  // Fetch business entity details
  const { data: businessEntities = [] } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: !!businessId && isAuthenticated,
  });

  const businessEntity = Array.isArray(businessEntities) 
    ? businessEntities.find((entity: any) => entity.id.toString() === businessId)
    : undefined;

  const getServiceAmount = (service: string, plan: string) => {
    if (service === "registered-agent") {
      switch (plan) {
        case "standard": return 99;
        case "premium": return 149;
        case "enterprise": return 249;
        default: return 99;
      }
    }
    return 99;
  };

  const getServiceDescription = (service: string) => {
    switch (service) {
      case "registered-agent":
        return "Professional registered agent service for your business entity";
      default:
        return "Business service";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-gray-600">Please log in to continue with your purchase.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
            <p className="text-gray-600 mt-2">Demo checkout flow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p className="text-sm text-gray-600">{getServiceDescription(service)}</p>
                    <p className="text-sm text-gray-500 mt-1">Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
                  </div>
                  <span className="font-semibold">${getServiceAmount(service, plan)}.00</span>
                </div>

                {businessEntity && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Business Entity</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Name:</strong> {businessEntity.name}</p>
                      <p><strong>Type:</strong> {businessEntity.entityType}</p>
                      <p><strong>State:</strong> {businessEntity.state}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>${getServiceAmount(service, plan)}.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <DemoPaymentForm service={service} businessId={businessId} plan={plan} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}