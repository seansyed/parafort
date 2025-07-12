import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

interface ComplianceMetrics {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  overdueItems: number;
  upcomingItems: number;
  completionRate: number;
  onTimeRate: number;
  avgCompletionTime: number;
}

interface BusinessComplianceStatus {
  businessId: string;
  businessName: string;
  entityType: string;
  overallScore: number;
  metrics: ComplianceMetrics;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
}

interface ComplianceTrend {
  date: string;
  completionRate: number;
  overdueCount: number;
  newRequirements: number;
  resolvedIssues: number;
}

interface CategoryProgress {
  category: string;
  total: number;
  completed: number;
  percentage: number;
  color: string;
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884D8'];
const RISK_COLORS = {
  low: '#10B981',
  medium: '#F59E0B', 
  high: '#EF4444',
  critical: '#DC2626'
};

export default function ComplianceProgressVisualization() {
  const [selectedBusiness, setSelectedBusiness] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [viewMode, setViewMode] = useState<string>('overview');

  // Fetch compliance metrics
  const { data: complianceData, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/compliance/metrics', selectedBusiness, timeRange],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  // Fetch business list
  const { data: businesses } = useQuery({
    queryKey: ['/api/business-entities'],
  });

  // Fetch compliance trends
  const { data: trendsData } = useQuery({
    queryKey: ['/api/compliance/trends', selectedBusiness, timeRange],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch category progress
  const { data: categoryData } = useQuery({
    queryKey: ['/api/compliance/categories', selectedBusiness],
    refetchInterval: 30000,
  });

  const businessStatusData: BusinessComplianceStatus[] = complianceData?.businesses || [];
  const trendsChart: ComplianceTrend[] = trendsData?.trends || [];
  const categoryProgress: CategoryProgress[] = categoryData?.categories || [];

  const overallMetrics = complianceData?.overall || {
    totalItems: 0,
    completedItems: 0,
    inProgressItems: 0,
    overdueItems: 0,
    upcomingItems: 0,
    completionRate: 0,
    onTimeRate: 0,
    avgCompletionTime: 0
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-green-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (count: number, type: string) => {
    if (type === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (type === 'overdue') return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-500" />
            Real-Time Compliance Progress
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor compliance status and progress across all business entities
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {businesses?.map((business: any) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overallMetrics.completionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={overallMetrics.completionRate} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">
              {overallMetrics.completedItems} of {overallMetrics.totalItems} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On-Time Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overallMetrics.onTimeRate.toFixed(1)}%
                </p>
              </div>
              {getStatusIcon(overallMetrics.onTimeRate, 'completed')}
            </div>
            <div className="mt-3">
              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                overallMetrics.onTimeRate >= 90 ? 'bg-green-100 text-green-800' :
                overallMetrics.onTimeRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {overallMetrics.onTimeRate >= 90 ? 'Excellent' :
                 overallMetrics.onTimeRate >= 70 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Items</p>
                <p className="text-2xl font-bold text-red-600">
                  {overallMetrics.overdueItems}
                </p>
              </div>
              {getStatusIcon(overallMetrics.overdueItems, 'overdue')}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overallMetrics.avgCompletionTime.toFixed(1)}d
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Average days to complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization Tabs */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Compliance Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: overallMetrics.completedItems, color: '#10B981' },
                        { name: 'In Progress', value: overallMetrics.inProgressItems, color: '#3B82F6' },
                        { name: 'Overdue', value: overallMetrics.overdueItems, color: '#EF4444' },
                        { name: 'Upcoming', value: overallMetrics.upcomingItems, color: '#F59E0B' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {[
                        { name: 'Completed', value: overallMetrics.completedItems, color: '#10B981' },
                        { name: 'In Progress', value: overallMetrics.inProgressItems, color: '#3B82F6' },
                        { name: 'Overdue', value: overallMetrics.overdueItems, color: '#EF4444' },
                        { name: 'Upcoming', value: overallMetrics.upcomingItems, color: '#F59E0B' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Progress by Business */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Business Compliance Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={businessStatusData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="businessName" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="overallScore" fill="#27884b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trends Over Time</CardTitle>
              <CardDescription>
                Track completion rates and issue resolution over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="completionRate" 
                    stackId="1" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="Completion Rate %" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolvedIssues" 
                    stackId="2" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                    name="Resolved Issues" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress by Compliance Category</CardTitle>
              <CardDescription>
                View completion status across different compliance areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryProgress.map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.completed}/{category.total} ({category.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className="h-2"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="businesses" className="space-y-6">
          <div className="grid gap-4">
            {businessStatusData.map((business) => (
              <Card key={business.businessId}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {business.businessName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {business.entityType} • ID: {business.businessId}
                      </p>
                    </div>
                    <Badge className={getRiskBadgeColor(business.riskLevel)}>
                      {business.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {business.overallScore}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Overall Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {business.metrics.completedItems}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {business.metrics.inProgressItems}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {business.metrics.overdueItems}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Overdue</p>
                    </div>
                  </div>

                  <Progress value={business.overallScore} className="mb-2" />
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Last updated: {new Date(business.lastUpdated).toLocaleString()}</span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}