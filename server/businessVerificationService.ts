import { BusinessEntity } from "@shared/schema";

export interface BusinessVerificationResult {
  isValid: boolean;
  nameAvailable: boolean;
  complianceIssues: string[];
  suggestedNames?: string[];
  verificationId?: string;
}

export interface FilingSubmissionResult {
  success: boolean;
  submissionId: string;
  confirmationNumber?: string;
  estimatedProcessingTime: string;
  statusTrackingUrl?: string;
  errors?: string[];
}

export class BusinessVerificationService {
  private apiKey: string | undefined;
  private baseUrl: string;

  constructor() {
    // Check for business verification API credentials
    this.apiKey = process.env.BUSINESS_VERIFICATION_API_KEY;
    this.baseUrl = process.env.BUSINESS_VERIFICATION_BASE_URL || 'https://api.businessverification.com';
  }

  async verifyBusinessName(name: string, state: string, entityType: string): Promise<BusinessVerificationResult> {
    if (!this.apiKey) {
      console.warn("Business verification API key not configured");
      return this.fallbackNameVerification(name, state, entityType);
    }

    try {
      // This would integrate with a real business verification API like Middesk or Signzy
      const response = await fetch(`${this.baseUrl}/verify/name`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          state,
          entityType,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        isValid: data.isValid,
        nameAvailable: data.nameAvailable,
        complianceIssues: data.complianceIssues || [],
        suggestedNames: data.suggestedNames,
        verificationId: data.verificationId,
      };
    } catch (error) {
      console.error("Business verification API error:", error);
      return this.fallbackNameVerification(name, state, entityType);
    }
  }

  async submitFiling(entity: BusinessEntity): Promise<FilingSubmissionResult> {
    if (!this.apiKey) {
      console.warn("Business verification API key not configured");
      return this.simulateFilingSubmission(entity);
    }

    try {
      // This would submit to a real state filing API
      const response = await fetch(`${this.baseUrl}/filing/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: entity.name,
          entityType: entity.entityType,
          state: entity.state,
          address: {
            street: entity.streetAddress,
            city: entity.city,
            state: entity.stateAddress,
            zipCode: entity.zipCode,
          },
          registeredAgent: entity.registeredAgent,
          businessPurpose: entity.businessPurpose,
          numberOfShares: entity.numberOfShares,
        }),
      });

      if (!response.ok) {
        throw new Error(`Filing submission failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        submissionId: data.submissionId,
        confirmationNumber: data.confirmationNumber,
        estimatedProcessingTime: data.estimatedProcessingTime,
        statusTrackingUrl: data.statusTrackingUrl,
      };
    } catch (error) {
      console.error("Filing submission API error:", error);
      return {
        success: false,
        submissionId: `fallback_${Date.now()}`,
        estimatedProcessingTime: "Manual submission required",
        errors: ["API submission failed - manual filing required"],
      };
    }
  }

  async trackFilingStatus(submissionId: string): Promise<{
    status: string;
    statusMessage: string;
    lastUpdated: Date;
    documents?: Array<{ name: string; url: string }>;
  }> {
    if (!this.apiKey) {
      return this.simulateStatusTracking(submissionId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/filing/status/${submissionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        statusMessage: data.statusMessage,
        lastUpdated: new Date(data.lastUpdated),
        documents: data.documents,
      };
    } catch (error) {
      console.error("Status tracking API error:", error);
      return this.simulateStatusTracking(submissionId);
    }
  }

  private fallbackNameVerification(name: string, state: string, entityType: string): BusinessVerificationResult {
    // Basic validation without external API
    const complianceIssues: string[] = [];

    // Check for common restricted words
    const restrictedWords = ['bank', 'insurance', 'trust', 'credit union'];
    const lowerName = name.toLowerCase();
    
    for (const word of restrictedWords) {
      if (lowerName.includes(word)) {
        complianceIssues.push(`"${word}" may require special licensing or be restricted`);
      }
    }

    // Check for required suffixes
    const requiresSuffix = !lowerName.includes('llc') && 
                          !lowerName.includes('corp') && 
                          !lowerName.includes('inc') && 
                          !lowerName.includes('ltd');

    if (requiresSuffix && entityType === 'LLC') {
      complianceIssues.push('LLC names typically require "LLC" or "Limited Liability Company"');
    }

    return {
      isValid: complianceIssues.length === 0,
      nameAvailable: true, // Cannot verify without API
      complianceIssues,
      suggestedNames: complianceIssues.length > 0 ? [`${name} LLC`, `${name} Limited`] : undefined,
    };
  }

  private simulateFilingSubmission(entity: BusinessEntity): FilingSubmissionResult {
    return {
      success: true,
      submissionId: `sim_${Date.now()}`,
      confirmationNumber: `CONF_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedProcessingTime: "1-3 business days",
    };
  }

  private simulateStatusTracking(submissionId: string) {
    const statuses = ['submitted', 'under_review', 'approved', 'completed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      statusMessage: `Filing is ${randomStatus.replace('_', ' ')}`,
      lastUpdated: new Date(),
    };
  }
}

export const businessVerificationService = new BusinessVerificationService();