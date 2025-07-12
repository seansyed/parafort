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
  Shield, 
  AlertTriangle, 
  Eye, 
  Search, 
  Download,
  Filter,
  Clock,
  User,
  Activity
} from "lucide-react";

export default function AdminSecurity() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const securityIncidents = [
    {
      id: 1,
      type: "Failed Login Attempt",
      severity: "medium",
      user: "admin@parafort.com",
      timestamp: "2024-01-20 14:30:25",
      ipAddress: "192.168.1.100",
      status: "resolved"
    },
    {
      id: 2,
      type: "Unauthorized API Access",
      severity: "high",
      user: "client@example.com",
      timestamp: "2024-01-20 13:15:42",
      ipAddress: "10.0.0.15",
      status: "investigating"
    },
    {
      id: 3,
      type: "Suspicious Data Export",
      severity: "critical",
      user: "user@company.com",
      timestamp: "2024-01-20 12:45:18",
      ipAddress: "172.16.0.50",
      status: "open"
    }
  ];

  const auditLogs = [
    {
      id: 1,
      action: "User Login",
      user: "john.doe@parafort.com",
      timestamp: "2024-01-20 15:45:32",
      ipAddress: "192.168.1.200",
      details: "Successful login from web interface"
    },
    {
      id: 2,
      action: "Service Created",
      user: "admin@parafort.com",
      timestamp: "2024-01-20 15:30:15",
      ipAddress: "192.168.1.100",
      details: "Created new compliance service"
    },
    {
      id: 3,
      action: "Client Data Access",
      user: "support@parafort.com",
      timestamp: "2024-01-20 15:15:08",
      ipAddress: "10.0.0.25",
      details: "Accessed client dashboard for user ID 12345"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "investigating": return "bg-blue-100 text-blue-800 border-blue-200";
      case "open": return "bg-red-100 text-red-800 border-red-200";
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
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="h-8 w-8 text-slate-600" />
              <h1 className="text-3xl font-bold text-gray-900">Security & Audit</h1>
            </div>
            <p className="text-gray-600">Monitor security events and audit system activity</p>
          </div>

          {/* Security Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                    <p className="text-2xl font-bold text-red-600">3</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Failed Logins (24h)</p>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-2xl font-bold text-blue-600">45</p>
                  </div>
                  <User className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Audit Events (24h)</p>
                    <p className="text-2xl font-bold text-green-600">1,247</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Incidents */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Security Incidents</span>
                  </CardTitle>
                  <CardDescription>Monitor and investigate security threats</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.type}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.user}</TableCell>
                      <TableCell className="font-mono text-sm">{incident.ipAddress}</TableCell>
                      <TableCell>{incident.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Audit Logs</span>
                  </CardTitle>
                  <CardDescription>Track all system activities and user actions</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search audit logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24h</SelectItem>
                      <SelectItem value="7d">7d</SelectItem>
                      <SelectItem value="30d">30d</SelectItem>
                      <SelectItem value="90d">90d</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell className="text-gray-600">{log.details}</TableCell>
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