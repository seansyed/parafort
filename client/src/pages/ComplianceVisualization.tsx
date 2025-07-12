import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Building2, Calendar, Target } from 'lucide-react';
import { ParaFortLoader } from '@/components/ParaFortLoader';

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

interface ComplianceData {
  overall: ComplianceMetrics;
  businesses: BusinessComplianceStatus[];
}

interface TrendsData {
  trends: ComplianceTrend[];
}

interface CategoriesData {
  categories: CategoryProgress[];
}

const timeRangeOptions = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' }
];

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high': return 'text-orange-600 bg-green-50 border-orange-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getRiskIcon = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return <CheckCircle className="w-4 h-4" />;
    case 'medium': return <Clock className="w-4 h-4" />;
    case 'high': return <AlertTriangle className="w-4 h-4" />;
    case 'critical': return <AlertTriangle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export default function ComplianceVisualization() {
  const [selectedBusiness, setSelectedBusiness] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');

  // Fetch compliance metrics
  const { data: complianceData, isLoading: metricsLoading } = useQuery<ComplianceData>({
    queryKey: ['/api/compliance-visualization/metrics', selectedBusiness, timeRange],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  // Fetch trends data
  const { data: trendsData, isLoading: trendsLoading } = useQuery<TrendsData>({
    queryKey: ['/api/compliance-visualization/trends', selectedBusiness, timeRange],
    refetchInterval: 30000,
  });

  // Fetch categories data
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<CategoriesData>({
    queryKey: ['/api/compliance-visualization/categories', selectedBusiness],
    refetchInterval: 30000,
  });

  if (metricsLoading || trendsLoading || categoriesLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <ParaFortLoader size="lg" />
        </div>
      </div>
    );
  }

  if (!complianceData || !trendsData || !categoriesData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Compliance Data Available</h3>
              <p className="text-gray-600">Start by creating compliance events for your businesses to see visualizations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { overall, businesses } = complianceData;
  const { trends } = trendsData;
  const { categories } = categoriesData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Progress Visualization</h1>
          <p className="text-gray-600 mt-2">Real-time compliance tracking and analytics dashboard</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {businesses.map((business) => (
                <SelectItem key={business.businessId} value={business.businessId}>
                  {business.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Compliance requirements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.completionRate.toFixed(1)}%</div>
            <Progress value={overall.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overall.overdueItems}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overall.onTimeRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Completed on schedule
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="businesses">Business Status</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trends</CardTitle>
              <CardDescription>Track completion rates and overdue items over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="#27884b" 
                    strokeWidth={2}
                    name="Completion Rate (%)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="overdueCount" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Overdue Count"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="resolvedIssues" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Resolved Issues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Compliance requirements by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Progress</CardTitle>
                <CardDescription>Completion status by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="businesses" className="space-y-4">
          <div className="grid gap-6">
            {businesses.map((business) => (
              <Card key={business.businessId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {business.businessName}
                      </CardTitle>
                      <CardDescription>{business.entityType}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(business.riskLevel)}>
                        {getRiskIcon(business.riskLevel)}
                        {business.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{business.overallScore}%</div>
                        <div className="text-xs text-muted-foreground">Overall Score</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{business.metrics.totalItems}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{business.metrics.completedItems}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">{business.metrics.inProgressItems}</div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">{business.metrics.overdueItems}</div>
                      <div className="text-xs text-muted-foreground">Overdue</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Progress</span>
                      <span>{business.metrics.completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={business.metrics.completionRate} className="h-2" />
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