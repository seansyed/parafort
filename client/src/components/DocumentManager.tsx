import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Download,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Trash2,
  Eye,
  Brain,
  Tag
} from 'lucide-react';

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
  version: number;
  extractedText?: string;
  aiConfidenceScore?: number;
  aiTags?: string[];
}

interface AIAnalysis {
  summary: string;
  documentType: string;
  keyInformation: string[];
  confidenceScore: number;
  suggestedTags: string[];
  complianceFlags: string[];
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
    case 'processing':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
};

const getFileIcon = (mimeType: string) => {
  if (mimeType?.includes('pdf')) {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  return <FileText className="h-4 w-4 text-gray-500" />;
};

export default function DocumentManager() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["/api/documents"],
    enabled: isAuthenticated,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: Unauthorized');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Upload Successful",
        description: "Document uploaded and being processed with AI analysis.",
      });
    },
    onError: (error: Error) => {
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
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: Unauthorized');
        }
        throw new Error('Delete failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Delete Successful",
        description: "Document has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in again to delete documents.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', 'general');
    formData.append('serviceType', serviceFilter !== 'all' ? serviceFilter : 'formation');

    uploadMutation.mutate(formData);
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}/download`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in again to download documents.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(`Download failed: ${response.statusText}`);
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
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAIAnalysis = async (doc: Document) => {
    setIsAnalyzing(true);
    setSelectedDoc(doc);
    
    try {
      const response = await fetch(`/api/documents/${doc.id}/ai-analysis`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const analysis = await response.json();
      setAiAnalysis(analysis);
      
      toast({
        title: "AI Analysis Complete",
        description: "Document has been analyzed with AI insights.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze document with AI.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredDocuments = (documents as Document[]).filter((doc: Document) => {
    const matchesSearch = doc.originalFileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.documentType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesService = serviceFilter === "all" || doc.serviceType?.toLowerCase() === serviceFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesService;
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-gray-600">Please log in to access your documents.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Document Management</h1>
          <p className="text-gray-600">Intelligent document processing with AI analysis and compliance monitoring</p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Document Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadMutation.isPending}
                      className="bg-green-500 hover:bg-[#E54D00] text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Select value={serviceFilter} onValueChange={setServiceFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="formation">Business Formation</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="tax">Tax Services</SelectItem>
                        <SelectItem value="legal">Legal Documents</SelectItem>
                        <SelectItem value="payroll">Payroll</SelectItem>
                        <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>AI Score</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDocuments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                              No documents found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDocuments.map((doc: Document) => (
                            <TableRow key={doc.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  {getFileIcon(doc.mimeType)}
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {doc.originalFileName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {(doc.fileSize / 1024).toFixed(1)} KB
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="capitalize text-gray-700">
                                  {doc.documentType}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="capitalize text-gray-700">
                                  {doc.serviceType}
                                </span>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(doc.status)}
                              </TableCell>
                              <TableCell>
                                {doc.aiConfidenceScore ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                                      <div 
                                        className="h-2 bg-green-500 rounded-full"
                                        style={{ width: `${doc.aiConfidenceScore}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">{doc.aiConfidenceScore}%</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">Not analyzed</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-700">
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAIAnalysis(doc)}
                                    disabled={isAnalyzing}
                                    className="text-green-500 hover:text-[#E54D00]"
                                  >
                                    <Brain className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedDoc(doc)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(doc)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(doc.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-green-500" />
                  <span>AI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDoc ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{selectedDoc.originalFileName}</h4>
                      <p className="text-sm text-gray-600">
                        {selectedDoc.documentType} • {selectedDoc.serviceType}
                      </p>
                    </div>

                    {aiAnalysis ? (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Summary</h5>
                          <p className="text-sm text-gray-600">{aiAnalysis.summary}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Confidence Score</h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-green-500 rounded-full"
                                style={{ width: `${aiAnalysis.confidenceScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{aiAnalysis.confidenceScore}%</span>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Key Information</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {aiAnalysis.keyInformation.map((info, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{info}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">AI Tags</h5>
                          <div className="flex flex-wrap gap-1">
                            {aiAnalysis.suggestedTags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {aiAnalysis.complianceFlags.length > 0 && (
                          <div>
                            <h5 className="font-medium text-red-700 mb-2">Compliance Flags</h5>
                            <ul className="text-sm text-red-600 space-y-1">
                              {aiAnalysis.complianceFlags.map((flag, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{flag}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm mb-4">
                          Click the AI analysis button to get insights about this document
                        </p>
                        <Button
                          onClick={() => handleAIAnalysis(selectedDoc)}
                          disabled={isAnalyzing}
                          className="bg-green-500 hover:bg-[#E54D00] text-white"
                        >
                          {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Select a document to view AI analysis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}