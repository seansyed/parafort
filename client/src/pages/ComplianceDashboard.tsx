import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ComplianceCalendar from "@/components/ComplianceCalendar";
import EventDetailsModal from "@/components/EventDetailsModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react";

interface ComplianceEvent {
  _id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  eventType: string;
  dueDate: string;
  status: string;
  frequency: string;
  filingLink?: string;
  notes?: string;
  priority: string;
  estimatedCost?: number;
  remindersSent: number;
  lastReminderSent?: string;
  createdAt: string;
  updatedAt: string;
}

interface Business {
  _id: string;
  legalName: string;
  stateOfIncorporation: string;
  entityType: string;
  formationDate: string;
  industry: string;
  hasEmployees: boolean;
}

export default function ComplianceDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<ComplianceEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Fetch user businesses
  const { data: businesses, isLoading: businessesLoading } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: isAuthenticated,
  });

  // Set default business when businesses load
  useEffect(() => {
    if (businesses && businesses.length > 0 && !selectedBusiness) {
      setSelectedBusiness(businesses[0].id);
    }
  }, [businesses, selectedBusiness]);

  // Fetch compliance events for selected business
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/compliance/events/business", selectedBusiness, statusFilter, priorityFilter],
    enabled: !!selectedBusiness,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      params.append("sortBy", "dueDate");
      params.append("sortOrder", "asc");
      
      return apiRequest("GET", `/api/compliance/events/business/${selectedBusiness}?${params.toString()}`);
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ eventId, updates }: { eventId: string; updates: any }) => {
      return apiRequest("PUT", `/api/compliance/events/${eventId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/events/business", selectedBusiness] });
      toast({
        title: "Event Updated",
        description: "Compliance event has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });

  const handleEventClick = (event: ComplianceEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleEventUpdate = (eventId: string, updates: any) => {
    updateEventMutation.mutate({ eventId, updates });
  };

  const handleMarkComplete = (eventId: string) => {
    handleEventUpdate(eventId, { status: "Completed" });
    setIsModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the compliance dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (businessesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const events = eventsData?.events || [];
  const selectedBusinessData = businesses?.find((b: any) => b.id.toString() === selectedBusiness);

  // Calculate stats
  const upcomingEvents = events.filter((e: ComplianceEvent) => e.status === "Upcoming");
  const overdueEvents = events.filter((e: ComplianceEvent) => e.status === "Overdue");
  const completedEvents = events.filter((e: ComplianceEvent) => e.status === "Completed");
  const urgentEvents = events.filter((e: ComplianceEvent) => {
    if (e.status !== "Upcoming") return false;
    const dueDate = new Date(e.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7;
  });

  return (
    <div className="container mx-auto p-6 pt-36 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage compliance events for your business entities
          </p>
        </div>
        
        {/* Business Selector */}
        <div className="flex items-center space-x-4">
          <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a business" />
            </SelectTrigger>
            <SelectContent>
              {businesses?.map((business: any) => (
                <SelectItem key={business.id} value={business.id.toString()}>
                  {business.legalName} ({business.stateOfIncorporation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Events due in the future
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{urgentEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Due within 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Events past due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Priority:</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Info */}
      {selectedBusinessData && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Legal Name</label>
                <p className="text-lg font-semibold">{selectedBusinessData.legalName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                <p className="text-lg">{selectedBusinessData.entityType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">State</label>
                <p className="text-lg">{selectedBusinessData.stateOfIncorporation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Compliance Calendar
          </CardTitle>
          <CardDescription>
            View all compliance events in calendar format
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <ComplianceCalendar 
              events={events} 
              onEventClick={handleEventClick}
            />
          )}
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMarkComplete={handleMarkComplete}
        onUpdateEvent={handleEventUpdate}
        isUpdating={updateEventMutation.isPending}
      />
    </div>
  );
}