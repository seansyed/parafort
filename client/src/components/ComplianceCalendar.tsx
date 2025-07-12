import { useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Badge } from "@/components/ui/badge";

const localizer = momentLocalizer(moment);

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

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: ComplianceEvent;
}

interface ComplianceCalendarProps {
  events: ComplianceEvent[];
  onEventClick: (event: ComplianceEvent) => void;
}

export default function ComplianceCalendar({ events, onEventClick }: ComplianceCalendarProps) {
  // Transform compliance events to calendar events
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events.map((event) => {
      const startDate = new Date(event.dueDate);
      const endDate = new Date(event.dueDate);
      
      return {
        id: event._id,
        title: event.title,
        start: startDate,
        end: endDate,
        allDay: true,
        resource: event,
      };
    });
  }, [events]);

  // Get category color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Annual/Biennial":
        return "#3B82F6"; // Blue
      case "Tax-Related":
        return "#EF4444"; // Red
      case "Industry-Specific":
        return "#10B981"; // Green
      case "Registered Agent Notice":
        return "#F59E0B"; // Yellow/Orange
      default:
        return "#6B7280"; // Gray
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Upcoming":
        return "#3B82F6"; // Blue
      case "Overdue":
        return "#EF4444"; // Red
      case "Completed":
        return "#10B981"; // Green
      default:
        return "#6B7280"; // Gray
    }
  };

  // Get priority intensity
  const getPriorityOpacity = (priority: string): number => {
    switch (priority) {
      case "High":
        return 1.0;
      case "Medium":
        return 0.8;
      case "Low":
        return 0.6;
      default:
        return 0.7;
    }
  };

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const complianceEvent = event.resource;
    const categoryColor = getCategoryColor(complianceEvent.category);
    const statusColor = getStatusColor(complianceEvent.status);
    const opacity = getPriorityOpacity(complianceEvent.priority);

    return (
      <div
        className="compliance-event"
        style={{
          backgroundColor: categoryColor,
          opacity,
          color: "white",
          padding: "2px 4px",
          borderRadius: "4px",
          fontSize: "12px",
          border: `2px solid ${statusColor}`,
          cursor: "pointer",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={`${event.title} - ${complianceEvent.category} - ${complianceEvent.status} - ${complianceEvent.priority} Priority`}
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{event.title}</span>
          {complianceEvent.priority === "High" && (
            <span className="text-xs ml-1">!</span>
          )}
        </div>
      </div>
    );
  };

  // Custom event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const complianceEvent = event.resource;
    const categoryColor = getCategoryColor(complianceEvent.category);
    const statusColor = getStatusColor(complianceEvent.status);
    const opacity = getPriorityOpacity(complianceEvent.priority);

    return {
      style: {
        backgroundColor: categoryColor,
        borderColor: statusColor,
        borderWidth: "2px",
        borderStyle: "solid",
        opacity,
        color: "white",
        border: "none",
        borderRadius: "4px",
      },
    };
  };

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent) => {
    onEventClick(event.resource);
  };

  // Custom toolbar
  const CustomToolbar = ({ label, onNavigate, onView }: any) => {
    return (
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate("PREV")}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => onNavigate("TODAY")}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            >
              Today
            </button>
            <button
              onClick={() => onNavigate("NEXT")}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Next
            </button>
          </div>
          
          <h2 className="text-xl font-semibold">{label}</h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(Views.MONTH)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Month
            </button>
            <button
              onClick={() => onView(Views.WEEK)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Week
            </button>
            <button
              onClick={() => onView(Views.AGENDA)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Agenda
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Categories:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3B82F6" }}></div>
              <span>Annual/Biennial</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EF4444" }}></div>
              <span>Tax-Related</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10B981" }}></div>
              <span>Industry-Specific</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }}></div>
              <span>Registered Agent</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="font-medium">Status:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded border-2" style={{ borderColor: "#3B82F6" }}></div>
              <span>Upcoming</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded border-2" style={{ borderColor: "#EF4444" }}></div>
              <span>Overdue</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded border-2" style={{ borderColor: "#10B981" }}></div>
              <span>Completed</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium">Priority:</span>
            <span className="text-xs">High (Bright) • Medium (Medium) • Low (Faded)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="compliance-calendar h-[600px]">
      <style jsx>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-event {
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 12px;
        }
        .rbc-event.rbc-selected {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid #e5e7eb;
        }
        .rbc-time-view .rbc-time-gutter {
          background-color: #f9fafb;
        }
        .rbc-month-view {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .rbc-header {
          background-color: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
          padding: 8px;
          font-weight: 600;
        }
        .rbc-date-cell {
          padding: 4px;
        }
        .rbc-off-range-bg {
          background-color: #f9fafb;
        }
        .rbc-today {
          background-color: #fef3c7;
        }
        .compliance-event:hover {
          transform: scale(1.02);
          transition: transform 0.1s ease;
        }
      `}</style>
      
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
          toolbar: CustomToolbar,
        }}
        views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
        defaultView={Views.MONTH}
        popup
        popupOffset={{ x: 30, y: 20 }}
        messages={{
          next: "Next",
          previous: "Previous",
          today: "Today",
          month: "Month",
          week: "Week",
          agenda: "Agenda",
          date: "Date",
          time: "Time",
          event: "Event",
          allDay: "All Day",
          noEventsInRange: "No compliance events in this range.",
          showMore: (total) => `+${total} more`,
        }}
      />
    </div>
  );
}