import { 
  registeredAgentAddresses,
  registeredAgentConsent,
  receivedDocuments,
  documentAuditLog,
  type RegisteredAgentAddress,
  type InsertRegisteredAgentAddress,
  type RegisteredAgentConsent,
  type InsertRegisteredAgentConsent,
  type ReceivedDocument,
  // type InsertReceivedDocument,
  type InsertDocumentAuditLog,
  type BusinessEntity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface DocumentNotification {
  recipientEmail: string;
  documentType: string;
  urgencyLevel: string;
  businessEntityName: string;
  receivedDate: Date;
  documentTitle?: string;
}

export class RegisteredAgentService {
  private parafortAddresses: Map<string, RegisteredAgentAddress> = new Map();

  constructor() {
    this.initializeParafortAddresses();
  }

  private initializeParafortAddresses() {
    // Initialize ParaFort's verified registered agent addresses for each state
    const addresses = [
      {
        state: "Delaware",
        streetAddress: "1013 Centre Road, Suite 403-B",
        city: "Wilmington",
        zipCode: "19805",
        phoneNumber: "(302) 123-4567"
      },
      {
        state: "California", 
        streetAddress: "2035 Sunset Lake Road, Suite B-2",
        city: "Newark",
        zipCode: "19702",
        phoneNumber: "(510) 123-4567"
      },
      {
        state: "New York",
        streetAddress: "28 Liberty Street, 6th Floor",
        city: "New York",
        zipCode: "10005", 
        phoneNumber: "(212) 123-4567"
      },
      {
        state: "Texas",
        streetAddress: "1999 Bryan Street, Suite 900",
        city: "Dallas",
        zipCode: "75201",
        phoneNumber: "(214) 123-4567"
      },
      {
        state: "Florida",
        streetAddress: "1 East Broward Boulevard, Suite 700",
        city: "Fort Lauderdale", 
        zipCode: "33301",
        phoneNumber: "(954) 123-4567"
      },
      {
        state: "Nevada",
        streetAddress: "2310 Corporate Circle, Suite 200",
        city: "Henderson",
        zipCode: "89074",
        phoneNumber: "(702) 123-4567"
      },
      {
        state: "Wyoming",
        streetAddress: "30 N. Gould Street, Suite R",
        city: "Sheridan",
        zipCode: "82801",
        phoneNumber: "(307) 123-4567"
      }
    ];

    addresses.forEach(addr => {
      this.parafortAddresses.set(addr.state, {
        id: 0, // Will be set when saved to database
        state: addr.state,
        streetAddress: addr.streetAddress,
        city: addr.city,
        zipCode: addr.zipCode,
        phoneNumber: addr.phoneNumber,
        businessHours: "9:00 AM - 5:00 PM EST",
        isActive: true,
        verifiedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }

  async getOrCreateAgentAddress(state: string): Promise<RegisteredAgentAddress> {
    // Normalize state input - convert abbreviations to full names
    const stateMapping: { [key: string]: string } = {
      'CA': 'California',
      'NY': 'New York', 
      'TX': 'Texas',
      'FL': 'Florida',
      'DE': 'Delaware',
      'NV': 'Nevada',
      'WY': 'Wyoming'
    };
    
    const normalizedState = stateMapping[state] || state;
    
    // Check if address exists in database
    const [existingAddress] = await db
      .select()
      .from(registeredAgentAddresses)
      .where(eq(registeredAgentAddresses.state, normalizedState));

    if (existingAddress) {
      return existingAddress;
    }

    // Get the ParaFort address for this state
    const parafortAddress = this.parafortAddresses.get(normalizedState);
    if (!parafortAddress) {
      throw new Error(`ParaFort registered agent service not available in ${normalizedState} (original: ${state})`);
    }

    // Create new address record
    const [newAddress] = await db
      .insert(registeredAgentAddresses)
      .values({
        state: parafortAddress.state,
        streetAddress: parafortAddress.streetAddress,
        city: parafortAddress.city,
        zipCode: parafortAddress.zipCode,
        phoneNumber: parafortAddress.phoneNumber,
        businessHours: parafortAddress.businessHours,
        isActive: true,
        verifiedDate: new Date()
      })
      .returning();

    return newAddress;
  }

  async createAgentConsent(businessEntityId: number, state: string): Promise<RegisteredAgentConsent> {
    const agentAddress = await this.getOrCreateAgentAddress(state);

    const [consent] = await db
      .insert(registeredAgentConsent)
      .values({
        businessEntityId,
        agentName: "ParaFort Registered Agent Services",
        agentAddressId: agentAddress.id,
        consentMethod: "electronic",
        isActive: true
      })
      .returning();

    return consent;
  }

  // async logReceivedDocument(documentData: InsertReceivedDocument): Promise<ReceivedDocument> {
  //   const [document] = await db
  //     .insert(receivedDocuments)
  //     .values(documentData)
  //     .returning();

  //   // Create audit log entry
  //   await this.createAuditLog(document.id, "received", "ParaFort Agent", 
  //     `Document received: ${documentData.documentType}`);

  //   return document;
  // }

  async processDocument(documentId: number, handledBy: string): Promise<void> {
    // Update document status
    await db
      .update(receivedDocuments)
      .set({ 
        status: "processed",
        handledBy,
        updatedAt: new Date()
      })
      .where(eq(receivedDocuments.id, documentId));

    await this.createAuditLog(documentId, "processed", handledBy, 
      "Document processed and categorized");
  }

  async forwardDocument(documentId: number, handledBy: string, digitalUrl?: string): Promise<void> {
    const now = new Date();
    
    await db
      .update(receivedDocuments)
      .set({
        status: "forwarded",
        forwardedDate: now,
        clientNotifiedDate: now,
        digitalDocumentUrl: digitalUrl,
        handledBy,
        updatedAt: now
      })
      .where(eq(receivedDocuments.id, documentId));

    await this.createAuditLog(documentId, "forwarded", handledBy, 
      "Document forwarded to client and notification sent");
  }

  async getDocumentsForEntity(businessEntityId: number): Promise<ReceivedDocument[]> {
    return await db
      .select()
      .from(receivedDocuments)
      .where(eq(receivedDocuments.businessEntityId, businessEntityId))
      .orderBy(desc(receivedDocuments.receivedDate));
  }

  async getDocumentAuditTrail(documentId: number): Promise<any[]> {
    return await db
      .select()
      .from(documentAuditLog)
      .where(eq(documentAuditLog.documentId, documentId))
      .orderBy(documentAuditLog.timestamp);
  }

  private async createAuditLog(
    documentId: number, 
    action: string, 
    performedBy: string, 
    details: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await db
      .insert(documentAuditLog)
      .values({
        documentId,
        action,
        performedBy,
        details,
        ipAddress,
        userAgent
      });
  }

  async getAgentInfo(state: string): Promise<{
    address: RegisteredAgentAddress | null;
    pricing: { annual: number; setup: number };
    services: string[];
  }> {
    const address = this.parafortAddresses.get(state);
    
    return {
      address: address || null,
      pricing: {
        annual: 199, // Annual subscription fee
        setup: 0     // No setup fee
      },
      services: [
        "Receive legal documents and official correspondence",
        "Scan and digitize all received documents",
        "Immediate email and dashboard notifications",
        "Secure document storage and forwarding",
        "Annual report reminders and compliance alerts",
        "Professional business address in state of registration",
        "Regular business hours availability (9 AM - 5 PM EST)"
      ]
    };
  }

  generateConsentDocument(entity: BusinessEntity, agentAddress: RegisteredAgentAddress): string {
    return `
CONSENT TO APPOINTMENT AS REGISTERED AGENT

I, ParaFort Registered Agent Services, hereby consent to serve as the registered agent for ${entity.name}, a ${entity.entityType} organized under the laws of ${entity.state}.

Registered Agent Information:
Name: ParaFort Registered Agent Services
Address: ${agentAddress.streetAddress}
         ${agentAddress.city}, ${entity.state} ${agentAddress.zipCode}
Phone: ${agentAddress.phoneNumber}
Business Hours: ${agentAddress.businessHours}

Services Provided:
- Receipt of legal documents and official correspondence
- Digital scanning and secure storage of all documents
- Immediate notification to client upon document receipt
- Professional forwarding of all received materials
- Compliance monitoring and reminder services

This consent is effective as of ${new Date().toLocaleDateString()} and shall remain in effect until terminated in accordance with state law and the service agreement.

ParaFort Registered Agent Services
Date: ${new Date().toLocaleDateString()}
    `.trim();
  }

  categorizeDocument(documentTitle: string, senderName: string): {
    type: string;
    category: string;
    urgencyLevel: string;
  } {
    const title = documentTitle.toLowerCase();
    const sender = senderName.toLowerCase();

    // Legal documents - high urgency
    if (title.includes('subpoena') || title.includes('summons') || title.includes('lawsuit')) {
      return { type: 'legal_notice', category: 'subpoena', urgencyLevel: 'urgent' };
    }

    if (title.includes('court') || sender.includes('court')) {
      return { type: 'court_document', category: 'legal_proceeding', urgencyLevel: 'urgent' };
    }

    // Tax documents - medium to high urgency
    if (sender.includes('irs') || sender.includes('tax') || title.includes('tax')) {
      return { type: 'tax_notice', category: 'tax_assessment', urgencyLevel: 'urgent' };
    }

    // State compliance - medium urgency
    if (title.includes('annual report') || title.includes('franchise tax')) {
      return { type: 'annual_report', category: 'compliance_notice', urgencyLevel: 'normal' };
    }

    if (sender.includes('secretary of state') || sender.includes('state of')) {
      return { type: 'legal_notice', category: 'compliance_notice', urgencyLevel: 'normal' };
    }

    // Default categorization
    return { type: 'other', category: 'general_correspondence', urgencyLevel: 'normal' };
  }
}

export const registeredAgentService = new RegisteredAgentService();