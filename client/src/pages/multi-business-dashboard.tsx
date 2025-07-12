import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SubscriptionCheckout } from "@/components/subscription-checkout";
import { Link } from "wouter";
import { 
  Building2, 
  Plus, 
  Crown, 
  Star, 
  Zap, 
  Calendar,
  FileText,
  Settings,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

interface BusinessEntity {
  id: number;
  name: string;
  entityType: string;
  state: string;
  status: string;
  subscriptionPlanId: number | null;
  subscriptionStatus: string;
  subscriptionPlan?: {
    id: number;
    name: string;
    description: string;
    yearlyPrice: string;
    features: string[];
  };
  createdAt: string;
  currentStep: number;
  totalSteps: number;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  yearlyPrice: string;
  features: string[];
  isActive: boolean;
}

const planIcons = {
  Free: <Zap className="h-5 w-5" />,
  Silver: <Star className="h-5 w-5" />,
  Gold: <Crown className="h-5 w-5" />
};

const planColors = {
  Free: "bg-gray-100 text-gray-800 border-gray-200",
  Silver: "bg-blue-100 text-blue-800 border-blue-200",
  Gold: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  filed: "bg-purple-100 text-purple-800"
};

export default function MultiBusinessDashboard() {
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    businessId: number;
    planId: number;
    planName: string;
    clientSecret: string;
    amount: number;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's businesses with subscription information
  const { data: businesses, isLoading: businessesLoading } = useQuery({
    queryKey: ["/api/business-entities-with-subscriptions"],
  });

  // Fetch available subscription plans
  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
  });

  // Create payment intent for subscription upgrade
  const createPaymentIntentMutation = useMutation({
    mutationFn: async ({ businessId, planId }: { businessId: number; planId: number }) => {
      const response = await apiRequest("POST", `/api/business-entities/${businessId}/upgrade-subscription`, { planId });
      return response.json();
    },
    onSuccess: (data) => {
      const plan = subscriptionPlans.find((p: SubscriptionPlan) => p.id === parseInt(selectedPlan));
      if (plan && data.clientSecret) {
        setPaymentData({
          businessId: selectedBusiness!,
          planId: parseInt(selectedPlan),
          planName: plan.name,
          clientSecret: data.clientSecret,
          amount: parseFloat(plan.yearlyPrice),
        });
        setCheckoutOpen(true);
        setUpgradeDialogOpen(false);
      }
    },
    onError: (error) => {
      toast({
        title: "Payment Setup Failed",
        description: error.message || "Failed to setup payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpgradeSubscription = () => {
    if (selectedBusiness && selectedPlan) {
      createPaymentIntentMutation.mutate({
        businessId: selectedBusiness,
        planId: parseInt(selectedPlan)
      });
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Subscription Upgraded",
      description: "Business subscription plan has been successfully upgraded.",
    });
    queryClient.invalidateQueries({ queryKey: ["/api/business-entities-with-subscriptions"] });
    setCheckoutOpen(false);
    setPaymentData(null);
    setSelectedBusiness(null);
    setSelectedPlan("");
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  const getCurrentPlanName = (business: BusinessEntity) => {
    if (business.subscriptionPlan) {
      return business.subscriptionPlan.name;
    }
    return "Free";
  };

  if (businessesLoading || plansLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-36">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Portfolio</h1>
          <p className="text-gray-600 mt-2">
            Manage all your business entities and their subscription plans
          </p>
        </div>
        <Link href="/formation">
          <Button className="bg-green-500 hover:bg-[#E64E00] text-white font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Form New Business
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {businesses && businesses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {businesses.filter((b: BusinessEntity) => b.subscriptionStatus === "active").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {businesses.filter((b: BusinessEntity) => b.status === "in_progress").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gold Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {businesses.filter((b: BusinessEntity) => getCurrentPlanName(b) === "Gold").length}
                  </p>
                </div>
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Business Cards Grid */}
      {businesses && businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business: BusinessEntity) => {
            const planName = getCurrentPlanName(business);
            const progressPercentage = getProgressPercentage(business.currentStep, business.totalSteps);
            
            return (
              <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{business.name || `${business.entityType} Business`}</CardTitle>
                      <CardDescription className="mt-1">
                        {business.entityType} • {business.state}
                      </CardDescription>
                    </div>
                    <Badge className={`${planColors[planName as keyof typeof planColors]} flex items-center gap-1`}>
                      {planIcons[planName as keyof typeof planIcons]}
                      {planName}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusColors[business.status as keyof typeof statusColors]}>
                      {business.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {business.status === "in_progress" && (
                      <span className="text-sm text-gray-600">
                        Step {business.currentStep} of {business.totalSteps}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar for In-Progress Businesses */}
                  {business.status === "in_progress" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Formation Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Subscription Information */}
                  {business.subscriptionPlan && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">{business.subscriptionPlan.name} Plan</p>
                      <p className="text-sm text-gray-600">${business.subscriptionPlan.yearlyPrice}/year</p>
                      <p className="text-xs text-gray-500 mt-1">{business.subscriptionPlan.description}</p>
                    </div>
                  )}

                  {business.subscriptionStatus === "free" && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-medium text-sm text-blue-900">Free Plan</p>
                      <p className="text-xs text-blue-700 mt-1">Basic features included</p>
                    </div>
                  )}
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-between p-4">
                  <div className="flex gap-2">
                    <Link href={`/business/${business.id}/filings`}>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                    
                    {business.status === "completed" && (
                      <Link href={`/business-tools?businessId=${business.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Tools
                        </Button>
                      </Link>
                    )}
                  </div>

                  {planName !== "Gold" && (
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-[#E64E00] text-white font-semibold"
                      onClick={() => {
                        setSelectedBusiness(business.id);
                        setUpgradeDialogOpen(true);
                      }}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Upgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">No Businesses Yet</CardTitle>
            <CardDescription className="mb-6">
              Start your business formation journey by creating your first business entity.
            </CardDescription>
            <Link href="/formation">
              <Button className="bg-green-500 hover:bg-[#E64E00] text-white font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Form Your First Business
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Subscription Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade Business Subscription</DialogTitle>
            <DialogDescription>
              Choose a new subscription plan for this business entity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Plan Display */}
            {selectedBusiness && businesses && subscriptionPlans && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                {(() => {
                  const business = businesses.find((b: BusinessEntity) => b.id === selectedBusiness);
                  const currentPlan = subscriptionPlans.find((p: SubscriptionPlan) => p.id === business?.subscriptionPlanId);
                  return currentPlan ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-blue-700 font-medium">Current Plan:</span>
                        {planIcons[currentPlan.name as keyof typeof planIcons]}
                        <span className="font-semibold text-blue-900">{currentPlan.name}</span>
                        <span className="text-blue-600">(${currentPlan.yearlyPrice}/year)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">Current Plan:</span> Free
                    </div>
                  );
                })()}
              </div>
            )}

            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subscription plan" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPlans?.map((plan: SubscriptionPlan) => {
                  const business = businesses?.find((b: BusinessEntity) => b.id === selectedBusiness);
                  const currentPlanId = business?.subscriptionPlanId;
                  const isCurrentPlan = plan.id === currentPlanId;
                  const isDowngrade = currentPlanId && plan.id < currentPlanId;
                  
                  return (
                    <SelectItem 
                      key={plan.id} 
                      value={plan.id.toString()}
                      disabled={isCurrentPlan || isDowngrade}
                    >
                      <div className="flex items-center gap-2">
                        {planIcons[plan.name as keyof typeof planIcons]}
                        <div>
                          <p className={`font-medium ${isCurrentPlan ? 'text-blue-600' : isDowngrade ? 'text-gray-400' : ''}`}>
                            {plan.name}
                            {isCurrentPlan && <span className="ml-2 text-xs text-blue-500">(Current)</span>}
                            {isDowngrade && <span className="ml-2 text-xs text-gray-400">(Upgrade Only)</span>}
                          </p>
                          <p className={`text-sm ${isCurrentPlan ? 'text-blue-500' : isDowngrade ? 'text-gray-400' : 'text-gray-600'}`}>
                            ${plan.yearlyPrice}/year
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {selectedPlan && subscriptionPlans && (
              <div className="p-4 bg-gray-50 rounded-lg">
                {(() => {
                  const plan = subscriptionPlans.find((p: SubscriptionPlan) => p.id.toString() === selectedPlan);
                  return plan ? (
                    <div>
                      <p className="font-medium text-sm">{plan.name} Plan Features:</p>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        {plan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpgradeSubscription}
              disabled={!selectedPlan || createPaymentIntentMutation.isPending}
              className="bg-green-500 hover:bg-[#E64E00] text-white font-semibold"
            >
              {createPaymentIntentMutation.isPending ? "Processing..." : "Continue to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stripe Checkout Modal */}
      {paymentData && (
        <SubscriptionCheckout
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          businessId={paymentData.businessId}
          planId={paymentData.planId}
          planName={paymentData.planName}
          clientSecret={paymentData.clientSecret}
          amount={paymentData.amount}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}