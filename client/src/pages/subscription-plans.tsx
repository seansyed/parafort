import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Clock,
  Star,
  Shield,
  Building,
  FileText,
  Mail,
  Calculator,
  Scale,
  Users,
  CreditCard,
  Plus,
  ArrowRight,
  Crown
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  oneTimePrice?: string;
  recurringPrice?: string;
  recurringInterval?: string;
  features: string[];
}

interface UserSubscription {
  id: number;
  serviceName: string;
  status: string;
  nextBillingDate?: string;
  amount: string;
  interval: string;
  type?: string;
  businessEntityId?: string;
  businessEntityName?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Business Formation":
      return <Building className="h-6 w-6" />;
    case "Compliance":
      return <Shield className="h-6 w-6" />;
    case "Legal Documents":
      return <FileText className="h-6 w-6" />;
    case "Tax Services":
      return <Calculator className="h-6 w-6" />;
    case "Registered Agent":
      return <Users className="h-6 w-6" />;
    case "Digital Mailbox":
      return <Mail className="h-6 w-6" />;
    default:
      return <Star className="h-6 w-6" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'current' | 'available'>('current');
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Fetch user's current subscriptions
  const { data: userSubscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["/api/user-subscriptions"],
    enabled: !!user,
  });

  // Fetch available services
  const { data: availableServices, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const subscribedServiceIds = userSubscriptions?.map((sub: UserSubscription) => sub.id) || [];
  const unsubscribedServices = availableServices?.filter((service: Service) => 
    !subscribedServiceIds.includes(service.id)
  ) || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
              <p className="text-gray-600 mb-4">Please sign in to view your subscription plans.</p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-green-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Subscription Plans</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your current services and explore new business solutions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2 rounded-md font-medium flex items-center transition-colors ${
                activeTab === 'current' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Current Services
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-2 rounded-md font-medium flex items-center transition-colors ${
                activeTab === 'available' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Available Services
            </button>
          </div>
        </div>

        {/* Current Services Section */}
        {activeTab === 'current' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Active Services</h2>
              <p className="text-gray-600 mb-8">
                Services you're currently subscribed to and their status
              </p>
            </div>

            {subscriptionsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userSubscriptions && userSubscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSubscriptions.map((subscription: UserSubscription, index: number) => (
                  <Card key={`subscription-${subscription.id}-${index}`} className="relative border-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            {getCategoryIcon("Business Services")}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {subscription.serviceName}
                            </CardTitle>
                            {getStatusBadge(subscription.status)}
                            {subscription.type && subscription.type !== 'primary' && (
                              <div className="mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Building className="h-3 w-3 mr-1" />
                                  {subscription.businessEntityName || `Business Entity ${subscription.businessEntityId || 'Unknown'}`}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-semibold text-lg">
                            ${subscription.amount}/{subscription.interval}
                          </span>
                        </div>
                        
                        {subscription.nextBillingDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Next Billing:</span>
                            <span className="text-sm">
                              {new Date(subscription.nextBillingDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <Separator />

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              // For now, show a coming soon message
                              toast({
                                title: "Coming Soon",
                                description: "Subscription management will be available soon. For now, please contact support at support@parafort.com to manage your subscription.",
                              });
                            }}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Active Subscriptions
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any active service subscriptions yet. Explore our available services to get started.
                    </p>
                    <Button
                      onClick={() => setActiveTab('available')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Browse Services
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Available Services Section */}
        {activeTab === 'available' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Services</h2>
              <p className="text-gray-600 mb-8">
                Explore and subscribe to new business services
              </p>
            </div>

            {servicesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : unsubscribedServices && unsubscribedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unsubscribedServices.map((service: Service) => (
                  <Card key={service.id} className="relative border hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-500/10 transition-colors">
                            {getCategoryIcon(service.category)}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {service.name}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {service.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.description}
                        </p>

                        <div className="flex items-center justify-between">
                          {service.oneTimePrice && !service.recurringPrice ? (
                            <div className="text-2xl font-bold text-gray-900">
                              ${Number(service.oneTimePrice).toFixed(2)}
                            </div>
                          ) : service.recurringPrice && !service.oneTimePrice ? (
                            <div className="text-2xl font-bold text-gray-900">
                              ${Number(service.recurringPrice).toFixed(2)}/{service.recurringInterval || 'month'}
                            </div>
                          ) : service.oneTimePrice && service.recurringPrice ? (
                            <div>
                              <div className="text-2xl font-bold text-gray-900">
                                ${Number(service.oneTimePrice).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                + ${Number(service.recurringPrice).toFixed(2)}/{service.recurringInterval || 'month'}
                              </div>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-gray-900">
                              Free
                            </div>
                          )}
                        </div>

                        {service.features && service.features.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
                            <ul className="space-y-1">
                              {service.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Separator />

                        <div className="flex space-x-2">
                          <Button
                            asChild
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold"
                          >
                            <Link href={`/multi-step-checkout/${service.id}`}>
                              Subscribe Now
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      All Services Subscribed
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You're already subscribed to all available services. Check back later for new offerings.
                    </p>
                    <Button
                      onClick={() => setActiveTab('current')}
                      variant="outline"
                    >
                      View Current Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#27884b] to-[#1a5f33] text-white">
            <CardContent className="py-12">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">
                  Need Help Choosing the Right Services?
                </h3>
                <p className="text-lg opacity-90 mb-6">
                  Our business experts are here to help you select the perfect combination of services for your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => window.open('https://help.parafort.com/en', '_blank')}
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-green-500"
                    asChild
                  >
                    <Link href="/services-marketplace">
                      Browse All Services
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subscription Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              Complete information about your subscription
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Service</p>
                  <p className="text-lg font-semibold">{selectedSubscription.serviceName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedSubscription.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-lg font-semibold">
                    ${selectedSubscription.amount}/{selectedSubscription.interval}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Started</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(selectedSubscription.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Subscription ID</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedSubscription.id}</p>
              </div>
              
              {selectedSubscription.nextBillingDate && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(selectedSubscription.nextBillingDate), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    toast({
                      title: "Contact Support",
                      description: "Please contact support@parafort.com for subscription changes.",
                    });
                  }}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}