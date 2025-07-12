import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, Eye, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Plus, Building2, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface Document {
  id: number;
  clientId: string;
  documentName: string;
  requestedBy: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  uploadedFileName?: string;
  uploadedFilePath?: string;
  reviewedBy?: string;
  completedDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredFields: string[];
  estimatedDays: number;
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: "articles-incorporation",
    name: "Articles of Incorporation",
    description: "Legal document that establishes a corporation",
    category: "Formation",
    requiredFields: ["Company Name", "Registered Agent", "Shares Authorized"],
    estimatedDays: 7
  },
  {
    id: "operating-agreement",
    name: "Operating Agreement",
    description: "Legal document outlining LLC operations and member responsibilities",
    category: "Formation", 
    requiredFields: ["Company Name", "Members", "Management Structure"],
    estimatedDays: 5
  },
  {
    id: "bylaws",
    name: "Corporate Bylaws",
    description: "Internal rules governing corporation operations",
    category: "Governance",
    requiredFields: ["Company Name", "Board Structure", "Meeting Procedures"],
    estimatedDays: 3
  },
  {
    id: "employment-agreement",
    name: "Employment Agreement",
    description: "Contract between employer and employee",
    category: "HR",
    requiredFields: ["Employee Name", "Position", "Compensation", "Start Date"],
    estimatedDays: 2
  },
  {
    id: "non-disclosure",
    name: "Non-Disclosure Agreement",
    description: "Confidentiality agreement between parties",
    category: "Legal",
    requiredFields: ["Parties", "Confidential Information", "Duration"],
    estimatedDays: 1
  },
  {
    id: "service-agreement",
    name: "Service Agreement",
    description: "Contract for professional services",
    category: "Contracts",
    requiredFields: ["Service Provider", "Client", "Scope of Work", "Payment Terms"],
    estimatedDays: 3
  }
];

export default function DocumentCenter() {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [requestForm, setRequestForm] = useState({
    documentName: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch document requests
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/document-requests"],
    retry: false,
  });

  // Create document request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      return await apiRequest("POST", "/api/document-requests", requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/document-requests"] });
      toast({
        title: "Request Created",
        description: "Document request has been submitted successfully.",
      });
      setRequestForm({
        documentName: "",
        description: "",
        priority: "medium",
        dueDate: ""
      });
      setSelectedTemplate(null);
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to create document request.",
        variant: "destructive",
      });
    },
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("document", file);
      return await apiRequest("POST", `/api/document-requests/${id}/upload`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/document-requests"] });
      toast({
        title: "Upload Successful",
        description: "Document has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document.",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || doc.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateRequest = () => {
    if (!requestForm.documentName) {
      toast({
        title: "Missing Information",
        description: "Please provide a document name.",
        variant: "destructive",
      });
      return;
    }

    createRequestMutation.mutate({
      documentName: requestForm.documentName,
      description: requestForm.description,
      priority: requestForm.priority,
      dueDate: requestForm.dueDate || null,
    });
  };

  const handleFileUpload = (documentId: number, file: File) => {
    uploadMutation.mutate({ id: documentId, file });
  };

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setRequestForm({
      ...requestForm,
      documentName: template.name,
      description: template.description
    });
  };

  const downloadDocument = async (documentId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/document-requests/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the document.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Center</h1>
          <p className="text-gray-600 mt-2">Manage business documents and legal filings</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-[#E64A00] text-white font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Document Request</DialogTitle>
                <DialogDescription>
                  Request a new business document or legal filing
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="template" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="template">From Template</TabsTrigger>
                  <TabsTrigger value="custom">Custom Request</TabsTrigger>
                </TabsList>
                
                <TabsContent value="template" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <Badge variant="outline">{template.category}</Badge>
                            <span>{template.estimatedDays} days</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="documentName">Document Name</Label>
                      <Input
                        id="documentName"
                        value={requestForm.documentName}
                        onChange={(e) => setRequestForm({
                          ...requestForm,
                          documentName: e.target.value
                        })}
                        placeholder="Enter document name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={requestForm.description}
                        onChange={(e) => setRequestForm({
                          ...requestForm,
                          description: e.target.value
                        })}
                        placeholder="Describe the document requirements"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select 
                          value={requestForm.priority} 
                          onValueChange={(value) => setRequestForm({
                            ...requestForm,
                            priority: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={requestForm.dueDate}
                          onChange={(e) => setRequestForm({
                            ...requestForm,
                            dueDate: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={handleCreateRequest}
                  disabled={createRequestMutation.isPending}
                  className="bg-green-500 hover:bg-[#E64A00] text-white font-semibold"
                >
                  {createRequestMutation.isPending ? "Creating..." : "Create Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Document Requests</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document List */}
          <div className="grid gap-4">
            {documentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading documents...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No documents found</p>
                  <p className="text-sm text-gray-500">Create your first document request to get started</p>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map((document: Document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {document.documentName}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(document.status)}
                            <Badge variant={getStatusBadgeVariant(document.status)}>
                              {document.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Badge variant={getPriorityBadgeVariant(document.priority)}>
                            {document.priority}
                          </Badge>
                        </div>
                        
                        {document.description && (
                          <p className="text-gray-600 mb-3">{document.description}</p>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Requested by {document.requestedBy}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {format(new Date(document.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                          
                          {document.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Due {format(new Date(document.dueDate), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {document.uploadedFileName && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(document.id, document.uploadedFileName!)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        
                        {document.status === 'pending' && (
                          <label className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </span>
                            </Button>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(document.id, file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{template.category}</Badge>
                      <span className="text-sm text-gray-600">{template.estimatedDays} days</span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Required Information:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {template.requiredFields.map((field, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-green-500 hover:bg-[#E64A00] text-white font-semibold"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter((d: Document) => d.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {documents.filter((d: Document) => d.status === 'in_progress').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-yellow-600">
                  {documents.filter((d: Document) => d.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
                <CardDescription>Percentage of completed document requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {Math.round((documents.filter((d: Document) => d.status === 'completed').length / documents.length) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(documents.filter((d: Document) => d.status === 'completed').length / documents.length) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}