import { db } from "./db";
import { 
  businessDissolutions, 
  dissolutionTasks, 
  dissolutionDocuments, 
  dissolutionChecklists, 
  dissolutionTimeline,
  dissolutionTemplates,
  businessEntities,
  type BusinessDissolution,
  type InsertBusinessDissolution,
  type DissolutionTask,
  type InsertDissolutionTask,
  type DissolutionDocument,
  type InsertDissolutionDocument,
  type DissolutionChecklist,
  type InsertDissolutionChecklist,
  type DissolutionTimeline,
  type InsertDissolutionTimeline,
  type BusinessEntity
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";
import { addDays, addWeeks, addMonths, format } from "date-fns";

export interface DissolutionWorkflowStatus {
  dissolutionId: number;
  businessEntityId: number;
  currentLegalName: string;
  dissolutionType: string;
  dissolutionReason: string;
  status: string;
  currentPhase: string;
  completionPercentage: number;
  nextAction: string;
  estimatedCompletion: string;
  criticalDeadlines: {
    type: string;
    description: string;
    dueDate: string;
    daysRemaining: number;
  }[];
}

export interface DissolutionGuidance {
  overview: string;
  phases: string[];
  requirements: string[];
  timeline: string[];
  considerations: string[];
  costs: string[];
  recordRetention: {
    minimumPeriod: number;
    recommendations: string[];
    digitalStorageOptions: string[];
  };
}

export interface TaskProgress {
  category: string;
  completed: number;
  total: number;
  percentage: number;
  criticalTasks: {
    taskTitle: string;
    dueDate: string;
    status: string;
    priority: string;
  }[];
}

export interface LicenseInventory {
  totalLicenses: number;
  requiresCancellation: number;
  estimatedTime: string;
  criticalLicenses: {
    licenseName: string;
    issuingAuthority: string;
    cancellationDeadline: string;
    penalties: string;
  }[];
  cancellationMethods: {
    online: number;
    mail: number;
    phone: number;
    inPerson: number;
  };
}

export interface TaxObligations {
  finalReturnRequired: boolean;
  form966Required: boolean; // For corporations
  einCancellationRequired: boolean;
  estimatedTaxLiability: number;
  filingDeadlines: {
    type: string;
    description: string;
    dueDate: string;
  }[];
  recommendedActions: string[];
}

export interface GeneratedDissolutionDocument {
  documentData: Record<string, any>;
  documentBuffer: Buffer;
  documentPath: string;
  filingInstructions: {
    method: "online" | "mail" | "in_person";
    agency: string;
    address?: string;
    url?: string;
    fee: number;
    processingTime: string;
    requiredDocuments: string[];
  };
}

export class BusinessDissolutionService {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
  }

  async initiateDissolution(
    businessEntityId: number, 
    dissolutionType: string,
    dissolutionReason?: string,
    effectiveDate?: Date
  ): Promise<BusinessDissolution> {
    const entity = await db.select().from(businessEntities).where(eq(businessEntities.id, businessEntityId)).limit(1);
    if (!entity.length) {
      throw new Error("Business entity not found");
    }

    const businessEntity = entity[0];
    
    const dissolutionData: InsertBusinessDissolution = {
      businessEntityId,
      dissolutionType,
      dissolutionReason,
      effectiveDate: effectiveDate || addDays(new Date(), 30),
      status: "initiated",
      currentPhase: "decision",
      completionPercentage: 5,
      memberApprovalRequired: this.requiresMemberApproval(businessEntity),
      estimatedCompletionDate: this.calculateEstimatedCompletion(businessEntity, dissolutionType),
    };

    const [dissolution] = await db
      .insert(businessDissolutions)
      .values(dissolutionData)
      .returning();

    // Initialize workflow tasks
    await this.initializeWorkflowTasks(dissolution.id, businessEntity);
    
    // Create initial timeline entries
    await this.createInitialTimeline(dissolution.id);
    
    // Initialize license inventory
    await this.initializeLicenseInventory(dissolution.id, businessEntity);

    return dissolution;
  }

  async getDissolutionStatus(dissolutionId: number): Promise<DissolutionWorkflowStatus> {
    const [dissolution] = await db
      .select()
      .from(businessDissolutions)
      .where(eq(businessDissolutions.id, dissolutionId))
      .limit(1);

    if (!dissolution) {
      throw new Error("Dissolution not found");
    }

    const [businessEntity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, dissolution.businessEntityId))
      .limit(1);

    const criticalDeadlines = await this.getCriticalDeadlines(dissolutionId);

    return {
      dissolutionId: dissolution.id,
      businessEntityId: dissolution.businessEntityId,
      currentLegalName: businessEntity.name,
      dissolutionType: dissolution.dissolutionType,
      dissolutionReason: dissolution.dissolutionReason || "",
      status: dissolution.status,
      currentPhase: dissolution.currentPhase,
      completionPercentage: dissolution.completionPercentage || 0,
      nextAction: await this.getNextAction(dissolution),
      estimatedCompletion: dissolution.estimatedCompletionDate ? 
        format(dissolution.estimatedCompletionDate, 'MMM dd, yyyy') : "TBD",
      criticalDeadlines,
    };
  }

  async generateDissolutionResolution(dissolutionId: number): Promise<GeneratedDissolutionDocument> {
    const dissolution = await this.getDissolutionWithEntity(dissolutionId);
    
    const template = await this.getTemplate(
      dissolution.business.entityType,
      dissolution.business.state,
      "resolution"
    );

    const documentData = await this.mapBusinessDataToResolution(dissolution, template);
    const documentBuffer = await this.generateDocumentFromTemplate(documentData, template);
    const documentPath = `dissolution_resolution_${dissolutionId}_${Date.now()}.pdf`;

    // Save document record
    await db.insert(dissolutionDocuments).values({
      dissolutionId,
      documentType: "resolution",
      documentName: "Member/Shareholder Resolution for Dissolution",
      documentCategory: "internal",
      documentPath,
      documentFormat: "pdf",
      requiresFiling: false,
      templateUsed: template.templateName,
      generatedContent: JSON.stringify(documentData),
    });

    // Update task status
    await this.updateTaskStatus(dissolutionId, "member_approval", "completed");
    await this.updateDissolutionProgress(dissolutionId);

    return {
      documentData,
      documentBuffer,
      documentPath,
      filingInstructions: {
        method: "in_person",
        agency: "Internal Use",
        fee: 0,
        processingTime: "Immediate",
        requiredDocuments: ["Original resolution with signatures"],
      },
    };
  }

  async generateArticlesOfDissolution(dissolutionId: number): Promise<GeneratedDissolutionDocument> {
    const dissolution = await this.getDissolutionWithEntity(dissolutionId);
    
    const template = await this.getTemplate(
      dissolution.business.entityType,
      dissolution.business.state,
      "articles_dissolution"
    );

    const documentData = await this.mapBusinessDataToArticles(dissolution, template);
    const documentBuffer = await this.generateDocumentFromTemplate(documentData, template);
    const documentPath = `articles_dissolution_${dissolutionId}_${Date.now()}.pdf`;

    const stateFilingFee = this.getStateFilingFee(dissolution.business.state, dissolution.business.entityType);

    // Save document record
    await db.insert(dissolutionDocuments).values({
      dissolutionId,
      documentType: "articles_dissolution",
      documentName: `Articles of Dissolution - ${dissolution.business.name}`,
      documentCategory: "state",
      documentPath,
      documentFormat: "pdf",
      requiresFiling: true,
      filingAgency: "secretary_of_state",
      filingDeadline: dissolution.effectiveDate,
      templateUsed: template.templateName,
      generatedContent: JSON.stringify(documentData),
    });

    // Update task status
    await this.updateTaskStatus(dissolutionId, "state_filing", "completed");
    await this.updateDissolutionProgress(dissolutionId);

    return {
      documentData,
      documentBuffer,
      documentPath,
      filingInstructions: {
        method: "online",
        agency: `${dissolution.business.state} Secretary of State`,
        url: this.getSecretaryOfStateUrl(dissolution.business.state),
        fee: stateFilingFee,
        processingTime: "5-15 business days",
        requiredDocuments: [
          "Articles of Dissolution",
          "Filing fee payment",
          "Certificate of Good Standing (if required)",
        ],
      },
    };
  }

  async generateFinalTaxDocuments(dissolutionId: number): Promise<GeneratedDissolutionDocument[]> {
    const dissolution = await this.getDissolutionWithEntity(dissolutionId);
    const documents: GeneratedDissolutionDocument[] = [];

    // Generate Form 966 for corporations
    if (dissolution.business.entityType === "Corporation" || dissolution.business.entityType === "S-Corporation") {
      const form966Template = await this.getTemplate("Corporation", "federal", "form_966");
      const form966Data = await this.mapBusinessDataToForm966(dissolution, form966Template);
      const form966Buffer = await this.generateDocumentFromTemplate(form966Data, form966Template);
      const form966Path = `form_966_${dissolutionId}_${Date.now()}.pdf`;

      await db.insert(dissolutionDocuments).values({
        dissolutionId,
        documentType: "form_966",
        documentName: "IRS Form 966 - Corporate Dissolution",
        documentCategory: "federal",
        documentPath: form966Path,
        documentFormat: "pdf",
        requiresFiling: true,
        filingAgency: "irs",
        filingDeadline: addDays(dissolution.effectiveDate!, 30),
        templateUsed: form966Template.templateName,
        generatedContent: JSON.stringify(form966Data),
      });

      documents.push({
        documentData: form966Data,
        documentBuffer: form966Buffer,
        documentPath: form966Path,
        filingInstructions: {
          method: "online",
          agency: "Internal Revenue Service",
          url: "https://www.irs.gov/forms-pubs/about-form-966",
          fee: 0,
          processingTime: "30 days",
          requiredDocuments: ["Form 966", "Copy of dissolution resolution"],
        },
      });
    }

    // Generate final tax return guidance
    const finalReturnTemplate = await this.getTemplate(
      dissolution.business.entityType,
      "federal",
      "final_tax_return_guidance"
    );

    const finalReturnData = await this.mapBusinessDataToFinalReturn(dissolution, finalReturnTemplate);
    const finalReturnBuffer = await this.generateDocumentFromTemplate(finalReturnData, finalReturnTemplate);
    const finalReturnPath = `final_tax_return_guidance_${dissolutionId}_${Date.now()}.pdf`;

    await db.insert(dissolutionDocuments).values({
      dissolutionId,
      documentType: "final_tax_return_guidance",
      documentName: "Final Tax Return Filing Guidance",
      documentCategory: "federal",
      documentPath: finalReturnPath,
      documentFormat: "pdf",
      requiresFiling: false,
      templateUsed: finalReturnTemplate.templateName,
      generatedContent: JSON.stringify(finalReturnData),
    });

    documents.push({
      documentData: finalReturnData,
      documentBuffer: finalReturnBuffer,
      documentPath: finalReturnPath,
      filingInstructions: {
        method: "online",
        agency: "Internal Revenue Service",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/closing-a-business-checklist",
        fee: 0,
        processingTime: "Follow normal tax filing deadlines",
        requiredDocuments: ["Final tax return", "All supporting documentation"],
      },
    });

    // Update task status
    await this.updateTaskStatus(dissolutionId, "final_tax_return", "completed");
    await this.updateDissolutionProgress(dissolutionId);

    return documents;
  }

  async getLicenseInventory(dissolutionId: number): Promise<LicenseInventory> {
    const checklists = await db
      .select()
      .from(dissolutionChecklists)
      .where(and(
        eq(dissolutionChecklists.dissolutionId, dissolutionId),
        eq(dissolutionChecklists.checklistType, "licenses")
      ));

    const totalLicenses = checklists.length;
    const requiresCancellation = checklists.filter(item => item.isRequired).length;
    
    const criticalLicenses = checklists
      .filter(item => item.category === "federal" || item.potentialPenalties)
      .map(item => ({
        licenseName: item.itemName,
        issuingAuthority: item.cancellationAgency || "Unknown",
        cancellationDeadline: "Within 30 days of dissolution",
        penalties: item.potentialPenalties || "Varies by jurisdiction",
      }));

    const cancellationMethods = checklists.reduce((acc, item) => {
      const method = item.cancellationMethod || "mail";
      acc[method as keyof typeof acc] = (acc[method as keyof typeof acc] || 0) + 1;
      return acc;
    }, { online: 0, mail: 0, phone: 0, inPerson: 0 });

    return {
      totalLicenses,
      requiresCancellation,
      estimatedTime: this.calculateLicenseCancellationTime(checklists.length),
      criticalLicenses,
      cancellationMethods,
    };
  }

  async getTaxObligations(dissolutionId: number): Promise<TaxObligations> {
    const dissolution = await this.getDissolutionWithEntity(dissolutionId);
    const isCorporation = dissolution.business.entityType === "Corporation" || 
                         dissolution.business.entityType === "S-Corporation";

    const filingDeadlines = [
      {
        type: "Final Tax Return",
        description: `Final ${this.getTaxFormType(dissolution.business.entityType)} due`,
        dueDate: this.getFinalTaxReturnDeadline(dissolution.business.entityType, dissolution.effectiveDate!),
      },
    ];

    if (isCorporation) {
      filingDeadlines.push({
        type: "Form 966",
        description: "Corporate Dissolution Statement",
        dueDate: format(addDays(dissolution.effectiveDate!, 30), 'MMM dd, yyyy'),
      });
    }

    filingDeadlines.push({
      type: "EIN Cancellation",
      description: "Cancel Employer Identification Number",
      dueDate: "After final obligations completed",
    });

    return {
      finalReturnRequired: true,
      form966Required: isCorporation,
      einCancellationRequired: true,
      estimatedTaxLiability: 0, // Would integrate with tax calculation service
      filingDeadlines,
      recommendedActions: [
        "Consult with tax professional for final return preparation",
        "Ensure all quarterly payments are current",
        "Gather all tax documents and records",
        "Plan for estimated tax liabilities",
        "Consider timing of dissolution for tax optimization",
      ],
    };
  }

  async getTaskProgress(dissolutionId: number): Promise<TaskProgress[]> {
    const tasks = await db
      .select()
      .from(dissolutionTasks)
      .where(eq(dissolutionTasks.dissolutionId, dissolutionId));

    const categories = ["decision", "approval", "filing", "wind_down", "closure"];
    
    return categories.map(category => {
      const categoryTasks = tasks.filter(task => task.taskCategory === category);
      const completed = categoryTasks.filter(task => task.status === "completed").length;
      const criticalTasks = categoryTasks
        .filter(task => task.priority === "critical" && task.status !== "completed")
        .map(task => ({
          taskTitle: task.taskTitle,
          dueDate: task.dueDate ? format(task.dueDate, 'MMM dd, yyyy') : "TBD",
          status: task.status,
          priority: task.priority,
        }));

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        completed,
        total: categoryTasks.length,
        percentage: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0,
        criticalTasks,
      };
    });
  }

  private async initializeWorkflowTasks(dissolutionId: number, entity: BusinessEntity): Promise<void> {
    const standardTasks = this.getStandardDissolutionTasks(entity);
    
    for (const taskData of standardTasks) {
      await db.insert(dissolutionTasks).values({
        dissolutionId,
        ...taskData,
      });
    }
  }

  private getStandardDissolutionTasks(entity: BusinessEntity): Partial<InsertDissolutionTask>[] {
    const isCorporation = entity.entityType === "Corporation" || entity.entityType === "S-Corporation";
    
    return [
      // Decision Phase
      {
        taskCategory: "decision",
        taskType: "member_approval",
        taskTitle: "Obtain Member/Shareholder Approval",
        taskDescription: "Generate and execute resolution for business dissolution",
        taskOrder: 1,
        priority: "critical",
        dueDate: addDays(new Date(), 7),
        actionRequired: true,
      },
      
      // Approval Phase
      {
        taskCategory: "approval",
        taskType: "board_resolution",
        taskTitle: "Board Resolution (if applicable)",
        taskDescription: "Board of directors approval for dissolution",
        taskOrder: 2,
        priority: isCorporation ? "high" : "low",
        isRequired: isCorporation,
        dependsOnTasks: [1],
        dueDate: addDays(new Date(), 14),
      },
      
      // Filing Phase
      {
        taskCategory: "filing",
        taskType: "state_filing",
        taskTitle: "File Articles of Dissolution",
        taskDescription: "Submit dissolution documents to Secretary of State",
        taskOrder: 3,
        priority: "critical",
        dependsOnTasks: [1, 2],
        dueDate: addWeeks(new Date(), 4),
        actionRequired: true,
      },
      
      {
        taskCategory: "filing",
        taskType: "final_tax_return",
        taskTitle: "File Final Tax Returns",
        taskDescription: "Submit final federal and state tax returns",
        taskOrder: 4,
        priority: "critical",
        dueDate: addMonths(new Date(), 4),
        actionRequired: true,
      },
      
      {
        taskCategory: "filing",
        taskType: "form_966",
        taskTitle: "File Form 966 (Corporations)",
        taskDescription: "Submit corporate dissolution statement to IRS",
        taskOrder: 5,
        priority: isCorporation ? "critical" : "low",
        isRequired: isCorporation,
        dependsOnTasks: [3],
        dueDate: addDays(new Date(), 37), // 30 days after effective date
      },
      
      // Wind-down Phase
      {
        taskCategory: "wind_down",
        taskType: "asset_distribution",
        taskTitle: "Distribute Assets",
        taskDescription: "Liquidate and distribute business assets to members",
        taskOrder: 6,
        priority: "high",
        dependsOnTasks: [3],
        dueDate: addMonths(new Date(), 3),
      },
      
      {
        taskCategory: "wind_down",
        taskType: "debt_settlement",
        taskTitle: "Settle Outstanding Debts",
        taskDescription: "Pay all creditors and settle liabilities",
        taskOrder: 7,
        priority: "critical",
        dependsOnTasks: [3],
        dueDate: addMonths(new Date(), 2),
      },
      
      {
        taskCategory: "wind_down",
        taskType: "license_cancellation",
        taskTitle: "Cancel Business Licenses",
        taskDescription: "Cancel all federal, state, and local licenses and permits",
        taskOrder: 8,
        priority: "high",
        dependsOnTasks: [3],
        dueDate: addWeeks(new Date(), 8),
        actionRequired: true,
      },
      
      {
        taskCategory: "wind_down",
        taskType: "contract_termination",
        taskTitle: "Terminate Contracts",
        taskDescription: "Properly terminate all business contracts and agreements",
        taskOrder: 9,
        priority: "medium",
        dueDate: addMonths(new Date(), 2),
      },
      
      {
        taskCategory: "wind_down",
        taskType: "employee_termination",
        taskTitle: "Handle Employee Terminations",
        taskDescription: "Terminate employees with proper notice and final payments",
        taskOrder: 10,
        priority: "high",
        dueDate: addWeeks(new Date(), 6),
      },
      
      // Closure Phase
      {
        taskCategory: "closure",
        taskType: "ein_cancellation",
        taskTitle: "Cancel EIN",
        taskDescription: "Cancel Employer Identification Number with IRS",
        taskOrder: 11,
        priority: "medium",
        dependsOnTasks: [4, 5],
        dueDate: addMonths(new Date(), 6),
      },
      
      {
        taskCategory: "closure",
        taskType: "record_retention",
        taskTitle: "Archive Business Records",
        taskDescription: "Securely store business records per legal requirements",
        taskOrder: 12,
        priority: "medium",
        dueDate: addMonths(new Date(), 5),
        actionRequired: true,
      },
    ];
  }

  private async initializeLicenseInventory(dissolutionId: number, entity: BusinessEntity): Promise<void> {
    const standardLicenses = this.getStandardLicenseChecklist(entity);
    
    for (const licenseData of standardLicenses) {
      await db.insert(dissolutionChecklists).values({
        dissolutionId,
        ...licenseData,
      });
    }
  }

  private getStandardLicenseChecklist(entity: BusinessEntity): Partial<InsertDissolutionChecklist>[] {
    return [
      // Federal Licenses
      {
        checklistType: "licenses",
        category: "federal",
        itemName: "Employer Identification Number (EIN)",
        description: "Cancel EIN with IRS after final obligations",
        isRequired: true,
        cancellationMethod: "mail",
        cancellationAgency: "Internal Revenue Service",
        cancellationAddress: "IRS Cincinnati Service Center, Cincinnati, OH 45999",
        estimatedTime: "30-60 days",
        potentialPenalties: "Continued tax obligations if not cancelled",
      },
      
      {
        checklistType: "licenses",
        category: "federal",
        itemName: "Federal Trade Commission Registration",
        description: "Cancel any FTC registrations or filings",
        isRequired: false,
        cancellationMethod: "online",
        cancellationAgency: "Federal Trade Commission",
        cancellationUrl: "https://www.ftc.gov/",
        estimatedTime: "1-2 weeks",
      },
      
      // State Licenses
      {
        checklistType: "licenses",
        category: "state",
        itemName: "State Business License",
        description: "Cancel general business license with state",
        isRequired: true,
        applicableStates: [entity.state],
        cancellationMethod: "online",
        cancellationAgency: `${entity.state} Department of Revenue`,
        estimatedTime: "2-4 weeks",
        potentialPenalties: "Continued fees and obligations",
      },
      
      {
        checklistType: "licenses",
        category: "state",
        itemName: "State Tax Registration",
        description: "Cancel state tax registrations and accounts",
        isRequired: true,
        applicableStates: [entity.state],
        cancellationMethod: "mail",
        cancellationAgency: `${entity.state} Department of Revenue`,
        estimatedTime: "4-6 weeks",
        potentialPenalties: "Continued tax filing obligations",
      },
      
      {
        checklistType: "licenses",
        category: "state",
        itemName: "Workers' Compensation Insurance",
        description: "Cancel workers' compensation policy",
        isRequired: false,
        cancellationMethod: "phone",
        cancellationAgency: "Insurance Provider",
        estimatedTime: "1-2 weeks",
      },
      
      // Local Licenses
      {
        checklistType: "licenses",
        category: "local",
        itemName: "City Business License",
        description: "Cancel local business operating license",
        isRequired: true,
        cancellationMethod: "in_person",
        cancellationAgency: "City Clerk Office",
        estimatedTime: "1-3 weeks",
        potentialPenalties: "Continued annual fees",
      },
      
      {
        checklistType: "licenses",
        category: "local",
        itemName: "Zoning Permits",
        description: "Cancel any special zoning or land use permits",
        isRequired: false,
        cancellationMethod: "mail",
        cancellationAgency: "City Planning Department",
        estimatedTime: "2-4 weeks",
      },
      
      // Industry-Specific (would be dynamically added based on business type)
      {
        checklistType: "permits",
        category: "federal",
        itemName: "Professional Licenses",
        description: "Cancel professional or industry-specific licenses",
        isRequired: false,
        cancellationMethod: "online",
        cancellationAgency: "Licensing Board",
        estimatedTime: "varies",
        potentialPenalties: "Professional liability if not properly cancelled",
      },
    ];
  }

  private async createInitialTimeline(dissolutionId: number): Promise<void> {
    const timelineEvents: Partial<InsertDissolutionTimeline>[] = [
      {
        dissolutionId,
        eventType: "milestone",
        eventTitle: "Dissolution Process Initiated",
        eventDescription: "Business dissolution workflow has been started",
        eventDate: new Date(),
        isCompleted: true,
        impactLevel: "medium",
      },
      {
        dissolutionId,
        eventType: "deadline",
        eventTitle: "Member Approval Due",
        eventDescription: "Obtain member/shareholder approval for dissolution",
        eventDate: addDays(new Date(), 7),
        isCritical: true,
        impactLevel: "high",
      },
      {
        dissolutionId,
        eventType: "deadline",
        eventTitle: "State Filing Deadline",
        eventDescription: "File Articles of Dissolution with Secretary of State",
        eventDate: addWeeks(new Date(), 4),
        isCritical: true,
        impactLevel: "high",
      },
      {
        dissolutionId,
        eventType: "deadline",
        eventTitle: "Final Tax Return Deadline",
        eventDescription: "Submit final tax returns to IRS and state",
        eventDate: addMonths(new Date(), 4),
        isCritical: true,
        impactLevel: "high",
      },
    ];

    for (const event of timelineEvents) {
      await db.insert(dissolutionTimeline).values(event as InsertDissolutionTimeline);
    }
  }

  private requiresMemberApproval(entity: BusinessEntity): boolean {
    return entity.entityType !== "Sole Proprietorship";
  }

  private calculateEstimatedCompletion(entity: BusinessEntity, dissolutionType: string): Date {
    const baseMonths = dissolutionType === "voluntary" ? 4 : 6;
    const entityComplexity = entity.entityType === "Corporation" ? 2 : 1;
    return addMonths(new Date(), baseMonths + entityComplexity);
  }

  private async getCriticalDeadlines(dissolutionId: number): Promise<any[]> {
    const timeline = await db
      .select()
      .from(dissolutionTimeline)
      .where(and(
        eq(dissolutionTimeline.dissolutionId, dissolutionId),
        eq(dissolutionTimeline.isCritical, true),
        eq(dissolutionTimeline.isCompleted, false)
      ))
      .orderBy(dissolutionTimeline.eventDate);

    return timeline.map(event => ({
      type: event.eventType,
      description: event.eventDescription,
      dueDate: format(event.eventDate, 'MMM dd, yyyy'),
      daysRemaining: Math.ceil((event.eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    }));
  }

  private async getNextAction(dissolution: BusinessDissolution): string {
    const pendingTasks = await db
      .select()
      .from(dissolutionTasks)
      .where(and(
        eq(dissolutionTasks.dissolutionId, dissolution.id),
        eq(dissolutionTasks.actionRequired, true),
        eq(dissolutionTasks.status, "pending")
      ))
      .orderBy(dissolutionTasks.taskOrder)
      .limit(1);

    if (pendingTasks.length > 0) {
      return pendingTasks[0].taskTitle;
    }

    return "Review progress and continue with next phase";
  }

  private async getDissolutionWithEntity(dissolutionId: number): Promise<{ 
    dissolution: BusinessDissolution, 
    business: BusinessEntity 
  }> {
    const [dissolution] = await db
      .select()
      .from(businessDissolutions)
      .where(eq(businessDissolutions.id, dissolutionId))
      .limit(1);

    if (!dissolution) {
      throw new Error("Dissolution not found");
    }

    const [business] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, dissolution.businessEntityId))
      .limit(1);

    return { dissolution, business };
  }

  private async getTemplate(entityType: string, state: string, templateType: string): Promise<any> {
    const [template] = await db
      .select()
      .from(dissolutionTemplates)
      .where(and(
        eq(dissolutionTemplates.entityType, entityType),
        eq(dissolutionTemplates.state, state),
        eq(dissolutionTemplates.templateType, templateType),
        eq(dissolutionTemplates.isActive, true)
      ))
      .orderBy(desc(dissolutionTemplates.lastUpdated))
      .limit(1);

    if (template) {
      return template;
    }

    // Fallback to generic template
    return this.getGenericTemplate(entityType, templateType);
  }

  private getGenericTemplate(entityType: string, templateType: string): any {
    // Return simulated template data
    return {
      templateName: `Generic ${templateType} Template`,
      templateContent: `Template content for ${entityType} ${templateType}`,
      templateVariables: ["businessName", "state", "effectiveDate"],
      requiredFields: ["businessName", "memberSignatures"],
    };
  }

  private async mapBusinessDataToResolution(dissolution: any, template: any): Promise<Record<string, any>> {
    return {
      businessName: dissolution.business.name,
      entityType: dissolution.business.entityType,
      state: dissolution.business.state,
      dissolutionReason: dissolution.dissolution.dissolutionReason,
      effectiveDate: format(dissolution.dissolution.effectiveDate, 'MMMM dd, yyyy'),
      currentDate: format(new Date(), 'MMMM dd, yyyy'),
    };
  }

  private async mapBusinessDataToArticles(dissolution: any, template: any): Promise<Record<string, any>> {
    return {
      businessName: dissolution.business.name,
      entityType: dissolution.business.entityType,
      state: dissolution.business.state,
      streetAddress: dissolution.business.streetAddress,
      city: dissolution.business.city,
      zipCode: dissolution.business.zipCode,
      effectiveDate: format(dissolution.dissolution.effectiveDate, 'MMMM dd, yyyy'),
      filingDate: format(new Date(), 'MMMM dd, yyyy'),
    };
  }

  private async mapBusinessDataToForm966(dissolution: any, template: any): Promise<Record<string, any>> {
    return {
      businessName: dissolution.business.name,
      ein: dissolution.business.ein || "TBD",
      taxYear: new Date().getFullYear(),
      dissolutionDate: format(dissolution.dissolution.effectiveDate, 'MM/dd/yyyy'),
      state: dissolution.business.state,
    };
  }

  private async mapBusinessDataToFinalReturn(dissolution: any, template: any): Promise<Record<string, any>> {
    return {
      businessName: dissolution.business.name,
      entityType: dissolution.business.entityType,
      taxYear: new Date().getFullYear(),
      finalReturnForm: this.getTaxFormType(dissolution.business.entityType),
      dueDate: this.getFinalTaxReturnDeadline(dissolution.business.entityType, dissolution.dissolution.effectiveDate),
    };
  }

  private async generateDocumentFromTemplate(data: Record<string, any>, template: any): Promise<Buffer> {
    // Simulate document generation - in real implementation would use PDF generation library
    const content = `Generated ${template.templateName} for ${data.businessName}`;
    return Buffer.from(content, 'utf-8');
  }

  private async updateTaskStatus(dissolutionId: number, taskType: string, status: string): Promise<void> {
    await db
      .update(dissolutionTasks)
      .set({ 
        status, 
        completedDate: status === "completed" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(and(
        eq(dissolutionTasks.dissolutionId, dissolutionId),
        eq(dissolutionTasks.taskType, taskType)
      ));
  }

  private async updateDissolutionProgress(dissolutionId: number): Promise<void> {
    const allTasks = await db
      .select()
      .from(dissolutionTasks)
      .where(eq(dissolutionTasks.dissolutionId, dissolutionId));

    const completedTasks = allTasks.filter(task => task.status === "completed");
    const completionPercentage = Math.round((completedTasks.length / allTasks.length) * 100);

    const currentPhase = this.calculateCurrentPhase(allTasks);

    await db
      .update(businessDissolutions)
      .set({ 
        completionPercentage,
        currentPhase,
        updatedAt: new Date(),
      })
      .where(eq(businessDissolutions.id, dissolutionId));
  }

  private calculateCurrentPhase(tasks: DissolutionTask[]): string {
    const phases = ["decision", "approval", "filing", "wind_down", "closure"];
    
    for (const phase of phases) {
      const phaseTasks = tasks.filter(task => task.taskCategory === phase);
      const completed = phaseTasks.filter(task => task.status === "completed");
      
      if (completed.length < phaseTasks.length) {
        return phase;
      }
    }
    
    return "completed";
  }

  private getStateFilingFee(state: string, entityType: string): number {
    // Return filing fees in cents - would be dynamically loaded from state database
    const fees: Record<string, Record<string, number>> = {
      "Delaware": { "LLC": 9000, "Corporation": 8900 },
      "California": { "LLC": 7000, "Corporation": 10000 },
      "New York": { "LLC": 6000, "Corporation": 12500 },
    };

    return fees[state]?.[entityType] || 5000; // Default $50
  }

  private getSecretaryOfStateUrl(state: string): string {
    const urls: Record<string, string> = {
      "Delaware": "https://corp.delaware.gov/",
      "California": "https://www.sos.ca.gov/business-programs/",
      "New York": "https://www.dos.ny.gov/corps/",
    };

    return urls[state] || "https://www.sos.state.us/";
  }

  private getTaxFormType(entityType: string): string {
    const forms: Record<string, string> = {
      "Sole Proprietorship": "Schedule C (Form 1040)",
      "Partnership": "Form 1065",
      "LLC": "Form 1065 (multi-member) or Schedule C (single-member)",
      "Corporation": "Form 1120",
      "S-Corporation": "Form 1120S",
    };

    return forms[entityType] || "Consult tax professional";
  }

  private getFinalTaxReturnDeadline(entityType: string, effectiveDate: Date): string {
    // Calculate deadline based on entity type and dissolution date
    const year = effectiveDate.getFullYear();
    const month = effectiveDate.getMonth();

    if (month < 3) { // Dissolved before March 15
      return `March 15, ${year}`;
    } else if (month < 9) { // Dissolved before September 15
      return `September 15, ${year}`;
    } else { // Dissolved after September 15
      return `March 15, ${year + 1}`;
    }
  }

  private calculateLicenseCancellationTime(licenseCount: number): string {
    if (licenseCount <= 5) return "2-4 weeks";
    if (licenseCount <= 10) return "4-8 weeks";
    return "8-12 weeks";
  }

  getDissolutionGuidance(): DissolutionGuidance {
    return {
      overview: "Business dissolution is the formal process of ending a business entity's legal existence. This comprehensive process involves multiple phases from initial decision-making through final record retention, ensuring all legal, tax, and regulatory obligations are properly fulfilled.",
      
      phases: [
        "Decision Phase: Member/shareholder approval and resolution",
        "Approval Phase: Board resolutions and internal authorizations",
        "Filing Phase: State dissolution documents and tax returns",
        "Wind-down Phase: Asset distribution, debt settlement, license cancellation",
        "Closure Phase: Final compliance actions and record archival"
      ],
      
      requirements: [
        "Member or shareholder approval resolution",
        "Articles of Dissolution filed with Secretary of State",
        "Final tax returns submitted to IRS and state",
        "All business debts and obligations settled",
        "Business assets properly distributed to owners",
        "All licenses and permits cancelled",
        "Employee terminations handled with proper notice",
        "Business records archived per legal requirements"
      ],
      
      timeline: [
        "Week 1-2: Obtain member/shareholder approval",
        "Week 3-4: Prepare and file Articles of Dissolution",
        "Month 2-3: Wind down operations and settle obligations",
        "Month 3-4: Distribute assets and terminate employees",
        "Month 4-6: Complete final tax filings",
        "Month 6+: Cancel EIN and archive records"
      ],
      
      considerations: [
        "Timing of dissolution for tax optimization",
        "Proper notice to creditors and customers",
        "Employment law compliance for terminations",
        "Asset valuation and distribution methods",
        "Ongoing liability protection for owners",
        "Insurance coverage during wind-down period",
        "Compliance with industry-specific regulations"
      ],
      
      costs: [
        "State filing fees: $50-$250 depending on state and entity type",
        "Professional services: $1,500-$5,000 for legal and accounting",
        "Final tax preparation: $500-$2,000",
        "License cancellation fees: varies by license type",
        "Asset liquidation costs: 5-15% of asset value",
        "Employee termination costs: varies by employment terms"
      ],
      
      recordRetention: {
        minimumPeriod: 7,
        recommendations: [
          "Tax records: 7 years minimum",
          "Corporate records: 7 years minimum",
          "Employment records: 4-7 years depending on type",
          "Financial statements: 7 years",
          "Contracts and legal documents: 7 years after termination",
          "Insurance records: indefinitely for liability coverage"
        ],
        digitalStorageOptions: [
          "Cloud-based document management systems",
          "Professional records storage services",
          "Encrypted digital archives with access controls",
          "Attorney or accountant custody arrangements"
        ]
      }
    };
  }
}

export const businessDissolutionService = new BusinessDissolutionService();