import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Shield, CreditCard, FileText, Package } from "lucide-react";
import { MailboxPlan } from "@shared/schema";
import { LoadingPage } from "@/components/ui/loading-spinner";

export default function MailboxPlans() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/mailbox-plans"],
  });

  const { data: currentSubscription } = useQuery({
    queryKey: ["/api/user/mailbox-subscription"],
    enabled: isAuthenticated,
  });

  const subscribeMutation = useMutation({
    mutationFn: (planId: number) => 
      apiRequest("POST", "/api/mailbox-subscription", { planId }),
    onSuccess: () => {
      toast({
        title: "Subscription Created",
        description: "You've successfully subscribed to the mailbox service!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/mailbox-subscription"] });
    },
    onError: (error) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (planId: number) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    subscribeMutation.mutate(planId);
  };

  const getPlanFeatures = (plan: MailboxPlan) => [
    `${plan.businessAddresses} business address${plan.businessAddresses > 1 ? 'es' : ''} of your choice`,
    `${plan.mailItemsPerMonth} mail items per month`,
    `Cost per mail received over plan limits: $${plan.costPerExtraItem} per item`,
    `Shipping: $${plan.shippingCost} per shipment plus postage`,
    plan.secureShredding ? "Secure shredding" : null,
    `Check deposit subscription: $${plan.checkDepositFee} per month`,
    `${plan.checksIncluded} checks included in plan`,
    `$${plan.additionalCheckFee} per additional check deposits`,
  ].filter(Boolean);

  if (plansLoading) {
    return <LoadingPage message="Loading mailbox plans..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Virtual Mail Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect virtual mailbox plan for your business. 
            Get a professional business address and never miss important mail again.
          </p>
        </div>

        {/* Current Subscription Alert */}
        {currentSubscription && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800">
                You currently have an active <strong>{currentSubscription.plan?.displayName}</strong> subscription.
              </p>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans?.map((plan: MailboxPlan) => (
            <Card key={plan.id} className={`relative transition-all duration-200 hover:shadow-lg ${
              plan.isMostPopular ? 'border-orange-500 shadow-lg scale-105' : 'border-gray-200'
            }`}>
              {plan.isMostPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-4 py-1 text-sm font-semibold">
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Virtual Mail
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.displayName}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.autoRenews ? 'Auto-renews monthly' : 'monthly'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {getPlanFeatures(plan).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.isMostPopular 
                      ? 'bg-green-500 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-700 text-white'
                  }`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={
                    subscribeMutation.isPending ||
                    (currentSubscription?.subscription?.status === 'active')
                  }
                >
                  {subscribeMutation.isPending && selectedPlanId === plan.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processing...
                    </div>
                  ) : currentSubscription?.subscription?.status === 'active' ? (
                    'Already Subscribed'
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Professional Address
            </h3>
            <p className="text-gray-600">
              Get a prestigious business address for your company registration and mail handling.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your mail is handled securely with optional shredding services for sensitive documents.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Check Deposits
            </h3>
            <p className="text-gray-600">
              Convenient check deposit services with multiple checks included in your plan.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mail Forwarding
            </h3>
            <p className="text-gray-600">
              Fast and reliable mail forwarding with competitive shipping rates.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing a Plan?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help you find the perfect virtual mail solution for your business needs.
          </p>
          <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-green-50">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}