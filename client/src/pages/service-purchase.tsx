import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ShoppingCart, CreditCard, Check, ArrowLeft, AlertCircle, User, Building } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ServicePurchaseProps {
  serviceId?: string;
}

export default function ServicePurchase({ serviceId }: ServicePurchaseProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  // Redirect authenticated users to their dashboard with a helpful message
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      toast({
        title: "Already Logged In",
        description: "You can purchase services from your dashboard. Redirecting...",
      });
      setTimeout(() => {
        window.location.href = "/multi-business";
      }, 2000);
    }
  }, [isLoading, isAuthenticated, toast]);

  if (!isLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Redirecting to Dashboard</h3>
              <p className="text-gray-600">You're already logged in. Taking you to your business dashboard where you can purchase services.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState(serviceId || "");
  const [accountInfo, setAccountInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: ""
  });

  // Get query parameter for pre-selected service
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam === 'registered-agent') {
      // Find registered agent service ID
      setSelectedService("2"); // Assuming registered agent service has ID 2
    }
  }, []);

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const selectedServiceData = services?.find((service: any) => 
    service.id.toString() === selectedService
  );

  const getServicePrice = (service: any) => {
    if (service.oneTimePrice && service.oneTimePrice !== "0") {
      return `$${service.oneTimePrice}`;
    }
    if (service.recurringPrice && service.recurringPrice !== "0") {
      return `$${service.recurringPrice}/${service.recurringInterval}`;
    }
    return "Contact for pricing";
  };

  const purchaseMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/service-orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Submitted Successfully",
        description: "We'll contact you within 24 hours to process your request and arrange payment.",
      });
      // Reset form
      setSelectedService("");
      setAccountInfo({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setBusinessInfo({
        businessName: "",
        contactName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        notes: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast({
        title: "Service Required",
        description: "Please select a service to purchase.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!accountInfo.firstName || !accountInfo.lastName || !accountInfo.email || 
        !accountInfo.password || !businessInfo.businessName) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate password confirmation
    if (accountInfo.password !== accountInfo.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      serviceId: parseInt(selectedService),
      orderType: "standalone",
      totalAmount: selectedServiceData?.oneTimePrice || selectedServiceData?.recurringPrice || 0,
      customerInfo: {
        ...accountInfo,
        ...businessInfo,
      },
    };

    purchaseMutation.mutate(orderData);
  };

  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Business Service</h1>
          <p className="text-gray-600 mt-2">
            Create your account and order professional business services
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account Creation & Service Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Create Your Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={accountInfo.firstName}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={accountInfo.lastName}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountInfo.email}
                    onChange={(e) => setAccountInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={accountInfo.password}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={accountInfo.confirmPassword}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Select Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="service">Choose Service *</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((service: any) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name} - {getServicePrice(service)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, businessName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={businessInfo.contactName}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, contactName: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={businessInfo.city}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={businessInfo.state}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={businessInfo.zipCode}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={businessInfo.notes}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any specific requirements or questions..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedServiceData ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{selectedServiceData.name}</h4>
                      <p className="text-sm text-gray-600">{selectedServiceData.description}</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-green-500">{getServicePrice(selectedServiceData)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Professional service delivery
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        24-48 hour processing
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Email updates & tracking
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Account creation included
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedService || purchaseMutation.isPending}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      {purchaseMutation.isPending ? "Processing..." : "Create Account & Place Order"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By placing this order, you agree to our terms of service.
                      We'll contact you to arrange payment and begin processing.
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Select a service to see order details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}