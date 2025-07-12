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
  BarChart3, 
  Users, 
  Building,
  AlertTriangle,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UrgentComplianceEvent {
  id: number;
  businessEntityId: number;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  dueDate: string;
  priority: string;
  status: string;
  businessName?: string;
}

export default function AdminDashboard() {
  // Fetch urgent compliance events
  const { data: urgentEvents = [], isLoading: urgentEventsLoading } = useQuery({
    queryKey: ["/api/compliance/urgent-events"],
    select: (data: UrgentComplianceEvent[]) => data || []
  });

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard-stats"],
    select: (data: any) => data || {}
  });

  const getUrgencyColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <main className="flex-1 p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="h-8 w-8 text-slate-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">Monitor system performance and urgent compliance events</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12% from last month</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeBusinesses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8% from last month</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (Monthly)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15% from last month</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.documentsProcessed || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">This month</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Compliance Events Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-lg">Urgent Compliance Events</CardTitle>
                    <Badge variant="destructive" className="ml-2">
                      {urgentEvents.length} Urgent
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View All Events
                  </Button>
                </div>
                <CardDescription>
                  Critical compliance deadlines requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {urgentEventsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : urgentEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">No urgent compliance events</p>
                    <p className="text-sm text-gray-400">All deadlines are under control</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {urgentEvents.slice(0, 5).map((event) => {
                      const daysUntilDue = getDaysUntilDue(event.dueDate);
                      const isOverdue = daysUntilDue < 0;
                      const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;
                      
                      return (
                        <div
                          key={event.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            isOverdue 
                              ? 'border-l-red-500 bg-red-50' 
                              : isDueSoon 
                              ? 'border-l-orange-500 bg-green-50' 
                              : 'border-l-yellow-500 bg-yellow-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">{event.eventTitle}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={getUrgencyColor(event.priority)}
                                >
                                  {event.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{event.eventDescription}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Building className="h-3 w-3 mr-1" />
                                  Business ID: {event.businessEntityId}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Due: {new Date(event.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              {isOverdue ? (
                                <div className="flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  <span className="text-sm font-medium">
                                    {Math.abs(daysUntilDue)} days overdue
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center text-orange-600">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span className="text-sm font-medium">
                                    {daysUntilDue} days left
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {urgentEvents.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="ghost" size="sm">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View {urgentEvents.length - 5} more urgent events
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* System Health Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Performance</CardTitle>
                <CardDescription>Current system health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Database Performance</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Response Time</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Email Delivery</span>
                      <span>99%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest system events and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>New business formation completed</span>
                    <span className="text-gray-400 ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Compliance reminder sent</span>
                    <span className="text-gray-400 ml-auto">15 min ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Document uploaded</span>
                    <span className="text-gray-400 ml-auto">1 hour ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Payment processed</span>
                    <span className="text-gray-400 ml-auto">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}