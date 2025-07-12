import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";


import { 
  Mail, 
  MapPin, 
  Settings, 
  Bell, 
  FileText, 
  Truck, 
  Shield, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Forward,
  Trash2,
  CreditCard,
  Archive,
  Search,
  Download,
  ExternalLink,
  Zap,
  Building,
  Star
} from "lucide-react";

export default function DigitalMailbox() {
  const { id } = useParams();
  const entityId = parseInt(id || "0");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedMail, setSelectedMail] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [forwardingAddress, setForwardingAddress] = useState("");
  
  // Settings state
  const [settings, setSettings] = useState({
    scanning: {
      autoScan: true,
      ocrProcessing: true,
      autoCategorize: true,
      crossModule: true
    },
    notifications: {
      emailNotifications: true,
      urgentOnly: false,
      webhookNotifications: false
    },
    retentionPeriod: 1095,
    defaultForwardingAddress: ""
  });

  // Fetch mailbox dashboard
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/mailbox/${entityId}/dashboard`],
    enabled: !!entityId,
  });

  // Fetch available addresses
  const { data: availableAddresses } = useQuery({
    queryKey: ["/api/mailbox/addresses"],
  });

  // Fetch mailbox plans
  const { data: mailboxPlans } = useQuery({
    queryKey: ["/api/mailbox-plans"],
  });

  // Fetch business entity information
  const { data: businessEntity } = useQuery({
    queryKey: [`/api/business-entities/${entityId}`],
    enabled: !!entityId,
  });

  // Check for existing business subscription
  const { data: businessSubscription } = useQuery({
    queryKey: [`/api/business/${entityId}/mailbox-subscription`],
    enabled: !!entityId,
  });

  // Create mailbox subscription
  const createSubscription = useMutation({
    mutationFn: async (planData: { planId: number, planName: string, monthlyPrice: number }) => {
      return apiRequest("POST", `/api/business/${entityId}/mailbox-subscription`, { 
        planId: planData.planId
      });
    },
    onSuccess: () => {
      toast({
        title: "Subscription Created",
        description: "Your digital mailbox subscription has been set up successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/business/${entityId}/mailbox-subscription`] });
      queryClient.invalidateQueries({ queryKey: [`/api/mailbox/${entityId}/dashboard`] });
      queryClient.invalidateQueries({ queryKey: [`/api/mailbox-plans`] });
      setActiveTab("overview");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to create mailbox subscription.",
        variant: "destructive",
      });
    },
  });

  // Request mail action
  const requestAction = useMutation({
    mutationFn: async (data: { mailId: number, action: string, details?: any }) => {
      return apiRequest("POST", `/api/mailbox/mail/${data.mailId}/action`, {
        actionType: data.action,
        actionDetails: data.details,
        createdBy: "user"
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Action Requested",
        description: `Your ${variables.action} request has been submitted and will be processed shortly.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/mailbox/${entityId}/dashboard`] });
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to request mail action.",
        variant: "destructive",
      });
    },
  });

  // Mark mail as read
  const markAsRead = useMutation({
    mutationFn: async (mailId: number) => {
      return apiRequest("PUT", `/api/mailbox/mail/${mailId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/mailbox/${entityId}/dashboard`] });
    },
  });

  // Simulate new mail
  const simulateMail = useMutation({
    mutationFn: async () => {
      if (!dashboardData?.subscription) {
        throw new Error("No active subscription found");
      }
      return apiRequest("POST", `/api/mailbox/${dashboardData.subscription.id}/simulate-mail`, {});
    },
    onSuccess: () => {
      toast({
        title: "New Mail Received",
        description: "A new mail item has been added to your mailbox for demonstration.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/mailbox/${entityId}/dashboard`] });
    },
    onError: (error: any) => {
      toast({
        title: "Simulation Failed",
        description: error.message || "Failed to simulate mail receipt.",
        variant: "destructive",
      });
    },
  });

  // Update settings
  const updateSettings = useMutation({
    mutationFn: async (settingsData: any) => {
      if (!dashboardData?.subscription) {
        throw new Error("No active subscription found");
      }
      return apiRequest("PUT", `/api/mailbox/${dashboardData.subscription.id}/settings`, settingsData);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your mailbox settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/mailbox/${entityId}/dashboard`] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  // Handle toggle changes
  const handleToggleChange = (category: 'scanning' | 'notifications', field: string, checked: boolean) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [field]: checked
      }
    };
    setSettings(newSettings);
    
    // Auto-save on toggle change
    updateSettings.mutate(newSettings);
  };

  const getMailStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-green-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMailCategoryIcon = (category: string) => {
    switch (category) {
      case 'tax': return <FileText className="w-4 h-4 text-red-600" />;
      case 'legal': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'business': return <Building className="w-4 h-4 text-blue-600" />;
      default: return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-36 pb-8 px-8">
        <div className="bg-white border-b rounded-lg mb-6">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Digital Mailbox Services</h1>
                  <p className="text-gray-600 mt-2">
                    Professional business address with intelligent mail management and OCR processing
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {dashboardData?.subscription && (
                    <Button
                      onClick={() => simulateMail.mutate()}
                      disabled={simulateMail.isPending}
                      variant="outline"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Simulate New Mail
                    </Button>
                  )}
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Secure & Encrypted</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="addresses">Mailboxes</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Active Subscription Info */}
            {businessSubscription ? (
              <Card className="border-green-500 bg-gradient-to-r from-green-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Active Mailbox Plan
                  </CardTitle>
                  <CardDescription>
                    {businessEntity ? (
                      <>Digital mailbox subscription for <strong>{businessEntity.name}</strong> (Business ID: {entityId})</>
                    ) : (
                      <>Digital mailbox subscription for Business ID: {entityId}</>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Plan Details</Label>
                      <p className="text-lg font-semibold">
                        {businessSubscription.plan?.displayName}
                      </p>
                      <p className="text-gray-600">
                        ${businessSubscription.plan?.monthlyPrice}/month
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                          {businessSubscription.subscription?.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Started: {new Date(businessSubscription.subscription?.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button onClick={() => setActiveTab("analytics")} className="bg-green-500 hover:bg-green-600">
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to Digital Mailbox Services</CardTitle>
                  <CardDescription>
                    Get a professional business address and never miss important mail again.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3 mb-6">
                    <div className="text-center p-4">
                      <MapPin className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Professional Address</h3>
                      <p className="text-sm text-gray-600">Premium business addresses in major cities</p>
                    </div>
                    <div className="text-center p-4">
                      <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Smart Scanning</h3>
                      <p className="text-sm text-gray-600">OCR-powered mail digitization and data extraction</p>
                    </div>
                    <div className="text-center p-4">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Secure Storage</h3>
                      <p className="text-sm text-gray-600">Encrypted digital archive with cross-module integration</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button onClick={() => setActiveTab("addresses")} className="bg-green-500 hover:bg-green-600">
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Virtual Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Digital Mailbox Plan</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the perfect mailbox plan for your business needs. All plans include professional business addresses, 
                mail scanning, and secure storage.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mailboxPlans?.map((plan: any) => {
                const isCurrentPlan = businessSubscription && businessSubscription.subscription.planId === plan.id;
                const currentPlanPrice = businessSubscription ? parseFloat(mailboxPlans?.find((p: any) => p.id === businessSubscription.subscription.planId)?.monthlyPrice || '0') : 0;
                const planPrice = parseFloat(plan.monthlyPrice);
                const isDowngrade = businessSubscription && planPrice < currentPlanPrice;
                return (
                <Card 
                  key={plan.id} 
                  className={`relative cursor-pointer transition-all hover:shadow-lg ${
                    plan.isMostPopular ? 'ring-2 ring-green-500 border-green-500' : 'hover:border-gray-300'
                  }`}
                >
                  {plan.isMostPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold">{plan.displayName}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Business Addresses</span>
                        <span className="font-semibold">{plan.businessAddresses}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mail Items/Month</span>
                        <span className="font-semibold">{plan.mailItemsPerMonth}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Extra Item Cost</span>
                        <span className="font-semibold">${plan.costPerExtraItem}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Shipping Cost</span>
                        <span className="font-semibold">${plan.shippingCost}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Check Deposits</span>
                        <span className="font-semibold">${plan.checkDepositFee}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Checks Included</span>
                        <span className="font-semibold">{plan.checksIncluded}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm mb-2">Included Features:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">Professional business address</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">Mail scanning & digitization</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">Package receiving</span>
                        </div>
                        {plan.secureShredding && (
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">Secure shredding</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">Mobile app access</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">Email notifications</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardContent className="pt-0">
                    <Button 
                      className={`w-full ${
                        plan.isMostPopular 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                      onClick={() => {
                        // Check if user already has a subscription
                        if (businessSubscription) {
                          toast({
                            title: "Subscription Active",
                            description: "You already have an active mailbox subscription. Please manage your current plan in the settings.",
                            variant: "default",
                          });
                          setActiveTab("settings");
                          return;
                        }
                        
                        // Create new subscription
                        createSubscription.mutate({
                          planId: plan.id,
                          planName: plan.name,
                          monthlyPrice: plan.monthlyPrice
                        });
                      }}
                      disabled={createSubscription.isPending || isCurrentPlan || isDowngrade}
                    >
                      {createSubscription.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Setting up...
                        </div>
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : isDowngrade ? (
                        "Upgrade Only"
                      ) : (
                        "Select Plan"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
              })}
            </div>

            {!mailboxPlans || mailboxPlans.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Plans Loading</h3>
                  <p className="text-gray-600">
                    We're loading available mailbox plans for you...
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="border-l-4 border-l-[#27884b] bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Why Choose Our Digital Mailbox?</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Professional business address in prime locations</li>
                      <li>• Advanced OCR technology for document processing</li>
                      <li>• Integration with your business formation services</li>
                      <li>• Secure, encrypted storage and transmission</li>
                      <li>• Real-time notifications and mobile access</li>
                      <li>• Compliance with privacy and business regulations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mailbox Settings</CardTitle>
                <CardDescription>
                  Configure your mail handling preferences and notification settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Scanning Preferences</Label>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-scan">Auto-scan incoming mail</Label>
                        <p className="text-sm text-gray-500">Automatically scan and digitize all incoming mail</p>
                      </div>
                      <Switch 
                        id="auto-scan" 
                        checked={settings.scanning.autoScan}
                        onCheckedChange={(checked) => handleToggleChange('scanning', 'autoScan', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="ocr-processing">OCR Processing</Label>
                        <p className="text-sm text-gray-500">Extract text and data from scanned documents using Mindee API</p>
                      </div>
                      <Switch 
                        id="ocr-processing" 
                        checked={settings.scanning.ocrProcessing}
                        onCheckedChange={(checked) => handleToggleChange('scanning', 'ocrProcessing', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-categorize">Auto-categorize mail</Label>
                        <p className="text-sm text-gray-500">Automatically categorize mail by type and importance</p>
                      </div>
                      <Switch 
                        id="auto-categorize" 
                        checked={settings.scanning.autoCategorize}
                        onCheckedChange={(checked) => handleToggleChange('scanning', 'autoCategorize', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="cross-module">Cross-module integration</Label>
                        <p className="text-sm text-gray-500">Link mail content to relevant ParaFort modules</p>
                      </div>
                      <Switch 
                        id="cross-module" 
                        checked={settings.scanning.crossModule}
                        onCheckedChange={(checked) => handleToggleChange('scanning', 'crossModule', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Notification Settings</Label>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email notifications</Label>
                        <p className="text-sm text-gray-500">Receive email alerts for new mail</p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => handleToggleChange('notifications', 'emailNotifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="urgent-only">Urgent mail only</Label>
                        <p className="text-sm text-gray-500">Only notify for high-priority mail</p>
                      </div>
                      <Switch 
                        id="urgent-only" 
                        checked={settings.notifications.urgentOnly}
                        onCheckedChange={(checked) => handleToggleChange('notifications', 'urgentOnly', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="webhook-notifications">Webhook notifications</Label>
                        <p className="text-sm text-gray-500">Send real-time notifications to external systems</p>
                      </div>
                      <Switch 
                        id="webhook-notifications" 
                        checked={settings.notifications.webhookNotifications}
                        onCheckedChange={(checked) => handleToggleChange('notifications', 'webhookNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="forwarding-address">Default Forwarding Address</Label>
                  <Textarea
                    id="forwarding-address"
                    placeholder="Enter the address where physical mail should be forwarded..."
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This address will be used for automatic forwarding rules
                  </p>
                </div>

                <div>
                  <Label htmlFor="retention-period">Document Retention Period</Label>
                  <Select defaultValue="1095">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="365">1 Year</SelectItem>
                      <SelectItem value="1095">3 Years</SelectItem>
                      <SelectItem value="1825">5 Years</SelectItem>
                      <SelectItem value="2555">7 Years (Tax Documents)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    How long to keep archived documents in secure storage
                  </p>
                </div>

                <Button 
                  onClick={() => updateSettings.mutate({
                    notificationPreferences: { email: true, urgent: false, webhook: false },
                    scanningPreferences: { autoScan: true, ocr: true, categorize: true },
                    retentionPeriod: 1095
                  })}
                  disabled={updateSettings.isPending}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {updateSettings.isPending ? "Updating..." : "Save Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mail Analytics & Insights</CardTitle>
                <CardDescription>
                  Insights and statistics about your mail patterns and processing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{dashboardData?.summary?.totalMail || 0}</p>
                    <p className="text-sm text-gray-600">Total Processed</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">2.4h</p>
                    <p className="text-sm text-gray-600">Avg Processing</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">95%</p>
                    <p className="text-sm text-gray-600">OCR Accuracy</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Truck className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{dashboardData?.recentActions?.filter((a: any) => a.action.actionType === 'forward').length || 0}</p>
                    <p className="text-sm text-gray-600">Items Forwarded</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Mail Categories</h3>
                  <div className="space-y-3">
                    {dashboardData?.mailByCategory && Object.entries(dashboardData.mailByCategory).map(([category, count]) => {
                      const total = Object.values(dashboardData.mailByCategory).reduce((a: any, b: any) => a + b, 0);
                      const percentage = total > 0 ? ((count as number) / total) * 100 : 0;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{category.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  category === 'tax' ? 'bg-red-500' :
                                  category === 'legal' ? 'bg-purple-500' :
                                  category === 'business' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {dashboardData?.recentActions && dashboardData.recentActions.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Recent Actions</h3>
                    <div className="space-y-2">
                      {dashboardData.recentActions.slice(0, 5).map((actionData: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            {actionData.action.actionType === 'scan' && <FileText className="w-4 h-4 text-blue-600" />}
                            {actionData.action.actionType === 'forward' && <Truck className="w-4 h-4 text-green-600" />}
                            {actionData.action.actionType === 'shred' && <Trash2 className="w-4 h-4 text-red-600" />}
                            <div>
                              <p className="text-sm font-medium">
                                {actionData.action.actionType} - {actionData.mail.senderName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(actionData.action.requestedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            actionData.action.actionStatus === 'completed' ? 'default' :
                            actionData.action.actionStatus === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {actionData.action.actionStatus}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
}