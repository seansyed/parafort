import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileText, Trash2, Eye, Calendar, User, Building, Filter, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Document {
  id: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  serviceType: string;
  category?: string;
  uploadedBy: string;
  uploadedByAdmin: boolean;
  isProcessed: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BookkeepingDocument {
  id: number;
  businessEntityId: number;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  subcategory?: string;
  status: string;
  amount?: number;
  vendor?: string;
  description?: string;
  isDeductible: boolean;
  reviewStatus: string;
  createdAt: string;
}

interface PayrollDocument {
  id: number;
  businessEntityId: number;
  fileName: string;
  originalFileName: string;
  documentType: string;
  fileSize: number;
  mimeType?: string;
  isUserUploaded: boolean;
  status: string;
  createdAt: string;
}

export default function Documents() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [uploadServiceType, setUploadServiceType] = useState("formation");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    clientId: "",
    documentName: "",
    description: "",
    serviceType: "formation",
    dueDate: "",
    priority: "normal"
  });

  // General documents query
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
    enabled: isAuthenticated,
  });

  // Bookkeeping documents query
  const { data: bookkeepingDocuments = [], isLoading: bookkeepingLoading } = useQuery({
    queryKey: ["/api/bookkeeping/documents"],
    enabled: isAuthenticated,
  });

  // Payroll documents query
  const { data: payrollDocuments = [], isLoading: payrollLoading } = useQuery({
    queryKey: ["/api/payroll/documents"],
    enabled: isAuthenticated,
  });

  // Business entities for context
  const { data: businessEntities = [] } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: isAuthenticated,
  });

  // Clients query for admin
  const { data: clients = [] } = useQuery({
    queryKey: ["/api/admin/clients"],
    enabled: isAuthenticated && isAdmin,
  });

  // Request document mutation
  const requestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      return await apiRequest("POST", "/api/admin/document-requests", requestData);
    },
    onSuccess: () => {
      toast({
        title: "Document Request Created",
        description: "The client has been notified of the document request.",
      });
      setIsRequestDialogOpen(false);
      setRequestForm({
        clientId: "",
        documentName: "",
        description: "",
        serviceType: "general",
        dueDate: "",
        priority: "normal"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/document-requests"] });
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
        description: "Failed to create document request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Your document has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookkeeping/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/documents"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
        title: "Upload Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, serviceType }: { id: number; serviceType: string }) => {
      let endpoint = `/api/documents/${id}`;
      if (serviceType === "bookkeeping") {
        endpoint = `/api/bookkeeping/documents/${id}`;
      } else if (serviceType === "payroll") {
        endpoint = `/api/payroll/documents/${id}`;
      }
      await apiRequest("DELETE", endpoint);
    },
    onSuccess: () => {
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookkeeping/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/documents"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
        title: "Delete Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!selectedClientId) {
      toast({
        title: "Client Required",
        description: "Please select a client before uploading documents.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("serviceType", uploadServiceType);
    formData.append("documentType", "general");
    formData.append("clientId", selectedClientId);

    uploadMutation.mutate(formData);
  };

  const handleDownload = async (doc: Document | BookkeepingDocument | PayrollDocument) => {
    try {
      let endpoint = `/api/documents/${doc.id}/download`;
      if ("category" in doc) {
        endpoint = `/api/bookkeeping/documents/${doc.id}/download`;
      } else if ("documentType" in doc && "isUserUploaded" in doc) {
        endpoint = `/api/payroll/documents/${doc.id}/download`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = doc.originalFileName || doc.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the document.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      uploaded: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      processed: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  const filterDocuments = (docs: any[], type: string) => {
    let filtered = docs;
    
    if (documentTypeFilter !== "all") {
      filtered = filtered.filter(doc => 
        doc.documentType === documentTypeFilter || 
        doc.category === documentTypeFilter ||
        doc.serviceType === documentTypeFilter
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(doc => doc.status === statusFilter || doc.reviewStatus === statusFilter);
    }
    
    return filtered;
  };

  return (
    <div className="container mx-auto p-6 pt-32 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">Upload, organize, and manage your business documents</p>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {(clients as any[]).map((client: any) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={uploadServiceType} onValueChange={setUploadServiceType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formation">Business Formation</SelectItem>
              <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="tax">Tax Services</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending || !selectedClientId}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadMutation.isPending ? "Uploading..." : "Upload Documents"}
          </Button>

          {isAdmin && (
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-transparent border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                  <Send className="w-4 h-4 mr-2" />
                <span className="text-white font-semibold">Request Document</span></Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Request Document from Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Select Client</Label>
                  <Select value={requestForm.clientId} onValueChange={(value) => setRequestForm(prev => ({ ...prev, clientId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(clients) && clients.map((client: any) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.firstName} {client.lastName} ({client.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    value={requestForm.documentName}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, documentName: e.target.value }))}
                    placeholder="e.g., W-4 Form, Bank Statement, Tax Return"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={requestForm.serviceType} onValueChange={(value) => setRequestForm(prev => ({ ...prev, serviceType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formation">Business Formation</SelectItem>
                      <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                      <SelectItem value="payroll">Payroll</SelectItem>
                      <SelectItem value="tax">Tax Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={requestForm.priority} onValueChange={(value) => setRequestForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={requestForm.dueDate}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={requestForm.description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details or requirements..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => requestMutation.mutate(requestForm)}
                  disabled={!requestForm.clientId || !requestForm.documentName || requestMutation.isPending}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {requestMutation.isPending ? "Creating..." : "Send Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
          />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="formation">Business Formation</SelectItem>
                <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="tax">Tax Services</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="receipt">Receipts</SelectItem>
                <SelectItem value="invoice">Invoices</SelectItem>
                <SelectItem value="bank_statement">Bank Statements</SelectItem>
                <SelectItem value="tax_document">Tax Documents</SelectItem>
                <SelectItem value="timesheet">Timesheets</SelectItem>
                <SelectItem value="w4">W-4 Forms</SelectItem>
                <SelectItem value="payroll_report">Payroll Reports</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Documents</TabsTrigger>
          <TabsTrigger value="bookkeeping">Bookkeeping</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Documents</CardTitle>
              <CardDescription>
                Manage your general business documents and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filterDocuments(documents as Document[], "general").length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No documents found. Upload your first document to get started.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filterDocuments(documents as Document[], "general").map((doc: Document) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4 flex-1">
                            <FileText className="w-8 h-8 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{doc.originalFileName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(doc.createdAt)}
                                </span>
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <Badge className={getStatusBadge(doc.status)}>
                                  {doc.status}
                                </Badge>
                                {doc.uploadedByAdmin && (
                                  <Badge variant="secondary">Admin Upload</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMutation.mutate({ id: doc.id, serviceType: "general" })}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookkeeping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookkeeping Documents</CardTitle>
              <CardDescription>
                Financial documents, receipts, and bookkeeping records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookkeepingLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filterDocuments(bookkeepingDocuments as BookkeepingDocument[], "bookkeeping").length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No bookkeeping documents found. Upload financial documents to get started.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filterDocuments(bookkeepingDocuments as BookkeepingDocument[], "bookkeeping").map((doc: BookkeepingDocument) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4 flex-1">
                            <FileText className="w-8 h-8 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{doc.originalFileName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(doc.createdAt)}
                                </span>
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <Badge variant="outline">{doc.category}</Badge>
                                <Badge className={getStatusBadge(doc.reviewStatus)}>
                                  {doc.reviewStatus}
                                </Badge>
                                {doc.isDeductible && (
                                  <Badge className="bg-green-100 text-green-800">Deductible</Badge>
                                )}
                              </div>
                              {doc.amount && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Amount: ${(doc.amount / 100).toFixed(2)}
                                  {doc.vendor && ` • Vendor: ${doc.vendor}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMutation.mutate({ id: doc.id, serviceType: "bookkeeping" })}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Documents</CardTitle>
              <CardDescription>
                Employee timesheets, payroll reports, and HR documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payrollLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filterDocuments(payrollDocuments as PayrollDocument[], "payroll").length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No payroll documents found. Upload employee documents to get started.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filterDocuments(payrollDocuments as PayrollDocument[], "payroll").map((doc: PayrollDocument) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4 flex-1">
                            <FileText className="w-8 h-8 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{doc.originalFileName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(doc.createdAt)}
                                </span>
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <Badge variant="outline">{doc.documentType}</Badge>
                                <Badge className={getStatusBadge(doc.status)}>
                                  {doc.status}
                                </Badge>
                                {!doc.isUserUploaded && (
                                  <Badge variant="secondary">Admin Upload</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMutation.mutate({ id: doc.id, serviceType: "payroll" })}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}