import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  Users, 
  Building2,
  ShoppingCart,
  CheckCircle,
  Clock,
  Star,
  Search,
  Filter,
  ArrowRight,
  Settings,
  Calendar,
  DollarSign
} from "lucide-react";

interface Folder {
  id: number;
  name: string;
  parentId: number | null;
}

interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
  level: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  rating: number;
  folderId?: number;
  status: 'active' | 'inactive' | 'coming_soon';
  features: string[];
}

interface ServiceOrder {
  id: number;
  serviceId: number;
  serviceName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  orderDate: string;
  completionDate?: string;
  price: number;
}

export default function EnhancedServicesDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedServices, setSelectedServices] = useState<Set<number>>(new Set());
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["/api/folders"],
    enabled: isAuthenticated,
  });

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
    enabled: isAuthenticated,
  });

  // Fetch user's service orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/service-orders"],
    enabled: isAuthenticated,
  });

  // Build folder tree
  const folderTree = buildFolderTree((folders as Folder[]) || []);

  // Filter services based on selected folder and other filters
  const filteredServices = ((services as Service[]) || []).filter((service: Service) => {
    const matchesFolder = selectedFolder ? service.folderId === selectedFolder : true;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    
    return matchesFolder && matchesSearch && matchesCategory && matchesStatus;
  });

  // Create service order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { serviceIds: number[]; notes?: string }) => {
      return await apiRequest("POST", "/api/service-orders", orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-orders"] });
      setSelectedServices(new Set());
      setIsOrderDialogOpen(false);
      toast({
        title: "Order Placed",
        description: "Your service order has been successfully submitted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return newExpanded;
    });
  };

  const toggleServiceSelection = (serviceId: number) => {
    setSelectedServices(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(serviceId)) {
        newSelected.delete(serviceId);
      } else {
        newSelected.add(serviceId);
      }
      return newSelected;
    });
  };

  const handleOrderServices = () => {
    if (selectedServices.size === 0) {
      toast({
        title: "No Services Selected",
        description: "Please select at least one service to order",
        variant: "destructive",
      });
      return;
    }
    setIsOrderDialogOpen(true);
  };

  const confirmOrder = (notes?: string) => {
    createOrderMutation.mutate({
      serviceIds: Array.from(selectedServices),
      notes,
    });
  };

  const renderFolderTree = (nodes: FolderTreeNode[]) => {
    return nodes.map((folder) => (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedFolder === folder.id ? "bg-blue-50 border border-blue-200" : ""
          }`}
          style={{ paddingLeft: `${folder.level * 20 + 8}px` }}
          onClick={() => setSelectedFolder(folder.id)}
        >
          {folder.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  expandedFolders.has(folder.id) ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
          
          {folder.children.length === 0 && <div className="w-5" />}
          
          {expandedFolders.has(folder.id) ? (
            <FolderOpen className="h-4 w-4 text-blue-600" />
          ) : (
            <Folder className="h-4 w-4 text-blue-600" />
          )}
          
          <span className="flex-1 text-sm font-medium">{folder.name}</span>
          
          <Badge variant="outline" className="text-xs">
            {((services as Service[]) || []).filter((s: Service) => s.folderId === folder.id).length}
          </Badge>
        </div>
        
        {expandedFolders.has(folder.id) && folder.children.length > 0 && (
          <div>{renderFolderTree(folder.children)}</div>
        )}
      </div>
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'coming_soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalOrderValue = Array.from(selectedServices).reduce((total, serviceId) => {
    const service = ((services as Service[]) || []).find((s: Service) => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);

  if (foldersLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Services</h1>
          <p className="text-gray-600 mt-1">Comprehensive services organized by department</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedServices.size > 0 && (
            <Button onClick={handleOrderServices} className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Order Services ({selectedServices.size})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="formation">Formation</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="tax">Tax Services</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="mail">Mail Services</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="coming_soon">Coming Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folder Tree */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Service Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div
                  className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedFolder === null ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                  onClick={() => setSelectedFolder(null)}
                >
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="flex-1 text-sm font-medium">All Services</span>
                  <Badge variant="outline" className="text-xs">
                    {((services as Service[]) || []).length}
                  </Badge>
                </div>
                
                {folderTree.length > 0 ? (
                  renderFolderTree(folderTree)
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Folder className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No categories available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders && Array.isArray(orders) && orders.length > 0 ? (
                  (orders as ServiceOrder[]).slice(0, 5).map((order: ServiceOrder) => (
                    <div key={order.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{order.serviceName}</p>
                        <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getOrderStatusColor(order.status)}>
                        {order.status ? order.status.replace('_', ' ') : 'pending'}
                      </Badge>
                    </div>
                  ))
                ) : null}
                
                {(!orders || !Array.isArray(orders) || orders.length === 0) && (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredServices.map((service: Service) => (
              <Card 
                key={service.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedServices.has(service.id) ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => toggleServiceSelection(service.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status ? service.status.replace('_', ' ') : 'active'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{service.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{service.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {(service.features || []).slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-500">${service.price}</p>
                      <p className="text-xs text-gray-500">{service.duration}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {selectedServices.has(service.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Service Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Selected Services:</h4>
              <div className="space-y-2">
                {Array.from(selectedServices).map(serviceId => {
                  const service = ((services as Service[]) || []).find((s: Service) => s.id === serviceId);
                  return service ? (
                    <div key={serviceId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{service.name}</span>
                      <span className="font-medium">${service.price}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex items-center justify-between font-bold">
                <span>Total:</span>
                <span className="text-green-500">${totalOrderValue}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or requirements..."
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => confirmOrder()}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Processing..." : "Confirm Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function buildFolderTree(folders: Folder[]): FolderTreeNode[] {
  const folderMap = new Map<number, FolderTreeNode>();
  const rootFolders: FolderTreeNode[] = [];

  // Create nodes
  folders.forEach(folder => {
    folderMap.set(folder.id, {
      ...folder,
      children: [],
      level: 0,
    });
  });

  // Build tree structure
  folders.forEach(folder => {
    const node = folderMap.get(folder.id)!;
    
    if (folder.parentId === null) {
      rootFolders.push(node);
    } else {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        node.level = parent.level + 1;
        parent.children.push(node);
      }
    }
  });

  // Sort folders alphabetically at each level
  const sortFolders = (folders: FolderTreeNode[]) => {
    folders.sort((a, b) => a.name.localeCompare(b.name));
    folders.forEach(folder => {
      if (folder.children.length > 0) {
        sortFolders(folder.children);
      }
    });
  };

  sortFolders(rootFolders);
  return rootFolders;
}