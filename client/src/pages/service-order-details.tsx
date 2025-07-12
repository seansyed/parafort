import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Eye, Calendar, DollarSign, Package, User, Building } from 'lucide-react';

interface ServiceOrderDetails {
  id: number;
  orderId: string;
  serviceNames: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: string;
  createdAt: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  userId: string;
  businessEntityId?: number;
  serviceIds?: string;
  billingAddress?: string;
  customerPhone?: string;
}

export default function ServiceOrderDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: orderDetails, isLoading } = useQuery<ServiceOrderDetails>({
    queryKey: [`/api/service-orders/${id}`],
    enabled: !!id,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleDownload = async () => {
    if (!orderDetails) return;
    
    try {
      const response = await fetch(`/api/service-orders/${orderDetails.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${orderDetails.orderId}-documents.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Documents not yet available for download');
      }
    } catch (error) {
      alert('Error downloading documents');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-36">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-36">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The service order you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation('/service-orders')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Service Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const services = orderDetails.serviceNames ? orderDetails.serviceNames.split(', ') : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-36">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/service-orders')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order {orderDetails.orderId}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {orderDetails.orderStatus === 'completed' && (
            <Button onClick={handleDownload} className="bg-green-500 hover:bg-green-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download Documents
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Overview */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Status:</span>
                  <Badge className={getStatusColor(orderDetails.orderStatus)}>
                    {orderDetails.orderStatus.charAt(0).toUpperCase() + orderDetails.orderStatus.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                  <Badge className={getStatusColor(orderDetails.paymentStatus)}>
                    {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                  <span className="font-semibold text-lg">${orderDetails.totalAmount}</span>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Services Ordered:</h4>
                  <div className="space-y-2">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Eye className="h-4 w-4 mr-3 text-green-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Business Name:</span>
                  <span className="font-medium">{orderDetails.businessName}</span>
                </div>
                
                {orderDetails.businessEntityId && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Entity ID:</span>
                    <span className="font-medium">{orderDetails.businessEntityId}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customer & Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderDetails.customerName && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block text-sm">Name:</span>
                    <span className="font-medium">{orderDetails.customerName}</span>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600 dark:text-gray-400 block text-sm">Email:</span>
                  <span className="font-medium">{orderDetails.customerEmail}</span>
                </div>

                {orderDetails.customerPhone && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block text-sm">Phone:</span>
                    <span className="font-medium">{orderDetails.customerPhone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(orderDetails.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {orderDetails.orderStatus === 'completed' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Order Completed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Documents ready for download
                      </p>
                    </div>
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