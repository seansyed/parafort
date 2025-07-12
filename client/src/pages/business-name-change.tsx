import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LeftNavigation from "@/components/left-navigation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Download,
  Building,
  Shield,
  Scale,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  FileCheck,
  Search,
  Settings
} from "lucide-react";

interface NameChangeWorkflowStatus {
  requestId: number;
  businessEntityId: number;
  currentLegalName: string;
  newDesiredName: string;
  status: string;
  progressStep: string;
  completionPercentage: number;
  nextAction: string;
  estimatedCompletion: string;
  criticalDeadlines: {
    type: string;
    description: string;
    dueDate: string;
    daysRemaining: number;
  }[];
}

interface NameAvailabilityResult {
  isAvailable: boolean;
  conflictingEntities: string[];
  suggestedAlternatives: string[];
  reservationOptions: {
    available: boolean;
    fee: number;
    duration: string;
  };
  filingRequirements: {
    state: string;
    amendmentRequired: boolean;
    estimatedFee: number;
    processingTime: string;
  };
}

interface ComplianceChecklist {
  internalApproval: {
    required: boolean;
    completed: boolean;
    documents: string[];
  };
  nameAvailability: {
    required: boolean;
    completed: boolean;
    results: any;
  };
  stateFiling: {
    required: boolean;
    completed: boolean;
    fee: number;
    estimatedProcessing: string;
  };
  irsNotification: {
    required: boolean;
    completed: boolean;
    newEinRequired: boolean;
  };
  licenseUpdates: {
    required: boolean;
    completed: boolean;
    affectedLicenses: number;
  };
}

interface LicenseUpdatePlan {
  totalLicenses: number;
  requireUpdate: number;
  estimatedCost: number;
  estimatedTimeframe: string;
  criticalLicenses: {
    licenseName: string;
    issuingAuthority: string;
    updateDeadline: string;
    penalties: string;
  }[];
}

const nameChangeSchema = z.object({
  currentBusinessName: z.string().min(1, "Current business name is required"),
  newDesiredName: z.string().min(1, "New business name is required"),
  reasonForChange: z.string().optional(),
});

export default function BusinessNameChange() {
  const { id } = useParams();
  const businessEntityId = parseInt(id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof nameChangeSchema>>({
    resolver: zodResolver(nameChangeSchema),
    defaultValues: {
      currentBusinessName: "",
      newDesiredName: "",
      reasonForChange: "",
    },
  });

  // Fetch guidance information
  const { data: guidanceData } = useQuery({
    queryKey: ["/api/name-change/guidance"],
  });

  // Fetch workflow status if request exists
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/name-change/status", currentRequestId],
    enabled: !!currentRequestId,
  });

  // Fetch compliance checklist
  const { data: checklistData } = useQuery({
    queryKey: ["/api/name-change/checklist", currentRequestId],
    enabled: !!currentRequestId,
  });

  // Fetch license plan
  const { data: licensePlanData } = useQuery({
    queryKey: ["/api/name-change/license-plan", businessEntityId],
    enabled: !!businessEntityId,
  });

  // Fetch user's businesses for dropdown
  const { data: userBusinessesData } = useQuery({
    queryKey: ["/api/business-entities"],
  });

  const status: NameChangeWorkflowStatus = statusData?.data;
  const checklist: ComplianceChecklist = checklistData?.data;
  const licensePlan: LicenseUpdatePlan = licensePlanData?.data;
  const guidance = guidanceData?.data;
  const userBusinesses = userBusinessesData?.data || [];

  // Initialize name change mutation
  const initializeNameChangeMutation = useMutation({
    mutationFn: async (data: { businessEntityId: number; currentBusinessName: string; newDesiredName: string; reasonForChange?: string }) => {
      return await apiRequest("POST", "/api/name-change/initialize", data);
    },
    onSuccess: (data) => {
      setCurrentRequestId(data.data.id);
      setActiveTab("workflow");
      toast({
        title: "Name Change Initialized",
        description: "Your business name change process has been started.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/status"] });
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
        description: "Failed to initialize name change. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate resolution mutation
  const generateResolutionMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return await apiRequest("POST", `/api/name-change/${requestId}/generate-resolution`);
    },
    onSuccess: () => {
      toast({
        title: "Resolution Generated",
        description: "Your internal resolution document has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/checklist"] });
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
        description: "Failed to generate resolution. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check availability mutation
  const checkAvailabilityMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return await apiRequest("POST", `/api/name-change/${requestId}/check-availability`);
    },
    onSuccess: (data) => {
      const availability: NameAvailabilityResult = data.data;
      toast({
        title: availability.isAvailable ? "Name Available" : "Name Unavailable",
        description: availability.isAvailable 
          ? "The desired name is available for registration."
          : "The desired name conflicts with existing entities.",
        variant: availability.isAvailable ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/checklist"] });
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
        description: "Failed to check name availability. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate amendment mutation
  const generateAmendmentMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return await apiRequest("POST", `/api/name-change/${requestId}/generate-amendment`);
    },
    onSuccess: () => {
      toast({
        title: "Amendment Generated",
        description: "Your state amendment document has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/checklist"] });
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
        description: "Failed to generate amendment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate IRS notification mutation
  const generateIrsNotificationMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return await apiRequest("POST", `/api/name-change/${requestId}/generate-irs-notification`);
    },
    onSuccess: () => {
      toast({
        title: "IRS Notification Generated",
        description: "Your IRS notification document has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/name-change/checklist"] });
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
        description: "Failed to generate IRS notification. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInitializeNameChange = (formData: z.infer<typeof nameChangeSchema>) => {
    initializeNameChangeMutation.mutate({
      businessEntityId,
      currentBusinessName: formData.currentBusinessName,
      newDesiredName: formData.newDesiredName,
      reasonForChange: formData.reasonForChange,
    });
  };

  const getStepIcon = (step: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />;
    
    switch (step) {
      case "internal_approval": return <Users className="h-5 w-5 text-blue-600" />;
      case "name_availability": return <Search className="h-5 w-5 text-orange-600" />;
      case "state_filing": return <FileText className="h-5 w-5 text-purple-600" />;
      case "irs_notification": return <Shield className="h-5 w-5 text-indigo-600" />;
      case "license_updates": return <Settings className="h-5 w-5 text-gray-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 pt-32 pb-8 px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Legal Name Change</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive workflow for changing your business legal name with full compliance management
          </p>
        </div>

        {/* Status Overview */}
        {status && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building className="h-6 w-6 text-green-500" />
                Name Change Progress
              </CardTitle>
              <CardDescription>
                From "{status.currentLegalName}" to "{status.newDesiredName}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{status.completionPercentage}%</span>
                </div>
                <Progress 
                  value={status.completionPercentage} 
                  className={`h-3 ${getProgressColor(status.completionPercentage)}`}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Step</Label>
                    <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
                      {status.progressStep.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Next Action</Label>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{status.nextAction}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Estimated Completion</Label>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{status.estimatedCompletion}</p>
                  </div>
                </div>

                {status.criticalDeadlines.length > 0 && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Critical Deadlines:</strong>
                      {status.criticalDeadlines.map((deadline, index) => (
                        <div key={index} className="mt-1">
                          {deadline.description} - {deadline.daysRemaining} days remaining
                        </div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="initialize" disabled={!!currentRequestId}>Initialize</TabsTrigger>
            <TabsTrigger value="workflow" disabled={!currentRequestId}>Workflow</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="guidance">Guidance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-green-500" />
                    Legal Name Change Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    A business legal name change involves multiple interconnected steps to ensure full legal compliance.
                    This process includes internal approvals, state filings, IRS notifications, and license updates.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Internal member/shareholder approval</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Search className="h-4 w-4 text-orange-600" />
                      <span>Name availability verification</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span>State amendment filing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-indigo-600" />
                      <span>IRS notification</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span>License and permit updates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {licensePlan && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-green-500" />
                      License Impact Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Total Licenses</Label>
                        <p className="text-lg font-semibold text-gray-900">{licensePlan.totalLicenses}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Requiring Updates</Label>
                        <p className="text-lg font-semibold text-orange-600">{licensePlan.requireUpdate}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Estimated Cost</Label>
                        <p className="text-lg font-semibold text-gray-900">
                          ${(licensePlan.estimatedCost / 100).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Timeframe</Label>
                        <p className="text-lg font-semibold text-gray-900">{licensePlan.estimatedTimeframe}</p>
                      </div>
                    </div>

                    {licensePlan.criticalLicenses.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-red-600">Critical Licenses</Label>
                        <div className="mt-2 space-y-2">
                          {licensePlan.criticalLicenses.map((license, index) => (
                            <div key={index} className="text-sm p-2 bg-red-50 rounded border border-red-200">
                              <p className="font-medium">{license.licenseName}</p>
                              <p className="text-gray-600">{license.issuingAuthority}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Timeline Expectations</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>Internal approval: 1-2 weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>State filing processing: 5-15 business days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>License updates: 2-12 weeks (varies by authority)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Cost Factors</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>State filing fees: $75-$250</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>License update fees: Varies by license</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>Professional services: $1,000-$3,000</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Initialize Tab */}
          <TabsContent value="initialize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Start Name Change Process</CardTitle>
                <CardDescription>
                  Begin your business legal name change with our guided workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleInitializeNameChange)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="currentBusinessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Business Name *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your current business" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {userBusinesses.map((business: any) => (
                                <SelectItem key={business.id} value={business.name}>
                                  {business.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the exact current legal name of your business
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newDesiredName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Business Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your desired new business name" />
                          </FormControl>
                          <FormDescription>
                            Enter the exact legal name you want for your business
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reasonForChange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Change (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Briefly explain why you're changing the business name" />
                          </FormControl>
                          <FormDescription>
                            This information helps with documentation and approval processes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={initializeNameChangeMutation.isPending}
                        className="w-full font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        style={{ 
                          backgroundColor: '#34de73', 
                          borderColor: '#34de73',
                          color: 'white',
                          border: '1px solid #34de73'
                        }}
                        onMouseEnter={(e) => {
                          if (!initializeNameChangeMutation.isPending) {
                            e.currentTarget.style.backgroundColor = '#2bc464';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!initializeNameChangeMutation.isPending) {
                            e.currentTarget.style.backgroundColor = '#34de73';
                          }
                        }}
                      >
                        {initializeNameChangeMutation.isPending ? "Initializing..." : "Start Name Change Process"}
                      </button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            {status && (
              <div className="space-y-6">
                {/* Step-by-step workflow */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Internal Approval */}
                  <Card className={`${status.progressStep === 'internal_approval' ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStepIcon('internal_approval', checklist?.internalApproval?.completed || false)}
                        Internal Approval
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Generate and obtain approval for member/shareholder resolution
                      </p>
                      {!checklist?.internalApproval?.completed && (
                        <Button
                          onClick={() => currentRequestId && generateResolutionMutation.mutate(currentRequestId)}
                          disabled={generateResolutionMutation.isPending}
                          size="sm"
                          className="w-full"
                        >
                          {generateResolutionMutation.isPending ? "Generating..." : "Generate Resolution"}
                        </Button>
                      )}
                      {checklist?.internalApproval?.completed && (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      )}
                    </CardContent>
                  </Card>

                  {/* Name Availability */}
                  <Card className={`${status.progressStep === 'name_availability' ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStepIcon('name_availability', checklist?.nameAvailability?.completed || false)}
                        Name Availability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Verify new name availability with state Secretary of State
                      </p>
                      {!checklist?.nameAvailability?.completed && checklist?.internalApproval?.completed && (
                        <Button
                          onClick={() => currentRequestId && checkAvailabilityMutation.mutate(currentRequestId)}
                          disabled={checkAvailabilityMutation.isPending}
                          size="sm"
                          className="w-full"
                        >
                          {checkAvailabilityMutation.isPending ? "Checking..." : "Check Availability"}
                        </Button>
                      )}
                      {checklist?.nameAvailability?.completed && (
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      )}
                    </CardContent>
                  </Card>

                  {/* State Filing */}
                  <Card className={`${status.progressStep === 'state_filing' ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStepIcon('state_filing', checklist?.stateFiling?.completed || false)}
                        State Filing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Prepare and file Articles of Amendment with state
                      </p>
                      {!checklist?.stateFiling?.completed && checklist?.nameAvailability?.completed && (
                        <Button
                          onClick={() => currentRequestId && generateAmendmentMutation.mutate(currentRequestId)}
                          disabled={generateAmendmentMutation.isPending}
                          size="sm"
                          className="w-full"
                        >
                          {generateAmendmentMutation.isPending ? "Generating..." : "Generate Amendment"}
                        </Button>
                      )}
                      {checklist?.stateFiling?.completed && (
                        <Badge className="bg-green-100 text-green-800">Filed</Badge>
                      )}
                    </CardContent>
                  </Card>

                  {/* IRS Notification */}
                  <Card className={`${status.progressStep === 'irs_notification' ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStepIcon('irs_notification', checklist?.irsNotification?.completed || false)}
                        IRS Notification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Submit name change notification to IRS
                      </p>
                      {!checklist?.irsNotification?.completed && checklist?.stateFiling?.completed && (
                        <Button
                          onClick={() => currentRequestId && generateIrsNotificationMutation.mutate(currentRequestId)}
                          disabled={generateIrsNotificationMutation.isPending}
                          size="sm"
                          className="w-full"
                        >
                          {generateIrsNotificationMutation.isPending ? "Generating..." : "Generate IRS Form"}
                        </Button>
                      )}
                      {checklist?.irsNotification?.completed && (
                        <Badge className="bg-green-100 text-green-800">Notified</Badge>
                      )}
                    </CardContent>
                  </Card>

                  {/* License Updates */}
                  <Card className={`${status.progressStep === 'license_updates' ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStepIcon('license_updates', checklist?.licenseUpdates?.completed || false)}
                        License Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Update all affected business licenses and permits
                      </p>
                      {checklist?.licenseUpdates?.affectedLicenses && (
                        <p className="text-sm font-medium text-gray-900">
                          {checklist.licenseUpdates.affectedLicenses} licenses require updates
                        </p>
                      )}
                      {checklist?.licenseUpdates?.completed ? (
                        <Badge className="bg-green-100 text-green-800">Updated</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            {checklist && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Checklist</CardTitle>
                    <CardDescription>Track all required compliance steps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(checklist).map(([key, item]) => (
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {item.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                          <Badge variant={item.completed ? "default" : "secondary"}>
                            {item.completed ? "Complete" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Required Actions</CardTitle>
                    <CardDescription>Next steps to complete your name change</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {!checklist.internalApproval.completed && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Generate Internal Resolution</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Create member/shareholder resolution for name change approval
                          </p>
                        </div>
                      )}
                      {checklist.internalApproval.completed && !checklist.nameAvailability.completed && (
                        <div className="p-3 bg-green-50 border border-orange-200 rounded-lg">
                          <p className="text-sm font-medium text-orange-900">Check Name Availability</p>
                          <p className="text-sm text-orange-700 mt-1">
                            Verify new name is available with state authorities
                          </p>
                        </div>
                      )}
                      {checklist.nameAvailability.completed && !checklist.stateFiling.completed && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <p className="text-sm font-medium text-purple-900">File State Amendment</p>
                          <p className="text-sm text-purple-700 mt-1">
                            Submit Articles of Amendment to state Secretary of State
                          </p>
                        </div>
                      )}
                      {checklist.stateFiling.completed && !checklist.irsNotification.completed && (
                        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                          <p className="text-sm font-medium text-indigo-900">Notify IRS</p>
                          <p className="text-sm text-indigo-700 mt-1">
                            Submit name change notification to IRS
                          </p>
                        </div>
                      )}
                      {checklist.irsNotification.completed && !checklist.licenseUpdates.completed && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">Update Licenses</p>
                          <p className="text-sm text-gray-700 mt-1">
                            Update all affected business licenses and permits
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Guidance Tab */}
          <TabsContent value="guidance" className="space-y-6">
            {guidance && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Name Change Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{guidance.overview}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guidance.requirements?.map((requirement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <FileCheck className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Timeline</CardTitle>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Considerations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guidance.considerations?.map((consideration: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <span>{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guidance.costs?.map((cost: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>{cost}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}