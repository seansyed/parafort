import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, Building, DollarSign, Users, Calendar, ArrowRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with server configuration
let stripePromise: Promise<any | null> | null = null;

async function initializeStripe(): Promise<any | null> {
  try {
    const response = await fetch('/api/stripe/config');
    const config = await response.json();
    
    if (config.error) {
      console.error("Stripe configuration error:", config.error);
      return null;
    }
    
    if (config.publishableKey && config.publishableKey.startsWith('pk_')) {
      return await loadStripe(config.publishableKey);
    } else {
      console.error("Invalid publishable key received from server");
      return null;
    }
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    return null;
  }
}

function getStripe() {
  if (!stripePromise) {
    stripePromise = initializeStripe();
  }
  return stripePromise;
}

interface PayrollPlan {
  id: number;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  additionalEmployeeCost: number;
  features: string[];
  isActive: boolean;
  isMostPopular: boolean;
}

export default function PayrollPurchase() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PayrollPlan | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [employeeCount, setEmployeeCount] = useState(1);
  const [specialRequirements, setSpecialRequirements] = useState("");

  // Fetch payroll plans
  const { data: payrollPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/admin/payroll/plans"],
  });

  // Auto-select the first active plan
  useEffect(() => {
    if (payrollPlans && payrollPlans.length > 0 && !selectedPlan) {
      const activePlans = payrollPlans.filter((plan: PayrollPlan) => plan.isActive);
      if (activePlans.length > 0) {
        setSelectedPlan(activePlans[0]);
      }
    }
  }, [payrollPlans, selectedPlan]);

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (purchaseData: any) => {
      console.log("Initiating purchase with data:", purchaseData);
      const response = await apiRequest("POST", "/api/payroll/public-purchase", purchaseData);
      const result = await response.json();
      console.log("Purchase response:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Purchase successful, redirecting to:", data.url);
      if (data.url) {
        // Open in new tab to bypass iframe restrictions in Replit
        window.open(data.url, '_blank', 'noopener,noreferrer');
        toast({
          title: "Payment Window Opened",
          description: "Please complete payment in the new tab that just opened",
          duration: 5000,
        });
      } else {
        toast({
          title: "Purchase Initiated",
          description: "Redirecting to payment...",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to initiate purchase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = () => {
    if (!selectedPlan || !businessName || !contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Calculate total cost
    const baseCost = selectedPlan.monthlyPrice;
    const additionalCost = Math.max(0, employeeCount - 1) * selectedPlan.additionalEmployeeCost;
    const totalCost = baseCost + additionalCost;

    purchaseMutation.mutate({
      planId: selectedPlan.id,
      businessName,
      contactEmail,
      contactPhone,
      employeeCount,
      specialRequirements,
      totalCost,
    });
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const activePlans = payrollPlans?.filter((plan: PayrollPlan) => plan.isActive) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Purchase Payroll Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with professional payroll management for your business. 
            Choose your plan and provide your business details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Plan Selection */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
            <div className="space-y-4">
              {activePlans.map((plan: PayrollPlan) => {
                const features = Array.isArray(plan.features) ? plan.features : [];
                const monthlyPrice = (plan.monthlyPrice / 100).toFixed(0);
                const additionalCost = (plan.additionalEmployeeCost / 100).toFixed(0);
                const isSelected = selectedPlan?.id === plan.id;

                return (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-green-500 ring-2 ring-green-200' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {plan.displayName || plan.name}
                          </h3>
                          <p className="text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        {plan.isMostPopular && (
                          <Badge className="bg-green-500">Most Popular</Badge>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-green-500">
                          ${monthlyPrice}
                        </span>
                        <span className="text-gray-600">/month</span>
                        <p className="text-sm text-gray-600 mt-1">
                          + ${additionalCost} per additional employee
                        </p>
                      </div>

                      {features.length > 0 && (
                        <ul className="space-y-2">
                          {features.slice(0, 4).map((feature: string, index: number) => (
                            <li key={index} className="flex items-center text-sm">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {features.length > 4 && (
                            <li className="text-sm text-gray-500">
                              + {features.length - 4} more features
                            </li>
                          )}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Business Details Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Details</h2>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    min="1"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                  <Textarea
                    id="specialRequirements"
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="Any specific payroll requirements or questions..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Cost Summary */}
                {selectedPlan && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Cost Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Plan ({selectedPlan.displayName})</span>
                        <span>${(selectedPlan.monthlyPrice / 100).toFixed(2)}/month</span>
                      </div>
                      {employeeCount > 1 && (
                        <div className="flex justify-between">
                          <span>Additional Employees ({employeeCount - 1})</span>
                          <span>${((employeeCount - 1) * selectedPlan.additionalEmployeeCost / 100).toFixed(2)}/month</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Monthly Cost</span>
                        <span>${((selectedPlan.monthlyPrice + (Math.max(0, employeeCount - 1) * selectedPlan.additionalEmployeeCost)) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={!selectedPlan || !businessName || !contactEmail || purchaseMutation.isPending}
                  style={{
                    width: '100%',
                    backgroundColor: purchaseMutation.isPending || !selectedPlan || !businessName || !contactEmail ? '#9ca3af' : '#059669',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '18px',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: purchaseMutation.isPending || !selectedPlan || !businessName || !contactEmail ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!purchaseMutation.isPending && selectedPlan && businessName && contactEmail) {
                      e.target.style.backgroundColor = '#047857';
                      e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!purchaseMutation.isPending && selectedPlan && businessName && contactEmail) {
                      e.target.style.backgroundColor = '#059669';
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  {purchaseMutation.isPending ? (
                    "Processing..."
                  ) : (
                    <>
                      Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You'll be redirected to a secure payment page to complete your purchase.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}