import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Shield, 
  Building, 
  AlertTriangle,
  Mail,
  Clipboard,
  Star,
  XCircle,
  Gavel,
  Plus,
  User,
  MapPin
} from "lucide-react";
import type { BusinessEntity } from "@shared/schema";

export default function RegisteredAgent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's business entities
  const { data: businessEntities = [], isLoading } = useQuery<BusinessEntity[]>({
    queryKey: ["/api/business-entities"],
  });

  // Fetch user's subscription data to check if they have Gold Plan with registered agent included
  const { data: userSubscriptions = [] } = useQuery({
    queryKey: ["/api/user-subscriptions"],
  });

  // Check if user has Gold Plan subscription (id = 3 or serviceName = "Gold")
  const hasGoldPlan = userSubscriptions?.some((sub: any) => 
    (sub.id === 3 || sub.serviceName === "Gold") && sub.status === 'active'
  ) || false;

  // Handle payment requirement for registered agent service
  const handleActivateService = (entityId: string, plan: string = "standard") => {
    // Directly redirect to checkout with payment since this is a paid service
    toast({
      title: "Redirecting to Payment",
      description: "You'll be redirected to complete payment for the registered agent service.",
    });
    
    setTimeout(() => {
      window.location.href = `/checkout?service=registered-agent&businessId=${entityId}&plan=${plan}`;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto pt-36 pb-12 px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Registered Agent Services
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Manage registered agent services for all your business entities. 
                Every LLC and Corporation requires a registered agent in their state of formation.
              </p>
            </div>

            {/* Your Business Entities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-500" />
                  Your Business Entities
                </CardTitle>
                <CardDescription>
                  Current registered agent status for each of your businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (businessEntities as BusinessEntity[]).length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No business entities found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Create a business entity first to manage registered agent services
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(businessEntities as BusinessEntity[]).map((entity: BusinessEntity) => (
                      <div key={entity.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{entity.name || "Unnamed Entity"}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {entity.entityType}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {entity.state}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            {entity.useParafortAgent || hasGoldPlan ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {hasGoldPlan ? "Included in Gold Plan" : "ParaFort Active"}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Service Needed
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Service Status Card */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-base">
                                <Shield className="h-4 w-4 text-green-500" />
                                Service Status
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {entity.useParafortAgent || hasGoldPlan ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-700">
                                    {hasGoldPlan ? "ParaFort Service Active (Gold Plan)" : "ParaFort Service Active"}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-medium text-yellow-700">Service Not Active</span>
                                </div>
                              )}

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Current Agent:</span>
                                  <span className="font-medium">
                                    {entity.registeredAgent || (hasGoldPlan ? "ParaFort (Included in Gold Plan)" : "Not specified")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">State:</span>
                                  <span className="font-medium">{entity.state}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Entity Type:</span>
                                  <span className="font-medium">{entity.entityType}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Action Card */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-green-500" />
                                Available Actions
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {entity.useParafortAgent || hasGoldPlan ? (
                                <div className="space-y-2">
                                  <p className="text-sm text-green-700">
                                    ✓ Your business is protected with ParaFort registered agent service
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {hasGoldPlan ? "Included in Gold Plan | No additional fees" : "Annual fee: $99/year | Next renewal: Auto-billing"}
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <p className="text-sm text-gray-700">
                                    Activate ParaFort registered agent service to ensure compliance and protect your privacy.
                                  </p>
                                  <div className="space-y-2">
                                    <div className="text-lg font-bold text-green-500">$99/year</div>
                                    <Button 
                                      onClick={() => handleActivateService(entity.id)}
                                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Purchase Standard Plan
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Why You Need a Registered Agent */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-500" />
                  Why Every Business Needs a Registered Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Legal Requirement</h4>
                      <p className="text-gray-600">Mandatory in every state for LLCs and Corporations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Privacy Protection</h4>
                      <p className="text-gray-600">Keep your home address off public records</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gavel className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Compliance Assurance</h4>
                      <p className="text-gray-600">Avoid penalties, fines, or dissolution for missed notices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Reliability</h4>
                      <p className="text-gray-600">Ensures important documents are always received</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Your Registered Agent Does */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-green-500" />
                  Beyond the Basics: What Your Registered Agent Does
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Service of Process</h4>
                      <p className="text-gray-600">Receives lawsuits, subpoenas, and legal documents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clipboard className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Government Correspondence</h4>
                      <p className="text-gray-600">Accepts tax notices and annual report reminders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Document Forwarding</h4>
                      <p className="text-gray-600">Promptly forwards all important documents to you</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Physical Address</h4>
                      <p className="text-gray-600">Maintains required address in your state of formation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Our Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-500" />
                  The Advantage of Partnering With Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Nationwide Coverage</h4>
                      <p className="text-gray-600">Available in all 50 states with local expertise</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Digital Access</h4>
                      <p className="text-gray-600">Secure online portal for all your documents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Prompt Notifications</h4>
                      <p className="text-gray-600">Real-time alerts when documents are received</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Experienced & Reliable</h4>
                      <p className="text-gray-600">Trusted expertise with dependable service</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stay Compliant Warning */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Don't Risk It: The Consequences of Non-Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Fines and Penalties</h4>
                      <p className="text-red-700">State-imposed financial penalties for non-compliance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Loss of Good Standing</h4>
                      <p className="text-red-700">Your business status may be revoked by the state</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Business Restrictions</h4>
                      <p className="text-red-700">Inability to conduct business legally in your state</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Default Judgments</h4>
                      <p className="text-red-700">Automatic losses in lawsuits due to missed notices</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Information */}
            <Card className="border-green-500 bg-green-500">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-black">Professional Service Pricing</CardTitle>
                <CardDescription className="text-lg text-black">
                  Transparent pricing for comprehensive registered agent protection
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-white">$99/year</div>
                  <p className="text-black">Complete registered agent service with digital access</p>
                </div>
                <p className="text-sm text-black max-w-2xl mx-auto">
                  Activate service for any of your business entities using the "Activate Service" button in the business entities section above.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Can I be my own Registered Agent?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can serve as your own registered agent if you meet the requirements: you must have a physical address (not a P.O. Box) in the state where your business is formed, and you must be available during normal business hours to receive documents. However, using a professional service offers privacy, reliability, and ensures you never miss important legal documents even when you're traveling or unavailable.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What if I move my business?</AccordionTrigger>
                    <AccordionContent>
                      If you move your business to a different state, you'll need a registered agent in each state where your business is registered. We provide nationwide coverage, so we can easily update your registered agent address or add service in new states as your business expands. You'll need to file the appropriate paperwork with each state to update your registered agent information.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is a Registered Agent the same as a business license?</AccordionTrigger>
                    <AccordionContent>
                      No, a registered agent and a business license are completely different requirements. A registered agent is a person or service that receives legal documents on behalf of your business and is required for entity formation. A business license is a permit that allows you to operate your specific type of business in a particular location. Most businesses need both, but they serve different purposes in your business compliance requirements.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

      </div>
    </div>
  );
}