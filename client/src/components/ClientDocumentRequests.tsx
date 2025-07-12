import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download,
  Eye
} from "lucide-react";

interface RequestedDocument {
  id: number;
  documentName: string;
  description?: string;
  status: 'requested' | 'uploaded' | 'reviewed' | 'approved' | 'rejected';
  requestedAt: string;
  uploadedAt?: string;
  uploadedFileName?: string;
  adminNotes?: string;
}

interface ClientDocumentRequestsProps {
  clientId: string;
}

export default function ClientDocumentRequests({ clientId }: ClientDocumentRequestsProps) {
  const [uploadingFileId, setUploadingFileId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch document requests for this client
  const { data: requestedDocuments = [], isLoading, error } = useQuery({
    queryKey: ['/api/client/document-requests', clientId],
    queryFn: async () => {
      const response = await fetch(`/api/client/document-requests/${clientId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch document requests: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!clientId,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ requestId, file }: { requestId: number; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestId', requestId.toString());
      
      return await apiRequest('POST', '/api/client/upload-document', formData);
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Document Uploaded",
        description: "Your document has been successfully uploaded and is being reviewed.",
      });
      
      // Clear the selected file
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[variables.requestId];
        return newFiles;
      });
      
      // Refresh the requests list
      queryClient.invalidateQueries({ queryKey: ['/api/client/document-requests', clientId] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUploadingFileId(null);
    },
  });

  const handleFileSelect = (requestId: number, file: File | undefined) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [requestId]: file }));
    } else {
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[requestId];
        return newFiles;
      });
    }
  };

  const handleSubmitUpload = async (requestId: number) => {
    const file = selectedFiles[requestId];
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFileId(requestId);
    uploadMutation.mutate({ requestId, file });
  };

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mr-3" />
            <span>Loading document requests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load document requests. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requestedDocuments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Document Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Requested</h3>
            <p className="text-gray-600">
              No documents are currently requested for your account. You'll be notified when documents are needed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" />
          Document Requests ({requestedDocuments.length})
        </CardTitle>
        <p className="text-sm text-gray-600">
          Upload the requested documents for your business formation or compliance needs.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {requestedDocuments.map((doc: RequestedDocument) => (
          <div
            key={doc.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            {/* Document Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{doc.documentName}</h4>
                {doc.description && (
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Requested on {new Date(doc.requestedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(doc.status)}
                <Badge className={getStatusColor(doc.status)}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Upload Section - Only show if not yet uploaded or if rejected */}
            {(doc.status === 'requested' || doc.status === 'rejected') && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`file-${doc.id}`}>
                    Select Document File
                  </Label>
                  <Input
                    id={`file-${doc.id}`}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(doc.id, e.target.files?.[0])}
                    disabled={uploadingFileId === doc.id}
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, Word documents, images (JPG, PNG)
                  </p>
                </div>

                {selectedFiles[doc.id] && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {selectedFiles[doc.id].name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(selectedFiles[doc.id].size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      onClick={() => handleSubmitUpload(doc.id)}
                      disabled={uploadingFileId === doc.id}
                      size="sm"
                      className="bg-green-500 hover:bg-green-700"
                    >
                      {uploadingFileId === doc.id ? (
                        <>
                          <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Uploaded File Info */}
            {doc.uploadedFileName && doc.uploadedAt && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    File Uploaded: {doc.uploadedFileName}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Admin Notes */}
            {doc.adminNotes && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-1">Admin Notes:</h5>
                <p className="text-sm text-blue-800">{doc.adminNotes}</p>
              </div>
            )}

            {/* Rejection Notice */}
            {doc.status === 'rejected' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Document was rejected. Please upload a new version.
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}