import { eq, and, desc, gte, lte, sql, count, sum, avg } from "drizzle-orm";
import { dbManager } from "./multiDb";
import { 
  userActivity, 
  businessMetrics, 
  documentAnalytics, 
  revenueAnalytics, 
  performanceMetrics, 
  featureUsage, 
  errorLogs, 
  abTestAnalytics 
} from "@shared/analyticsSchema";

export interface AnalyticsEvent {
  userId: string;
  activityType: string;
  resource?: string;
  metadata?: any;
  userAgent?: string;
  ipAddress?: string;
  duration?: number;
}

export interface DocumentEvent {
  documentId: number;
  userId: string;
  eventType: string;
  fileSize?: number;
  mimeType?: string;
  serviceType?: string;
  processingTime?: number;
  aiConfidenceScore?: number;
}

export interface RevenueEvent {
  userId: string;
  businessEntityId?: string;
  transactionId?: string;
  serviceType: string;
  planType?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  subscriptionId?: string;
  isRecurring?: boolean;
}

export interface PerformanceEvent {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface ErrorEvent {
  userId?: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  endpoint?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: any;
  severity?: string;
}

class AnalyticsService {
  private get db() {
    return dbManager.analytics;
  }

  // Track user activity
  async trackUserActivity(event: AnalyticsEvent) {
    try {
      await this.db.insert(userActivity).values({
        userId: event.userId,
        activityType: event.activityType,
        resource: event.resource,
        metadata: event.metadata,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
        duration: event.duration
      });
    } catch (error) {
      console.error('Failed to track user activity:', error);
    }
  }

  // Track document events
  async trackDocumentEvent(event: DocumentEvent) {
    try {
      await this.db.insert(documentAnalytics).values({
        documentId: event.documentId,
        userId: event.userId,
        eventType: event.eventType,
        fileSize: event.fileSize,
        mimeType: event.mimeType,
        serviceType: event.serviceType,
        processingTime: event.processingTime,
        aiConfidenceScore: event.aiConfidenceScore?.toString()
      });
    } catch (error) {
      console.error('Failed to track document event:', error);
    }
  }

  // Track revenue events
  async trackRevenueEvent(event: RevenueEvent) {
    try {
      await this.db.insert(revenueAnalytics).values({
        userId: event.userId,
        businessEntityId: event.businessEntityId,
        transactionId: event.transactionId,
        serviceType: event.serviceType,
        planType: event.planType,
        amount: event.amount.toString(),
        currency: event.currency || 'USD',
        paymentMethod: event.paymentMethod,
        subscriptionId: event.subscriptionId,
        isRecurring: event.isRecurring || false
      });
    } catch (error) {
      console.error('Failed to track revenue event:', error);
    }
  }

  // Track API performance
  async trackPerformance(event: PerformanceEvent) {
    try {
      await this.db.insert(performanceMetrics).values({
        endpoint: event.endpoint,
        method: event.method,
        responseTime: event.responseTime,
        statusCode: event.statusCode,
        userId: event.userId,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress
      });
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  }

  // Track feature usage
  async trackFeatureUsage(userId: string, featureName: string, action: string, metadata?: any) {
    try {
      await this.db.insert(featureUsage).values({
        userId,
        featureName,
        action,
        metadata,
        frequency: 1
      });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  }

  // Track errors
  async trackError(event: ErrorEvent) {
    try {
      await this.db.insert(errorLogs).values({
        userId: event.userId,
        errorType: event.errorType,
        errorMessage: event.errorMessage,
        stackTrace: event.stackTrace,
        endpoint: event.endpoint,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
        metadata: event.metadata,
        severity: event.severity || 'error'
      });
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  }

  // Generate business metrics
  async generateBusinessMetrics(period: 'daily' | 'weekly' | 'monthly', date: Date) {
    try {
      const periodStart = this.getPeriodStart(period, date);
      const periodEnd = this.getPeriodEnd(period, date);

      // Calculate revenue metrics
      const revenueResult = await this.db
        .select({
          totalRevenue: sum(revenueAnalytics.amount),
          transactionCount: count(revenueAnalytics.id),
          avgTransactionValue: avg(revenueAnalytics.amount)
        })
        .from(revenueAnalytics)
        .where(and(
          gte(revenueAnalytics.timestamp, periodStart),
          lte(revenueAnalytics.timestamp, periodEnd)
        ));

      // Calculate user activity metrics
      const activityResult = await this.db
        .select({
          totalUsers: sql<number>`COUNT(DISTINCT ${userActivity.userId})`,
          totalActivities: count(userActivity.id),
          avgSessionDuration: avg(userActivity.duration)
        })
        .from(userActivity)
        .where(and(
          gte(userActivity.timestamp, periodStart),
          lte(userActivity.timestamp, periodEnd)
        ));

      // Calculate document metrics
      const documentResult = await this.db
        .select({
          totalDocuments: count(documentAnalytics.id),
          totalFileSize: sum(documentAnalytics.fileSize),
          avgProcessingTime: avg(documentAnalytics.processingTime)
        })
        .from(documentAnalytics)
        .where(and(
          gte(documentAnalytics.timestamp, periodStart),
          lte(documentAnalytics.timestamp, periodEnd)
        ));

      // Store aggregated metrics
      const metrics = [
        {
          metricName: 'total_revenue',
          metricValue: revenueResult[0]?.totalRevenue || '0',
          metricType: 'revenue',
          period,
          periodStart,
          periodEnd
        },
        {
          metricName: 'active_users',
          metricValue: activityResult[0]?.totalUsers?.toString() || '0',
          metricType: 'user_count',
          period,
          periodStart,
          periodEnd
        },
        {
          metricName: 'total_documents',
          metricValue: documentResult[0]?.totalDocuments?.toString() || '0',
          metricType: 'document_count',
          period,
          periodStart,
          periodEnd
        }
      ];

      for (const metric of metrics) {
        await this.db.insert(businessMetrics).values(metric);
      }

      return metrics;
    } catch (error) {
      console.error('Failed to generate business metrics:', error);
      throw error;
    }
  }

  // Get analytics dashboard data
  async getDashboardAnalytics(userId?: string, businessEntityId?: string) {
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      // User activity over time
      const activityTrends = await this.db
        .select({
          date: sql<string>`DATE(${userActivity.timestamp})`,
          count: count(userActivity.id)
        })
        .from(userActivity)
        .where(and(
          gte(userActivity.timestamp, last30Days),
          userId ? eq(userActivity.userId, userId) : sql`true`
        ))
        .groupBy(sql`DATE(${userActivity.timestamp})`)
        .orderBy(sql`DATE(${userActivity.timestamp})`);

      // Revenue trends
      const revenueTrends = await this.db
        .select({
          date: sql<string>`DATE(${revenueAnalytics.timestamp})`,
          revenue: sum(revenueAnalytics.amount)
        })
        .from(revenueAnalytics)
        .where(and(
          gte(revenueAnalytics.timestamp, last30Days),
          userId ? eq(revenueAnalytics.userId, userId) : sql`true`,
          businessEntityId ? eq(revenueAnalytics.businessEntityId, businessEntityId) : sql`true`
        ))
        .groupBy(sql`DATE(${revenueAnalytics.timestamp})`)
        .orderBy(sql`DATE(${revenueAnalytics.timestamp})`);

      // Document type distribution
      const documentTypes = await this.db
        .select({
          type: documentAnalytics.serviceType,
          count: count(documentAnalytics.id)
        })
        .from(documentAnalytics)
        .where(and(
          gte(documentAnalytics.timestamp, last30Days),
          userId ? eq(documentAnalytics.userId, userId) : sql`true`
        ))
        .groupBy(documentAnalytics.serviceType);

      // Performance metrics
      const performanceData = await this.db
        .select({
          endpoint: performanceMetrics.endpoint,
          avgResponseTime: avg(performanceMetrics.responseTime),
          requestCount: count(performanceMetrics.id)
        })
        .from(performanceMetrics)
        .where(gte(performanceMetrics.timestamp, last30Days))
        .groupBy(performanceMetrics.endpoint)
        .orderBy(desc(count(performanceMetrics.id)));

      // Error statistics
      const errorStats = await this.db
        .select({
          errorType: errorLogs.errorType,
          count: count(errorLogs.id),
          severity: errorLogs.severity
        })
        .from(errorLogs)
        .where(gte(errorLogs.timestamp, last30Days))
        .groupBy(errorLogs.errorType, errorLogs.severity);

      return {
        activityTrends,
        revenueTrends,
        documentTypes,
        performanceData,
        errorStats
      };
    } catch (error) {
      console.error('Failed to get dashboard analytics:', error);
      throw error;
    }
  }

  // Get user behavior insights
  async getUserBehaviorInsights(userId: string) {
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      // Most used features
      const topFeatures = await this.db
        .select({
          feature: featureUsage.featureName,
          action: featureUsage.action,
          count: count(featureUsage.id)
        })
        .from(featureUsage)
        .where(and(
          eq(featureUsage.userId, userId),
          gte(featureUsage.timestamp, last30Days)
        ))
        .groupBy(featureUsage.featureName, featureUsage.action)
        .orderBy(desc(count(featureUsage.id)))
        .limit(10);

      // Activity patterns by hour
      const hourlyActivity = await this.db
        .select({
          hour: sql<number>`EXTRACT(HOUR FROM ${userActivity.timestamp})`,
          count: count(userActivity.id)
        })
        .from(userActivity)
        .where(and(
          eq(userActivity.userId, userId),
          gte(userActivity.timestamp, last30Days)
        ))
        .groupBy(sql`EXTRACT(HOUR FROM ${userActivity.timestamp})`)
        .orderBy(sql`EXTRACT(HOUR FROM ${userActivity.timestamp})`);

      // Document interaction patterns
      const documentPatterns = await this.db
        .select({
          eventType: documentAnalytics.eventType,
          serviceType: documentAnalytics.serviceType,
          count: count(documentAnalytics.id)
        })
        .from(documentAnalytics)
        .where(and(
          eq(documentAnalytics.userId, userId),
          gte(documentAnalytics.timestamp, last30Days)
        ))
        .groupBy(documentAnalytics.eventType, documentAnalytics.serviceType);

      return {
        topFeatures,
        hourlyActivity,
        documentPatterns
      };
    } catch (error) {
      console.error('Failed to get user behavior insights:', error);
      throw error;
    }
  }

  // Utility methods
  private getPeriodStart(period: 'daily' | 'weekly' | 'monthly', date: Date): Date {
    const start = new Date(date);
    switch (period) {
      case 'daily':
        start.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
    }
    return start;
  }

  private getPeriodEnd(period: 'daily' | 'weekly' | 'monthly', date: Date): Date {
    const end = new Date(date);
    switch (period) {
      case 'daily':
        end.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        end.setDate(end.getDate() - end.getDay() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }
    return end;
  }

  // Health check for analytics database
  async healthCheck() {
    try {
      await this.db.select({ count: count() }).from(userActivity).limit(1);
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      console.error('Analytics database health check failed:', error);
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}

export const analyticsService = new AnalyticsService();