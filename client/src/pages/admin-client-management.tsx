import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  Building,
  MoreHorizontal,
  UserPlus,
  MoreVertical,
  Edit,
  Eye,
  UserMinus,
  Ban,
  FileText,
  Download,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminClientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [newClientForm, setNewClientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "client"
  });
  const [editClientForm, setEditClientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "client"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for adding new client
  const addClientMutation = useMutation({
    mutationFn: async (clientData: typeof newClientForm) => {
      return await apiRequest("POST", "/api/admin/clients", clientData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client added successfully",
      });
      setIsAddDialogOpen(false);
      setNewClientForm({ firstName: "", lastName: "", email: "", phoneNumber: "", role: "client" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    },
  });

  const handleAddClient = () => {
    if (!newClientForm.firstName || !newClientForm.email || !newClientForm.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "First name, email, and phone number are required",
        variant: "destructive",
      });
      return;
    }
    addClientMutation.mutate(newClientForm);
  };

  // Edit client mutation
  const editClientMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", `/api/admin/clients/${selectedClient.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedClient(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update client",
        variant: "destructive",
      });
    },
  });

  // Deactivate client mutation
  const deactivateClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      return await apiRequest("PATCH", `/api/admin/clients/${clientId}/status`, { 
        isActive: false 
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client deactivated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate client",
        variant: "destructive",
      });
    },
  });

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setEditClientForm({
      firstName: client.firstName || "",
      lastName: client.lastName || "",
      email: client.email || "",
      phoneNumber: "", // Will need to fetch from OTP preferences if available
      role: client.role || "client"
    });
    setIsEditDialogOpen(true);
  };

  const handleViewClient = async (client: any) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleDeactivateClient = (client: any) => {
    if (confirm(`Are you sure you want to deactivate ${client.firstName} ${client.lastName}?`)) {
      deactivateClientMutation.mutate(client.id);
    }
  };

  const handleSaveEdit = () => {
    if (!editClientForm.firstName || !editClientForm.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    editClientMutation.mutate(editClientForm);
  };

  // Fetch clients from the API
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/admin/clients"],
    retry: false,
  });

  // Fetch client documents when viewing a specific client
  const { data: clientDocuments = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: [`/api/admin/clients/${selectedClient?.id}/documents`],
    enabled: !!selectedClient?.id && isViewDialogOpen,
  });

  // Calculate real-time statistics from actual client data
  const totalClients = clients.length;
  const activeClients = clients.filter((client: any) => client.isActive).length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newThisMonth = clients.filter((client: any) => {
    const createdDate = new Date(client.createdAt);
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length;
  const totalRevenue = clients.reduce((sum: number, client: any) => sum + (client.totalRevenue || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadDocument = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/client/documents/${documentId}/download`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter((client: any) => {
    const matchesSearch = 
      (client.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.clientId || "").includes(searchTerm);
    
    // Convert isActive boolean to status string for filtering
    const clientStatus = client.isActive ? "active" : "inactive";
    const matchesFilter = filterStatus === "all" || clientStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage and monitor all client accounts</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client account. They will receive an email invitation to set up their account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={newClientForm.firstName}
                  onChange={(e) => setNewClientForm(prev => ({...prev, firstName: e.target.value}))}
                  className="col-span-3"
                  placeholder="Enter first name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={newClientForm.lastName}
                  onChange={(e) => setNewClientForm(prev => ({...prev, lastName: e.target.value}))}
                  className="col-span-3"
                  placeholder="Enter last name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm(prev => ({...prev, email: e.target.value}))}
                  className="col-span-3"
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={newClientForm.phoneNumber}
                  onChange={(e) => setNewClientForm(prev => ({...prev, phoneNumber: e.target.value}))}
                  className="col-span-3"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleAddClient}
                disabled={addClientMutation.isPending}
              >
                {addClientMutation.isPending ? "Creating..." : "Create Client"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{activeClients.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{newThisMonth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients by name, email, or client ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Client Table */}
          {isLoadingClients ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" aria-label="Loading"/>
              <p className="mt-2 text-sm text-gray-600">Loading clients...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Client ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Businesses</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client: any) => (
                    <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {(client.firstName || "").charAt(0)}{(client.lastName || "").charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {client.firstName || ""} {client.lastName || ""}
                            </p>
                            <p className="text-sm text-gray-600">{client.email || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-mono text-gray-900">{client.clientId || "N/A"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`capitalize ${getStatusColor(client.isActive ? "active" : "inactive")}`}>
                          {client.isActive ? "active" : "inactive"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{client.totalBusinesses || 0}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {client.lastLoginAt ? formatDate(client.lastLoginAt) : "Never"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {client.createdAt ? formatDate(client.createdAt) : "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewClient(client)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Client
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeactivateClient(client)}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Deactivate Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoadingClients && filteredClients.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="edit-firstName"
                value={editClientForm.firstName}
                onChange={(e) => setEditClientForm(prev => ({...prev, firstName: e.target.value}))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="edit-lastName"
                value={editClientForm.lastName}
                onChange={(e) => setEditClientForm(prev => ({...prev, lastName: e.target.value}))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editClientForm.email}
                onChange={(e) => setEditClientForm(prev => ({...prev, email: e.target.value}))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="edit-phoneNumber"
                type="tel"
                value={editClientForm.phoneNumber}
                onChange={(e) => setEditClientForm(prev => ({...prev, phoneNumber: e.target.value}))}
                className="col-span-3"
                placeholder="Phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={editClientMutation.isPending}
            >
              {editClientMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Client Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              Complete client information including services, invoices, and orders.
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedClient.firstName} {selectedClient.lastName}</p>
                      <p><span className="font-medium">Email:</span> {selectedClient.email}</p>
                      <p><span className="font-medium">Client ID:</span> {selectedClient.clientId}</p>
                      <p><span className="font-medium">Role:</span> {selectedClient.role}</p>
                      <div className="flex items-center">
                        <span className="font-medium">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedClient.isActive ? 'active' : 'inactive')}`}>
                          {selectedClient.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Account Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Joined:</span> {selectedClient.createdAt ? formatDate(selectedClient.createdAt) : "N/A"}</p>
                      <p><span className="font-medium">Last Login:</span> {selectedClient.lastLoginAt ? formatDate(selectedClient.lastLoginAt) : "Never"}</p>
                      <p><span className="font-medium">Total Businesses:</span> {selectedClient.totalBusinesses || 0}</p>
                      <p><span className="font-medium">Total Revenue:</span> ${selectedClient.totalRevenue || 0}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Active Services</h3>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Current active subscriptions and services</div>
                    <div className="space-y-2">
                      <Badge variant="outline">Business Formation</Badge>
                      <Badge variant="outline">Registered Agent</Badge>
                      <Badge variant="outline">Annual Reports</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Recent Orders</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Order ID</th>
                          <th className="text-left p-3">Service</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">#ORD-001</td>
                          <td className="p-3">LLC Formation</td>
                          <td className="p-3">$299</td>
                          <td className="p-3"><Badge className="bg-green-100 text-green-800">Completed</Badge></td>
                          <td className="p-3">Dec 15, 2024</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3">#ORD-002</td>
                          <td className="p-3">Registered Agent</td>
                          <td className="p-3">$149</td>
                          <td className="p-3"><Badge className="bg-blue-100 text-blue-800">Active</Badge></td>
                          <td className="p-3">Dec 10, 2024</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Invoices Tab */}
              <TabsContent value="invoices" className="mt-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Recent Invoices</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Invoice #</th>
                          <th className="text-left p-3">Description</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3">#INV-2024-001</td>
                          <td className="p-3">Annual Report Filing</td>
                          <td className="p-3">$89</td>
                          <td className="p-3"><Badge className="bg-green-100 text-green-800">Paid</Badge></td>
                          <td className="p-3">Jan 15, 2025</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3">#INV-2024-002</td>
                          <td className="p-3">Registered Agent Service</td>
                          <td className="p-3">$149</td>
                          <td className="p-3"><Badge className="bg-yellow-100 text-yellow-800">Pending</Badge></td>
                          <td className="p-3">Feb 1, 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Client Documents</h3>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{clientDocuments.length} documents</span>
                    </div>
                  </div>
                  
                  {isLoadingDocuments ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">Loading documents...</p>
                    </div>
                  ) : clientDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This client hasn't uploaded any documents yet.
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3">Document Name</th>
                            <th className="text-left p-3">Type</th>
                            <th className="text-left p-3">Size</th>
                            <th className="text-left p-3">Uploaded</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientDocuments.map((document: any) => (
                            <tr key={document.id} className="border-t hover:bg-gray-50">
                              <td className="p-3">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="font-medium">{document.originalFileName || document.fileName}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="text-gray-600">{document.documentType || document.serviceType || 'General'}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-gray-600">{formatFileSize(document.fileSize || 0)}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-gray-600">{formatDate(document.createdAt)}</span>
                              </td>
                              <td className="p-3">
                                <Badge className={document.isProcessed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {document.isProcessed ? 'Processed' : 'Pending'}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => downloadDocument(document.id, document.originalFileName || document.fileName)}
                                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </button>
                                  <button
                                    onClick={() => window.open(`/api/client/documents/${document.id}/view`, '_blank')}
                                    className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-3">Account Management</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><span className="font-medium">User ID:</span> {selectedClient.id}</p>
                      <p><span className="font-medium">Registration Date:</span> {formatDate(selectedClient.createdAt)}</p>
                      <p><span className="font-medium">Email Verified:</span> {selectedClient.isEmailVerified ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-medium">Login Count:</span> N/A</p>
                      <p><span className="font-medium">Last Activity:</span> {selectedClient.lastLoginAt ? formatDate(selectedClient.lastLoginAt) : "Never"}</p>
                      <p><span className="font-medium">Account Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedClient.isActive ? 'active' : 'inactive')}`}>
                          {selectedClient.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}