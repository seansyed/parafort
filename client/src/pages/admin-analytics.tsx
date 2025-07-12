import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  FileText,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  UserPlus,
  ShoppingCart,
  Building
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 125600,
      revenueGrowth: 12.5,
      totalUsers: 1847,
      userGrowth: 8.3,
      totalOrders: 523,
      orderGrowth: -2.1,
      conversionRate: 3.2,
      conversionGrowth: 1.8
    },
    userMetrics: {
      newUsers: 156,
      activeUsers: 892,
      returningUsers: 421,
      churnRate: 2.1
    },
    revenueBreakdown: [
      { service: "LLC Formation", revenue: 45200, orders: 226, percentage: 36 },
      { service: "Corporation Formation", revenue: 38100, orders: 127, percentage: 30 },
      { service: "Digital Mailbox", revenue: 18900, orders: 189, percentage: 15 },
      { service: "Registered Agent", revenue: 12400, orders: 124, percentage: 10 },
      { service: "EIN Application", revenue: 11000, orders: 220, percentage: 9 }
    ],
    topPages: [
      { page: "/formation", views: 12456, bounceRate: 23.5, avgTime: "03:42" },
      { page: "/services", views: 8932, bounceRate: 31.2, avgTime: "02:18" },
      { page: "/pricing", views: 6789, bounceRate: 42.1, avgTime: "01:56" },
      { page: "/about", views: 4321, bounceRate: 35.8, avgTime: "02:45" },
      { page: "/contact", views: 3210, bounceRate: 28.9, avgTime: "01:32" }
    ],
    geographicData: [
      { state: "California", users: 342, revenue: 28900 },
      { state: "Texas", users: 289, revenue: 24100 },
      { state: "New York", users: 234, revenue: 19800 },
      { state: "Florida", users: 198, revenue: 16500 },
      { state: "Illinois", users: 167, revenue: 14200 }
    ]
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <main className="flex-1 p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 mb-2">
                <BarChart3 className="h-8 w-8 text-slate-600" />
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleRefreshData} 
                  disabled={refreshing}
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Monitor business performance and user engagement metrics</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className={`flex items-center space-x-2 ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                  {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                  <span className="text-sm font-medium">{Math.abs(analyticsData.overview.revenueGrowth)}%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className={`flex items-center space-x-2 ${getGrowthColor(analyticsData.overview.userGrowth)}`}>
                  {getGrowthIcon(analyticsData.overview.userGrowth)}
                  <span className="text-sm font-medium">{Math.abs(analyticsData.overview.userGrowth)}%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-orange-600">{analyticsData.overview.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-orange-500" />
                </div>
                <div className={`flex items-center space-x-2 ${getGrowthColor(analyticsData.overview.orderGrowth)}`}>
                  {getGrowthIcon(analyticsData.overview.orderGrowth)}
                  <span className="text-sm font-medium">{Math.abs(analyticsData.overview.orderGrowth)}%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{analyticsData.overview.conversionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
                <div className={`flex items-center space-x-2 ${getGrowthColor(analyticsData.overview.conversionGrowth)}`}>
                  {getGrowthIcon(analyticsData.overview.conversionGrowth)}
                  <span className="text-sm font-medium">{Math.abs(analyticsData.overview.conversionGrowth)}%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span>Revenue by Service</span>
                </CardTitle>
                <CardDescription>Performance breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.revenueBreakdown.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{service.service}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(service.revenue)}</span>
                        </div>
                        <Progress value={service.percentage} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{service.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>User Engagement</span>
                </CardTitle>
                <CardDescription>User activity and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <UserPlus className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.userMetrics.newUsers}</p>
                    <p className="text-sm text-gray-600">New Users</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{analyticsData.userMetrics.activeUsers}</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{analyticsData.userMetrics.returningUsers}</p>
                    <p className="text-sm text-gray-600">Returning Users</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{analyticsData.userMetrics.churnRate}%</p>
                    <p className="text-sm text-gray-600">Churn Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages & Geographic Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <span>Top Pages</span>
                </CardTitle>
                <CardDescription>Most visited pages and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Bounce Rate</TableHead>
                      <TableHead>Avg Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.topPages.map((page, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{page.page}</TableCell>
                        <TableCell className="font-semibold">{page.views.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={page.bounceRate > 40 ? "destructive" : "secondary"}>
                            {page.bounceRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{page.avgTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Geographic Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-slate-500" />
                  <span>Top States</span>
                </CardTitle>
                <CardDescription>User distribution and revenue by state</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.geographicData.map((state, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{state.state}</TableCell>
                        <TableCell>{state.users}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(state.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}