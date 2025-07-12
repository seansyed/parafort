import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  Pencil,
  ChevronDown,
  Building2,
  Users,
  ShieldCheck,
  FileCheck,
  Calculator,
  Briefcase,
  Scale,
  TrendingUp,
  Mail,
  Hash,
  X,
  CheckSquare,
  Award,
  Check,
  ChevronsUpDown
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
  name: string;
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

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedServiceFolder, setSelectedServiceFolder] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  // Form states
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [newFolderServiceType, setNewFolderServiceType] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFolderId, setUploadFolderId] = useState<string>("");
  const [uploadBusinessEntity, setUploadBusinessEntity] = useState<string>("");
  const [uploadServiceType, setUploadServiceType] = useState<string>("");
  const [businessEntityPopoverOpen, setBusinessEntityPopoverOpen] = useState(false);
  
  // Edit folder states
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [showEditFolderDialog, setShowEditFolderDialog] = useState(false);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderDescription, setEditFolderDescription] = useState("");
  
  // Delete confirmation states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Service folders configuration
  const serviceFolders: ServiceFolder[] = [
    {
      id: "business-formation",
      name: "Business Formation",
      icon: Building2,
      description: "Entity formation documents and compliance",
      subfolders: []
    },
    {
      id: "boir",
      name: "BOIR Filing",
      icon: FileText,
      description: "Beneficial Ownership Information Reports",
      subfolders: []
    },
    {
      id: "digital-mailbox",
      name: "Digital Mailbox",
      icon: Mail,
      description: "Digital mail management and forwarding",
      subfolders: []
    },
    {
      id: "ein-management",
      name: "EIN Management",
      icon: Hash,
      description: "Employer Identification Number applications",
      subfolders: []
    },
    {
      id: "business-dissolution",
      name: "Business Dissolution",
      icon: X,
      description: "Business dissolution and termination forms",
      subfolders: []
    },
    {
      id: "name-change",
      name: "Name Change",
      icon: Edit,
      description: "Business name change documentation",
      subfolders: []
    },
    {
      id: "s-corporation-election",
      name: "S-Corporation Election",
      icon: CheckSquare,
      description: "S-Corporation tax election forms",
      subfolders: []
    },
    {
      id: "business-licenses",
      name: "Business Licenses",
      icon: Award,
      description: "Business license and permit applications",
      subfolders: []
    },
    {
      id: "payroll-services",
      name: "Payroll Services",
      icon: Users,
      description: "Employee management and payroll documents",
      subfolders: []
    },
    {
      id: "annual-reports",
      name: "Annual Reports",
      icon: FileCheck,
      description: "Annual filing and compliance reports",
      subfolders: []
    },
    {
      id: "tax-services",
      name: "Tax Services",
      icon: Calculator,
      description: "Tax preparation and filing documents",
      subfolders: []
    },
    {
      id: "legal-documents",
      name: "Legal Documents",
      icon: Scale,
      description: "Contracts, agreements, and legal filings",
      subfolders: []
    },
    {
      id: "compliance",
      name: "Compliance & Licenses",
      icon: ShieldCheck,
      description: "Business licenses and regulatory compliance",
      subfolders: []
    },
    {
      id: "bookkeeping",
      name: "Bookkeeping Services",
      icon: TrendingUp,
      description: "Financial records and accounting documents",
      subfolders: []
    },
    {
      id: "registered-agent",
      name: "Registered Agent",
      icon: Briefcase,
      description: "Registered agent services and documents",
      subfolders: []
    }
  ];

  // Fetch data
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["/api/folders"],
    retry: false,
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/admin/documents"],
    retry: false,
  });

  const { data: businessEntities = [], isLoading: businessEntitiesLoading } = useQuery({
    queryKey: ["/api/admin/business-entities"],
    retry: false,
  });



  // Build hierarchical folder structure
  const buildFolderHierarchy = (parentId: number | null = null): any[] => {
    return folders
      .filter(f => f.parentId === parentId)
      .map(folder => ({
        ...folder,
        children: buildFolderHierarchy(folder.id)
      }));
  };

  const groupedFolders = serviceFolders.map(service => ({
    ...service,
    subfolders: buildFolderHierarchy(null).filter(folder => 
      folder.serviceType === service.id
    )
  }));

  // Mutations
  const createFolderMutation = useMutation({
    mutationFn: async (folderData: { name: string; description: string; serviceType: string; parentId?: number }) => {
      return apiRequest("POST", "/api/folders", folderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      setShowCreateFolderDialog(false);
      setNewFolderName("");
      setNewFolderDescription("");
      setNewFolderServiceType("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      });
    },
  });

  // Edit folder mutation
  const editFolderMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: number; name: string; description: string }) => {
      return apiRequest("PUT", `/api/folders/${id}`, { name, description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setShowEditFolderDialog(false);
      setEditingFolder(null);
      toast({
        title: "Success",
        description: "Folder updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update folder",
        variant: "destructive",
      });
    },
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: number) => {
      return apiRequest("DELETE", `/api/folders/${folderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to delete folder";
      if (errorMessage.includes("Cannot delete folder with subfolders")) {
        toast({
          title: "Cannot Delete Folder",
          description: "This folder contains subfolders. Please delete all subfolders first, then try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest("POST", "/api/admin/documents/upload", formData);
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
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      setShowUploadDialog(false);
      setUploadFile(null);
      setUploadDescription("");
      setUploadFolderId("");
      setUploadBusinessEntity("");
      setUploadServiceType("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return apiRequest("DELETE", `/api/admin/documents/${documentId}`);
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
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleDeleteDocument = (document: Document) => {
    setDocumentToDelete(document);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      deleteDocumentMutation.mutate(documentToDelete.id);
      setShowDeleteDialog(false);
      setDocumentToDelete(null);
    }
  };

  const cancelDeleteDocument = () => {
    setShowDeleteDialog(false);
    setDocumentToDelete(null);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim() || !newFolderServiceType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createFolderMutation.mutate({
      name: newFolderName,
      description: newFolderDescription,
      serviceType: newFolderServiceType,
      parentId: selectedFolder || undefined,
    });
  };

  const handleUploadDocument = () => {
    if (!uploadFile || !uploadBusinessEntity || !uploadServiceType) {
      toast({
        title: "Error",
        description: "Please select a file, business entity, and service type",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("description", uploadDescription);
    formData.append("businessEntityId", uploadBusinessEntity);
    formData.append("serviceType", uploadServiceType);
    if (uploadFolderId) {
      formData.append("folderId", uploadFolderId);
    }

    uploadDocumentMutation.mutate(formData);
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setEditFolderName(folder.name);
    setEditFolderDescription(folder.description || "");
    setShowEditFolderDialog(true);
  };

  const handleUpdateFolder = () => {
    if (!editingFolder || !editFolderName.trim()) return;
    
    editFolderMutation.mutate({
      id: editingFolder.id,
      name: editFolderName.trim(),
      description: editFolderDescription.trim(),
    });
  };

  const handleDeleteFolder = (folder: Folder) => {
    // Check if this folder has any subfolders
    const subfolders = folders.filter((f: any) => f.parentId === folder.id);
    
    if (subfolders.length > 0) {
      const subfolderNames = subfolders.map((f: any) => f.name).join(", ");
      if (confirm(`The folder "${folder.name}" contains subfolders: ${subfolderNames}.\n\nDelete all subfolders first, then try again. Continue with deletion anyway?`)) {
        deleteFolderMutation.mutate(folder.id);
      }
    } else {
      if (confirm(`Are you sure you want to delete the folder "${folder.name}"? This action cannot be undone.`)) {
        deleteFolderMutation.mutate(folder.id);
      }
    }
  };

  const renderFolderHierarchy = (folder: any, depth: number): React.ReactNode => {
    const indentStyle = { paddingLeft: `${depth * 20 + 16}px` };
    
    return (
      <div key={folder.id}>
        <div
          style={indentStyle}
          className={`group flex items-center justify-between py-2 pr-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            selectedFolder === folder.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
          }`}
        >
          <button
            onClick={() => setSelectedFolder(
              selectedFolder === folder.id ? null : folder.id
            )}
            className="flex items-center gap-2 flex-1 text-left"
          >
            <Folder className="h-3 w-3" />
            <span>{folder.name}</span>
          </button>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleEditFolder(folder);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {folder.children && folder.children.length > 0 && (
          <div>
            {folder.children.map((child: any) => 
              renderFolderHierarchy(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const toggleServiceExpansion = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const toggleFolderExpansion = (folderId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = doc.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || doc.serviceType === filterType;
    const matchesService = !selectedServiceFolder || doc.serviceType === selectedServiceFolder;
    const matchesFolder = !selectedFolder || doc.folderId === selectedFolder;
    
    return matchesSearch && matchesFilter && matchesService && matchesFolder;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Document Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize and manage documents by services with business-specific access control
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Service-based Folder Tree */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Service Folders
                </CardTitle>
                <div className="flex gap-2">
                  <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
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
                          height: '36px',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                          border: '1px solid #16a34a',
                          backgroundColor: 'white',
                          color: '#16a34a',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          flex: '1'
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
                          Create a new subfolder under a service category
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="service-type">Service Type</Label>
                          <Select value={newFolderServiceType} onValueChange={setNewFolderServiceType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceFolders.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="folder-name">Folder Name</Label>
                          <Input
                            id="folder-name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter folder name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="folder-description">Description</Label>
                          <Textarea
                            id="folder-description"
                            value={newFolderDescription}
                            onChange={(e) => setNewFolderDescription(e.target.value)}
                            placeholder="Enter folder description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateFolder}
                          disabled={createFolderMutation.isPending}
                        >
                          {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Folder Dialog */}
                  <Dialog open={showEditFolderDialog} onOpenChange={setShowEditFolderDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Folder</DialogTitle>
                        <DialogDescription>
                          Update the folder name and description
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-folder-name">Folder Name</Label>
                          <Input
                            id="edit-folder-name"
                            value={editFolderName}
                            onChange={(e) => setEditFolderName(e.target.value)}
                            placeholder="Enter folder name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-folder-description">Description (Optional)</Label>
                          <Textarea
                            id="edit-folder-description"
                            value={editFolderDescription}
                            onChange={(e) => setEditFolderDescription(e.target.value)}
                            placeholder="Enter folder description"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditFolderDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUpdateFolder}
                          disabled={editFolderMutation.isPending || !editFolderName.trim()}
                        >
                          {editFolderMutation.isPending ? "Updating..." : "Update Folder"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {groupedFolders.map((service) => (
                    <div key={service.id}>
                      <button
                        onClick={() => {
                          toggleServiceExpansion(service.id);
                          setSelectedServiceFolder(
                            selectedServiceFolder === service.id ? null : service.id
                          );
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          selectedServiceFolder === service.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        {expandedServices.has(service.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <service.icon className="h-4 w-4" />
                        <span className="font-medium">{service.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {service.subfolders.length}
                        </Badge>
                      </button>
                      
                      {expandedServices.has(service.id) && (
                        <div className="ml-6 space-y-1">
                          {service.subfolders.map((folder) => 
                            renderFolderHierarchy(folder, 0)
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {serviceFolders.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
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
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>
                        Upload a new document with business-specific access
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="business-entity">Business Entity</Label>
                        <Popover open={businessEntityPopoverOpen} onOpenChange={setBusinessEntityPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={businessEntityPopoverOpen}
                              className="w-full justify-between"
                            >
                              {uploadBusinessEntity
                                ? businessEntities.find((entity: any) => entity.id.toString() === uploadBusinessEntity)?.name +
                                  " (" + businessEntities.find((entity: any) => entity.id.toString() === uploadBusinessEntity)?.entityType + ")"
                                : "Select business entity"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search business entities..." />
                              <CommandList>
                                <CommandEmpty>No business entity found.</CommandEmpty>
                                <CommandGroup>
                                  {Array.isArray(businessEntities) && businessEntities.map((entity: any) => (
                                    <CommandItem
                                      key={entity.id}
                                      value={entity.name + " " + entity.entityType}
                                      onSelect={() => {
                                        setUploadBusinessEntity(entity.id.toString());
                                        setBusinessEntityPopoverOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          uploadBusinessEntity === entity.id.toString() ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      {entity.name} ({entity.entityType})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="upload-service-type">Service Type</Label>
                        <Select value={uploadServiceType} onValueChange={setUploadServiceType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceFolders.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="upload-folder">Folder (Optional)</Label>
                        <Select value={uploadFolderId} onValueChange={setUploadFolderId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select folder (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {folders
                              .filter(f => f.serviceType === uploadServiceType.replace(/-/g, '_'))
                              .map((folder) => (
                              <SelectItem key={folder.id} value={folder.id.toString()}>
                                {folder.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="upload-file">File</Label>
                        <Input
                          id="upload-file"
                          type="file"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="upload-description">Description</Label>
                        <Textarea
                          id="upload-description"
                          value={uploadDescription}
                          onChange={(e) => setUploadDescription(e.target.value)}
                          placeholder="Enter document description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <button
                        onClick={() => setShowUploadDialog(false)}
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
                          border: '1px solid #d1d5db',
                          backgroundColor: 'white',
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          marginRight: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUploadDocument}
                        disabled={uploadDocumentMutation.isPending}
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
                          backgroundColor: uploadDocumentMutation.isPending ? '#9ca3af' : '#16a34a',
                          color: 'white',
                          cursor: uploadDocumentMutation.isPending ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => {
                          if (!uploadDocumentMutation.isPending) {
                            e.currentTarget.style.backgroundColor = '#15803d';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!uploadDocumentMutation.isPending) {
                            e.currentTarget.style.backgroundColor = '#16a34a';
                          }
                        }}
                      >
                        {uploadDocumentMutation.isPending ? "Uploading..." : "Upload Document"}
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Documents
                  {selectedServiceFolder && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      in {serviceFolders.find(s => s.id === selectedServiceFolder)?.name}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents found</p>
                    <p className="text-sm">Upload your first document to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc: Document) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{doc.originalName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                              {doc.serviceType && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline">
                                    {serviceFolders.find(s => s.id === doc.serviceType)?.name || doc.serviceType}
                                  </Badge>
                                </>
                              )}
                            </div>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(`/api/documents/${doc.id}/view`, '_blank')}
                            title="View Document"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '32px',
                              width: '32px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#6b7280',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                              e.currentTarget.style.color = '#374151';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#6b7280';
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `/api/documents/${doc.id}/download`;
                              link.download = doc.originalName || doc.fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            title="Download Document"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '32px',
                              width: '32px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#6b7280',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                              e.currentTarget.style.color = '#374151';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#6b7280';
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc)}
                            disabled={deleteDocumentMutation.isPending}
                            title="Delete Document"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '32px',
                              width: '32px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: deleteDocumentMutation.isPending ? '#9ca3af' : '#6b7280',
                              cursor: deleteDocumentMutation.isPending ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                              if (!deleteDocumentMutation.isPending) {
                                e.currentTarget.style.backgroundColor = '#fee2e2';
                                e.currentTarget.style.color = '#dc2626';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!deleteDocumentMutation.isPending) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#6b7280';
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {documentToDelete && (
            <div className="py-4">
              <p className="text-sm text-gray-600">
                <strong>Document:</strong> {documentToDelete.originalName || documentToDelete.fileName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Upload Date:</strong> {new Date(documentToDelete.uploadDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={cancelDeleteDocument}
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
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                marginRight: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteDocument}
              disabled={deleteDocumentMutation.isPending}
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
                backgroundColor: deleteDocumentMutation.isPending ? '#9ca3af' : '#dc2626',
                color: 'white',
                cursor: deleteDocumentMutation.isPending ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                if (!deleteDocumentMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }
              }}
              onMouseLeave={(e) => {
                if (!deleteDocumentMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }
              }}
            >
              {deleteDocumentMutation.isPending ? "Deleting..." : "Delete Document"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}