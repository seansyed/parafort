import { db } from "./db";
import { 
  businessEntities, 
  annualReports, 
  stateFilingRequirements, 
  annualReportReminders,
  annualReportTemplates,
  complianceCalendar,
  type BusinessEntity,
  type AnnualReport,
  type InsertAnnualReport,
  type StateFilingRequirement,
  type InsertStateFilingRequirement,
  type AnnualReportReminder,
  type InsertAnnualReportReminder,
  type InsertComplianceCalendar
} from "@shared/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { documentGenerator } from "./documentGenerator";
import crypto from "crypto";

// Interfaces for Annual Report Filing
export interface AnnualReportStatus {
  businessEntityId: number;
  state: string;
  entityType: string;
  currentYear: number;
  filingStatus: "not_due" | "due_soon" | "overdue" | "filed" | "exempt";
  dueDate: Date;
  daysUntilDue: number;
  reportName: string;
  filingFee: number;
  gracePeriodDays: number;
  penalties?: {
    lateFeeAmount: number;
    dissolutionThreatDays: number;
  };
}

export interface FormFieldMapping {
  internalField: string;
  formField: string;
  fieldType: "text" | "date" | "number" | "address" | "json";
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
  };
}

export interface GeneratedForm {
  formData: Record<string, any>;
  formDocument: Buffer;
  formPath: string;
  submissionInstructions: {
    method: "online" | "mail" | "in_person";
    address?: string;
    url?: string;
    deadlines: string[];
    requiredDocuments: string[];
  };
}

export interface ReminderSchedule {
  advance90Days: Date;
  advance30Days: Date;
  advance7Days: Date;
  dueDateReminder: Date;
  overdueReminder: Date;
}

export class AnnualReportService {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
  }

  // Core Annual Report Management
  async getAnnualReportStatus(businessEntityId: number): Promise<AnnualReportStatus> {
    const entity = await db.select().from(businessEntities).where(eq(businessEntities.id, businessEntityId)).limit(1);
    if (!entity[0]) {
      throw new Error("Business entity not found");
    }

    const requirements = await this.getStateFilingRequirements(entity[0].state, entity[0].entityType);
    if (!requirements) {
      throw new Error(`Filing requirements not found for ${entity[0].state} ${entity[0].entityType}`);
    }

    const currentYear = new Date().getFullYear();
    const dueDate = this.calculateDueDate(entity[0], requirements, currentYear);
    const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    // Check if already filed for current year
    const existingReport = await db.select()
      .from(annualReports)
      .where(and(
        eq(annualReports.businessEntityId, businessEntityId),
        eq(annualReports.filingYear, currentYear),
        eq(annualReports.filingStatus, "submitted")
      ))
      .limit(1);

    let filingStatus: AnnualReportStatus["filingStatus"] = "not_due";
    if (existingReport[0]) {
      filingStatus = "filed";
    } else if (daysUntilDue < 0) {
      filingStatus = "overdue";
    } else if (daysUntilDue <= 30) {
      filingStatus = "due_soon";
    }

    return {
      businessEntityId,
      state: entity[0].state,
      entityType: entity[0].entityType,
      currentYear,
      filingStatus,
      dueDate,
      daysUntilDue,
      reportName: requirements.reportName,
      filingFee: requirements.filingFeeAmount || 0,
      gracePeriodDays: requirements.gracePeriodDays || 0,
      penalties: requirements.lateFeeAmount ? {
        lateFeeAmount: requirements.lateFeeAmount,
        dissolutionThreatDays: requirements.dissolutionThreatDays || 90
      } : undefined
    };
  }

  async createAnnualReport(businessEntityId: number, filingYear: number): Promise<AnnualReport> {
    const entity = await db.select().from(businessEntities).where(eq(businessEntities.id, businessEntityId)).limit(1);
    if (!entity[0]) {
      throw new Error("Business entity not found");
    }

    const requirements = await this.getStateFilingRequirements(entity[0].state, entity[0].entityType);
    if (!requirements) {
      throw new Error(`Filing requirements not found for ${entity[0].state} ${entity[0].entityType}`);
    }

    const dueDate = this.calculateDueDate(entity[0], requirements, filingYear);

    // Pre-populate with current business information
    const reportData: InsertAnnualReport = {
      businessEntityId,
      filingYear,
      reportType: requirements.filingFrequency === "annual" ? "annual" : requirements.filingFrequency,
      state: entity[0].state,
      dueDate,
      legalName: entity[0].legalName,
      principalOfficeAddress: entity[0].principalOfficeAddress || "",
      mailingAddress: entity[0].mailingAddress,
      businessPurpose: entity[0].businessPurpose,
      ein: entity[0].ein,
      registeredAgentName: entity[0].registeredAgent || "",
      registeredAgentAddress: entity[0].registeredAgentAddress || "",
      managementStructure: entity[0].managementStructure || {},
      authorizedSignatories: entity[0].authorizedSignatories || {},
      filingFee: requirements.filingFeeAmount,
      stateSpecificData: {}
    };

    const [report] = await db.insert(annualReports).values(reportData).returning();

    // Schedule automatic reminders
    await this.scheduleReminders(report);

    // Add to compliance calendar
    await this.addToComplianceCalendar(report);

    return report;
  }

  async updateAnnualReport(reportId: number, updates: Partial<InsertAnnualReport>): Promise<AnnualReport> {
    const [updatedReport] = await db
      .update(annualReports)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(annualReports.id, reportId))
      .returning();

    if (!updatedReport) {
      throw new Error("Annual report not found");
    }

    return updatedReport;
  }

  // State Filing Requirements Management
  async getStateFilingRequirements(state: string, entityType: string): Promise<StateFilingRequirement | null> {
    const [requirements] = await db.select()
      .from(stateFilingRequirements)
      .where(and(
        eq(stateFilingRequirements.state, state),
        eq(stateFilingRequirements.entityType, entityType),
        eq(stateFilingRequirements.isActive, true)
      ))
      .limit(1);

    return requirements || null;
  }

  async initializeStateRequirements(): Promise<void> {
    // Initialize common state filing requirements with realistic data
    const commonRequirements: InsertStateFilingRequirement[] = [
      // Delaware - LLC
      {
        state: "DE",
        entityType: "LLC",
        filingFrequency: "annual",
        reportName: "Annual Report",
        dueDateType: "fixed_date",
        fixedDueDate: "06-01", // June 1st
        gracePeriodDays: 30,
        requiredFields: [
          "legalName", "principalOfficeAddress", "registeredAgentName", 
          "registeredAgentAddress", "managementStructure", "ein"
        ],
        optionalFields: ["mailingAddress", "businessPurpose"],
        stateSpecificFields: ["totalAssets", "grossRevenue"],
        filingFeeAmount: 30000, // $300
        onlineFilingAvailable: true,
        filingMethods: ["online", "mail"],
        formTemplateUrl: "https://corp.delaware.gov/forms/",
        instructionsUrl: "https://corp.delaware.gov/howtoforms/",
        filingAddress: "Division of Corporations, 401 Federal Street, Dover, DE 19901",
        lateFeeAmount: 20000, // $200
        lateFeeFrequency: "one_time",
        dissolutionThreatDays: 90
      },
      // Delaware - Corporation
      {
        state: "DE",
        entityType: "Corporation",
        filingFrequency: "annual",
        reportName: "Annual Report",
        dueDateType: "fixed_date",
        fixedDueDate: "03-01", // March 1st
        gracePeriodDays: 30,
        requiredFields: [
          "legalName", "principalOfficeAddress", "registeredAgentName",
          "registeredAgentAddress", "managementStructure", "authorizedSignatories", "ein"
        ],
        optionalFields: ["mailingAddress"],
        stateSpecificFields: ["authorizedShares", "issuedShares", "parValue"],
        filingFeeAmount: 17500, // $175
        onlineFilingAvailable: true,
        filingMethods: ["online", "mail"],
        formTemplateUrl: "https://corp.delaware.gov/forms/",
        instructionsUrl: "https://corp.delaware.gov/howtoforms/",
        filingAddress: "Division of Corporations, 401 Federal Street, Dover, DE 19901",
        lateFeeAmount: 20000, // $200
        lateFeeFrequency: "one_time",
        dissolutionThreatDays: 90
      },
      // California - LLC
      {
        state: "CA",
        entityType: "LLC",
        filingFrequency: "biennial",
        reportName: "Statement of Information",
        dueDateType: "formation_based",
        dueDateOffset: 90, // 90 days from formation anniversary
        gracePeriodDays: 90,
        requiredFields: [
          "legalName", "principalOfficeAddress", "registeredAgentName",
          "registeredAgentAddress", "managementStructure", "ein"
        ],
        optionalFields: ["mailingAddress", "businessPurpose"],
        stateSpecificFields: ["chiefExecutiveOfficer", "limitedLiabilityCompanyInterests"],
        filingFeeAmount: 2000, // $20
        onlineFilingAvailable: true,
        filingMethods: ["online", "mail"],
        formTemplateUrl: "https://bizfileonline.sos.ca.gov/",
        instructionsUrl: "https://www.sos.ca.gov/business-programs/business-entities/forms",
        filingAddress: "California Secretary of State, 1500 11th Street, Sacramento, CA 95814",
        lateFeeAmount: 25000, // $250
        lateFeeFrequency: "one_time",
        dissolutionThreatDays: 60
      },
      // New York - LLC
      {
        state: "NY",
        entityType: "LLC",
        filingFrequency: "biennial",
        reportName: "Biennial Statement",
        dueDateType: "formation_based",
        dueDateOffset: 60, // 60 days from formation anniversary
        gracePeriodDays: 30,
        requiredFields: [
          "legalName", "principalOfficeAddress", "registeredAgentName",
          "registeredAgentAddress", "managementStructure"
        ],
        optionalFields: ["mailingAddress", "ein"],
        stateSpecificFields: ["county", "businessClassification"],
        filingFeeAmount: 900, // $9
        onlineFilingAvailable: true,
        filingMethods: ["online", "mail"],
        formTemplateUrl: "https://www.dos.ny.gov/corps/forms.html",
        instructionsUrl: "https://www.dos.ny.gov/corps/llcfaq.html",
        filingAddress: "NYS Division of Corporations, One Commerce Plaza, Albany, NY 12231",
        lateFeeAmount: 5000, // $50
        lateFeeFrequency: "monthly",
        dissolutionThreatDays: 120
      },
      // Texas - LLC
      {
        state: "TX",
        entityType: "LLC",
        filingFrequency: "annual",
        reportName: "Public Information Report",
        dueDateType: "fixed_date",
        fixedDueDate: "05-15", // May 15th
        gracePeriodDays: 30,
        requiredFields: [
          "legalName", "principalOfficeAddress", "registeredAgentName",
          "registeredAgentAddress", "managementStructure"
        ],
        optionalFields: ["mailingAddress", "ein", "businessPurpose"],
        stateSpecificFields: ["federalEmployerIdentificationNumber", "sic"],
        filingFeeAmount: 0, // No fee
        onlineFilingAvailable: true,
        filingMethods: ["online", "mail"],
        formTemplateUrl: "https://www.sos.state.tx.us/corp/forms/index.shtml",
        instructionsUrl: "https://www.sos.state.tx.us/corp/publicinfo.shtml",
        filingAddress: "Texas Secretary of State, 1019 Brazos, Austin, TX 78701",
        lateFeeAmount: 5000, // $50
        lateFeeFrequency: "one_time",
        dissolutionThreatDays: 120
      }
    ];

    // Insert requirements if they don't exist
    for (const requirement of commonRequirements) {
      const existing = await this.getStateFilingRequirements(requirement.state, requirement.entityType);
      if (!existing) {
        await db.insert(stateFilingRequirements).values(requirement);
      }
    }
  }

  // Dynamic Form Generation
  async generateAnnualReportForm(reportId: number): Promise<GeneratedForm> {
    const report = await db.select().from(annualReports).where(eq(annualReports.id, reportId)).limit(1);
    if (!report[0]) {
      throw new Error("Annual report not found");
    }

    const requirements = await this.getStateFilingRequirements(report[0].state, report[0].reportType);
    if (!requirements) {
      throw new Error("Filing requirements not found");
    }

    // Get form template
    const template = await this.getFormTemplate(report[0].state, report[0].reportType);
    
    // Map business data to form fields
    const formData = await this.mapBusinessDataToForm(report[0], requirements, template);

    // Generate form document
    const formDocument = await this.generateFormDocument(formData, template);

    // Create submission instructions
    const submissionInstructions = {
      method: requirements.onlineFilingAvailable ? "online" as const : "mail" as const,
      address: requirements.filingAddress,
      url: requirements.formTemplateUrl,
      deadlines: [
        `Due Date: ${report[0].dueDate.toLocaleDateString()}`,
        `Grace Period: ${requirements.gracePeriodDays} days`,
        requirements.lateFeeAmount ? `Late Fee: $${(requirements.lateFeeAmount / 100).toFixed(2)} after grace period` : ""
      ].filter(Boolean),
      requiredDocuments: [
        "Completed Annual Report Form",
        requirements.filingFeeAmount ? `Filing Fee: $${(requirements.filingFeeAmount / 100).toFixed(2)}` : "",
        "Certificate of Good Standing (if requested)"
      ].filter(Boolean)
    };

    const formPath = `/forms/annual-report-${reportId}-${Date.now()}.pdf`;

    // Update report with generated form path
    await this.updateAnnualReport(reportId, {
      generatedFormPath: formPath,
      formData
    });

    return {
      formData,
      formDocument,
      formPath,
      submissionInstructions
    };
  }

  // Reminder System
  async scheduleReminders(report: AnnualReport): Promise<void> {
    const schedule = this.calculateReminderSchedule(report.dueDate);
    
    const reminders: InsertAnnualReportReminder[] = [
      {
        businessEntityId: report.businessEntityId,
        annualReportId: report.id,
        reminderType: "advance_notice",
        reminderDate: schedule.advance90Days,
        dueDate: report.dueDate,
        title: "Annual Report Due in 90 Days",
        message: `Your ${report.state} ${report.reportType} report for ${report.legalName} is due in 90 days (${report.dueDate.toLocaleDateString()}). Start preparing your filing now to avoid last-minute issues.`,
        actionUrl: `/entity/${report.businessEntityId}/annual-report/${report.id}`,
        deliveryMethod: "email"
      },
      {
        businessEntityId: report.businessEntityId,
        annualReportId: report.id,
        reminderType: "due_soon",
        reminderDate: schedule.advance30Days,
        dueDate: report.dueDate,
        title: "Annual Report Due in 30 Days",
        message: `Your ${report.state} ${report.reportType} report for ${report.legalName} is due in 30 days (${report.dueDate.toLocaleDateString()}). Please complete your filing soon.`,
        actionUrl: `/entity/${report.businessEntityId}/annual-report/${report.id}`,
        deliveryMethod: "email"
      },
      {
        businessEntityId: report.businessEntityId,
        annualReportId: report.id,
        reminderType: "due_soon",
        reminderDate: schedule.advance7Days,
        dueDate: report.dueDate,
        title: "Annual Report Due in 7 Days - Urgent",
        message: `Your ${report.state} ${report.reportType} report for ${report.legalName} is due in 7 days (${report.dueDate.toLocaleDateString()}). This is urgent - please file immediately.`,
        actionUrl: `/entity/${report.businessEntityId}/annual-report/${report.id}`,
        deliveryMethod: "email"
      },
      {
        businessEntityId: report.businessEntityId,
        annualReportId: report.id,
        reminderType: "overdue",
        reminderDate: schedule.overdueReminder,
        dueDate: report.dueDate,
        title: "Annual Report OVERDUE - Action Required",
        message: `Your ${report.state} ${report.reportType} report for ${report.legalName} is now overdue. Late fees may apply. File immediately to avoid dissolution proceedings.`,
        actionUrl: `/entity/${report.businessEntityId}/annual-report/${report.id}`,
        deliveryMethod: "email"
      }
    ];

    await db.insert(annualReportReminders).values(reminders);
  }

  async getPendingReminders(): Promise<AnnualReportReminder[]> {
    const now = new Date();
    return await db.select()
      .from(annualReportReminders)
      .where(and(
        lte(annualReportReminders.reminderDate, now),
        eq(annualReportReminders.status, "pending")
      ))
      .orderBy(asc(annualReportReminders.reminderDate));
  }

  // Compliance Dashboard
  async getComplianceDashboard(userId: string): Promise<{
    upcomingDeadlines: AnnualReportStatus[];
    overdueReports: AnnualReportStatus[];
    recentFilings: AnnualReport[];
    totalEntities: number;
    complianceScore: number;
  }> {
    // Get user's business entities
    const entities = await db.select().from(businessEntities).where(eq(businessEntities.userId, userId));

    const upcomingDeadlines: AnnualReportStatus[] = [];
    const overdueReports: AnnualReportStatus[] = [];

    for (const entity of entities) {
      const status = await this.getAnnualReportStatus(entity.id);
      if (status.filingStatus === "due_soon") {
        upcomingDeadlines.push(status);
      } else if (status.filingStatus === "overdue") {
        overdueReports.push(status);
      }
    }

    // Get recent filings
    const recentFilings = await db.select()
      .from(annualReports)
      .where(eq(annualReports.filingStatus, "submitted"))
      .orderBy(desc(annualReports.submissionDate))
      .limit(10);

    // Calculate compliance score
    const totalReports = upcomingDeadlines.length + overdueReports.length + recentFilings.length;
    const compliantReports = recentFilings.length + upcomingDeadlines.length;
    const complianceScore = totalReports > 0 ? Math.round((compliantReports / totalReports) * 100) : 100;

    return {
      upcomingDeadlines: upcomingDeadlines.sort((a, b) => a.daysUntilDue - b.daysUntilDue),
      overdueReports: overdueReports.sort((a, b) => b.daysUntilDue - a.daysUntilDue),
      recentFilings,
      totalEntities: entities.length,
      complianceScore
    };
  }

  // Private Helper Methods
  private calculateDueDate(entity: BusinessEntity, requirements: StateFilingRequirement, filingYear: number): Date {
    const currentDate = new Date();
    
    if (requirements.dueDateType === "fixed_date" && requirements.fixedDueDate) {
      const [month, day] = requirements.fixedDueDate.split("-").map(Number);
      const dueDate = new Date(filingYear, month - 1, day);
      
      // If the date has passed this year, move to next year
      if (dueDate < currentDate && filingYear === currentDate.getFullYear()) {
        dueDate.setFullYear(filingYear + 1);
      }
      
      return dueDate;
    } else if (requirements.dueDateType === "formation_based" && entity.dateOfFormation) {
      const formationDate = new Date(entity.dateOfFormation);
      const anniversaryDate = new Date(filingYear, formationDate.getMonth(), formationDate.getDate());
      
      if (requirements.dueDateOffset) {
        anniversaryDate.setDate(anniversaryDate.getDate() + requirements.dueDateOffset);
      }
      
      return anniversaryDate;
    }

    // Default fallback
    return new Date(filingYear, 11, 31); // December 31st
  }

  private calculateReminderSchedule(dueDate: Date): ReminderSchedule {
    const advance90Days = new Date(dueDate);
    advance90Days.setDate(advance90Days.getDate() - 90);

    const advance30Days = new Date(dueDate);
    advance30Days.setDate(advance30Days.getDate() - 30);

    const advance7Days = new Date(dueDate);
    advance7Days.setDate(advance7Days.getDate() - 7);

    const dueDateReminder = new Date(dueDate);

    const overdueReminder = new Date(dueDate);
    overdueReminder.setDate(overdueReminder.getDate() + 1);

    return {
      advance90Days,
      advance30Days,
      advance7Days,
      dueDateReminder,
      overdueReminder
    };
  }

  private async getFormTemplate(state: string, entityType: string): Promise<any> {
    // Simplified template structure - in production, this would load from database
    return {
      templateId: `${state}-${entityType}-annual-report`,
      fields: [
        { name: "legalName", label: "Legal Name", required: true, type: "text" },
        { name: "principalOfficeAddress", label: "Principal Office Address", required: true, type: "address" },
        { name: "registeredAgentName", label: "Registered Agent Name", required: true, type: "text" },
        { name: "registeredAgentAddress", label: "Registered Agent Address", required: true, type: "address" },
        { name: "ein", label: "EIN", required: false, type: "text" },
        { name: "managementStructure", label: "Management Structure", required: true, type: "json" }
      ]
    };
  }

  private async mapBusinessDataToForm(report: AnnualReport, requirements: StateFilingRequirement, template: any): Promise<Record<string, any>> {
    const formData: Record<string, any> = {};

    // Map required fields
    for (const field of requirements.requiredFields as string[]) {
      if (field in report) {
        formData[field] = (report as any)[field];
      }
    }

    // Map optional fields
    for (const field of (requirements.optionalFields as string[]) || []) {
      if (field in report && (report as any)[field]) {
        formData[field] = (report as any)[field];
      }
    }

    // Handle state-specific fields with defaults
    for (const field of (requirements.stateSpecificFields as string[]) || []) {
      if (report.stateSpecificData && field in report.stateSpecificData) {
        formData[field] = report.stateSpecificData[field];
      }
    }

    return formData;
  }

  private async generateFormDocument(formData: Record<string, any>, template: any): Promise<Buffer> {
    // Use the existing document generator to create a PDF form
    // This is a simplified implementation - in production, this would use proper form templates
    const mockEntity = {
      legalName: formData.legalName || "Unknown Entity",
      entityType: "LLC",
      state: "DE"
    } as BusinessEntity;

    return await documentGenerator.generateOperatingAgreement(mockEntity, "pdf");
  }

  private async addToComplianceCalendar(report: AnnualReport): Promise<void> {
    const calendarItem: InsertComplianceCalendar = {
      businessEntityId: report.businessEntityId,
      complianceType: "annual_report",
      title: `${report.reportType} Report Due - ${report.state}`,
      description: `Annual report filing due for ${report.legalName} in ${report.state}`,
      dueDate: report.dueDate,
      priority: "high",
      status: "upcoming",
      reminderDays: [90, 30, 7, 0],
      category: "state_compliance"
    };

    await db.insert(complianceCalendar).values(calendarItem);
  }

  // Public utility methods
  getAnnualReportGuidance(): {
    overview: string;
    benefits: string[];
    requirements: string[];
    timeline: string[];
    penalties: string[];
  } {
    return {
      overview: "Annual reports are state-mandated filings that keep your business in good standing. These reports update the state with current information about your business, including address changes, management updates, and operational status.",
      benefits: [
        "Maintains business good standing status",
        "Prevents administrative dissolution",
        "Updates public records with current information",
        "Required for certain business transactions",
        "Demonstrates compliance to partners and lenders"
      ],
      requirements: [
        "Current legal business name",
        "Principal office address",
        "Registered agent information",
        "Management/officer information",
        "State-specific additional data",
        "Required filing fees (varies by state)"
      ],
      timeline: [
        "90 days before due date: Begin preparation",
        "30 days before due date: Complete form review",
        "7 days before due date: Submit filing",
        "Due date: Final deadline",
        "Grace period: Varies by state (typically 30-90 days)",
        "After grace period: Late fees and penalties apply"
      ],
      penalties: [
        "Late filing fees (typically $50-$250)",
        "Monthly penalties in some states",
        "Loss of good standing status",
        "Administrative dissolution proceedings",
        "Inability to conduct business legally",
        "Additional costs for reinstatement"
      ]
    };
  }
}

export const annualReportService = new AnnualReportService();