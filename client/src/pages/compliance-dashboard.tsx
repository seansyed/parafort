import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Bell, 
  Mail, 
  Phone,
  FileText,
  Target,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Plus
} from "lucide-react";
// Calendar will be implemented with a simple monthly view for now
import { apiRequest } from "@/lib/queryClient";
import { format, parseISO, differenceInDays, isAfter, isBefore } from "date-fns";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ComplianceEvent {
  id: number;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue" | "dismissed";
  priority: "high" | "medium" | "low";
  category: string;
  isRecurring: boolean;
  recurringInterval?: string;
}

interface ComplianceNotification {
  id: number;
  notificationType: string;
  title: string;
  message: string;
  scheduledDate: string;
  sentDate?: string;
  status: "pending" | "sent" | "failed";
}

export default function ComplianceDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

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

  // Fetch user's business entities
  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: isAuthenticated,
    retry: false,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
    },
  });

  // Set default business if available
  useEffect(() => {
    if (businesses.length > 0 && !selectedBusinessId) {
      setSelectedBusinessId(businesses[0].id);
    }
  }, [businesses, selectedBusinessId]);

  // Fetch compliance events
  const { data: complianceEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/compliance/calendar", selectedBusinessId],
    enabled: !!selectedBusinessId,
    retry: false,
  });

  // Fetch compliance notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/compliance/notifications", selectedBusinessId],
    enabled: !!selectedBusinessId,
    retry: false,
  });

  // Generate compliance events mutation
  const generateEventsMutation = useMutation({
    mutationFn: async (businessId: string) => {
      console.log("Generating events for business ID:", businessId);
      return await apiRequest("POST", `/api/compliance/generate/${businessId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Compliance events generated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/calendar", selectedBusinessId] });
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/notifications", selectedBusinessId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate compliance events",
        variant: "destructive",
      });
    },
  });

  // Complete compliance event mutation
  const completeEventMutation = useMutation({
    mutationFn: async (calendarId: number) => {
      return await apiRequest("PATCH", `/api/compliance/complete/${calendarId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Compliance event marked as completed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/calendar", selectedBusinessId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete compliance event",
        variant: "destructive",
      });
    },
  });

  // Check reminders mutation
  const checkRemindersMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/compliance/check-reminders"),
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Compliance reminders checked and sent",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/calendar", selectedBusinessId] });
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/notifications", selectedBusinessId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check reminders",
        variant: "destructive",
      });
    },
  });

  // Filter events based on status and priority
  const filteredEvents = complianceEvents.filter((event: ComplianceEvent) => {
    const statusMatch = filterStatus === "all" || event.status === filterStatus;
    const priorityMatch = filterPriority === "all" || event.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Calculate compliance statistics
  const complianceStats = {
    total: complianceEvents.length,
    pending: complianceEvents.filter((e: ComplianceEvent) => e.status === "pending").length,
    completed: complianceEvents.filter((e: ComplianceEvent) => e.status === "completed").length,
    overdue: complianceEvents.filter((e: ComplianceEvent) => {
      return e.status === "pending" && isAfter(new Date(), parseISO(e.dueDate));
    }).length,
    dueThisWeek: complianceEvents.filter((e: ComplianceEvent) => {
      const daysUntilDue = differenceInDays(parseISO(e.dueDate), new Date());
      return e.status === "pending" && daysUntilDue <= 7 && daysUntilDue >= 0;
    }).length,
  };

  const complianceScore = complianceStats.total > 0 
    ? Math.round((complianceStats.completed / complianceStats.total) * 100)
    : 100;

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-blue-100 text-blue-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate days until due
  const getDaysUntilDue = (dueDate: string) => {
    return differenceInDays(parseISO(dueDate), new Date());
  };

  if (authLoading || businessesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading compliance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-36 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Dashboard</h1>
          <p className="text-gray-600">Stay on top of your business compliance requirements</p>
        </div>

        {/* Business Selector */}
        {businesses.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Business Entity
            </label>
            <select
              value={selectedBusinessId || ""}
              onChange={(e) => setSelectedBusinessId(parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              {businesses.map((business: any) => (
                <option key={business.id} value={business.id}>
                  {business.name} ({business.entityType})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBusinessId && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{complianceScore}%</div>
                  <Progress value={complianceScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{complianceStats.dueThisWeek}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{complianceStats.overdue}</div>
                  <p className="text-xs text-muted-foreground">Immediate action needed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{complianceStats.completed}</div>
                  <p className="text-xs text-muted-foreground">Out of {complianceStats.total} total</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="mb-6 flex flex-wrap gap-4">
              <Button
                onClick={() => selectedBusinessId && generateEventsMutation.mutate(selectedBusinessId)}
                disabled={generateEventsMutation.isPending || !selectedBusinessId}
                className="bg-green-500 hover:bg-green-600"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Generate Compliance Events
              </Button>
              <Button
                onClick={() => checkRemindersMutation.mutate()}
                disabled={checkRemindersMutation.isPending}
                variant="outline"
              >
                <Bell className="w-4 h-4 mr-2" />
                Check Reminders
              </Button>
            </div>

            {/* Tips for a New Business Owner Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Tips for a New Business Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-gray-800 mb-4">Don't be reactive. Be proactive.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">1. Create a Compliance Calendar immediately.</h3>
                    <p className="text-gray-700 mb-2">As soon as you form your business, sit down with a calendar. Add every deadline you can identify for the next 12-18 months.</p>
                    <ul className="ml-6 space-y-1 text-gray-700">
                      <li><strong>Weekly:</strong> Payroll tax deposits (if applicable).</li>
                      <li><strong>Monthly/Quarterly:</strong> Sales tax filings.</li>
                      <li><strong>Quarterly:</strong> Federal and state estimated tax payments (April 15, June 15, Sept 15, Jan 15).</li>
                      <li><strong>Annually:</strong> Annual Report filing, business license renewal, franchise tax payment, annual income tax return.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">2. Hire Professionals Early.</h3>
                    <p className="text-gray-700">Don't wait until you're in trouble. An accountant and a registered agent are not luxuries; they are essential parts of your compliance infrastructure from day one.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">3. Read All Official-Looking Mail.</h3>
                    <p className="text-gray-700">Never toss mail from the IRS, your Secretary of State, or your city/county licensing department. Read it carefully.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">4. Keep Your Address Updated.</h3>
                    <p className="text-gray-700">Your business address on file with the state and the IRS must always be current. This is where official notices are sent.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">5. Check Official Websites Periodically.</h3>
                    <p className="text-gray-700">Check websites for your Secretary of State and Department of Revenue. They often have portals where you can see your business status and upcoming deadlines.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Urgent Items Alert */}
                {(complianceStats.overdue > 0 || complianceStats.dueThisWeek > 0) && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      You have {complianceStats.overdue} overdue items and {complianceStats.dueThisWeek} items due this week. 
                      Please review and take action to maintain compliance.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Recent Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Compliance Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredEvents.slice(0, 5).map((event: ComplianceEvent) => {
                        const daysUntilDue = getDaysUntilDue(event.dueDate);
                        const isOverdue = daysUntilDue < 0 && event.status === "pending";
                        
                        return (
                          <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{event.eventTitle}</h4>
                              <p className="text-sm text-gray-600 mt-1">{event.eventDescription}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={getPriorityColor(event.priority)}>
                                  {event.priority}
                                </Badge>
                                <Badge className={getStatusColor(isOverdue ? "overdue" : event.status)}>
                                  {isOverdue ? "overdue" : event.status}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Due: {format(parseISO(event.dueDate), "MMM d, yyyy")}
                                  {event.status === "pending" && (
                                    <span className={daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 7 ? "text-yellow-600" : ""}>
                                      {daysUntilDue < 0 ? ` (${Math.abs(daysUntilDue)} days overdue)` :
                                       daysUntilDue === 0 ? " (Due today)" :
                                       ` (${daysUntilDue} days)`}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                            {event.status === "pending" && (
                              <Button
                                onClick={() => completeEventMutation.mutate(event.id)}
                                disabled={completeEventMutation.isPending}
                                size="sm"
                                className="ml-4"
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Events List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredEvents.map((event: ComplianceEvent) => {
                        const daysUntilDue = getDaysUntilDue(event.dueDate);
                        const isOverdue = daysUntilDue < 0 && event.status === "pending";
                        
                        return (
                          <div key={event.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{event.eventTitle}</h4>
                                <p className="text-gray-600 mt-1">{event.eventDescription}</p>
                                
                                <div className="flex items-center gap-2 mt-3">
                                  <Badge className={getPriorityColor(event.priority)}>
                                    {event.priority} priority
                                  </Badge>
                                  <Badge className={getStatusColor(isOverdue ? "overdue" : event.status)}>
                                    {isOverdue ? "overdue" : event.status}
                                  </Badge>
                                  <Badge variant="outline">
                                    {event.category}
                                  </Badge>
                                  {event.isRecurring && (
                                    <Badge variant="outline">
                                      Recurring ({event.recurringInterval})
                                    </Badge>
                                  )}
                                </div>

                                <div className="mt-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <CalendarIcon className="w-4 h-4" />
                                      Due: {format(parseISO(event.dueDate), "EEEE, MMMM d, yyyy")}
                                    </span>
                                    {event.status === "pending" && (
                                      <span className={`flex items-center gap-1 ${
                                        daysUntilDue < 0 ? "text-red-600" : 
                                        daysUntilDue <= 7 ? "text-yellow-600" : ""
                                      }`}>
                                        <Clock className="w-4 h-4" />
                                        {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                                         daysUntilDue === 0 ? "Due today" :
                                         `${daysUntilDue} days remaining`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {event.status === "pending" && (
                                <Button
                                  onClick={() => completeEventMutation.mutate(event.id)}
                                  disabled={completeEventMutation.isPending}
                                  className="ml-4"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification: any) => (
                        <div key={notification.notification.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{notification.notification.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{notification.notification.message}</p>
                              
                              <div className="flex items-center gap-4 mt-3 text-sm">
                                <span className="flex items-center gap-1">
                                  {notification.notification.notificationType === "email" && <Mail className="w-4 h-4" />}
                                  {notification.notification.notificationType === "sms" && <Phone className="w-4 h-4" />}
                                  {notification.notification.notificationType === "dashboard" && <Bell className="w-4 h-4" />}
                                  {notification.notification.notificationType}
                                </span>
                                <span>
                                  Scheduled: {format(parseISO(notification.notification.scheduledDate), "MMM d, yyyy 'at' h:mm a")}
                                </span>
                                {notification.notification.sentDate && (
                                  <span>
                                    Sent: {format(parseISO(notification.notification.sentDate), "MMM d, yyyy 'at' h:mm a")}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <Badge className={getStatusColor(notification.notification.status)}>
                              {notification.notification.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}