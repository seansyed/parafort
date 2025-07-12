import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  FileText, 
  Mail, 
  CreditCard, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  DollarSign,
  Settings,
  Calendar,
  Bell,
  ExternalLink,
  User,
  MessageSquare,
  Upload,
  ShoppingCart,
  TrendingUp,
  Download,
  Eye,
  Truck,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { ParaFortLoader } from "@/components/ParaFortLoader";
import AnnouncementBanner from "@/components/AnnouncementBanner";

interface ClientDashboardData {
  businessEntity?: {
    id: number;
    legalName: string;
    entityType: string;
    state: string;
    status: string;
    formationDate: string;
  };
  complianceStatus: {
    overallScore: number;
    activeIssues: number;
    upcomingDeadlines: number;
  };
  activeServices: {
    digitalMailbox: boolean;
    registeredAgent: boolean;
    einStatus: string;
    boirStatus: string;
  };
  subscription: {
    plan: string;
    status: string;
    nextBilling: string;
    monthlyTotal: number;
    services: Array<{
      name: string;
      price: number;
    }>;
    serviceOrders?: Array<{
      id: number;
      serviceName: string;
      status: string;
      price: number;
      orderDate: string;
      category: string;
    }>;
  };
}

// Welcome Card Component
function WelcomeCard({ user, businessStatus }: { user: any, businessStatus: string }) {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Card className="shadow-lg border bg-white">
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          
          {/* Welcome Message */}
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {getCurrentGreeting()}, <span className="text-green-500">{user?.firstName || 'there'}</span>!
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Welcome to your business management hub. Here's what's happening with your business today.
            </CardDescription>
          </div>

          {/* Client ID on the right */}
          <div className="text-right">
            <div className="text-sm text-gray-500">Client ID</div>
            <div className="text-lg font-bold text-gray-900">
              {user?.clientId || 'Not Assigned'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="font-semibold text-gray-700">Current Business Status:</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
            {businessStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Action Required Card Component
function ActionRequiredCard({ dashboardData }: { dashboardData?: ClientDashboardData }) {
  // Get pending actions from real data
  const { data: complianceData } = useQuery({
    queryKey: ['/api/compliance/pending-actions'],
  });

  const pendingActions = complianceData || [];
  const hasActions = pendingActions.length > 0;

  // Determine card styling based on whether there are pending actions
  const cardClassName = hasActions 
    ? "shadow-lg border-l-4 border-l-red-500 bg-white border border-red-200"
    : "shadow-lg border-l-4 border-l-green-500 bg-white border border-green-200";

  const headerTextColor = hasActions ? "text-red-700" : "text-green-700";
  const descriptionColor = hasActions ? "text-red-600" : "text-green-600";

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${headerTextColor}`}>
          {hasActions ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          Action Required / Next Steps
        </CardTitle>
        <CardDescription className={descriptionColor}>
          {hasActions 
            ? "Urgent items that need your attention"
            : "Everything is up to date - no actions required"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasActions ? (
          <div className="space-y-4">
            {pendingActions.slice(0, 3).map((action: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  action.priority === 'urgent' ? 'bg-red-500' : 
                  action.priority === 'high' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Due: {action.dueDate}</p>
                </div>
                <Button size="sm" variant="outline" className="ml-2">
                  Review
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 mb-4">
              Great job! Your business is compliant and there are no pending actions required at this time.
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-700">
                <strong>Next check-in:</strong> We'll notify you of any upcoming deadlines or required actions.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Formation Orders Widget Component
function FormationOrdersWidget() {
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/user/formation-orders'],
  });

  const handleRefresh = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      'documents_prepared': 'Documents Ready',
      'filed': 'Filed',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    return (
      <Badge className={variants[status] || variants['pending']}>
        {labels[status] || status}
      </Badge>
    );
  };

  const handleDownloadInvoice = (orderId: string) => {
    // Create a download link for the PDF invoice
    const link = document.createElement('a');
    link.href = `/api/invoices/${orderId}/download`;
    link.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-500" />
              Formation Orders
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-500" />
              Formation Orders
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Track your business formation progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No formation orders yet</p>
            <Link href="/formation">
              <Button className="bg-green-500 hover:bg-green-500/90 text-white font-semibold">
                Start Business Formation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-500" />
            Formation Orders
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Track your business formation progress and access invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 3).map((order: any) => (
            <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{order.businessName}</h4>
                  <p className="text-sm text-gray-600">
                    {order.entityType} • {order.state} • Order #{order.orderId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ordered: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.orderStatus)}
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ${parseFloat(order.totalAmount || '0').toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900">
                    {order.orderStatus === 'completed' ? '100' : order.currentProgress}%
                  </span>
                </div>
                <Progress 
                  value={order.orderStatus === 'completed' ? 100 : order.currentProgress} 
                  className="h-2" 
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Link href="/order-tracking">
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => handleDownloadInvoice(order.orderId)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>
          ))}
          
          {orders.length > 3 && (
            <div className="pt-2 border-t">
              <Link href="/order-tracking">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Orders ({orders.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Widget Component
function RecentActivityWidget() {
  const { notifications, isLoading, unreadCount } = useNotifications({ limit: 5 });

  // Get priority color and icon for notifications
  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return { color: 'text-red-600', bgColor: 'bg-white', borderColor: 'border-red-500' };
      case 'high':
        return { color: 'text-orange-600', bgColor: 'bg-white', borderColor: 'border-green-500' };
      case 'medium':
        return { color: 'text-blue-600', bgColor: 'bg-white', borderColor: 'border-blue-500' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-white', borderColor: 'border-green-500' };
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority?.toLowerCase() === 'critical') return AlertTriangle;
    switch (type?.toLowerCase()) {
      case 'compliance': return CheckCircle;
      case 'payment': return ShoppingCart;
      case 'document': return FileText;
      case 'deadline': return Clock;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-500" />
            Recent Activity/Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <ParaFortLoader size="md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-green-500" />
          Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification: any) => {
              const IconComponent = getNotificationIcon(notification.type, notification.priority);
              const style = getPriorityStyle(notification.priority);
              return (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-gray-50 ${style.bgColor} ${style.borderColor}`}
                >
                  <IconComponent className={`h-4 w-4 mt-1 ${style.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                      {notification.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${style.color} ${style.borderColor} bg-white`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">Your notifications will appear here</p>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <Link href="/notifications">
            View All Notifications
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Quick Links Card Component  
function QuickLinksCard() {
  const quickLinks = [
    { label: "My Filings", href: "/filings", icon: FileText, description: "View and manage all filings" },
    { label: "My Documents", href: "/client-documents", icon: Upload, description: "Access business documents" },
    { label: "Contact Support", href: "https://help.parafort.com/en", icon: MessageSquare, description: "Get help from our team", external: true }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-green-500" />
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickLinks.map((link, index) => (
            <div
              key={index}
              className="w-full h-auto p-4 border border-green-500 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-start gap-3">
                    <link.icon className="h-5 w-5 mt-0.5" />
                    <div className="text-left">
                      <div className="font-semibold">{link.label}</div>
                      <div className="text-xs opacity-70 mt-1">{link.description}</div>
                    </div>
                  </div>
                </a>
              ) : (
                <Link href={link.href}>
                  <div className="flex items-start gap-3">
                    <link.icon className="h-5 w-5 mt-0.5" />
                    <div className="text-left">
                      <div className="font-semibold">{link.label}</div>
                      <div className="text-xs opacity-70 mt-1">{link.description}</div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



export default function ClientDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get clientId from fix endpoint once on mount
  React.useEffect(() => {
    let isMounted = true;
    
    fetch('/api/fix-client-id', {
      credentials: 'include',
      cache: 'no-cache'
    }).then(response => response.json())
      .then(data => {
        if (isMounted && data.clientId) {
          console.log('✅ Client ID Fixed:', data.clientId);
          // Set the fixed data in cache without causing refresh loop
          queryClient.setQueryData(['/api/auth/user'], data);
        }
      })
      .catch(err => console.error('Client ID fix error:', err));
      
    return () => { isMounted = false; };
  }, []); // Run once on mount
  
  // Debug logging
  console.log("Client Dashboard - User data:", user);
  console.log("Client Dashboard - User clientId:", user?.clientId);
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/client/dashboard"],
  });

  // Fetch real service purchases from database
  const { data: servicePurchases = [], isLoading: servicePurchasesLoading } = useQuery({
    queryKey: ["/api/user/service-purchases"],
  });

  // Fetch formation orders
  const { data: formationOrders = [], isLoading: formationOrdersLoading } = useQuery({
    queryKey: ["/api/user/formation-orders"],
  });

  // Combine all orders and sort by date
  const allOrders = [
    ...(servicePurchases || []).map((purchase: any) => ({
      ...purchase,
      orderType: 'service',
      orderDate: purchase.purchaseDate,
      name: purchase.serviceName,
      category: purchase.purchaseType
    })),
    ...(formationOrders || []).map((order: any) => ({
      ...order,
      orderType: 'formation',
      orderDate: order.orderDate,
      name: `${order.entityType} Formation`,
      category: 'Business Formation',
      price: order.totalAmount
    }))
  ].sort((a, b) => new Date(b.orderDate || 0).getTime() - new Date(a.orderDate || 0).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const data = dashboardData as ClientDashboardData;
  

  
  // Determine business status with fallback data
  const getBusinessStatus = () => {
    if (data?.businessEntity?.status === 'active') return 'Active & Compliant';
    if (data?.businessEntity?.status === 'formation') return 'Formation in Progress';
    if (data?.businessEntity) return 'Needs Attention';
    return 'Getting Started';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-36">
      <div className="p-4 space-y-4">
          
          {/* Welcome Card */}
          <WelcomeCard user={user} businessStatus={getBusinessStatus()} />

          {/* Announcements */}
          <AnnouncementBanner location="dashboard" />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Action Required Card */}
              <ActionRequiredCard dashboardData={data} />

              {/* Business Entity Overview (if exists) */}
              {data?.businessEntity && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-500" />
                      Business Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{data.businessEntity.legalName}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{data.businessEntity.entityType}</Badge>
                            <Badge variant="outline">{data.businessEntity.state}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Formed: {new Date(data.businessEntity.formationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Compliance Score</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Health</span>
                            <span>{data.complianceStatus?.overallScore || 85}/100</span>
                          </div>
                          <Progress value={data.complianceStatus?.overallScore || 85} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Formation Orders Widget */}
              <FormationOrdersWidget />

              {/* Service Orders Section - Real Database Data */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {servicePurchasesLoading || formationOrdersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-32"></div>
                                <div className="h-3 bg-gray-300 rounded w-20"></div>
                                <div className="h-3 bg-gray-300 rounded w-24"></div>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-16"></div>
                              <div className="h-6 bg-gray-300 rounded w-20"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : allOrders.length > 0 ? (
                    <div className="space-y-4">
                      {allOrders.slice(0, 5).map((order: any) => (
                        <div key={`${order.orderType}-${order.id}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              order.status === 'active' || order.status === 'completed' ? 'bg-green-500' :
                              order.status === 'pending' || order.status === 'processing' ? 'bg-yellow-500' :
                              order.status === 'submitted' ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{order.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{order.category}</p>
                              <p className="text-xs text-gray-400">
                                Ordered: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                              </p>
                              {order.orderType === 'formation' && order.orderId && (
                                <p className="text-xs text-gray-400">Order ID: {order.orderId}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">${order.price}</p>
                            <Badge variant={
                              order.status === 'completed' || order.status === 'submitted' ? 'default' : 
                              order.status === 'active' || order.status === 'processing' ? 'secondary' : 
                              'outline'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {allOrders.length > 5 && (
                        <div className="text-center pt-4">
                          <Button variant="outline" size="sm">
                            View All Orders ({allOrders.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No orders found</p>
                      <p className="text-sm text-gray-400">Your business formation and service orders will appear here once purchased.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              
              {/* Recent Activity Widget */}
              <RecentActivityWidget />

              {/* Quick Links Card */}
              <QuickLinksCard />

            </div>
          </div>
        </div>
    </div>
  );
}