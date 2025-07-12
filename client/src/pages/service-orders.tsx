import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Package,
  Building,
  CreditCard,
  Mail,
  Phone
} from "lucide-react";

interface ServiceOrder {
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
  baseAmount?: string;
  expeditedFee?: string;
  customerPhone?: string;
  customFieldData?: any;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'processing':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ServiceOrders() {
  const { data: serviceOrders = [], isLoading, error } = useQuery({
    queryKey: ["/api/service-orders"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load your service orders. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto pt-36 pb-6 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Service Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your business service orders
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {serviceOrders.filter((order: ServiceOrder) => order.orderStatus === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {serviceOrders.filter((order: ServiceOrder) => order.orderStatus === 'processing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${serviceOrders.reduce((sum: number, order: ServiceOrder) => sum + parseFloat(order.totalAmount || '0'), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Orders Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Services</h2>
          
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
                          ${parseFloat(order.totalAmount || '0').toFixed(2)}
                        </span>
                        <Badge className={`${getStatusColor(order.orderStatus)} border-0`}>
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Order Details */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                            <Package className="h-4 w-4 mr-2" />
                            Order Information
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                              <span className="font-mono text-gray-900 dark:text-white">{order.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Service:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{order.serviceNames}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                              <span className="text-gray-900 dark:text-white">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Status:</span>
                              <Badge className={`${getStatusColor(order.orderStatus)} border-0`}>
                                {order.orderStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payment Details
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                              <span className="font-bold text-green-600 dark:text-green-400">
                                ${parseFloat(order.totalAmount || '0').toFixed(2)}
                              </span>
                            </div>
                            {order.baseAmount && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Base Amount:</span>
                                <span className="text-gray-900 dark:text-white">
                                  ${parseFloat(order.baseAmount).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {order.expeditedFee && parseFloat(order.expeditedFee) > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Expedited Fee:</span>
                                <span className="text-gray-900 dark:text-white">
                                  ${parseFloat(order.expeditedFee).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                              <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer & Business Details */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                            <Building className="h-4 w-4 mr-2" />
                            Business Details
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Business Name:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {order.businessName || order.customFieldData?.company_name || 'Not specified'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                              <span className="text-gray-900 dark:text-white">
                                {order.customerName || 'Not specified'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">Email:</span>
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-900 dark:text-white">
                                  {order.customerEmail || 'Not specified'}
                                </span>
                              </div>
                            </div>
                            {order.customerPhone && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-gray-900 dark:text-white">{order.customerPhone}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Actions</h4>
                          <div className="flex space-x-2">
                            <button
                              className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={order.orderStatus !== 'completed'}
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/service-orders/${order.id}/download`, {
                                    method: 'GET',
                                    headers: {
                                      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                                    },
                                    credentials: 'include'
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
                                    const errorData = await response.json().catch(() => ({}));
                                    alert(errorData.message || 'Documents not yet available for download');
                                  }
                                } catch (error) {
                                  console.error('Download error:', error);
                                  alert('Error downloading documents. Please try again.');
                                }
                              }}
                            >
                              <Download className="h-4 w-4" />
                              <span>
                                {order.orderStatus === 'completed' ? 'Download Documents' : 'Documents Pending'}
                              </span>
                            </button>
                            {order.orderStatus === 'processing' && (
                              <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Order in progress
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