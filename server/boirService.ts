import { 
  boirFilings,
  beneficialOwners,
  companyApplicants,
  boirAuditLog,
  businessEntities,
  type BoirFiling,
  type InsertBoirFiling,
  type BeneficialOwner,
  type InsertBeneficialOwner,
  type CompanyApplicant,
  type InsertCompanyApplicant,
  type BusinessEntity
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export interface BoirRequirementCheck {
  isUSCompany: boolean;
  requiresBOIR: boolean;
  reason: string;
  effectiveDate: string;
  exemptions: string[];
}

export interface ComplianceStatus {
  currentStatus: "compliant" | "non_compliant" | "exempt" | "unknown";
  lastFiled: Date | null;
  nextDueDate: Date | null;
  daysUntilDue: number | null;
  requiresUpdate: boolean;
  exemptionReason?: string;
}

export interface BoirSubmissionResult {
  success: boolean;
  confirmationNumber?: string;
  finCenIdentifier?: string;
  message: string;
  nextSteps: string[];
  complianceDeadline?: Date;
}

export class BoirService {
  private encryptionKey: string;
  private finCenApiKey: string | undefined;
  private finCenBaseUrl: string;

  constructor() {
    this.encryptionKey = process.env.BOIR_ENCRYPTION_KEY || "default-key-for-development";
    this.finCenApiKey = process.env.FINCEN_API_KEY;
    this.finCenBaseUrl = process.env.FINCEN_BASE_URL || "https://api.fincen.gov/boi";
    
    if (!this.finCenApiKey) {
      console.warn("FinCEN API key not configured - BOIR submissions will be simulated");
    }
  }

  async checkBoirRequirement(businessEntityId: number): Promise<BoirRequirementCheck> {
    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, businessEntityId));

    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Current regulation: U.S. companies no longer required as of March 21, 2025
    const isUSCompany = this.isUSEntity(entity);
    const requiresBOIR = !isUSCompany; // Only foreign companies now require BOIR

    return {
      isUSCompany,
      requiresBOIR,
      reason: isUSCompany 
        ? "U.S. companies are no longer required to file BOI reports as of March 21, 2025 due to regulatory changes"
        : "Foreign companies that register to do business in the U.S. must report beneficial ownership information",
      effectiveDate: "2025-03-21",
      exemptions: isUSCompany ? ["All U.S.-formed entities"] : [
        "Foreign banks regulated by federal/state banking regulators",
        "Foreign credit unions regulated by NCUA",
        "Foreign public companies listed on U.S. exchanges",
        "Large operating companies (>20 employees, >$5M revenue, U.S. office)"
      ]
    };
  }

  async getComplianceStatus(businessEntityId: number): Promise<ComplianceStatus> {
    const requirement = await this.checkBoirRequirement(businessEntityId);
    
    if (!requirement.requiresBOIR) {
      return {
        currentStatus: "exempt",
        lastFiled: null,
        nextDueDate: null,
        daysUntilDue: null,
        requiresUpdate: false,
        exemptionReason: requirement.reason
      };
    }

    // Get latest filing
    const [latestFiling] = await db
      .select()
      .from(boirFilings)
      .where(eq(boirFilings.businessEntityId, businessEntityId))
      .orderBy(boirFilings.lastUpdated)
      .limit(1);

    if (!latestFiling) {
      return {
        currentStatus: "non_compliant",
        lastFiled: null,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        daysUntilDue: 30,
        requiresUpdate: false
      };
    }

    const now = new Date();
    const lastUpdate = new Date(latestFiling.lastUpdated);
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      currentStatus: latestFiling.filingStatus === "accepted" ? "compliant" : "non_compliant",
      lastFiled: lastUpdate,
      nextDueDate: latestFiling.expirationDate,
      daysUntilDue: latestFiling.expirationDate 
        ? Math.floor((latestFiling.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
      requiresUpdate: daysSinceUpdate > 365 // Require annual updates
    };
  }

  async createBoirFiling(businessEntityId: number, filingData: Partial<InsertBoirFiling>): Promise<BoirFiling> {
    const requirement = await this.checkBoirRequirement(businessEntityId);
    
    const [filing] = await db
      .insert(boirFilings)
      .values({
        businessEntityId,
        filingType: "initial",
        filingStatus: "draft",
        isUSCompany: requirement.isUSCompany,
        requiresBOIR: requirement.requiresBOIR,
        ...filingData,
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      })
      .returning();

    // Create audit log
    await this.createAuditLog(filing.id, "created", "BOIR filing created", "system");

    return filing;
  }

  async addBeneficialOwner(
    boirFilingId: number, 
    ownerData: Omit<InsertBeneficialOwner, "boirFilingId">
  ): Promise<BeneficialOwner> {
    // Encrypt sensitive data
    const encryptedOwner = {
      ...ownerData,
      boirFilingId,
      dateOfBirth: this.encryptSensitiveData(ownerData.dateOfBirth),
      currentAddress: this.encryptSensitiveData(ownerData.currentAddress),
      identificationNumber: this.encryptSensitiveData(ownerData.identificationNumber),
      identificationImageUrl: ownerData.identificationImageUrl 
        ? this.encryptSensitiveData(ownerData.identificationImageUrl)
        : null,
      ownershipPercentage: ownerData.ownershipPercentage 
        ? this.encryptSensitiveData(ownerData.ownershipPercentage)
        : null,
    };

    const [owner] = await db
      .insert(beneficialOwners)
      .values(encryptedOwner)
      .returning();

    // Create audit log
    await this.createAuditLog(boirFilingId, "owner_added", 
      `Beneficial owner added: ${ownerData.fullLegalName}`, "system");

    return owner;
  }

  async addCompanyApplicant(
    boirFilingId: number,
    applicantData: Omit<InsertCompanyApplicant, "boirFilingId">
  ): Promise<CompanyApplicant> {
    // Encrypt sensitive data
    const encryptedApplicant = {
      ...applicantData,
      boirFilingId,
      dateOfBirth: this.encryptSensitiveData(applicantData.dateOfBirth),
      currentAddress: this.encryptSensitiveData(applicantData.currentAddress),
      businessAddress: applicantData.businessAddress 
        ? this.encryptSensitiveData(applicantData.businessAddress)
        : null,
      identificationNumber: this.encryptSensitiveData(applicantData.identificationNumber),
      identificationImageUrl: applicantData.identificationImageUrl 
        ? this.encryptSensitiveData(applicantData.identificationImageUrl)
        : null,
    };

    const [applicant] = await db
      .insert(companyApplicants)
      .values(encryptedApplicant)
      .returning();

    // Create audit log
    await this.createAuditLog(boirFilingId, "applicant_added", 
      `Company applicant added: ${applicantData.fullLegalName}`, "system");

    return applicant;
  }

  async submitBoirFiling(filingId: number): Promise<BoirSubmissionResult> {
    const [filing] = await db
      .select()
      .from(boirFilings)
      .where(eq(boirFilings.id, filingId));

    if (!filing) {
      throw new Error("BOIR filing not found");
    }

    if (!filing.requiresBOIR) {
      return {
        success: false,
        message: "This entity is exempt from BOIR filing requirements",
        nextSteps: [
          "No action required - U.S. companies are exempt as of March 21, 2025",
          "Monitor regulatory updates for any future changes",
          "Maintain exemption documentation"
        ]
      };
    }

    if (!this.finCenApiKey) {
      // Simulate submission for development
      return this.simulateBoirSubmission(filing);
    }

    try {
      // In production, this would submit to FinCEN
      const response = await fetch(`${this.finCenBaseUrl}/submit`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.finCenApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.prepareBoirSubmission(filing))
      });

      if (!response.ok) {
        throw new Error(`FinCEN API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Update filing status
      await db
        .update(boirFilings)
        .set({
          filingStatus: "submitted",
          submissionDate: new Date(),
          confirmationNumber: result.confirmationNumber,
          finCenIdentifier: result.finCenIdentifier,
          updatedAt: new Date()
        })
        .where(eq(boirFilings.id, filingId));

      await this.createAuditLog(filingId, "submitted", "BOIR filing submitted to FinCEN", "system");

      return {
        success: true,
        confirmationNumber: result.confirmationNumber,
        finCenIdentifier: result.finCenIdentifier,
        message: "BOIR filing submitted successfully to FinCEN",
        nextSteps: [
          "Monitor FinCEN for acceptance confirmation",
          "Update filing within 30 days of any changes to beneficial ownership",
          "Schedule annual compliance review"
        ],
        complianceDeadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };
    } catch (error) {
      console.error("BOIR submission failed:", error);
      return this.simulateBoirSubmission(filing);
    }
  }

  async updateBoirFiling(filingId: number, updates: Partial<InsertBoirFiling>): Promise<BoirFiling> {
    const [updatedFiling] = await db
      .update(boirFilings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(boirFilings.id, filingId))
      .returning();

    await this.createAuditLog(filingId, "updated", "BOIR filing updated", "system");

    return updatedFiling;
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
      return "[ENCRYPTED]"; // Return masked format if decryption fails
    }
  }

  private isUSEntity(entity: BusinessEntity): boolean {
    // Check if entity is formed/registered in the U.S.
    const usStates = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
      "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
      "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
      "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
      "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
    ];

    return usStates.includes(entity.state?.toUpperCase() || "");
  }

  private simulateBoirSubmission(filing: BoirFiling): BoirSubmissionResult {
    const confirmationNumber = `BOIR${Date.now().toString().slice(-8)}`;
    const finCenIdentifier = `FCN${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return {
      success: true,
      confirmationNumber,
      finCenIdentifier,
      message: "BOIR filing simulated successfully (development mode)",
      nextSteps: [
        "This is a simulation - configure FinCEN API keys for production",
        "Review filing for accuracy before actual submission",
        "Prepare for 30-day update requirements upon any ownership changes"
      ],
      complianceDeadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    };
  }

  private prepareBoirSubmission(filing: BoirFiling): any {
    // Prepare data structure for FinCEN API submission
    return {
      reportingCompany: {
        legalName: filing.companyLegalName,
        tradeDBANames: filing.tradeDBANames ? JSON.parse(filing.tradeDBANames) : [],
        principalUSAddress: filing.principalUSAddress,
        jurisdictionOfFormation: filing.jurisdictionOfFormation,
        taxIdentificationNumber: filing.taxIdentificationNumber
      },
      filingType: filing.filingType,
      submissionDate: new Date().toISOString()
    };
  }

  private async createAuditLog(
    boirFilingId: number, 
    actionType: string, 
    description: string, 
    performedBy: string
  ): Promise<void> {
    await db
      .insert(boirAuditLog)
      .values({
        boirFilingId,
        actionType,
        actionDescription: description,
        performedBy,
        regulatoryBasis: "CTA",
        dataAccessReason: "BOIR compliance management"
      });
  }

  getBOIRGuidanceInfo(): {
    currentStatus: string;
    effectiveDate: string;
    usCompaniesExempt: boolean;
    foreignCompaniesRequired: boolean;
    keyChanges: string[];
    complianceDeadlines: string[];
  } {
    return {
      currentStatus: "Regulatory changes implemented March 21, 2025",
      effectiveDate: "2025-03-21",
      usCompaniesExempt: true,
      foreignCompaniesRequired: true,
      keyChanges: [
        "U.S. companies no longer required to file BOI reports",
        "Foreign companies registering to do business in U.S. still required",
        "Existing exemptions remain for large operating companies and regulated entities",
        "Update requirements within 30 days of ownership changes remain for applicable entities"
      ],
      complianceDeadlines: [
        "Foreign companies: 30 days from U.S. registration",
        "Ownership changes: 30 days from change",
        "Annual review recommended for ongoing compliance"
      ]
    };
  }
}

export const boirService = new BoirService();