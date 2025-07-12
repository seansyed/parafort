import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  Search,
  Filter,
  Users,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface AdminServiceOrder {
  id: number;
  orderId: string;
  userId: string;
  serviceId: number;
  businessEntityId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  businessName?: string;
  customFieldData?: any;
  selectedAddons?: any;
  billingAddress?: any;
  baseAmount: number;
  addonsAmount?: number;
  isExpedited: boolean;
  expeditedFee?: number;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  paymentIntentId?: string;
  orderNotes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
  serviceName?: string;
  serviceDescription?: string;
  serviceNames?: string;
}

export default function AdminServiceOrdersWorking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  
  const { toast } = useToast();

  // Fetch all service orders for admin view
  const { data: allOrders = [], isLoading, error } = useQuery<AdminServiceOrder[]>({
    queryKey: ['/api/admin/service-orders'],
    retry: 3,
  });

  const downloadDocuments = async (order: AdminServiceOrder) => {
    if (downloadingIds.has(order.id)) return;
    
    setDownloadingIds(prev => new Set([...prev, order.id]));
    
    try {
      const response = await fetch(`/api/admin/service-orders/${order.id}/download`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }));
        toast({
          title: "Download Failed",
          description: errorData.message || 'Failed to download documents',
          variant: "destructive",
        });
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `order-${order.orderId}-documents.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Complete",
        description: "Documents downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading documents",
        variant: "destructive",
      });
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
    }
  };

  // Filter orders based on search and status filters
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.serviceNames?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
              <p className="text-red-600">Failed to load service orders. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = allOrders.length;
  const completedOrders = allOrders.filter(order => order.orderStatus === 'completed').length;
  const pendingOrders = allOrders.filter(order => order.orderStatus === 'pending').length;
  const totalRevenue = allOrders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Orders Management</h1>
          <p className="text-gray-600">Monitor and manage all service orders across the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                {filteredOrders.length} of {totalOrders} orders
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">No service orders match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Order Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.orderStatus)}
                        <div>
                          <p className="font-semibold text-gray-900">#{order.orderId}</p>
                          <p className="text-sm text-gray-500">
                            {order.serviceName || order.serviceNames || 'Service Order'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="lg:col-span-3">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      {order.businessName && (
                        <p className="text-sm text-gray-600">{order.businessName}</p>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {order.orderStatus.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="lg:col-span-2">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-2">
                      <div className="flex space-x-2">
                        <Link href={`/admin/order-details/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </Link>
                        {order.orderStatus === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocuments(order)}
                            disabled={downloadingIds.has(order.id)}
                          >
                            {downloadingIds.has(order.id) ? (
                              <Clock className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}