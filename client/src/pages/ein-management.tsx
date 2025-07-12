import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";

interface EinApplication {
  id: number;
  businessEntityId: number;
  businessLegalName: string;
  tradeName: string | null;
  entityType: string;
  applicationStatus: string;
  einNumber: string | null;
  applicationDate: string | null;
  approvalDate: string | null;
  ss4DocumentUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface EinVerification {
  id: number;
  businessEntityId: number;
  ein: string;
  businessName: string;
  verificationProvider: string | null;
  verificationStatus: string;
  verificationResponse: string | null;
  lastVerified: string | null;
}

interface BusinessEntity {
  id: string;
  name: string;
  entityType: string;
  state: string;
  status: string;
  formationOrderId?: string; // The actual formation order ID (e.g., PF-1751851203618)
  einApplications: EinApplication[];
  einVerifications: EinVerification[];
}

// Function to format order ID for display (updated)
const formatOrderId = (id: string | number): string => {
  const idStr = String(id);
  
  // If ID is 12 characters and starts with digits, it's likely the new format
  if (idStr.length === 12 && /^\d{12}$/.test(idStr)) {
    return idStr;
  }
  
  // For legacy numeric IDs, create a formatted order identifier
  if (/^\d+$/.test(idStr)) {
    return `ORD-${idStr.padStart(6, '0')}`;
  }
  
  // Fallback for any other format
  return idStr;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'verified':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'rejected':
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'verified':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending':
    case 'processing':
      return <Clock className="w-4 h-4" />;
    case 'rejected':
    case 'failed':
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const formatEin = (ein: string | null, showFull: boolean) => {
  if (!ein) return 'N/A';
  if (showFull) return `${ein.slice(0, 2)}-${ein.slice(2)}`;
  return `XX-XXX${ein.slice(-4)}`;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

export default function EinManagement() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [visibleEins, setVisibleEins] = useState<Set<string>>(new Set());

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: businesses, isLoading, error } = useQuery({
    queryKey: ["/api/business-entities/ein-management"],
    enabled: isAuthenticated && !authLoading,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      errorMessage: "Failed to load EIN data"
    }
  });

  if (error && isUnauthorizedError(error as Error)) {
    toast({
      title: "Session Expired",
      description: "Please log in again to continue.",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
    return null;
  }

  const toggleEinVisibility = (businessId: string, einType: 'application' | 'verification', index: number) => {
    const key = `${businessId}-${einType}-${index}`;
    const newVisible = new Set(visibleEins);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleEins(newVisible);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold">Failed to load EIN data</p>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-36 pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EIN Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage Employer Identification Numbers for your business entities
          </p>
        </div>
      </div>

      {!businesses || businesses.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No business entities found</p>
              <p className="text-muted-foreground">Create a business entity to manage EINs</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {businesses.map((business: BusinessEntity) => (
            <Card key={business.id} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{business.name}</CardTitle>
                    <CardDescription>
                      {business.entityType} • {business.state} • Order ID: {business.formationOrderId || formatOrderId(business.id)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={getStatusColor(business.status)}>
                    {business.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* EIN Applications */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    EIN Applications
                  </h3>
                  {business.einApplications && business.einApplications.length > 0 ? (
                    <div className="space-y-3">
                      {business.einApplications.map((application, index) => {
                        const key = `${business.id}-application-${index}`;
                        const isVisible = visibleEins.has(key);
                        return (
                          <div key={application.id} className="border rounded-lg p-4 bg-muted/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(application.applicationStatus)}>
                                  {getStatusIcon(application.applicationStatus)}
                                  {application.applicationStatus}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Applied: {formatDate(application.applicationDate)}
                                </span>
                              </div>
                              {application.einNumber && (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm">
                                    EIN: {formatEin(application.einNumber, isVisible)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleEinVisibility(business.id, 'application', index)}
                                  >
                                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Business Name:</span>
                                <p className="font-medium">{application.businessLegalName}</p>
                              </div>
                              {application.tradeName && (
                                <div>
                                  <span className="text-muted-foreground">Trade Name:</span>
                                  <p className="font-medium">{application.tradeName}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-muted-foreground">Entity Type:</span>
                                <p className="font-medium">{application.entityType}</p>
                              </div>
                              {application.approvalDate && (
                                <div>
                                  <span className="text-muted-foreground">Approved:</span>
                                  <p className="font-medium">{formatDate(application.approvalDate)}</p>
                                </div>
                              )}
                            </div>
                            {application.ss4DocumentUrl && (
                              <div className="mt-3">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={application.ss4DocumentUrl} target="_blank" rel="noopener noreferrer">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View SS-4 Document
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No EIN applications found</p>
                    </div>
                  )}
                </div>

                {/* EIN Verifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    EIN Verifications
                  </h3>
                  {business.einVerifications && business.einVerifications.length > 0 ? (
                    <div className="space-y-3">
                      {business.einVerifications.map((verification, index) => {
                        const key = `${business.id}-verification-${index}`;
                        const isVisible = visibleEins.has(key);
                        return (
                          <div key={verification.id} className="border rounded-lg p-4 bg-muted/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(verification.verificationStatus)}>
                                  {getStatusIcon(verification.verificationStatus)}
                                  {verification.verificationStatus}
                                </Badge>
                                {verification.verificationProvider && (
                                  <span className="text-sm text-muted-foreground">
                                    via {verification.verificationProvider}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                  EIN: {formatEin(verification.ein, isVisible)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleEinVisibility(business.id, 'verification', index)}
                                >
                                  {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Business Name:</span>
                                <p className="font-medium">{verification.businessName}</p>
                              </div>
                              {verification.lastVerified && (
                                <div>
                                  <span className="text-muted-foreground">Last Verified:</span>
                                  <p className="font-medium">{formatDate(verification.lastVerified)}</p>
                                </div>
                              )}
                            </div>
                            {verification.verificationResponse && (
                              <div className="mt-3">
                                <span className="text-muted-foreground text-sm">Response:</span>
                                <p className="text-sm mt-1 p-2 bg-background rounded border">
                                  {verification.verificationResponse}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No EIN verifications found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}