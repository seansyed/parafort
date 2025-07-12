import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Download, 
  Eye, 
  Search,
  Building2,
  Mail,
  Hash,
  X,
  Users,
  Calendar,
  CreditCard,
  FileCheck,
  Plus
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

export default function ClientDocuments() {
  const { user, isAuthenticated } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedServiceFolder, setSelectedServiceFolder] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

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
      icon: Users,
      description: "Business name change documentation",
      subfolders: []
    },
    {
      id: "annual-reports",
      name: "Annual Reports",
      icon: Calendar,
      description: "State-required annual reporting documents",
      subfolders: []
    },
    {
      id: "tax-elections",
      name: "Tax Elections",
      icon: CreditCard,
      description: "S-Corp elections and tax-related filings",
      subfolders: []
    }
  ];

  // Fetch client documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/client/documents"],
    enabled: isAuthenticated,
  });

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["/api/folders"],
    enabled: isAuthenticated,
  });

  // Fetch business entities
  const { data: businessEntities = [], isLoading: entitiesLoading } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: isAuthenticated,
  });

  // Fetch user subscriptions to determine accessible services
  const { data: userSubscriptions = [], isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["/api/user-subscriptions"],
    enabled: isAuthenticated,
  });

  // Helper function to check if user has access to a service based on their subscription plan
  const hasServiceAccess = (serviceId: string): boolean => {
    if (!userSubscriptions || !Array.isArray(userSubscriptions)) {
      // For now, grant access to all Gold Plan users until endpoint is fixed
      // TODO: Fix this when /api/user-subscriptions endpoint is working properly
      return true; // Temporary fix for Gold Plan users
    }
    
    // Check if user has Gold Plan (plan_id 3) - Gold Plan should have access to all services
    const hasGoldPlan = userSubscriptions.some((subscription: any) => 
      subscription.serviceName === 'Gold' && subscription.status === 'active'
    );
    
    if (hasGoldPlan) {
      return true;
    }
    
    // Check if user has active subscription for this specific service
    return userSubscriptions.some((subscription: any) => 
      subscription.serviceType === serviceId && 
      subscription.status === 'active'
    );
  };

  // Service mapping for subscription URLs
  const serviceSubscriptionUrls: { [key: string]: string } = {
    'business-formation': '/business-formation-service',
    'registered-agent': '/registered-agent-services',
    'ein-services': '/ein-service',
    'annual-reports': '/annual-report-service',
    'business-licenses': '/business-license-services',
    'tax-services': '/tax-filing',
    'compliance': '/boir-filing',
    'legal-documents': '/legal-documents-service'
  };

  // Update service folders with actual subfolders and access control
  const updatedServiceFolders = serviceFolders.map(serviceFolder => ({
    ...serviceFolder,
    subfolders: (folders as Folder[]).filter((folder: Folder) => folder.serviceType === serviceFolder.id),
    hasAccess: hasServiceAccess(serviceFolder.id),
    subscriptionUrl: serviceSubscriptionUrls[serviceFolder.id] || '/services'
  }));

  // Helper functions
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

  const handleViewDocument = (document: Document) => {
    const viewUrl = `/api/client/documents/${document.id}/view`;
    window.open(viewUrl, '_blank');
  };

  const handleDownloadDocument = (document: Document) => {
    const downloadUrl = `/api/client/documents/${document.id}/download`;
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = document.originalName || document.fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBusinessEntityName = (businessEntityId: string): string => {
    const entity = businessEntities.find((e: BusinessEntity) => e.id === businessEntityId);
    return entity ? entity.name : 'Unknown Entity';
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = searchQuery === "" || 
      doc.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || doc.serviceType === filterType;
    const matchesService = selectedServiceFolder === null || doc.serviceType === selectedServiceFolder;
    const matchesFolder = selectedFolder === null || doc.folderId === selectedFolder;

    return matchesSearch && matchesType && matchesService && matchesFolder;
  });

  if (documentsLoading || foldersLoading || entitiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">Access and manage your business documents organized by service type</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {serviceFolders.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Service Folders */}
          <div className="w-80">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Document Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {/* All Documents Option */}
                  <div
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedServiceFolder === null ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedServiceFolder(null);
                      setSelectedFolder(null);
                    }}
                  >
                    <FileCheck className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">All Documents</span>
                    <Badge variant="secondary" className="ml-auto">
                      {documents.length}
                    </Badge>
                  </div>

                  {/* Service Folders */}
                  {updatedServiceFolders.map((service) => {
                    const serviceDocuments = documents.filter((doc: Document) => doc.serviceType === service.id);
                    const isExpanded = expandedServices.has(service.id);
                    const hasAccess = service.hasAccess;
                    
                    return (
                      <div key={service.id}>
                        <div
                          className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                            selectedServiceFolder === service.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                          } ${!hasAccess ? 'opacity-60' : ''}`}
                          onClick={() => {
                            if (hasAccess) {
                              setSelectedServiceFolder(service.id);
                              setSelectedFolder(null);
                              toggleServiceExpansion(service.id);
                            }
                          }}
                        >
                          {isExpanded ? (
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                          ) : (
                            <service.icon className={`h-4 w-4 ${hasAccess ? 'text-gray-600' : 'text-gray-400'}`} />
                          )}
                          <span className={`font-medium ${hasAccess ? '' : 'text-gray-500'}`}>
                            {service.name}
                            {!hasAccess && <span className="text-red-500 ml-2">🔒</span>}
                          </span>
                          <Badge variant={hasAccess ? "secondary" : "outline"} className="ml-auto">
                            {hasAccess ? serviceDocuments.length : 0}
                          </Badge>
                        </div>
                        
                        {/* Subscription prompt for unavailable services */}
                        {!hasAccess && isExpanded && (
                          <div className="ml-4 p-3 bg-gray-50 border-l border-gray-200 rounded-r">
                            <div className="text-sm text-gray-600 mb-2">
                              You're not subscribed to {service.name}
                            </div>
                            <a
                              href={service.subscriptionUrl}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              Subscribe to {service.name}
                            </a>
                          </div>
                        )}
                        
                        {/* Subfolders - only show for accessible services */}
                        {isExpanded && hasAccess && service.subfolders.length > 0 && (
                          <div className="ml-4 border-l border-gray-200">
                            {service.subfolders.map((folder) => {
                              const folderDocuments = documents.filter((doc: Document) => doc.folderId === folder.id);
                              
                              return (
                                <div
                                  key={folder.id}
                                  className={`flex items-center gap-3 p-2 pl-4 cursor-pointer hover:bg-gray-50 ${
                                    selectedFolder === folder.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                                  }`}
                                  onClick={() => setSelectedFolder(folder.id)}
                                >
                                  <Folder className="h-3 w-3 text-gray-500" />
                                  <span className="text-sm">{folder.name}</span>
                                  <Badge variant="outline" className="ml-auto text-xs">
                                    {folderDocuments.length}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Documents */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Documents ({filteredDocuments.length})</span>
                  {selectedServiceFolder && (
                    <Badge variant="outline">
                      {serviceFolders.find(s => s.id === selectedServiceFolder)?.name}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600">
                      {searchQuery ? 
                        "Try adjusting your search terms or filters." : 
                        "Documents will appear here once they are uploaded by your service provider."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredDocuments.map((doc: Document) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {doc.originalName || doc.fileName}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>Size: {formatFileSize(doc.fileSize)}</span>
                              <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                              {doc.businessEntityId && (
                                <span>Entity: {getBusinessEntityName(doc.businessEntityId)}</span>
                              )}
                            </div>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1 truncate">{doc.description}</p>
                            )}
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {doc.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDocument(doc)}
                            title="View Document"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
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
    </div>
  );
}