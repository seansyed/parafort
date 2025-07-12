import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CreditCard, Package, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface UserSubscription {
  id: number;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  planName: string;
  planDescription: string;
  yearlyPrice: number;
  features: string[];
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  oneTimePrice: number | null;
  recurringPrice: number | null;
  recurringInterval: string | null;
}

interface UserServicePurchase {
  id: number;
  purchaseType: string;
  status: string;
  purchaseDate: string;
  expiryDate: string | null;
  price: number;
  serviceName: string;
  serviceDescription: string;
}

export default function ClientSubscriptionDashboard() {
  const { toast } = useToast();
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [purchaseType, setPurchaseType] = useState<'one_time' | 'recurring'>('one_time');

  // Fetch user subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<UserSubscription | null>({
    queryKey: ['/api/user/subscription'],
  });

  // Fetch available services
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Fetch user's service purchases
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery<UserServicePurchase[]>({
    queryKey: ['/api/user/service-purchases'],
  });

  // Purchase service mutation
  const purchaseServiceMutation = useMutation({
    mutationFn: (data: { serviceId: number; purchaseType: string }) => 
      apiRequest('POST', '/api/user/purchase-service', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/service-purchases'] });
      setIsPurchaseDialogOpen(false);
      setSelectedService(null);
      toast({ title: 'Success', description: 'Service purchased successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to purchase service', variant: 'destructive' });
    },
  });

  const handlePurchaseService = () => {
    if (selectedService) {
      purchaseServiceMutation.mutate({
        serviceId: selectedService.id,
        purchaseType,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case 'expired':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscription</h1>
          <p className="text-gray-600">Manage your subscription and services</p>
        </div>

        {subscription ? (
          <div className="space-y-8">
            {/* Current Subscription */}
            <Card className="border-green-500 border-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-green-500">{subscription.planName}</CardTitle>
                    <p className="text-gray-600 mt-2">{subscription.planDescription}</p>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Yearly Price</p>
                      <p className="text-lg font-semibold">${(subscription.yearlyPrice / 100).toFixed(0)}/year</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Next Billing</p>
                      <p className="text-lg font-semibold">
                        {format(new Date(subscription.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Auto Renew</p>
                      <p className="text-lg font-semibold">{subscription.autoRenew ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Included Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subscription.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="available" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Available Services</TabsTrigger>
                <TabsTrigger value="purchased">My Purchases</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Available Add-on Services</h2>
                </div>

                {servicesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-16 bg-gray-200 rounded mb-4"></div>
                          <div className="h-8 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <Card key={service.id} className="border hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <Badge variant="outline">{service.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-600 text-sm">{service.description}</p>
                          
                          <div className="space-y-2">
                            {service.oneTimePrice && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">One-time</span>
                                <span className="font-semibold">${(service.oneTimePrice / 100).toFixed(2)}</span>
                              </div>
                            )}
                            {service.recurringPrice && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Recurring</span>
                                <span className="font-semibold">
                                  ${(service.recurringPrice / 100).toFixed(2)}/{service.recurringInterval}
                                </span>
                              </div>
                            )}
                          </div>

                          <Button 
                            className="w-full bg-green-500 hover:bg-[#E54F00]"
                            onClick={() => {
                              setSelectedService(service);
                              setIsPurchaseDialogOpen(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Purchase
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="purchased" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">My Service Purchases</h2>
                </div>

                {purchasesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-12 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : purchases.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
                      <p className="text-gray-600">Browse available services to get started</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <Card key={purchase.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{purchase.serviceName}</h3>
                                {getStatusBadge(purchase.status)}
                                <Badge variant="outline">{purchase.purchaseType}</Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-4">{purchase.serviceDescription}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Purchase Date</p>
                                  <p className="font-medium">{format(new Date(purchase.purchaseDate), 'MMM dd, yyyy')}</p>
                                </div>
                                {purchase.expiryDate && (
                                  <div>
                                    <p className="text-gray-500">Expires</p>
                                    <p className="font-medium">{format(new Date(purchase.expiryDate), 'MMM dd, yyyy')}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-gray-500">Price Paid</p>
                                  <p className="font-medium">${(purchase.price / 100).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-600 mb-6">Choose a subscription plan to get started with ParaFort</p>
              <Button className="bg-green-500 hover:bg-[#E54F00]">
                View Subscription Plans
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Purchase Service Dialog */}
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Purchase {selectedService?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <p className="text-gray-600">{selectedService?.description}</p>
              
              {selectedService && (selectedService.oneTimePrice || selectedService.recurringPrice) && (
                <div>
                  <label className="text-sm font-medium">Purchase Type</label>
                  <Select value={purchaseType} onValueChange={(value: 'one_time' | 'recurring') => setPurchaseType(value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedService.oneTimePrice && (
                        <SelectItem value="one_time">
                          One-time - ${(selectedService.oneTimePrice / 100).toFixed(2)}
                        </SelectItem>
                      )}
                      {selectedService.recurringPrice && (
                        <SelectItem value="recurring">
                          Recurring - ${(selectedService.recurringPrice / 100).toFixed(2)}/{selectedService.recurringInterval}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPurchaseDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePurchaseService}
                  disabled={purchaseServiceMutation.isPending}
                  className="flex-1 bg-green-500 hover:bg-[#E54F00]"
                >
                  {purchaseServiceMutation.isPending ? 'Processing...' : 'Purchase'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}