import { 
  sCorpElections,
  sCorpShareholders,
  complianceCalendar,
  complianceNotifications,
  businessEntities,
  type SCorpElection,
  type InsertSCorpElection,
  type SCorpShareholder,
  type InsertSCorpShareholder,
  type ComplianceCalendar,
  type InsertComplianceCalendar,
  type BusinessEntity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, lte, gte } from "drizzle-orm";
import crypto from "crypto";

export interface ElectionDeadlineInfo {
  standardDeadline: Date;
  isLateElection: boolean;
  daysRemaining: number;
  canFileLate: boolean;
  lateFilingDeadline: Date;
  requiresReasonableCause: boolean;
}

export interface Form2553Data {
  entityInformation: {
    legalName: string;
    ein: string;
    entityType: string;
    formationDate: Date;
    stateOfFormation: string;
    businessAddress: string;
  };
  electionDetails: {
    effectiveDate: Date;
    taxYearEnd: string;
    selectedTaxYear: string;
  };
  shareholders: Array<{
    name: string;
    ssn: string;
    address: string;
    sharesOwned: number;
    ownershipPercentage: string;
    dateAcquired: Date;
    hasConsented: boolean;
  }>;
  signatures: {
    officerName: string;
    officerTitle: string;
    signatureDate: Date;
  };
}

export interface LateFilingRelief {
  isEligible: boolean;
  requirements: string[];
  supportingDocuments: string[];
  deadlineForRelief: Date;
}

export class SCorpElectionService {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.SCORP_ENCRYPTION_KEY || "default-key-for-development";
  }

  async calculateElectionDeadline(formationDate: Date, effectiveDate: Date): Promise<ElectionDeadlineInfo> {
    const effectiveYear = effectiveDate.getFullYear();
    
    // Standard deadline: 2 months and 15 days after the beginning of the tax year
    const standardDeadline = new Date(effectiveYear, 2, 15); // March 15th
    
    // If entity was formed after the tax year started, deadline is 2 months and 15 days from formation
    if (formationDate > new Date(effectiveYear - 1, 11, 31)) {
      const formationDeadline = new Date(formationDate);
      formationDeadline.setMonth(formationDeadline.getMonth() + 2);
      formationDeadline.setDate(formationDeadline.getDate() + 15);
      
      if (formationDeadline > standardDeadline) {
        standardDeadline.setTime(formationDeadline.getTime());
      }
    }

    const now = new Date();
    const daysRemaining = Math.ceil((standardDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isLateElection = daysRemaining < 0;

    // Late filing relief deadline: 3 years and 75 days from the proposed effective date
    const lateFilingDeadline = new Date(effectiveDate);
    lateFilingDeadline.setFullYear(lateFilingDeadline.getFullYear() + 3);
    lateFilingDeadline.setDate(lateFilingDeadline.getDate() + 75);

    const canFileLate = now <= lateFilingDeadline;

    return {
      standardDeadline,
      isLateElection,
      daysRemaining: Math.max(0, daysRemaining),
      canFileLate,
      lateFilingDeadline,
      requiresReasonableCause: isLateElection
    };
  }

  async createSCorpElection(businessEntityId: number, electionData: Partial<InsertSCorpElection>): Promise<SCorpElection> {
    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, businessEntityId));

    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Calculate deadline information
    const deadlineInfo = await this.calculateElectionDeadline(
      entity.formationDate || new Date(),
      electionData.proposedEffectiveDate || new Date()
    );

    const [election] = await db
      .insert(sCorpElections)
      .values({
        businessEntityId,
        entityLegalName: entity.name,
        ein: entity.ein || "",
        entityType: entity.entityType || "LLC",
        formationDate: entity.formationDate || new Date(),
        stateOfFormation: entity.state || "",
        deadlineDate: deadlineInfo.standardDeadline,
        isLateElection: deadlineInfo.isLateElection,
        ...electionData,
      })
      .returning();

    // Create compliance calendar entry
    await this.createComplianceReminders(election);

    return election;
  }

  async addShareholder(electionId: number, shareholderData: Omit<InsertSCorpShareholder, "sCorpElectionId">): Promise<SCorpShareholder> {
    // Encrypt sensitive data
    const encryptedShareholder = {
      ...shareholderData,
      sCorpElectionId: electionId,
      ssn: this.encryptSensitiveData(shareholderData.ssn),
    };

    const [shareholder] = await db
      .insert(sCorpShareholders)
      .values(encryptedShareholder)
      .returning();

    return shareholder;
  }

  async generateForm2553(electionId: number): Promise<Form2553Data> {
    const [election] = await db
      .select()
      .from(sCorpElections)
      .where(eq(sCorpElections.id, electionId));

    if (!election) {
      throw new Error("S-Corp election not found");
    }

    const shareholders = await db
      .select()
      .from(sCorpShareholders)
      .where(eq(sCorpShareholders.sCorpElectionId, electionId));

    // Decrypt shareholder data for form generation
    const decryptedShareholders = shareholders.map(shareholder => ({
      name: shareholder.fullName,
      ssn: this.decryptSensitiveData(shareholder.ssn),
      address: shareholder.address,
      sharesOwned: shareholder.sharesOwned,
      ownershipPercentage: shareholder.ownershipPercentage,
      dateAcquired: shareholder.dateAcquired,
      hasConsented: shareholder.hasConsented,
    }));

    return {
      entityInformation: {
        legalName: election.entityLegalName,
        ein: election.ein,
        entityType: election.entityType,
        formationDate: election.formationDate,
        stateOfFormation: election.stateOfFormation,
        businessAddress: "", // Would need to get from business entity
      },
      electionDetails: {
        effectiveDate: election.proposedEffectiveDate,
        taxYearEnd: election.taxYearEnd,
        selectedTaxYear: election.selectedTaxYear,
      },
      shareholders: decryptedShareholders,
      signatures: {
        officerName: "", // To be filled by user
        officerTitle: "", // To be filled by user
        signatureDate: new Date(),
      },
    };
  }

  async getLateFilingRelief(electionId: number): Promise<LateFilingRelief> {
    const [election] = await db
      .select()
      .from(sCorpElections)
      .where(eq(sCorpElections.id, electionId));

    if (!election) {
      throw new Error("S-Corp election not found");
    }

    const deadlineInfo = await this.calculateElectionDeadline(
      election.formationDate,
      election.proposedEffectiveDate
    );

    return {
      isEligible: deadlineInfo.canFileLate,
      requirements: [
        "The entity has not filed a Form 1120S for the year the election should have been effective",
        "The entity has reasonable cause for the late election",
        "The entity has been operating as an S-Corporation since the proposed effective date",
        "All shareholders during the period consent to the late election",
        "The entity files within 3 years and 75 days of the proposed effective date"
      ],
      supportingDocuments: [
        "Form 2553 with late election statement",
        "Reasonable cause explanation letter",
        "Shareholder consent statements",
        "Evidence of S-Corporation operation (tax returns, corporate resolutions, etc.)",
        "Form 1120S for each tax year (if applicable)"
      ],
      deadlineForRelief: deadlineInfo.lateFilingDeadline
    };
  }

  async submitElection(electionId: number): Promise<{
    success: boolean;
    message: string;
    nextSteps: string[];
  }> {
    const [election] = await db
      .select()
      .from(sCorpElections)
      .where(eq(sCorpElections.id, electionId));

    if (!election) {
      throw new Error("S-Corp election not found");
    }

    // Update election status
    await db
      .update(sCorpElections)
      .set({
        electionStatus: "submitted",
        submissionDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sCorpElections.id, electionId));

    // Mark compliance calendar item as completed
    await db
      .update(complianceCalendar)
      .set({
        status: "completed",
        completedDate: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(complianceCalendar.relatedRecordType, "s_corp_election"),
        eq(complianceCalendar.relatedRecordId, electionId)
      ));

    return {
      success: true,
      message: "Form 2553 has been prepared for submission to the IRS",
      nextSteps: [
        "Print and sign the Form 2553",
        "Mail the completed form to the IRS Service Center for your state",
        "Use certified mail with return receipt requested for proof of submission",
        "Keep copies of all documents for your records",
        "Monitor for IRS acknowledgment within 60-90 days"
      ]
    };
  }

  async getUpcomingDeadlines(businessEntityId: number): Promise<ComplianceCalendar[]> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return await db
      .select()
      .from(complianceCalendar)
      .where(and(
        eq(complianceCalendar.businessEntityId, businessEntityId),
        eq(complianceCalendar.status, "pending"),
        lte(complianceCalendar.dueDate, thirtyDaysFromNow)
      ))
      .orderBy(complianceCalendar.dueDate);
  }

  async createComplianceReminders(election: SCorpElection): Promise<void> {
    const deadlineInfo = await this.calculateElectionDeadline(
      election.formationDate,
      election.proposedEffectiveDate
    );

    // Create compliance calendar entry
    const [calendarItem] = await db
      .insert(complianceCalendar)
      .values({
        businessEntityId: election.businessEntityId,
        eventType: "s_corp_election",
        eventTitle: "S-Corporation Election (Form 2553)",
        eventDescription: `File Form 2553 to elect S-Corporation tax status. Standard deadline: ${deadlineInfo.standardDeadline.toLocaleDateString()}`,
        dueDate: deadlineInfo.standardDeadline,
        reminderDates: JSON.stringify([
          new Date(deadlineInfo.standardDeadline.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days before
          new Date(deadlineInfo.standardDeadline.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days before
          new Date(deadlineInfo.standardDeadline.getTime() - 7 * 24 * 60 * 60 * 1000),  // 7 days before
          new Date(deadlineInfo.standardDeadline.getTime() - 1 * 24 * 60 * 60 * 1000),  // 1 day before
        ]),
        priority: deadlineInfo.isLateElection ? "high" : "medium",
        category: "tax",
        relatedRecordType: "s_corp_election",
        relatedRecordId: election.id,
      })
      .returning();

    // Schedule reminder notifications
    const reminderDates = JSON.parse(calendarItem.reminderDates || "[]");
    for (const reminderDate of reminderDates) {
      await db
        .insert(complianceNotifications)
        .values({
          businessEntityId: election.businessEntityId,
          complianceCalendarId: calendarItem.id,
          notificationType: "email",
          title: "S-Corporation Election Deadline Reminder",
          message: this.generateReminderMessage(election, new Date(reminderDate), deadlineInfo.standardDeadline),
          scheduledDate: new Date(reminderDate),
        });
    }
  }

  private generateReminderMessage(election: SCorpElection, reminderDate: Date, deadline: Date): string {
    const daysUntilDeadline = Math.ceil((deadline.getTime() - reminderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return `Reminder: Your S-Corporation election (Form 2553) for ${election.entityLegalName} is due in ${daysUntilDeadline} day(s) on ${deadline.toLocaleDateString()}. ` +
           `Please ensure all shareholder information is complete and the form is ready for submission to the IRS. ` +
           `Late elections may require additional documentation and reasonable cause explanations.`;
  }

  async processScheduledReminders(): Promise<void> {
    const now = new Date();
    
    // Get pending notifications that are due
    const dueNotifications = await db
      .select()
      .from(complianceNotifications)
      .where(and(
        eq(complianceNotifications.status, "pending"),
        lte(complianceNotifications.scheduledDate, now)
      ));

    for (const notification of dueNotifications) {
      // In a real implementation, this would send emails via SendGrid or similar
      console.log(`Sending reminder: ${notification.title} to business entity ${notification.businessEntityId}`);
      
      // Mark notification as sent
      await db
        .update(complianceNotifications)
        .set({
          status: "sent",
          sentDate: now,
          deliveryAttempts: notification.deliveryAttempts + 1,
        })
        .where(eq(complianceNotifications.id, notification.id));
    }
  }

  private encryptSensitiveData(data: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decryptSensitiveData(encryptedData: string): string {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      return "[ENCRYPTED]";
    }
  }

  getElectionGuidance(): {
    eligibleEntities: string[];
    requirements: string[];
    deadlines: {
      standard: string;
      late: string;
    };
    benefits: string[];
    considerations: string[];
  } {
    return {
      eligibleEntities: [
        "Domestic corporations",
        "Limited Liability Companies (LLCs) electing corporate tax treatment",
        "Entities with 100 or fewer shareholders",
        "Entities with only allowable shareholders (individuals, certain trusts, estates)"
      ],
      requirements: [
        "All shareholders must consent to the election",
        "File Form 2553 within the required timeframe",
        "Provide complete shareholder information including SSNs",
        "Specify the effective date of the election",
        "Choose appropriate tax year end"
      ],
      deadlines: {
        standard: "2 months and 15 days after the beginning of the tax year the election is to take effect, or at any time during the preceding tax year",
        late: "Within 3 years and 75 days of the proposed effective date with reasonable cause"
      },
      benefits: [
        "Pass-through taxation (no double taxation)",
        "Ability to avoid self-employment tax on distributions",
        "Potential tax savings for business owners",
        "Simplified tax reporting compared to C-Corporation"
      ],
      considerations: [
        "Restrictions on number and type of shareholders",
        "Required reasonable salary for shareholder-employees",
        "Limited flexibility in profit and loss allocations",
        "Potential complications if election is terminated"
      ]
    };
  }
}

export const sCorpElectionService = new SCorpElectionService();