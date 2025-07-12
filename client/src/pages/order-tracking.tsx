import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Building,
  Calendar,
  Download,
  AlertCircle,
  Eye,
  RefreshCw
} from "lucide-react";

interface FormationOrder {
  id: number;
  orderId: string;
  businessName: string;
  entityType: string;
  state: string;
  orderStatus: string;
  currentProgress: number;
  totalSteps: number;
  createdAt: string;
  totalAmount: string;
}

interface ProgressStep {
  id: number;
  stepNumber: number;
  stepName: string;
  stepDescription: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  startedAt: string | null;
  completedAt: string | null;
  estimatedCompletionDays: number | null;
  notes: string | null;
}

export default function OrderTracking() {
  // Fetch user's formation orders with no caching for real-time updates
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['/api/user/formation-orders'],
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache the data
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });

  const handleRefresh = () => {
    refetchOrders();
  };

  // Get progress for the first order (can be enhanced to support multiple orders)
  const primaryOrder = orders[0] as FormationOrder;

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/formation-orders', primaryOrder?.orderId, 'progress'],
    enabled: !!primaryOrder?.orderId,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'pending': 'bg-gray-100 text-gray-800',
      'processing': 'bg-blue-100 text-blue-800',
      'documents_prepared': 'bg-yellow-100 text-yellow-800',
      'filed': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    const labels: Record<string, string> = {
      'pending': 'Pending',
      'processing': 'Processing',
      'documents_prepared': 'Documents Prepared',
      'filed': 'Filed with State',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    return (
      <Badge className={variants[status] || variants['pending']}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-36">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-36">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Formation Orders</h2>
            <p className="text-gray-600 mb-6">You haven't started any business formation orders yet.</p>
            <Button className="bg-green-500 hover:bg-green-500/90">
              Start Business Formation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-36">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>

        {/* Display all orders */}
        <div className="space-y-6">
          {orders.map((order: FormationOrder) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#27884b]/5 to-transparent border-b">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-gray-900">
                    <Building className="h-5 w-5 mr-2 text-green-500" />
                    Formation Order #{order.orderId}
                  </span>
                  {getStatusBadge(order.orderStatus)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium text-gray-900">{order.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Entity Type</p>
                    <p className="font-medium text-gray-900">{order.entityType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium text-gray-900">{order.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium text-gray-900">${parseFloat(order.totalAmount || '0').toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium font-mono text-xs text-gray-900">{order.orderId}</p>
                  </div>
                </div>

                {/* Beautiful Horizontal Progress Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">Formation Progress</h4>
                    <span className="text-sm font-bold text-green-500">
                      {order.orderStatus === 'completed' ? '100' : (order.currentProgress || 0)}% Complete
                    </span>
                  </div>
                  
                  {/* Horizontal Milestone Bar */}
                  <div className="relative mb-8">
                    {/* Progress Line Background */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                    
                    {/* Active Progress Line */}
                    <div 
                      className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#27884b] to-[#FF7A00] rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: order.orderStatus === 'pending' ? '20%' :
                               order.orderStatus === 'processing' ? '40%' :
                               order.orderStatus === 'documents_prepared' ? '60%' :
                               order.orderStatus === 'filed' ? '80%' :
                               order.orderStatus === 'completed' ? '100%' : '20%'
                      }}
                    />
                    
                    {/* Milestone Steps */}
                    <div className="flex justify-between relative">
                      {/* Step 1: Order Received */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
                          ['pending', 'processing', 'documents_prepared', 'filed', 'completed'].includes(order.orderStatus)
                            ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-gray-900">Order</p>
                          <p className="text-xs text-gray-600">Received</p>
                        </div>
                      </div>

                      {/* Step 2: Processing Documents */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
                          ['processing', 'documents_prepared', 'filed', 'completed'].includes(order.orderStatus)
                            ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                            : order.orderStatus === 'pending'
                            ? 'bg-white border-gray-300 text-gray-400'
                            : 'bg-yellow-500 border-yellow-500 text-white animate-pulse'
                        }`}>
                          <Clock className="w-6 h-6" />
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-gray-900">Processing</p>
                          <p className="text-xs text-gray-600">Documents</p>
                        </div>
                      </div>

                      {/* Step 3: Documents Prepared */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
                          ['documents_prepared', 'filed', 'completed'].includes(order.orderStatus)
                            ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                            : ['pending', 'processing'].includes(order.orderStatus)
                            ? 'bg-white border-gray-300 text-gray-400'
                            : 'bg-yellow-500 border-yellow-500 text-white animate-pulse'
                        }`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-gray-900">Documents</p>
                          <p className="text-xs text-gray-600">Prepared</p>
                        </div>
                      </div>

                      {/* Step 4: Filed with State */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
                          ['filed', 'completed'].includes(order.orderStatus)
                            ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                            : ['pending', 'processing', 'documents_prepared'].includes(order.orderStatus)
                            ? 'bg-white border-gray-300 text-gray-400'
                            : 'bg-yellow-500 border-yellow-500 text-white animate-pulse'
                        }`}>
                          <Building className="w-6 h-6" />
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-gray-900">Filed with</p>
                          <p className="text-xs text-gray-600">State</p>
                        </div>
                      </div>

                      {/* Step 5: Formation Complete */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
                          order.orderStatus === 'completed'
                            ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-gray-900">Formation</p>
                          <p className="text-xs text-gray-600">Complete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Current Status:</span> {
                        order.orderStatus === 'pending' ? 'Your order has been received and is being reviewed.' :
                        order.orderStatus === 'processing' ? 'We are preparing your formation documents.' :
                        order.orderStatus === 'documents_prepared' ? 'Documents are ready and will be filed with the state.' :
                        order.orderStatus === 'filed' ? 'Documents have been filed with the state. Waiting for approval.' :
                        order.orderStatus === 'completed' ? 'Your business formation is complete! All documents are ready.' :
                        'Processing your formation request...'
                      }
                    </p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Registered Agent</p>
                    <p className="font-medium text-gray-900">ParaFort Legal Services</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Processing Time</p>
                    <p className="font-medium text-gray-900">5-7 Business Days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Filing Method</p>
                    <p className="font-medium text-gray-900">Online Filing</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected Completion</p>
                    <p className="font-medium text-gray-900">
                      {(() => {
                        const orderDate = new Date(order.createdAt || order.orderDate);
                        const completionDate = new Date(orderDate);
                        // Add 7 business days
                        let businessDays = 0;
                        while (businessDays < 7) {
                          completionDate.setDate(completionDate.getDate() + 1);
                          const dayOfWeek = completionDate.getDay();
                          if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
                            businessDays++;
                          }
                        }
                        return completionDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        });
                      })()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                    onClick={() => {
                      window.location.href = '/documents';
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Documents
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                    onClick={() => {
                      if (order?.orderId) {
                        window.open(`/api/formation-orders/${order.orderId}/invoice/download`, '_blank');
                      }
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}