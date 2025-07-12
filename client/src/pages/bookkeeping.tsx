import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatPrice } from "@/lib/priceUtils";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Upload,
  FileText,
  Download,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Star,
  Plus,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Users,
  ArrowRight,
} from "lucide-react";

interface BookkeepingPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  documentsLimit: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

interface BookkeepingSubscription {
  id: number;
  planId: number;
  businessEntityId: string;
  status: string;
  billingCycle: 'monthly' | 'yearly';
  currentPrice: number;
  nextBillingDate: string;
  documentsProcessed: number;
  documentsLimit: number;
  planName: string;
  planDescription: string;
  businessEntityName: string;
}

interface BusinessEntity {
  id: string;
  name: string;
  entityType: string;
  state: string;
  status: string;
}

interface BookkeepingDocument {
  id: number;
  businessEntityId: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  processedDate: string | null;
  status: string;
  category: string;
}

export default function Bookkeeping() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Fetch business entities
  const { data: businessEntities, isLoading: businessLoading } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: isAuthenticated && !authLoading,
  });

  // Fetch bookkeeping plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/bookkeeping/plans"],
    enabled: true,
  });

  // Fetch bookkeeping subscriptions
  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["/api/bookkeeping/subscriptions"],
    enabled: isAuthenticated && !authLoading,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Fetch bookkeeping documents
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/bookkeeping/documents", selectedBusinessId],
    enabled: isAuthenticated && !authLoading && selectedBusinessId !== "",
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Auto-select business entity without active subscription when data loads
  useEffect(() => {
    if (businessEntities && subscriptions && businessEntities.length > 0 && !selectedBusinessId) {
      // Find a business entity without an active subscription
      const entityWithoutSubscription = businessEntities.find((entity: BusinessEntity) => 
        !subscriptions.some((sub: any) => 
          sub.businessEntityId === parseInt(entity.id) && sub.status === 'active'
        )
      );
      
      // Use entity without subscription, or fall back to first entity
      const defaultEntity = entityWithoutSubscription || businessEntities[0];
      setSelectedBusinessId(defaultEntity.id);
    }
  }, [businessEntities, subscriptions, selectedBusinessId]);



  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("POST", "/api/bookkeeping/upload", formData);
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Document uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookkeeping/documents", selectedBusinessId] });
    },
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
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (plan: BookkeepingPlan) => {
    if (!selectedBusinessId) {
      toast({
        title: "Business Required",
        description: "Please select a business entity first.",
        variant: "destructive",
      });
      return;
    }

    const selectedBusiness = businessEntities?.find(b => b.id === selectedBusinessId);
    if (!selectedBusiness) {
      toast({
        title: "Business Not Found",
        description: "Selected business entity not found.",
        variant: "destructive",
      });
      return;
    }

    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

    // Store checkout data in sessionStorage
    const checkoutData = {
      planId: plan.id.toString(),
      businessEntityId: selectedBusinessId.toString(), // Ensure it's a string
      billingCycle,
      planName: plan.name,
      businessName: selectedBusiness.name || `Business ${selectedBusiness.id}`,
      amount: price * 100 // Convert to cents
    };

    sessionStorage.setItem('bookkeeping-checkout-data', JSON.stringify(checkoutData));
    
    // Navigate to checkout page
    window.location.href = '/bookkeeping-checkout';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedBusinessId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("businessEntityId", selectedBusinessId);
    formData.append("category", "receipt");

    uploadMutation.mutate(formData);
  };

  const handleDocumentDownload = async (documentId: number) => {
    try {
      const response = await fetch(`/api/bookkeeping/documents/${documentId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${documentId}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document.",
        variant: "destructive",
      });
    }
  };

  const handleUpgradeSubscription = (subscriptionId: number) => {
    toast({
      title: "Upgrade Plan",
      description: "Redirecting to plan selection for upgrade...",
    });
    setActiveTab("plans");
  };

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingSubscriptionId, setCancellingSubscriptionId] = useState<number | null>(null);

  const handleCancelSubscription = (subscriptionId: number) => {
    setCancellingSubscriptionId(subscriptionId);
    setCancelModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (!cancellingSubscriptionId) return;

    try {
      const response = await apiRequest("POST", `/api/bookkeeping/subscriptions/${cancellingSubscriptionId}/cancel`, {
        cancellationType: "30-day-notice"
      });

      if (response.ok) {
        toast({
          title: "Cancellation Notice Submitted",
          description: "Your 30-day cancellation notice has been submitted. Service will end after the notice period.",
        });
        
        // Refresh subscriptions data
        queryClient.invalidateQueries({ queryKey: ["/api/bookkeeping/subscriptions"] });
      } else {
        throw new Error('Cancellation failed');
      }
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Unable to submit cancellation notice. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setCancelModalOpen(false);
      setCancellingSubscriptionId(null);
    }
  };

  if (authLoading || businessLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">Please log in to access bookkeeping services.</p>
              <Button onClick={() => window.location.href = "/login"}>
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-36 pb-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookkeeping Services</h1>
        <p className="text-gray-600">Manage your business bookkeeping and financial documents</p>
      </div>

      {/* Business Entity Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-green-500" />
            Select Business Entity
          </CardTitle>
          <CardDescription>
            Choose which business entity you want to manage bookkeeping for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a business entity" />
            </SelectTrigger>
            <SelectContent>
              {businessEntities?.map((entity: BusinessEntity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name} ({entity.entityType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your bookkeeping services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button 
                  onClick={() => setActiveTab("documents")}
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  disabled={!selectedBusinessId}
                >
                  <Upload className="h-6 w-6" />
                  Upload Documents
                </Button>
                <Button 
                  onClick={() => setActiveTab("plans")}
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                >
                  <Plus className="h-6 w-6" />
                  Subscribe to Plan
                </Button>
                <Button 
                  onClick={() => setActiveTab("subscriptions")}
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                >
                  <Receipt className="h-6 w-6" />
                  View Subscriptions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {!selectedBusinessId ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Please select a business entity to manage documents</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Document Management
                </CardTitle>
                <CardDescription>
                  Upload and manage receipts, invoices, and other business documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Important Notice</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Please refrain from uploading documents unless specifically requested by your bookkeeper. Thank you for your cooperation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    id="file-upload"
                    disabled={uploadMutation.isPending}
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">
                        {uploadMutation.isPending ? "Uploading..." : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF, JPG, PNG, DOC, XLS (max 10MB)
                      </p>
                    </div>
                  </Label>
                </div>

                {/* Documents List */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-green-500" />
                    <h4 className="font-medium">Uploaded Documents</h4>
                  </div>
                  
                  {documentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full" />
                    </div>
                  ) : !documents || documents.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc: BookkeepingDocument) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">{doc.originalFileName}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(doc.uploadDate).toLocaleDateString()} • {(doc.fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={doc.status === 'processed' ? 'default' : 'secondary'}>
                              {doc.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDocumentDownload(doc.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Available Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Introductory Section */}
          <div className="relative bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 mb-8 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-16 h-16 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
                <path d="M20 20 Q 50 10, 80 20 T 80 50 Q 70 80, 40 80 T 20 50 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="absolute top-8 right-8 w-20 h-20 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
                <circle cx="20" cy="20" r="3" fill="currentColor" />
                <circle cx="35" cy="15" r="2" fill="currentColor" />
                <circle cx="25" cy="35" r="2.5" fill="currentColor" />
                <circle cx="45" cy="25" r="2" fill="currentColor" />
                <circle cx="40" cy="40" r="3" fill="currentColor" />
                <circle cx="60" cy="30" r="2.5" fill="currentColor" />
                <circle cx="55" cy="50" r="2" fill="currentColor" />
                <circle cx="70" cy="45" r="3" fill="currentColor" />
                <circle cx="65" cy="65" r="2.5" fill="currentColor" />
                <circle cx="80" cy="60" r="2" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <p className="text-green-500 font-medium mb-4">Choose the plan that works for you</p>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Our accounting packages come as they are,{' '}
                <span className="text-green-500">no extra charges</span> — simple and straightforward. 
                If you pay <span className="text-green-500">upfront for the whole year, 2 months are free.</span>
              </h2>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                If for any reason, within 30 days of placing your bookkeeping order, if you are unsatisfied, you 
                may request a full refund including the setup fee.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
              <p className="text-gray-600">Select the perfect bookkeeping plan for your business</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Monthly</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              >
                {billingCycle === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
              </Button>
              <span className="text-sm">Yearly</span>
            </div>
          </div>

          {plansLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans
                ?.filter((plan: BookkeepingPlan) => plan.isActive)
                .sort((a: BookkeepingPlan, b: BookkeepingPlan) => a.monthlyPrice - b.monthlyPrice)
                .map((plan: BookkeepingPlan) => {
                  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
                  const isSubscribed = subscriptions?.some((sub: any) => 
                    sub.businessEntityId === parseInt(selectedBusinessId) && sub.status === 'active'
                  );
                  
                  const hasActiveSubscription = subscriptions?.some((sub: any) => 
                    sub.businessEntityId === parseInt(selectedBusinessId) && sub.status === 'active'
                  );
                  
                  const selectedBusiness = businessEntities?.find(b => b.id === selectedBusinessId);
                  
                  return (
                    <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-green-500 shadow-lg' : ''}`}>
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-green-500 text-white px-3 py-1">
                            <Star className="h-3 w-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="text-3xl font-bold text-green-500">
                          {formatPrice(price)}
                          <span className="text-lg font-normal text-gray-500">
                            /{billingCycle === 'yearly' ? 'year' : 'month'}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <p className="text-sm text-green-600">
                            Save {formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)} annually
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        {hasActiveSubscription && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                            <div className="font-medium text-blue-800 mb-1">Active Subscription</div>
                            <div className="text-blue-600">
                              {selectedBusiness?.name || 'This business entity'} is already subscribed to this bookkeeping plan. 
                              You can view the details in the "My Subscriptions" tab.
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          className="w-full" 
                          onClick={() => handleSubscribe(plan)}
                          disabled={hasActiveSubscription || !selectedBusinessId}
                          variant={plan.isPopular ? "default" : "outline"}
                        >
                          {hasActiveSubscription ? (
                            `${selectedBusiness?.name || 'Business'} Already Subscribed`
                          ) : !selectedBusinessId ? (
                            "Select Business First"
                          ) : (
                            `Subscribe for ${formatPrice(price)}`
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            {/* Payroll Services Card */}
            <div className="mt-8">
              <Card className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors">
                <CardContent className="p-6">
                  <Link href="/payroll" className="block group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#27884b] to-orange-600 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-500 transition-colors">
                            Looking for Payroll Services?
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Manage employee payroll, taxes, and compliance with our comprehensive payroll solutions
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
            </>
          )}
        </TabsContent>

        {/* My Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-500" />
                Active Subscriptions
              </CardTitle>
              <CardDescription>
                Manage your bookkeeping service subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full" />
                </div>
              ) : !subscriptions || subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No active subscriptions</p>
                  <Button onClick={() => setActiveTab("plans")}>
                    Browse Plans
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription: BookkeepingSubscription) => {
                    // Find the corresponding business entity
                    const businessEntity = businessEntities?.find((entity: BusinessEntity) => 
                      entity.id === subscription.businessEntityId
                    );
                    
                    return (
                      <div key={subscription.id} className="border rounded-lg p-6 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900">
                                {businessEntity?.name || subscription.businessEntityName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Business ID: {businessEntity?.id || subscription.businessEntityId}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={subscription.status === 'active' ? 'default' : 'secondary'}
                            className="bg-green-500 text-white border-green-500"
                          >
                            {subscription.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Cost</p>
                              <p className="font-medium">{formatPrice(subscription.currentPrice)}/{subscription.billingCycle === 'monthly' ? 'monthly' : 'yearly'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Next billing</p>
                              <p className="font-medium">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Documents used</p>
                              <p className="font-medium">{subscription.documentsProcessed}/{subscription.documentsLimit} documents used</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Sign up date: {businessEntity?.createdAt ? 
                                new Date(businessEntity.createdAt).toLocaleDateString() : 
                                'N/A'
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-transparent text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                              onClick={() => handleUpgradeSubscription(subscription.id)}
                            >
                              Upgrade Plan
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              onClick={() => handleCancelSubscription(subscription.id)}
                            >
                              30-Day Cancel Notice
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cancellation Warning Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Cancel Subscription
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  This action will submit a 30-day cancellation notice
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Are you sure you want to submit a 30-day cancellation notice? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Your service will continue for 30 days after notice submission</p>
              <p>• You will receive a confirmation email with the end date</p>
              <p>• No refunds will be processed for the notice period</p>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCancelModalOpen(false)}
              className="flex-1"
            >
              Keep Subscription
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancellation}
              className="flex-1"
            >
              Submit Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}