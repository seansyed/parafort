import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Clock, 
  CheckCircle, 
  FileText,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ServiceOrder {
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
  serviceNames: string;
}

export default function ServiceOrders() {
  const { data: serviceOrders = [], isLoading } = useQuery<ServiceOrder[]>({
    queryKey: ['/api/service-orders'],
    retry: false,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'processing':
        return 'secondary' as const;
      case 'pending':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  const handleDownload = async (order: ServiceOrder) => {
    try {
      const response = await fetch(`/api/service-orders/${order.id}/download`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${order.orderId}-documents.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }));
        alert(errorData.message || 'Documents not available for download');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading documents. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your service orders and download completed documents.
          </p>
        </div>

        {/* Service Orders */}
        <div className="space-y-4">
          {serviceOrders.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {serviceOrders.map((order: ServiceOrder) => (
                <AccordionItem 
                  key={order.id} 
                  value={`order-${order.id}`} 
                  className="border rounded-lg shadow-sm bg-white dark:bg-gray-800"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.orderStatus)}
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {order.serviceNames || 'Service Order'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Order #{order.orderId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                        <Badge variant={getStatusVariant(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                            <FileText className="h-4 w-4 mr-2" />
                            Order Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{order.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Service:</span>
                              <span className="text-gray-900 dark:text-white">{order.serviceNames}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Status:</span>
                              <Badge variant={getStatusVariant(order.orderStatus)}>
                                {order.orderStatus}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Date:</span>
                              <span className="text-gray-900 dark:text-white">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                            <Building className="h-4 w-4 mr-2" />
                            Customer Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Name:</span>
                              <span className="text-gray-900 dark:text-white">{order.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Email:</span>
                              <span className="text-gray-900 dark:text-white text-xs">{order.customerEmail}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Business:</span>
                              <span className="text-gray-900 dark:text-white">
                                {order.businessName || 'Not specified'}
                              </span>
                            </div>
                            {order.customerPhone && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                <span className="text-gray-900 dark:text-white">{order.customerPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Payment Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Base Amount:</span>
                              <span className="text-gray-900 dark:text-white">
                                ${order.baseAmount.toFixed(2)}
                              </span>
                            </div>
                            {order.isExpedited && order.expeditedFee && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Expedited Fee:</span>
                                <span className="text-gray-900 dark:text-white">
                                  ${order.expeditedFee.toFixed(2)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Total:</span>
                              <span className="font-bold text-green-600 dark:text-green-400">
                                ${order.totalAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Payment:</span>
                              <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Actions</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Download completed service documents and certificates.
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleDownload(order)}
                              disabled={order.orderStatus === 'pending'}
                              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                              <Download className="h-4 w-4" />
                              <span>
                                {order.orderStatus === 'pending' ? 'Documents Pending' : 'Download Documents'}
                              </span>
                            </button>
                            {order.orderStatus === 'processing' && (
                              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                                <Clock className="h-4 w-4 mr-2" />
                                Processing in progress
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Service Orders</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You haven't placed any service orders yet.
                </p>
                <Button onClick={() => window.location.href = '/services'}>
                  Browse Services
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}