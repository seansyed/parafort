import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Building,
  MapPin,
  User,
  ArrowLeft
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { BusinessEntity } from "@shared/schema";
import { useLocation } from "wouter";
import { ParaFortLoader } from "@/components/ParaFortLoader";

export default function EntityDetails() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [filingStatus, setFilingStatus] = useState<any>(null);

  // Get entity ID from URL
  const currentPath = window.location.pathname;
  const entityId = currentPath.match(/\/entity\/(\d+)/)?.[1];

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: entity, isLoading: entityLoading } = useQuery<BusinessEntity>({
    queryKey: ["/api/business-entities", entityId],
    enabled: !!entityId && isAuthenticated,
    retry: false,
  });

  const { data: filingInstructions } = useQuery<{
    instructions: string[];
    documents: string[];
    estimatedCost: number;
    timeframe: string;
  }>({
    queryKey: ["/api/business-entities", entityId, "filing-instructions"],
    enabled: !!entityId && isAuthenticated,
    retry: false,
  });

  const generateDocumentMutation = useMutation({
    mutationFn: async ({ documentType, format }: { documentType: string; format: string }) => {
      const response = await fetch(`/api/business-entities/${entityId}/generate-documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentType, format }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || "document";
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document generated and downloaded successfully",
      });
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
        description: "Failed to generate document",
        variant: "destructive",
      });
    },
  });

  const fileMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/business-entities/${entityId}/file`);
      return response.json();
    },
    onSuccess: (data) => {
      setFilingStatus(data);
      queryClient.invalidateQueries({ queryKey: ["/api/business-entities", entityId] });
      toast({
        title: "Filing Submitted",
        description: "Your business entity filing has been submitted successfully",
      });
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
        title: "Filing Error",
        description: "Failed to submit filing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateDocument = (documentType: string, format: string) => {
    generateDocumentMutation.mutate({ documentType, format });
  };

  const handleFileBusiness = () => {
    if (confirm("Are you ready to file this business entity with the state? This action cannot be undone.")) {
      fileMutation.mutate();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "filed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || entityLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ParaFortLoader size="lg" />
          <p className="mt-4 text-gray-500">Loading entity details...</p>
        </div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Entity not found</h3>
          <p className="text-gray-500 mb-6">The requested business entity could not be found.</p>
          <Button onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{entity.name}</h1>
              <p className="text-gray-500">{entity.entityType} • {entity.state}</p>
            </div>
          </div>
          <Badge className={getStatusColor(entity.status)}>
            {entity.status === "completed" || entity.status === "filed" ? "Completed" : 
             entity.status === "in_progress" ? "In Progress" : "Draft"}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="filing">Filing</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                    <p className="text-gray-900">{entity.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Entity Type</label>
                    <p className="text-gray-900">{entity.entityType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">State of Incorporation</label>
                    <p className="text-gray-900">{entity.state}</p>
                  </div>
                  {entity.businessPurpose && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Purpose</label>
                      <p className="text-gray-900">{entity.businessPurpose}</p>
                    </div>
                  )}
                  {entity.numberOfShares && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Number of Shares</label>
                      <p className="text-gray-900">{entity.numberOfShares.toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Street Address</label>
                    <p className="text-gray-900">{entity.streetAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City, State, ZIP</label>
                    <p className="text-gray-900">
                      {entity.city}, {entity.stateAddress} {entity.zipCode}
                    </p>
                  </div>
                  {entity.registeredAgent && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registered Agent</label>
                      <p className="text-gray-900">{entity.registeredAgent}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Articles of Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The Articles of Organization is the legal document that officially creates your LLC. 
                    It contains essential information about your business and is filed with the state.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleGenerateDocument("articles", "docx")}
                      disabled={generateDocumentMutation.isPending}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Word
                    </Button>
                    <Button
                      onClick={() => handleGenerateDocument("articles", "pdf")}
                      disabled={generateDocumentMutation.isPending}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Operating Agreement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The Operating Agreement defines how your LLC will be managed, including member 
                    responsibilities, profit distribution, and decision-making processes.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleGenerateDocument("operating-agreement", "docx")}
                      disabled={generateDocumentMutation.isPending}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Word
                    </Button>
                    <Button
                      onClick={() => handleGenerateDocument("operating-agreement", "pdf")}
                      disabled={generateDocumentMutation.isPending}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="filing">
            <div className="space-y-6">
              {filingInstructions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Filing Requirements for {entity.state}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Filing Fee</label>
                        <p className="text-lg font-semibold text-gray-900">
                          ${filingInstructions.estimatedCost}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Processing Time</label>
                        <p className="text-gray-900">{filingInstructions.timeframe}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Required Documents</label>
                        <p className="text-gray-900">{filingInstructions.documents.length} documents</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Required Documents</label>
                      <ul className="list-disc list-inside space-y-1">
                        {filingInstructions.documents.map((doc: string, index: number) => (
                          <li key={index} className="text-gray-700">{doc}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Filing Instructions</label>
                      <ol className="list-decimal list-inside space-y-1">
                        {filingInstructions.instructions.map((instruction: string, index: number) => (
                          <li key={index} className="text-gray-700">{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Submit Filing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ready to file your business entity with the state? This will submit your information 
                    for processing. Make sure all details are correct before proceeding.
                  </p>
                  <Button
                    onClick={handleFileBusiness}
                    disabled={fileMutation.isPending || entity.status === "filed"}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {entity.status === "filed" ? "Already Filed" : "Submit Filing"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Entity Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      entity.status === "filed" ? "bg-green-500" :
                      entity.status === "completed" ? "bg-blue-500" :
                      entity.status === "in_progress" ? "bg-yellow-500" : "bg-gray-500"
                    }`} />
                    <span className="font-medium">
                      {entity.status === "filed" ? "Filed with State" :
                       entity.status === "completed" ? "Formation Complete" :
                       entity.status === "in_progress" ? "In Progress" : "Draft"}
                    </span>
                  </div>

                  {entity.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-gray-900">{new Date(entity.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}

                  {entity.filedDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Filed Date</label>
                      <p className="text-gray-900">{new Date(entity.filedDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {entity.status === "in_progress" && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Progress</label>
                      <p className="text-gray-900">Step {entity.currentStep} of {entity.totalSteps}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {filingStatus && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Filing Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        filingStatus.status === "approved" ? "bg-green-500" :
                        filingStatus.status === "processing" ? "bg-blue-500" :
                        filingStatus.status === "submitted" ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                      <span className="font-medium">{filingStatus.statusMessage}</span>
                    </div>

                    {filingStatus.confirmationNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Confirmation Number</label>
                        <p className="text-gray-900 font-mono">{filingStatus.confirmationNumber}</p>
                      </div>
                    )}

                    {filingStatus.nextSteps && filingStatus.nextSteps.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 block mb-2">Next Steps</label>
                        <ul className="list-disc list-inside space-y-1">
                          {filingStatus.nextSteps.map((step: string, index: number) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}