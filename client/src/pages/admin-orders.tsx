import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdminNavigation from "@/components/admin-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Search, 
  Filter,
  Eye,
  Download,
  Calendar,
  DollarSign,
  Building,
  User,
  Mail,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface FormationOrder {
  id: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  entityType: string;
  state: string;
  amount: number;
  status: string;
  currentProgress: number;
  createdAt: string;
  paymentIntentId: string;
  subscriptionPlan?: string;
}

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<FormationOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch formation orders
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/formation-orders'],
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Order data has been refreshed.",
    });
  };

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status, progress }: { orderId: number; status: string; progress: number }) => {
      return await apiRequest('PATCH', `/api/admin/formation-orders/${orderId}`, {
        status,
        currentProgress: progress
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/formation-orders'] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredOrders = orders.filter((order: FormationOrder) => {
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesEntityType = entityTypeFilter === "all" || order.entityType === entityTypeFilter;
    
    return matchesSearch && matchesStatus && matchesEntityType;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-slate-600" />
                <h1 className="text-3xl font-bold text-gray-900">Formation Orders</h1>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
            </div>
            <p className="text-gray-600">View and manage all business formation orders and customer information</p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Search & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by customer name, email, business name, or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entity Types</SelectItem>
                    <SelectItem value="LLC">LLC</SelectItem>
                    <SelectItem value="Corporation">Corporation</SelectItem>
                    <SelectItem value="Professional Corporation">Professional Corporation</SelectItem>
                    <SelectItem value="Non-Profit Corporation">Non-Profit Corporation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Formation Orders</CardTitle>
                  <CardDescription>
                    {isLoading ? 'Loading...' : `${filteredOrders.length} orders found`}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found matching your criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Entity Type</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order: FormationOrder) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.orderId}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">{order.customerName || 'N/A'}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{order.customerEmail || 'N/A'}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Building className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="font-medium">{order.businessName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.entityType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.state}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="font-medium">{formatCurrency(order.amount)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
            <DialogDescription>
              Manage order status and view complete order information
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="font-medium">{selectedOrder.customerName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium">{selectedOrder.customerEmail || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Business Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Business Name:</span>
                        <p className="font-medium">{selectedOrder.businessName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Entity Type:</span>
                        <p className="font-medium">{selectedOrder.entityType || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">State:</span>
                        <p className="font-medium">{selectedOrder.state || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Status Management */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Order Status Management
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Current Status:</label>
                      <Select 
                        value={selectedOrder.status} 
                        onValueChange={(value) => {
                          if (selectedOrder) {
                            updateOrderStatus.mutate({
                              orderId: selectedOrder.id,
                              status: value,
                              progress: getProgressForStatus(value)
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="documents_prepared">Documents Prepared</SelectItem>
                          <SelectItem value="filed">Filed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Progress:</label>
                      <div className="flex items-center space-x-2">
                        <Progress value={getProgressForStatus(selectedOrder.status)} className="flex-1" />
                        <span className="text-sm text-gray-500">{getProgressForStatus(selectedOrder.status)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Amount:</span>
                      <p className="font-medium text-lg">${selectedOrder.amount?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Payment ID:</span>
                      <p className="font-mono text-sm">{selectedOrder.paymentIntentId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Order Date:</span>
                      <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button className="bg-green-500 hover:bg-green-500/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download Documents
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to get progress percentage for status
function getProgressForStatus(status: string): number {
  const statusMap: Record<string, number> = {
    'pending': 10,
    'processing': 25,
    'documents_prepared': 60,
    'filed': 80,
    'completed': 100,
    'cancelled': 0
  };
  return statusMap[status] || 0;
}