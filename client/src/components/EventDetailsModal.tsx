import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  DollarSign,
  Bell,
  FileText,
  Building2,
  Tag,
  Priority
} from "lucide-react";
import { format } from "date-fns";

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

interface EventDetailsModalProps {
  event: ComplianceEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkComplete: (eventId: string) => void;
  onUpdateEvent: (eventId: string, updates: any) => void;
  isUpdating: boolean;
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onMarkComplete,
  onUpdateEvent,
  isUpdating,
}: EventDetailsModalProps) {
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Update local notes when event changes
  useEffect(() => {
    if (event) {
      setNotes(event.notes || "");
      setIsEditingNotes(false);
    }
  }, [event]);

  if (!event) return null;

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Upcoming":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Clock className="h-4 w-4" />,
        };
      case "Overdue":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <AlertTriangle className="h-4 w-4" />,
        };
      case "Completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="h-4 w-4" />,
        };
    }
  };

  // Get priority color
  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case "High":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <Priority className="h-4 w-4" />,
        };
      case "Medium":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Priority className="h-4 w-4" />,
        };
      case "Low":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <Priority className="h-4 w-4" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Priority className="h-4 w-4" />,
        };
    }
  };

  // Get category color
  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "Annual/Biennial":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Calendar className="h-4 w-4" />,
        };
      case "Tax-Related":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: <DollarSign className="h-4 w-4" />,
        };
      case "Industry-Specific":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <Building2 className="h-4 w-4" />,
        };
      case "Registered Agent Notice":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          icon: <Bell className="h-4 w-4" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Tag className="h-4 w-4" />,
        };
    }
  };

  const statusDisplay = getStatusDisplay(event.status);
  const priorityDisplay = getPriorityDisplay(event.priority);
  const categoryDisplay = getCategoryDisplay(event.category);

  const dueDate = new Date(event.dueDate);
  const isOverdue = dueDate < new Date() && event.status !== "Completed";
  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleSaveNotes = () => {
    if (notes !== event.notes) {
      onUpdateEvent(event._id, { notes });
    }
    setIsEditingNotes(false);
  };

  const handleMarkComplete = () => {
    onMarkComplete(event._id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={`${statusDisplay.color} flex items-center gap-1 px-3 py-1`}>
              {statusDisplay.icon}
              {event.status}
            </Badge>
            <Badge className={`${priorityDisplay.color} flex items-center gap-1 px-3 py-1`}>
              {priorityDisplay.icon}
              {event.priority} Priority
            </Badge>
            <Badge className={`${categoryDisplay.color} flex items-center gap-1 px-3 py-1`}>
              {categoryDisplay.icon}
              {event.category}
            </Badge>
          </div>

          {/* Due Date Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-medium">
                  {format(dueDate, "MMMM d, yyyy")}
                </span>
              </div>
              {isOverdue && (
                <p className="text-sm text-red-600 font-medium">
                  Overdue by {Math.abs(daysUntilDue)} days
                </p>
              )}
              {!isOverdue && event.status === "Upcoming" && (
                <p className="text-sm text-muted-foreground">
                  {daysUntilDue > 0 ? `Due in ${daysUntilDue} days` : "Due today"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Frequency</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg">{event.frequency}</span>
              </div>
            </div>
          </div>

          {/* Event Type and Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Event Type</Label>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg">{event.eventType}</span>
              </div>
            </div>

            {event.estimatedCost && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Estimated Cost</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-medium">
                    ${event.estimatedCost.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Filing Link */}
          {event.filingLink && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Filing Link</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(event.filingLink, "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Filing Portal
              </Button>
            </div>
          )}

          {/* Reminder Information */}
          {event.remindersSent > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Reminders</Label>
              <div className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>
                  {event.remindersSent} reminder{event.remindersSent !== 1 ? "s" : ""} sent
                </span>
                {event.lastReminderSent && (
                  <span className="text-muted-foreground">
                    (Last: {format(new Date(event.lastReminderSent), "MMM d, yyyy")})
                  </span>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
              {!isEditingNotes && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  {event.notes ? "Edit Notes" : "Add Notes"}
                </Button>
              )}
            </div>
            
            {isEditingNotes ? (
              <div className="space-y-3">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this compliance event..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNotes(event.notes || "");
                      setIsEditingNotes(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="min-h-[50px] p-3 bg-gray-50 rounded-md">
                {event.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{event.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No notes added yet. Click "Add Notes" to add information about this event.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {format(new Date(event.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {format(new Date(event.updatedAt), "MMM d, yyyy 'at' h:mm a")}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {event.status !== "Completed" && (
            <Button
              onClick={handleMarkComplete}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? "Updating..." : "Mark as Complete"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}