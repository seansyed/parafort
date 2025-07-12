import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  User, 
  Building2, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Mail,
  Phone,
  Edit3,
  Save,
  MapPin,
  CreditCard
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OrderDetail {
  id: number;
  orderId: string;
  serviceNames: string;
  serviceName?: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: string;
  createdAt: string;
  updatedAt?: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  userId: string;
  businessEntityId?: number;
  serviceIds?: string;
  customerNotes?: string;
  orderNotes?: string;
  processingSpeed?: string;
  customFieldData?: any;
  selectedAddons?: any;
  billingAddress?: any;
  baseAmount?: string;
  addonsAmount?: string;
  expeditedFee?: string;
  isExpedited?: boolean;
  currency?: string;
  paymentIntentId?: string;
}

export default function AdminOrderDetails() {
  const [match, params] = useRoute("/admin/order-details/:orderId");
  const orderId = params?.orderId;
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch order details
  const { data: orderDetail, isLoading } = useQuery<OrderDetail>({
    queryKey: [`/api/admin/order-details/${orderId}`],
    enabled: !!orderId,
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest('PATCH', `/api/admin/order-details/${orderId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Order status has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/order-details/${orderId}`] });
      setIsEditingStatus(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount || 0);
  };

  const renderFormData = (customFieldData: any) => {
    if (!customFieldData) return <p className="text-gray-500">No form data submitted</p>;
    
    let data;
    try {
      data = typeof customFieldData === 'string' ? JSON.parse(customFieldData) : customFieldData;
    } catch {
      data = customFieldData;
    }

    if (!data || Object.keys(data).length === 0) {
      return <p className="text-gray-500">No form data submitted</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded border">
              {String(value) || 'Not provided'}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/admin/order-tracking">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pt-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/order-tracking">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Order ID: {orderDetail.orderId}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(orderDetail.orderStatus)}
            <Badge className={`${getStatusColor(orderDetail.orderStatus)} border-0 text-sm px-3 py-1`}>
              {orderDetail.orderStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                        <FileText className="h-4 w-4 mr-1" />
                        Service
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {orderDetail.serviceName || orderDetail.serviceNames}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                        <Building2 className="h-4 w-4 mr-1" />
                        Business Name
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {orderDetail.businessName || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        Order Date
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(orderDetail.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {orderDetail.isExpedited && (
                      <div>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          Expedited Processing
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                        <User className="h-4 w-4 mr-1" />
                        Name
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {orderDetail.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {orderDetail.customerEmail}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {orderDetail.customerPhone || 'Not provided'}
                      </p>
                    </div>
                    {orderDetail.paymentIntentId && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Payment ID
                        </p>
                        <p className="font-mono text-sm text-gray-700 bg-gray-100 p-2 rounded">
                          {orderDetail.paymentIntentId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Data Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Submitted Form Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderFormData(orderDetail.customFieldData)}
              </CardContent>
            </Card>

            {/* Notes */}
            {(orderDetail.customerNotes || orderDetail.orderNotes) && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-gray-600" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {orderDetail.customerNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Customer Notes</p>
                      <p className="text-gray-900 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        {orderDetail.customerNotes}
                      </p>
                    </div>
                  )}
                  {orderDetail.orderNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Order Notes</p>
                      <p className="text-gray-900 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                        {orderDetail.orderNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions & Pricing */}
          <div className="space-y-6">
            {/* Order Status Management */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <CardTitle className="flex items-center text-lg">
                  <Edit3 className="h-5 w-5 mr-2 text-orange-600" />
                  Edit Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(orderDetail.orderStatus)}
                      <Badge className={`${getStatusColor(orderDetail.orderStatus)} border-0`}>
                        {orderDetail.orderStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  {!isEditingStatus ? (
                    <Button 
                      onClick={() => {
                        setIsEditingStatus(true);
                        setNewStatus(orderDetail.orderStatus);
                      }}
                      className="w-full"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Change Status
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => updateStatusMutation.mutate(newStatus)}
                          disabled={updateStatusMutation.isPending || newStatus === orderDetail.orderStatus}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {updateStatusMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditingStatus(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Breakdown */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardTitle className="flex items-center text-lg">
                  <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                  Pricing Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {orderDetail.baseAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Amount:</span>
                      <span className="font-semibold">{formatCurrency(orderDetail.baseAmount)}</span>
                    </div>
                  )}
                  {orderDetail.addonsAmount && parseFloat(orderDetail.addonsAmount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Add-ons:</span>
                      <span className="font-semibold">{formatCurrency(orderDetail.addonsAmount)}</span>
                    </div>
                  )}
                  {orderDetail.expeditedFee && parseFloat(orderDetail.expeditedFee) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expedited Fee:</span>
                      <span className="font-semibold">{formatCurrency(orderDetail.expeditedFee)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">{formatCurrency(orderDetail.totalAmount)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Payment Status: <span className={orderDetail.paymentStatus === 'paid' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                      {orderDetail.paymentStatus}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            {orderDetail.billingAddress && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-sm space-y-1">
                    {typeof orderDetail.billingAddress === 'string' ? (
                      <p>{orderDetail.billingAddress}</p>
                    ) : (
                      Object.entries(orderDetail.billingAddress).map(([key, value]) => (
                        <p key={key} className="text-gray-700">
                          {String(value)}
                        </p>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}