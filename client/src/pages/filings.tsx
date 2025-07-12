import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Upload, 
  AlertCircle,
  Download,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

interface Filing {
  id: number;
  type: string;
  title: string;
  status: 'pending' | 'in_review' | 'completed' | 'action_required' | 'processing';
  submissionDate: string;
  completionDate?: string;
  amount: string;
  businessEntityId?: number;
  progressSteps?: {
    current: number;
    total: number;
    currentStep: string;
  };
}

// Status badge component with color coding
function StatusBadge({ status }: { status: Filing['status'] }) {
  const statusConfig = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    in_review: { label: 'In Review', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    processing: { label: 'Processing', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
    action_required: { label: 'Action Required', className: 'bg-red-100 text-red-800 border-red-200' }
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

// Status icon component
function StatusIcon({ status }: { status: Filing['status'] }) {
  const iconConfig = {
    pending: { icon: Clock, className: 'text-yellow-500' },
    in_review: { icon: Eye, className: 'text-blue-500' },
    processing: { icon: Clock, className: 'text-purple-500' },
    completed: { icon: CheckCircle, className: 'text-green-500' },
    action_required: { icon: AlertTriangle, className: 'text-red-500' }
  };

  const config = iconConfig[status];
  const IconComponent = config.icon;
  
  return <IconComponent className={`h-4 w-4 ${config.className}`} />;
}

// Progress bar component for in-progress filings
function FilingProgress({ filing }: { filing: Filing }) {
  if (!filing.progressSteps) return null;

  const percentage = (filing.progressSteps.current / filing.progressSteps.total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-600">
        <span>Step {filing.progressSteps.current} of {filing.progressSteps.total}: {filing.progressSteps.currentStep}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export default function Filings() {
  const { isAuthenticated } = useAuth();
  
  const { data: userFilings = [], isLoading } = useQuery({
    queryKey: ["/api/user/filings"],
    enabled: isAuthenticated
  });

  // Use real API data instead of mock data
  const filings: Filing[] = userFilings || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your filings...</p>
        </div>
      </div>
    );
  }

  // Filter counts for summary
  const statusCounts = filings.reduce((acc, filing) => {
    acc[filing.status] = (acc[filing.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Show empty state when no filings exist
  if (!isLoading && filings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8 pt-36">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">No Filings Yet</h1>
              <p className="text-gray-600 mb-8">You haven't submitted any business filings yet. Get started with our services.</p>
              <Link href="/services-marketplace">
                <Button className="bg-green-500 hover:bg-green-700 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Start Your First Filing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 pt-36">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Filings</h1>
              <p className="text-gray-600 mt-2">Track your business formation and compliance filings</p>
            </div>
            <Link href="/services-marketplace">
              <Button className="bg-green-500 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                New Filing
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Filings</p>
                    <p className="text-3xl font-bold text-gray-900">{filings.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{statusCounts.completed || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600">{(statusCounts.processing || 0) + (statusCounts.in_review || 0)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Action Required</p>
                    <p className="text-3xl font-bold text-red-600">{statusCounts.action_required || 0}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filings Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                All Filings
              </CardTitle>
              <CardDescription>
                Manage and track all your business formation and compliance filings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Service</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Business</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Submitted</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Est. Completion</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Progress</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filings.map((filing) => (
                      <tr key={filing.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <StatusIcon status={filing.status} />
                            <div>
                              <p className="font-semibold text-gray-900">{filing.title}</p>
                              <p className="text-sm text-gray-600">
                                ID: {filing.type === 'formation' ? 'BF-' : 'SO-'}{(78600 + filing.id).toString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{filing.title}</span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <StatusBadge status={filing.status} />
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(filing.submissionDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          {filing.completionDate ? (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(filing.completionDate).toLocaleDateString()}</span>
                            </div>
                          ) : filing.status === 'completed' ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Processing</span>
                          )}
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="min-w-[200px]">
                            <FilingProgress filing={filing} />
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <Button 
                            size="sm" 
                            variant="default"
                            className="bg-green-500 hover:bg-green-700"
                            asChild
                          >
                            <Link href={`/order-tracking`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="border-2 border-green-500 bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help with Your Filings?</h3>
                  <p className="text-gray-700 mb-4">
                    Our compliance experts are here to help you navigate your business filings and ensure everything is completed on time.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open('https://help.parafort.com/en', '_blank')}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#059669',
                        backgroundColor: 'white',
                        border: '1px solid #059669',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#059669';
                      }}
                    >
                      Contact Support
                    </button>
                    <button
                      onClick={() => window.open('https://help.parafort.com/en', '_blank')}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#059669',
                        backgroundColor: 'white',
                        border: '1px solid #059669',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#059669';
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Filing Guide
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}