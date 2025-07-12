import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Calendar, Users, DollarSign, FileText, Calculator, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PayrollService {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  category: string;
}

interface PayrollDocument {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  businessEntityId: number;
  payrollPeriod: string;
  status: string;
  notes?: string;
}

interface BusinessEntity {
  id: number;
  name: string;
  entityType: string;
  state: string;
}

export default function PayrollServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<PayrollService | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // Fetch payroll services
  const { data: payrollServices = [], isLoading } = useQuery({
    queryKey: ["/api/payroll-services"],
    queryFn: () => apiRequest("GET", "/api/payroll-services").then(res => res.json()),
  });

  // Fetch business entities
  const { data: businessEntities = [] } = useQuery({
    queryKey: ["/api/business-entities"],
    queryFn: () => apiRequest("GET", "/api/business-entities").then(res => res.json()),
  });

  // Fetch payroll documents
  const { data: payrollDocuments = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/payroll-documents"],
    queryFn: () => apiRequest("GET", "/api/payroll-documents").then(res => res.json()),
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (serviceId: number) => {
      const response = await apiRequest("POST", "/api/payroll-purchase", { serviceId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Purchased",
        description: "Your payroll service has been successfully purchased.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payroll-services"] });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase service. Please try again.",
        variant: "destructive",
      });
    },
  });

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/payroll-upload", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "File Uploaded",
        description: "Your payroll document has been uploaded successfully.",
      });
      setUploadModalOpen(false);
      setSelectedFile(null);
      setUploadNotes("");
      setSelectedEntity("");
      setSelectedPeriod("");
      queryClient.invalidateQueries({ queryKey: ["/api/payroll-documents"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = () => {
    if (!selectedFile || !selectedEntity || !selectedPeriod) {
      toast({
        title: "Missing Information",
        description: "Please select a file, business entity, and payroll period.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("businessEntityId", selectedEntity);
    formData.append("payrollPeriod", selectedPeriod);
    formData.append("notes", uploadNotes);

    uploadMutation.mutate(formData);
  };

  const handlePurchase = (service: PayrollService) => {
    setSelectedService(service);
    purchaseMutation.mutate(service.id);
  };

  const downloadDocument = async (documentId: number) => {
    try {
      const response = await apiRequest("GET", `/api/payroll-documents/${documentId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll-document-${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "processing":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      completed: "default",
      processing: "secondary",
      failed: "destructive",
      pending: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Professional Payroll Services</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Streamline your payroll operations with our comprehensive suite of payroll management services
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Available Services</TabsTrigger>
            <TabsTrigger value="documents">Document Management</TabsTrigger>
            <TabsTrigger value="dashboard">Payroll Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                payrollServices.map((service: PayrollService) => (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      <div className="text-2xl font-bold text-green-600">
                        ${service.price}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePurchase(service)}
                      disabled={purchaseMutation.isPending}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontWeight: '600',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s ease-in-out',
                        transform: 'translateY(0)'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#059669';
                        (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#10b981';
                        (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      {purchaseMutation.isPending ? "Processing..." : "Subscribe"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Management</h2>
              <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Payroll Document</DialogTitle>
                    <DialogDescription>
                      Upload your payroll documents for processing and compliance tracking.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file">Select File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="entity">Business Entity</Label>
                      <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business entity" />
                        </SelectTrigger>
                        <SelectContent>
                          {(businessEntities as BusinessEntity[]).map((entity: BusinessEntity) => (
                            <SelectItem key={entity.id} value={entity.id.toString()}>
                              {entity.name} ({entity.entityType})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="period">Payroll Period</Label>
                      <Input
                        id="period"
                        type="text"
                        placeholder="e.g., Q1 2024, January 2024"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes..."
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleFileUpload}
                      disabled={uploadMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Uploaded Documents
                </CardTitle>
                <CardDescription>
                  Manage your payroll-related documents and submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
                  </div>
                ) : (payrollDocuments as PayrollDocument[]).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payroll documents uploaded yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(payrollDocuments as PayrollDocument[]).map((document: PayrollDocument) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(document.status)}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {document.fileName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Period: {document.payrollPeriod} • Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                            </p>
                            {document.notes && (
                              <p className="text-sm text-gray-600 mt-1">{document.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(document.status)}
                          <button
                            onClick={() => downloadDocument(document.id)}
                            style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              fontWeight: '600',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease-in-out',
                              transform: 'translateY(0)'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#059669';
                              (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#10b981';
                              (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                              (e.target as HTMLElement).style.transform = 'translateY(0)';
                            }}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-500" />
                    Active Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
                  <p className="text-sm text-gray-500">Across all entities</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    Monthly Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">$45,200</div>
                  <p className="text-sm text-gray-500">Current month total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-green-500" />
                    Next Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Dec 15</div>
                  <p className="text-sm text-gray-500">5 days remaining</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-500" />
                    Recent Payroll Runs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: "December 1, 2024", amount: "$45,200", status: "Completed" },
                      { date: "November 15, 2024", amount: "$44,800", status: "Completed" },
                      { date: "November 1, 2024", amount: "$43,900", status: "Completed" },
                    ].map((payroll, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{payroll.date}</p>
                          <p className="text-sm text-gray-500">{payroll.amount}</p>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {payroll.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-green-500" />
                    Compliance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { item: "Federal Tax Deposits", status: "Up to date", color: "green" },
                      { item: "State Tax Filings", status: "Due Dec 20", color: "yellow" },
                      { item: "Quarterly Reports", status: "Completed", color: "green" },
                      { item: "Annual W-2 Prep", status: "In progress", color: "blue" },
                    ].map((compliance, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{compliance.item}</p>
                        <Badge 
                          variant={compliance.color === "green" ? "default" : "outline"}
                          className={`
                            ${compliance.color === "green" ? "bg-green-100 text-green-800" : ""}
                            ${compliance.color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${compliance.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                          `}
                        >
                          {compliance.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}