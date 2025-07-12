import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  nameChangeRequests,
  nameChangeDocuments,
  nameChangeWorkflowTasks,
  businessLicenses,
  nameChangeTemplates,
  businessEntities,
  complianceCalendar,
  type NameChangeRequest,
  type InsertNameChangeRequest,
  type NameChangeDocument,
  type InsertNameChangeDocument,
  type NameChangeWorkflowTask,
  type InsertNameChangeWorkflowTask,
  type BusinessLicense,
  type InsertBusinessLicense,
  type NameChangeTemplate,
  type BusinessEntity,
  type InsertComplianceCalendar,
} from "@shared/schema";
import { businessVerificationService } from "./businessVerificationService";
import { documentGenerator } from "./documentGenerator";
import crypto from "crypto";

export interface NameChangeWorkflowStatus {
  requestId: number;
  businessEntityId: number;
  currentLegalName: string;
  newDesiredName: string;
  status: string;
  progressStep: string;
  completionPercentage: number;
  nextAction: string;
  estimatedCompletion: string;
  criticalDeadlines: {
    type: string;
    description: string;
    dueDate: Date;
    daysRemaining: number;
  }[];
}

export interface WorkflowTaskSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  criticalTasks: number;
  nextTask: NameChangeWorkflowTask | null;
}

export interface NameAvailabilityResult {
  isAvailable: boolean;
  conflictingEntities: string[];
  suggestedAlternatives: string[];
  reservationOptions: {
    available: boolean;
    fee: number;
    duration: string;
  };
  filingRequirements: {
    state: string;
    amendmentRequired: boolean;
    estimatedFee: number;
    processingTime: string;
  };
}

export interface ResolutionTemplate {
  entityType: string;
  templateContent: string;
  requiredSignatures: string[];
  votingRequirements: {
    percentage: number;
    type: string; // majority, supermajority, unanimous
  };
}

export interface LicenseUpdatePlan {
  totalLicenses: number;
  requireUpdate: number;
  estimatedCost: number;
  estimatedTimeframe: string;
  criticalLicenses: {
    licenseName: string;
    issuingAuthority: string;
    updateDeadline: Date;
    penalties: string;
  }[];
}

export interface ComplianceChecklist {
  internalApproval: {
    required: boolean;
    completed: boolean;
    documents: string[];
  };
  nameAvailability: {
    required: boolean;
    completed: boolean;
    results: any;
  };
  stateFiling: {
    required: boolean;
    completed: boolean;
    fee: number;
    estimatedProcessing: string;
  };
  irsNotification: {
    required: boolean;
    completed: boolean;
    newEinRequired: boolean;
  };
  licenseUpdates: {
    required: boolean;
    completed: boolean;
    affectedLicenses: number;
  };
}

export class NameChangeService {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || "default-key-change-in-production";
  }

  async initializeNameChange(businessEntityId: number, currentBusinessName: string, newDesiredName: string, reasonForChange?: string): Promise<NameChangeRequest> {
    // Get business entity information
    const [entity] = await db.select().from(businessEntities).where(eq(businessEntities.id, businessEntityId));
    
    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Verify the provided current business name matches the entity
    if (currentBusinessName !== entity.name) {
      throw new Error("Current business name does not match our records");
    }

    // Create name change request
    const requestData: InsertNameChangeRequest = {
      businessEntityId,
      currentLegalName: currentBusinessName,
      newDesiredName,
      reasonForChange,
      status: "draft",
      progressStep: "internal_approval",
    };

    const [request] = await db
      .insert(nameChangeRequests)
      .values(requestData)
      .returning();

    // Initialize workflow tasks
    await this.createWorkflowTasks(request.id, entity);

    // Add to compliance calendar
    await this.addToComplianceCalendar(request);

    return request;
  }

  async getNameChangeStatus(requestId: number): Promise<NameChangeWorkflowStatus> {
    const [request] = await db
      .select()
      .from(nameChangeRequests)
      .where(eq(nameChangeRequests.id, requestId));

    if (!request) {
      throw new Error("Name change request not found");
    }

    const tasks = await db
      .select()
      .from(nameChangeWorkflowTasks)
      .where(eq(nameChangeWorkflowTasks.nameChangeRequestId, requestId))
      .orderBy(nameChangeWorkflowTasks.taskOrder);

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionPercentage = Math.round((completedTasks / tasks.length) * 100);

    const nextTask = tasks.find(t => t.status === 'pending');
    const nextAction = nextTask ? nextTask.taskTitle : "Awaiting completion";

    // Calculate estimated completion based on remaining tasks
    const remainingTasks = tasks.filter(t => t.status !== 'completed');
    const totalEstimatedHours = remainingTasks.reduce((sum, task) => sum + (task.estimatedDuration || 24), 0);
    const estimatedCompletion = new Date(Date.now() + totalEstimatedHours * 60 * 60 * 1000).toLocaleDateString();

    // Identify critical deadlines
    const criticalDeadlines = tasks
      .filter(t => t.dueDate && t.status !== 'completed')
      .map(t => ({
        type: t.taskType,
        description: t.taskTitle,
        dueDate: new Date(t.dueDate!),
        daysRemaining: Math.ceil((new Date(t.dueDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      }))
      .filter(d => d.daysRemaining <= 30);

    return {
      requestId: request.id,
      businessEntityId: request.businessEntityId,
      currentLegalName: request.currentLegalName,
      newDesiredName: request.newDesiredName,
      status: request.status,
      progressStep: request.progressStep,
      completionPercentage,
      nextAction,
      estimatedCompletion,
      criticalDeadlines,
    };
  }

  async generateResolutionDocument(requestId: number): Promise<NameChangeDocument> {
    const [request] = await db
      .select()
      .from(nameChangeRequests)
      .where(eq(nameChangeRequests.id, requestId));

    if (!request) {
      throw new Error("Name change request not found");
    }

    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, request.businessEntityId));

    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Get appropriate template
    const [template] = await db
      .select()
      .from(nameChangeTemplates)
      .where(
        and(
          eq(nameChangeTemplates.templateType, entity.entityType === 'LLC' ? 'resolution_llc' : 'resolution_corp'),
          eq(nameChangeTemplates.entityType, entity.entityType),
          eq(nameChangeTemplates.isActive, true)
        )
      );

    if (!template) {
      throw new Error("Resolution template not found for entity type");
    }

    // Generate document content
    const documentContent = this.processTemplate(template.templateContent, {
      entityName: entity.legalName,
      newEntityName: request.newDesiredName,
      entityType: entity.entityType,
      state: entity.state,
      formationDate: entity.formationDate,
      reason: request.reasonForChange || "Business needs",
      date: new Date().toLocaleDateString(),
    });

    // Generate PDF document
    const documentBuffer = await this.generatePdfDocument(documentContent, "resolution");
    const documentPath = `name-change/${requestId}/resolution-${Date.now()}.pdf`;

    // Save document record
    const documentData: InsertNameChangeDocument = {
      nameChangeRequestId: requestId,
      documentType: "resolution",
      documentName: `Resolution for Name Change - ${entity.legalName}`,
      documentPath,
      documentFormat: "pdf",
      templateUsed: template.templateName,
      generatedContent: documentContent,
      customizationData: { entityId: entity.id },
      status: "generated",
    };

    const [document] = await db
      .insert(nameChangeDocuments)
      .values(documentData)
      .returning();

    // Update request status
    await db
      .update(nameChangeRequests)
      .set({
        resolutionGenerated: true,
        progressStep: "name_availability",
        updatedAt: new Date(),
      })
      .where(eq(nameChangeRequests.id, requestId));

    // Update workflow task
    await this.completeWorkflowTask(requestId, "internal_approval", {
      documentGenerated: true,
      documentPath,
    });

    return document;
  }

  async checkNameAvailability(requestId: number): Promise<NameAvailabilityResult> {
    const [request] = await db
      .select()
      .from(nameChangeRequests)
      .where(eq(nameChangeRequests.id, requestId));

    if (!request) {
      throw new Error("Name change request not found");
    }

    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, request.businessEntityId));

    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Check name availability with state
    const verificationResult = await businessVerificationService.verifyBusinessName(
      request.newDesiredName,
      entity.state,
      entity.entityType
    );

    const availabilityResult: NameAvailabilityResult = {
      isAvailable: verificationResult.nameAvailable,
      conflictingEntities: verificationResult.complianceIssues,
      suggestedAlternatives: verificationResult.suggestedNames || [],
      reservationOptions: {
        available: true,
        fee: 2500, // $25.00 in cents
        duration: "120 days",
      },
      filingRequirements: {
        state: entity.state,
        amendmentRequired: true,
        estimatedFee: this.getStateFee(entity.state, entity.entityType),
        processingTime: this.getProcessingTime(entity.state),
      },
    };

    // Update request with availability results
    await db
      .update(nameChangeRequests)
      .set({
        nameAvailabilityChecked: true,
        nameAvailable: verificationResult.nameAvailable,
        availabilityCheckDate: new Date(),
        availabilityResults: availabilityResult,
        progressStep: verificationResult.nameAvailable ? "state_filing" : "name_availability",
        updatedAt: new Date(),
      })
      .where(eq(nameChangeRequests.id, requestId));

    if (verificationResult.nameAvailable) {
      await this.completeWorkflowTask(requestId, "name_check", {
        nameAvailable: true,
        availabilityResults: availabilityResult,
      });
    }

    return availabilityResult;
  }

  async generateStateAmendment(requestId: number): Promise<NameChangeDocument> {
    const [request] = await db
      .select()
      .from(nameChangeRequests)
      .where(eq(nameChangeRequests.id, requestId));

    if (!request) {
      throw new Error("Name change request not found");
    }

    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, request.businessEntityId));

    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Get state amendment template
    const [template] = await db
      .select()
      .from(nameChangeTemplates)
      .where(
        and(
          eq(nameChangeTemplates.templateType, "state_amendment"),
          eq(nameChangeTemplates.state, entity.state),
          eq(nameChangeTemplates.entityType, entity.entityType),
          eq(nameChangeTemplates.isActive, true)
        )
      );

    if (!template) {
      throw new Error("State amendment template not found");
    }

    // Generate amendment document
    const documentContent = this.processTemplate(template.templateContent, {
      entityName: entity.legalName,
      newEntityName: request.newDesiredName,
      entityId: entity.entityNumber,
      filingNumber: entity.entityNumber,
      registeredAgent: entity.registeredAgentName,
      registeredAgentAddress: entity.registeredAgentAddress,
      principalAddress: entity.principalAddress,
      effectiveDate: new Date().toLocaleDateString(),
      state: entity.state,
    });

    const documentBuffer = await this.generatePdfDocument(documentContent, "amendment");
    const documentPath = `name-change/${requestId}/amendment-${Date.now()}.pdf`;

    const documentData: InsertNameChangeDocument = {
      nameChangeRequestId: requestId,
      documentType: "state_amendment",
      documentName: `Articles of Amendment - ${entity.legalName}`,
      documentPath,
      documentFormat: "pdf",
      templateUsed: template.templateName,
      generatedContent: documentContent,
      customizationData: { entityId: entity.id, state: entity.state },
      status: "generated",
    };

    const [document] = await db
      .insert(nameChangeDocuments)
      .values(documentData)
      .returning();

    // Update request
    await db
      .update(nameChangeRequests)
      .set({
        filingDocumentPath: documentPath,
        progressStep: "irs_notification",
        updatedAt: new Date(),
      })
      .where(eq(nameChangeRequests.id, requestId));

    return document;
  }

  async generateIrsNotification(requestId: number): Promise<NameChangeDocument> {
    const [request] = await db
      .select()
      .from(nameChangeRequests)
      .where(eq(nameChangeRequests.id, requestId));

    if (!request) {
      throw new Error("Name change request not found");
    }

    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, request.businessEntityId));

    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Get IRS notification template
    const [template] = await db
      .select()
      .from(nameChangeTemplates)
      .where(
        and(
          eq(nameChangeTemplates.templateType, "irs_notification"),
          eq(nameChangeTemplates.entityType, entity.entityType),
          eq(nameChangeTemplates.isActive, true)
        )
      );

    if (!template) {
      throw new Error("IRS notification template not found");
    }

    // Determine if new EIN is required
    const newEinRequired = this.determineNewEinRequirement(entity, request);

    const documentContent = this.processTemplate(template.templateContent, {
      entityName: entity.legalName,
      newEntityName: request.newDesiredName,
      ein: entity.ein || "Pending",
      entityType: entity.entityType,
      state: entity.state,
      effectiveDate: new Date().toLocaleDateString(),
      newEinRequired: newEinRequired ? "Yes" : "No",
      taxYearEnd: "December 31",
    });

    const documentBuffer = await this.generatePdfDocument(documentContent, "irs-notification");
    const documentPath = `name-change/${requestId}/irs-notification-${Date.now()}.pdf`;

    const documentData: InsertNameChangeDocument = {
      nameChangeRequestId: requestId,
      documentType: "irs_notification",
      documentName: `IRS Name Change Notification - ${entity.legalName}`,
      documentPath,
      documentFormat: "pdf",
      templateUsed: template.templateName,
      generatedContent: documentContent,
      customizationData: { entityId: entity.id, newEinRequired },
      status: "generated",
    };

    const [document] = await db
      .insert(nameChangeDocuments)
      .values(documentData)
      .returning();

    // Update request
    await db
      .update(nameChangeRequests)
      .set({
        newEinRequired,
        progressStep: "license_updates",
        updatedAt: new Date(),
      })
      .where(eq(nameChangeRequests.id, requestId));

    return document;
  }

  async identifyAffectedLicenses(businessEntityId: number): Promise<BusinessLicense[]> {
    const licenses = await db
      .select()
      .from(businessLicenses)
      .where(eq(businessLicenses.businessEntityId, businessEntityId));

    // Update each license with name change requirements
    for (const license of licenses) {
      const updateRequired = this.determineIfLicenseUpdateRequired(license);
      if (updateRequired) {
        await db
          .update(businessLicenses)
          .set({
            requiresNameUpdate: true,
            lastVerified: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(businessLicenses.id, license.id));
      }
    }

    return licenses.filter(l => l.requiresNameUpdate);
  }

  async createLicenseUpdatePlan(businessEntityId: number): Promise<LicenseUpdatePlan> {
    const affectedLicenses = await this.identifyAffectedLicenses(businessEntityId);
    
    const totalCost = affectedLicenses.reduce((sum, license) => 
      sum + (license.nameUpdateFee || 0), 0
    );

    const criticalLicenses = affectedLicenses
      .filter(license => {
        const urgency = this.calculateLicenseUpdateUrgency(license);
        return urgency === 'critical';
      })
      .map(license => ({
        licenseName: license.licenseName,
        issuingAuthority: license.issuingAuthority,
        updateDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        penalties: "License suspension, business operation restrictions",
      }));

    return {
      totalLicenses: affectedLicenses.length,
      requireUpdate: affectedLicenses.filter(l => l.requiresNameUpdate).length,
      estimatedCost: totalCost,
      estimatedTimeframe: `${Math.ceil(affectedLicenses.length / 2)} to ${affectedLicenses.length * 2} weeks`,
      criticalLicenses,
    };
  }

  async getComplianceChecklist(requestId: number): Promise<ComplianceChecklist> {
    const [request] = await db
      .select()
      .from(nameChangeRequests)
      .where(eq(nameChangeRequests.id, requestId));

    if (!request) {
      throw new Error("Name change request not found");
    }

    const tasks = await db
      .select()
      .from(nameChangeWorkflowTasks)
      .where(eq(nameChangeWorkflowTasks.nameChangeRequestId, requestId));

    const documents = await db
      .select()
      .from(nameChangeDocuments)
      .where(eq(nameChangeDocuments.nameChangeRequestId, requestId));

    const affectedLicenses = await this.identifyAffectedLicenses(request.businessEntityId);

    return {
      internalApproval: {
        required: true,
        completed: request.resolutionApproved,
        documents: documents
          .filter(d => d.documentType === 'resolution')
          .map(d => d.documentName),
      },
      nameAvailability: {
        required: true,
        completed: request.nameAvailabilityChecked,
        results: request.availabilityResults,
      },
      stateFiling: {
        required: request.amendmentFilingRequired,
        completed: request.amendmentFiled,
        fee: request.filingFeeAmount || 0,
        estimatedProcessing: "5-10 business days",
      },
      irsNotification: {
        required: request.irsNotificationRequired,
        completed: request.irsNotified,
        newEinRequired: request.newEinRequired,
      },
      licenseUpdates: {
        required: affectedLicenses.length > 0,
        completed: request.licensesUpdated,
        affectedLicenses: affectedLicenses.length,
      },
    };
  }

  private async createWorkflowTasks(requestId: number, entity: BusinessEntity): Promise<void> {
    const tasks: InsertNameChangeWorkflowTask[] = [
      {
        nameChangeRequestId: requestId,
        taskType: "internal_approval",
        taskTitle: "Generate and Approve Resolution",
        taskDescription: `Generate ${entity.entityType} resolution for name change and obtain required approvals`,
        taskOrder: 1,
        status: "pending",
        estimatedDuration: 24,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        actionRequired: true,
      },
      {
        nameChangeRequestId: requestId,
        taskType: "name_check",
        taskTitle: "Verify Name Availability",
        taskDescription: "Check new name availability with state Secretary of State",
        taskOrder: 2,
        status: "pending",
        dependsOnTasks: [1],
        estimatedDuration: 2,
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        actionRequired: true,
      },
      {
        nameChangeRequestId: requestId,
        taskType: "state_filing",
        taskTitle: "File State Amendment",
        taskDescription: "Prepare and file Articles of Amendment with state",
        taskOrder: 3,
        status: "pending",
        dependsOnTasks: [2],
        estimatedDuration: 8,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        actionRequired: true,
      },
      {
        nameChangeRequestId: requestId,
        taskType: "irs_notification",
        taskTitle: "Notify IRS of Name Change",
        taskDescription: "Submit name change notification to IRS and determine EIN requirements",
        taskOrder: 4,
        status: "pending",
        dependsOnTasks: [3],
        estimatedDuration: 4,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        actionRequired: true,
      },
      {
        nameChangeRequestId: requestId,
        taskType: "license_update",
        taskTitle: "Update Business Licenses",
        taskDescription: "Update all affected business licenses and permits",
        taskOrder: 5,
        status: "pending",
        dependsOnTasks: [4],
        estimatedDuration: 72,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        actionRequired: true,
      },
    ];

    await db.insert(nameChangeWorkflowTasks).values(tasks);
  }

  private async completeWorkflowTask(requestId: number, taskType: string, results: any): Promise<void> {
    await db
      .update(nameChangeWorkflowTasks)
      .set({
        status: "completed",
        completedDate: new Date(),
        taskResults: results,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(nameChangeWorkflowTasks.nameChangeRequestId, requestId),
          eq(nameChangeWorkflowTasks.taskType, taskType)
        )
      );
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let content = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(placeholder, String(value));
    }
    
    return content;
  }

  private async generatePdfDocument(content: string, documentType: string): Promise<Buffer> {
    // This would integrate with a PDF generation service
    // For now, return a simple buffer
    return Buffer.from(content, 'utf-8');
  }

  private getStateFee(state: string, entityType: string): number {
    // State-specific filing fees in cents
    const stateFees: Record<string, Record<string, number>> = {
      'DE': { 'LLC': 20000, 'Corporation': 25000 },
      'CA': { 'LLC': 15000, 'Corporation': 18000 },
      'NY': { 'LLC': 12500, 'Corporation': 15000 },
      'TX': { 'LLC': 7500, 'Corporation': 10000 },
    };
    
    return stateFees[state]?.[entityType] || 15000;
  }

  private getProcessingTime(state: string): string {
    const processingTimes: Record<string, string> = {
      'DE': '5-7 business days',
      'CA': '10-15 business days',
      'NY': '7-10 business days',
      'TX': '5-10 business days',
    };
    
    return processingTimes[state] || '7-14 business days';
  }

  private determineNewEinRequirement(entity: BusinessEntity, request: NameChangeRequest): boolean {
    // IRS guidelines for when a new EIN is required
    // Generally NOT required for simple name changes
    // Required for significant business structure changes
    
    return false; // Most name changes don't require new EIN
  }

  private determineIfLicenseUpdateRequired(license: BusinessLicense): boolean {
    // Determine if license requires name update
    const exemptTypes = ['federal_registration', 'trademark'];
    return !exemptTypes.includes(license.licenseType);
  }

  private calculateLicenseUpdateUrgency(license: BusinessLicense): 'low' | 'medium' | 'critical' {
    const criticalTypes = ['business_license', 'professional_license', 'regulatory_permit'];
    const mediumTypes = ['sales_tax_permit', 'employer_registration'];
    
    if (criticalTypes.includes(license.licenseType)) return 'critical';
    if (mediumTypes.includes(license.licenseType)) return 'medium';
    return 'low';
  }

  private async addToComplianceCalendar(request: NameChangeRequest): Promise<void> {
    const calendarItem: InsertComplianceCalendar = {
      businessEntityId: request.businessEntityId,
      eventType: "name_change",
      eventTitle: "Business Name Change Process",
      eventDescription: `Name change from ${request.currentLegalName} to ${request.newDesiredName}`,
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      category: "compliance",
      status: "pending",
      priority: "high",
      relatedRecordId: request.id,
      relatedRecordType: "name_change_request",
    };

    await db.insert(complianceCalendar).values(calendarItem);
  }

  getNameChangeGuidance(): {
    overview: string;
    requirements: string[];
    timeline: string[];
    considerations: string[];
    costs: string[];
  } {
    return {
      overview: "A business legal name change involves multiple interconnected steps including internal approvals, state filings, IRS notifications, and license updates. This process ensures full legal compliance while minimizing business disruption.",
      requirements: [
        "Internal approval through member/shareholder resolution",
        "Name availability verification with state Secretary of State",
        "Articles of Amendment filing with appropriate state agency",
        "IRS notification of name change (Form 8822-B)",
        "Update of all business licenses and permits",
        "Banking and contract updates",
        "Website and marketing material updates",
      ],
      timeline: [
        "Week 1: Generate and approve internal resolution",
        "Week 2: Verify name availability and reserve if needed",
        "Week 3: Prepare and file state amendment documents",
        "Week 4-5: Process state filing and receive approval",
        "Week 6: Submit IRS notification and update federal registrations",
        "Week 7-12: Update all business licenses and permits",
        "Ongoing: Update contracts, banking, and business materials",
      ],
      considerations: [
        "Existing contracts may need amendment or notification",
        "Banking relationships require formal name change process",
        "Domain names and trademarks should be evaluated",
        "Customer and vendor notifications should be planned",
        "Marketing materials and websites need updating",
        "Insurance policies may require endorsements",
      ],
      costs: [
        "State filing fees: $75 - $250 depending on state and entity type",
        "License update fees: Varies by license type and jurisdiction",
        "Legal document preparation: $500 - $1,500",
        "Banking change fees: $25 - $100 per account",
        "Professional services: $1,000 - $3,000 for full service",
      ],
    };
  }
}

export const nameChangeService = new NameChangeService();