import { useState } from "react";
import { Bell, X, CheckCheck, Clock, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import type { Notification } from "@shared/schema";
import { InlineLoader } from "@/components/LoadingSpinner";

const priorityColors = {
  low: "text-gray-500",
  normal: "text-blue-500",
  high: "text-orange-500",
  urgent: "text-red-500"
};

const priorityIcons = {
  low: Info,
  normal: Clock,
  high: AlertTriangle,
  urgent: AlertTriangle
};

const categoryIcons = {
  orders: "🛒",
  compliance: "⚖️",
  system: "⚙️",
  security: "🔒",
  general: "📋"
};

function NotificationItem({ notification, onMarkAsRead }: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}) {
  const PriorityIcon = priorityIcons[notification.priority as keyof typeof priorityIcons] || Info;
  const categoryIcon = categoryIcons[notification.category as keyof typeof categoryIcons] || "📋";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-sm">{categoryIcon}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className={`text-sm font-medium text-gray-900 line-clamp-2 ${
              !notification.isRead ? "font-semibold" : ""
            }`}>
              {notification.title}
            </h4>
            
            <div className="flex items-center gap-2 ml-2">
              <PriorityIcon 
                size={14} 
                className={priorityColors[notification.priority as keyof typeof priorityColors]} 
              />
              {!notification.isRead && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
            
            <div className="flex items-center gap-2">
              {notification.actionUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => window.location.href = notification.actionUrl!}
                >
                  View
                </Button>
              )}
              
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  Mark Read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead
  } = useNotifications({
    includeRead: filter === "all",
    limit: 50
  });

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-gray-100 transition-colors duration-200"
        >
          <motion.div
            animate={unreadCount > 0 && isOpen ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ 
              duration: 0.5,
              repeat: unreadCount > 0 && isOpen ? Infinity : 0,
              repeatDelay: 3
            }}
          >
            <Bell size={20} className="text-gray-600" />
          </motion.div>
          
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -top-1 -right-1"
              >
                <Badge 
                  variant="destructive" 
                  className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-green-500 hover:bg-green-700"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0 shadow-lg border-0 rounded-lg"
        align="end"
        sideOffset={5}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => markAllAsRead()}
                  disabled={isMarkingAllAsRead}
                >
                  <CheckCheck size={14} className="mr-1" />
                  Mark All Read
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                filter === "unread"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                filter === "all"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setFilter("all")}
            >
              All ({notifications.length})
            </button>
          </div>
          
          {/* Notifications List */}
          <ScrollArea className="h-96">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-gray-500"
                >
                  <Bell size={32} className="mb-2 text-gray-300" />
                  <p className="text-sm">
                    {filter === "unread" ? "No unread notifications" : "No notifications"}
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </ScrollArea>
          
          {filteredNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/notifications";
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}