import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  serial,
  integer,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// User activity tracking for analytics
export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  activityType: varchar("activity_type").notNull(), // page_view, document_upload, payment, etc.
  resource: varchar("resource"), // URL or resource identifier
  metadata: jsonb("metadata"), // Additional activity data
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  duration: integer("duration"), // Time spent in milliseconds
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Business metrics aggregated data
export const businessMetrics = pgTable("business_metrics", {
  id: serial("id").primaryKey(),
  metricName: varchar("metric_name").notNull(),
  metricValue: decimal("metric_value", { precision: 15, scale: 2 }).notNull(),
  metricType: varchar("metric_type").notNull(), // revenue, user_count, document_count, etc.
  period: varchar("period").notNull(), // daily, weekly, monthly, yearly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  businessEntityId: varchar("business_entity_id"),
  userId: varchar("user_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document analytics
export const documentAnalytics = pgTable("document_analytics", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  userId: varchar("user_id").notNull(),
  eventType: varchar("event_type").notNull(), // upload, view, download, share, delete
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  serviceType: varchar("service_type"),
  processingTime: integer("processing_time"), // AI processing time in ms
  aiConfidenceScore: decimal("ai_confidence_score", { precision: 3, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Revenue analytics
export const revenueAnalytics = pgTable("revenue_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  businessEntityId: varchar("business_entity_id"),
  transactionId: varchar("transaction_id"),
  serviceType: varchar("service_type").notNull(),
  planType: varchar("plan_type"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD").notNull(),
  paymentMethod: varchar("payment_method"),
  subscriptionId: varchar("subscription_id"),
  isRecurring: boolean("is_recurring").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Performance metrics
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  endpoint: varchar("endpoint").notNull(),
  method: varchar("method").notNull(),
  responseTime: integer("response_time").notNull(), // in milliseconds
  statusCode: integer("status_code").notNull(),
  userId: varchar("user_id"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Feature usage analytics
export const featureUsage = pgTable("feature_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  featureName: varchar("feature_name").notNull(),
  action: varchar("action").notNull(),
  frequency: integer("frequency").default(1),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Error tracking
export const errorLogs = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  errorId: uuid("error_id").defaultRandom(),
  userId: varchar("user_id"),
  errorType: varchar("error_type").notNull(),
  errorMessage: text("error_message").notNull(),
  stackTrace: text("stack_trace"),
  endpoint: varchar("endpoint"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  metadata: jsonb("metadata"),
  severity: varchar("severity").default("error"), // info, warning, error, critical
  resolved: boolean("resolved").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// A/B testing analytics
export const abTestAnalytics = pgTable("ab_test_analytics", {
  id: serial("id").primaryKey(),
  testId: varchar("test_id").notNull(),
  userId: varchar("user_id").notNull(),
  variant: varchar("variant").notNull(),
  event: varchar("event").notNull(), // impression, click, conversion
  value: decimal("value", { precision: 10, scale: 2 }),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Create insert schemas
export const insertUserActivitySchema = createInsertSchema(userActivity);
export const insertBusinessMetricsSchema = createInsertSchema(businessMetrics);
export const insertDocumentAnalyticsSchema = createInsertSchema(documentAnalytics);
export const insertRevenueAnalyticsSchema = createInsertSchema(revenueAnalytics);
export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics);
export const insertFeatureUsageSchema = createInsertSchema(featureUsage);
export const insertErrorLogsSchema = createInsertSchema(errorLogs);
export const insertAbTestAnalyticsSchema = createInsertSchema(abTestAnalytics);

// Export types
export type UserActivity = typeof userActivity.$inferSelect;
export type BusinessMetrics = typeof businessMetrics.$inferSelect;
export type DocumentAnalytics = typeof documentAnalytics.$inferSelect;
export type RevenueAnalytics = typeof revenueAnalytics.$inferSelect;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type FeatureUsage = typeof featureUsage.$inferSelect;
export type ErrorLogs = typeof errorLogs.$inferSelect;
export type AbTestAnalytics = typeof abTestAnalytics.$inferSelect;