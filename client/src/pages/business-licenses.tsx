import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LeftNavigation from "@/components/left-navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParaFortLoader } from "@/components/ParaFortLoader";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  MapPin, 
  Building, 
  Search,
  ExternalLink,
  Calendar,
  DollarSign,
  AlertCircle,
  Zap
} from "lucide-react";

const businessProfileSchema = z.object({
  industryType: z.string().min(1, "Industry type is required"),
  businessActivities: z.array(z.string()).min(1, "At least one business activity is required"),
  operatingLocations: z.array(z.string()).min(1, "At least one operating location is required"),
  employeeCount: z.number().optional(),
  annualRevenue: z.number().optional(),
  businessDescription: z.string().optional(),
  specializedServices: z.array(z.string()).optional(),
  salesChannels: z.array(z.string()).optional(),
  hasPhysicalLocation: z.boolean(),
  servesMinors: z.boolean(),
  handlesFood: z.boolean(),
  usesHazardousMaterials: z.boolean(),
});

type BusinessProfileForm = z.infer<typeof businessProfileSchema>;

const industryOptions = [
  { value: "44", label: "Retail Trade" },
  { value: "45", label: "Wholesale Trade" },
  { value: "72", label: "Accommodation and Food Services" },
  { value: "54", label: "Professional, Scientific, and Technical Services" },
  { value: "23", label: "Construction" },
  { value: "56", label: "Administrative and Support Services" },
  { value: "62", label: "Health Care and Social Assistance" },
  { value: "81", label: "Other Services (except Public Administration)" },
  { value: "11", label: "Agriculture, Forestry, Fishing and Hunting" },
  { value: "21", label: "Mining, Quarrying, and Oil and Gas Extraction" },
];

const businessActivities = [
  "Retail Sales", "Wholesale Distribution", "Food Service", "Professional Services",
  "Construction", "Manufacturing", "Healthcare", "Education", "Technology Services",
  "Real Estate", "Financial Services", "Transportation", "Entertainment",
  "Personal Services", "Consulting", "Import/Export"
];

const salesChannelOptions = [
  "retail", "online", "wholesale", "direct-to-consumer", "b2b", "marketplace"
];

const specializedServiceOptions = [
  "accounting", "legal", "medical", "dental", "veterinary", "engineering",
  "architecture", "real estate", "financial planning", "consulting"
];

export default function BusinessLicenses() {
  const { id } = useParams();
  const entityId = parseInt(id || "0");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/business-licenses/${entityId}/dashboard`],
    enabled: !!entityId,
  });

  const form = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      industryType: "",
      businessActivities: [],
      operatingLocations: [],
      hasPhysicalLocation: false,
      servesMinors: false,
      handlesFood: false,
      usesHazardousMaterials: false,
    },
  });

  // Load existing profile data
  useEffect(() => {
    if (dashboardData?.profile) {
      const profile = dashboardData.profile;
      form.reset({
        industryType: profile.industryType || "",
        businessActivities: profile.businessActivities || [],
        operatingLocations: profile.operatingLocations || [],
        employeeCount: profile.employeeCount || undefined,
        annualRevenue: profile.annualRevenue || undefined,
        businessDescription: profile.businessDescription || "",
        specializedServices: profile.specializedServices || [],
        salesChannels: profile.salesChannels || [],
        hasPhysicalLocation: profile.hasPhysicalLocation || false,
        servesMinors: profile.servesMinors || false,
        handlesFood: profile.handlesFood || false,
        usesHazardousMaterials: profile.usesHazardousMaterials || false,
      });
      setSelectedActivities(profile.businessActivities || []);
      setSelectedLocations(profile.operatingLocations || []);
      setSelectedServices(profile.specializedServices || []);
      setSelectedChannels(profile.salesChannels || []);
    }
  }, [dashboardData, form]);

  // Create/update business profile
  const profileMutation = useMutation({
    mutationFn: async (data: BusinessProfileForm) => {
      const endpoint = dashboardData?.profile 
        ? `/api/business-licenses/${entityId}/profile`
        : `/api/business-licenses/${entityId}/profile`;
      
      return apiRequest(dashboardData?.profile ? "PUT" : "POST", endpoint, {
        ...data,
        businessEntityId: entityId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your business profile has been updated and license requirements are being discovered.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/business-licenses/${entityId}/dashboard`] });
      setActiveTab("requirements");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update business profile",
        variant: "destructive",
      });
    },
  });

  // Business verification
  const verificationMutation = useMutation({
    mutationFn: async (provider: 'middesk' | 'signzy') => {
      return apiRequest("POST", `/api/business-licenses/${entityId}/verify`, { provider });
    },
    onSuccess: () => {
      toast({
        title: "Verification Complete",
        description: "Business verification completed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/business-licenses/${entityId}/dashboard`] });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Business verification failed",
        variant: "destructive",
      });
    },
  });

  // Application status update
  const statusMutation = useMutation({
    mutationFn: async ({ applicationId, status, note }: { applicationId: number; status: string; note?: string }) => {
      return apiRequest("PUT", `/api/business-licenses/applications/${applicationId}/status`, {
        status,
        note,
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Application status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/business-licenses/${entityId}/dashboard`] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessProfileForm) => {
    const formData = {
      ...data,
      businessActivities: selectedActivities,
      operatingLocations: selectedLocations,
      specializedServices: selectedServices,
      salesChannels: selectedChannels,
    };
    profileMutation.mutate(formData);
  };

  const addLocation = () => {
    if (newLocation.trim() && !selectedLocations.includes(newLocation.trim())) {
      setSelectedLocations([...selectedLocations, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeLocation = (location: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== location));
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'submitted': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'not_started': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ParaFortLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftNavigation />
      <main className="flex-1 pt-36 pb-8 px-8">
        <div className="bg-white border-b rounded-lg mb-6">
          <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Business License Services</h1>
                  <p className="text-gray-600 mt-2">
                    Navigate business licensing requirements with expert guidance and comprehensive support
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => verificationMutation.mutate('middesk')}
                    disabled={verificationMutation.isPending}
                    variant="outline"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Business
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Summary */}
        {dashboardData?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.totalRequirements}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.completedApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.pendingApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.activeAlerts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Alerts */}
        {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Compliance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.alerts.map((alert: any) => (
                  <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{alert.alertTitle}</p>
                          <p className="text-sm text-gray-600">{alert.alertMessage}</p>
                        </div>
                        {alert.actionUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={alert.actionUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Take Action
                            </a>
                          </Button>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Business Profile</TabsTrigger>
            <TabsTrigger value="requirements">License Requirements</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile Setup</CardTitle>
                <CardDescription>
                  Provide detailed information about your business to discover all required licenses and permits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="industryType">Industry Type (NAICS Code)</Label>
                      <Select 
                        value={form.watch("industryType")} 
                        onValueChange={(value) => form.setValue("industryType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="employeeCount">Employee Count</Label>
                      <Input
                        type="number"
                        {...form.register("employeeCount", { valueAsNumber: true })}
                        placeholder="Number of employees"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Business Activities</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {businessActivities.map((activity) => (
                        <div key={activity} className="flex items-center space-x-2">
                          <Checkbox
                            id={activity}
                            checked={selectedActivities.includes(activity)}
                            onCheckedChange={() => toggleActivity(activity)}
                          />
                          <Label htmlFor={activity} className="text-sm">{activity}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Operating Locations</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          placeholder="City, State (e.g., New York, NY)"
                        />
                        <Button type="button" onClick={addLocation} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedLocations.map((location) => (
                          <Badge key={location} variant="secondary" className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{location}</span>
                            <button
                              type="button"
                              onClick={() => removeLocation(location)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Specialized Services</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {specializedServiceOptions.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => toggleService(service)}
                          />
                          <Label htmlFor={service} className="text-sm capitalize">{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Sales Channels</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {salesChannelOptions.map((channel) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <Checkbox
                            id={channel}
                            checked={selectedChannels.includes(channel)}
                            onCheckedChange={() => toggleChannel(channel)}
                          />
                          <Label htmlFor={channel} className="text-sm capitalize">{channel.replace('-', ' ')}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasPhysicalLocation"
                          {...form.register("hasPhysicalLocation")}
                        />
                        <Label htmlFor="hasPhysicalLocation">Has Physical Location</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="servesMinors"
                          {...form.register("servesMinors")}
                        />
                        <Label htmlFor="servesMinors">Serves Minors (Under 18)</Label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="handlesFood"
                          {...form.register("handlesFood")}
                        />
                        <Label htmlFor="handlesFood">Handles Food</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="usesHazardousMaterials"
                          {...form.register("usesHazardousMaterials")}
                        />
                        <Label htmlFor="usesHazardousMaterials">Uses Hazardous Materials</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      {...form.register("businessDescription")}
                      placeholder="Detailed description of your business operations..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={profileMutation.isPending}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    {profileMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Updating Profile...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        Update Profile & Discover Licenses
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* License Requirements Tab */}
          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Discovered License Requirements</CardTitle>
                <CardDescription>
                  Based on your business profile, we've identified the following licenses and permits you may need.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.requirements && dashboardData.requirements.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.requirements.map((requirement: any) => (
                      <Card key={requirement.id} className="border-l-4 border-l-[#27884b]">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold">{requirement.licenseName}</h3>
                                <Badge className={getPriorityColor(requirement.priority)}>
                                  {requirement.priority} priority
                                </Badge>
                                <Badge variant="outline">
                                  {requirement.licenseCategory.replace('-', ' ')}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-3">{requirement.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="font-medium text-gray-700">Issuing Authority</p>
                                  <p className="text-gray-600">{requirement.issuingAuthority}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Jurisdiction</p>
                                  <p className="text-gray-600 capitalize">{requirement.jurisdiction}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Processing Time</p>
                                  <p className="text-gray-600">{requirement.processingTime || 'Varies'}</p>
                                </div>
                              </div>

                              {requirement.requirements && requirement.requirements.length > 0 && (
                                <div className="mt-3">
                                  <p className="font-medium text-gray-700 mb-1">Requirements:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {requirement.requirements.map((req: string, index: number) => (
                                      <li key={index}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {requirement.applicationFee && (
                                <div className="mt-3 flex items-center">
                                  <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                                  <span className="text-sm text-gray-600">
                                    Application Fee: ${(requirement.applicationFee / 100).toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="ml-4 flex flex-col space-y-2">
                              {requirement.applicationUrl && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={requirement.applicationUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Apply Online
                                  </a>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => {
                                  // Create application placeholder
                                  setActiveTab("applications");
                                }}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Start Application
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Requirements Found</h3>
                    <p className="text-gray-600 mb-4">
                      Complete your business profile to discover license requirements.
                    </p>
                    <Button onClick={() => setActiveTab("profile")} variant="outline">
                      Complete Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>License Applications</CardTitle>
                <CardDescription>
                  Track the status of your license applications and manage renewals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.applications && dashboardData.applications.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.applications.map((application: any) => {
                      const requirement = dashboardData.requirements?.find((r: any) => r.id === application.licenseRequirementId);
                      return (
                        <Card key={application.id} className="border">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-lg font-semibold">
                                    {requirement?.licenseName || 'License Application'}
                                  </h3>
                                  <Badge className={`${getStatusColor(application.applicationStatus)} text-white`}>
                                    {application.applicationStatus.replace('_', ' ')}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  {application.applicationNumber && (
                                    <div>
                                      <p className="font-medium text-gray-700">Application Number</p>
                                      <p className="text-gray-600">{application.applicationNumber}</p>
                                    </div>
                                  )}
                                  {application.submittedAt && (
                                    <div>
                                      <p className="font-medium text-gray-700">Submitted Date</p>
                                      <p className="text-gray-600">
                                        {new Date(application.submittedAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  )}
                                  {application.expiresAt && (
                                    <div>
                                      <p className="font-medium text-gray-700">Expires</p>
                                      <p className="text-gray-600">
                                        {new Date(application.expiresAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {application.licenseNumber && (
                                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                    <p className="font-medium text-green-800">
                                      License Number: {application.licenseNumber}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="ml-4 flex flex-col space-y-2">
                                {application.applicationStatus === 'not_started' && (
                                  <Button
                                    size="sm"
                                    onClick={() => statusMutation.mutate({
                                      applicationId: application.id,
                                      status: 'in_progress'
                                    })}
                                    disabled={statusMutation.isPending}
                                  >
                                    Start Application
                                  </Button>
                                )}
                                {application.applicationStatus === 'in_progress' && (
                                  <Button
                                    size="sm"
                                    onClick={() => statusMutation.mutate({
                                      applicationId: application.id,
                                      status: 'submitted'
                                    })}
                                    disabled={statusMutation.isPending}
                                  >
                                    Mark as Submitted
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start by discovering license requirements for your business.
                    </p>
                    <Button onClick={() => setActiveTab("requirements")} variant="outline">
                      View Requirements
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tracking Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Monitoring</CardTitle>
                <CardDescription>
                  Stay on top of renewal dates and maintain ongoing compliance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Compliance Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">Compliant Licenses</p>
                            <p className="text-2xl font-bold text-green-900">
                              {dashboardData?.applications?.filter((app: any) => app.applicationStatus === 'approved').length || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Calendar className="h-8 w-8 text-yellow-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-800">Upcoming Renewals</p>
                            <p className="text-2xl font-bold text-yellow-900">
                              {dashboardData?.applications?.filter((app: any) => {
                                if (!app.expiresAt) return false;
                                const daysUntilExpiry = Math.ceil(
                                  (new Date(app.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                                );
                                return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                              }).length || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-8 w-8 text-red-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">Critical Issues</p>
                            <p className="text-2xl font-bold text-red-900">
                              {dashboardData?.alerts?.filter((alert: any) => alert.severity === 'critical').length || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Upcoming Renewals */}
                  {dashboardData?.applications && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Renewal Calendar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dashboardData.applications
                            .filter((app: any) => app.expiresAt && app.applicationStatus === 'approved')
                            .sort((a: any, b: any) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())
                            .map((application: any) => {
                              const requirement = dashboardData.requirements?.find((r: any) => r.id === application.licenseRequirementId);
                              const daysUntilExpiry = Math.ceil(
                                (new Date(application.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                              );
                              const isUrgent = daysUntilExpiry <= 30;

                              return (
                                <div
                                  key={application.id}
                                  className={`p-4 rounded-lg border ${isUrgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">{requirement?.licenseName}</h4>
                                      <p className="text-sm text-gray-600">
                                        Expires: {new Date(application.expiresAt).toLocaleDateString()}
                                      </p>
                                      {isUrgent && (
                                        <p className="text-sm text-red-600 font-medium">
                                          Renewal due in {daysUntilExpiry} days
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <Badge className={isUrgent ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}>
                                        {isUrgent ? 'Urgent' : 'Upcoming'}
                                      </Badge>
                                      {requirement?.applicationUrl && (
                                        <Button size="sm" variant="outline" className="ml-2" asChild>
                                          <a href={requirement.applicationUrl} target="_blank" rel="noopener noreferrer">
                                            Renew Now
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
          </div>
      </main>
    </div>
  );
}