import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  real,
  numeric,
  unique,
  primaryKey
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

// Password reset table
export const passwordResets = pgTable("password_resets", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  email: varchar("email", { length: 255 }).notNull(),
  resetCode: varchar("reset_code", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Tax filings table
export const taxFilings = pgTable("tax_filings", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  industry: varchar("industry", { length: 255 }).notNull(),
  businessStructure: varchar("business_structure", { length: 100 }).notNull(),
  einSSN: varchar("ein_ssn", { length: 50 }).notNull(),
  taxYearStart: timestamp("tax_year_start").notNull(),
  taxYearEnd: timestamp("tax_year_end").notNull(),
  filingYear: varchar("filing_year", { length: 4 }).notNull(),
  entitySpecificInfo: jsonb("entity_specific_info"),
  documentsCount: integer("documents_count").default(0),
  servicePlan: varchar("service_plan", { length: 100 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("submitted").notNull(),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  clientId: varchar("client_id", { length: 12 }).unique(), // 12-digit numeric client ID
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  password: varchar("password"), // User password
  phone: varchar("phone", { length: 20 }), // E.164 format for Telnyx compatibility
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).default("client").notNull(), // client, admin, super_admin
  permissions: text("permissions").array(), // array of specific permissions
  stripeCustomerId: varchar("stripe_customer_id"), // Stripe customer ID
  stripeSubscriptionId: varchar("stripe_subscription_id"), // Stripe subscription ID
  isActive: boolean("is_active").default(true).notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  passwordResetAt: timestamp("password_reset_at"),
  dataRetentionUntil: timestamp("data_retention_until"), // for GDPR compliance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Order completion certificates table
export const completionCertificates = pgTable("completion_certificates", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").notNull(),
  orderType: varchar("order_type", { length: 50 }).notNull(), // 'formation' or 'service'
  certificateType: varchar("certificate_type", { length: 100 }).notNull(), // e.g., 'formation_completion', 'business_license_completion'
  certificateUrl: text("certificate_url"), // URL to generated PDF certificate
  certificateData: jsonb("certificate_data"), // JSON data used to generate certificate
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Future due dates and compliance tracking
export const complianceDueDates = pgTable("compliance_due_dates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: varchar("order_id").notNull(), // Links to formation order
  businessName: varchar("business_name", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  complianceType: varchar("compliance_type", { length: 100 }).notNull(), // 'annual_report', 'tax_filing', 'renewal'
  dueDate: timestamp("due_date").notNull(),
  frequency: varchar("frequency", { length: 50 }), // 'annual', 'biennial', 'monthly', 'quarterly'
  description: text("description"),
  filingFee: numeric("filing_fee", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default("upcoming").notNull(), // 'upcoming', 'due_soon', 'overdue', 'completed', 'exempt'
  reminderSent: boolean("reminder_sent").default(false).notNull(),
  notificationDays: integer("notification_days").default(30), // Days before due date to send reminder
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Order completion workflows and follow-up actions
export const orderWorkflows = pgTable("order_workflows", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").notNull(),
  orderType: varchar("order_type", { length: 50 }).notNull(),
  workflowType: varchar("workflow_type", { length: 100 }).notNull(), // 'completion_email', 'document_delivery', 'follow_up_sequence'
  status: varchar("status", { length: 50 }).default("pending").notNull(), // 'pending', 'in_progress', 'completed', 'failed'
  scheduledAt: timestamp("scheduled_at"),
  executedAt: timestamp("executed_at"),
  workflowData: jsonb("workflow_data"), // Configuration and parameters for the workflow
  result: jsonb("result"), // Execution result and logs
  retryCount: integer("retry_count").default(0).notNull(),
  maxRetries: integer("max_retries").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Notification templates for order completion and follow-ups
export const notificationTemplates = pgTable("notification_templates", {
  id: serial("id").primaryKey(),
  templateName: varchar("template_name", { length: 100 }).notNull().unique(),
  templateType: varchar("template_type", { length: 50 }).notNull(), // 'email', 'sms', 'in_app'
  subject: varchar("subject", { length: 255 }),
  htmlContent: text("html_content"),
  textContent: text("text_content"),
  variables: text("variables").array(), // Available template variables
  entityTypes: text("entity_types").array(), // Applicable entity types
  states: text("states").array(), // Applicable states
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type CompletionCertificate = typeof completionCertificates.$inferSelect;
export type InsertCompletionCertificate = typeof completionCertificates.$inferInsert;
export type ComplianceDueDate = typeof complianceDueDates.$inferSelect;
export type InsertComplianceDueDate = typeof complianceDueDates.$inferInsert;
export type OrderWorkflow = typeof orderWorkflows.$inferSelect;
export type InsertOrderWorkflow = typeof orderWorkflows.$inferInsert;
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = typeof notificationTemplates.$inferInsert;

// Authorized users table - allows clients to delegate access to one additional user
export const authorizedUsers = pgTable("authorized_users", {
  id: serial("id").primaryKey(),
  clientUserId: varchar("client_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  authorizedEmail: varchar("authorized_email").notNull(),
  authorizedName: varchar("authorized_name").notNull(),
  relationship: varchar("relationship").notNull(), // accountant, attorney, business_partner, etc.
  permissions: text("permissions").array().default(['view_only']).notNull(), // ['view_only'] - cannot place orders
  status: varchar("status").notNull().default("pending"), // pending, active, revoked
  invitationToken: varchar("invitation_token").unique(),
  invitationSentAt: timestamp("invitation_sent_at"),
  acceptedAt: timestamp("accepted_at"),
  revokedAt: timestamp("revoked_at"),
  lastAccessAt: timestamp("last_access_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// User notification preferences
export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  smsNotifications: boolean("sms_notifications").default(false).notNull(),
  browserNotifications: boolean("browser_notifications").default(true).notNull(),
  complianceAlerts: boolean("compliance_alerts").default(true).notNull(),
  marketingCommunications: boolean("marketing_communications").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Document folders/categories table
export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id"),
  serviceType: varchar("service_type"), // business_formation, boir_filing, etc.
  businessEntityId: varchar("business_entity_id"), // Will add foreign key reference later
  userId: varchar("user_id").references(() => users.id),
  isSystemFolder: boolean("is_system_folder").default(false),
  color: varchar("color").default("#3b82f6"), // hex color for UI
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Documents management table with enhanced features
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessEntityId: varchar("business_entity_id").references(() => businessEntities.id),
  folderId: integer("folder_id").references(() => folders.id),
  
  // Document details
  fileName: varchar("file_name").notNull(),
  originalFileName: varchar("original_file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  mimeType: varchar("mime_type").notNull(),
  fileHash: varchar("file_hash"), // SHA-256 hash for integrity verification
  
  // Document categorization
  documentType: varchar("document_type").notNull(), // financial_statement, tax_document, receipt, etc.
  serviceType: varchar("service_type").notNull(), // bookkeeping, payroll, formation, etc.
  category: varchar("category"), // monthly_report, quarterly_report, w2, 1099, etc.
  
  // AI-powered metadata
  extractedText: text("extracted_text"), // OCR/AI extracted text content
  aiTags: text("ai_tags").array(), // AI-generated tags
  aiConfidenceScore: decimal("ai_confidence_score", { precision: 3, scale: 2 }), // 0.00-1.00
  
  // Upload metadata
  uploadedBy: varchar("uploaded_by").notNull(), // user_id or 'admin'
  uploadedByAdmin: boolean("uploaded_by_admin").default(false).notNull(),
  isProcessed: boolean("is_processed").default(false).notNull(),
  
  // Versioning
  version: integer("version").default(1).notNull(),
  parentDocumentId: integer("parent_document_id"),
  isLatestVersion: boolean("is_latest_version").default(true).notNull(),
  
  // Access control
  isPublic: boolean("is_public").default(false).notNull(),
  accessLevel: varchar("access_level").default("private").notNull(), // private, shared, public
  encryptionKey: varchar("encryption_key"), // For encrypted documents
  
  // Document status and workflow
  status: varchar("status").default("active").notNull(), // active, archived, deleted, pending_review
  workflowStage: varchar("workflow_stage").default("uploaded").notNull(), // uploaded, processing, reviewed, approved
  expiresAt: timestamp("expires_at"),
  retentionDate: timestamp("retention_date"), // Auto-delete date for compliance
  
  // Compliance and audit
  lastAccessedAt: timestamp("last_accessed_at"),
  lastAccessedBy: varchar("last_accessed_by"),
  downloadCount: integer("download_count").default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Document versions for tracking changes
export const documentVersions = pgTable("document_versions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  changeDescription: text("change_description"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Document shares for collaboration
export const documentShares = pgTable("document_shares", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  sharedWithUserId: varchar("shared_with_user_id").references(() => users.id, { onDelete: "cascade" }),
  sharedWithEmail: varchar("shared_with_email"), // For external sharing
  permission: varchar("permission").notNull(), // view, edit, download
  expiresAt: timestamp("expires_at"),
  isPasswordProtected: boolean("is_password_protected").default(false),
  passwordHash: varchar("password_hash"),
  shareToken: varchar("share_token").unique(),
  accessCount: integer("access_count").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Document comments for collaboration
export const documentComments = pgTable("document_comments", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  isInternal: boolean("is_internal").default(true), // Internal vs client-visible
  parentCommentId: integer("parent_comment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Document tags for advanced organization
export const documentTags = pgTable("document_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  color: varchar("color").default("#6B7280"), // Hex color for UI
  description: text("description"),
  isSystemGenerated: boolean("is_system_generated").default(false),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow()
});

// Many-to-many relationship for document tags
export const documentTagAssignments = pgTable("document_tag_assignments", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => documentTags.id, { onDelete: "cascade" }),
  assignedBy: varchar("assigned_by").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Document templates for standardization
export const documentTemplates = pgTable("document_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  templateData: jsonb("template_data").notNull(), // JSON structure for template
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Formation orders table for tracking customer orders
export const formationOrders = pgTable("formation_orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").unique().notNull(), // PF-XXXXXXXXX format
  userId: varchar("user_id").references(() => users.id),
  businessEntityId: varchar("business_entity_id").references(() => businessEntities.id),
  
  // Order details
  businessName: varchar("business_name").notNull(),
  entityType: varchar("entity_type").notNull(),
  state: varchar("state").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerName: varchar("customer_name").notNull(),
  
  // Payment information
  stripePaymentIntentId: varchar("stripe_payment_intent_id").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("usd").notNull(),
  paymentStatus: varchar("payment_status").default("pending").notNull(), // pending, paid, failed, refunded
  
  // Order status and progress
  orderStatus: varchar("order_status").default("received").notNull(), // received, processing, filed, completed, cancelled
  currentProgress: integer("current_progress").default(1).notNull(), // 1-5 progress steps
  totalSteps: integer("total_steps").default(5).notNull(),
  
  // Timestamps
  orderDate: timestamp("order_date").defaultNow(),
  filingDate: timestamp("filing_date"),
  completionDate: timestamp("completion_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Order progress tracking
export const orderProgressSteps = pgTable("order_progress_steps", {
  id: serial("id").primaryKey(),
  formationOrderId: integer("formation_order_id").notNull().references(() => formationOrders.id),
  
  stepNumber: integer("step_number").notNull(),
  stepName: varchar("step_name").notNull(),
  stepDescription: text("step_description"),
  
  status: varchar("status").default("pending").notNull(), // pending, in_progress, completed, failed
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  estimatedCompletionDays: integer("estimated_completion_days"),
  
  // Optional step details
  assignedTo: varchar("assigned_to"), // staff member or "system"
  notes: text("notes"),
  documents: text("documents").array(), // array of document URLs/paths
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Invoice line items
export const invoiceLineItems = pgTable("invoice_line_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
  
  description: varchar("description").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow()
});

// Registered Agent Plans
export const registeredAgentPlans = pgTable("registered_agent_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  displayName: varchar("display_name"),
  description: text("description"),
  yearlyPrice: varchar("yearly_price").notNull(), // Stored as string for flexibility
  expeditedPrice: varchar("expedited_price"), // Optional expedited pricing
  states: text("states").array(), // Array of state codes (e.g., ['CA', 'NY', 'TX'])
  features: text("features").array(), // Array of feature descriptions
  isActive: boolean("is_active").default(true),
  isMostPopular: boolean("is_most_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// OTP (One-Time Password) table for authentication
export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 6 }).notNull(), // 6-digit OTP code
  method: varchar("method", { length: 10 }).notNull(), // "sms" or "email"
  contact: varchar("contact").notNull(), // phone number or email address
  isVerified: boolean("is_verified").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// OTP preferences and trust device tracking
export const otpPreferences = pgTable("otp_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  preferredMethod: varchar("preferred_method", { length: 10 }).default("email").notNull(), // "sms" or "email"
  phoneNumber: varchar("phone_number"), // for SMS OTP
  isEnabled: boolean("is_enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Trusted devices table for "don't ask again for 14 days"
export const trustedDevices = pgTable("trusted_devices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deviceFingerprint: varchar("device_fingerprint").notNull(), // browser fingerprint
  deviceInfo: jsonb("device_info"), // user agent, IP, etc.
  trustExpiresAt: timestamp("trust_expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Business entities table
// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  yearlyPrice: decimal("yearly_price", { precision: 10, scale: 2 }).notNull(), // price in dollars
  isActive: boolean("is_active").default(true),
  features: text("features").array(), // array of feature descriptions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Services that can be included in plans or purchased separately
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category"), // Formation, Compliance, Banking, Bookkeeping, Payroll, Tax, etc.
  serviceType: varchar("service_type").notNull().default("one_time"), // one_time, recurring, subscription_plan
  oneTimePrice: decimal("one_time_price", { precision: 10, scale: 2 }), // price in dollars for one-time purchase
  recurringPrice: decimal("recurring_price", { precision: 10, scale: 2 }), // price in dollars for monthly/yearly recurring
  recurringInterval: varchar("recurring_interval"), // monthly, yearly
  expeditedPrice: decimal("expedited_price", { precision: 10, scale: 2 }), // additional price for expedited processing
  features: text("features").array(), // Array of features included
  entityTypes: text("entity_types").array(), // Applicable entity types for tax services
  employeeLimit: varchar("employee_limit"), // For payroll services
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Junction table for plan-service relationships
export const planServices = pgTable("plan_services", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  includedInPlan: boolean("included_in_plan").default(true),
  availableAsAddon: boolean("available_as_addon").default(false),
  addonType: varchar("addon_type"), // one_time, recurring
  createdAt: timestamp("created_at").defaultNow()
});

// User Subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  status: varchar("status").notNull().default("active"), // active, cancelled, expired, trial
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  autoRenew: boolean("auto_renew").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Mailbox Subscription Plans - Separate from main business plans
export const mailboxPlans = pgTable("mailbox_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // Starter, Growing, Booming
  displayName: varchar("display_name").notNull(), // MailBox Starter, MailBox Growing, MailBox Booming
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull(),
  autoRenews: boolean("auto_renews").default(true),
  businessAddresses: integer("business_addresses").notNull(),
  mailItemsPerMonth: integer("mail_items_per_month").notNull(),
  costPerExtraItem: decimal("cost_per_extra_item", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  secureShredding: boolean("secure_shredding").default(true),
  checkDepositFee: decimal("check_deposit_fee", { precision: 10, scale: 2 }).notNull(),
  checksIncluded: integer("checks_included").notNull(),
  additionalCheckFee: decimal("additional_check_fee", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  isMostPopular: boolean("is_most_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// User Mailbox Subscriptions
export const userMailboxSubscriptions = pgTable("user_mailbox_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessEntityId: varchar("business_entity_id").references(() => businessEntities.id), // for business-specific subscriptions
  planType: varchar("plan_type").notNull(), // standard, premium, enterprise
  subscriptionStatus: varchar("subscription_status").notNull().default("active"), // active, cancelled, expired, trial
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),
  autoRenew: boolean("auto_renew").default(true),
  currentPeriodUsage: jsonb("current_period_usage"), // track mail items, checks used, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// User Service Purchases (individual services or add-ons)
export const userServicePurchases = pgTable("user_service_purchases", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  businessEntityId: varchar("business_entity_id").references(() => businessEntities.id),
  purchaseType: varchar("purchase_type").notNull(), // one_time, recurring
  status: varchar("status").notNull().default("active"), // active, cancelled, completed
  purchaseDate: timestamp("purchase_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // price paid in dollars
  createdAt: timestamp("created_at").defaultNow()
});

// Service Field Configurations (for dynamic forms)
export const serviceFields = pgTable("service_fields", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  fieldName: varchar("field_name").notNull(), // e.g., "company_size", "website_url"
  fieldLabel: varchar("field_label").notNull(), // e.g., "Company Size", "Website URL"
  fieldType: varchar("field_type").notNull(), // text, email, number, select, textarea, phone
  isRequired: boolean("is_required").default(true).notNull(),
  placeholder: varchar("placeholder"), // placeholder text for the field
  options: jsonb("options"), // for select fields: { "values": ["small", "medium", "large"] }
  validation: jsonb("validation"), // validation rules: { "min": 1, "max": 100, "pattern": "..." }
  order: integer("order").default(1).notNull(), // display order
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Service Orders (for marketplace purchases with custom fields support)
export const serviceOrders = pgTable("service_orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").unique().notNull(), // PS-XXXXXXXXX format
  userId: varchar("user_id").references(() => users.id), // nullable for guest checkout
  serviceId: integer("service_id").references(() => services.id), // Single service per order
  businessEntityId: varchar("business_entity_id").references(() => businessEntities.id),
  
  // Customer Information
  customerEmail: varchar("customer_email").notNull(),
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone"),
  businessName: varchar("business_name"),
  
  // Service-specific custom fields data
  customFieldData: jsonb("custom_field_data"), // Customer responses to service-specific fields
  selectedAddons: jsonb("selected_addons"), // Array of selected addon IDs and quantities
  
  // Address and billing
  billingAddress: jsonb("billing_address"), // Address data as JSON
  
  // Pricing breakdown
  baseAmount: decimal("base_amount", { precision: 10, scale: 2 }).notNull(), // Service base price
  addonsAmount: decimal("addons_amount", { precision: 10, scale: 2 }).default("0.00"),
  isExpedited: boolean("is_expedited").default(false).notNull(),
  expeditedFee: decimal("expedited_fee", { precision: 10, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD").notNull(),
  
  // Order status tracking
  orderStatus: varchar("order_status").default("pending").notNull(), // pending, processing, in_progress, completed, cancelled
  paymentStatus: varchar("payment_status").default("pending").notNull(), // pending, paid, failed, refunded
  paymentIntentId: varchar("payment_intent_id"), // Stripe payment intent ID
  
  // Notes and communication
  orderNotes: text("order_notes"), // Internal order notes
  customerNotes: text("customer_notes"), // Customer-provided notes
  serviceNames: varchar("service_names"), // Service name for compatibility
  
  // Timestamps
  orderDate: timestamp("order_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const businessEntities = pgTable("business_entities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Made nullable for anonymous formation workflow
  subscriptionPlanId: integer("subscription_plan_id").references(() => subscriptionPlans.id), // Individual subscription per business
  subscriptionStatus: varchar("subscription_status").default("free"), // free, active, cancelled, expired
  name: varchar("name"),
  entityType: varchar("entity_type"), // LLC, Corporation, etc.
  state: varchar("state"),
  status: varchar("status").notNull().default("draft"), // draft, in_progress, completed, filed
  businessPurpose: text("business_purpose"),
  numberOfShares: integer("number_of_shares"),
  parValuePerShare: decimal("par_value_per_share", { precision: 10, scale: 2 }),
  streetAddress: varchar("street_address"),
  city: varchar("city"),
  stateAddress: varchar("state_address"),
  zipCode: varchar("zip_code"),
  mailingStreetAddress: varchar("mailing_street_address"),
  mailingCity: varchar("mailing_city"),
  mailingState: varchar("mailing_state"),
  mailingZipCode: varchar("mailing_zip_code"),
  registeredAgent: varchar("registered_agent"),
  useParafortAgent: boolean("use_parafort_agent").default(false),
  ein: varchar("ein"), // Employer Identification Number
  einStatus: varchar("ein_status").default("not_applied"), // not_applied, pending, approved, rejected
  filedDate: timestamp("filed_date"),
  currentStep: integer("current_step").default(1),
  totalSteps: integer("total_steps").default(7),
  // Business Leadership Information (Step 6)
  ownerFirstName: varchar("owner_first_name"),
  ownerLastName: varchar("owner_last_name"),
  ownerAddress: text("owner_address"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  registeredAgentType: varchar("registered_agent_type"), // self, third_party
  registeredAgentName: varchar("registered_agent_name"),
  registeredAgentAddress: text("registered_agent_address"),
  // Corporation-specific officers
  presidentName: varchar("president_name"),
  presidentAddress: text("president_address"),
  secretaryName: varchar("secretary_name"),
  secretaryAddress: text("secretary_address"),
  treasurerName: varchar("treasurer_name"),
  treasurerAddress: text("treasurer_address"),
  directorNames: text("director_names").array(), // For corporations
  directorAddresses: text("director_addresses").array(),
  // LLC-specific information
  memberNames: text("member_names").array(),
  memberAddresses: text("member_addresses").array(),
  ownershipPercentages: text("ownership_percentages").array(),
  
  // AI Insights Rate Limiting
  lastInsightGeneration: timestamp("last_insight_generation"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// EIN applications table
export const einApplications = pgTable("ein_applications", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  businessLegalName: varchar("business_legal_name").notNull(),
  tradeName: varchar("trade_name"), // DBA name
  businessAddress: text("business_address").notNull(),
  entityType: varchar("entity_type").notNull(),
  reasonForApplying: varchar("reason_for_applying").notNull(),
  responsiblePartyName: varchar("responsible_party_name").notNull(),
  responsiblePartySSN: varchar("responsible_party_ssn"), // Encrypted
  responsiblePartyITIN: varchar("responsible_party_itin"), // Encrypted
  businessStartDate: timestamp("business_start_date"),
  expectedEmployees: integer("expected_employees").default(0),
  principalActivity: text("principal_activity"),
  applicationStatus: varchar("application_status").default("draft"), // draft, submitted, approved, rejected
  einAssigned: varchar("ein_assigned"),
  irsConfirmationNumber: varchar("irs_confirmation_number"),
  submittedDate: timestamp("submitted_date"),
  approvedDate: timestamp("approved_date"),
  ss4DocumentUrl: varchar("ss4_document_url"), // Generated PDF
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// EIN verification records
export const einVerifications = pgTable("ein_verifications", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  ein: varchar("ein").notNull(),
  businessName: varchar("business_name").notNull(),
  verificationProvider: varchar("verification_provider"), // middesk, irs_direct, etc.
  verificationStatus: varchar("verification_status").notNull(), // verified, invalid, pending, error
  verificationResponse: text("verification_response"), // JSON response from API
  lastVerified: timestamp("last_verified").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// BOIR (Beneficial Ownership Information Reporting) tables
export const boirFilings = pgTable("boir_filings", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  filingType: varchar("filing_type").notNull(), // initial, updated, corrected
  filingStatus: varchar("filing_status").notNull().default("draft"), // draft, submitted, accepted, rejected
  isUSCompany: boolean("is_us_company").notNull().default(true),
  requiresBOIR: boolean("requires_boir").notNull().default(false), // Based on current regulations
  
  // Company Information
  companyLegalName: varchar("company_legal_name").notNull(),
  tradeDBANames: text("trade_dba_names"), // JSON array of trade names
  principalUSAddress: text("principal_us_address").notNull(),
  jurisdictionOfFormation: varchar("jurisdiction_of_formation").notNull(),
  jurisdictionFirstRegistered: varchar("jurisdiction_first_registered"),
  taxIdentificationNumber: varchar("tax_identification_number"),
  foreignTaxJurisdiction: varchar("foreign_tax_jurisdiction"),
  
  // Filing metadata
  finCenIdentifier: varchar("fincen_identifier"), // FinCEN identifier if issued
  submissionDate: timestamp("submission_date"),
  confirmationNumber: varchar("confirmation_number"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  expirationDate: timestamp("expiration_date"), // For tracking update requirements
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const beneficialOwners = pgTable("beneficial_owners", {
  id: serial("id").primaryKey(),
  boirFilingId: integer("boir_filing_id").notNull().references(() => boirFilings.id),
  
  // Personal Information (encrypted)
  fullLegalName: varchar("full_legal_name").notNull(),
  dateOfBirth: varchar("date_of_birth").notNull(), // Encrypted
  currentAddress: text("current_address").notNull(), // Encrypted
  isUSResident: boolean("is_us_resident").default(true),
  
  // Identification (encrypted)
  identificationType: varchar("identification_type").notNull(), // passport, drivers_license, state_id
  identificationNumber: varchar("identification_number").notNull(), // Encrypted
  identificationJurisdiction: varchar("identification_jurisdiction").notNull(),
  identificationImageUrl: varchar("identification_image_url"), // Encrypted file path
  
  // Ownership Details
  ownershipPercentage: varchar("ownership_percentage"), // Stored as encrypted string
  controlMechanism: text("control_mechanism"), // How they exercise control
  beneficialOwnerType: varchar("beneficial_owner_type").notNull(), // ownership, control, senior_officer
  
  // Status tracking
  isActive: boolean("is_active").default(true),
  lastVerified: timestamp("last_verified").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const companyApplicants = pgTable("company_applicants", {
  id: serial("id").primaryKey(),
  boirFilingId: integer("boir_filing_id").notNull().references(() => boirFilings.id),
  
  // Personal Information (encrypted)
  fullLegalName: varchar("full_legal_name").notNull(),
  dateOfBirth: varchar("date_of_birth").notNull(), // Encrypted
  currentAddress: text("current_address").notNull(), // Encrypted
  businessAddress: text("business_address"), // If acting in business capacity
  
  // Identification (encrypted)
  identificationType: varchar("identification_type").notNull(),
  identificationNumber: varchar("identification_number").notNull(), // Encrypted
  identificationJurisdiction: varchar("identification_jurisdiction").notNull(),
  identificationImageUrl: varchar("identification_image_url"), // Encrypted file path
  
  // Role Information
  applicantType: varchar("applicant_type").notNull(), // direct_filer, company_formation_agent
  relationshipToCompany: text("relationship_to_company"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const boirAuditLog = pgTable("boir_audit_log", {
  id: serial("id").primaryKey(),
  boirFilingId: integer("boir_filing_id").notNull().references(() => boirFilings.id),
  actionType: varchar("action_type").notNull(), // created, updated, submitted, viewed
  actionDescription: text("action_description").notNull(),
  performedBy: varchar("performed_by").notNull(), // User ID or system
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  
  // Compliance tracking
  regulatoryBasis: varchar("regulatory_basis"), // CTA, state_law, etc.
  dataAccessReason: text("data_access_reason")
});

// S-Corporation Election tables
export const sCorpElections = pgTable("s_corp_elections", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  electionStatus: varchar("election_status").notNull().default("draft"), // draft, submitted, approved, rejected
  
  // Basic Entity Information
  entityLegalName: varchar("entity_legal_name").notNull(),
  ein: varchar("ein").notNull(),
  entityType: varchar("entity_type").notNull(), // LLC, Corporation
  formationDate: timestamp("formation_date").notNull(),
  stateOfFormation: varchar("state_of_formation").notNull(),
  
  // Election Details
  proposedEffectiveDate: timestamp("proposed_effective_date").notNull(),
  taxYearEnd: varchar("tax_year_end").notNull(), // MM/DD format or "Calendar Year"
  selectedTaxYear: varchar("selected_tax_year").notNull(), // Calendar or Fiscal
  
  // Shareholder Count
  numberOfShareholders: integer("number_of_shareholders").notNull(),
  
  // Filing Information
  isLateElection: boolean("is_late_election").default(false),
  lateFilingReason: text("late_filing_reason"),
  hasOperatedAsScorp: boolean("has_operated_as_scorp").default(false),
  operationStartDate: timestamp("operation_start_date"),
  
  // IRS Communication
  submissionDate: timestamp("submission_date"),
  trackingNumber: varchar("tracking_number"),
  irsConfirmationNumber: varchar("irs_confirmation_number"),
  approvalDate: timestamp("approval_date"),
  
  // Compliance Tracking
  deadlineDate: timestamp("deadline_date").notNull(),
  remindersSent: integer("reminders_sent").default(0),
  lastReminderDate: timestamp("last_reminder_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const sCorpShareholders = pgTable("s_corp_shareholders", {
  id: serial("id").primaryKey(),
  sCorpElectionId: integer("s_corp_election_id").notNull().references(() => sCorpElections.id),
  
  // Shareholder Information
  fullName: varchar("full_name").notNull(),
  ssn: varchar("ssn").notNull(), // Encrypted
  address: text("address").notNull(),
  isUSCitizen: boolean("is_us_citizen").default(true),
  
  // Stock Information
  sharesOwned: integer("shares_owned").notNull(),
  ownershipPercentage: varchar("ownership_percentage").notNull(),
  stockClass: varchar("stock_class").default("Common"),
  votingRights: boolean("voting_rights").default(true),
  dateAcquired: timestamp("date_acquired").notNull(),
  acquisitionMethod: varchar("acquisition_method").notNull(), // Purchase, Gift, Inheritance, etc.
  
  // Consent Information
  hasConsented: boolean("has_consented").default(false),
  consentDate: timestamp("consent_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const complianceCalendar = pgTable("compliance_calendar", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  
  // Event Details
  eventType: varchar("event_type").notNull(), // s_corp_election, boir_filing, annual_report, etc.
  eventTitle: varchar("event_title").notNull(),
  eventDescription: text("event_description"),
  
  // Timing
  dueDate: timestamp("due_date").notNull(),
  reminderDates: text("reminder_dates"), // JSON array of reminder timestamps
  isRecurring: boolean("is_recurring").default(false),
  recurringInterval: varchar("recurring_interval"), // annual, quarterly, monthly
  
  // Status
  status: varchar("status").notNull().default("pending"), // pending, completed, overdue, dismissed
  completedDate: timestamp("completed_date"),
  
  // Related Records
  relatedRecordType: varchar("related_record_type"), // s_corp_election, boir_filing, etc.
  relatedRecordId: integer("related_record_id"),
  
  // Priority and Category
  priority: varchar("priority").notNull().default("medium"), // high, medium, low
  category: varchar("category").notNull(), // tax, compliance, filing, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const complianceNotifications = pgTable("compliance_notifications", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  complianceCalendarId: integer("compliance_calendar_id").references(() => complianceCalendar.id),
  
  // Notification Details
  notificationType: varchar("notification_type").notNull(), // email, dashboard, sms
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  
  // Timing
  scheduledDate: timestamp("scheduled_date").notNull(),
  sentDate: timestamp("sent_date"),
  
  // Status
  status: varchar("status").notNull().default("pending"), // pending, sent, failed
  deliveryAttempts: integer("delivery_attempts").default(0),
  
  // Metadata
  recipientEmail: varchar("recipient_email"),
  recipientPhone: varchar("recipient_phone"),
  
  createdAt: timestamp("created_at").defaultNow()
});

// Annual Report Filing tables
export const annualReports = pgTable("annual_reports", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  
  // Report Details
  filingYear: integer("filing_year").notNull(),
  reportType: varchar("report_type").notNull().default("annual"), // annual, biennial, periodic
  state: varchar("state").notNull(),
  filingStatus: varchar("filing_status").notNull().default("draft"), // draft, submitted, approved, rejected
  
  // Timing Information
  dueDate: timestamp("due_date").notNull(),
  submissionDate: timestamp("submission_date"),
  confirmationNumber: varchar("confirmation_number"),
  
  // Business Information (snapshot at time of filing)
  legalName: varchar("legal_name").notNull(),
  principalOfficeAddress: text("principal_office_address").notNull(),
  mailingAddress: text("mailing_address"),
  businessPurpose: text("business_purpose"),
  ein: varchar("ein"),
  
  // Registered Agent Information
  registeredAgentName: varchar("registered_agent_name").notNull(),
  registeredAgentAddress: text("registered_agent_address").notNull(),
  registeredAgentPhone: varchar("registered_agent_phone"),
  registeredAgentEmail: varchar("registered_agent_email"),
  
  // Management Structure
  managementStructure: jsonb("management_structure"), // Officers, Directors, Managers, Members
  authorizedSignatories: jsonb("authorized_signatories"),
  
  // Filing Information
  filingFee: integer("filing_fee"), // in cents
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, failed
  paymentIntentId: varchar("payment_intent_id"),
  
  // State-specific data
  stateSpecificData: jsonb("state_specific_data"), // Flexible field for state variations
  
  // Form generation
  generatedFormPath: varchar("generated_form_path"),
  formData: jsonb("form_data"), // Complete form data for regeneration
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Comprehensive invoices table for real PDF generation and business-specific billing
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number").unique().notNull(), // INV-2025-001, etc.
  userId: varchar("user_id").notNull().references(() => users.id),
  businessEntityId: varchar("business_entity_id").references(() => businessEntities.id),
  subscriptionPlanId: integer("subscription_plan_id").references(() => subscriptionPlans.id),
  formationOrderId: integer("formation_order_id").references(() => formationOrders.id),
  
  // Customer Information
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  billingAddress: jsonb("billing_address"),
  
  // Invoice Details
  invoiceDate: timestamp("invoice_date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status").default("pending").notNull(), // pending, paid, overdue, cancelled
  
  // Amount Information
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD").notNull(),
  
  // Payment Information
  paymentIntentId: varchar("payment_intent_id"),
  paidDate: timestamp("paid_date"),
  paymentMethod: varchar("payment_method"), // card, bank_transfer, check
  
  // PDF Generation
  pdfPath: varchar("pdf_path"), // Path to generated PDF file
  pdfGenerated: boolean("pdf_generated").default(false),
  
  // Line Items (JSON for flexibility)
  lineItems: jsonb("line_items").notNull(), // [{ description, quantity, rate, amount }]
  
  // Invoice metadata
  description: text("description"),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Real-time notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull().references(() => users.id),
  
  // Notification Content
  type: varchar("type").notNull(), // order_update, compliance_reminder, system_alert, payment_success
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  actionUrl: varchar("actionUrl"), // URL to navigate when clicked
  
  // Status and Timing
  isRead: boolean("isRead").default(false).notNull(),
  priority: varchar("priority").default("normal").notNull(), // low, normal, high, urgent
  category: varchar("category").notNull(), // orders, compliance, payments, system
  
  // Metadata
  relatedEntityId: varchar("relatedEntityId"), // ID of related order, entity, etc.
  relatedEntityType: varchar("relatedEntityType"), // order, business_entity, payment, etc.
  metadata: jsonb("metadata"), // Additional context data
  
  // Delivery tracking
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  expiresAt: timestamp("expiresAt"), // Optional expiration for temporary notifications
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

export const stateFilingRequirements = pgTable("state_filing_requirements", {
  id: serial("id").primaryKey(),
  state: varchar("state").notNull(),
  entityType: varchar("entity_type").notNull(), // LLC, Corporation, Partnership, etc.
  
  // Filing Frequency
  filingFrequency: varchar("filing_frequency").notNull(), // annual, biennial, decennial
  reportName: varchar("report_name").notNull(), // "Annual Report", "Periodic Report", etc.
  
  // Due Date Information
  dueDateType: varchar("due_date_type").notNull(), // fixed_date, anniversary_based, formation_based
  fixedDueDate: varchar("fixed_due_date"), // MM-DD format for fixed dates
  dueDateOffset: integer("due_date_offset"), // Days from formation/anniversary
  gracePeriodDays: integer("grace_period_days").default(0),
  
  // Required Fields
  requiredFields: jsonb("required_fields").notNull(), // List of required data fields
  optionalFields: jsonb("optional_fields"), // List of optional data fields
  stateSpecificFields: jsonb("state_specific_fields"), // State-unique requirements
  
  // Filing Information
  filingFeeAmount: integer("filing_fee_amount"), // in cents
  onlineFilingAvailable: boolean("online_filing_available").default(false),
  filingMethods: jsonb("filing_methods"), // online, mail, in_person
  
  // Forms and Instructions
  formTemplateUrl: varchar("form_template_url"),
  instructionsUrl: varchar("instructions_url"),
  filingAddress: text("filing_address"),
  
  // Penalties and Late Fees
  lateFeeAmount: integer("late_fee_amount"),
  lateFeeFrequency: varchar("late_fee_frequency"), // daily, monthly, one_time
  dissolutionThreatDays: integer("dissolution_threat_days"), // Days before admin dissolution
  
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

export const annualReportReminders = pgTable("annual_report_reminders", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  annualReportId: integer("annual_report_id").references(() => annualReports.id),
  
  // Reminder Details
  reminderType: varchar("reminder_type").notNull(), // advance_notice, due_soon, overdue
  reminderDate: timestamp("reminder_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  
  // Message Content
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  actionUrl: varchar("action_url"),
  
  // Delivery Status
  deliveryMethod: varchar("delivery_method").notNull(), // email, dashboard, sms
  status: varchar("status").notNull().default("pending"), // pending, sent, failed
  sentDate: timestamp("sent_date"),
  deliveryAttempts: integer("delivery_attempts").default(0),
  
  // Metadata
  recipientEmail: varchar("recipient_email"),
  recipientPhone: varchar("recipient_phone"),
  
  createdAt: timestamp("created_at").defaultNow()
});

export const annualReportTemplates = pgTable("annual_report_templates", {
  id: serial("id").primaryKey(),
  state: varchar("state").notNull(),
  entityType: varchar("entity_type").notNull(),
  
  // Template Details
  templateName: varchar("template_name").notNull(),
  templateVersion: varchar("template_version").notNull(),
  templateFormat: varchar("template_format").notNull(), // pdf, html, json
  
  // Template Content
  templateContent: text("template_content").notNull(), // JSON template structure
  fieldMappings: jsonb("field_mappings").notNull(), // Maps internal fields to form fields
  conditionalLogic: jsonb("conditional_logic"), // Rules for conditional fields
  validationRules: jsonb("validation_rules"), // Field validation requirements
  
  // Styling and Layout
  styleSheet: text("style_sheet"), // CSS for PDF generation
  layoutConfig: jsonb("layout_config"), // Page layout configuration
  
  isActive: boolean("is_active").default(true),
  effectiveDate: timestamp("effective_date").notNull(),
  expirationDate: timestamp("expiration_date"),
  createdAt: timestamp("created_at").defaultNow()
});

// Promotional Announcements System
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  
  // Announcement Content
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type").notNull().default("general"), // general, promotion, maintenance, security, feature
  priority: varchar("priority").notNull().default("normal"), // low, normal, high, urgent
  
  // Visual Settings
  backgroundColor: varchar("background_color").default("#10b981"), // Default green
  textColor: varchar("text_color").default("#ffffff"),
  iconType: varchar("icon_type").default("info"), // info, warning, success, error, announcement
  
  // Targeting
  targetAudience: varchar("target_audience").notNull().default("all"), // all, clients, admins, specific_users
  specificUserIds: text("specific_user_ids").array(), // Array of user IDs for specific targeting
  specificClientIds: text("specific_client_ids").array(), // Array of client IDs
  
  // Scheduling and Status
  status: varchar("status").notNull().default("draft"), // draft, scheduled, published, paused, archived
  scheduledDate: timestamp("scheduled_date"),
  publishDate: timestamp("publish_date"),
  expirationDate: timestamp("expiration_date"),
  
  // Display Settings
  displayLocation: varchar("display_location").notNull().default("dashboard"), // dashboard, all_pages, specific_pages
  specificPages: text("specific_pages").array(), // Array of page routes
  dismissible: boolean("dismissible").default(true),
  autoHide: boolean("auto_hide").default(false),
  autoHideDelay: integer("auto_hide_delay").default(5000), // milliseconds
  
  // Engagement Tracking
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  dismissCount: integer("dismiss_count").default(0),
  
  // Call to Action
  hasCallToAction: boolean("has_call_to_action").default(false),
  ctaText: varchar("cta_text"),
  ctaUrl: varchar("cta_url"),
  ctaType: varchar("cta_type").default("link"), // link, internal_route, modal, download
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const announcementInteractions = pgTable("announcement_interactions", {
  id: serial("id").primaryKey(),
  announcementId: integer("announcement_id").notNull().references(() => announcements.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Interaction Types
  interactionType: varchar("interaction_type").notNull(), // viewed, clicked, dismissed, archived
  interactionData: jsonb("interaction_data"), // Additional context like click position, time spent
  
  // User State
  isDismissed: boolean("is_dismissed").default(false),
  isArchived: boolean("is_archived").default(false),
  
  createdAt: timestamp("created_at").defaultNow()
});

// Business Name Change tables
export const nameChangeRequests = pgTable("name_change_requests", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  
  // Request Details
  currentLegalName: varchar("current_legal_name").notNull(),
  newDesiredName: varchar("new_desired_name").notNull(),
  alternativeNames: jsonb("alternative_names"), // Array of backup names
  reasonForChange: text("reason_for_change"),
  
  // Status and Progress
  status: varchar("status").notNull().default("draft"), // draft, pending_approval, approved, state_filed, completed, rejected
  progressStep: varchar("progress_step").notNull().default("internal_approval"), // internal_approval, name_availability, state_filing, irs_notification, license_updates
  
  // Internal Approval
  resolutionGenerated: boolean("resolution_generated").default(false),
  resolutionApproved: boolean("resolution_approved").default(false),
  approvalDate: timestamp("approval_date"),
  approvalDocumentPath: varchar("approval_document_path"),
  
  // Name Availability
  nameAvailabilityChecked: boolean("name_availability_checked").default(false),
  nameAvailable: boolean("name_available").default(false),
  availabilityCheckDate: timestamp("availability_check_date"),
  availabilityResults: jsonb("availability_results"),
  
  // State Filing
  amendmentFilingRequired: boolean("amendment_filing_required").default(true),
  amendmentFiled: boolean("amendment_filed").default(false),
  filingDate: timestamp("filing_date"),
  filingConfirmationNumber: varchar("filing_confirmation_number"),
  filingDocumentPath: varchar("filing_document_path"),
  filingFeeAmount: integer("filing_fee_amount"), // in cents
  filingFeeStatus: varchar("filing_fee_status").default("pending"), // pending, paid, failed
  
  // IRS Notification
  irsNotificationRequired: boolean("irs_notification_required").default(true),
  irsNotified: boolean("irs_notified").default(false),
  irsNotificationDate: timestamp("irs_notification_date"),
  newEinRequired: boolean("new_ein_required").default(false),
  newEin: varchar("new_ein"),
  
  // License and Permit Updates
  licensesIdentified: boolean("licenses_identified").default(false),
  licensesUpdated: boolean("licenses_updated").default(false),
  licenseUpdateStatus: jsonb("license_update_status"),
  
  // Completion
  nameChangeEffectiveDate: timestamp("name_change_effective_date"),
  completionDate: timestamp("completion_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const nameChangeDocuments = pgTable("name_change_documents", {
  id: serial("id").primaryKey(),
  nameChangeRequestId: integer("name_change_request_id").notNull().references(() => nameChangeRequests.id),
  
  // Document Details
  documentType: varchar("document_type").notNull(), // resolution, state_amendment, irs_notification, license_update
  documentName: varchar("document_name").notNull(),
  documentPath: varchar("document_path").notNull(),
  documentFormat: varchar("document_format").notNull(), // pdf, docx
  
  // Content and Generation
  templateUsed: varchar("template_used"),
  generatedContent: text("generated_content"),
  customizationData: jsonb("customization_data"),
  
  // Status
  status: varchar("status").notNull().default("generated"), // generated, signed, filed, approved
  generatedDate: timestamp("generated_date").defaultNow(),
  signedDate: timestamp("signed_date"),
  filedDate: timestamp("filed_date"),
  
  createdAt: timestamp("created_at").defaultNow()
});

export const nameChangeWorkflowTasks = pgTable("name_change_workflow_tasks", {
  id: serial("id").primaryKey(),
  nameChangeRequestId: integer("name_change_request_id").notNull().references(() => nameChangeRequests.id),
  
  // Task Details
  taskType: varchar("task_type").notNull(), // internal_approval, name_check, state_filing, irs_notification, license_update
  taskTitle: varchar("task_title").notNull(),
  taskDescription: text("task_description"),
  taskOrder: integer("task_order").notNull(),
  
  // Dependencies
  dependsOnTasks: jsonb("depends_on_tasks"), // Array of task IDs that must be completed first
  blockedByTasks: jsonb("blocked_by_tasks"), // Array of task IDs that are blocked by this task
  
  // Status and Progress
  status: varchar("status").notNull().default("pending"), // pending, in_progress, completed, failed, skipped
  assignedTo: varchar("assigned_to"), // user_id or 'system' for automated tasks
  
  // Timing
  estimatedDuration: integer("estimated_duration"), // in hours
  dueDate: timestamp("due_date"),
  startedDate: timestamp("started_date"),
  completedDate: timestamp("completed_date"),
  
  // Results and Notes
  completionNotes: text("completion_notes"),
  taskResults: jsonb("task_results"),
  actionRequired: boolean("action_required").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const businessLicenses = pgTable("business_licenses", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  
  // License Details
  licenseName: varchar("license_name").notNull(),
  licenseType: varchar("license_type").notNull(), // federal, state, local, industry
  licenseNumber: varchar("license_number"),
  issuingAuthority: varchar("issuing_authority").notNull(),
  issuingState: varchar("issuing_state"),
  issuingJurisdiction: varchar("issuing_jurisdiction"),
  
  // Status and Validity
  status: varchar("status").notNull().default("active"), // active, expired, suspended, pending, cancelled
  issueDate: timestamp("issue_date"),
  expirationDate: timestamp("expiration_date"),
  renewalDate: timestamp("renewal_date"),
  
  // Name Change Impact
  requiresNameUpdate: boolean("requires_name_update").default(true),
  nameUpdateMethod: varchar("name_update_method"), // online, mail, in_person, phone
  nameUpdateFee: integer("name_update_fee"), // in cents
  nameUpdateProcessingTime: varchar("name_update_processing_time"),
  
  // Contact Information
  contactPhone: varchar("contact_phone"),
  contactEmail: varchar("contact_email"),
  contactAddress: text("contact_address"),
  onlinePortalUrl: varchar("online_portal_url"),
  
  // Documentation
  originalDocumentPath: varchar("original_document_path"),
  updatedDocumentPath: varchar("updated_document_path"),
  
  // Tracking
  lastVerified: timestamp("last_verified"),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const nameChangeTemplates = pgTable("name_change_templates", {
  id: serial("id").primaryKey(),
  
  // Template Details
  templateName: varchar("template_name").notNull(),
  templateType: varchar("template_type").notNull(), // resolution_llc, resolution_corp, state_amendment, irs_notification
  entityType: varchar("entity_type").notNull(), // LLC, Corporation, Partnership
  state: varchar("state"),
  
  // Content
  templateContent: text("template_content").notNull(),
  templateVariables: jsonb("template_variables"), // Variables that need to be replaced
  conditionalSections: jsonb("conditional_sections"), // Sections that appear based on conditions
  
  // Formatting
  documentFormat: varchar("document_format").notNull().default("pdf"), // pdf, docx, html
  styleSheet: text("style_sheet"),
  
  // Metadata
  version: varchar("version").notNull().default("1.0"),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow()
});

// Business Dissolution tables
export const businessDissolutions = pgTable("business_dissolutions", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  
  // Dissolution Details
  dissolutionType: varchar("dissolution_type").notNull(), // voluntary, administrative, judicial
  dissolutionReason: text("dissolution_reason"),
  effectiveDate: timestamp("effective_date"),
  requestedDate: timestamp("requested_date").defaultNow(),
  
  // Status and Progress
  status: varchar("status").notNull().default("initiated"), // initiated, approved, filed, completed, cancelled
  currentPhase: varchar("current_phase").notNull().default("decision"), // decision, approvals, filings, wind_down, closure
  completionPercentage: integer("completion_percentage").default(0),
  
  // Decision and Approvals
  memberApprovalRequired: boolean("member_approval_required").default(true),
  memberApprovalObtained: boolean("member_approval_obtained").default(false),
  memberApprovalDate: timestamp("member_approval_date"),
  resolutionDocumentPath: varchar("resolution_document_path"),
  
  // State Filing
  stateDissolutionFiled: boolean("state_dissolution_filed").default(false),
  stateDissolutionDate: timestamp("state_dissolution_date"),
  stateDissolutionNumber: varchar("state_dissolution_number"),
  dissolutionDocumentPath: varchar("dissolution_document_path"),
  stateFilingFee: integer("state_filing_fee"), // in cents
  stateFilingConfirmation: varchar("state_filing_confirmation"),
  
  // Federal and Tax Obligations
  finalTaxReturnFiled: boolean("final_tax_return_filed").default(false),
  finalTaxReturnDate: timestamp("final_tax_return_date"),
  einCancelled: boolean("ein_cancelled").default(false),
  einCancellationDate: timestamp("ein_cancellation_date"),
  form966Filed: boolean("form966_filed").default(false), // For corporations
  
  // License and Permit Cancellations
  licensesIdentified: boolean("licenses_identified").default(false),
  licensesCancelled: boolean("licenses_cancelled").default(false),
  licensesCancellationDate: timestamp("licenses_cancellation_date"),
  
  // Wind-down Activities
  assetsDistributed: boolean("assets_distributed").default(false),
  debtsSettled: boolean("debts_settled").default(false),
  contractsTerminated: boolean("contracts_terminated").default(false),
  employeesTerminated: boolean("employees_terminated").default(false),
  
  // Record Retention
  recordsArchived: boolean("records_archived").default(false),
  recordsArchiveDate: timestamp("records_archive_date"),
  recordRetentionPeriod: integer("record_retention_period").default(7), // years
  recordsLocation: text("records_location"),
  
  // Completion
  dissolutionCompleted: boolean("dissolution_completed").default(false),
  completionDate: timestamp("completion_date"),
  
  // Metadata
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const dissolutionTasks = pgTable("dissolution_tasks", {
  id: serial("id").primaryKey(),
  dissolutionId: integer("dissolution_id").notNull().references(() => businessDissolutions.id),
  
  // Task Details
  taskCategory: varchar("task_category").notNull(), // decision, approval, filing, wind_down, closure
  taskType: varchar("task_type").notNull(), // member_approval, state_filing, license_cancellation, etc.
  taskTitle: varchar("task_title").notNull(),
  taskDescription: text("task_description"),
  taskOrder: integer("task_order").notNull(),
  
  // Requirements and Dependencies
  isRequired: boolean("is_required").default(true),
  dependsOnTasks: jsonb("depends_on_tasks"), // Array of task IDs
  prerequisiteConditions: jsonb("prerequisite_conditions"),
  
  // Status and Timeline
  status: varchar("status").notNull().default("pending"), // pending, in_progress, completed, skipped, failed
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, critical
  dueDate: timestamp("due_date"),
  startedDate: timestamp("started_date"),
  completedDate: timestamp("completed_date"),
  
  // Assignment and Actions
  assignedTo: varchar("assigned_to"), // user_id or 'system'
  actionRequired: boolean("action_required").default(false),
  documentGenerated: boolean("document_generated").default(false),
  documentPath: varchar("document_path"),
  
  // Results and Notes
  completionNotes: text("completion_notes"),
  taskResults: jsonb("task_results"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const dissolutionDocuments = pgTable("dissolution_documents", {
  id: serial("id").primaryKey(),
  dissolutionId: integer("dissolution_id").notNull().references(() => businessDissolutions.id),
  
  // Document Details
  documentType: varchar("document_type").notNull(), // resolution, articles_dissolution, final_tax_return, etc.
  documentName: varchar("document_name").notNull(),
  documentCategory: varchar("document_category").notNull(), // internal, state, federal, other
  documentPath: varchar("document_path").notNull(),
  documentFormat: varchar("document_format").notNull(), // pdf, docx
  
  // Filing Information
  requiresFiling: boolean("requires_filing").default(false),
  filingAgency: varchar("filing_agency"), // irs, secretary_of_state, etc.
  filingDeadline: timestamp("filing_deadline"),
  filingStatus: varchar("filing_status").default("pending"), // pending, filed, approved, rejected
  filingDate: timestamp("filing_date"),
  confirmationNumber: varchar("confirmation_number"),
  
  // Content and Generation
  templateUsed: varchar("template_used"),
  generatedContent: text("generated_content"),
  customizationData: jsonb("customization_data"),
  
  createdAt: timestamp("created_at").defaultNow()
});

export const dissolutionChecklists = pgTable("dissolution_checklists", {
  id: serial("id").primaryKey(),
  dissolutionId: integer("dissolution_id").notNull().references(() => businessDissolutions.id),
  
  // Checklist Details
  checklistType: varchar("checklist_type").notNull(), // licenses, permits, registrations, contracts
  category: varchar("category").notNull(), // federal, state, local, private
  itemName: varchar("item_name").notNull(),
  description: text("description"),
  
  // Requirements
  isRequired: boolean("is_required").default(true),
  applicableStates: jsonb("applicable_states"), // Array of state codes
  applicableEntityTypes: jsonb("applicable_entity_types"), // Array of entity types
  
  // Cancellation Details
  cancellationMethod: varchar("cancellation_method"), // online, mail, phone, in_person
  cancellationAgency: varchar("cancellation_agency"),
  cancellationPhone: varchar("cancellation_phone"),
  cancellationAddress: text("cancellation_address"),
  cancellationUrl: varchar("cancellation_url"),
  
  // Status and Progress
  status: varchar("status").notNull().default("pending"), // pending, in_progress, cancelled, not_applicable
  completedDate: timestamp("completed_date"),
  confirmationNumber: varchar("confirmation_number"),
  notes: text("notes"),
  
  // Metadata
  estimatedTime: varchar("estimated_time"), // time to complete cancellation
  potentialPenalties: text("potential_penalties"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const dissolutionTimeline = pgTable("dissolution_timeline", {
  id: serial("id").primaryKey(),
  dissolutionId: integer("dissolution_id").notNull().references(() => businessDissolutions.id),
  
  // Event Details
  eventType: varchar("event_type").notNull(), // milestone, deadline, filing, completion
  eventTitle: varchar("event_title").notNull(),
  eventDescription: text("event_description"),
  eventDate: timestamp("event_date").notNull(),
  
  // Status and Importance
  isCompleted: boolean("is_completed").default(false),
  isCritical: boolean("is_critical").default(false),
  impactLevel: varchar("impact_level").default("medium"), // low, medium, high
  
  // Related Records
  relatedTaskId: integer("related_task_id").references(() => dissolutionTasks.id),
  relatedDocumentId: integer("related_document_id").references(() => dissolutionDocuments.id),
  
  createdAt: timestamp("created_at").defaultNow()
});

export const dissolutionTemplates = pgTable("dissolution_templates", {
  id: serial("id").primaryKey(),
  
  // Template Details
  templateName: varchar("template_name").notNull(),
  templateType: varchar("template_type").notNull(), // resolution, articles_dissolution, final_notice
  entityType: varchar("entity_type").notNull(), // LLC, Corporation, Partnership
  state: varchar("state"),
  
  // Content
  templateContent: text("template_content").notNull(),
  templateVariables: jsonb("template_variables"),
  conditionalSections: jsonb("conditional_sections"),
  
  // Requirements
  requiredFields: jsonb("required_fields"),
  optionalFields: jsonb("optional_fields"),
  validationRules: jsonb("validation_rules"),
  
  // Formatting
  documentFormat: varchar("document_format").notNull().default("pdf"),
  styleSheet: text("style_sheet"),
  
  // Metadata
  version: varchar("version").notNull().default("1.0"),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow()
});

// Registered Agent addresses table
export const registeredAgentAddresses = pgTable("registered_agent_addresses", {
  id: serial("id").primaryKey(),
  state: varchar("state").notNull().unique(),
  streetAddress: varchar("street_address").notNull(),
  city: varchar("city").notNull(),
  zipCode: varchar("zip_code").notNull(),
  phoneNumber: varchar("phone_number"),
  businessHours: varchar("business_hours").default("9:00 AM - 5:00 PM EST"),
  isActive: boolean("is_active").default(true),
  verifiedDate: timestamp("verified_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Registered Agent consent records
export const registeredAgentConsent = pgTable("registered_agent_consent", {
  id: serial("id").primaryKey(),
  businessEntityId: integer("business_entity_id").notNull().references(() => businessEntities.id),
  agentName: varchar("agent_name").notNull().default("ParaFort Registered Agent Services"),
  agentAddressId: integer("agent_address_id").notNull().references(() => registeredAgentAddresses.id),
  consentDate: timestamp("consent_date").defaultNow(),
  consentMethod: varchar("consent_method").default("electronic"), // electronic, written
  consentDocumentUrl: varchar("consent_document_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});






// Service Custom Fields - for service-specific checkout pages
export const serviceCustomFields = pgTable("service_custom_fields", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  
  // Field Configuration
  fieldName: varchar("field_name").notNull(), // Internal field name (snake_case)
  fieldLabel: varchar("field_label").notNull(), // Display label for users
  fieldType: varchar("field_type").notNull(), // text, textarea, select, radio, checkbox, email, phone, date, file, number, url
  fieldCategory: varchar("field_category").default("service_specific"), // personal_info, business_info, service_specific, preferences, compliance
  
  // Field Options and Validation
  isRequired: boolean("is_required").default(false).notNull(),
  placeholder: varchar("placeholder"), // Input placeholder text
  helpText: text("help_text"), // Additional guidance for users
  validationRules: jsonb("validation_rules"), // { minLength, maxLength, pattern, min, max, etc. }
  options: jsonb("options"), // For select/radio fields: [{ value, label, description? }]
  
  // Display and Ordering
  displayOrder: integer("display_order").notNull().default(0),
  fieldGroup: varchar("field_group"), // Group related fields together (e.g., "business_details", "contact_info")
  conditionalDisplay: jsonb("conditional_display"), // Show/hide based on other field values
  width: varchar("width").default("full"), // full, half, third, quarter (for responsive layout)
  
  // Field Metadata
  isActive: boolean("is_active").default(true).notNull(),
  defaultValue: varchar("default_value"), // Default field value
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Service Add-ons - optional extras for services
export const serviceAddons = pgTable("service_addons", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Global Footer Configuration
export const footerConfig = pgTable("footer_config", {
  id: serial("id").primaryKey(),
  
  // Company Information
  companyName: varchar("company_name").notNull().default("ParaFort"),
  companyDescription: text("company_description").default("Professional business formation and compliance management platform"),
  
  // Contact Information
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  
  // Social Media Links
  socialLinks: jsonb("social_links").default('{}'), // { facebook, twitter, linkedin, instagram, youtube }
  
  // Footer Sections
  sections: jsonb("sections").notNull().default('[]'), // Array of footer sections with links
  
  // Copyright and Legal
  copyrightText: text("copyright_text").default("© 2025 ParaFort. All rights reserved."),
  legalLinks: jsonb("legal_links").default('[]'), // Privacy Policy, Terms of Service, etc.
  
  // Footer Settings
  showSocialMedia: boolean("show_social_media").default(true),
  showNewsletter: boolean("show_newsletter").default(true),
  newsletterTitle: varchar("newsletter_title").default("Stay Updated"),
  newsletterDescription: text("newsletter_description").default("Get the latest updates on business formation and compliance."),
  
  // Styling
  backgroundColor: varchar("background_color").default("#1f2937"),
  textColor: varchar("text_color").default("#d1d5db"),
  linkColor: varchar("link_color").default("#10b981"),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});



// Document reception and handling log
export const receivedDocuments = pgTable("received_documents", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  documentType: varchar("document_type").notNull(), // legal_notice, tax_notice, annual_report, court_document, other
  documentCategory: varchar("document_category"), // subpoena, lawsuit, tax_assessment, compliance_notice
  senderName: varchar("sender_name"),
  senderAddress: text("sender_address"),
  receivedDate: timestamp("received_date").defaultNow(),
  documentTitle: varchar("document_title"),
  documentDescription: text("document_description"),
  urgencyLevel: varchar("urgency_level").default("normal"), // urgent, normal, low
  digitalDocumentUrl: varchar("digital_document_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  originalDocumentPath: varchar("original_document_path"),
  forwardedDate: timestamp("forwarded_date"),
  clientNotifiedDate: timestamp("client_notified_date"),
  status: varchar("status").default("received"), // received, processed, forwarded, archived
  handledBy: varchar("handled_by"),
  notes: text("notes"),
  mailboxScanId: varchar("mailbox_scan_id"), // ID from virtual mailbox service
  ocrConfidence: varchar("ocr_confidence"),
  extractedText: text("extracted_text"),
  trackingNumber: varchar("tracking_number"),
  mailType: varchar("mail_type"), // letter, package, legal, certified, priority
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Virtual mailbox configuration
export const virtualMailboxConfig = pgTable("virtual_mailbox_config", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  addressId: varchar("address_id").notNull(),
  physicalAddress: text("physical_address").notNull(),
  isActive: boolean("is_active").default(true),
  webhookUrl: varchar("webhook_url"),
  lastSyncDate: timestamp("last_sync_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Document handling audit trail
export const documentAuditLog = pgTable("document_audit_log", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => receivedDocuments.id),
  action: varchar("action").notNull(), // received, scanned, categorized, forwarded, archived
  performedBy: varchar("performed_by").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  details: text("details"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent")
});

// Business Health Radar Tables
export const businessHealthMetrics = pgTable("business_health_metrics", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  metricDate: timestamp("metric_date").defaultNow(),
  
  // Compliance Health Score (0-100)
  complianceScore: integer("compliance_score").default(0),
  complianceGrade: varchar("compliance_grade").default("F"), // A, B, C, D, F
  pendingDeadlines: integer("pending_deadlines").default(0),
  overdueItems: integer("overdue_items").default(0),
  completedThisMonth: integer("completed_this_month").default(0),
  
  // Financial Health Indicators
  subscriptionStatus: varchar("subscription_status").default("inactive"), // active, inactive, overdue
  outstandingBalance: decimal("outstanding_balance", { precision: 10, scale: 2 }).default("0.00"),
  lastPaymentDate: timestamp("last_payment_date"),
  
  // Document Management Health
  documentsReceived: integer("documents_received").default(0),
  documentsProcessed: integer("documents_processed").default(0),
  urgentDocumentsPending: integer("urgent_documents_pending").default(0),
  averageProcessingTime: integer("average_processing_time").default(0), // in hours
  
  // Entity Status Health
  entityStatus: varchar("entity_status").default("active"), // active, suspended, dissolved
  registeredAgentStatus: varchar("registered_agent_status").default("active"), // active, inactive
  addressUpdateRequired: boolean("address_update_required").default(false),
  
  // Risk Indicators
  riskLevel: varchar("risk_level").default("low"), // low, medium, high, critical
  riskFactors: text("risk_factors").array(),
  lastRiskAssessment: timestamp("last_risk_assessment"),
  
  // Activity Metrics
  lastLoginDate: timestamp("last_login_date"),
  documentsDownloaded: integer("documents_downloaded").default(0),
  supportTicketsOpen: integer("support_tickets_open").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const businessHealthInsights = pgTable("business_health_insights", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  insightType: varchar("insight_type").notNull(), // prediction, recommendation, alert, trend
  priority: varchar("priority").default("medium"), // low, medium, high, critical
  
  // Insight Content
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  recommendation: text("recommendation"),
  predictedOutcome: text("predicted_outcome"),
  confidenceScore: integer("confidence_score").default(0), // 0-100
  
  // Categorization
  category: varchar("category").notNull(), // compliance, financial, operational, legal
  subcategory: varchar("subcategory"),
  tags: text("tags").array(),
  
  // Timeline
  impactDate: timestamp("impact_date"),
  actionDeadline: timestamp("action_deadline"),
  isActionable: boolean("is_actionable").default(true),
  
  // Status Tracking
  status: varchar("status").default("active"), // active, acknowledged, resolved, dismissed
  acknowledgedBy: varchar("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
  
  // AI Analysis Data
  aiModel: varchar("ai_model"), // gemini, openai, internal
  analysisData: jsonb("analysis_data"), // Raw AI response data
  dataSource: text("data_source").array(), // sources used for prediction
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const businessHealthTrends = pgTable("business_health_trends", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull(),
  trendDate: timestamp("trend_date").notNull(),
  trendPeriod: varchar("trend_period").notNull(), // daily, weekly, monthly, quarterly
  complianceScoreTrend: decimal("compliance_score_trend", { precision: 5, scale: 2 }),
  riskLevelTrend: varchar("risk_level_trend"),
  documentProcessingTrend: decimal("document_processing_trend", { precision: 5, scale: 2 }),
  financialHealthTrend: decimal("financial_health_trend", { precision: 5, scale: 2 }),
  trendDirection: varchar("trend_direction"),
  trendStrength: varchar("trend_strength"),
  trendConfidence: decimal("trend_confidence", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  businessEntities: many(businessEntities)
}));

export const businessEntitiesRelations = relations(businessEntities, ({ one, many }) => ({
  user: one(users, {
    fields: [businessEntities.userId],
    references: [users.id]
  }),
  subscriptionPlan: one(subscriptionPlans, {
    fields: [businessEntities.subscriptionPlanId],
    references: [subscriptionPlans.id]
  }),
  agentConsent: one(registeredAgentConsent, {
    fields: [businessEntities.id],
    references: [registeredAgentConsent.businessEntityId]
  }),
  receivedDocuments: many(receivedDocuments),
  einApplications: many(einApplications),
  einVerifications: many(einVerifications),
  boirFilings: many(boirFilings),
  sCorpElections: many(sCorpElections),
  complianceCalendarItems: many(complianceCalendar),
  complianceNotifications: many(complianceNotifications),
  annualReports: many(annualReports),
  annualReportReminders: many(annualReportReminders),
  nameChangeRequests: many(nameChangeRequests),
  businessLicenses: many(businessLicenses)
}));

export const boirFilingsRelations = relations(boirFilings, ({ one, many }) => ({
  businessEntity: one(businessEntities, {
    fields: [boirFilings.businessEntityId],
    references: [businessEntities.id]
  }),
  beneficialOwners: many(beneficialOwners),
  companyApplicants: many(companyApplicants),
  auditLogs: many(boirAuditLog)
}));

export const beneficialOwnersRelations = relations(beneficialOwners, ({ one }) => ({
  boirFiling: one(boirFilings, {
    fields: [beneficialOwners.boirFilingId],
    references: [boirFilings.id]
  })
}));

export const companyApplicantsRelations = relations(companyApplicants, ({ one }) => ({
  boirFiling: one(boirFilings, {
    fields: [companyApplicants.boirFilingId],
    references: [boirFilings.id]
  })
}));

export const boirAuditLogRelations = relations(boirAuditLog, ({ one }) => ({
  boirFiling: one(boirFilings, {
    fields: [boirAuditLog.boirFilingId],
    references: [boirFilings.id]
  })
}));

export const sCorpElectionsRelations = relations(sCorpElections, ({ one, many }) => ({
  businessEntity: one(businessEntities, {
    fields: [sCorpElections.businessEntityId],
    references: [businessEntities.id]
  }),
  shareholders: many(sCorpShareholders)
}));

export const sCorpShareholdersRelations = relations(sCorpShareholders, ({ one }) => ({
  sCorpElection: one(sCorpElections, {
    fields: [sCorpShareholders.sCorpElectionId],
    references: [sCorpElections.id]
  })
}));

export const complianceCalendarRelations = relations(complianceCalendar, ({ one, many }) => ({
  businessEntity: one(businessEntities, {
    fields: [complianceCalendar.businessEntityId],
    references: [businessEntities.id]
  }),
  notifications: many(complianceNotifications)
}));

export const complianceNotificationsRelations = relations(complianceNotifications, ({ one }) => ({
  businessEntity: one(businessEntities, {
    fields: [complianceNotifications.businessEntityId],
    references: [businessEntities.id]
  }),
  complianceCalendarItem: one(complianceCalendar, {
    fields: [complianceNotifications.complianceCalendarId],
    references: [complianceCalendar.id]
  })
}));

export const annualReportsRelations = relations(annualReports, ({ one, many }) => ({
  businessEntity: one(businessEntities, {
    fields: [annualReports.businessEntityId],
    references: [businessEntities.id]
  }),
  reminders: many(annualReportReminders)
}));

export const annualReportRemindersRelations = relations(annualReportReminders, ({ one }) => ({
  businessEntity: one(businessEntities, {
    fields: [annualReportReminders.businessEntityId],
    references: [businessEntities.id]
  }),
  annualReport: one(annualReports, {
    fields: [annualReportReminders.annualReportId],
    references: [annualReports.id]
  })
}));

export const einApplicationsRelations = relations(einApplications, ({ one }) => ({
  businessEntity: one(businessEntities, {
    fields: [einApplications.businessEntityId],
    references: [businessEntities.id]
  })
}));

export const einVerificationsRelations = relations(einVerifications, ({ one }) => ({
  businessEntity: one(businessEntities, {
    fields: [einVerifications.businessEntityId],
    references: [businessEntities.id]
  })
}));

export const registeredAgentAddressesRelations = relations(registeredAgentAddresses, ({ many }) => ({
  consents: many(registeredAgentConsent)
}));

export const registeredAgentConsentRelations = relations(registeredAgentConsent, ({ one }) => ({
  businessEntity: one(businessEntities, {
    fields: [registeredAgentConsent.businessEntityId],
    references: [businessEntities.id]
  }),
  agentAddress: one(registeredAgentAddresses, {
    fields: [registeredAgentConsent.agentAddressId],
    references: [registeredAgentAddresses.id]
  })
}));

export const receivedDocumentsRelations = relations(receivedDocuments, ({ one, many }) => ({
  businessEntity: one(businessEntities, {
    fields: [receivedDocuments.businessEntityId],
    references: [businessEntities.id]
  }),
  auditLogs: many(documentAuditLog)
}));

export const servicesRelations = relations(services, ({ many }) => ({
  serviceFields: many(serviceFields),
  serviceOrders: many(serviceOrders)
}));

export const serviceFieldsRelations = relations(serviceFields, ({ one }) => ({
  service: one(services, {
    fields: [serviceFields.serviceId],
    references: [services.id]
  })
}));





export const serviceOrdersRelations = relations(serviceOrders, ({ one }) => ({
  user: one(users, {
    fields: [serviceOrders.userId],
    references: [users.id]
  }),
  service: one(services, {
    fields: [serviceOrders.serviceId],
    references: [services.id]
  }),
  businessEntity: one(businessEntities, {
    fields: [serviceOrders.businessEntityId],
    references: [businessEntities.id]
  })
}));

export const virtualMailboxConfigRelations = relations(virtualMailboxConfig, ({ one }) => ({
  businessEntity: one(businessEntities, {
    fields: [virtualMailboxConfig.businessEntityId],
    references: [businessEntities.id]
  })
}));

export const documentAuditLogRelations = relations(documentAuditLog, ({ one }) => ({
  document: one(receivedDocuments, {
    fields: [documentAuditLog.documentId],
    references: [receivedDocuments.id]
  })
}));

// Business Dissolution Relations
export const businessDissolutionsRelations = relations(businessDissolutions, ({ one, many }) => ({
  business: one(businessEntities, {
    fields: [businessDissolutions.businessEntityId],
    references: [businessEntities.id]
  }),
  tasks: many(dissolutionTasks),
  documents: many(dissolutionDocuments),
  checklists: many(dissolutionChecklists),
  timeline: many(dissolutionTimeline)
}));

export const dissolutionTasksRelations = relations(dissolutionTasks, ({ one }) => ({
  dissolution: one(businessDissolutions, {
    fields: [dissolutionTasks.dissolutionId],
    references: [businessDissolutions.id]
  })
}));

export const dissolutionDocumentsRelations = relations(dissolutionDocuments, ({ one }) => ({
  dissolution: one(businessDissolutions, {
    fields: [dissolutionDocuments.dissolutionId],
    references: [businessDissolutions.id]
  })
}));

export const dissolutionChecklistsRelations = relations(dissolutionChecklists, ({ one }) => ({
  dissolution: one(businessDissolutions, {
    fields: [dissolutionChecklists.dissolutionId],
    references: [businessDissolutions.id]
  })
}));

export const dissolutionTimelineRelations = relations(dissolutionTimeline, ({ one }) => ({
  dissolution: one(businessDissolutions, {
    fields: [dissolutionTimeline.dissolutionId],
    references: [businessDissolutions.id]
  }),
  relatedTask: one(dissolutionTasks, {
    fields: [dissolutionTimeline.relatedTaskId],
    references: [dissolutionTasks.id]
  }),
  relatedDocument: one(dissolutionDocuments, {
    fields: [dissolutionTimeline.relatedDocumentId],
    references: [dissolutionDocuments.id]
  })
}));

// Announcement Relations
export const announcementsRelations = relations(announcements, ({ one, many }) => ({
  creator: one(users, {
    fields: [announcements.createdBy],
    references: [users.id]
  }),
  interactions: many(announcementInteractions)
}));

export const announcementInteractionsRelations = relations(announcementInteractions, ({ one }) => ({
  announcement: one(announcements, {
    fields: [announcementInteractions.announcementId],
    references: [announcements.id]
  }),
  user: one(users, {
    fields: [announcementInteractions.userId],
    references: [users.id]
  })
}));

// Types for Announcements
export const insertAnnouncementSchema = createInsertSchema(announcements);
export const selectAnnouncementSchema = createSelectSchema(announcements);

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export const insertAnnouncementInteractionSchema = createInsertSchema(announcementInteractions);
export type InsertAnnouncementInteraction = z.infer<typeof insertAnnouncementInteractionSchema>;
export type AnnouncementInteraction = typeof announcementInteractions.$inferSelect;

// Types for Footer Configuration
export const insertFooterConfigSchema = createInsertSchema(footerConfig);
export type InsertFooterConfig = z.infer<typeof insertFooterConfigSchema>;
export type FooterConfig = typeof footerConfig.$inferSelect;

// Schemas
// Security and Compliance Tables

// Audit Log table for tracking all sensitive operations
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  
  // Event Details
  eventType: varchar("event_type").notNull(), // login, data_access, data_modification, payment, admin_action
  eventCategory: varchar("event_category").notNull(), // security, compliance, business, administrative
  eventAction: varchar("event_action").notNull(), // create, read, update, delete, authenticate, authorize
  eventDescription: text("event_description").notNull(),
  
  // Context Information
  resourceType: varchar("resource_type"), // user, business_entity, payment, document
  resourceId: varchar("resource_id"), // ID of the affected resource
  oldValues: jsonb("old_values"), // Previous state for modifications
  newValues: jsonb("new_values"), // New state for modifications
  
  // Request Information
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  requestMethod: varchar("request_method"),
  requestPath: varchar("request_path"),
  sessionId: varchar("session_id"),
  
  // Security Context
  riskLevel: varchar("risk_level").default("low"), // low, medium, high, critical
  complianceFlags: text("compliance_flags").array(), // GDPR, SOX, PCI, etc.
  
  // Status and Results
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
  responseTime: integer("response_time"), // in milliseconds
  
  createdAt: timestamp("created_at").defaultNow()
});

// Data Retention Policy table
export const dataRetentionPolicies = pgTable("data_retention_policies", {
  id: serial("id").primaryKey(),
  
  // Policy Details
  policyName: varchar("policy_name").notNull(),
  dataType: varchar("data_type").notNull(), // personal_data, business_data, audit_logs, documents
  description: text("description"),
  
  // Retention Rules
  retentionPeriodDays: integer("retention_period_days").notNull(),
  retentionTrigger: varchar("retention_trigger").notNull(), // creation_date, last_access, account_closure
  autoDeleteEnabled: boolean("auto_delete_enabled").default(false),
  
  // Legal Basis
  legalBasis: text("legal_basis"), // GDPR Article 6, business necessity, etc.
  complianceRequirements: text("compliance_requirements").array(),
  
  // Execution
  lastExecutionDate: timestamp("last_execution_date"),
  nextExecutionDate: timestamp("next_execution_date"),
  recordsProcessed: integer("records_processed").default(0),
  recordsDeleted: integer("records_deleted").default(0),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Compliance Monitoring table
export const complianceMonitoring = pgTable("compliance_monitoring", {
  id: serial("id").primaryKey(),
  
  // Compliance Framework
  framework: varchar("framework").notNull(), // GDPR, SOX, PCI_DSS, CCPA, HIPAA
  requirement: varchar("requirement").notNull(),
  description: text("description"),
  
  // Assessment
  complianceStatus: varchar("compliance_status").notNull(), // compliant, non_compliant, partially_compliant, not_assessed
  lastAssessmentDate: timestamp("last_assessment_date"),
  nextAssessmentDate: timestamp("next_assessment_date"),
  assessmentMethod: varchar("assessment_method"), // automated, manual, external_audit
  
  // Evidence and Documentation
  evidenceRequired: text("evidence_required").array(),
  evidenceProvided: text("evidence_provided").array(),
  documentationPaths: text("documentation_paths").array(),
  
  // Risk Assessment
  riskLevel: varchar("risk_level").default("medium"), // low, medium, high, critical
  riskDescription: text("risk_description"),
  mitigationActions: text("mitigation_actions").array(),
  
  // Responsible Party
  assignedTo: varchar("assigned_to"), // user_id or department
  reviewer: varchar("reviewer"), // user_id
  
  // Findings and Actions
  findings: text("findings"),
  correctiveActions: text("corrective_actions"),
  actionDueDate: timestamp("action_due_date"),
  actionCompletedDate: timestamp("action_completed_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Security Events table for monitoring suspicious activities
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  
  // Event Classification
  eventType: varchar("event_type").notNull(), // failed_login, suspicious_access, data_breach, unauthorized_access
  severity: varchar("severity").notNull(), // low, medium, high, critical
  category: varchar("category").notNull(), // authentication, authorization, data_access, system_security
  
  // Event Details
  description: text("description").notNull(),
  sourceIp: varchar("source_ip"),
  userAgent: text("user_agent"),
  requestDetails: jsonb("request_details"),
  
  // Detection
  detectionMethod: varchar("detection_method"), // automated_rule, manual_review, external_report
  detectionRule: varchar("detection_rule"), // rule or pattern that triggered detection
  
  // Response
  status: varchar("status").default("open"), // open, investigating, resolved, false_positive
  assignedTo: varchar("assigned_to"), // security team member
  responseActions: text("response_actions").array(),
  resolutionDate: timestamp("resolution_date"),
  resolutionNotes: text("resolution_notes"),
  
  // Impact Assessment
  affectedResources: text("affected_resources").array(),
  potentialImpact: text("potential_impact"),
  actualImpact: text("actual_impact"),
  
  // Notification
  notificationsSent: boolean("notifications_sent").default(false),
  notificationRecipients: text("notification_recipients").array(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Security Incidents table (legacy alias for compatibility)
export const securityIncidents = pgTable("security_incidents", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // 'unauthorized_access', 'data_breach', 'system_anomaly'
  description: text("description").notNull(),
  severity: varchar("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  status: varchar("status").notNull().default("open"), // 'open', 'investigating', 'resolved'
  userId: varchar("user_id"), // May be null for system incidents
  details: jsonb("details"),
  reportedAt: timestamp("reported_at").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});

// Permission Management table for RBAC
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  
  // Permission Details
  name: varchar("name").notNull().unique(), // business_entities.create, admin.user_management, etc.
  description: text("description"),
  category: varchar("category").notNull(), // business, admin, financial, reporting
  
  // Scope and Context
  resourceType: varchar("resource_type"), // business_entity, user, payment, document
  action: varchar("action").notNull(), // create, read, update, delete, manage
  scope: varchar("scope").default("own"), // own, organization, all
  
  // Security Level
  securityLevel: varchar("security_level").default("standard"), // basic, standard, elevated, critical
  requiresMFA: boolean("requires_mfa").default(false),
  ipRestrictions: text("ip_restrictions").array(),
  timeRestrictions: jsonb("time_restrictions"), // business hours, etc.
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Role Permissions mapping table
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  role: varchar("role").notNull(), // client, admin, super_admin
  permissionId: integer("permission_id").notNull().references(() => permissions.id),
  
  // Grant Details
  grantedBy: varchar("granted_by").references(() => users.id),
  grantedAt: timestamp("granted_at").defaultNow(),
  
  // Conditions
  conditions: jsonb("conditions"), // additional restrictions or conditions
  expiresAt: timestamp("expires_at"), // for temporary permissions
  
  isActive: boolean("is_active").default(true)
});

// Data Classification table for sensitive data handling
export const dataClassification = pgTable("data_classification", {
  id: serial("id").primaryKey(),
  
  // Data Details
  tableName: varchar("table_name").notNull(),
  columnName: varchar("column_name").notNull(),
  dataType: varchar("data_type").notNull(),
  
  // Classification
  classificationLevel: varchar("classification_level").notNull(), // public, internal, confidential, restricted
  sensitivity: varchar("sensitivity").notNull(), // low, medium, high, critical
  dataCategory: varchar("data_category").notNull(), // PII, financial, business, technical
  
  // Protection Requirements
  encryptionRequired: boolean("encryption_required").default(false),
  encryptionMethod: varchar("encryption_method"), // AES256, etc.
  accessLoggingRequired: boolean("access_logging_required").default(true),
  retentionPolicyId: integer("retention_policy_id").references(() => dataRetentionPolicies.id),
  
  // Compliance
  complianceFlags: text("compliance_flags").array(), // GDPR, PCI, etc.
  specialHandlingInstructions: text("special_handling_instructions"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Remove duplicate type exports since they're already defined above

// Email verification table for OTP functionality
export const emailVerifications = pgTable("email_verifications", {
  id: varchar("id").primaryKey().$defaultFn(() => `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  userId: varchar("user_id"),
  email: varchar("email").notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  otpExpiry: timestamp("otp_expiry").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'registration', 'login', 'password_reset'
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;

// Authorized Users types
export type AuthorizedUser = typeof authorizedUsers.$inferSelect;
export type InsertAuthorizedUser = typeof authorizedUsers.$inferInsert;

export type InsertInvoice = typeof invoices.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;







// User notification preferences types
export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;
export type InsertUserNotificationPreferences = typeof userNotificationPreferences.$inferInsert;

// Formation Order types
export type FormationOrder = typeof formationOrders.$inferSelect;
export type InsertFormationOrder = typeof formationOrders.$inferInsert;

export type OrderProgressStep = typeof orderProgressSteps.$inferSelect;
export type InsertOrderProgressStep = typeof orderProgressSteps.$inferInsert;

// Service Field types for dynamic checkout
export type ServiceField = typeof serviceFields.$inferSelect;
export type InsertServiceField = typeof serviceFields.$inferInsert;

// Service Custom Fields types for service-specific checkout
export type ServiceCustomField = typeof serviceCustomFields.$inferSelect;
export type InsertServiceCustomField = typeof serviceCustomFields.$inferInsert;

// Core type exports - removing duplicates

// Subscription and Service Types
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

export type PlanService = typeof planServices.$inferSelect;
export type InsertPlanService = typeof planServices.$inferInsert;

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

export type UserServicePurchase = typeof userServicePurchases.$inferSelect;
export type InsertUserServicePurchase = typeof userServicePurchases.$inferInsert;

export type ServiceOrder = typeof serviceOrders.$inferSelect;
export type InsertServiceOrder = typeof serviceOrders.$inferInsert;

// Security and Compliance Tables

// Data encryption tracking for audit purposes
export const dataEncryption = pgTable("data_encryption", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  dataType: varchar("data_type").notNull(), // 'pii_ssn', 'pii_ein', 'financial_data', etc.
  encryptionAlgorithm: varchar("encryption_algorithm").notNull(),
  keyVersion: varchar("key_version").notNull(),
  encryptedAt: timestamp("encrypted_at").defaultNow()
});

// Access control roles and permissions
export const accessControlRoles = pgTable("access_control_roles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").notNull(), // 'admin', 'user', 'auditor', 'compliance_officer'
  permissions: jsonb("permissions"), // Detailed permissions object
  grantedBy: varchar("granted_by").references(() => users.id),
  grantedAt: timestamp("granted_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Physical security events for mailbox facilities
export const physicalSecurityEvents = pgTable("physical_security_events", {
  id: serial("id").primaryKey(),
  facilityId: varchar("facility_id").notNull(),
  eventType: varchar("event_type").notNull(), // 'access', 'alarm', 'maintenance'
  description: text("description"),
  severity: varchar("severity").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});

// Privacy consent management for GDPR compliance
export const privacyConsents = pgTable("privacy_consents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  consentType: varchar("consent_type").notNull(), // 'data_processing', 'marketing', 'third_party_sharing'
  granted: boolean("granted").notNull(),
  consentText: text("consent_text"), // The exact text shown to user
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  grantedAt: timestamp("granted_at").defaultNow(),
  revokedAt: timestamp("revoked_at")
});

export type DataEncryption = typeof dataEncryption.$inferSelect;
export type InsertDataEncryption = typeof dataEncryption.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export type SecurityIncident = typeof securityIncidents.$inferSelect;
export type InsertSecurityIncident = typeof securityIncidents.$inferInsert;

export type DataRetentionPolicy = typeof dataRetentionPolicies.$inferSelect;
export type InsertDataRetentionPolicy = typeof dataRetentionPolicies.$inferInsert;

export type AccessControlRole = typeof accessControlRoles.$inferSelect;
export type InsertAccessControlRole = typeof accessControlRoles.$inferInsert;

export type PhysicalSecurityEvent = typeof physicalSecurityEvents.$inferSelect;
export type InsertPhysicalSecurityEvent = typeof physicalSecurityEvents.$inferInsert;

export type PrivacyConsent = typeof privacyConsents.$inferSelect;
export type InsertPrivacyConsent = typeof privacyConsents.$inferInsert;

// Notification Types
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Legal Document Automation Tables (Updated)
export const documentTemplatesUpdated = pgTable("document_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // contract, agreement, waiver, proposal, etc.
  description: text("description"),
  templateContent: text("template_content").notNull(), // JSON template structure
  conditionalLogic: text("conditional_logic"), // JSON rules for dynamic content
  requiredFields: text("required_fields").array(), // Array of required field names
  optionalFields: text("optional_fields").array(), // Array of optional field names
  supportedStates: text("supported_states").array(), // States where template is valid
  industrySpecific: text("industry_specific").array(), // Industry-specific templates
  version: varchar("version").default("1.0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const generatedDocuments = pgTable("generated_documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  templateId: integer("template_id").references(() => documentTemplates.id),
  businessEntityId: varchar("business_entity_id").references(() => businessEntities.id),
  documentName: varchar("document_name").notNull(),
  documentType: varchar("document_type").notNull(),
  formData: text("form_data").notNull(), // JSON of user inputs
  generatedContent: text("generated_content").notNull(), // Final document content
  aiSuggestions: text("ai_suggestions"), // JSON of AI-generated suggestions
  appliedSuggestions: text("applied_suggestions").array(), // Suggestions user accepted
  documentStatus: varchar("document_status").default("draft"), // draft, finalized, archived
  lastModified: timestamp("last_modified").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

export const documentRevisions = pgTable("document_revisions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => generatedDocuments.id),
  revisionNumber: integer("revision_number").notNull(),
  changes: text("changes").notNull(), // JSON of changes made
  changedBy: varchar("changed_by").notNull(),
  changeReason: text("change_reason"),
  previousContent: text("previous_content"),
  newContent: text("new_content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const documentTemplateFields = pgTable("document_template_fields", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull().references(() => documentTemplates.id),
  fieldName: varchar("field_name").notNull(),
  fieldType: varchar("field_type").notNull(), // text, number, date, select, checkbox, etc.
  fieldLabel: varchar("field_label").notNull(),
  fieldDescription: text("field_description"),
  defaultValue: text("default_value"),
  validationRules: text("validation_rules"), // JSON validation criteria
  conditionalRules: text("conditional_rules"), // JSON conditions for field visibility
  fieldOrder: integer("field_order").default(0),
  isRequired: boolean("is_required").default(false),
  sourceModule: varchar("source_module"), // formation, entity, etc. for auto-population
  sourceField: varchar("source_field"), // specific field to pull from source module
});

export const aiDocumentSuggestions = pgTable("ai_document_suggestions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => generatedDocuments.id),
  suggestionType: varchar("suggestion_type").notNull(), // clause_refinement, addition, alternative_phrasing
  originalText: text("original_text"),
  suggestedText: text("suggested_text").notNull(),
  rationale: text("rationale"), // AI explanation for suggestion
  confidence: integer("confidence"), // 0-100 confidence score
  legalAccuracy: integer("legal_accuracy"), // 0-100 legal accuracy score
  industry: varchar("industry"),
  jurisdiction: varchar("jurisdiction"),
  status: varchar("status").default("pending"), // pending, accepted, rejected
  appliedAt: timestamp("applied_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas for document automation
export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).omit({
  id: true,
  lastModified: true,
  createdAt: true
});

export const insertDocumentRevisionSchema = createInsertSchema(documentRevisions).omit({
  id: true,
  createdAt: true
});

export const insertDocumentTemplateFieldSchema = createInsertSchema(documentTemplateFields).omit({
  id: true
});

export const insertAiDocumentSuggestionSchema = createInsertSchema(aiDocumentSuggestions).omit({
  id: true,
  appliedAt: true,
  createdAt: true
});

// Types for document automation
export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
export type DocumentRevision = typeof documentRevisions.$inferSelect;
export type InsertDocumentRevision = z.infer<typeof insertDocumentRevisionSchema>;
export type DocumentTemplateField = typeof documentTemplateFields.$inferSelect;
export type InsertDocumentTemplateField = z.infer<typeof insertDocumentTemplateFieldSchema>;
export type AiDocumentSuggestion = typeof aiDocumentSuggestions.$inferSelect;
export type InsertAiDocumentSuggestion = z.infer<typeof insertAiDocumentSuggestionSchema>;

// Business License Services Tables
export const businessProfiles = pgTable("business_profiles", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id", { length: 12 }).notNull().references(() => businessEntities.id),
  industryType: varchar("industry_type").notNull(), // NAICS code or industry classification
  businessActivities: text("business_activities").array().notNull(), // Specific activities performed
  operatingLocations: text("operating_locations").array().notNull(), // Cities, counties, states where business operates
  employeeCount: integer("employee_count"),
  annualRevenue: integer("annual_revenue"),
  businessDescription: text("business_description"),
  specializedServices: text("specialized_services").array(), // Professional services offered
  salesChannels: text("sales_channels").array(), // online, retail, wholesale, etc.
  hasPhysicalLocation: boolean("has_physical_location").default(false),
  servesMinors: boolean("serves_minors").default(false),
  handlesFood: boolean("handles_food").default(false),
  usesHazardousMaterials: boolean("uses_hazardous_materials").default(false),
  profileStatus: varchar("profile_status").default("incomplete"), // incomplete, complete, verified
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const licenseRequirements = pgTable("license_requirements", {
  id: serial("id").primaryKey(),
  businessProfileId: integer("business_profile_id").notNull().references(() => businessProfiles.id),
  licenseName: varchar("license_name").notNull(),
  licenseCategory: varchar("license_category").notNull(), // general, professional, industry-specific, federal, sales-tax, environmental, health-safety
  issuingAuthority: varchar("issuing_authority").notNull(),
  jurisdiction: varchar("jurisdiction").notNull(), // federal, state, county, city
  jurisdictionCode: varchar("jurisdiction_code"), // state code, county FIPS, city code
  description: text("description"),
  requirements: text("requirements").array(), // Array of requirements
  applicationUrl: varchar("application_url"),
  applicationFee: integer("application_fee"), // Fee in cents
  renewalPeriod: varchar("renewal_period"), // annual, biennial, etc.
  processingTime: varchar("processing_time"), // estimated processing time
  priority: varchar("priority").default("medium"), // high, medium, low
  isRequired: boolean("is_required").default(true),
  naicsCompatible: text("naics_compatible").array(), // NAICS codes this applies to
  businessSizeRequirement: varchar("business_size_requirement"), // small, medium, large, all
  discoveredAt: timestamp("discovered_at").defaultNow(),
  lastVerified: timestamp("last_verified").defaultNow()
});

export const licenseApplications = pgTable("license_applications", {
  id: serial("id").primaryKey(),
  businessProfileId: integer("business_profile_id").notNull().references(() => businessProfiles.id),
  licenseRequirementId: integer("license_requirement_id").notNull().references(() => licenseRequirements.id),
  applicationStatus: varchar("application_status").default("not_started"), // not_started, in_progress, submitted, approved, rejected, expired
  applicationNumber: varchar("application_number"),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  expiresAt: timestamp("expires_at"),
  licenseNumber: varchar("license_number"),
  applicationData: text("application_data"), // JSON of form data
  documents: text("documents").array(), // Array of document URLs
  statusHistory: text("status_history"), // JSON array of status changes
  notes: text("notes"),
  remindersSent: integer("reminders_sent").default(0),
  nextReminderDate: timestamp("next_reminder_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const licenseRenewals = pgTable("license_renewals", {
  id: serial("id").primaryKey(),
  licenseApplicationId: integer("license_application_id").notNull().references(() => licenseApplications.id),
  renewalDueDate: timestamp("renewal_due_date").notNull(),
  renewalStatus: varchar("renewal_status").default("pending"), // pending, submitted, completed, overdue
  renewalFee: integer("renewal_fee"), // Fee in cents
  renewalApplicationNumber: varchar("renewal_application_number"),
  renewalSubmittedAt: timestamp("renewal_submitted_at"),
  renewalCompletedAt: timestamp("renewal_completed_at"),
  newExpirationDate: timestamp("new_expiration_date"),
  reminderScheduled: boolean("reminder_scheduled").default(false),
  remindersSent: integer("reminders_sent").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const licenseVerifications = pgTable("license_verifications", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  verificationProvider: varchar("verification_provider").notNull(), // middesk, signzy, etc.
  verificationResult: text("verification_result"), // JSON response from API
  existingLicenses: text("existing_licenses"), // JSON array of found licenses
  businessRegistrationStatus: varchar("business_registration_status"),
  lastVerificationDate: timestamp("last_verification_date").defaultNow(),
  verificationScore: integer("verification_score"), // 0-100 confidence score
  discrepancies: text("discrepancies").array(), // Issues found during verification
  nextVerificationDate: timestamp("next_verification_date")
});

export const complianceAlerts = pgTable("compliance_alerts", {
  id: serial("id").primaryKey(),
  businessProfileId: integer("business_profile_id").notNull().references(() => businessProfiles.id),
  alertType: varchar("alert_type").notNull(), // renewal_due, application_overdue, new_requirement, verification_needed
  alertTitle: varchar("alert_title").notNull(),
  alertMessage: text("alert_message").notNull(),
  severity: varchar("severity").default("medium"), // low, medium, high, critical
  relatedLicenseId: integer("related_license_id"),
  relatedApplicationId: integer("related_application_id"),
  actionRequired: boolean("action_required").default(true),
  actionUrl: varchar("action_url"),
  dismissedAt: timestamp("dismissed_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas for business license services
export const insertBusinessProfileSchema = createInsertSchema(businessProfiles).omit({
  id: true,
  profileStatus: true,
  createdAt: true,
  updatedAt: true
});

export const insertLicenseRequirementSchema = createInsertSchema(licenseRequirements).omit({
  id: true,
  discoveredAt: true,
  lastVerified: true
});

export const insertLicenseApplicationSchema = createInsertSchema(licenseApplications).omit({
  id: true,
  remindersSent: true,
  createdAt: true,
  updatedAt: true
});

export const insertLicenseRenewalSchema = createInsertSchema(licenseRenewals).omit({
  id: true,
  reminderScheduled: true,
  remindersSent: true,
  createdAt: true
});

export const insertLicenseVerificationSchema = createInsertSchema(licenseVerifications).omit({
  id: true,
  lastVerificationDate: true
});

export const insertComplianceAlertSchema = createInsertSchema(complianceAlerts).omit({
  id: true,
  createdAt: true
});

// Types for business license services
export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;
export type LicenseRequirement = typeof licenseRequirements.$inferSelect;
export type InsertLicenseRequirement = z.infer<typeof insertLicenseRequirementSchema>;
export type LicenseApplication = typeof licenseApplications.$inferSelect;
export type InsertLicenseApplication = z.infer<typeof insertLicenseApplicationSchema>;
export type LicenseRenewal = typeof licenseRenewals.$inferSelect;
export type InsertLicenseRenewal = z.infer<typeof insertLicenseRenewalSchema>;
export type LicenseVerification = typeof licenseVerifications.$inferSelect;
export type InsertLicenseVerification = z.infer<typeof insertLicenseVerificationSchema>;
export type ComplianceAlert = typeof complianceAlerts.$inferSelect;
export type InsertComplianceAlert = z.infer<typeof insertComplianceAlertSchema>;

// Digital Mailbox Services Tables
export const virtualMailboxAddresses = pgTable("virtual_mailbox_addresses", {
  id: serial("id").primaryKey(),
  addressLine1: varchar("address_line_1").notNull(),
  addressLine2: varchar("address_line_2"),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  country: varchar("country").default("US"),
  mailboxType: varchar("mailbox_type").notNull(), // premium, standard, budget
  provider: varchar("provider").notNull(), // stable, virtualpostmail, etc.
  monthlyFee: integer("monthly_fee").notNull(), // Fee in cents
  setupFee: integer("setup_fee").default(0),
  features: text("features").array(), // scanning, forwarding, shredding, check_deposit
  businessHours: varchar("business_hours"),
  isAvailable: boolean("is_available").default(true),
  maxMailItems: integer("max_mail_items").default(50),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow()
});

export const mailboxSubscriptions = pgTable("mailbox_subscriptions", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  virtualAddressId: integer("virtual_address_id").notNull().references(() => virtualMailboxAddresses.id),
  subscriptionStatus: varchar("subscription_status").default("active"), // active, suspended, cancelled
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  monthlyFee: integer("monthly_fee").notNull(),
  autoRenewal: boolean("auto_renewal").default(true),
  mailboxNumber: varchar("mailbox_number"),
  apiAccountId: varchar("api_account_id"), // External provider account ID
  apiAccessToken: varchar("api_access_token"), // Encrypted access token
  notificationPreferences: text("notification_preferences"), // JSON settings
  forwardingRules: text("forwarding_rules"), // JSON rules for auto-forwarding
  scanningPreferences: text("scanning_preferences"), // JSON settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const receivedMail = pgTable("received_mail", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => mailboxSubscriptions.id),
  externalMailId: varchar("external_mail_id").notNull(), // ID from external provider
  senderName: varchar("sender_name"),
  senderAddress: text("sender_address"),
  recipientName: varchar("recipient_name"),
  mailType: varchar("mail_type"), // letter, package, postcard, certified, etc.
  mailCategory: varchar("mail_category"), // business, legal, tax, personal, marketing
  priority: varchar("priority").default("normal"), // urgent, high, normal, low
  receivedDate: timestamp("received_date").notNull(),
  scanStatus: varchar("scan_status").default("pending"), // pending, scanned, failed
  envelopeImageUrl: varchar("envelope_image_url"),
  contentImageUrls: text("content_image_urls").array(),
  pdfUrl: varchar("pdf_url"),
  ocrText: text("ocr_text"),
  extractedData: text("extracted_data"), // JSON with OCR extracted information
  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),
  actionTaken: varchar("action_taken"), // scanned, forwarded, shredded, stored
  actionDate: timestamp("action_date"),
  forwardingAddress: text("forwarding_address"),
  tags: text("tags").array(),
  notes: text("notes"),
  relatedModules: text("related_modules").array(), // Links to other ParaFort modules
  estimatedValue: integer("estimated_value"), // For checks/payments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const mailActions = pgTable("mail_actions", {
  id: serial("id").primaryKey(),
  mailId: integer("mail_id").notNull().references(() => receivedMail.id),
  actionType: varchar("action_type").notNull(), // scan, forward, shred, store, deposit_check
  actionStatus: varchar("action_status").default("pending"), // pending, completed, failed
  requestedAt: timestamp("requested_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  actionDetails: text("action_details"), // JSON with action-specific details
  cost: integer("cost").default(0), // Cost in cents
  externalActionId: varchar("external_action_id"), // ID from external provider
  errorMessage: text("error_message"),
  createdBy: varchar("created_by").notNull(), // user or system
});

export const mailNotifications = pgTable("mail_notifications", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => mailboxSubscriptions.id),
  mailId: integer("mail_id").references(() => receivedMail.id),
  notificationType: varchar("notification_type").notNull(), // new_mail, action_complete, urgent_mail
  notificationMethod: varchar("notification_method").notNull(), // email, sms, webhook
  recipient: varchar("recipient").notNull(),
  subject: varchar("subject"),
  message: text("message"),
  sentAt: timestamp("sent_at"),
  deliveryStatus: varchar("delivery_status").default("pending"), // pending, sent, delivered, failed
  metadata: text("metadata"), // JSON with additional data
  createdAt: timestamp("created_at").defaultNow()
});

export const mailAnalytics = pgTable("mail_analytics", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => mailboxSubscriptions.id),
  analysisDate: timestamp("analysis_date").notNull(),
  totalMailReceived: integer("total_mail_received").default(0),
  mailByCategory: text("mail_by_category"), // JSON breakdown
  mailByType: text("mail_by_type"), // JSON breakdown
  actionsSummary: text("actions_summary"), // JSON summary of actions taken
  avgProcessingTime: integer("avg_processing_time"), // In minutes
  costSummary: text("cost_summary"), // JSON cost breakdown
  insights: text("insights").array(), // AI-generated insights
  recommendations: text("recommendations").array(), // AI-generated recommendations
});

export const digitalArchive = pgTable("digital_archive", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => mailboxSubscriptions.id),
  mailId: integer("mail_id").references(() => receivedMail.id),
  archiveCategory: varchar("archive_category").notNull(), // tax_documents, legal_notices, business_correspondence
  documentType: varchar("document_type"), // invoice, contract, notice, statement
  retentionPeriod: integer("retention_period"), // Days to retain
  encryptedFileUrl: varchar("encrypted_file_url"),
  accessLevel: varchar("access_level").default("business_owner"), // business_owner, accountant, legal
  searchableText: text("searchable_text"),
  metadata: text("metadata"), // JSON with document metadata
  archivedAt: timestamp("archived_at").defaultNow(),
  expiresAt: timestamp("expires_at")
});

// Insert schemas for digital mailbox services
export const insertVirtualMailboxAddressSchema = createInsertSchema(virtualMailboxAddresses).omit({
  id: true,
  createdAt: true
});

export const insertMailboxSubscriptionSchema = createInsertSchema(mailboxSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertReceivedMailSchema = createInsertSchema(receivedMail).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertMailActionSchema = createInsertSchema(mailActions).omit({
  id: true,
  requestedAt: true
});

export const insertMailNotificationSchema = createInsertSchema(mailNotifications).omit({
  id: true,
  createdAt: true
});

export const insertDigitalArchiveSchema = createInsertSchema(digitalArchive).omit({
  id: true,
  archivedAt: true
});

// Types for digital mailbox services
export type VirtualMailboxAddress = typeof virtualMailboxAddresses.$inferSelect;
export type InsertVirtualMailboxAddress = z.infer<typeof insertVirtualMailboxAddressSchema>;
export type MailboxSubscription = typeof mailboxSubscriptions.$inferSelect;
export type InsertMailboxSubscription = z.infer<typeof insertMailboxSubscriptionSchema>;
export type ReceivedMail = typeof receivedMail.$inferSelect;
export type InsertReceivedMail = z.infer<typeof insertReceivedMailSchema>;
export type MailAction = typeof mailActions.$inferSelect;
export type InsertMailAction = z.infer<typeof insertMailActionSchema>;
export type MailNotification = typeof mailNotifications.$inferSelect;
export type InsertMailNotification = z.infer<typeof insertMailNotificationSchema>;
export type DigitalArchive = typeof digitalArchive.$inferSelect;
export type InsertDigitalArchive = z.infer<typeof insertDigitalArchiveSchema>;

export const insertBusinessEntitySchema = createInsertSchema(businessEntities).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  name: z.string().optional(),
  state: z.string().optional(),
  entityType: z.string().optional(),
  parValuePerShare: z.union([z.string(), z.number()]).optional().transform((val) => 
    val === undefined || val === null ? undefined : String(val)
  )
});

export const updateBusinessEntitySchema = insertBusinessEntitySchema.partial();

export type InsertBusinessEntity = z.infer<typeof insertBusinessEntitySchema>;
export type UpdateBusinessEntity = z.infer<typeof updateBusinessEntitySchema>;
export type BusinessEntity = typeof businessEntities.$inferSelect;

// Registered Agent schemas
export const insertRegisteredAgentAddressSchema = createInsertSchema(registeredAgentAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertRegisteredAgentConsentSchema = createInsertSchema(registeredAgentConsent).omit({
  id: true,
  createdAt: true
});

export const insertReceivedDocumentSchema = createInsertSchema(receivedDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertDocumentAuditLogSchema = createInsertSchema(documentAuditLog).omit({
  id: true,
  timestamp: true
});

// Virtual mailbox schemas
export const insertVirtualMailboxConfigSchema = createInsertSchema(virtualMailboxConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// EIN schemas
export const insertEinApplicationSchema = createInsertSchema(einApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertEinVerificationSchema = createInsertSchema(einVerifications).omit({
  id: true,
  createdAt: true
});

// BOIR schemas
export const insertBoirFilingSchema = createInsertSchema(boirFilings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBeneficialOwnerSchema = createInsertSchema(beneficialOwners).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCompanyApplicantSchema = createInsertSchema(companyApplicants).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBoirAuditLogSchema = createInsertSchema(boirAuditLog).omit({
  id: true,
  timestamp: true
});

export type RegisteredAgentAddress = typeof registeredAgentAddresses.$inferSelect;
export type InsertRegisteredAgentAddress = z.infer<typeof insertRegisteredAgentAddressSchema>;
export type RegisteredAgentConsent = typeof registeredAgentConsent.$inferSelect;
export type InsertRegisteredAgentConsent = z.infer<typeof insertRegisteredAgentConsentSchema>;
export type ReceivedDocument = typeof receivedDocuments.$inferSelect;
export type InsertReceivedDocument = z.infer<typeof insertReceivedDocumentSchema>;
export type DocumentAuditLog = typeof documentAuditLog.$inferSelect;
export type InsertDocumentAuditLog = z.infer<typeof insertDocumentAuditLogSchema>;
export type VirtualMailboxConfig = typeof virtualMailboxConfig.$inferSelect;
export type InsertVirtualMailboxConfig = z.infer<typeof insertVirtualMailboxConfigSchema>;
export type EinApplication = typeof einApplications.$inferSelect;
export type InsertEinApplication = z.infer<typeof insertEinApplicationSchema>;
export type EinVerification = typeof einVerifications.$inferSelect;
export type InsertEinVerification = z.infer<typeof insertEinVerificationSchema>;
export type BoirFiling = typeof boirFilings.$inferSelect;
export type InsertBoirFiling = z.infer<typeof insertBoirFilingSchema>;
export type BeneficialOwner = typeof beneficialOwners.$inferSelect;
export type InsertBeneficialOwner = z.infer<typeof insertBeneficialOwnerSchema>;
export type CompanyApplicant = typeof companyApplicants.$inferSelect;
export type InsertCompanyApplicant = z.infer<typeof insertCompanyApplicantSchema>;
export type BoirAuditLog = typeof boirAuditLog.$inferSelect;
export type InsertBoirAuditLog = z.infer<typeof insertBoirAuditLogSchema>;

// S-Corporation Election schemas
export const insertSCorpElectionSchema = createInsertSchema(sCorpElections).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertSCorpShareholderSchema = createInsertSchema(sCorpShareholders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertComplianceCalendarSchema = createInsertSchema(complianceCalendar).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertComplianceNotificationSchema = createInsertSchema(complianceNotifications).omit({
  id: true,
  createdAt: true
});

export type SCorpElection = typeof sCorpElections.$inferSelect;
export type InsertSCorpElection = z.infer<typeof insertSCorpElectionSchema>;
export type SCorpShareholder = typeof sCorpShareholders.$inferSelect;
export type InsertSCorpShareholder = z.infer<typeof insertSCorpShareholderSchema>;
export type ComplianceCalendar = typeof complianceCalendar.$inferSelect;
export type InsertComplianceCalendar = z.infer<typeof insertComplianceCalendarSchema>;
export type ComplianceNotification = typeof complianceNotifications.$inferSelect;
export type InsertComplianceNotification = z.infer<typeof insertComplianceNotificationSchema>;

// Annual Report types
export const insertAnnualReportSchema = createInsertSchema(annualReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertStateFilingRequirementSchema = createInsertSchema(stateFilingRequirements).omit({
  id: true,
  createdAt: true,
  lastUpdated: true
});

export const insertAnnualReportReminderSchema = createInsertSchema(annualReportReminders).omit({
  id: true,
  createdAt: true
});

export const insertAnnualReportTemplateSchema = createInsertSchema(annualReportTemplates).omit({
  id: true,
  createdAt: true
});

export type AnnualReport = typeof annualReports.$inferSelect;
export type InsertAnnualReport = z.infer<typeof insertAnnualReportSchema>;
export type StateFilingRequirement = typeof stateFilingRequirements.$inferSelect;
export type InsertStateFilingRequirement = z.infer<typeof insertStateFilingRequirementSchema>;
export type AnnualReportReminder = typeof annualReportReminders.$inferSelect;
export type InsertAnnualReportReminder = z.infer<typeof insertAnnualReportReminderSchema>;
export type AnnualReportTemplate = typeof annualReportTemplates.$inferSelect;
export type InsertAnnualReportTemplate = z.infer<typeof insertAnnualReportTemplateSchema>;

// Name Change schemas
export const insertNameChangeRequestSchema = createInsertSchema(nameChangeRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertNameChangeDocumentSchema = createInsertSchema(nameChangeDocuments).omit({
  id: true,
  createdAt: true
});

export const insertNameChangeWorkflowTaskSchema = createInsertSchema(nameChangeWorkflowTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBusinessLicenseSchema = createInsertSchema(businessLicenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertNameChangeTemplateSchema = createInsertSchema(nameChangeTemplates).omit({
  id: true,
  createdAt: true
});

export type NameChangeRequest = typeof nameChangeRequests.$inferSelect;
export type InsertNameChangeRequest = z.infer<typeof insertNameChangeRequestSchema>;
export type NameChangeDocument = typeof nameChangeDocuments.$inferSelect;
export type InsertNameChangeDocument = z.infer<typeof insertNameChangeDocumentSchema>;
export type NameChangeWorkflowTask = typeof nameChangeWorkflowTasks.$inferSelect;
export type InsertNameChangeWorkflowTask = z.infer<typeof insertNameChangeWorkflowTaskSchema>;
export type BusinessLicense = typeof businessLicenses.$inferSelect;
export type InsertBusinessLicense = z.infer<typeof insertBusinessLicenseSchema>;
export type NameChangeTemplate = typeof nameChangeTemplates.$inferSelect;
export type InsertNameChangeTemplate = z.infer<typeof insertNameChangeTemplateSchema>;

// Business Dissolution schemas
export const insertBusinessDissolutionSchema = createInsertSchema(businessDissolutions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertDissolutionTaskSchema = createInsertSchema(dissolutionTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertDissolutionDocumentSchema = createInsertSchema(dissolutionDocuments).omit({
  id: true,
  createdAt: true
});

export const insertDissolutionChecklistSchema = createInsertSchema(dissolutionChecklists).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertDissolutionTimelineSchema = createInsertSchema(dissolutionTimeline).omit({
  id: true,
  createdAt: true
});

export const insertDissolutionTemplateSchema = createInsertSchema(dissolutionTemplates).omit({
  id: true,
  createdAt: true,
  lastUpdated: true
});

export type BusinessDissolution = typeof businessDissolutions.$inferSelect;
export type InsertBusinessDissolution = z.infer<typeof insertBusinessDissolutionSchema>;
export type DissolutionTask = typeof dissolutionTasks.$inferSelect;
export type InsertDissolutionTask = z.infer<typeof insertDissolutionTaskSchema>;
export type DissolutionDocument = typeof dissolutionDocuments.$inferSelect;
export type InsertDissolutionDocument = z.infer<typeof insertDissolutionDocumentSchema>;
export type DissolutionChecklist = typeof dissolutionChecklists.$inferSelect;
export type InsertDissolutionChecklist = z.infer<typeof insertDissolutionChecklistSchema>;
export type DissolutionTimeline = typeof dissolutionTimeline.$inferSelect;
export type InsertDissolutionTimeline = z.infer<typeof insertDissolutionTimelineSchema>;
export type DissolutionTemplate = typeof dissolutionTemplates.$inferSelect;
export type InsertDissolutionTemplate = z.infer<typeof insertDissolutionTemplateSchema>;

// Mailbox subscription schemas
export const insertMailboxPlanSchema = createInsertSchema(mailboxPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertUserMailboxSubscriptionSchema = createInsertSchema(userMailboxSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type MailboxPlan = typeof mailboxPlans.$inferSelect;
export type InsertMailboxPlan = z.infer<typeof insertMailboxPlanSchema>;

export type UserMailboxSubscription = typeof userMailboxSubscriptions.$inferSelect;
export type InsertUserMailboxSubscription = z.infer<typeof insertUserMailboxSubscriptionSchema>;

// AI-powered features database tables
export const userBehaviorSessions = pgTable("user_behavior_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull().unique(),
  userId: varchar("user_id"),
  fingerprint: varchar("fingerprint"),
  deviceType: varchar("device_type"), // mobile, desktop, tablet
  browserInfo: jsonb("browser_info"),
  ipAddress: varchar("ip_address"),
  sessionStart: timestamp("session_start").defaultNow().notNull(),
  sessionEnd: timestamp("session_end"),
  totalDuration: integer("total_duration"), // seconds
  pageViews: integer("page_views").default(0),
  abandonnmentRisk: real("abandonnment_risk").default(0),
  fraudRiskScore: real("fraud_risk_score").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const fieldInteractions = pgTable("field_interactions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  serviceId: integer("service_id"),
  fieldName: varchar("field_name").notNull(),
  fieldType: varchar("field_type"), // text, select, checkbox, etc.
  focusTime: timestamp("focus_time").notNull(),
  blurTime: timestamp("blur_time"),
  dwellTime: integer("dwell_time"), // seconds
  valueLength: integer("value_length"),
  changeCount: integer("change_count").default(0),
  hesitationScore: real("hesitation_score").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id"),
  serviceId: integer("service_id").notNull(),
  recommendationType: varchar("recommendation_type").notNull(), // addon, pricing, field_prediction
  recommendedServiceId: integer("recommended_service_id"),
  confidence: real("confidence").notNull(),
  reason: varchar("reason"),
  originalPrice: real("original_price"),
  suggestedPrice: real("suggested_price"),
  discount: real("discount"),
  wasAccepted: boolean("was_accepted").default(false),
  displayedAt: timestamp("displayed_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const smartFieldPredictions = pgTable("smart_field_predictions", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  userId: varchar("user_id"),
  fieldName: varchar("field_name").notNull(),
  predictedValue: varchar("predicted_value"),
  probability: real("probability").notNull(),
  validationHint: varchar("validation_hint"),
  wasUsed: boolean("was_used").default(false),
  accuracy: real("accuracy"), // Set after user completes form
  createdAt: timestamp("created_at").defaultNow()
});

export const voiceInteractions = pgTable("voice_interactions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id"),
  serviceId: integer("service_id"),
  command: varchar("command").notNull(), // fill_field, submit_form, navigate
  transcription: text("transcription").notNull(),
  confidence: real("confidence").notNull(),
  fieldName: varchar("field_name"),
  extractedValue: varchar("extracted_value"),
  wasSuccessful: boolean("was_successful").default(false),
  errorMessage: varchar("error_message"),
  processingTime: integer("processing_time"), // milliseconds
  createdAt: timestamp("created_at").defaultNow()
});

export const fraudAnalysis = pgTable("fraud_analysis", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id"),
  serviceOrderId: integer("service_order_id"),
  riskLevel: varchar("risk_level").notNull(), // low, medium, high
  riskScore: real("risk_score").notNull(),
  riskFactors: jsonb("risk_factors"), // Array of risk factors
  recommendedActions: jsonb("recommended_actions"), // Array of actions
  manualReview: boolean("manual_review").default(false),
  reviewedBy: varchar("reviewed_by"),
  reviewDate: timestamp("review_date"),
  finalDecision: varchar("final_decision"), // approved, rejected, flagged
  createdAt: timestamp("created_at").defaultNow()
});

// AI feature type exports
export type UserBehaviorSession = typeof userBehaviorSessions.$inferSelect;
export type FieldInteraction = typeof fieldInteractions.$inferSelect;
export type AIRecommendation = typeof aiRecommendations.$inferSelect;
export type SmartFieldPrediction = typeof smartFieldPredictions.$inferSelect;
export type VoiceInteraction = typeof voiceInteractions.$inferSelect;
export type FraudAnalysis = typeof fraudAnalysis.$inferSelect;

// OTP (One-Time Password) schemas
export const insertOtpVerificationSchema = createInsertSchema(otpVerifications).omit({
  id: true,
  createdAt: true
});

export const insertOtpPreferencesSchema = createInsertSchema(otpPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTrustedDeviceSchema = createInsertSchema(trustedDevices).omit({
  id: true,
  createdAt: true
});

export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertOtpVerification = z.infer<typeof insertOtpVerificationSchema>;
export type OtpPreferences = typeof otpPreferences.$inferSelect;
export type InsertOtpPreferences = z.infer<typeof insertOtpPreferencesSchema>;
export type TrustedDevice = typeof trustedDevices.$inferSelect;
export type InsertTrustedDevice = z.infer<typeof insertTrustedDeviceSchema>;

// Document Request Tables
export const documentRequests = pgTable("document_requests", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => users.id),
  requestedBy: varchar("requested_by").notNull().references(() => users.id), // Admin who made the request
  documentName: varchar("document_name").notNull(),
  description: text("description"),
  serviceType: varchar("service_type"), // Add serviceType field
  status: varchar("status").notNull().default("requested"), // requested, uploaded, reviewed, approved, rejected
  priority: varchar("priority").default("normal"), // urgent, high, normal, low
  dueDate: timestamp("due_date"),
  uploadedFileName: varchar("uploaded_file_name"),
  uploadedFilePath: varchar("uploaded_file_path"),
  uploadedAt: timestamp("uploaded_at"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Document request history for audit trail
export const documentRequestHistory = pgTable("document_request_history", {
  id: serial("id").primaryKey(),
  documentRequestId: integer("document_request_id").notNull().references(() => documentRequests.id),
  action: varchar("action").notNull(), // created, uploaded, reviewed, approved, rejected, updated
  performedBy: varchar("performed_by").notNull().references(() => users.id),
  previousStatus: varchar("previous_status"),
  newStatus: varchar("new_status"),
  notes: text("notes"),
  metadata: jsonb("metadata"), // Additional action-specific data
  timestamp: timestamp("timestamp").defaultNow()
});

// Insert schemas for document requests
export const insertDocumentRequestSchema = createInsertSchema(documentRequests).omit({
  id: true,
  status: true,
  uploadedAt: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true
});

export const insertDocumentRequestHistorySchema = createInsertSchema(documentRequestHistory).omit({
  id: true,
  timestamp: true
});

// Types for document requests
export type DocumentRequest = typeof documentRequests.$inferSelect;
export type InsertDocumentRequest = z.infer<typeof insertDocumentRequestSchema>;
export type DocumentRequestHistory = typeof documentRequestHistory.$inferSelect;
export type InsertDocumentRequestHistory = z.infer<typeof insertDocumentRequestHistorySchema>;

// Payment Methods table for Stripe integration
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey(), // Stripe payment method ID
  userId: varchar("user_id").notNull().references(() => users.id),
  stripeCustomerId: varchar("stripe_customer_id"),
  
  // Payment method details
  type: varchar("type").notNull().default("card"), // card, bank_account
  cardBrand: varchar("card_brand"), // visa, mastercard, amex, etc.
  cardLast4: varchar("card_last4", { length: 4 }),
  cardExpMonth: integer("card_exp_month"),
  cardExpYear: integer("card_exp_year"),
  cardFingerprint: varchar("card_fingerprint"),
  
  // Billing details
  billingName: varchar("billing_name"),
  billingEmail: varchar("billing_email"),
  billingPhone: varchar("billing_phone"),
  billingAddressLine1: varchar("billing_address_line1"),
  billingAddressLine2: varchar("billing_address_line2"),
  billingAddressCity: varchar("billing_address_city"),
  billingAddressState: varchar("billing_address_state"),
  billingAddressPostalCode: varchar("billing_address_postal_code"),
  billingAddressCountry: varchar("billing_address_country").default("US"),
  
  // Status and metadata
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id]
  })
}));

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;

// Create schema for validation
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods);
export const newPaymentMethodSchema = insertPaymentMethodSchema.extend({
  cardNumber: z.string().min(13).max(19),
  expMonth: z.string().regex(/^(0[1-9]|1[0-2])$/),
  expYear: z.string().regex(/^\d{4}$/),
  cvc: z.string().min(3).max(4),
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postal_code: z.string().min(1),
  country: z.string().min(2).max(2)
});

// Bookkeeping Services Tables
export const bookkeepingSubscriptions = pgTable("bookkeeping_subscriptions", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  planType: varchar("plan_type").notNull(), // basic, standard, premium
  status: varchar("status").default("active"), // active, suspended, cancelled
  monthlyFee: integer("monthly_fee").notNull(), // Fee in cents
  nextBillingDate: timestamp("next_billing_date").notNull(),
  documentsProcessed: integer("documents_processed").default(0),
  documentsLimit: integer("documents_limit").notNull(),
  features: text("features").array(), // specific features included in plan
  autoRenewal: boolean("auto_renewal").default(true),
  trialEndDate: timestamp("trial_end_date"),
  billingCycle: varchar("billing_cycle").default("monthly"), // monthly, quarterly, yearly
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const bookkeepingDocuments = pgTable("bookkeeping_documents", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  fileName: varchar("file_name").notNull(),
  originalFileName: varchar("original_file_name").notNull(),
  fileType: varchar("file_type").notNull(), // pdf, jpg, png, csv, xlsx
  fileSize: integer("file_size").notNull(), // Size in bytes
  filePath: varchar("file_path").notNull(), // Secure storage path
  downloadUrl: varchar("download_url"), // Signed URL for downloads
  category: varchar("category").notNull(), // receipt, invoice, bank_statement, tax_document
  subcategory: varchar("subcategory"), // office_supplies, travel, utilities, etc.
  uploadDate: timestamp("upload_date").defaultNow(),
  processedDate: timestamp("processed_date"),
  status: varchar("status").default("uploaded"), // uploaded, processing, processed, error
  extractedData: text("extracted_data"), // JSON with OCR/AI extracted data
  amount: integer("amount"), // Transaction amount in cents
  vendor: varchar("vendor"), // Vendor/supplier name
  transactionDate: timestamp("transaction_date"),
  description: text("description"),
  tags: text("tags").array(),
  isDeductible: boolean("is_deductible").default(false),
  reviewStatus: varchar("review_status").default("pending"), // pending, approved, rejected
  reviewNotes: text("review_notes"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const bookkeepingCategories = pgTable("bookkeeping_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  parentId: integer("parent_id"),
  description: text("description"),
  isExpense: boolean("is_expense").default(true),
  isDeductible: boolean("is_deductible").default(false),
  taxCode: varchar("tax_code"), // For tax categorization
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const bookkeepingReports = pgTable("bookkeeping_reports", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  reportType: varchar("report_type").notNull(), // monthly_summary, quarterly_report, annual_summary, tax_preparation
  reportPeriodStart: timestamp("report_period_start").notNull(),
  reportPeriodEnd: timestamp("report_period_end").notNull(),
  reportData: text("report_data"), // JSON with report calculations
  totalIncome: integer("total_income").default(0),
  totalExpenses: integer("total_expenses").default(0),
  netIncome: integer("net_income").default(0),
  deductibleExpenses: integer("deductible_expenses").default(0),
  documentCount: integer("document_count").default(0),
  reportFileUrl: varchar("report_file_url"), // PDF report download
  status: varchar("status").default("generating"), // generating, ready, error
  generatedAt: timestamp("generated_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow()
});

export const bookkeepingPlans = pgTable("bookkeeping_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  monthlyPrice: integer("monthly_price").notNull(), // Price in cents
  yearlyPrice: integer("yearly_price"), // Annual pricing
  documentsLimit: integer("documents_limit").notNull(),
  features: text("features").array(),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas for bookkeeping services
export const insertBookkeepingSubscriptionSchema = createInsertSchema(bookkeepingSubscriptions).omit({
  id: true,
  documentsProcessed: true,
  createdAt: true,
  updatedAt: true
});

export const insertBookkeepingDocumentSchema = createInsertSchema(bookkeepingDocuments).omit({
  id: true,
  uploadDate: true,
  createdAt: true,
  updatedAt: true
});

export const insertBookkeepingCategorySchema = createInsertSchema(bookkeepingCategories).omit({
  id: true,
  createdAt: true
});

export const insertBookkeepingReportSchema = createInsertSchema(bookkeepingReports).omit({
  id: true,
  createdAt: true
});

export const insertBookkeepingPlanSchema = createInsertSchema(bookkeepingPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Types for bookkeeping services
export type BookkeepingSubscription = typeof bookkeepingSubscriptions.$inferSelect;
export type InsertBookkeepingSubscription = z.infer<typeof insertBookkeepingSubscriptionSchema>;
export type BookkeepingDocument = typeof bookkeepingDocuments.$inferSelect;
export type InsertBookkeepingDocument = z.infer<typeof insertBookkeepingDocumentSchema>;
export type BookkeepingCategory = typeof bookkeepingCategories.$inferSelect;
export type InsertBookkeepingCategory = z.infer<typeof insertBookkeepingCategorySchema>;
export type BookkeepingReport = typeof bookkeepingReports.$inferSelect;
export type InsertBookkeepingReport = z.infer<typeof insertBookkeepingReportSchema>;
export type BookkeepingPlan = typeof bookkeepingPlans.$inferSelect;
export type InsertBookkeepingPlan = z.infer<typeof insertBookkeepingPlanSchema>;

// Payroll Services Tables
export const payrollSubscriptions = pgTable("payroll_subscriptions", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  planName: varchar("plan_name").notNull(),
  status: varchar("status").notNull().default("active"), // active, trial, pending_renewal, cancelled
  renewalDate: timestamp("renewal_date").notNull(),
  cost: integer("cost").notNull(), // in cents
  billingCycle: varchar("billing_cycle").notNull().default("monthly"), // monthly, yearly
  employeeCount: integer("employee_count").notNull().default(1),
  features: text("features").array(),
  
  // Stripe integration
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  stripePriceId: varchar("stripe_price_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const payrollDocuments = pgTable("payroll_documents", {
  id: serial("id").primaryKey(),
  businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id),
  fileName: varchar("file_name").notNull(),
  originalFileName: varchar("original_file_name").notNull(),
  documentType: varchar("document_type").notNull(), // timesheet, w4, bank_statement, company_policy, payroll_report, tax_document, other
  filePath: varchar("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type"),
  isUserUploaded: boolean("is_user_uploaded").default(true),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  
  // Processing status
  status: varchar("status").default("uploaded"), // uploaded, processing, processed, error
  processedDate: timestamp("processed_date"),
  processingNotes: text("processing_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas for payroll services
export const insertPayrollSubscriptionSchema = createInsertSchema(payrollSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertPayrollDocumentSchema = createInsertSchema(payrollDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Types for payroll services
export type PayrollSubscription = typeof payrollSubscriptions.$inferSelect;
export type InsertPayrollSubscription = z.infer<typeof insertPayrollSubscriptionSchema>;
export type PayrollDocument = typeof payrollDocuments.$inferSelect;
export type InsertPayrollDocument = z.infer<typeof insertPayrollDocumentSchema>;

// Payroll Plans Table
export const payrollPlans = pgTable("payroll_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  displayName: varchar("display_name").notNull(),
  description: text("description"),
  monthlyPrice: integer("monthly_price").notNull(), // in cents
  yearlyPrice: integer("yearly_price"), // in cents (optional)
  employeeLimit: integer("employee_limit").default(1),
  additionalEmployeeCost: integer("additional_employee_cost").notNull().default(1500), // $15/month in cents
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  isMostPopular: boolean("is_most_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertPayrollPlanSchema = createInsertSchema(payrollPlans);
export type PayrollPlan = typeof payrollPlans.$inferSelect;
export type InsertPayrollPlan = z.infer<typeof insertPayrollPlanSchema>;

// Registered Agent Plans types and validation
export const insertRegisteredAgentPlanSchema = createInsertSchema(registeredAgentPlans, {
  yearlyPrice: z.string().min(1, "Yearly price is required"),
  expeditedPrice: z.string().optional(),
  name: z.string().min(1, "Plan name is required"),
  states: z.array(z.string()).min(1, "Select at least one state or use 'Select All 50 States'"),
  features: z.array(z.string()).min(1, "At least one feature is required")
});

export type RegisteredAgentPlan = typeof registeredAgentPlans.$inferSelect;
export type InsertRegisteredAgentPlan = z.infer<typeof insertRegisteredAgentPlanSchema>;

// Document schemas and types
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Type-safe error handling utility
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  return String(error);
}

// Business Health Radar Zod schemas and types
export const insertBusinessHealthMetricsSchema = createInsertSchema(businessHealthMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBusinessHealthInsightsSchema = createInsertSchema(businessHealthInsights).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBusinessHealthTrendsSchema = createInsertSchema(businessHealthTrends).omit({
  id: true,
  createdAt: true
});

// Business Health Radar Types
export type BusinessHealthMetrics = typeof businessHealthMetrics.$inferSelect;
export type InsertBusinessHealthMetrics = z.infer<typeof insertBusinessHealthMetricsSchema>;

export type BusinessHealthInsights = typeof businessHealthInsights.$inferSelect;
export type InsertBusinessHealthInsights = z.infer<typeof insertBusinessHealthInsightsSchema>;

export type BusinessHealthTrends = typeof businessHealthTrends.$inferSelect;
export type InsertBusinessHealthTrends = z.infer<typeof insertBusinessHealthTrendsSchema>;

// Safe type conversion utilities
export function toStringId(id: number | string | null | undefined): string {
  if (id === null || id === undefined) {
    throw new Error('ID cannot be null or undefined');
  }
  return String(id);
}

export function toNumberId(id: string | number | null | undefined): number {
  if (id === null || id === undefined) {
    throw new Error('ID cannot be null or undefined');
  }
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numId)) {
    throw new Error(`Invalid ID: ${id}`);
  }
  return numId;
}
