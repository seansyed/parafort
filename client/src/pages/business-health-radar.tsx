import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Brain,
  Shield,
  FileText,
  DollarSign,
  BarChart3,
  Zap,
  Loader2
} from 'lucide-react';
import { ParaFortLoader } from '@/components/ParaFortLoader';

interface HealthMetrics {
  id: number;
  businessEntityId: string;
  metricDate: string;
  complianceScore: number;
  complianceGrade: string;
  pendingDeadlines: number;
  overdueItems: number;
  completedThisMonth: number;
  subscriptionStatus: string;
  outstandingBalance: string;
  lastPaymentDate: string | null;
  documentsReceived: number;
  documentsProcessed: number;
  urgentDocumentsPending: number;
  averageProcessingTime: number;
  entityStatus: string;
  registeredAgentStatus: string;
  addressUpdateRequired: boolean;
  riskLevel: string;
  riskFactors: string[];
  lastRiskAssessment: string;
  lastLoginDate: string;
  documentsDownloaded: number;
  supportTicketsOpen: number;
  createdAt: string;
  updatedAt: string;
}

interface HealthInsight {
  id: number;
  businessEntityId: string;
  insightType: string;
  title: string;
  description: string;
  recommendation: string;
  predictedOutcome: string;
  priority: string;
  category: string;
  confidenceScore: number;
  isActionable: boolean;
  status: string;
  aiModel: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardData {
  healthMetrics: HealthMetrics | null;
  insights: HealthInsight[];
  trends: any;
  recommendations: HealthInsight[];
}

export default function BusinessHealthRadar() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const { toast } = useToast();

  // Fetch businesses
  const { data: businesses = [] } = useQuery({
    queryKey: ['/api/business-entities']
  });

  // Auto-select first business if available and none selected
  useEffect(() => {
    if (businesses && businesses.length > 0 && !selectedBusinessId) {
      setSelectedBusinessId(businesses[0].id);
    }
  }, [businesses, selectedBusinessId]);

  // Fetch health dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, refetch: refetchDashboard } = useQuery<DashboardData>({
    queryKey: [`/api/health/dashboard/${selectedBusinessId}`],
    enabled: !!selectedBusinessId
  });

  // Check insight generation eligibility
  const { data: insightEligibility, refetch: refetchEligibility } = useQuery({
    queryKey: [`/api/health/insights/check/${selectedBusinessId}`],
    enabled: !!selectedBusinessId
  });

  // Generate insights mutation using GET endpoint to bypass routing issues
  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('GET', `/api/health/insights/manual-create/${selectedBusinessId}`);
    },
    onSuccess: () => {
      toast({
        title: "Insights Generated",
        description: "New predictive insights have been generated successfully.",
      });
      refetchDashboard();
      refetchEligibility();
      queryClient.invalidateQueries({ queryKey: [`/api/health/dashboard/${selectedBusinessId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate insights.",
        variant: "destructive",
      });
    }
  });

  // Acknowledge insight mutation
  const acknowledgeInsightMutation = useMutation({
    mutationFn: async (insightId: number) => {
      return await apiRequest('PATCH', `/api/health/insights/${insightId}/acknowledge`);
    },
    onSuccess: () => {
      toast({
        title: "Insight Acknowledged",
        description: "The insight has been marked as acknowledged.",
      });
      refetchDashboard();
    }
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isDashboardLoading) {
    return (
      <div className="min-h-screen bg-white p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <ParaFortLoader size="lg" />
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.healthMetrics;
  const insights = dashboardData?.insights || [];
  const recommendations = dashboardData?.recommendations || [];

  return (
    <div className="min-h-screen bg-white pt-36 pb-6 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="h-8 w-8 text-green-500" />
            Business Health Radar
          </h1>
          <p className="text-gray-600">AI-powered predictive analytics and comprehensive business health monitoring</p>
        </div>
        <div className="flex gap-3 items-center">
          <button 
            onClick={() => generateInsightsMutation.mutate()}
            disabled={generateInsightsMutation.isPending || (insightEligibility && !insightEligibility.canGenerate)}
            style={{
              backgroundColor: (generateInsightsMutation.isPending || (insightEligibility && !insightEligibility.canGenerate)) ? '#9ca3af' : '#34de73',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: (generateInsightsMutation.isPending || (insightEligibility && !insightEligibility.canGenerate)) ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!generateInsightsMutation.isPending && !(insightEligibility && !insightEligibility.canGenerate)) {
                e.target.style.backgroundColor = '#10b981';
              }
            }}
            onMouseLeave={(e) => {
              if (!generateInsightsMutation.isPending && !(insightEligibility && !insightEligibility.canGenerate)) {
                e.target.style.backgroundColor = '#34de73';
              }
            }}
          >
            {generateInsightsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : insightEligibility && !insightEligibility.canGenerate ? (
              <>
                <Clock className="h-4 w-4" />
                Available in {insightEligibility.daysRemaining || 0} days
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Generate AI Insights
              </>
            )}
          </button>
          
          {insightEligibility && !insightEligibility.canGenerate && (
            <div className="text-sm text-gray-600">
              Next available: {new Date(insightEligibility.nextAvailable).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      {/* Multi-Business Selector */}
      {Array.isArray(businesses) && businesses.length > 1 && (
        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Select Business Entity for Analysis
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose which business entity you'd like to analyze and monitor</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Business Entities ({businesses.length} total)</label>
              <select 
                value={selectedBusinessId} 
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Choose a business entity to analyze...</option>
                {businesses.map((business: any) => (
                  <option key={business.id} value={business.id}>
                    {business.name || business.legalName} • {business.entityType} • {business.state}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Each business entity has separate health metrics, compliance tracking, and AI insights
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Show content only when business is selected */}
      {selectedBusinessId && (
        <>
          {/* AI Insights Status */}
          {insightEligibility && (
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className={`p-2 rounded-lg ${insightEligibility.canGenerate ? "bg-blue-100" : "bg-gray-100"}`}>
                <Clock className={`h-4 w-4 ${insightEligibility.canGenerate ? "text-blue-600" : "text-gray-600"}`} />
              </div>
              AI Insights Usage Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightEligibility.canGenerate ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-500 rounded-full">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">Ready to Generate</p>
                    <p className="text-sm text-blue-700 mt-1">Generate new AI insights to get personalized business analytics and recommendations.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-gray-400 rounded-full">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Monthly Limit Reached</p>
                    <p className="text-sm text-gray-600 mt-1 mb-3">Premium AI insights are generated once per calendar month to ensure optimal performance and quality.</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-2 rounded border">
                        <span className="text-gray-500 block">Next Available</span>
                        <span className="font-medium text-gray-900">{new Date(insightEligibility.nextAvailable).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <span className="text-gray-500 block">Days Remaining</span>
                        <span className="font-medium text-gray-900">{insightEligibility.daysRemaining || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#27884b]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {metrics?.complianceScore || 0}%
              <span className={`text-lg font-bold ${getGradeColor(metrics?.complianceGrade || 'F')}`}>
                ({metrics?.complianceGrade || 'F'})
              </span>
            </div>
            <Progress value={metrics?.complianceScore || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics?.pendingDeadlines || 0} pending, {metrics?.overdueItems || 0} overdue
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-[#080808]">
                {(metrics?.riskLevel || 'low').toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics?.riskFactors?.length || 0} risk factors identified
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Health</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? Math.round(((metrics.documentsProcessed || 0) / Math.max(metrics.documentsReceived || 1, 1)) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics?.documentsProcessed || 0} of {metrics?.documentsReceived || 0} processed
            </p>
            {(metrics?.urgentDocumentsPending || 0) > 0 && (
              <p className="text-xs text-red-600 mt-1">
                {metrics?.urgentDocumentsPending} urgent pending
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entity Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {metrics?.entityStatus || 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Agent: {metrics?.registeredAgentStatus || 'Unknown'}
            </p>
            {metrics?.addressUpdateRequired && (
              <p className="text-xs text-orange-600 mt-1">Address update required</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-500" />
                AI-Powered Predictive Insights
              </CardTitle>
              <CardDescription>
                Machine learning-generated insights based on your business data patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                  <p className="text-gray-600 mb-4">Generate AI insights to get personalized recommendations</p>
                  <button 
                    onClick={() => generateInsightsMutation.mutate()}
                    disabled={generateInsightsMutation.isPending || (insightEligibility && !insightEligibility.canGenerate)}
                    style={{
                      backgroundColor: (generateInsightsMutation.isPending || (insightEligibility && !insightEligibility.canGenerate)) ? '#9ca3af' : '#34de73',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: (generateInsightsMutation.isPending || (insightEligibility && !insightEligibility.canGenerate)) ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!generateInsightsMutation.isPending && !(insightEligibility && !insightEligibility.canGenerate)) {
                        e.target.style.backgroundColor = '#10b981';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!generateInsightsMutation.isPending && !(insightEligibility && !insightEligibility.canGenerate)) {
                        e.target.style.backgroundColor = '#34de73';
                      }
                    }}
                  >
                    {generateInsightsMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : insightEligibility && !insightEligibility.canGenerate ? (
                      <>
                        <Clock className="h-4 w-4" />
                        Available in {insightEligibility.daysRemaining || 0} days
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Generate First Insights
                      </>
                    )}
                  </button>
                  
                  {insightEligibility && !insightEligibility.canGenerate && (
                    <p className="text-sm text-gray-600 mt-2">
                      AI insights are generated once per month. Next available: {new Date(insightEligibility.nextAvailable).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <Alert key={insight.id} className="border-l-4 border-l-[#27884b]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTitle className="text-base font-semibold">
                              {insight.title}
                            </AlertTitle>
                            <Badge className={getPriorityColor(insight.priority)}>
                              {insight.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                          </div>
                          <AlertDescription className="space-y-2">
                            <p>{insight.description}</p>
                            <div className="bg-blue-50 p-3 rounded-md">
                              <p className="font-medium text-blue-800">Recommendation:</p>
                              <p className="text-blue-700">{insight.recommendation}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-md">
                              <p className="font-medium text-green-800">Predicted Outcome:</p>
                              <p className="text-green-700">{insight.predictedOutcome}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Confidence: {insight.confidenceScore}%</span>
                              <span>Generated: {new Date(insight.createdAt).toLocaleDateString()}</span>
                            </div>
                          </AlertDescription>
                        </div>
                        {insight.status === 'active' && (
                          <button
                            onClick={() => acknowledgeInsightMutation.mutate(insight.id)}
                            disabled={acknowledgeInsightMutation.isPending}
                            style={{
                              backgroundColor: acknowledgeInsightMutation.isPending ? '#9ca3af' : 'white',
                              color: acknowledgeInsightMutation.isPending ? 'white' : '#34de73',
                              border: '1px solid #34de73',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: acknowledgeInsightMutation.isPending ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (!acknowledgeInsightMutation.isPending) {
                                e.target.style.backgroundColor = '#34de73';
                                e.target.style.color = 'white';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!acknowledgeInsightMutation.isPending) {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.color = '#34de73';
                              }
                            }}
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Priority Recommendations
              </CardTitle>
              <CardDescription>
                Actionable recommendations to improve your business health
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations</h3>
                  <p className="text-gray-600">All recommendations have been addressed or none are currently available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="border-l-4 border-l-yellow-400">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3">{rec.description}</p>
                        <div className="bg-yellow-50 p-3 rounded-md">
                          <p className="font-medium text-yellow-800 mb-1">Action Required:</p>
                          <p className="text-yellow-700">{rec.recommendation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Compliance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Completed This Month</span>
                    <span className="font-semibold">{metrics?.completedThisMonth || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending Deadlines</span>
                    <span className="font-semibold text-yellow-600">{metrics?.pendingDeadlines || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Overdue Items</span>
                    <span className="font-semibold text-red-600">{metrics?.overdueItems || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Document Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Processing Time</span>
                    <span className="font-semibold">{metrics?.averageProcessingTime || 0}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Documents Received</span>
                    <span className="font-semibold">{metrics?.documentsReceived || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Documents Processed</span>
                    <span className="font-semibold text-green-600">{metrics?.documentsProcessed || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Health Trends & Predictions
              </CardTitle>
              <CardDescription>
                Historical trends and future predictions for your business health
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData?.trends ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Score Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-500">
                            {dashboardData.trends.complianceScoreTrend}%
                          </span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            dashboardData.trends.trendDirection === 'up' ? 'bg-green-100 text-green-800' :
                            dashboardData.trends.trendDirection === 'down' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {dashboardData.trends.trendDirection}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Document Processing Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-500">
                            {dashboardData.trends.documentProcessingTrend}%
                          </span>
                          <span className="text-sm text-gray-600">
                            {dashboardData.trends.trendPeriod}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Financial Health Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-500">
                            {dashboardData.trends.financialHealthTrend}%
                          </span>
                          <span className="text-sm text-gray-600">
                            Strength: {dashboardData.trends.trendStrength}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Risk Level Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-500">
                            {dashboardData.trends.riskLevelTrend}
                          </span>
                          <span className="text-sm text-gray-600">
                            Confidence: {Number(dashboardData.trends.trendConfidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Trend Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Trend Period:</span>
                          <span className="font-medium">{dashboardData.trends.trendPeriod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Direction:</span>
                          <span className={`font-medium ${
                            dashboardData.trends.trendDirection === 'up' ? 'text-green-600' :
                            dashboardData.trends.trendDirection === 'down' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {dashboardData.trends.trendDirection}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trend Strength:</span>
                          <span className="font-medium">{dashboardData.trends.trendStrength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Analysis Date:</span>
                          <span className="font-medium">
                            {new Date(dashboardData.trends.trendDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Trend Data Available</h3>
                  <p className="text-gray-600">Trend analysis will be available after collecting more data points</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
}