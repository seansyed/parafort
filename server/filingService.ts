import { BusinessEntity } from "@shared/schema";

export interface FilingStatus {
  id: string;
  status: "pending" | "submitted" | "approved" | "rejected" | "processing";
  submissionDate: Date;
  confirmationNumber?: string;
  statusMessage: string;
  stateResponse?: any;
  nextSteps?: string[];
}

export interface StateFilingRequirements {
  state: string;
  requiredDocuments: string[];
  filingFee: number;
  processingTime: string;
  submissionMethod: "online" | "mail" | "email";
  stateOfficeUrl: string;
  additionalRequirements?: string[];
}

export class FilingService {
  private stateRequirements: Map<string, StateFilingRequirements> = new Map([
    ["Delaware", {
      state: "Delaware",
      requiredDocuments: ["Certificate of Formation"],
      filingFee: 90,
      processingTime: "1-2 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://corp.delaware.gov/",
      additionalRequirements: [
        "Delaware registered agent required",
        "Annual franchise tax applies",
        "Annual report required for all entities"
      ]
    }],
    ["California", {
      state: "California",
      requiredDocuments: ["Articles of Organization", "Statement of Information"],
      filingFee: 70,
      processingTime: "3-5 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://www.sos.ca.gov/",
      additionalRequirements: [
        "California registered agent required",
        "Annual report required for corporations",
        "Biennial report required for LLCs",
        "Annual franchise tax applies",
        "Additional fees may apply for expedited processing"
      ]
    }],
    ["New York", {
      state: "New York",
      requiredDocuments: ["Articles of Organization"],
      filingFee: 200,
      processingTime: "2-3 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://www.dos.ny.gov/",
      additionalRequirements: [
        "New York registered agent required",
        "Publication requirement in two newspapers for LLCs",
        "Biennial report required",
        "Publication fees typically $1,000-2,000 additional"
      ]
    }],
    ["Texas", {
      state: "Texas",
      requiredDocuments: ["Certificate of Formation"],
      filingFee: 300,
      processingTime: "1-2 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://www.sos.state.tx.us/",
      additionalRequirements: [
        "Texas registered agent required",
        "Annual franchise tax report required",
        "Expedited processing available for additional fee"
      ]
    }],
    ["Florida", {
      state: "Florida",
      requiredDocuments: ["Articles of Organization"],
      filingFee: 125,
      processingTime: "1-2 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://dos.myflorida.com/",
      additionalRequirements: [
        "Florida registered agent required",
        "Annual report required",
        "Annual report fee applies"
      ]
    }],
    ["Nevada", {
      state: "Nevada",
      requiredDocuments: ["Articles of Organization", "Initial List of Managers/Members"],
      filingFee: 75,
      processingTime: "1-2 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://www.nvsos.gov/",
      additionalRequirements: [
        "Nevada registered agent required",
        "Initial list filing required within 30 days",
        "Annual list filing required"
      ]
    }],
    ["Wyoming", {
      state: "Wyoming",
      requiredDocuments: ["Articles of Organization"],
      filingFee: 100,
      processingTime: "1-2 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://sos.wyo.gov/",
      additionalRequirements: [
        "Wyoming registered agent required",
        "Annual report required",
        "License tax may apply"
      ]
    }],
    // Additional states based on provided data
    ["Illinois", {
      state: "Illinois",
      requiredDocuments: ["Articles of Organization"],
      filingFee: 150,
      processingTime: "2-3 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://www.ilsos.gov/",
      additionalRequirements: [
        "Illinois registered agent required",
        "Annual report required",
        "Publication requirement for corporations"
      ]
    }],
    ["Pennsylvania", {
      state: "Pennsylvania",
      requiredDocuments: ["Certificate of Organization"],
      filingFee: 125,
      processingTime: "3-5 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://www.dos.pa.gov/",
      additionalRequirements: [
        "Pennsylvania registered agent required",
        "Decennial report required"
      ]
    }],
    ["Ohio", {
      state: "Ohio",
      requiredDocuments: ["Articles of Organization"],
      filingFee: 99,
      processingTime: "2-3 business days",
      submissionMethod: "online",
      stateOfficeUrl: "https://www.sos.state.oh.us/",
      additionalRequirements: [
        "Ohio registered agent required",
        "No annual report required for LLCs"
      ]
    }]
  ]);

  async getStateRequirements(state: string): Promise<StateFilingRequirements | null> {
    return this.stateRequirements.get(state) || null;
  }

  async validateBusinessEntity(entity: BusinessEntity): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!entity.name || entity.name.trim().length === 0) {
      errors.push("Business name is required");
    }

    if (!entity.state) {
      errors.push("State of incorporation is required");
    }

    if (!entity.streetAddress) {
      errors.push("Street address is required");
    }

    if (!entity.city) {
      errors.push("City is required");
    }

    if (!entity.stateAddress) {
      errors.push("State address is required");
    }

    if (!entity.zipCode) {
      errors.push("ZIP code is required");
    }

    if (!entity.registeredAgent) {
      errors.push("Registered agent is required");
    }

    // State-specific validations
    const stateReqs = await this.getStateRequirements(entity.state);
    if (stateReqs) {
      // Add state-specific validation logic here
      if (entity.state === "New York" && entity.entityType === "LLC") {
        // New York requires publication
        if (!entity.businessPurpose || entity.businessPurpose.trim().length === 0) {
          errors.push("Business purpose is required for New York LLCs");
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async simulateFilingSubmission(entity: BusinessEntity): Promise<FilingStatus> {
    const validation = await this.validateBusinessEntity(entity);
    
    if (!validation.isValid) {
      return {
        id: `filing_${Date.now()}`,
        status: "rejected",
        submissionDate: new Date(),
        statusMessage: `Filing validation failed: ${validation.errors.join(", ")}`,
        nextSteps: [
          "Review and correct the validation errors listed above",
          "Ensure all required fields are properly filled",
          "Resubmit after making the necessary corrections"
        ]
      };
    }

    const stateReqs = await this.getStateRequirements(entity.state);
    const confirmationNumber = `DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: `filing_${Date.now()}`,
      status: "pending",
      submissionDate: new Date(),
      confirmationNumber,
      statusMessage: `Ready for manual submission to ${entity.state} Secretary of State`,
      nextSteps: [
        "Download your Articles of Organization document",
        `Visit the ${entity.state} Secretary of State website: ${stateReqs?.stateOfficeUrl || 'state website'}`,
        `Prepare filing fee: $${stateReqs?.filingFee || 'varies by state'}`,
        "Follow the state-specific filing instructions provided",
        `Expected processing time: ${stateReqs?.processingTime || '1-5 business days'}`,
        "Monitor your email for confirmation from the state"
      ]
    };
  }

  async checkFilingStatus(filingId: string): Promise<FilingStatus | null> {
    // This would check with the state API for real status updates
    // For now, we'll simulate status progression
    
    const statuses: ("submitted" | "processing" | "approved")[] = ["submitted", "processing", "approved"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: filingId,
      status: randomStatus,
      submissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      confirmationNumber: `CONF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      statusMessage: this.getStatusMessage(randomStatus),
      nextSteps: this.getNextSteps(randomStatus)
    };
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case "submitted":
        return "Filing has been submitted and is pending review";
      case "processing":
        return "Filing is currently being processed by the state";
      case "approved":
        return "Filing has been approved and your business is officially formed!";
      case "rejected":
        return "Filing was rejected. Please review and correct the issues.";
      default:
        return "Status unknown";
    }
  }

  private getNextSteps(status: string): string[] {
    switch (status) {
      case "submitted":
        return [
          "Wait for state processing",
          "Check back in 1-2 business days",
          "Ensure all contact information is current"
        ];
      case "processing":
        return [
          "Processing is underway",
          "No action required at this time",
          "Estimated completion: 1-2 business days"
        ];
      case "approved":
        return [
          "Download your official formation documents",
          "Obtain an EIN from the IRS",
          "Open a business bank account",
          "Set up business accounting"
        ];
      case "rejected":
        return [
          "Review rejection reasons",
          "Correct all identified issues",
          "Resubmit your filing"
        ];
      default:
        return [];
    }
  }

  async generateFilingInstructions(entity: BusinessEntity): Promise<{
    instructions: string[];
    documents: string[];
    estimatedCost: number;
    timeframe: string;
  }> {
    const stateReqs = await this.getStateRequirements(entity.state);
    
    if (!stateReqs) {
      return {
        instructions: [
          "State requirements not available in our system",
          "Contact your state's Secretary of State office for specific filing requirements",
          "Ensure you have a completed Articles of Organization document",
          "Verify registered agent requirements for your state"
        ],
        documents: ["Articles of Organization"],
        estimatedCost: 0,
        timeframe: "Varies by state"
      };
    }

    const baseInstructions = [
      `Prepare your ${stateReqs.requiredDocuments.join(" and ")} document(s)`,
      `Visit the ${stateReqs.state} Secretary of State filing portal: ${stateReqs.stateOfficeUrl}`,
      `Create an account or log in to the online filing system`,
      `Complete the online filing form with your business information`,
      `Upload your prepared documents`,
      `Pay the filing fee of $${stateReqs.filingFee} (credit card, ACH, or check)`,
      `Review and submit your filing`,
      `Save your confirmation number and receipt`,
      `Monitor your email for status updates from the state`
    ];

    // Add state-specific requirements
    const specificInstructions = stateReqs.additionalRequirements ? [
      ...baseInstructions,
      "Additional state-specific requirements:",
      ...stateReqs.additionalRequirements.map(req => `• ${req}`)
    ] : baseInstructions;

    return {
      instructions: specificInstructions,
      documents: stateReqs.requiredDocuments,
      estimatedCost: stateReqs.filingFee,
      timeframe: stateReqs.processingTime
    };
  }
}

export const filingService = new FilingService();