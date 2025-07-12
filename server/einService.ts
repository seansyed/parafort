import { 
  einApplications,
  einVerifications,
  businessEntities,
  type EinApplication,
  type InsertEinApplication,
  type EinVerification,
  type InsertEinVerification,
  type BusinessEntity
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import crypto from "crypto";

export interface EinApplicationData {
  businessLegalName: string;
  tradeName?: string;
  businessAddress: string;
  entityType: string;
  reasonForApplying: string;
  responsiblePartyName: string;
  responsiblePartySSN?: string;
  responsiblePartyITIN?: string;
  businessStartDate: Date;
  expectedEmployees: number;
  principalActivity: string;
}

export interface EinVerificationResult {
  isValid: boolean;
  businessName?: string;
  entityType?: string;
  status?: string;
  provider: string;
  confidence: number;
  details?: any;
}

export interface SS4FormData {
  line1_businessName: string;
  line2_tradeName?: string;
  line3_executorName?: string;
  line4a_mailingAddress: string;
  line4b_city: string;
  line4b_state: string;
  line4b_zipCode: string;
  line5a_streetAddress?: string;
  line5b_city?: string;
  line5b_state?: string;
  line5b_zipCode?: string;
  line6_county: string;
  line7a_responsiblePartyName: string;
  line7b_responsiblePartySSN: string;
  line8a_entityType: string;
  line8b_entityDetails?: string;
  line9_reasonForApplying: string;
  line10_businessStartDate: string;
  line11_closingMonth: string;
  line12_expectedEmployees: number;
  line13_principalActivity: string;
  line14_principalProduct: string;
  line15_hasEmployees: boolean;
  line16_hasFederalTaxDeposits: boolean;
  line17_businessType: string;
  line18_otherInformation?: string;
}

export class EinService {
  private verificationApiKey: string | undefined;
  private verificationBaseUrl: string;
  private encryptionKey: string;

  constructor() {
    this.verificationApiKey = process.env.MIDDESK_API_KEY || process.env.EIN_VERIFICATION_API_KEY;
    this.verificationBaseUrl = process.env.EIN_VERIFICATION_BASE_URL || "https://api.middesk.com/v1";
    this.encryptionKey = process.env.EIN_ENCRYPTION_KEY || "default-key-for-development";
    
    if (!this.verificationApiKey) {
      console.warn("EIN verification API key not configured - verification features will be limited");
    }
  }

  async createEinApplication(businessEntityId: number, applicationData: EinApplicationData): Promise<EinApplication> {
    // Encrypt sensitive data
    const encryptedSSN = applicationData.responsiblePartySSN 
      ? this.encryptSensitiveData(applicationData.responsiblePartySSN)
      : null;
    
    const encryptedITIN = applicationData.responsiblePartyITIN
      ? this.encryptSensitiveData(applicationData.responsiblePartyITIN)
      : null;

    const [application] = await db
      .insert(einApplications)
      .values({
        businessEntityId,
        businessLegalName: applicationData.businessLegalName,
        tradeName: applicationData.tradeName,
        businessAddress: applicationData.businessAddress,
        entityType: applicationData.entityType,
        reasonForApplying: applicationData.reasonForApplying,
        responsiblePartyName: applicationData.responsiblePartyName,
        responsiblePartySSN: encryptedSSN,
        responsiblePartyITIN: encryptedITIN,
        businessStartDate: applicationData.businessStartDate,
        expectedEmployees: applicationData.expectedEmployees,
        principalActivity: applicationData.principalActivity,
        applicationStatus: "draft"
      })
      .returning();

    return application;
  }

  async generateSS4Form(applicationId: number): Promise<Buffer> {
    // Retrieve application data
    const [application] = await db
      .select()
      .from(einApplications)
      .where(eq(einApplications.id, applicationId));

    if (!application) {
      throw new Error("EIN application not found");
    }

    // Get business entity data
    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, application.businessEntityId));

    if (!entity) {
      throw new Error("Business entity not found");
    }

    // Generate PDF form
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Form header
    page.drawText("Form SS-4", {
      x: 50,
      y: 750,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText("Application for Employer Identification Number", {
      x: 50,
      y: 730,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText("(For use by employers, corporations, partnerships, trusts, estates, churches,", {
      x: 50,
      y: 715,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    page.drawText("government agencies, Indian tribal entities, certain individuals, and others.)", {
      x: 50,
      y: 705,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Form fields
    let yPosition = 670;
    const lineHeight = 25;

    // Line 1 - Legal name of entity
    page.drawText("1. Legal name of entity (or individual) for whom the EIN is being requested", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(application.businessLegalName, {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 2 - Trade name
    page.drawText("2. Trade name of business (if different from name on line 1)", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(application.tradeName || "N/A", {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 4a - Mailing address
    page.drawText("4a. Mailing address (room, apt., suite no. and street, or P.O. box)", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    
    const addressLines = this.parseAddress(application.businessAddress);
    page.drawText(addressLines.street, {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 4b - City, state, ZIP
    page.drawText("4b. City, state, and ZIP code", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(`${addressLines.city}, ${addressLines.state} ${addressLines.zipCode}`, {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 7a - Name of responsible party
    page.drawText("7a. Name of responsible party", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(application.responsiblePartyName, {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 7b - SSN, ITIN, or EIN
    page.drawText("7b. SSN, ITIN, or EIN", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    
    const responsiblePartyId = application.responsiblePartySSN 
      ? this.decryptSensitiveData(application.responsiblePartySSN)
      : application.responsiblePartyITIN 
        ? this.decryptSensitiveData(application.responsiblePartyITIN)
        : "Not provided";
    
    page.drawText(this.formatTaxId(responsiblePartyId), {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 8a - Type of entity
    page.drawText("8a. Check only one box. Indicate the type of entity", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(`☐ Sole proprietorship  ☐ Partnership  ☐ Corporation  ☐ Personal service corporation`, {
      x: 50,
      y: yPosition - 15,
      size: 9,
      font: font,
    });
    page.drawText(`☐ Church or church-controlled organization  ☐ Other nonprofit organization`, {
      x: 50,
      y: yPosition - 30,
      size: 9,
      font: font,
    });
    page.drawText(`☐ Other (specify): ${application.entityType}`, {
      x: 50,
      y: yPosition - 45,
      size: 9,
      font: font,
    });

    yPosition -= lineHeight + 40;

    // Line 9 - Reason for applying
    page.drawText("9. Check only one box. Reason for applying", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(`Reason: ${application.reasonForApplying}`, {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 10 - Date business started
    page.drawText("10. Date business started or acquired (month, day, year)", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(application.businessStartDate?.toLocaleDateString() || "Not specified", {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 11 - Closing month of accounting year
    page.drawText("11. Closing month of accounting year", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText("December", {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 12 - First date wages will be paid
    page.drawText("12. First date wages or annuities were paid or will be paid (month, day, year)", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText("Not applicable / To be determined", {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 13 - Highest number of employees
    page.drawText("13. Highest number of employees expected in the next 12 months", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(`Expected employees: ${application.expectedEmployees}`, {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    yPosition -= lineHeight + 10;

    // Line 14 - Principal activity
    page.drawText("14. Check one box that best describes the principal activity of your business", {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    });
    page.drawText(application.principalActivity || "Business services", {
      x: 50,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
    });

    // Footer
    page.drawText("This form was generated by ParaFort EIN Application System", {
      x: 50,
      y: 50,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async verifyEin(ein: string, businessName: string): Promise<EinVerificationResult> {
    if (!this.verificationApiKey) {
      // Return simulation result when API key is not available
      return this.simulateEinVerification(ein, businessName);
    }

    try {
      const response = await fetch(`${this.verificationBaseUrl}/businesses/ein/${ein}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.verificationApiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Verification API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseVerificationResponse(data);
    } catch (error) {
      console.error("EIN verification failed:", error);
      return this.simulateEinVerification(ein, businessName);
    }
  }

  async submitEinApplication(applicationId: number): Promise<{
    success: boolean;
    confirmationNumber?: string;
    message: string;
    instructions?: string[];
  }> {
    const [application] = await db
      .select()
      .from(einApplications)
      .where(eq(einApplications.id, applicationId));

    if (!application) {
      throw new Error("EIN application not found");
    }

    // Generate SS-4 form PDF
    const ss4Pdf = await this.generateSS4Form(applicationId);
    const ss4Url = await this.saveDocument(ss4Pdf, `ss4_${applicationId}.pdf`);

    // Update application status
    const submissionDate = new Date();
    const confirmationNumber = `EIN${Date.now().toString().slice(-8)}`;

    await db
      .update(einApplications)
      .set({
        applicationStatus: "submitted",
        submittedDate: submissionDate,
        irsConfirmationNumber: confirmationNumber,
        ss4DocumentUrl: ss4Url,
        updatedAt: submissionDate
      })
      .where(eq(einApplications.id, applicationId));

    // Update business entity status
    await db
      .update(businessEntities)
      .set({
        einStatus: "pending",
        updatedAt: submissionDate
      })
      .where(eq(businessEntities.id, application.businessEntityId));

    return {
      success: true,
      confirmationNumber,
      message: "EIN application prepared and ready for submission to IRS",
      instructions: [
        "Review the generated Form SS-4 for accuracy",
        "Submit the form online at https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
        "Keep your confirmation number for tracking: " + confirmationNumber,
        "EIN processing typically takes 1-2 business days for online applications",
        "You will receive your EIN immediately upon successful online submission"
      ]
    };
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
      return "***-**-****"; // Return masked format if decryption fails
    }
  }

  private formatTaxId(taxId: string): string {
    if (taxId.length === 9) {
      return `***-**-${taxId.slice(-4)}`; // Mask SSN for privacy
    }
    return taxId;
  }

  private parseAddress(address: string): { street: string; city: string; state: string; zipCode: string } {
    // Simple address parsing - in production, use a more robust solution
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      return {
        street: parts[0],
        city: parts[1],
        state: parts[2].split(' ')[0] || '',
        zipCode: parts[2].split(' ')[1] || ''
      };
    }
    
    return {
      street: address,
      city: "",
      state: "",
      zipCode: ""
    };
  }

  private parseVerificationResponse(data: any): EinVerificationResult {
    return {
      isValid: data.status === "active" || data.status === "verified",
      businessName: data.business_name,
      entityType: data.entity_type,
      status: data.status,
      provider: "middesk",
      confidence: data.confidence || 0.9,
      details: data
    };
  }

  private simulateEinVerification(ein: string, businessName: string): EinVerificationResult {
    // Simulate verification for development/testing
    const isValidFormat = /^\d{2}-\d{7}$/.test(ein);
    
    return {
      isValid: isValidFormat && businessName.length > 0,
      businessName: businessName,
      entityType: "LLC",
      status: isValidFormat ? "verified" : "invalid",
      provider: "simulation",
      confidence: isValidFormat ? 0.85 : 0.1,
      details: {
        simulated: true,
        ein: ein,
        format_valid: isValidFormat
      }
    };
  }

  private async saveDocument(buffer: Buffer, filename: string): Promise<string> {
    // In production, this would save to S3, Google Cloud Storage, etc.
    // For now, return a simulated URL
    return `https://storage.parafort.com/documents/${filename}`;
  }

  getEinEligibilityInfo(): {
    eligibleEntities: string[];
    requirements: string[];
    timeline: string;
    fees: string;
  } {
    return {
      eligibleEntities: [
        "Limited Liability Companies (LLCs)",
        "Corporations (C-Corp, S-Corp)",
        "Partnerships",
        "Sole Proprietorships (with employees or certain business activities)",
        "Non-profit organizations",
        "Estates and trusts"
      ],
      requirements: [
        "Valid reason for requesting an EIN",
        "Responsible party with valid SSN or ITIN",
        "Physical business address in the United States",
        "Legal business name and structure",
        "Principal business activity description"
      ],
      timeline: "Immediate for online applications, 4-5 weeks for mail/fax applications",
      fees: "Free when applying directly through IRS. Beware of third-party services charging fees."
    };
  }
}

export const einService = new EinService();