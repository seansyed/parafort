import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, Download, FileText, Trash2, Eye, Calendar, User, Building, Filter, Plus, 
  Send, Share2, MessageSquare, Tag, History, Shield, Search, Archive, 
  FileImage, FilePdf, FileSpreadsheet, FileVideo, ChevronDown, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

interface EnhancedDocument {
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
  version: number;
  parentDocumentId?: number;
  isLatestVersion: boolean;
  extractedText?: string;
  aiTags?: string[];
  aiConfidenceScore?: number;
  workflowStage: string;
  downloadCount: number;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentComment {
  id: number;
  documentId: number;
  userId: string;
  comment: string;
  isInternal: boolean;
  parentCommentId?: number;
  createdAt: string;
  updatedAt: string;
}

interface DocumentVersion {
  id: number;
  documentId: number;
  versionNumber: number;
  fileName: string;
  fileSize: number;
  changeDescription?: string;
  createdBy: string;
  createdAt: string;
}

interface DocumentShare {
  id: number;
  documentId: number;
  sharedWithUserId?: string;
  sharedWithEmail?: string;
  permission: 'view' | 'edit' | 'download';
  expiresAt?: string;
  shareToken: string;
  shareUrl: string;
  accessCount: number;
  createdAt: string;
}

export function EnhancedDocumentManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [selectedServiceType, setSelectedServiceType] = useState<string>("all");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<EnhancedDocument | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<'view' | 'edit' | 'download'>('view');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Fetch documents with enhanced filtering
  const { data: documents = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/documents/enhanced", selectedServiceType, selectedDocumentType, selectedStatus, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedServiceType !== "all") params.append("serviceType", selectedServiceType);
      if (selectedDocumentType !== "all") params.append("documentType", selectedDocumentType);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (searchQuery) params.append("search", searchQuery);
      
      return await apiRequest("GET", `/api/documents/enhanced?${params.toString()}`);
    },
  });

  // Fetch document comments
  const { data: comments = [] } = useQuery({
    queryKey: ["/api/documents", selectedDocument?.id, "comments"],
    queryFn: () => selectedDocument ? apiRequest("GET", `/api/documents/${selectedDocument.id}/comments`) : [],
    enabled: !!selectedDocument && showComments,
  });

  // Fetch document versions
  const { data: versions = [] } = useQuery({
    queryKey: ["/api/documents", selectedDocument?.id, "versions"],
    queryFn: () => selectedDocument ? apiRequest("GET", `/api/documents/${selectedDocument.id}/versions`) : [],
    enabled: !!selectedDocument && showVersions,
  });

  // Upload mutation with progress tracking
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const files = formData.getAll('files') as File[];
      const totalFiles = files.length;
      let completedFiles = 0;

      for (const file of files) {
        const singleFormData = new FormData();
        singleFormData.append('files', file);
        singleFormData.append('serviceType', selectedServiceType);
        singleFormData.append('documentType', selectedDocumentType);

        await apiRequest("POST", "/api/documents/enhanced/upload", singleFormData);
        completedFiles++;
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: (completedFiles / totalFiles) * 100
        }));
      }

      return { success: true, filesUploaded: totalFiles };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents/enhanced"] });
      toast({
        title: "Upload Successful",
        description: "Documents have been uploaded and are being processed.",
      });
      setUploadProgress({});
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in again to upload documents.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload documents",
        variant: "destructive",
      });
      setUploadProgress({});
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ documentId, comment }: { documentId: number; comment: string }) => {
      return await apiRequest("POST", `/api/documents/${documentId}/comments`, { comment, isInternal: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", selectedDocument?.id, "comments"] });
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the document.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  // Share document mutation
  const shareDocumentMutation = useMutation({
    mutationFn: async ({ documentId, email, permission }: { documentId: number; email: string; permission: string }) => {
      return await apiRequest("POST", `/api/documents/${documentId}/share`, {
        sharedWithEmail: email,
        permission
      });
    },
    onSuccess: (data: DocumentShare) => {
      toast({
        title: "Document Shared",
        description: `Document shared successfully. Share URL: ${data.shareUrl}`,
      });
      setShareEmail("");
      setShowShare(false);
    },
    onError: (error: any) => {
      toast({
        title: "Share Failed",
        description: error.message || "Failed to share document",
        variant: "destructive",
      });
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return await apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents/enhanced"] });
      setSelectedDocument(null);
      toast({
        title: "Document Deleted",
        description: "Document has been moved to trash.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  // Archive document mutation
  const archiveMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return await apiRequest("POST", `/api/documents/${documentId}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents/enhanced"] });
      setSelectedDocument(null);
      toast({
        title: "Document Archived",
        description: "Document has been archived successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Archive Failed",
        description: error.message || "Failed to archive document",
        variant: "destructive",
      });
    },
  });

  // File upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (selectedServiceType === "all" || selectedDocumentType === "all") {
      toast({
        title: "Selection Required",
        description: "Please select a service type and document type before uploading.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    uploadMutation.mutate(formData);
  }, [selectedServiceType, selectedDocumentType, uploadMutation, toast]);

  // Download handler
  const handleDownload = async (doc: EnhancedDocument) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}/download`);
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FilePdf className="h-4 w-4" />;
    if (mimeType.includes("image")) return <FileImage className="h-4 w-4" />;
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return <FileSpreadsheet className="h-4 w-4" />;
    if (mimeType.includes("video")) return <FileVideo className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "archived": return "bg-yellow-100 text-yellow-800";
      case "pending_review": return "bg-blue-100 text-blue-800";
      case "deleted": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Document Manager</h1>
          <p className="text-muted-foreground">Advanced document management with AI-powered features</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} className="bg-green-500 hover:bg-[#E54F00]">
          <Plus className="h-4 w-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Service Type</Label>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="formation">Business Formation</SelectItem>
                  <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="tax">Tax Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Document Type</Label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="tax_document">Tax Document</SelectItem>
                  <SelectItem value="financial_statement">Financial Statement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="all">All Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : documents.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
              <p className="text-muted-foreground">Upload your first document or adjust your filters.</p>
            </CardContent>
          </Card>
        ) : (
          documents.map((doc: EnhancedDocument) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedDocument(doc)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.mimeType)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{doc.originalFileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(doc.fileSize)} • Version {doc.version}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="capitalize">{doc.serviceType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{doc.documentType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span>{doc.downloadCount}</span>
                  </div>
                </div>

                {doc.aiTags && doc.aiTags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.aiTags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.aiTags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.aiTags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span>
                  {doc.aiConfidenceScore && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {Math.round(doc.aiConfidenceScore * 100)}% AI
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Document Details Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getFileIcon(selectedDocument.mimeType)}
                {selectedDocument.originalFileName}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
                <TabsTrigger value="versions">Versions ({versions.length})</TabsTrigger>
                <TabsTrigger value="sharing">Sharing</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">File Information</Label>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{formatFileSize(selectedDocument.fileSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{selectedDocument.mimeType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Version:</span>
                          <span>{selectedDocument.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Downloads:</span>
                          <span>{selectedDocument.downloadCount}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Document Classification</Label>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Service:</span>
                          <span className="capitalize">{selectedDocument.serviceType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{selectedDocument.documentType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className={getStatusColor(selectedDocument.status)}>
                            {selectedDocument.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Workflow:</span>
                          <span className="capitalize">{selectedDocument.workflowStage}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedDocument.aiTags && selectedDocument.aiTags.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">AI-Generated Tags</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedDocument.aiTags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {selectedDocument.aiConfidenceScore && (
                          <p className="text-xs text-muted-foreground mt-2">
                            AI Confidence: {Math.round(selectedDocument.aiConfidenceScore * 100)}%
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium">Upload Information</Label>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Uploaded:</span>
                          <span>{new Date(selectedDocument.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>By Admin:</span>
                          <span>{selectedDocument.uploadedByAdmin ? "Yes" : "No"}</span>
                        </div>
                        {selectedDocument.lastAccessedAt && (
                          <div className="flex justify-between">
                            <span>Last Accessed:</span>
                            <span>{new Date(selectedDocument.lastAccessedAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDocument.extractedText && (
                  <div>
                    <Label className="text-sm font-medium">Extracted Text (AI)</Label>
                    <ScrollArea className="h-32 w-full border rounded-md p-3 mt-2">
                      <p className="text-sm whitespace-pre-wrap">{selectedDocument.extractedText}</p>
                    </ScrollArea>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => handleDownload(selectedDocument)} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={() => archiveMutation.mutate(selectedDocument.id)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button variant="destructive" onClick={() => deleteMutation.mutate(selectedDocument.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => addCommentMutation.mutate({ documentId: selectedDocument.id, comment: newComment })}
                      disabled={!newComment.trim() || addCommentMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {comments.map((comment: DocumentComment) => (
                        <div key={comment.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{comment.userId}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
                          {comment.isInternal && (
                            <Badge variant="secondary" className="mt-2 text-xs">Internal</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="versions" className="space-y-4">
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {versions.map((version: DocumentVersion) => (
                      <div key={version.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-sm">Version {version.versionNumber}</span>
                            {selectedDocument.version === version.versionNumber && (
                              <Badge variant="default" className="ml-2 text-xs">Current</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(version.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatFileSize(version.fileSize)}</p>
                        {version.changeDescription && (
                          <p className="text-sm mt-1">{version.changeDescription}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="sharing" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Share Document</Label>
                    <div className="mt-2 space-y-3">
                      <Input
                        placeholder="Enter email address"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        type="email"
                      />
                      <Select value={sharePermission} onValueChange={(value: any) => setSharePermission(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View Only</SelectItem>
                          <SelectItem value="download">View & Download</SelectItem>
                          <SelectItem value="edit">View, Download & Edit</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={() => shareDocumentMutation.mutate({ 
                          documentId: selectedDocument.id, 
                          email: shareEmail, 
                          permission: sharePermission 
                        })}
                        disabled={!shareEmail || shareDocumentMutation.isPending}
                        className="w-full"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Document
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card className="fixed bottom-4 right-4 w-80">
          <CardHeader>
            <CardTitle className="text-sm">Uploading Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="truncate">{fileName}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}