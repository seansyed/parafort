import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import ClientNavigation from "@/components/client-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SEO, structuredDataTemplates } from "@/components/SEO";
import { 
  Building,
  Building2, 
  Search, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  Mail, 
  Calculator,
  Scale,
  Users,
  Briefcase,
  Star,
  ArrowRight,
  Save,
  Plus
} from "lucide-react";

interface BusinessInfo {
  id?: number;
  name: string;
  entityType: string;
  state: string;
  ein: string;
}

const getCategoryIcon = (category: string, isSelected: boolean = false, isIncluded: boolean = false, serviceId?: number) => {
  const iconClass = `h-5 w-5 ${
    isIncluded 
      ? 'text-yellow-600' 
      : 'text-white'
  }`;
  

  
  // Special handling for EIN service (ID 17) which has empty category
  if (serviceId === 17) {
    return <Calculator className={iconClass} />;
  }
  
  switch (category?.toLowerCase()) {
    case 'tax':
      return <Calculator className={iconClass} />;
    case 'compliance':
      return <Shield className={iconClass} />;
    case 'business licenses':
      return <Shield className={iconClass} />;
    case 'mail':
      return <Mail className={iconClass} />;
    case 'legal':
      return <Scale className={iconClass} />;
    case 'corporate':
      return <Briefcase className={iconClass} />;
    case 'governance':
      return <Users className={iconClass} />;
    case 'formation':
      return <Briefcase className={iconClass} />;
    case 'business services':
      return <Briefcase className={iconClass} />;
    case 'bookkeeping':
      return <Calculator className={iconClass} />;
    case 'accounting':
      return <Calculator className={iconClass} />;
    case 'payroll':
      return <Users className={iconClass} />;
    case 'ein':
      return <Calculator className={iconClass} />;
    case 'documents':
      return <FileText className={iconClass} />;
    case 'filing':
      return <FileText className={iconClass} />;
    case 'business management':
      return <Briefcase className={iconClass} />;
    case 'business formation':
      return <Briefcase className={iconClass} />;
    case '':
    case null:
    case undefined:
      return <FileText className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};

export default function ServicesMarketplace() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    entityType: "",
    state: "",
    ein: ""
  });
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [showNewBusinessForm, setShowNewBusinessForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedServices, setSelectedServices] = useState<Set<number>>(new Set());
  const [isSavingBusinessInfo, setIsSavingBusinessInfo] = useState(false);

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
    enabled: isAuthenticated
  });

  const { data: businesses, isLoading: businessesLoading } = useQuery({
    queryKey: ["/api/business-entities-with-subscriptions"],
    enabled: isAuthenticated
  });

  const saveBusinessInfoMutation = useMutation({
    mutationFn: async (data: BusinessInfo) => {
      return apiRequest("POST", "/api/business-entities", data);
    },
    onSuccess: () => {
      toast({
        title: "Business Information Saved",
        description: "Your business information has been successfully saved!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities"] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save business information",
        variant: "destructive",
      });
    },
  });

  const handleSaveBusinessInfo = async () => {
    if (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSavingBusinessInfo(true);
    try {
      await saveBusinessInfoMutation.mutateAsync(businessInfo);
    } finally {
      setIsSavingBusinessInfo(false);
    }
  };



  // Get selected business subscription info
  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId || !businesses) return null;
    return businesses.find((b: any) => b.id === selectedBusinessId);
  }, [selectedBusinessId, businesses]);

  // Check if service is included in Gold Plan
  const isServiceIncludedInPlan = (serviceId: number) => {
    if (!selectedBusiness?.subscriptionPlan) return false;
    
    // Check if the business has Gold Plan (assuming Gold Plan has ID 3 or name "Gold")
    const hasGoldPlan = selectedBusiness.subscriptionPlan?.name === "Gold" || 
                       selectedBusiness.subscriptionPlan?.id === 3;
    
    if (!hasGoldPlan) return false;
    
    // These are the services typically included in Gold Plan
    // Service ID 17 is the EIN service with empty category that should be grayed out
    const goldPlanServices = [5, 6, 17, 10, 11, 9, 16, 30]; // Annual Report, Operating Agreement, EIN Service (ID 17), S-Corp Election, BOIR Filing, Legal Documents, Business Formation, Documents
    
    return goldPlanServices.includes(serviceId);
  };

  const filteredServices = useMemo(() => {
    if (!services) return [];
    
    return services.filter((service: any) => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, categoryFilter]);

  const totalCost = useMemo(() => {
    if (!services) return 0;
    return Array.from(selectedServices).reduce((total, serviceId) => {
      const service = services.find((s: any) => s.id === serviceId);
      if (!service) return total;
      
      // Use oneTimePrice if available, otherwise use recurringPrice
      const price = service.oneTimePrice 
        ? Number(service.oneTimePrice) 
        : service.recurringPrice 
          ? Number(service.recurringPrice) 
          : 0;
      
      return total + price;
    }, 0);
  }, [selectedServices, services]);

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const servicePurchaseMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/service-orders", orderData);
      return await response.json();
    },
    onSuccess: (response: any) => {
      console.log("Service order response:", response);
      
      // Clear selections first
      setSelectedServices(new Set());
      setSelectedBusinessId(null);
      setShowNewBusinessForm(false);
      setBusinessInfo({ name: '', entityType: '', state: '', ein: '' });
      
      // Check if payment is required
      if (response?.requiresPayment && response?.clientSecret) {
        // Redirect to checkout page with payment intent
        setLocation(`/checkout?clientSecret=${response.clientSecret}&orderId=${response.orderId}&type=service`);
      } else if (response?.orderId) {
        // Free service - redirect directly to confirmation
        toast({
          title: "Order Submitted Successfully",
          description: "Your service order has been created. Check your email for confirmation.",
        });
        setLocation(`/service-order-confirmation?orderId=${response.orderId}`);
      } else if (response?.redirectTo) {
        setLocation(response.redirectTo);
      } else {
        console.log("No redirect info found in response:", response);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = async () => {
    if (selectedServices.size === 0) {
      toast({
        title: "No Services Selected",
        description: "Please select at least one service to purchase.",
        variant: "destructive",
      });
      return;
    }

    const selectedBusiness = selectedBusinessId 
      ? businesses?.find((b: any) => b.id === selectedBusinessId)
      : null;

    if (!selectedBusiness && !showNewBusinessForm) {
      toast({
        title: "No Business Selected",
        description: "Please select a business or create a new one.",
        variant: "destructive",
      });
      return;
    }

    if (showNewBusinessForm && (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein)) {
      toast({
        title: "Missing Information",
        description: "Please complete all required business information fields.",
        variant: "destructive",
      });
      return;
    }

    // Save new business if needed
    if (showNewBusinessForm && !selectedBusinessId) {
      try {
        setIsSavingBusinessInfo(true);
        await saveBusinessInfoMutation.mutateAsync(businessInfo);
        // Get the newly created business
        const updatedBusinesses = await queryClient.fetchQuery({ queryKey: ["/api/business-entities"] });
        const newBusiness = updatedBusinesses?.find((b: any) => b.name === businessInfo.name);
        if (newBusiness) {
          setSelectedBusinessId(newBusiness.id);
        }
      } catch (error) {
        setIsSavingBusinessInfo(false);
        return;
      } finally {
        setIsSavingBusinessInfo(false);
      }
    }

    // Create service order
    const orderData = {
      serviceIds: Array.from(selectedServices),
      businessEntityId: selectedBusinessId?.toString(),
      customerInfo: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        companyName: selectedBusiness?.name || businessInfo.name,
        address: '',
        city: '',
        state: selectedBusiness?.state || businessInfo.state,
        zipCode: ''
      }
    };

    servicePurchaseMutation.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-500/10 rounded-full w-fit">
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Access Required</CardTitle>
            <CardDescription className="text-base">
              Please log in to access the services marketplace and purchase business services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg font-semibold text-white font-semibold" 
              onClick={() => window.location.href = "/login"}
            >
              Log In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Business Services Marketplace - ParaFort | Comprehensive Business Solutions"
        description="Explore our comprehensive business services marketplace with LLC formation, bookkeeping, payroll, registered agent services, and more. All your business needs in one place."
        keywords="business services, LLC formation, bookkeeping services, payroll services, registered agent, business compliance, EIN application, annual reports, business marketplace"
        canonicalUrl="https://parafort.com/services-marketplace"
        structuredData={[
          structuredDataTemplates.service(
            "Business Services Marketplace",
            "Starting at $149",
            "Comprehensive business services including formation, compliance, bookkeeping, and more."
          )
        ]}
      />
      <ClientNavigation />
      <div className="min-h-screen bg-gray-50 pt-36">
        <div className="p-4 space-y-4">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-500 rounded-xl mr-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Services Marketplace</h1>
                <p className="text-lg text-gray-600 mt-2">
                  Professional business services for existing companies. No formation required - 
                  purchase exactly what you need, when you need it.
                </p>
              </div>
            </div>
            <div className="flex items-center mt-6 space-x-6 text-gray-600">
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-green-500" />
                <span>Professional Services</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                <span>Secure & Compliant</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-500" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
          {/* No Business Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-blue-900">Don't have a business yet?</h3>
                <p className="mt-1 text-blue-700">
                  Start a new business with our streamlined formation process. Get your LLC or Corporation set up quickly and compliantly.
                </p>
                <div className="mt-4">
                  <Link href="/formation-workflow">
                    <button 
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 24px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#059669';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#10b981';
                      }}
                    >
                      Start New Business Formation
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Business Selection Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-12">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-500 rounded-lg mr-4">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Business</h2>
                  <p className="text-gray-600">Choose which business to purchase services for</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {businessesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
                  <span className="ml-3 text-gray-600">Loading your businesses...</span>
                </div>
              ) : businesses && businesses.length > 0 ? (
                <div className="space-y-6">
                  {/* Business Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      Select from your existing businesses
                    </Label>
                    <Select 
                      value={selectedBusinessId?.toString() || ""} 
                      onValueChange={(value) => {
                        setSelectedBusinessId(value ? parseInt(value) : null);
                        setShowNewBusinessForm(false);
                      }}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Choose a business" />
                      </SelectTrigger>
                      <SelectContent>
                        {businesses?.filter(business => business.id).map((business: any) => (
                          <SelectItem key={business.id} value={business.id.toString()}>
                            {business.name} ({business.entityType}) - {business.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-gray-500 font-medium">OR</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  {/* Add New Business Option */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewBusinessForm(!showNewBusinessForm);
                        setSelectedBusinessId(null);
                      }}
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '6px',
                        border: '1px solid #10b981',
                        backgroundColor: 'transparent',
                        color: '#10b981',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#10b98108';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      {showNewBusinessForm ? "Cancel" : "Add New Business"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
                  <p className="text-gray-600 mb-6">You need to add a business to purchase services</p>
                  <button
                    onClick={() => setShowNewBusinessForm(true)}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '8px 24px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#10b981';
                    }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Business
                  </button>
                </div>
              )}

              {/* New Business Form */}
              {showNewBusinessForm && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Business</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="businessName" className="text-sm font-semibold text-gray-700">
                        Business Name *
                      </Label>
                      <Input
                        id="businessName"
                        value={businessInfo.name}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your Business LLC"
                        className="h-12 text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="entityType" className="text-sm font-semibold text-gray-700">
                        Entity Type *
                      </Label>
                      <Select value={businessInfo.entityType} onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, entityType: value }))}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select entity type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LLC">LLC</SelectItem>
                          <SelectItem value="Corporation">Corporation</SelectItem>
                          <SelectItem value="Professional Corporation">Professional Corporation</SelectItem>
                          <SelectItem value="Non-Profit Corporation">Non-Profit Corporation</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
                        State *
                      </Label>
                      <Select value={businessInfo.state} onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, state: value }))}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alabama">Alabama</SelectItem>
                          <SelectItem value="Alaska">Alaska</SelectItem>
                          <SelectItem value="Arizona">Arizona</SelectItem>
                          <SelectItem value="Arkansas">Arkansas</SelectItem>
                          <SelectItem value="California">California</SelectItem>
                          <SelectItem value="Colorado">Colorado</SelectItem>
                          <SelectItem value="Connecticut">Connecticut</SelectItem>
                          <SelectItem value="Delaware">Delaware</SelectItem>
                          <SelectItem value="Florida">Florida</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Hawaii">Hawaii</SelectItem>
                          <SelectItem value="Idaho">Idaho</SelectItem>
                          <SelectItem value="Illinois">Illinois</SelectItem>
                          <SelectItem value="Indiana">Indiana</SelectItem>
                          <SelectItem value="Iowa">Iowa</SelectItem>
                          <SelectItem value="Kansas">Kansas</SelectItem>
                          <SelectItem value="Kentucky">Kentucky</SelectItem>
                          <SelectItem value="Louisiana">Louisiana</SelectItem>
                          <SelectItem value="Maine">Maine</SelectItem>
                          <SelectItem value="Maryland">Maryland</SelectItem>
                          <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                          <SelectItem value="Michigan">Michigan</SelectItem>
                          <SelectItem value="Minnesota">Minnesota</SelectItem>
                          <SelectItem value="Mississippi">Mississippi</SelectItem>
                          <SelectItem value="Missouri">Missouri</SelectItem>
                          <SelectItem value="Montana">Montana</SelectItem>
                          <SelectItem value="Nebraska">Nebraska</SelectItem>
                          <SelectItem value="Nevada">Nevada</SelectItem>
                          <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                          <SelectItem value="New Jersey">New Jersey</SelectItem>
                          <SelectItem value="New Mexico">New Mexico</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="North Carolina">North Carolina</SelectItem>
                          <SelectItem value="North Dakota">North Dakota</SelectItem>
                          <SelectItem value="Ohio">Ohio</SelectItem>
                          <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                          <SelectItem value="Oregon">Oregon</SelectItem>
                          <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                          <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                          <SelectItem value="South Carolina">South Carolina</SelectItem>
                          <SelectItem value="South Dakota">South Dakota</SelectItem>
                          <SelectItem value="Tennessee">Tennessee</SelectItem>
                          <SelectItem value="Texas">Texas</SelectItem>
                          <SelectItem value="Utah">Utah</SelectItem>
                          <SelectItem value="Vermont">Vermont</SelectItem>
                          <SelectItem value="Virginia">Virginia</SelectItem>
                          <SelectItem value="Washington">Washington</SelectItem>
                          <SelectItem value="West Virginia">West Virginia</SelectItem>
                          <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                          <SelectItem value="Wyoming">Wyoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="ein" className="text-sm font-semibold text-gray-700">
                        EIN *
                      </Label>
                      <Input
                        id="ein"
                        value={businessInfo.ein}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, ein: e.target.value }))}
                        placeholder="12-3456789"
                        className="h-12 text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Save Business Information Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveBusinessInfo}
                        disabled={!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein || isSavingBusinessInfo}
                        style={{
                          backgroundColor: (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein || isSavingBusinessInfo) ? '#9ca3af' : '#10b981',
                          color: 'white',
                          padding: '12px 32px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein || isSavingBusinessInfo) ? 'not-allowed' : 'pointer',
                          fontSize: '18px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s',
                          opacity: (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein || isSavingBusinessInfo) ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!(!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein || isSavingBusinessInfo)) {
                            e.target.style.backgroundColor = '#059669';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!(!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein || isSavingBusinessInfo)) {
                            e.target.style.backgroundColor = '#10b981';
                          }
                        }}
                      >
                        {isSavingBusinessInfo ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Business Information
                          </>
                        )}
                      </button>
                    </div>
                    {(!businessInfo.name || !businessInfo.entityType || !businessInfo.state) && (
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Complete business information to continue
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 text-lg border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-64 h-14 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(services?.map((service: any) => service.category)))
                  .filter(category => category && category.trim() !== "")
                  .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredServices.map((service: any) => {
              const isIncludedInPlan = isServiceIncludedInPlan(service.id);
              
              return (
                <div 
                  key={service.id} 
                  className={`service-card-animated card-business-interactive rounded-2xl border-2 cursor-pointer group relative ${
                    isIncludedInPlan 
                      ? 'bg-gray-50 border-gray-300 opacity-75' 
                      : selectedServices.has(service.id) 
                        ? 'bg-white border-green-500 shadow-xl ring-4 ring-green-500/20 scale-105' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => !isIncludedInPlan && toggleService(service.id)}
                >
                  {isIncludedInPlan && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      Included
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl transition-all ${
                          isIncludedInPlan 
                            ? 'bg-yellow-100' 
                            : selectedServices.has(service.id) 
                              ? 'bg-green-500' 
                              : 'bg-green-500'
                        }`}>
                          {getCategoryIcon(service.category, selectedServices.has(service.id) && !isIncludedInPlan, isIncludedInPlan, service.id)}
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold mb-2 ${isIncludedInPlan ? 'text-gray-600' : 'text-gray-900'}`}>
                            {service.name}
                          </h3>
                          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                            isIncludedInPlan 
                              ? 'text-gray-500 bg-gray-200' 
                              : 'text-gray-500 bg-gray-100'
                          }`}>
                            {service.category || 'Tax'}
                          </span>
                        </div>
                      </div>
                      {selectedServices.has(service.id) && !isIncludedInPlan && (
                        <CheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  
                  <p className="text-gray-600 text-base mb-8 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {isIncludedInPlan ? (
                        // Service included in plan
                        <div className="text-3xl font-bold text-yellow-600">
                          Included
                        </div>
                      ) : service.oneTimePrice && !service.recurringPrice ? (
                        // One-time service
                        <div className={`text-3xl font-bold ${isIncludedInPlan ? 'text-gray-500' : 'text-gray-900'}`}>
                          ${Number(service.oneTimePrice).toFixed(2)}
                        </div>
                      ) : service.recurringPrice && !service.oneTimePrice ? (
                        // Recurring-only service
                        <div className={`text-3xl font-bold ${isIncludedInPlan ? 'text-gray-500' : 'text-gray-900'}`}>
                          ${Number(service.recurringPrice).toFixed(2)}/{service.recurringInterval || 'month'}
                        </div>
                      ) : service.oneTimePrice && service.recurringPrice ? (
                        // Both one-time and recurring
                        <div>
                          <div className={`text-3xl font-bold ${isIncludedInPlan ? 'text-gray-500' : 'text-gray-900'}`}>
                            ${Number(service.oneTimePrice).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            + ${Number(service.recurringPrice).toFixed(2)}/{service.recurringInterval || 'month'}
                          </div>
                        </div>
                      ) : (
                        // Free service
                        <div className={`text-3xl font-bold ${isIncludedInPlan ? 'text-gray-500' : 'text-gray-900'}`}>
                          Free
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      <Clock className="h-4 w-4" />
                      <span>
                        {service.recurringPrice && !service.oneTimePrice 
                          ? service.recurringInterval || 'monthly'
                          : 'One-time'
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Individual Buy Now Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isIncludedInPlan) {
                        toast({
                          title: "Service Already Included",
                          description: "This service is already included in your Gold Plan subscription.",
                          variant: "default",
                        });
                        return;
                      }
                      if (!selectedBusinessId && (!businesses || businesses.length === 0)) {
                        toast({
                          title: "Business Required",
                          description: "Please select or add a business first to purchase services.",
                          variant: "destructive",
                        });
                        return;
                      }
                      const businessId = selectedBusinessId || (businesses && businesses.length > 0 ? businesses[0].id : null);
                      if (businessId) {
                        setLocation(`/multi-step-checkout/${service.id}`);
                      }
                    }}
                    disabled={isIncludedInPlan}
                    style={{
                      width: '100%',
                      backgroundColor: isIncludedInPlan ? '#9ca3af' : '#10b981',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: isIncludedInPlan ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isIncludedInPlan) {
                        e.target.style.backgroundColor = '#059669';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isIncludedInPlan) {
                        e.target.style.backgroundColor = '#10b981';
                      }
                    }}
                  >
                    {isIncludedInPlan ? 'Already Included' : 'Buy Now'}
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          {/* Floating Cart Summary */}
          {selectedServices.size > 0 && (
            <div className="fixed bottom-8 right-8 left-72 max-w-lg ml-auto z-50">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#27884b] to-[#FF7A00] text-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl">Order Summary</h3>
                    <div className="flex items-center gap-3">
                      <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                        {selectedServices.size} item{selectedServices.size > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setSelectedServices(new Set())}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                        title="Close cart"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6 max-h-40 overflow-y-auto">
                    {Array.from(selectedServices).map((serviceId) => {
                      const service = services?.find((s: any) => s.id === serviceId);
                      if (!service) return null;
                      
                      const price = service.oneTimePrice 
                        ? Number(service.oneTimePrice) 
                        : service.recurringPrice 
                          ? Number(service.recurringPrice) 
                          : 0;
                      
                      return (
                        <div key={serviceId} className="flex justify-between items-center group">
                          <span className="text-gray-700 truncate pr-3 font-medium flex-1">{service.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">${price.toFixed(2)}</span>
                            <button
                              onClick={() => toggleService(serviceId)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                opacity: 0.7
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.opacity = '1';
                                e.target.style.backgroundColor = '#dc2626';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.opacity = '0.7';
                                e.target.style.backgroundColor = '#ef4444';
                              }}
                              title="Remove from cart"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-900">Total</span>
                      <span className="text-3xl font-bold text-green-500">
                        ${totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePurchase}
                    disabled={selectedServices.size === 0 || (!selectedBusinessId && (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein)) || servicePurchaseMutation.isPending || isSavingBusinessInfo}
                    style={{
                      width: '100%',
                      backgroundColor: (selectedServices.size === 0 || (!selectedBusinessId && (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein)) || servicePurchaseMutation.isPending || isSavingBusinessInfo) ? '#9ca3af' : '#10b981',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '16px',
                      height: '56px',
                      borderRadius: '12px',
                      fontSize: '18px',
                      border: 'none',
                      cursor: (selectedServices.size === 0 || (!selectedBusinessId && (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein)) || servicePurchaseMutation.isPending || isSavingBusinessInfo) ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!(selectedServices.size === 0 || (!selectedBusinessId && (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein)) || servicePurchaseMutation.isPending || isSavingBusinessInfo)) {
                        e.target.style.backgroundColor = '#059669';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(selectedServices.size === 0 || (!selectedBusinessId && (!businessInfo.name || !businessInfo.entityType || !businessInfo.state || !businessInfo.ein)) || servicePurchaseMutation.isPending || isSavingBusinessInfo)) {
                        e.target.style.backgroundColor = '#10b981';
                      }
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {servicePurchaseMutation.isPending || isSavingBusinessInfo ? (
                        <>
                          <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3" />
                          {isSavingBusinessInfo ? "Saving Business..." : "Creating Order..."}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-6 w-6 mr-3" />
                          Purchase Services
                          <ArrowRight className="h-6 w-6 ml-3" />
                        </>
                      )}
                    </div>
                  </button>
                  
                  {(!selectedBusinessId && (!businessInfo.name || !businessInfo.entityType || !businessInfo.state)) && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      {businesses && businesses.length > 0 
                        ? "Select a business or complete new business information to continue"
                        : "Complete business information to continue"
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}