import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/navigation";
import LeftNavigation from "@/components/left-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Download,
  Send,
  User,
  Building,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

// EIN Application Form Schema
const einApplicationSchema = z.object({
  businessLegalName: z.string().min(1, "Business legal name is required"),
  tradeName: z.string().optional(),
  businessAddress: z.string().min(1, "Business address is required"),
  entityType: z.string().min(1, "Entity type is required"),
  reasonForApplying: z.string().min(1, "Reason for applying is required"),
  responsiblePartyName: z.string().min(1, "Responsible party name is required"),
  responsiblePartySSN: z.string().optional(),
  responsiblePartyITIN: z.string().optional(),
  businessStartDate: z.string().min(1, "Business start date is required"),
  expectedEmployees: z.number().min(0, "Expected employees must be 0 or greater"),
  principalActivity: z.string().min(1, "Principal activity description is required"),
}).refine(
  (data) => data.responsiblePartySSN || data.responsiblePartyITIN,
  {
    message: "Either SSN or ITIN is required for the responsible party",
    path: ["responsiblePartySSN"],
  }
);

type EinApplicationForm = z.infer<typeof einApplicationSchema>;

export default function EinApplication() {
  const { id: entityId } = useParams();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("overview");
  const [verificationEin, setVerificationEin] = useState("");

  // Fetch EIN eligibility information
  const { data: eligibilityInfo, isLoading: eligibilityLoading } = useQuery({
    queryKey: ["/api/ein/eligibility"],
  });

  // Fetch user's business entities if no specific entity ID
  const { data: userEntities, isLoading: entitiesLoading } = useQuery({
    queryKey: ["/api/user/business-entities"],
    enabled: !entityId,
  });

  // Fetch business entity and existing EIN application
  const { data: einData, isLoading: einDataLoading } = useQuery({
    queryKey: ["/api/business-entities", entityId, "ein-application"],
    enabled: !!entityId,
  });

  const form = useForm<EinApplicationForm>({
    resolver: zodResolver(einApplicationSchema),
    defaultValues: {
      businessLegalName: "",
      tradeName: "",
      businessAddress: "",
      entityType: "",
      reasonForApplying: "started_new_business",
      responsiblePartyName: "",
      responsiblePartySSN: "",
      responsiblePartyITIN: "",
      businessStartDate: "",
      expectedEmployees: 0,
      principalActivity: "",
    },
  });

  // Pre-fill form with business entity data
  useEffect(() => {
    if (einData?.entity) {
      const entity = einData.entity;
      form.setValue("businessLegalName", entity.name || "");
      form.setValue("entityType", entity.entityType || "");
      form.setValue("businessAddress", 
        `${entity.streetAddress || ""}, ${entity.city || ""}, ${entity.stateAddress || ""} ${entity.zipCode || ""}`
      );
      form.setValue("principalActivity", entity.businessPurpose || "");
    }
    
    if (einData?.application) {
      const app = einData.application;
      form.setValue("businessLegalName", app.businessLegalName);
      form.setValue("tradeName", app.tradeName || "");
      form.setValue("businessAddress", app.businessAddress);
      form.setValue("entityType", app.entityType);
      form.setValue("reasonForApplying", app.reasonForApplying);
      form.setValue("responsiblePartyName", app.responsiblePartyName);
      form.setValue("expectedEmployees", app.expectedEmployees || 0);
      form.setValue("principalActivity", app.principalActivity || "");
      if (app.businessStartDate) {
        form.setValue("businessStartDate", format(new Date(app.businessStartDate), "yyyy-MM-dd"));
      }
    }
  }, [einData, form]);

  // Create/Update EIN Application
  const createApplicationMutation = useMutation({
    mutationFn: async (data: EinApplicationForm) => {
      const applicationData = {
        ...data,
        businessStartDate: new Date(data.businessStartDate),
      };
      
      return await apiRequest(`/api/business-entities/${entityId}/ein-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData)
      });
    },
    onSuccess: (data) => {
      toast({
        title: "EIN Application Saved",
        description: "Your EIN application has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities", entityId, "ein-application"] });
      setCurrentTab("review");
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate SS-4 Form
  const generateSS4Mutation = useMutation({
    mutationFn: async () => {
      if (!einData?.application?.id) {
        throw new Error("No EIN application found");
      }
      
      const response = await fetch(`/api/ein-applications/${einData.application.id}/generate-ss4`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate SS-4 form");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Form_SS4_${einData.application.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Form Generated",
        description: "IRS Form SS-4 has been generated and downloaded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit EIN Application
  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!einData?.application?.id) {
        throw new Error("No EIN application found");
      }
      
      return await apiRequest(`/api/ein-applications/${einData.application.id}/submit`, {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Application Prepared",
        description: "Your EIN application is ready for IRS submission.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities", entityId, "ein-application"] });
      setCurrentTab("submission");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify EIN
  const verifyEinMutation = useMutation({
    mutationFn: async ({ ein, businessName }: { ein: string; businessName: string }) => {
      return await apiRequest("/api/ein/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ein, businessName })
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.isValid ? "EIN Valid" : "EIN Invalid",
        description: data.isValid 
          ? `EIN verified successfully with ${Math.round(data.confidence * 100)}% confidence`
          : "The provided EIN could not be verified",
        variant: data.isValid ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EinApplicationForm) => {
    createApplicationMutation.mutate(data);
  };

  if (einDataLoading || eligibilityLoading || entitiesLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no entity ID provided, show entity selection
  if (!entityId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <LeftNavigation />
          <div className="flex-1 p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">EIN Application</h1>
              <p className="text-lg text-gray-600">
                Apply for an Employer Identification Number (EIN) for your business
              </p>
            </div>

            {userEntities && userEntities.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Select Business Entity</CardTitle>
                  <CardDescription>Choose the business entity for which you want to apply for an EIN</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userEntities.map((entity: any) => (
                    <div key={entity.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                         onClick={() => window.location.href = `/entity/${entity.id}/ein-application`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{entity.name}</h3>
                          <p className="text-sm text-gray-600">{entity.entityType}</p>
                          <p className="text-sm text-gray-500">{entity.stateAddress}</p>
                        </div>
                        <Badge variant={entity.status === 'active' ? 'default' : 'secondary'}>
                          {entity.status || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Business Entities Found</CardTitle>
                  <CardDescription>You need to create a business entity before applying for an EIN</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.href = '/business-formation'}>
                    Create Business Entity
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!einData?.entity && entityId) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Business entity not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftNavigation />
        <div className="flex-1 p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">EIN Application</h1>
        <p className="text-lg text-gray-600">
          Apply for an Employer Identification Number (EIN) for {einData.entity.name}
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  What is an EIN?
                </CardTitle>
                <CardDescription>Understanding Employer Identification Numbers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  An Employer Identification Number (EIN) is a unique nine-digit number assigned by the 
                  Internal Revenue Service (IRS) to identify a business entity operating in the United States 
                  for the purposes of reporting employment taxes.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Required for:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Opening business bank accounts</li>
                    <li>• Hiring employees</li>
                    <li>• Filing tax returns</li>
                    <li>• Applying for business licenses</li>
                    <li>• Setting up business credit</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Application Process
                </CardTitle>
                <CardDescription>Timeline and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="font-medium">Gather Information</div>
                      <div className="text-sm text-gray-600">Collect required business and responsible party details</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="font-medium">Complete Form SS-4</div>
                      <div className="text-sm text-gray-600">Pre-filled form generation based on your information</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="font-medium">Submit to IRS</div>
                      <div className="text-sm text-gray-600">Online submission through official IRS website</div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Processing Time:</strong> Immediate for online applications, 4-5 weeks for mail/fax applications.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {einData?.application ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Application In Progress</div>
                        <div className="text-sm text-gray-600">
                          Application created on {format(new Date(einData.application.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Ready to Start</div>
                        <div className="text-sm text-gray-600">No EIN application found for this entity</div>
                      </div>
                    </>
                  )}
                </div>
                
                <Button 
                  onClick={() => setCurrentTab("application")}
                  className="bg-green-500 hover:bg-green-500/90"
                >
                  {einData?.application ? "Continue Application" : "Start EIN Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Eligibility Tab */}
        <TabsContent value="eligibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>EIN Eligibility Requirements</CardTitle>
              <CardDescription>
                Verify your business meets the requirements for obtaining an EIN
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Eligible Business Types</h4>
                  <ul className="space-y-2">
                    {eligibilityInfo?.eligibleEntities?.map((entity: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {entity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Requirements</h4>
                  <ul className="space-y-2">
                    {eligibilityInfo?.requirements?.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Processing Time</h4>
                  <p className="text-sm text-blue-700 mt-1">{eligibilityInfo?.timeline}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Application Fee</h4>
                  <p className="text-sm text-green-700 mt-1">{eligibilityInfo?.fees}</p>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> The IRS does not charge a fee for obtaining an EIN. 
                  Be cautious of third-party services that charge fees for this free service.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* EIN Verification Tool */}
          <Card>
            <CardHeader>
              <CardTitle>EIN Verification Tool</CardTitle>
              <CardDescription>
                Verify an existing EIN for accuracy and business name matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter EIN (XX-XXXXXXX)"
                  value={verificationEin}
                  onChange={(e) => setVerificationEin(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => verifyEinMutation.mutate({
                    ein: verificationEin,
                    businessName: einData.entity.name || ""
                  })}
                  disabled={verifyEinMutation.isPending || !verificationEin}
                >
                  {verifyEinMutation.isPending ? "Verifying..." : "Verify EIN"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Tab */}
        <TabsContent value="application" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>EIN Application Form</CardTitle>
              <CardDescription>
                Complete all required information for IRS Form SS-4
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Business Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Building className="h-5 w-5 text-green-500" />
                      Business Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessLegalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal Business Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter legal business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tradeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trade Name / DBA (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter trade name if different" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Principal Business Address *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Street address, city, state, ZIP code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="entityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entity Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select entity type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                                <SelectItem value="Corporation">Corporation</SelectItem>
                                <SelectItem value="Partnership">Partnership</SelectItem>
                                <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                                <SelectItem value="Non-profit">Non-profit Organization</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reasonForApplying"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for Applying *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="started_new_business">Started new business</SelectItem>
                                <SelectItem value="hired_employees">Hired employees</SelectItem>
                                <SelectItem value="banking_purposes">Banking purposes</SelectItem>
                                <SelectItem value="changed_type_of_organization">Changed type of organization</SelectItem>
                                <SelectItem value="purchased_going_business">Purchased going business</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Responsible Party Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <User className="h-5 w-5 text-green-500" />
                      Responsible Party Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="responsiblePartyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsible Party Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Full legal name of responsible party" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="responsiblePartySSN"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Security Number</FormLabel>
                            <FormControl>
                              <Input 
                                type="password"
                                placeholder="XXX-XX-XXXX" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="responsiblePartyITIN"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Individual Taxpayer ID (ITIN)</FormLabel>
                            <FormControl>
                              <Input 
                                type="password"
                                placeholder="9XX-XX-XXXX" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        One of SSN or ITIN is required. This information is encrypted and securely stored.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Business Operations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Business Operations
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Business Start Date *
                            </FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expectedEmployees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Number of Employees (Next 12 Months)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="principalActivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Principal Business Activity *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the principal activity of your business"
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={createApplicationMutation.isPending}
                      className="bg-green-500 hover:bg-green-500/90"
                    >
                      {createApplicationMutation.isPending ? "Saving..." : "Save Application"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-6">
          {einData?.application ? (
            <Card>
              <CardHeader>
                <CardTitle>Review Your EIN Application</CardTitle>
                <CardDescription>
                  Review all information before generating your Form SS-4
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Business Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Legal Name:</strong> {einData.application.businessLegalName}</div>
                      {einData.application.tradeName && (
                        <div><strong>Trade Name:</strong> {einData.application.tradeName}</div>
                      )}
                      <div><strong>Address:</strong> {einData.application.businessAddress}</div>
                      <div><strong>Entity Type:</strong> {einData.application.entityType}</div>
                      <div><strong>Reason:</strong> {einData.application.reasonForApplying.replace('_', ' ')}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Operations</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Responsible Party:</strong> {einData.application.responsiblePartyName}</div>
                      <div><strong>Start Date:</strong> {einData.application.businessStartDate ? format(new Date(einData.application.businessStartDate), "MMM d, yyyy") : "Not specified"}</div>
                      <div><strong>Expected Employees:</strong> {einData.application.expectedEmployees}</div>
                      <div><strong>Principal Activity:</strong> {einData.application.principalActivity}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => generateSS4Mutation.mutate()}
                    disabled={generateSS4Mutation.isPending}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {generateSS4Mutation.isPending ? "Generating..." : "Download Form SS-4"}
                  </Button>
                  
                  <Button
                    onClick={() => submitApplicationMutation.mutate()}
                    disabled={submitApplicationMutation.isPending}
                    className="bg-green-500 hover:bg-green-500/90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitApplicationMutation.isPending ? "Preparing..." : "Prepare for Submission"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Complete the application form to review your information.</p>
                <Button 
                  onClick={() => setCurrentTab("application")}
                  className="mt-4"
                >
                  Complete Application
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Submission Tab */}
        <TabsContent value="submission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your EIN Application</CardTitle>
              <CardDescription>
                Instructions for submitting your Form SS-4 to the IRS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your Form SS-4 has been prepared. Follow these steps to submit your application to the IRS.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h4 className="font-medium">Submission Options</h4>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium text-green-700">Recommended: Online Submission</h5>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Submit directly through the official IRS website for immediate processing.
                  </p>
                  <Button 
                    onClick={() => window.open("https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online", "_blank")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Online at IRS.gov
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">Alternative: Mail/Fax Submission</h5>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Print and mail/fax your completed Form SS-4. Processing takes 4-5 weeks.
                  </p>
                  <Button 
                    onClick={() => generateSS4Mutation.mutate()}
                    disabled={generateSS4Mutation.isPending}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Form SS-4
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Next Steps After Submission</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Save your confirmation number for tracking</li>
                  <li>• EIN will be issued immediately for online applications</li>
                  <li>• Update your business records with the new EIN</li>
                  <li>• Use your EIN for banking, tax filing, and business licensing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
}