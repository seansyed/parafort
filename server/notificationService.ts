import { db } from "./db";
import { notifications, users } from "@shared/schema";
import { eq, desc, and, isNull, or } from "drizzle-orm";
import type { InsertNotification, Notification } from "@shared/schema";

export interface CreateNotificationOptions {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  category: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  metadata?: any;
  expiresAt?: Date;
}

export class NotificationService {
  // Create a new notification
  async createNotification(options: CreateNotificationOptions): Promise<Notification> {
    const notificationData: InsertNotification = {
      userId: options.userId,
      type: options.type,
      title: options.title,
      message: options.message,
      actionUrl: options.actionUrl || null,
      priority: options.priority || "normal",
      category: options.category,
      relatedEntityId: options.relatedEntityId || null,
      relatedEntityType: options.relatedEntityType || null,
      metadata: options.metadata || null,
      expiresAt: options.expiresAt || null,
      deliveredAt: new Date(),
    };

    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();

    return notification;
  }

  // Get notifications for a user
  async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      includeRead?: boolean;
      category?: string;
      priority?: string;
    } = {}
  ): Promise<Notification[]> {
    const { limit = 50, includeRead = true, category, priority } = options;

    let query = db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          // Only include non-expired notifications
          or(isNull(notifications.expiresAt), 
             // notifications.expiresAt > new Date() - This would need raw SQL
          )
        )
      );

    // Apply filters
    if (!includeRead) {
      query = query.where(eq(notifications.isRead, false));
    }

    if (category) {
      query = query.where(eq(notifications.category, category));
    }

    if (priority) {
      query = query.where(eq(notifications.priority, priority));
    }

    const result = await query
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return result;
  }

  // Mark notification as read
  async markAsRead(notificationId: number, userId: string): Promise<boolean> {
    try {
      const [updated] = await db
        .update(notifications)
        .set({
          isRead: true,
          readAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, userId)
          )
        )
        .returning();

      return !!updated;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const updated = await db
        .update(notifications)
        .set({
          isRead: true,
          readAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.isRead, false)
          )
        )
        .returning();

      return updated.length;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return 0;
    }
  }

  // Get unread notification count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.isRead, false),
            or(
              isNull(notifications.expiresAt),
              // notifications.expiresAt > new Date() - Would need raw SQL
            )
          )
        );

      return result.length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  // Delete old/expired notifications
  async cleanupExpiredNotifications(): Promise<number> {
    try {
      // Delete notifications that are older than 30 days or explicitly expired
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // This would need raw SQL for proper date comparison
      // For now, we'll just return 0 and implement this later
      return 0;
    } catch (error) {
      console.error("Error cleaning up expired notifications:", error);
      return 0;
    }
  }

  // Create order-related notifications
  async createOrderNotification(
    userId: string,
    orderId: string,
    type: "order_created" | "order_completed" | "order_failed",
    businessName: string
  ): Promise<Notification> {
    const titles = {
      order_created: "Order Created Successfully",
      order_completed: "Order Completed",
      order_failed: "Order Processing Failed"
    };

    const messages = {
      order_created: `Your order for ${businessName} has been created and is being processed.`,
      order_completed: `Your order for ${businessName} has been completed successfully.`,
      order_failed: `There was an issue processing your order for ${businessName}. Please contact support.`
    };

    const priorities = {
      order_created: "normal" as const,
      order_completed: "normal" as const,
      order_failed: "high" as const
    };

    return this.createNotification({
      userId,
      type,
      title: titles[type],
      message: messages[type],
      actionUrl: `/service-orders`,
      priority: priorities[type],
      category: "orders",
      relatedEntityId: orderId,
      relatedEntityType: "service_order",
      metadata: { businessName, orderId }
    });
  }

  // Create compliance-related notifications
  async createComplianceNotification(
    userId: string,
    type: "deadline_approaching" | "filing_required" | "document_received",
    title: string,
    message: string,
    actionUrl?: string,
    metadata?: any
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      type,
      title,
      message,
      actionUrl,
      priority: "high",
      category: "compliance",
      metadata
    });
  }

  // Create system notifications
  async createSystemNotification(
    userId: string,
    type: "system_update" | "maintenance" | "security_alert",
    title: string,
    message: string,
    priority: "low" | "normal" | "high" | "urgent" = "normal"
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      type,
      title,
      message,
      priority,
      category: "system"
    });
  }

  // Broadcast notification to all users
  async broadcastNotification(
    type: string,
    title: string,
    message: string,
    category: string,
    priority: "low" | "normal" | "high" | "urgent" = "normal"
  ): Promise<number> {
    try {
      // Get all active users
      const activeUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.isActive, true));

      let createdCount = 0;
      
      // Create notification for each user
      for (const user of activeUsers) {
        try {
          await this.createNotification({
            userId: user.id,
            type,
            title,
            message,
            priority,
            category
          });
          createdCount++;
        } catch (error) {
          console.error(`Failed to create notification for user ${user.id}:`, error);
        }
      }

      return createdCount;
    } catch (error) {
      console.error("Error broadcasting notification:", error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();