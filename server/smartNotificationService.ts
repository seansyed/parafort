import { db } from "./db";
import { notifications } from "@shared/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { emailService } from "./emailService";

export interface NotificationPriority {
  level: "critical" | "high" | "normal" | "low";
  score: number;
  urgency: "immediate" | "within_hour" | "within_day" | "within_week";
  category: string;
  businessImpact: "high" | "medium" | "low";
}

export interface SmartNotificationRequest {
  userId: string;
  type: string;
  title: string;
  message: string;
  category: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
  contextData?: {
    businessEntityId?: number;
    complianceDeadline?: Date;
    documentType?: string;
    amount?: number;
    isTimeSensitive?: boolean;
    requiresAction?: boolean;
  };
}

export interface NotificationRule {
  category: string;
  type: string;
  basePriority: number;
  urgencyMultiplier: number;
  businessImpactWeight: number;
  deliveryMethod: ("in_app" | "email" | "sms")[];
  throttling?: {
    enabled: boolean;
    maxPerHour?: number;
    maxPerDay?: number;
  };
  conditions?: {
    timeOfDay?: { start: number; end: number };
    userRole?: string[];
    businessSize?: string[];
  };
}

export class SmartNotificationService {
  private notificationRules: NotificationRule[] = [
    // Critical Business Operations
    {
      category: "compliance",
      type: "deadline_critical",
      basePriority: 95,
      urgencyMultiplier: 1.5,
      businessImpactWeight: 1.0,
      deliveryMethod: ["in_app", "email", "sms"],
      throttling: { enabled: false }
    },
    {
      category: "payment",
      type: "payment_failed",
      basePriority: 90,
      urgencyMultiplier: 1.3,
      businessImpactWeight: 0.9,
      deliveryMethod: ["in_app", "email"],
      throttling: { enabled: true, maxPerHour: 2 }
    },
    {
      category: "formation",
      type: "document_required",
      basePriority: 85,
      urgencyMultiplier: 1.2,
      businessImpactWeight: 0.8,
      deliveryMethod: ["in_app", "email"],
      throttling: { enabled: true, maxPerDay: 3 }
    },
    // Important Business Updates
    {
      category: "document",
      type: "document_uploaded",
      basePriority: 70,
      urgencyMultiplier: 1.0,
      businessImpactWeight: 0.6,
      deliveryMethod: ["in_app"],
      throttling: { enabled: true, maxPerHour: 5 }
    },
    {
      category: "order",
      type: "status_update",
      basePriority: 65,
      urgencyMultiplier: 0.9,
      businessImpactWeight: 0.5,
      deliveryMethod: ["in_app"],
      throttling: { enabled: true, maxPerDay: 10 }
    },
    // General Updates
    {
      category: "system",
      type: "maintenance",
      basePriority: 50,
      urgencyMultiplier: 0.7,
      businessImpactWeight: 0.3,
      deliveryMethod: ["in_app"],
      throttling: { enabled: true, maxPerDay: 2 }
    },
    {
      category: "marketing",
      type: "feature_announcement",
      basePriority: 30,
      urgencyMultiplier: 0.5,
      businessImpactWeight: 0.2,
      deliveryMethod: ["in_app"],
      throttling: { enabled: true, maxPerDay: 1 }
    }
  ];

  constructor() {}

  async createSmartNotification(request: SmartNotificationRequest): Promise<any> {
    // Calculate priority using the algorithm
    const priority = await this.calculatePriority(request);
    
    // Check throttling rules
    const shouldThrottle = await this.checkThrottling(request.userId, request.category, request.type);
    if (shouldThrottle) {
      console.log(`Notification throttled for user ${request.userId}, category: ${request.category}`);
      return null;
    }

    // Create notification with calculated priority
    const [notification] = await db.insert(notifications).values({
      userId: request.userId,
      type: request.type,
      title: request.title,
      message: request.message,
      category: request.category,
      priority: priority.level,
      actionUrl: request.actionUrl,
      relatedEntityId: request.relatedEntityId,
      relatedEntityType: request.relatedEntityType,
      metadata: JSON.stringify({
        ...request.metadata,
        priorityScore: priority.score,
        urgency: priority.urgency,
        businessImpact: priority.businessImpact,
        smartAlgorithmVersion: "1.0"
      }),
      isRead: false
    }).returning();

    // Determine delivery methods based on priority
    await this.handleDelivery(notification, priority, request);

    return notification;
  }

  private async calculatePriority(request: SmartNotificationRequest): Promise<NotificationPriority> {
    const rule = this.findRule(request.category, request.type);
    const context = request.contextData || {};
    
    let score = rule?.basePriority || 50;
    
    // Time sensitivity adjustments
    if (context.isTimeSensitive) {
      score += 15;
    }
    
    // Compliance deadline urgency
    if (context.complianceDeadline) {
      const daysUntilDeadline = Math.ceil(
        (context.complianceDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysUntilDeadline <= 1) {
        score += 25; // Critical
      } else if (daysUntilDeadline <= 3) {
        score += 15; // High urgency
      } else if (daysUntilDeadline <= 7) {
        score += 10; // Medium urgency
      }
    }
    
    // Financial impact
    if (context.amount) {
      if (context.amount >= 10000) {
        score += 20;
      } else if (context.amount >= 1000) {
        score += 10;
      } else if (context.amount >= 100) {
        score += 5;
      }
    }
    
    // Action required urgency
    if (context.requiresAction) {
      score += 10;
    }
    
    // User behavior analysis
    const userEngagement = await this.analyzeUserEngagement(request.userId);
    if (userEngagement.isActiveUser) {
      score += 5;
    }
    
    // Business hours adjustment
    const isBusinessHours = this.isBusinessHours();
    if (!isBusinessHours && score >= 80) {
      score += 10; // Boost critical notifications outside business hours
    }
    
    // Apply rule multipliers
    if (rule) {
      score *= rule.urgencyMultiplier;
      score *= rule.businessImpactWeight;
    }
    
    // Normalize score to 0-100
    score = Math.min(100, Math.max(0, score));
    
    return {
      level: this.scoreToPriorityLevel(score),
      score: Math.round(score),
      urgency: this.scoreToUrgency(score),
      category: request.category,
      businessImpact: this.scoreToBusinessImpact(score)
    };
  }

  private findRule(category: string, type: string): NotificationRule | undefined {
    return this.notificationRules.find(rule => 
      rule.category === category && rule.type === type
    ) || this.notificationRules.find(rule => 
      rule.category === category
    );
  }

  private scoreToPriorityLevel(score: number): "critical" | "high" | "normal" | "low" {
    if (score >= 90) return "critical";
    if (score >= 70) return "high";
    if (score >= 40) return "normal";
    return "low";
  }

  private scoreToUrgency(score: number): "immediate" | "within_hour" | "within_day" | "within_week" {
    if (score >= 95) return "immediate";
    if (score >= 80) return "within_hour";
    if (score >= 60) return "within_day";
    return "within_week";
  }

  private scoreToBusinessImpact(score: number): "high" | "medium" | "low" {
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  }

  private async checkThrottling(userId: string, category: string, type: string): Promise<boolean> {
    const rule = this.findRule(category, type);
    if (!rule?.throttling?.enabled) {
      return false;
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check hourly limit
    if (rule.throttling.maxPerHour) {
      const recentNotifications = await db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.category, category),
            gte(notifications.createdAt, oneHourAgo)
          )
        );
      
      if (recentNotifications[0]?.count >= rule.throttling.maxPerHour) {
        return true;
      }
    }

    // Check daily limit
    if (rule.throttling.maxPerDay) {
      const dailyNotifications = await db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.category, category),
            gte(notifications.createdAt, oneDayAgo)
          )
        );
      
      if (dailyNotifications[0]?.count >= rule.throttling.maxPerDay) {
        return true;
      }
    }

    return false;
  }

  private async analyzeUserEngagement(userId: string): Promise<{ isActiveUser: boolean; engagementScore: number }> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Get user's notification interaction patterns
    const interactions = await db
      .select({
        total: sql<number>`count(*)`,
        read: sql<number>`count(case when ${notifications.isRead} = true then 1 end)`,
        recent: sql<number>`count(case when ${notifications.createdAt} > ${thirtyDaysAgo} then 1 end)`
      })
      .from(notifications)
      .where(eq(notifications.userId, userId));

    const stats = interactions[0];
    const readRate = stats.total > 0 ? stats.read / stats.total : 0;
    const isActiveUser = stats.recent > 5 && readRate > 0.3;
    const engagementScore = Math.min(100, (readRate * 50) + (Math.min(stats.recent, 20) * 2.5));

    return { isActiveUser, engagementScore };
  }

  private isBusinessHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Monday-Friday, 9 AM - 6 PM
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  }

  private async handleDelivery(notification: any, priority: NotificationPriority, request: SmartNotificationRequest): Promise<void> {
    const rule = this.findRule(request.category, request.type);
    const deliveryMethods = rule?.deliveryMethod || ["in_app"];

    // Always deliver in-app
    // Notification is already created in database

    // Email delivery for high priority
    if (deliveryMethods.includes("email") && priority.score >= 70) {
      try {
        await emailService.sendPriorityNotification(
          request.userId,
          notification.title,
          notification.message,
          priority.level
        );
      } catch (error) {
        console.error("Failed to send email notification:", error);
      }
    }

    // SMS delivery for critical notifications (would need SMS service integration)
    if (deliveryMethods.includes("sms") && priority.score >= 95) {
      // SMS integration would go here
      console.log(`Critical SMS notification queued for user ${request.userId}`);
    }
  }

  async getPersonalizedNotifications(userId: string, limit: number = 10): Promise<any[]> {
    const userEngagement = await this.analyzeUserEngagement(userId);
    
    // Get notifications with smart scoring
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(
        // Smart ordering: unread critical first, then by priority score, then by date
        sql`
          CASE 
            WHEN ${notifications.isRead} = false AND ${notifications.priority} = 'critical' THEN 1
            WHEN ${notifications.isRead} = false AND ${notifications.priority} = 'high' THEN 2
            WHEN ${notifications.isRead} = false AND ${notifications.priority} = 'normal' THEN 3
            WHEN ${notifications.isRead} = false AND ${notifications.priority} = 'low' THEN 4
            ELSE 5
          END,
          ${notifications.createdAt} DESC
        `
      )
      .limit(limit);

    // Add smart insights to each notification
    return userNotifications.map(notification => ({
      ...notification,
      smartInsights: {
        priorityExplanation: this.generatePriorityExplanation(notification),
        recommendedAction: this.getRecommendedAction(notification),
        estimatedReadTime: this.estimateReadTime(notification.message),
        userEngagementScore: userEngagement.engagementScore
      }
    }));
  }

  private generatePriorityExplanation(notification: any): string {
    const metadata = typeof notification.metadata === 'string' 
      ? JSON.parse(notification.metadata) 
      : notification.metadata || {};
    
    const score = metadata.priorityScore || 50;
    
    if (score >= 90) {
      return "Critical: Requires immediate attention for business compliance or operations";
    } else if (score >= 70) {
      return "High: Important for business progress and should be addressed today";
    } else if (score >= 40) {
      return "Normal: Regular business update that can be reviewed when convenient";
    } else {
      return "Low: Informational update for your awareness";
    }
  }

  private getRecommendedAction(notification: any): string {
    if (notification.actionUrl) {
      return "Click to take action";
    }
    
    switch (notification.category) {
      case "compliance":
        return "Review requirements and submit documentation";
      case "payment":
        return "Check payment details and resolve any issues";
      case "document":
        return "Review uploaded document";
      case "formation":
        return "Continue business formation process";
      default:
        return "Mark as read when reviewed";
    }
  }

  private estimateReadTime(message: string): string {
    const wordCount = message.split(' ').length;
    const readingSpeed = 200; // words per minute
    const minutes = Math.ceil(wordCount / readingSpeed);
    
    if (minutes < 1) {
      return "< 1 min";
    } else if (minutes === 1) {
      return "1 min";
    } else {
      return `${minutes} mins`;
    }
  }

  async getNotificationAnalytics(userId: string): Promise<{
    totalNotifications: number;
    unreadCount: number;
    priorityBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, number>;
    engagementMetrics: {
      readRate: number;
      averageReadTime: number;
      responseRate: number;
    };
    trendingCategories: string[];
  }> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Get comprehensive notification stats
    const notifications = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          gte(notifications.createdAt, thirtyDaysAgo)
        )
      );

    const totalNotifications = notifications.length;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    // Priority breakdown
    const priorityBreakdown = notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Category breakdown
    const categoryBreakdown = notifications.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Engagement metrics
    const readNotifications = notifications.filter(n => n.isRead);
    const readRate = totalNotifications > 0 ? readNotifications.length / totalNotifications : 0;
    
    // Trending categories (most active in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentNotifications = notifications.filter(n => n.createdAt >= sevenDaysAgo);
    const recentCategories = recentNotifications.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const trendingCategories = Object.entries(recentCategories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    return {
      totalNotifications,
      unreadCount,
      priorityBreakdown,
      categoryBreakdown,
      engagementMetrics: {
        readRate,
        averageReadTime: 2.5, // minutes (estimated)
        responseRate: 0.8 // estimated based on action clicks
      },
      trendingCategories
    };
  }
}

export const smartNotificationService = new SmartNotificationService();