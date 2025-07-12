import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Notification } from "@shared/schema";

interface NotificationFilters {
  limit?: number;
  includeRead?: boolean;
  category?: string;
  priority?: string;
}

export function useNotifications(filters: NotificationFilters = {}) {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading, error } = useQuery<Notification[]>({
    queryKey: ["/api/notifications", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.limit) params.set("limit", filters.limit.toString());
      if (filters.includeRead !== undefined) params.set("includeRead", filters.includeRead.toString());
      if (filters.category) params.set("category", filters.category);
      if (filters.priority) params.set("priority", filters.priority);
      
      const queryString = params.toString();
      const response = await apiRequest("GET", `/api/notifications${queryString ? `?${queryString}` : ""}`);
      return await response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const { data: unreadCount = { count: 0 } } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/notifications/unread-count");
      return await response.json();
    },
    refetchInterval: 30000,
    staleTime: 5 * 60 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) =>
      apiRequest("PATCH", `/api/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", "/api/notifications/mark-all-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const createNotificationMutation = useMutation({
    mutationFn: (notification: {
      title: string;
      message: string;
      type: string;
      category: string;
      priority?: string;
      actionUrl?: string;
      metadata?: any;
    }) => apiRequest("POST", "/api/notifications", notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  return {
    notifications,
    unreadCount: unreadCount.count || 0,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    createNotification: createNotificationMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isCreatingNotification: createNotificationMutation.isPending,
  };
}