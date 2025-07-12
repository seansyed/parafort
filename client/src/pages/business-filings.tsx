import React from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { 
  Building2, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Shield,
  Archive,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import { useLocation } from "wouter";
import { ParaFortLoader } from "@/components/ParaFortLoader";

interface BusinessEntity {
  id: number;
  legalName: string;
  entityType: string;
  state: string;
  status: string;
  formationDate: string;
  einNumber?: string;
  registeredAgentService: boolean;
}

interface FormationOrder {
  id: number;
  orderId: string;
  businessName: string;
  orderStatus: string;
  currentProgress: number;
  totalSteps: number;
  orderDate: string;
  completionDate?: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
  downloadUrl?: string;
}

interface ComplianceItem {
  id: number;
  type: string;
  description: string;
  dueDate: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
}

export default function BusinessFilings() {
  const params = useParams();
  const businessId = params.id;
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Fetch business entity details
  const { data: business, isLoading: businessLoading, error: businessError } = useQuery<BusinessEntity>({
    queryKey: [`/api/business-entities/${businessId}`],
    enabled: isAuthenticated && !!businessId,
    retry: 1,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache
    onError: (error: any) => {
      console.error('❌ Business entity fetch error:', error);
    },
    onSuccess: (data) => {
      console.log('✅ Business entity fetched successfully:', data);
    }
  });
  
  // Force refresh business data
  const refreshBusiness = () => {
    queryClient.invalidateQueries([`/api/business-entities/${businessId}`]);
  };
  
  // Auto-refresh on mount to get latest data  
  React.useEffect(() => {
    if (businessId && isAuthenticated) {
      setTimeout(() => {
        queryClient.invalidateQueries([`/api/business-entities/${businessId}`]);
        queryClient.refetchQueries([`/api/business-entities/${businessId}`]);
      }, 100);
    }
  }, [businessId, isAuthenticated]);

  // Fetch formation orders for this business
  const { data: formationOrders = [], isLoading: ordersLoading } = useQuery<FormationOrder[]>({
    queryKey: [`/api/business-entities/${businessId}/formation-orders`],
    enabled: isAuthenticated && !!businessId,
  });

  // Fetch documents for this business
  const { data: documents = [], isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: [`/api/business-entities/${businessId}/documents`],
    enabled: isAuthenticated && !!businessId,
  });

  // Fetch compliance items
  const { data: complianceItems = [], isLoading: complianceLoading } = useQuery<ComplianceItem[]>({
    queryKey: [`/api/business-entities/${businessId}/compliance`],
    enabled: isAuthenticated && !!businessId,
  });

  if (businessLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <ParaFortLoader size="lg" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Not Found</h3>
            <p className="text-gray-600 mb-4">The business entity you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation('/dashboard')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'filed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'received':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'filed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{business.legalName}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {business.entityType} • {business.state}
              {business.status && (
                <>
                  •
                  <Badge className={getStatusColor(business.status)}>
                    {business.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Formation Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {business.formationDate ? new Date(business.formationDate).toLocaleDateString() : 
               business.filedDate ? new Date(business.filedDate).toLocaleDateString() : 'Pending'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">EIN Number</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {business.einNumber || business.ein || 'Not Available'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Registered Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {business.registeredAgent && business.registeredAgent !== 'Not Set' 
                ? business.registeredAgent 
                : (business.registeredAgentService ? 'Active' : 'Not Set')}
              {/* Debug info */}
              <span className="text-xs text-gray-500 block">
                (Raw: {business.registeredAgent || 'undefined'})
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formation Orders Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Formation Orders</h2>
          {ordersLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ) : formationOrders.length > 0 ? (
            <div className="space-y-4">
              {formationOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{order.businessName}</CardTitle>
                        <CardDescription>Order #{order.orderId}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{order.orderStatus.replace('_', ' ').toUpperCase()}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.orderStatus === 'processing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {order.orderStatus === 'completed' 
                              ? '100' 
                              : Math.round((order.currentProgress / order.totalSteps) * 100)
                            }%
                          </span>
                        </div>
                        <Progress 
                          value={order.orderStatus === 'completed' 
                            ? 100 
                            : (order.currentProgress / order.totalSteps) * 100
                          } 
                          className="h-2" 
                        />
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      <p>Ordered: {new Date(order.orderDate).toLocaleDateString()}</p>
                      {order.completionDate && (
                        <p>Completed: {new Date(order.completionDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Formation Orders</h3>
                <p className="text-gray-600">Formation orders will appear here once created.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
          {documentsLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Archive className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">
                            {doc.type} • {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {doc.downloadUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents</h3>
                <p className="text-gray-600">Business documents will appear here once available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Compliance & Next Steps Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance & Next Steps</h2>
        {complianceLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ) : complianceItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {item.type === 'annual_report' && <Calendar className="h-4 w-4 text-blue-500" />}
                      {item.type === 'boir_filing' && <Shield className="h-4 w-4 text-green-500" />}
                      {item.type === 'tax_filing' && <FileText className="h-4 w-4 text-purple-500" />}
                      <p className="font-medium text-gray-900">{item.type ? item.type.replace('_', ' ').toUpperCase() : 'Unknown'}</p>
                    </div>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority ? item.priority.toUpperCase() : 'Normal'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending compliance items at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common actions for this business entity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">View Documents</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">File Annual Report</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">BOIR Filing</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <ExternalLink className="h-5 w-5" />
                <span className="text-sm">State Portal</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}