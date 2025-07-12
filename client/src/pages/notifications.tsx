import { useState } from "react";
import { Bell, CheckCheck, Filter, Search, Clock, AlertTriangle, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import type { Notification } from "@shared/schema";

const priorityColors = {
  low: "text-gray-500 border-gray-500 bg-white",
  normal: "text-blue-500 border-blue-500 bg-white",
  high: "text-orange-500 border-green-500 bg-white",
  urgent: "text-red-500 border-red-500 bg-white"
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

function NotificationCard({ notification, onMarkAsRead, isSelected, onToggleSelect }: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
}) {
  const PriorityIcon = priorityIcons[notification.priority as keyof typeof priorityIcons] || Info;
  const categoryIcon = categoryIcons[notification.category as keyof typeof categoryIcons] || "📋";
  const priorityClass = priorityColors[notification.priority as keyof typeof priorityColors] || "text-gray-500 bg-gray-100";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        !notification.isRead ? "border-l-4 border-l-orange-500 bg-green-50/30" : ""
      } ${isSelected ? "ring-2 ring-orange-500" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Selection Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(notification.id)}
              className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            
            {/* Category Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-lg">{categoryIcon}</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-lg font-medium text-gray-900 ${
                  !notification.isRead ? "font-semibold" : ""
                }`}>
                  {notification.title}
                </h3>
                
                <div className="flex items-center gap-2 ml-4">
                  <Badge className={`${priorityClass} text-xs`}>
                    <PriorityIcon size={12} className="mr-1" />
                    {notification.priority}
                  </Badge>
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-3 leading-relaxed">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {notification.category}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  {notification.actionUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = notification.actionUrl!}
                    >
                      View Details
                    </Button>
                  )}
                  
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <CheckCheck size={16} className="mr-1" />
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

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
    limit: 100
  });

  // Filter notifications based on search and filters
  const filteredNotifications = (notifications || []).filter((notification: any) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    const matchesReadStatus = filter === "all" || (filter === "unread" && !notification.isRead);
    
    return matchesSearch && matchesCategory && matchesPriority && matchesReadStatus;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n: any) => n.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => markAsRead(id));
    setSelectedNotifications([]);
  };

  const categories = Array.from(new Set((notifications || []).map((n: any) => n.category)));
  const priorities = ["low", "normal", "high", "urgent"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          </div>
          <p className="text-gray-600">
            Stay updated with all your business activities and compliance requirements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications?.length || 0}</p>
                </div>
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(notifications?.length || 0) - unreadCount}
                  </p>
                </div>
                <CheckCheck className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <div className="flex items-center gap-2">
                {selectedNotifications.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkMarkAsRead}
                      disabled={isMarkingAsRead}
                    >
                      <CheckCheck size={16} className="mr-1" />
                      Mark Selected Read ({selectedNotifications.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNotifications([])}
                    >
                      Clear Selection
                    </Button>
                  </>
                )}
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAllAsRead()}
                    disabled={isMarkingAllAsRead}
                  >
                    <CheckCheck size={16} className="mr-1" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full lg:w-auto">
                    <Filter size={16} className="mr-2" />
                    Category: {categoryFilter === "all" ? "All" : categoryFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                      {categoryIcons[category as keyof typeof categoryIcons]} {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Priority Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full lg:w-auto">
                    <AlertTriangle size={16} className="mr-2" />
                    Priority: {priorityFilter === "all" ? "All" : priorityFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                    All Priorities
                  </DropdownMenuItem>
                  {priorities.map((priority) => (
                    <DropdownMenuItem key={priority} onClick={() => setPriorityFilter(priority)}>
                      {priority}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")}>
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="all">All ({notifications?.length || 0})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {filter === "all" ? "All Notifications" : "Unread Notifications"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedNotifications.length === filteredNotifications.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
                        />
                      </div>
                    ) : filteredNotifications.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-gray-500"
                      >
                        <Bell size={48} className="mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                        <p className="text-sm">
                          {filter === "unread" 
                            ? "You're all caught up! No unread notifications."
                            : "Try adjusting your search or filters."}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {filteredNotifications.map((notification: any, index: number) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <NotificationCard
                              notification={notification}
                              onMarkAsRead={markAsRead}
                              isSelected={selectedNotifications.includes(notification.id)}
                              onToggleSelect={handleToggleSelect}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}