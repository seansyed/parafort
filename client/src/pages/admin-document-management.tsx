import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Eye,
  Building2,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminDocumentRequestForm from "@/components/AdminDocumentRequestForm";

interface DocumentRequest {
  id: number;
  clientId: string;
  clientName: string;
  documentName: string;
  description?: string;
  serviceType?: string;
  status: 'requested' | 'uploaded' | 'reviewed' | 'approved' | 'rejected';
  requestedAt: string;
  uploadedAt?: string;
  uploadedFileName?: string;
  adminNotes?: string;
}

export default function AdminDocumentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'businessName' | 'documentName' | 'requestedAt'>('businessName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedBusinessEntity, setSelectedBusinessEntity] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all document requests for admin view
  const { data: allRequests = [], isLoading } = useQuery({
    queryKey: ['/api/admin/document-requests'],
    enabled: !!user && user.role === 'admin',
  });

  // Fetch all business entities for upload
  const { data: businessEntities = [] } = useQuery({
    queryKey: ['/api/business-entities'],
    enabled: !!user && user.role === 'admin',
  });

  // Upload document mutation with progress tracking
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !selectedBusinessEntity || !documentName || !documentType) {
        throw new Error("Please fill in all required fields and select a file");
      }

      setUploadStatus('uploading');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentName', documentName);
      formData.append('documentType', documentType);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percentComplete));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadStatus('processing');
            setTimeout(() => {
              setUploadStatus('complete');
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (e) {
                resolve({});
              }
            }, 800); // Brief processing delay for UX
          } else {
            setUploadStatus('error');
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || `Upload failed with status ${xhr.status}`));
            } catch (e) {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          setUploadStatus('error');
          reject(new Error('Network error occurred during upload'));
        });

        xhr.open('POST', `/api/admin/business-entities/${selectedBusinessEntity}/upload-document`);
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      toast({
        title: "Document Uploaded Successfully",
        description: "Document uploaded and client has been notified via email.",
      });
      
      // Reset form after showing completion
      setTimeout(() => {
        setSelectedFile(null);
        setDocumentName("");
        setDocumentType("");
        setSelectedBusinessEntity("");
        setUploadProgress(0);
        setUploadStatus('idle');
        setIsUploading(false);
      }, 2000);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/business-entities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/document-requests'] });
    },
    onError: (error: any) => {
      setUploadStatus('error');
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('idle');
        setIsUploading(false);
      }, 3000);
    },
  });

  const handleUpload = () => {
    if (uploadStatus === 'uploading' || uploadStatus === 'processing') {
      return; // Prevent double submission
    }
    setIsUploading(true);
    uploadMutation.mutate();
  };

  // Filter and sort requests based on search, status, service, and sorting preferences
  const filteredAndSortedRequests = Array.isArray(allRequests) ? allRequests
    .filter((request: DocumentRequest) => {
      const matchesSearch = 
        request.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.documentName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || request.status === statusFilter;
      const matchesService = serviceFilter === "all" || (request.serviceType && request.serviceType === serviceFilter);
      return matchesSearch && matchesStatus && matchesService;
    })
    .sort((a: DocumentRequest, b: DocumentRequest) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'businessName':
          compareValue = (a.clientName || '').localeCompare(b.clientName || '');
          break;
        case 'documentName':
          compareValue = (a.documentName || '').localeCompare(b.documentName || '');
          break;
        case 'requestedAt':
          compareValue = new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    }) : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'uploaded':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'reviewed':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRequestStats = () => {
    if (!Array.isArray(allRequests)) return { total: 0, pending: 0, uploaded: 0, completed: 0 };
    
    return {
      total: allRequests.length,
      pending: allRequests.filter(r => r.status === 'requested').length,
      uploaded: allRequests.filter(r => r.status === 'uploaded').length,
      completed: allRequests.filter(r => ['approved', 'rejected'].includes(r.status)).length,
    };
  };

  const stats = getRequestStats();

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">You need administrator privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
        <p className="text-gray-600">
          Request and manage document submissions from clients for business formation and compliance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uploaded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uploaded}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Document Requests</TabsTrigger>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="new-request">New Request</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by client name or document name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="formation">Business Formation</SelectItem>
                      <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                      <SelectItem value="payroll">Payroll</SelectItem>
                      <SelectItem value="tax">Tax Services</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="uploaded">Uploaded</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Document Requests ({filteredAndSortedRequests.length})
              </CardTitle>
              
              {/* Sorting Controls */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value: 'businessName' | 'documentName' | 'requestedAt') => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="businessName">Business Name</SelectItem>
                      <SelectItem value="documentName">Document Name</SelectItem>
                      <SelectItem value="requestedAt">Request Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1"
                >
                  {sortOrder === 'asc' ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mr-3" />
                  <span>Loading requests...</span>
                </div>
              ) : filteredAndSortedRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredAndSortedRequests.map((request: DocumentRequest) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{request.documentName}</h4>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Client: <span className="font-medium">{request.clientName}</span>
                          </p>
                          {request.description && (
                            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Requested: {formatDate(request.requestedAt)}
                            {request.uploadedAt && (
                              <span> • Uploaded: {formatDate(request.uploadedAt)}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {request.uploadedFileName && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              {request.uploadedFileName}
                            </span>
                            <Button variant="outline" size="sm" className="ml-auto">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      )}

                      {request.adminNotes && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Admin Notes:</h5>
                          <p className="text-sm text-gray-700">{request.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Requests</h3>
                  <p className="text-gray-600">
                    {searchQuery || statusFilter !== "All" 
                      ? "No requests match your search criteria." 
                      : "No document requests have been created yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-500" />
                Upload Documents to Business Entity
              </CardTitle>
              <p className="text-sm text-gray-600">
                Upload documents directly to a specific business entity's document vault.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Entity Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Business Entity</label>
                <Select value={selectedBusinessEntity} onValueChange={setSelectedBusinessEntity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search and select a business entity..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.isArray(businessEntities) && businessEntities.length > 0 ? businessEntities.map((entity: any) => {
                      const displayName = entity.businessName || entity.legalName || entity.name || `Entity ${entity.id}`;
                      const entityType = entity.entityType || entity.type || 'Unknown';
                      const state = entity.state || entity.st || '';
                      
                      return (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          <div className="flex items-center gap-2 w-full">
                            <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <div className="flex flex-col text-left min-w-0 flex-1">
                              <span className="font-medium text-gray-900 truncate">
                                {displayName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {entityType}{state && ` • ${state}`}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    }) : (
                      <SelectItem value="no-entities" disabled>
                        <span className="text-gray-500">No business entities found</span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Document Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Document Name</label>
                <Input
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name (e.g., Articles of Incorporation)"
                />
              </div>

              {/* Document Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Document Type</label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formation">Formation Documents</SelectItem>
                    <SelectItem value="compliance">Compliance Documents</SelectItem>
                    <SelectItem value="tax">Tax Documents</SelectItem>
                    <SelectItem value="financial">Financial Documents</SelectItem>
                    <SelectItem value="legal">Legal Documents</SelectItem>
                    <SelectItem value="operational">Operational Documents</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Upload Progress & Status */}
              {uploadStatus !== 'idle' && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {uploadStatus === 'uploading' && 'Uploading Document...'}
                      {uploadStatus === 'processing' && 'Processing Upload...'}
                      {uploadStatus === 'complete' && 'Upload Complete!'}
                      {uploadStatus === 'error' && 'Upload Failed'}
                    </h4>
                    <span className="text-sm text-gray-600">
                      {uploadStatus === 'uploading' && `${uploadProgress}%`}
                      {uploadStatus === 'processing' && 'Please wait...'}
                      {uploadStatus === 'complete' && '100%'}
                      {uploadStatus === 'error' && 'Error'}
                    </span>
                  </div>
                  
                  <Progress 
                    value={uploadStatus === 'complete' ? 100 : uploadProgress} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center gap-2 text-sm">
                    {uploadStatus === 'uploading' && (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full" />
                        <span className="text-gray-600">Uploading file to server...</span>
                      </>
                    )}
                    {uploadStatus === 'processing' && (
                      <>
                        <div className="animate-pulse w-4 h-4 bg-blue-500 rounded-full" />
                        <span className="text-gray-600">Processing document and sending notifications...</span>
                      </>
                    )}
                    {uploadStatus === 'complete' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-700">Document uploaded successfully and client notified!</span>
                      </>
                    )}
                    {uploadStatus === 'error' && (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-700">Upload failed. Please try again.</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !selectedBusinessEntity || !documentName || !documentType || uploadStatus === 'uploading' || uploadStatus === 'processing'}
                  className="bg-green-500 hover:bg-[#E54A00] disabled:opacity-50"
                >
                  {uploadStatus === 'uploading' || uploadStatus === 'processing' ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Processing...'}
                    </>
                  ) : uploadStatus === 'complete' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Upload Complete
                    </>
                  ) : uploadStatus === 'error' ? (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-request">
          <AdminDocumentRequestForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}