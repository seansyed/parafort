import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminNavigation from "@/components/admin-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Database, 
  Server, 
  Activity, 
  HardDrive, 
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
  Download,
  Settings
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AdminDatabase() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");
  const [refreshing, setRefreshing] = useState(false);

  // Mock database metrics
  const dbMetrics = {
    connectionPool: {
      active: 12,
      idle: 8,
      total: 20,
      usage: 60
    },
    performance: {
      avgQueryTime: 45,
      slowQueries: 3,
      queriesPerSecond: 120,
      cacheHitRatio: 89
    },
    storage: {
      totalSize: "2.4 GB",
      usedSpace: "1.8 GB",
      freeSpace: "0.6 GB",
      usage: 75
    },
    replication: {
      status: "healthy",
      lag: "0.2s",
      lastSync: "2024-01-20 15:30:25"
    }
  };

  const recentQueries = [
    {
      id: 1,
      query: "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '1 day'",
      duration: "23ms",
      timestamp: "2024-01-20 15:45:32",
      status: "completed",
      rows: 145
    },
    {
      id: 2,
      query: "UPDATE business_entities SET status = 'active' WHERE id = $1",
      duration: "12ms",
      timestamp: "2024-01-20 15:44:18",
      status: "completed",
      rows: 1
    },
    {
      id: 3,
      query: "SELECT COUNT(*) FROM service_orders WHERE DATE(created_at) = CURRENT_DATE",
      duration: "156ms",
      timestamp: "2024-01-20 15:43:05",
      status: "slow",
      rows: 1
    },
    {
      id: 4,
      query: "INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)",
      duration: "8ms",
      timestamp: "2024-01-20 15:42:47",
      status: "completed",
      rows: 1
    }
  ];

  const tableStats = [
    { name: "users", rows: "12,345", size: "245 MB", lastVacuum: "2 hours ago" },
    { name: "business_entities", rows: "8,976", size: "156 MB", lastVacuum: "4 hours ago" },
    { name: "service_orders", rows: "45,123", size: "890 MB", lastVacuum: "1 hour ago" },
    { name: "audit_logs", rows: "234,567", size: "1.2 GB", lastVacuum: "30 minutes ago" },
    { name: "sessions", rows: "1,234", size: "12 MB", lastVacuum: "6 hours ago" }
  ];

  const handleRefreshMetrics = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "slow": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
                <Database className="h-8 w-8 text-slate-600" />
                <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="6h">6h</SelectItem>
                    <SelectItem value="24h">24h</SelectItem>
                    <SelectItem value="7d">7d</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleRefreshMetrics} 
                  disabled={refreshing}
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Monitor database performance and manage system resources</p>
          </div>

          {/* Database Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connection Pool</p>
                    <p className="text-2xl font-bold text-blue-600">{dbMetrics.connectionPool.active}/{dbMetrics.connectionPool.total}</p>
                  </div>
                  <Server className="h-8 w-8 text-blue-500" />
                </div>
                <Progress value={dbMetrics.connectionPool.usage} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">{dbMetrics.connectionPool.usage}% utilized</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Query Time</p>
                    <p className="text-2xl font-bold text-green-600">{dbMetrics.performance.avgQueryTime}ms</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500">Within optimal range</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage Usage</p>
                    <p className="text-2xl font-bold text-orange-600">{dbMetrics.storage.usedSpace}</p>
                  </div>
                  <HardDrive className="h-8 w-8 text-orange-500" />
                </div>
                <Progress value={dbMetrics.storage.usage} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">{dbMetrics.storage.usage}% of {dbMetrics.storage.totalSize}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Queries/Sec</p>
                    <p className="text-2xl font-bold text-purple-600">{dbMetrics.performance.queriesPerSecond}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-gray-500">Cache hit: {dbMetrics.performance.cacheHitRatio}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Queries */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>Recent Queries</span>
                  </CardTitle>
                  <CardDescription>Monitor database query performance and identify slow operations</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    {dbMetrics.performance.slowQueries} slow queries
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentQueries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-mono text-sm max-w-md truncate">
                        {query.query}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {query.duration}
                      </TableCell>
                      <TableCell>{query.rows.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(query.status)}>
                          {query.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {query.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Table Statistics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-slate-500" />
                    <span>Table Statistics</span>
                  </CardTitle>
                  <CardDescription>Monitor table sizes and maintenance status</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Maintenance
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Row Count</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Last Vacuum</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableStats.map((table, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono font-medium">
                        {table.name}
                      </TableCell>
                      <TableCell>{table.rows}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell className="text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{table.lastVacuum}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Vacuum
                          </Button>
                          <Button variant="outline" size="sm">
                            Reindex
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}