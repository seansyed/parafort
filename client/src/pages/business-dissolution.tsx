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
  Building2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Download,
  FileText,
  Shield,
  Scale,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  FileCheck,
  Archive,
  XCircle,
  AlertCircle,
  CheckSquare,
  Trash2,
  BookOpen
} from "lucide-react";

interface DissolutionWorkflowStatus {
  dissolutionId: number;
  businessEntityId: number;
  currentLegalName: string;
  dissolutionType: string;
  dissolutionReason: string;
  status: string;
  currentPhase: string;
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

interface TaskProgress {
  category: string;
  completed: number;
  total: number;
  percentage: number;
  criticalTasks: {
    taskTitle: string;
    dueDate: string;
    status: string;
    priority: string;
  }[];
}

interface LicenseInventory {
  totalLicenses: number;
  requiresCancellation: number;
  estimatedTime: string;
  criticalLicenses: {
    licenseName: string;
    issuingAuthority: string;
    cancellationDeadline: string;
    penalties: string;
  }[];
  cancellationMethods: {
    online: number;
    mail: number;
    phone: number;
    inPerson: number;
  };
}

interface TaxObligations {
  finalReturnRequired: boolean;
  form966Required: boolean;
  einCancellationRequired: boolean;
  estimatedTaxLiability: number;
  filingDeadlines: {
    type: string;
    description: string;
    dueDate: string;
  }[];
  recommendedActions: string[];
}

const dissolutionSchema = z.object({
  businessName: z.string().min(1, "Business selection is required"),
  dissolutionType: z.enum(["voluntary", "administrative", "judicial"]),
  dissolutionReason: z.string().optional(),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

export default function BusinessDissolution() {
  const { id } = useParams();
  const businessEntityId = parseInt(id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentDissolutionId, setCurrentDissolutionId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof dissolutionSchema>>({
    resolver: zodResolver(dissolutionSchema),
    defaultValues: {
      businessName: "",
      dissolutionType: "voluntary",
      dissolutionReason: "",
      effectiveDate: "",
    },
  });

  // Fetch guidance information
  const { data: guidanceData } = useQuery({
    queryKey: ["/api/dissolution/guidance"],
  });

  // Fetch dissolution status if active
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/dissolution/status", currentDissolutionId],
    enabled: !!currentDissolutionId,
  });

  // Fetch task progress
  const { data: taskProgressData } = useQuery({
    queryKey: ["/api/dissolution/task-progress", currentDissolutionId],
    enabled: !!currentDissolutionId,
  });

  // Fetch license inventory
  const { data: licenseInventoryData } = useQuery({
    queryKey: ["/api/dissolution/license-inventory", currentDissolutionId],
    enabled: !!currentDissolutionId,
  });

  // Fetch tax obligations
  const { data: taxObligationsData } = useQuery({
    queryKey: ["/api/dissolution/tax-obligations", currentDissolutionId],
    enabled: !!currentDissolutionId,
  });

  // Fetch user's businesses for dropdown
  const { data: userBusinessesData } = useQuery({
    queryKey: ["/api/business-entities"],
  });

  const status: DissolutionWorkflowStatus = statusData?.data;
  const taskProgress: TaskProgress[] = taskProgressData?.data || [];
  const licenseInventory: LicenseInventory = licenseInventoryData?.data;
  const taxObligations: TaxObligations = taxObligationsData?.data;
  const guidance = guidanceData?.data;
  const userBusinesses = userBusinessesData?.data || [];

  // Initiate dissolution mutation
  const initiateDissolutionMutation = useMutation({
    mutationFn: async (data: { 
      businessEntityId: number; 
      businessName: string;
      dissolutionType: string; 
      dissolutionReason?: string;
      effectiveDate: string;
    }) => {
      return await apiRequest("POST", "/api/dissolution/initiate", data);
    },
    onSuccess: (data) => {
      setCurrentDissolutionId(data.data.id);
      setActiveTab("workflow");
      toast({
        title: "Dissolution Initiated",
        description: "Your business dissolution process has been started.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dissolution/status"] });
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
        description: "Failed to initiate dissolution. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate resolution mutation
  const generateResolutionMutation = useMutation({
    mutationFn: async (dissolutionId: number) => {
      return await apiRequest("POST", `/api/dissolution/${dissolutionId}/generate-resolution`);
    },
    onSuccess: () => {
      toast({
        title: "Resolution Generated",
        description: "Your dissolution resolution document has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dissolution/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dissolution/task-progress"] });
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

  // Generate articles mutation
  const generateArticlesMutation = useMutation({
    mutationFn: async (dissolutionId: number) => {
      return await apiRequest("POST", `/api/dissolution/${dissolutionId}/generate-articles`);
    },
    onSuccess: () => {
      toast({
        title: "Articles Generated",
        description: "Your Articles of Dissolution have been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dissolution/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dissolution/task-progress"] });
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
        description: "Failed to generate articles. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate tax documents mutation
  const generateTaxDocumentsMutation = useMutation({
    mutationFn: async (dissolutionId: number) => {
      return await apiRequest("POST", `/api/dissolution/${dissolutionId}/generate-tax-documents`);
    },
    onSuccess: () => {
      toast({
        title: "Tax Documents Generated",
        description: "Your final tax documents have been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dissolution/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dissolution/task-progress"] });
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
        description: "Failed to generate tax documents. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInitiateDissolution = (formData: z.infer<typeof dissolutionSchema>) => {
    // Find the selected business entity
    const selectedBusiness = userBusinesses.find((business: any) => business.name === formData.businessName);
    if (!selectedBusiness) {
      toast({
        title: "Error",
        description: "Selected business not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    initiateDissolutionMutation.mutate({
      businessEntityId: selectedBusiness.id,
      businessName: formData.businessName,
      dissolutionType: formData.dissolutionType,
      dissolutionReason: formData.dissolutionReason,
      effectiveDate: formData.effectiveDate,
    });
  };

  const getPhaseIcon = (phase: string, isActive: boolean) => {
    const iconClass = isActive ? "h-5 w-5 text-green-500" : "h-5 w-5 text-gray-400";
    
    switch (phase) {
      case "decision": return <Users className={iconClass} />;
      case "approval": return <CheckSquare className={iconClass} />;
      case "filing": return <FileText className={iconClass} />;
      case "wind_down": return <Trash2 className={iconClass} />;
      case "closure": return <Archive className={iconClass} />;
      default: return <Clock className={iconClass} />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "medium": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 pt-32 pb-8 px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Dissolution</h1>
          <p className="text-gray-600 mt-2">
            Complete business entity dissolution with comprehensive compliance management
          </p>
        </div>

        {/* Status Overview */}
        {status && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-green-500" />
                Dissolution Progress
              </CardTitle>
              <CardDescription>
                Dissolving "{status.currentLegalName}" - {status.dissolutionType} dissolution
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
                    <Label className="text-sm font-medium text-gray-500">Current Phase</Label>
                    <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
                      {status.currentPhase.replace('_', ' ')}
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="initiate" disabled={!!currentDissolutionId}>Initiate</TabsTrigger>
            <TabsTrigger value="workflow" disabled={!currentDissolutionId}>Workflow</TabsTrigger>
            <TabsTrigger value="licenses" disabled={!currentDissolutionId}>Licenses</TabsTrigger>
            <TabsTrigger value="taxes" disabled={!currentDissolutionId}>Taxes</TabsTrigger>
            <TabsTrigger value="guidance">Guidance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-green-500" />
                    Business Dissolution Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Business dissolution is the formal process of ending a business entity's legal existence. 
                    This involves multiple phases from member approval through final record retention.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Decision and member approval</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span>State filing and documentation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-indigo-600" />
                      <span>Tax obligations and final returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      <span>Asset distribution and wind-down</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Archive className="h-4 w-4 text-gray-600" />
                      <span>Record retention and final closure</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-500" />
                    Key Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                      <p className="text-sm text-gray-700">
                        Complete dissolution typically takes 4-6 months depending on entity complexity
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tax Implications</h4>
                      <p className="text-sm text-gray-700">
                        Final tax returns required, timing affects tax obligations
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Record Retention</h4>
                      <p className="text-sm text-gray-700">
                        Business records must be retained for 7 years minimum
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dissolution Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Legal Obligations</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>Creditor notification requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>Asset distribution to members</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>Contract termination obligations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Financial Impact</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>State filing fees: $50-$250</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Professional services: $1,500-$5,000</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Final tax preparation costs</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Timeline Factors</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Member approval: 1-2 weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>State processing: 2-8 weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Wind-down activities: 2-4 months</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Initiate Tab */}
          <TabsContent value="initiate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Initiate Business Dissolution</CardTitle>
                <CardDescription>
                  Begin the formal process of dissolving your business entity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleInitiateDissolution)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business to Dissolve *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the business to dissolve" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {userBusinesses.map((business: any) => (
                                <SelectItem key={business.id} value={business.name}>
                                  {business.name} ({business.entityType})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select which business entity you want to dissolve
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dissolutionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dissolution Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select dissolution type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="voluntary">Voluntary Dissolution</SelectItem>
                              <SelectItem value="administrative">Administrative Dissolution</SelectItem>
                              <SelectItem value="judicial">Judicial Dissolution</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Voluntary dissolution is initiated by the business owners
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Effective Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            The date when the dissolution becomes effective
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dissolutionReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Dissolution (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Briefly explain the reason for dissolving the business" />
                          </FormControl>
                          <FormDescription>
                            This information helps with documentation and compliance
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={initiateDissolutionMutation.isPending}
                      className="bg-green-500 hover:bg-[#E54900] text-white"
                    >
                      {initiateDissolutionMutation.isPending ? "Initiating..." : "Initiate Dissolution Process"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            {status && taskProgress.length > 0 && (
              <div className="space-y-6">
                {/* Phase Progress */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {taskProgress.map((phase, index) => (
                    <Card key={phase.category} className={`${status.currentPhase === phase.category.toLowerCase() ? 'ring-2 ring-green-500' : ''}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getPhaseIcon(phase.category.toLowerCase(), status.currentPhase === phase.category.toLowerCase())}
                          {phase.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{phase.percentage}%</span>
                          </div>
                          <Progress value={phase.percentage} className="h-2" />
                          <p className="text-xs text-gray-600">
                            {phase.completed} of {phase.total} tasks completed
                          </p>
                          
                          {phase.criticalTasks.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-red-600 mb-1">Critical Tasks:</p>
                              {phase.criticalTasks.slice(0, 2).map((task, taskIndex) => (
                                <div key={taskIndex} className="text-xs bg-red-50 p-2 rounded">
                                  <p className="font-medium">{task.taskTitle}</p>
                                  <p className="text-gray-600">Due: {task.dueDate}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Generate Resolution</CardTitle>
                      <CardDescription>
                        Create member/shareholder dissolution resolution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => currentDissolutionId && generateResolutionMutation.mutate(currentDissolutionId)}
                        disabled={generateResolutionMutation.isPending}
                        className="w-full"
                      >
                        {generateResolutionMutation.isPending ? "Generating..." : "Generate Resolution"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Articles of Dissolution</CardTitle>
                      <CardDescription>
                        Generate state filing documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => currentDissolutionId && generateArticlesMutation.mutate(currentDissolutionId)}
                        disabled={generateArticlesMutation.isPending}
                        className="w-full"
                      >
                        {generateArticlesMutation.isPending ? "Generating..." : "Generate Articles"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tax Documents</CardTitle>
                      <CardDescription>
                        Generate final tax return guidance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => currentDissolutionId && generateTaxDocumentsMutation.mutate(currentDissolutionId)}
                        disabled={generateTaxDocumentsMutation.isPending}
                        className="w-full"
                      >
                        {generateTaxDocumentsMutation.isPending ? "Generating..." : "Generate Tax Docs"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="space-y-6">
            {licenseInventory && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>License & Permit Inventory</CardTitle>
                    <CardDescription>
                      Comprehensive list of licenses and permits requiring cancellation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{licenseInventory.totalLicenses}</p>
                        <p className="text-sm text-gray-600">Total Licenses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{licenseInventory.requiresCancellation}</p>
                        <p className="text-sm text-gray-600">Requiring Cancellation</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{licenseInventory.estimatedTime}</p>
                        <p className="text-sm text-gray-600">Estimated Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{licenseInventory.criticalLicenses.length}</p>
                        <p className="text-sm text-gray-600">Critical Items</p>
                      </div>
                    </div>

                    {licenseInventory.criticalLicenses.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Critical Licenses</h4>
                        <div className="space-y-3">
                          {licenseInventory.criticalLicenses.map((license, index) => (
                            <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{license.licenseName}</p>
                                  <p className="text-sm text-gray-600">{license.issuingAuthority}</p>
                                  <p className="text-sm text-red-600 mt-1">{license.penalties}</p>
                                </div>
                                <Badge variant="destructive">
                                  {license.cancellationDeadline}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cancellation Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-xl font-bold text-green-600">{licenseInventory.cancellationMethods.online}</p>
                        <p className="text-sm text-gray-600">Online</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-xl font-bold text-blue-600">{licenseInventory.cancellationMethods.mail}</p>
                        <p className="text-sm text-gray-600">Mail</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-xl font-bold text-purple-600">{licenseInventory.cancellationMethods.phone}</p>
                        <p className="text-sm text-gray-600">Phone</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-xl font-bold text-orange-600">{licenseInventory.cancellationMethods.inPerson}</p>
                        <p className="text-sm text-gray-600">In Person</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Taxes Tab */}
          <TabsContent value="taxes" className="space-y-6">
            {taxObligations && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Obligations Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Required Filings</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {taxObligations.finalReturnRequired ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm">Final Tax Return</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {taxObligations.form966Required ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm">Form 966 (Corporations)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {taxObligations.einCancellationRequired ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm">EIN Cancellation</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Critical Deadlines</h4>
                        <div className="space-y-2">
                          {taxObligations.filingDeadlines.map((deadline, index) => (
                            <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <p className="text-sm font-medium text-gray-900">{deadline.type}</p>
                              <p className="text-xs text-gray-600">{deadline.description}</p>
                              <p className="text-xs text-orange-600 font-medium">{deadline.dueDate}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Estimated Liability</h4>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            ${(taxObligations.estimatedTaxLiability / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">Estimated Tax Liability</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {taxObligations.recommendedActions.map((action, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm text-gray-700">{action}</span>
                        </div>
                      ))}
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
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      Business Dissolution Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{guidance.overview}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Process Phases</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {guidance.phases?.map((phase: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 text-sm">
                            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </div>
                            <span className="pt-1">{phase}</span>
                          </div>
                        ))}
                      </div>
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
                            <FileCheck className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guidance.timeline?.map((step: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

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
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Record Retention Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Minimum Retention Period</h4>
                        <div className="text-center p-4 bg-blue-50 rounded-lg mb-4">
                          <p className="text-3xl font-bold text-blue-600">{guidance.recordRetention?.minimumPeriod}</p>
                          <p className="text-sm text-gray-600">Years</p>
                        </div>
                        <ul className="space-y-2">
                          {guidance.recordRetention?.recommendations?.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Archive className="h-4 w-4 text-gray-600 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Storage Options</h4>
                        <ul className="space-y-2">
                          {guidance.recordRetention?.digitalStorageOptions?.map((option: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                              <span>{option}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}