import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Info, AlertTriangle, CheckCircle, AlertCircle, Megaphone, Tag, Clock } from "lucide-react";
import type { Announcement } from "@shared/schema";

// Countdown timer component for promotions
interface CountdownTimerProps {
  expirationDate: string;
}

function CountdownTimer({ expirationDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiration = new Date(expirationDate).getTime();
      const difference = expiration - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expirationDate]);

  if (!timeLeft) {
    return <span className="text-red-500 text-sm font-medium">Expired</span>;
  }

  return (
    <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
      <Clock className="w-3 h-3" />
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours.toString().padStart(2, '0')}:
        {timeLeft.minutes.toString().padStart(2, '0')}:
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

interface AnnouncementBannerProps {
  location?: string;
}

export default function AnnouncementBanner({ location = "dashboard" }: AnnouncementBannerProps) {
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<number[]>([]);
  const queryClient = useQueryClient();

  // Fetch active announcements
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["/api/announcements"],
    retry: false,
  });

  // Record interaction mutation
  const interactionMutation = useMutation({
    mutationFn: async ({ announcementId, interactionType, interactionData }: {
      announcementId: number;
      interactionType: string;
      interactionData?: any;
    }) => {
      const response = await apiRequest("POST", `/api/announcements/${announcementId}/interact`, {
        interactionType,
        interactionData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  // Filter announcements by location and dismissed status
  const visibleAnnouncements = announcements?.filter((announcement: Announcement) => {
    if (dismissedAnnouncements.includes(announcement.id)) return false;
    if (announcement.displayLocation === "specific_pages" && announcement.specificPages) {
      return announcement.specificPages.includes(location);
    }
    return announcement.displayLocation === "all_pages" || announcement.displayLocation === location;
  }) || [];

  // Record view interactions when announcements are loaded
  useEffect(() => {
    if (visibleAnnouncements.length > 0) {
      visibleAnnouncements.forEach((announcement: Announcement) => {
        interactionMutation.mutate({
          announcementId: announcement.id,
          interactionType: "viewed",
          interactionData: { location, timestamp: new Date() }
        });
      });
    }
  }, [visibleAnnouncements.length]);

  const handleDismiss = (announcementId: number) => {
    setDismissedAnnouncements(prev => [...prev, announcementId]);
    interactionMutation.mutate({
      announcementId,
      interactionType: "dismissed",
      interactionData: { location, timestamp: new Date() }
    });
  };

  const handleClick = (announcement: Announcement) => {
    if (announcement.hasCallToAction && announcement.ctaUrl) {
      interactionMutation.mutate({
        announcementId: announcement.id,
        interactionType: "clicked",
        interactionData: { ctaUrl: announcement.ctaUrl, location, timestamp: new Date() }
      });

      // Handle different CTA types
      if (announcement.ctaType === "internal_route") {
        window.location.href = announcement.ctaUrl;
      } else if (announcement.ctaType === "download") {
        window.open(announcement.ctaUrl, "_blank");
      } else {
        window.open(announcement.ctaUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const getIcon = (iconType: string, type?: string) => {
    // Show promotion icon for promotional announcements
    if (type === "promotion") {
      return <Tag className="w-5 h-5" />;
    }
    
    switch (iconType) {
      case "warning": return <AlertTriangle className="w-5 h-5" />;
      case "success": return <CheckCircle className="w-5 h-5" />;
      case "error": return <AlertCircle className="w-5 h-5" />;
      case "announcement": return <Megaphone className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />; // Default to promotion icon
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-white border border-gray-200";
      case "high": return "bg-white border border-gray-200";
      case "normal": return "bg-white border border-gray-200";
      case "low": return "bg-white border border-gray-200";
      default: return "bg-white border border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "promotion": return "bg-orange-100 text-orange-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "security": return "bg-red-100 text-red-800";
      case "feature": return "bg-purple-100 text-purple-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="announcement-banner-override" id="announcement-banner-container">
      {visibleAnnouncements.map((announcement: Announcement) => (
        <Card 
          key={announcement.id} 
          className="border-0 shadow-none bg-white announcement-banner-override m-0 p-0"
          data-announcement-card="true"
        >
          <CardContent className="p-0 m-0">
            <div className="flex items-start justify-between gap-4 p-4">
              <div className="flex items-start gap-3 flex-1 justify-center">
                <div className="flex-shrink-0 mt-0.5" style={{ color: announcement.textColor || "#374151" }}>
                  {getIcon(announcement.iconType, announcement.type)}
                </div>
                <div className="flex-1 min-w-0 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg animate-gradient-text" style={{ color: announcement.textColor || "#111827" }}>
                      {announcement.title}
                    </h3>
                    {announcement.priority === "urgent" && (
                      <Badge className="bg-red-500 text-white">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: announcement.textColor || "#374151" }}>
                    {announcement.content}
                  </p>
                  {/* Show countdown timer for promotions with expiration dates - moved below description */}
                  {announcement.type === "promotion" && announcement.expirationDate && (
                    <div className="flex justify-center mb-2">
                      <CountdownTimer expirationDate={announcement.expirationDate} />
                    </div>
                  )}
                  {announcement.hasCallToAction && announcement.ctaText && announcement.ctaUrl && (
                    <Button
                      onClick={() => handleClick(announcement)}
                      className="mt-2 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
                      size="sm"
                    >
                      {announcement.ctaText}
                    </Button>
                  )}
                </div>
              </div>
              {announcement.dismissible && (
                <button
                  onClick={() => handleDismiss(announcement.id)}
                  className="flex-shrink-0 h-8 w-8 p-0 rounded-md hover:bg-gray-100 flex items-center justify-center"
                  style={{ 
                    color: "#6B7280",
                    backgroundColor: "transparent",
                    border: "1px solid #D1D5DB"
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Auto-hiding announcement component for temporary notifications
interface AutoHideAnnouncementProps {
  announcement: Announcement;
  onHide: () => void;
}

export function AutoHideAnnouncement({ announcement, onHide }: AutoHideAnnouncementProps) {
  useEffect(() => {
    if (announcement.autoHide && announcement.autoHideDelay) {
      const timer = setTimeout(() => {
        onHide();
      }, announcement.autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [announcement, onHide]);

  return (
    <div 
      className="fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: announcement.backgroundColor || "#10b981",
        color: announcement.textColor || "#ffffff"
      }}
    >
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                {announcement.iconType === "success" && <CheckCircle className="w-5 h-5" />}
                {announcement.iconType === "warning" && <AlertTriangle className="w-5 h-5" />}
                {announcement.iconType === "error" && <AlertCircle className="w-5 h-5" />}
                {announcement.iconType === "info" && <Info className="w-5 h-5" />}
                {announcement.iconType === "announcement" && <Megaphone className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{announcement.title}</h4>
                <p className="text-xs opacity-90">{announcement.content}</p>
              </div>
            </div>
            {announcement.dismissible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onHide}
                className="flex-shrink-0 h-6 w-6 p-0 hover:bg-white/20"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}