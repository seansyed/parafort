import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Upload, 
  Plus, 
  FolderPlus, 
  Search, 
  Filter,
  Download,
  Eye,
  Trash2,
  Edit,
  Folder,
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  ShieldCheck,
  FileCheck,
  Calculator,
  Briefcase,
  Scale,
  TrendingUp
} from "lucide-react";

interface Document {
  id: number;
  fileName: string;
  originalName: string;
  uploadDate: string;
  fileSize: number;
  uploadedBy: string;
  folderId?: number;
  tags?: string[];
  description?: string;
  businessEntityId?: string;
  serviceType?: string;
}

interface Folder {
  id: number;
  name: string;
  parentId?: number;
  description?: string;
  createdAt: string;
  serviceType?: string;
  children?: Folder[];
}

interface BusinessEntity {
  id: string;
  companyName: string;
  entityType: string;
  state: string;
}

interface ServiceFolder {
  id: string;
  name: string;
  icon: any;
  description: string;
  subfolders: Folder[];
}

export default function AdminDocuments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFolder, setFilterFolder] = useState<number | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [newFolderParentId, setNewFolderParentId] = useState<number | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  // Fetch documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/admin/documents"],
    retry: false,
  });

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["/api/folders"],
    retry: false,
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("POST", "/api/admin/documents/upload", formData);
    },
    onSuccess: () => {
      // Invalidate all document-related queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      // Invalidate client documents queries (for client management page)
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key && key.includes('/api/admin/clients/') && key.includes('/documents');
        }
      });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadDescription("");
      setSelectedFolder(null);
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (folderData: any) => {
      return await apiRequest("POST", "/api/folders", folderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setIsFolderDialogOpen(false);
      setNewFolderName("");
      setNewFolderDescription("");
      setNewFolderParentId(null);
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Create Folder Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return await apiRequest("DELETE", `/api/admin/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", uploadDescription);
    if (selectedFolder) {
      formData.append("folderId", selectedFolder.toString());
    }

    uploadMutation.mutate(formData);
  };

  const handleCreateFolder = () => {
    const folderData = {
      name: newFolderName,
      description: newFolderDescription,
      parentId: newFolderParentId,
    };

    createFolderMutation.mutate(folderData);
  };

  const buildFolderTree = (folders: Folder[]): Folder[] => {
    const folderMap = new Map<number, Folder & { children: Folder[] }>();
    
    // Initialize all folders with children array
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });
    
    const rootFolders: (Folder & { children: Folder[] })[] = [];
    
    // Build the tree structure
    folders.forEach(folder => {
      const folderWithChildren = folderMap.get(folder.id)!;
      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId)!.children.push(folderWithChildren);
      } else {
        rootFolders.push(folderWithChildren);
      }
    });
    
    return rootFolders;
  };

  const renderFolderTree = (folders: (Folder & { children: Folder[] })[], level = 0): JSX.Element[] => {
    return folders.map(folder => (
      <div key={folder.id} className={`ml-${level * 4}`}>
        <div 
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => setFilterFolder(filterFolder === folder.id ? null : folder.id)}
        >
          {folder.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newExpanded = new Set(expandedFolders);
                if (expandedFolders.has(folder.id)) {
                  newExpanded.delete(folder.id);
                } else {
                  newExpanded.add(folder.id);
                }
                setExpandedFolders(newExpanded);
              }}
              className="p-1"
            >
              {expandedFolders.has(folder.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <Folder className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">{folder.name}</span>
          {filterFolder === folder.id && (
            <Badge variant="secondary" className="text-xs">Selected</Badge>
          )}
        </div>
        {expandedFolders.has(folder.id) && folder.children.length > 0 && (
          <div className="ml-4">
            {renderFolderTree(folder.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const filteredDocuments = (documents as Document[]).filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = filterFolder ? doc.folderId === filterFolder : true;
    return matchesSearch && matchesFolder;
  });

  const folderTree = buildFolderTree(folders as Folder[]);

  if (documentsLoading || foldersLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize all system documents</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
            <DialogTrigger asChild>
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  height: '40px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  border: '1px solid #16a34a',
                  backgroundColor: 'white',
                  color: '#16a34a',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#16a34a';
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder to organize your documents
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div>
                  <Label htmlFor="folderDescription">Description (Optional)</Label>
                  <Textarea
                    id="folderDescription"
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    placeholder="Enter folder description"
                  />
                </div>
                <div>
                  <Label htmlFor="parentFolder">Parent Folder (Optional)</Label>
                  <Select value={newFolderParentId?.toString() || "none"} onValueChange={(value) => setNewFolderParentId(value === "none" ? null : parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Root Level)</SelectItem>
                      {(folders as Folder[]).map(folder => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFolderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateFolder}
                  disabled={!newFolderName || createFolderMutation.isPending}
                >
                  {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  height: '40px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  border: 'none',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>
                  Upload a document to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Enter document description"
                  />
                </div>
                <div>
                  <Label htmlFor="folder">Folder (Optional)</Label>
                  <Select value={selectedFolder?.toString() || "none"} onValueChange={(value) => setSelectedFolder(value === "none" ? null : parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Folder (Root Level)</SelectItem>
                      {(folders as Folder[]).map(folder => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folder Tree Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Folders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterFolder(null)}
                  className={`w-full text-left p-2 rounded flex items-center gap-2 ${!filterFolder ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  <FileText className="h-4 w-4" />
                  All Documents
                  <Badge variant="outline" className="ml-auto">
                    {(documents as Document[]).length}
                  </Badge>
                </button>
                {folderTree.length > 0 ? (
                  renderFolderTree(folderTree)
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No folders created</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterFolder ? "Try adjusting your search or filter." : "Upload your first document to get started."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{document.originalName}</h4>
                          <p className="text-sm text-gray-600">
                            Uploaded {new Date(document.uploadDate).toLocaleDateString()} by {document.uploadedBy}
                          </p>
                          {document.description && (
                            <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {(document.fileSize / 1024).toFixed(1)} KB
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteMutation.mutate(document.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}