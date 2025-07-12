import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Building, Users, DollarSign } from "lucide-react";

interface PayrollPlan {
  id: number;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  employeeLimit: number;
  additionalEmployeeCost: number;
  features: string[];
  isActive: boolean;
  isMostPopular: boolean;
}

interface PayrollSubscription {
  id: number;
  businessEntityId: string;
  planName: string;
  status: 'active' | 'trial' | 'pending_renewal' | 'cancelled';
  renewalDate: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  employeeCount: number;
  businessEntityName: string;
}

interface BusinessEntity {
  id: string;
  name: string;
  legalName: string;
  entityType: string;
  state: string;
  status: string;
}

export default function Payroll() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");

  // Fetch payroll plans
  const { data: payrollPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["/api/payroll/plans"],
    retry: false,
  });

  // Fetch business entities when authenticated
  const { data: businessEntities = {}, isLoading: entitiesLoading } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: isAuthenticated,
    retry: false,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
    },
  });

  // Fetch payroll subscriptions when authenticated
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["/api/payroll/subscriptions"],
    enabled: isAuthenticated,
    retry: false,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
    },
  });

  // Auto-select first business entity if available and none selected
  useEffect(() => {
    if (businessEntities && businessEntities.length > 0 && !selectedBusinessId) {
      const entityWithoutSubscription = businessEntities.find((entity: BusinessEntity) => 
        !(subscriptions as PayrollSubscription[]).some((sub: PayrollSubscription) => sub.businessEntityId === entity.id)
      );
      if (entityWithoutSubscription) {
        setSelectedBusinessId(entityWithoutSubscription.id);
      } else if (businessEntities[0]) {
        setSelectedBusinessId(businessEntities[0].id);
      }
    }
  }, [businessEntities, subscriptions, selectedBusinessId]);

  const handleSubscribe = (plan: PayrollPlan) => {
    // Store the selected plan and business info in sessionStorage
    sessionStorage.setItem('selectedPayrollPlan', JSON.stringify({
      planId: plan.id,
      planName: plan.name,
      planDisplayName: plan.displayName,
      monthlyPrice: plan.monthlyPrice,
      businessId: selectedBusinessId,
      businessName: selectedBusinessId ? (businessEntities?.find((b: BusinessEntity) => b.id === selectedBusinessId)?.name || `Business ${selectedBusinessId}`) : 'New Business',
    }));
    
    // Navigate to checkout page
    window.location.href = '/payroll-checkout';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payroll Services
          </h1>
          <p className="text-gray-600 mt-2">
            Streamline your payroll processing with our comprehensive solutions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
            <TabsTrigger value="subscriptions" disabled={!isAuthenticated}>
              My Subscriptions
            </TabsTrigger>
            <TabsTrigger value="documents" disabled={!isAuthenticated}>
              Documents
            </TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Available Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            {/* Expert Payroll Services Section */}
            <div className="bg-gradient-to-br from-green-50 to-orange-100 rounded-lg p-8 mb-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-white rounded-full p-4 shadow-sm">
                    <div className="w-12 h-12 text-green-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5V7H9V3.5L3 7V9H21ZM3 19H21V21H3V19ZM5 11H19C19.6 11 20 11.4 20 12V17H4V12C4 11.4 4.4 11 5 11Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-green-500 font-semibold text-lg mb-2">Expert Payroll Services</h2>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Reliable Payroll Support for Every Business Size
                </h3>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                  When you sign up... You'll be assigned a certified online payroll specialist to support 
                  your business. Save yourself some valuable time with Penther's specialized payroll 
                  services. Our experienced team handles employee taxes and payments efficiently 
                  — even for maternity, paternity, or sick leave scenarios.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm">
                      <Users className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Multiple Worker Types</h4>
                    <p className="text-gray-600 text-sm">
                      Ability to pay different types of workers — exempt and non-exempt 
                      employees, contractors
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm">
                      <DollarSign className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Flexible Payment Options</h4>
                    <p className="text-gray-600 text-sm">
                      Direct deposit, paper checks, online tip sharing, and on-demand 
                      access to earned wages
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-sm">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-500 mx-auto">
                        <path d="M6.62,10.79C6.21,10.79 5.87,10.45 5.87,10.04C5.87,9.63 6.21,9.29 6.62,9.29H17.38C17.79,9.29 18.13,9.63 18.13,10.04C18.13,10.45 17.79,10.79 17.38,10.79H6.62ZM9,12V6A3,3 0 0,1 12,3A3,3 0 0,1 15,12V12H16A1,1 0 0,1 17,13V20A1,1 0 0,1 16,21H8A1,1 0 0,1 7,20V13A1,1 0 0,1 8,12H9M10,12H14V6A2,2 0 0,0 12,4A2,2 0 0,0 10,6V12Z"/>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Phone Payroll Submission</h4>
                    <p className="text-gray-600 text-sm">
                      Option to submit payroll by phone to a payroll specialist
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Choose Your Payroll Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional payroll processing for businesses of all sizes. Additional employees beyond your plan limit are just $15/month each.
              </p>
            </div>

            {plansLoading ? (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <div className="w-full max-w-md mx-auto">
                  {(payrollPlans as PayrollPlan[])
                    .filter((plan: PayrollPlan) => plan.isActive)
                    .sort((a: PayrollPlan, b: PayrollPlan) => a.monthlyPrice - b.monthlyPrice)
                    .map((plan: PayrollPlan) => (
                      <Card 
                        key={plan.id} 
                        className={`relative ${plan.isMostPopular ? 'border-green-500 ring-2 ring-green-500/20' : ''}`}
                      >
                        {plan.isMostPopular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-green-500 text-white">Most Popular</Badge>
                          </div>
                        )}
                        
                        <CardHeader className="text-center">
                          <CardTitle className="text-lg font-semibold">
                            {plan.displayName}
                          </CardTitle>
                          <div className="text-3xl font-bold text-green-500">
                            ${plan.monthlyPrice}
                            <span className="text-sm text-gray-500 font-normal">/month</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Up to {plan.employeeLimit} employees
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-gray-600 text-center text-sm">
                            {plan.description}
                          </p>
                          
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="text-xs text-gray-500 mt-4">
                            Additional employees: ${plan.additionalEmployeeCost}/month each
                          </div>
                          
                          <Button 
                            onClick={() => handleSubscribe(plan)}
                            className="w-full bg-green-500 hover:bg-[#E54F00] text-white"
                          >
                            Get Started
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Additional Services Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mt-12">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Complete Payroll Solutions
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Our comprehensive payroll services go beyond basic processing to provide 
                  complete workforce management solutions for your business.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-green-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tax Compliance</h4>
                    <p className="text-gray-600 text-sm">
                      Automatic tax calculations, filings, and compliance management
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <Building className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">HR Integration</h4>
                    <p className="text-gray-600 text-sm">
                      Seamlessly integrate with your existing HR systems and processes
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <Clock className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Time Tracking</h4>
                    <p className="text-gray-600 text-sm">
                      Advanced time and attendance tracking with mobile accessibility
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <Users className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Employee Self-Service</h4>
                    <p className="text-gray-600 text-sm">
                      Give employees access to pay stubs, tax forms, and personal information
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-[#27884b]/5 to-orange-100/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Need Custom Payroll Solutions?
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Our payroll specialists can create customized solutions for businesses with unique requirements, 
                      complex pay structures, or specific industry needs.
                    </p>
                    <Button 
                      className="bg-green-500 hover:bg-[#E54F00] text-white"
                      onClick={() => window.location.href = 'mailto:payroll@parafort.com'}
                    >
                      Contact Payroll Specialist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            {!isAuthenticated ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
                  <p className="text-gray-600 mb-4">Please log in to view your payroll subscriptions</p>
                  <Button onClick={() => window.location.href = "/login"}>
                    Log In
                  </Button>
                </CardContent>
              </Card>
            ) : subscriptionsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : subscriptions && subscriptions.length > 0 ? (
              <div className="grid gap-6">
                {(subscriptions as PayrollSubscription[]).map((subscription: PayrollSubscription) => (
                  <Card key={subscription.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subscription.planName}</CardTitle>
                        <Badge 
                          variant={subscription.status === 'active' ? 'default' : 'secondary'}
                          className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {subscription.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {subscription.status === 'trial' && <Clock className="h-3 w-3 mr-1" />}
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1).replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{subscription.businessEntityName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{subscription.employeeCount} employees</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">${subscription.cost}/{subscription.billingCycle}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Next renewal: {new Date(subscription.renewalDate).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">No Active Subscriptions</h3>
                  <p className="text-gray-600 mb-4">You don't have any active payroll subscriptions yet</p>
                  <Button 
                    onClick={() => setActiveTab("plans")}
                    className="bg-green-500 hover:bg-[#E54F00] text-white"
                  >
                    Browse Plans
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Payroll Documents</h3>
                <p className="text-gray-600">Document management features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get answers to common questions about our payroll services
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">What information do I need to provide to sign up for payroll services?</h3>
                  <p className="text-gray-600">You'll need to provide basic business details (such as legal name, EIN, and address), information about your employees (names, addresses, Social Security numbers), completed onboarding forms (W-4, I-9), and your preferred pay schedule.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">How long does the payroll onboarding process take?</h3>
                  <p className="text-gray-600">The onboarding process typically takes a few days, depending on how quickly required information and documents are provided and how complex your payroll needs are. Your CPA will guide you through each step to ensure a smooth transition.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Will I have a dedicated point of contact during setup?</h3>
                  <p className="text-gray-600">Yes, you will be assigned a dedicated onboarding manager or CPA contact who will assist you throughout the setup process, answer your questions, and help resolve any issues that arise.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">What forms and documents are required for new employees?</h3>
                  <p className="text-gray-600">For each new employee, you'll need to complete onboarding paperwork such as the I-9 (employment eligibility), W-4 (federal tax withholding), and direct deposit forms. Your CPA will provide these forms and instructions.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Can you help me choose the right pay schedule and payroll software?</h3>
                  <p className="text-gray-600">Absolutely. Your CPA can advise on the most suitable pay frequency (weekly, biweekly, monthly, etc.) and recommend payroll software that fits your business needs and integrates with your existing systems.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">What ongoing support is available after payroll setup?</h3>
                  <p className="text-gray-600">After setup, your CPA will continue to provide support, including running payroll, managing tax filings, handling employee changes, and answering any payroll-related questions you may have.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">How do you ensure my payroll data is secure and compliant?</h3>
                  <p className="text-gray-600">Your CPA and payroll provider use secure, encrypted systems and follow industry best practices to protect your sensitive information and ensure compliance with all relevant regulations.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">What if I have unique payroll needs or special requests?</h3>
                  <p className="text-gray-600">Please let your CPA know about any specific requirements—such as multiple pay rates, bonuses, or deductions—so the payroll service can be customized to fit your business.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}