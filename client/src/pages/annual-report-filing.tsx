import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import LeftNavigation from "@/components/left-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Upload,
  DollarSign,
  MapPin,
  Users,
  Building,
  Mail,
  Phone
} from "lucide-react";

interface AnnualReportStatus {
  businessEntityId: number;
  state: string;
  entityType: string;
  currentYear: number;
  filingStatus: "not_due" | "due_soon" | "overdue" | "filed" | "exempt";
  dueDate: string;
  daysUntilDue: number;
  reportName: string;
  filingFee: number;
  gracePeriodDays: number;
  penalties?: {
    lateFeeAmount: number;
    dissolutionThreatDays: number;
  };
}

interface StateFilingRequirement {
  id: number;
  state: string;
  entityType: string;
  filingFrequency: string;
  reportName: string;
  dueDateType: string;
  fixedDueDate?: string;
  dueDateOffset?: number;
  gracePeriodDays: number;
  requiredFields: string[];
  optionalFields?: string[];
  stateSpecificFields?: string[];
  filingFeeAmount?: number;
  onlineFilingAvailable: boolean;
  filingMethods: string[];
  formTemplateUrl?: string;
  instructionsUrl?: string;
  filingAddress?: string;
  lateFeeAmount?: number;
  lateFeeFrequency?: string;
  dissolutionThreatDays?: number;
}

interface AnnualReport {
  id: number;
  businessEntityId: number;
  filingYear: number;
  reportType: string;
  state: string;
  filingStatus: string;
  dueDate: string;
  submissionDate?: string;
  confirmationNumber?: string;
  legalName: string;
  principalOfficeAddress: string;
  mailingAddress?: string;
  businessPurpose?: string;
  ein?: string;
  registeredAgentName: string;
  registeredAgentAddress: string;
  registeredAgentPhone?: string;
  registeredAgentEmail?: string;
  managementStructure?: any;
  authorizedSignatories?: any;
  filingFee?: number;
  paymentStatus: string;
  stateSpecificData?: any;
  generatedFormPath?: string;
  formData?: any;
}

const reportFormSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  principalOfficeAddress: z.string().min(1, "Principal office address is required"),
  mailingAddress: z.string().optional(),
  businessPurpose: z.string().optional(),
  ein: z.string().optional(),
  registeredAgentName: z.string().min(1, "Registered agent name is required"),
  registeredAgentAddress: z.string().min(1, "Registered agent address is required"),
  registeredAgentPhone: z.string().optional(),
  registeredAgentEmail: z.string().email().optional().or(z.literal("")),
  managementStructure: z.any().optional(),
  authorizedSignatories: z.any().optional(),
  stateSpecificData: z.record(z.any()).optional(),
});

export default function AnnualReportFiling() {
  const { id } = useParams();
  const businessEntityId = parseInt(id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentReport, setCurrentReport] = useState<AnnualReport | null>(null);

  // Fetch annual report status
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/annual-reports/status", businessEntityId],
    enabled: !!businessEntityId,
  });

  // Fetch state filing requirements
  const { data: requirementsData, isLoading: requirementsLoading } = useQuery({
    queryKey: ["/api/annual-reports/requirements", statusData?.data?.state, statusData?.data?.entityType],
    enabled: !!(statusData?.data?.state && statusData?.data?.entityType),
  });

  // Fetch guidance information
  const { data: guidanceData } = useQuery({
    queryKey: ["/api/annual-reports/guidance"],
  });

  const status: AnnualReportStatus = statusData?.data;
  const requirements: StateFilingRequirement = requirementsData?.data;
  const guidance = guidanceData?.data;

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      legalName: "",
      principalOfficeAddress: "",
      mailingAddress: "",
      businessPurpose: "",
      ein: "",
      registeredAgentName: "",
      registeredAgentAddress: "",
      registeredAgentPhone: "",
      registeredAgentEmail: "",
      managementStructure: {},
      authorizedSignatories: {},
      stateSpecificData: {},
    },
  });

  // Create annual report mutation
  const createReportMutation = useMutation({
    mutationFn: async (data: { businessEntityId: number; filingYear: number }) => {
      return await apiRequest("POST", "/api/annual-reports/create", data);
    },
    onSuccess: (data) => {
      setCurrentReport(data.data);
      setActiveTab("form");
      toast({
        title: "Annual Report Created",
        description: "Your annual report has been created and is ready for completion.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/annual-reports/status"] });
    },
    onError: (error) => {
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
        title: "Error",
        description: "Failed to create annual report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update annual report mutation
  const updateReportMutation = useMutation({
    mutationFn: async (data: { reportId: number; updates: Partial<AnnualReport> }) => {
      return await apiRequest("PUT", `/api/annual-reports/${data.reportId}`, data.updates);
    },
    onSuccess: (data) => {
      setCurrentReport(data.data);
      toast({
        title: "Report Updated",
        description: "Your annual report has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/annual-reports/status"] });
    },
    onError: (error) => {
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
        title: "Error",
        description: "Failed to update annual report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate form mutation
  const generateFormMutation = useMutation({
    mutationFn: async (reportId: number) => {
      return await apiRequest("POST", `/api/annual-reports/${reportId}/generate-form`);
    },
    onSuccess: (data) => {
      toast({
        title: "Form Generated",
        description: "Your annual report form has been generated and is ready for download.",
      });
      // Handle form download or display
      console.log("Generated form data:", data.data);
    },
    onError: (error) => {
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
        title: "Error",
        description: "Failed to generate form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateReport = () => {
    if (status) {
      createReportMutation.mutate({
        businessEntityId: status.businessEntityId,
        filingYear: status.currentYear,
      });
    }
  };

  const handleFormSubmit = (formData: z.infer<typeof reportFormSchema>) => {
    if (currentReport) {
      updateReportMutation.mutate({
        reportId: currentReport.id,
        updates: formData,
      });
    }
  };

  const handleGenerateForm = () => {
    if (currentReport) {
      generateFormMutation.mutate(currentReport.id);
    }
  };

  const getStatusColor = (filingStatus: string) => {
    switch (filingStatus) {
      case "filed": return "text-green-600 bg-green-50";
      case "due_soon": return "text-orange-600 bg-green-50";
      case "overdue": return "text-red-600 bg-red-50";
      case "exempt": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (filingStatus: string) => {
    switch (filingStatus) {
      case "filed": return <CheckCircle className="h-4 w-4" />;
      case "due_soon": return <Clock className="h-4 w-4" />;
      case "overdue": return <AlertCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (statusLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftNavigation />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Annual Report Filing</h1>
          <p className="text-gray-600 mt-2">Manage and file your state-mandated annual reports</p>
        </div>

        {status && (
          <>
            {/* Status Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {getStatusIcon(status.filingStatus)}
                  {status.reportName} - {status.state}
                </CardTitle>
                <CardDescription>
                  Filing year {status.currentYear} • {status.entityType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={`mt-1 ${getStatusColor(status.filingStatus)}`}>
                      {status.filingStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Due Date</Label>
                    <p className="text-sm font-semibold mt-1">
                      {new Date(status.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Days Until Due</Label>
                    <p className={`text-sm font-semibold mt-1 ${
                      status.daysUntilDue < 0 ? 'text-red-600' : 
                      status.daysUntilDue < 30 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {status.daysUntilDue < 0 ? `${Math.abs(status.daysUntilDue)} days overdue` : `${status.daysUntilDue} days`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Filing Fee</Label>
                    <p className="text-sm font-semibold mt-1 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {status.filingFee ? `$${(status.filingFee / 100).toFixed(2)}` : 'No fee'}
                    </p>
                  </div>
                </div>

                {status.penalties && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Late Filing Penalties</h4>
                    <p className="text-sm text-red-700">
                      Late fee: ${(status.penalties.lateFeeAmount / 100).toFixed(2)} • 
                      Administrative dissolution threat after {status.penalties.dissolutionThreatDays} days overdue
                    </p>
                  </div>
                )}

                {status.filingStatus !== "filed" && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleCreateReport}
                      disabled={createReportMutation.isPending}
                      className="bg-green-500 hover:bg-[#E54900] text-white"
                    >
                      {createReportMutation.isPending ? "Creating..." : "Start Annual Report"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="form" disabled={!currentReport}>Report Form</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="guidance">Guidance</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Filing Requirements Summary</CardTitle>
                    <CardDescription>
                      Key requirements for your {status.state} {status.entityType} annual report
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {requirementsLoading ? (
                      <div className="animate-pulse">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ) : requirements ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Filing Details</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Frequency:</span> {requirements.filingFrequency}</p>
                            <p><span className="font-medium">Report Name:</span> {requirements.reportName}</p>
                            <p><span className="font-medium">Grace Period:</span> {requirements.gracePeriodDays} days</p>
                            <p><span className="font-medium">Online Filing:</span> {requirements.onlineFilingAvailable ? 'Available' : 'Not Available'}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Required Information</h4>
                          <div className="space-y-1 text-sm">
                            {requirements.requiredFields?.map((field, index) => (
                              <p key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Requirements not available for this state and entity type.</p>
                    )}
                  </CardContent>
                </Card>

                {requirements?.filingAddress && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Filing Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Filing Address
                          </h4>
                          <p className="text-sm text-gray-700 whitespace-pre-line">
                            {requirements.filingAddress}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Filing Methods</h4>
                          <div className="space-y-2">
                            {requirements.filingMethods?.map((method, index) => (
                              <p key={index} className="text-sm text-gray-700 capitalize">
                                {method.replace('_', ' ')}
                              </p>
                            ))}
                          </div>
                          {requirements.formTemplateUrl && (
                            <Button variant="outline" size="sm" className="mt-3" asChild>
                              <a href={requirements.formTemplateUrl} target="_blank" rel="noopener noreferrer">
                                View State Forms
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Report Form Tab */}
              <TabsContent value="form" className="space-y-6">
                {currentReport ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Annual Report Information</CardTitle>
                      <CardDescription>
                        Complete your annual report form with current business information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                          {/* Business Information */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Business Information
                            </h4>
                            
                            <FormField
                              control={form.control}
                              name="legalName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Legal Business Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter legal business name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="principalOfficeAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Principal Office Address</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Enter complete principal office address" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="mailingAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mailing Address (if different)</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Enter mailing address if different from principal office" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="businessPurpose"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Business Purpose</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Describe the primary business activity" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="ein"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employer Identification Number (EIN)</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="XX-XXXXXXX" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Registered Agent Information */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Registered Agent Information
                            </h4>

                            <FormField
                              control={form.control}
                              name="registeredAgentName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Registered Agent Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter registered agent name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="registeredAgentAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Registered Agent Address</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} placeholder="Enter complete registered agent address" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="registeredAgentPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="(555) 123-4567" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="registeredAgentEmail"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="email" placeholder="agent@example.com" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-4 pt-6">
                            <Button 
                              type="submit" 
                              disabled={updateReportMutation.isPending}
                              className="bg-green-500 hover:bg-[#E54900] text-white"
                            >
                              {updateReportMutation.isPending ? "Updating..." : "Save Report"}
                            </Button>
                            
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={handleGenerateForm}
                              disabled={generateFormMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              {generateFormMutation.isPending ? "Generating..." : "Generate Form"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Report</h3>
                      <p className="text-gray-600 text-center mb-4">
                        Create an annual report to access the form completion interface.
                      </p>
                      <Button 
                        onClick={handleCreateReport}
                        disabled={createReportMutation.isPending}
                        className="bg-green-500 hover:bg-[#E54900] text-white"
                      >
                        {createReportMutation.isPending ? "Creating..." : "Start Annual Report"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Requirements Tab */}
              <TabsContent value="requirements" className="space-y-6">
                {requirementsLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : requirements ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>State Filing Requirements</CardTitle>
                        <CardDescription>
                          Detailed requirements for {requirements.state} {requirements.entityType} entities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Required Fields</h4>
                            <div className="space-y-2">
                              {requirements.requiredFields?.map((field, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {requirements.optionalFields && requirements.optionalFields.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-4">Optional Fields</h4>
                              <div className="space-y-2">
                                {requirements.optionalFields.map((field, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {requirements.stateSpecificFields && requirements.stateSpecificFields.length > 0 && (
                          <div className="mt-8">
                            <h4 className="font-semibold text-gray-900 mb-4">State-Specific Requirements</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {requirements.stateSpecificFields.map((field, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-orange-600" />
                                  <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Filing Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Fees and Deadlines</h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span>Filing Fee:</span>
                                <span className="font-medium">
                                  {requirements.filingFeeAmount ? `$${(requirements.filingFeeAmount / 100).toFixed(2)}` : 'No fee'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Grace Period:</span>
                                <span className="font-medium">{requirements.gracePeriodDays} days</span>
                              </div>
                              {requirements.lateFeeAmount && (
                                <div className="flex justify-between">
                                  <span>Late Fee:</span>
                                  <span className="font-medium text-red-600">
                                    ${(requirements.lateFeeAmount / 100).toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Filing Methods</h4>
                            <div className="space-y-2">
                              {requirements.filingMethods?.map((method, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="capitalize">{method.replace('_', ' ')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements Not Available</h3>
                      <p className="text-gray-600 text-center">
                        Filing requirements for this state and entity type are not currently available.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Guidance Tab */}
              <TabsContent value="guidance" className="space-y-6">
                {guidance && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Annual Report Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{guidance.overview}</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {guidance.benefits?.map((benefit: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {guidance.requirements?.map((requirement: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span>{requirement}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Filing Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {guidance.timeline?.map((step: string, index: number) => (
                            <div key={index} className="flex items-start gap-3 text-sm">
                              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                                {index + 1}
                              </div>
                              <span className="pt-1">{step}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Potential Penalties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {guidance.penalties?.map((penalty: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              <span>{penalty}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}