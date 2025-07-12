import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Mail, Calendar, DollarSign, CreditCard, ArrowRight } from "lucide-react";
import { MailboxPlan } from "@shared/schema";

export default function MailboxCheckout() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<MailboxPlan | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/mailbox-plans"],
  });

  // Get plan ID from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planIdFromUrl = urlParams.get('plan');
    setPlanId(planIdFromUrl);

    // Try to get selected plan from sessionStorage
    const storedPlan = sessionStorage.getItem('selectedMailboxPlan');
    if (storedPlan) {
      try {
        setSelectedPlan(JSON.parse(storedPlan));
      } catch (error) {
        console.error('Error parsing stored plan:', error);
      }
    }
  }, []);

  // Find plan from API when plans are loaded
  useEffect(() => {
    if (plans && planId && !selectedPlan) {
      const plan = plans.find((p: MailboxPlan) => p.id.toString() === planId);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [plans, planId, selectedPlan]);

  const handleLogin = () => {
    // Store current plan selection before redirecting to login
    if (selectedPlan) {
      sessionStorage.setItem('selectedMailboxPlan', JSON.stringify(selectedPlan));
      sessionStorage.setItem('returnUrl', window.location.href);
    }
    window.location.href = "/login";
  };

  const handleProceedToPayment = () => {
    if (selectedPlan) {
      window.location.href = `/dynamic-checkout/mailbox-${selectedPlan.id}`;
    }
  };

  // Auto-redirect authenticated users to dynamic checkout
  useEffect(() => {
    if (isAuthenticated && selectedPlan && !authLoading) {
      window.location.href = `/dynamic-checkout/mailbox-${selectedPlan.id}`;
    }
  }, [isAuthenticated, selectedPlan, authLoading]);

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

  if (authLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Plan Not Found</h2>
              <p className="text-gray-600 mb-4">The selected mailbox plan could not be found.</p>
              <Button 
                onClick={() => window.location.href = '/digital-mailbox-services'}
                className="w-full"
              >
                Back to Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Mailbox Service</h1>
          <p className="text-lg text-gray-600">Review your plan and proceed to secure payment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Selected Plan</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {selectedPlan.displayName}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="font-medium">Monthly Price</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${selectedPlan.monthlyPrice}/mo
                  </span>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Plan Features
                  </h4>
                  <ul className="space-y-2">
                    {getPlanFeatures(selectedPlan).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-2" />
                    Secure & HIPAA compliant
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    Professional business address
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Cancel anytime
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication & Payment */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Sign In to Continue</h3>
                    <p className="text-gray-600 mb-6">
                      Please sign in to your account to proceed with the secure payment process.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleLogin}
                      className="w-full"
                      size="lg"
                    >
                      Sign In to Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      New to ParaFort? You'll be able to create an account during sign in.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Proceed</h3>
                    <p className="text-gray-600 mb-6">
                      You're signed in and ready to complete your mailbox service purchase.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleProceedToPayment}
                      className="w-full"
                      size="lg"
                    >
                      Proceed to Secure Payment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Your payment information is protected with bank-level security.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total Monthly:</span>
                  <span className="font-semibold">${selectedPlan.monthlyPrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>Billing:</span>
                  <span>Monthly subscription</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Secure Payment
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}