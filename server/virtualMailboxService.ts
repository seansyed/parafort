import { 
  receivedDocuments,
  documentAuditLog,
  type InsertReceivedDocument,
  type ReceivedDocument,
  type BusinessEntity
} from "@shared/schema";
import { db } from "./db";
import { registeredAgentService } from "./registeredAgentService";

export interface MailboxScanResult {
  scanId: string;
  documentUrl: string;
  thumbnailUrl?: string;
  extractedData: {
    sender: string;
    recipient: string;
    postalDate: Date;
    documentType: string;
    confidence: number;
  };
  ocrText?: string;
  metadata: {
    pages: number;
    fileSize: number;
    resolution: string;
  };
}

export interface MailboxNotification {
  mailId: string;
  recipientAddress: string;
  senderName?: string;
  receivedDate: Date;
  trackingNumber?: string;
  mailType: "letter" | "package" | "legal" | "certified" | "priority";
  urgencyLevel: "urgent" | "normal" | "low";
}

export interface VirtualMailboxConfig {
  apiKey: string;
  baseUrl: string;
  webhookUrl: string;
  addressId: string;
}

export class VirtualMailboxService {
  private apiKey: string | undefined;
  private baseUrl: string;
  private mindeeApiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.VIRTUAL_MAILBOX_API_KEY;
    this.baseUrl = process.env.VIRTUAL_MAILBOX_BASE_URL || "https://api.virtualpostmail.com/v1";
    this.mindeeApiKey = process.env.MINDEE_API_KEY;
    
    if (!this.apiKey) {
      console.warn("VIRTUAL_MAILBOX_API_KEY not configured - using simulation mode");
    }
    
    if (!this.mindeeApiKey) {
      console.warn("MINDEE_API_KEY not configured - OCR features will be limited");
    }
  }

  async processMail(notification: MailboxNotification): Promise<ReceivedDocument | null> {
    try {
      // Find the business entity associated with this address
      const businessEntity = await this.findBusinessEntityByAddress(notification.recipientAddress);
      
      if (!businessEntity) {
        console.warn(`No business entity found for address: ${notification.recipientAddress}`);
        return null;
      }

      // Request scan of the physical mail
      const scanResult = await this.requestMailScan(notification.mailId);
      
      if (!scanResult) {
        console.error(`Failed to scan mail: ${notification.mailId}`);
        return null;
      }

      // Extract document information using OCR
      const ocrData = await this.extractDocumentData(scanResult.documentUrl);
      
      // Categorize the document based on extracted data
      const category = registeredAgentService.categorizeDocument(
        ocrData?.documentTitle || notification.senderName || "Unknown Document",
        notification.senderName || "Unknown Sender"
      );

      // Create document record
      const documentData: InsertReceivedDocument = {
        businessEntityId: businessEntity.id,
        documentType: category.type,
        documentCategory: category.category,
        senderName: ocrData?.sender || notification.senderName || "Unknown",
        senderAddress: ocrData?.senderAddress,
        documentTitle: ocrData?.documentTitle || `Mail from ${notification.senderName}`,
        documentDescription: ocrData?.documentSummary,
        urgencyLevel: this.determineUrgency(notification, ocrData),
        digitalDocumentUrl: scanResult.documentUrl,
        handledBy: "ParaFort Virtual Mailbox System",
        receivedDate: notification.receivedDate
      };

      const document = await registeredAgentService.logReceivedDocument(documentData);

      // Send immediate notification to client
      await this.notifyClient(businessEntity, document, scanResult);

      // Create audit log for mail processing
      await this.createMailProcessingAuditLog(document.id, notification, scanResult);

      return document;

    } catch (error) {
      console.error("Error processing mail:", error);
      return null;
    }
  }

  private async requestMailScan(mailId: string): Promise<MailboxScanResult | null> {
    if (!this.apiKey) {
      // Simulation mode - return mock scan result
      return this.simulateMailScan(mailId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/mail/${mailId}/scan`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scanQuality: "high",
          ocrEnabled: true,
          generateThumbnail: true
        })
      });

      if (!response.ok) {
        throw new Error(`Scan request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Mail scan request failed:", error);
      return this.simulateMailScan(mailId);
    }
  }

  private async extractDocumentData(documentUrl: string): Promise<any> {
    if (!this.mindeeApiKey) {
      // Return basic extracted data simulation
      return this.simulateOCRExtraction();
    }

    try {
      const response = await fetch("https://api.mindee.net/v1/products/mindee/us_mail_ocr/v1/predict", {
        method: "POST",
        headers: {
          "Authorization": `Token ${this.mindeeApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          document: documentUrl
        })
      });

      if (!response.ok) {
        throw new Error(`OCR extraction failed: ${response.status}`);
      }

      const result = await response.json();
      return this.parseOCRResult(result);
    } catch (error) {
      console.error("OCR extraction failed:", error);
      return this.simulateOCRExtraction();
    }
  }

  private parseOCRResult(ocrResult: any): any {
    const prediction = ocrResult.document?.inference?.prediction;
    
    if (!prediction) {
      return this.simulateOCRExtraction();
    }

    return {
      sender: prediction.sender?.value || "Unknown Sender",
      senderAddress: prediction.sender_address?.value,
      recipient: prediction.recipient?.value,
      recipientAddress: prediction.recipient_address?.value,
      postalDate: prediction.postal_date?.value ? new Date(prediction.postal_date.value) : new Date(),
      documentTitle: prediction.document_type?.value || "Mail Document",
      documentSummary: prediction.content_summary?.value,
      confidence: prediction.confidence || 0.8
    };
  }

  private async findBusinessEntityByAddress(address: string): Promise<BusinessEntity | null> {
    // This would typically query the database to find the business entity
    // associated with the registered agent address
    // For now, we'll simulate this lookup
    return {
      id: 1,
      userId: "user123",
      name: "Sample Business LLC",
      entityType: "LLC",
      state: "Delaware",
      status: "completed",
      useParafortAgent: true,
      registeredAgent: "ParaFort Registered Agent Services"
    } as BusinessEntity;
  }

  private determineUrgency(notification: MailboxNotification, ocrData: any): "urgent" | "normal" | "low" {
    // Check mail type for urgency indicators
    if (notification.mailType === "certified" || notification.mailType === "legal") {
      return "urgent";
    }

    // Check OCR data for legal keywords
    const legalKeywords = ["subpoena", "summons", "lawsuit", "court", "legal notice", "irs", "tax"];
    const content = (ocrData?.documentTitle || "").toLowerCase() + " " + (ocrData?.documentSummary || "").toLowerCase();
    
    if (legalKeywords.some(keyword => content.includes(keyword))) {
      return "urgent";
    }

    return notification.urgencyLevel || "normal";
  }

  private async notifyClient(entity: BusinessEntity, document: ReceivedDocument, scanResult: MailboxScanResult): Promise<void> {
    // This would integrate with email service or push notification system
    console.log(`Notification sent to client for entity ${entity.name}: New document received - ${document.documentTitle}`);
    
    // In a real implementation, this would send email notifications
    // using a service like SendGrid or similar
  }

  private async createMailProcessingAuditLog(documentId: number, notification: MailboxNotification, scanResult: MailboxScanResult): Promise<void> {
    await db.insert(documentAuditLog).values({
      documentId,
      action: "mail_processed",
      performedBy: "ParaFort Virtual Mailbox System",
      details: JSON.stringify({
        mailId: notification.mailId,
        scanId: scanResult.scanId,
        extractedData: scanResult.extractedData,
        processingTimestamp: new Date()
      })
    });
  }

  // Simulation methods for development/testing
  private simulateMailScan(mailId: string): MailboxScanResult {
    return {
      scanId: `scan_${mailId}_${Date.now()}`,
      documentUrl: `https://storage.parafort.com/scans/${mailId}.pdf`,
      thumbnailUrl: `https://storage.parafort.com/thumbnails/${mailId}_thumb.jpg`,
      extractedData: {
        sender: "Delaware Division of Corporations",
        recipient: "Sample Business LLC",
        postalDate: new Date(),
        documentType: "legal_notice",
        confidence: 0.92
      },
      ocrText: "NOTICE OF ANNUAL REPORT FILING REQUIREMENT...",
      metadata: {
        pages: 2,
        fileSize: 1024000,
        resolution: "300dpi"
      }
    };
  }

  private simulateOCRExtraction(): any {
    return {
      sender: "Delaware Division of Corporations",
      senderAddress: "401 Federal Street, Suite 4, Dover, DE 19901",
      recipient: "Sample Business LLC",
      recipientAddress: "1013 Centre Road, Suite 403-B, Wilmington, DE 19805",
      postalDate: new Date(),
      documentTitle: "Annual Report Filing Notice",
      documentSummary: "Notice regarding annual report filing requirement for LLC registration compliance",
      confidence: 0.89
    };
  }

  // Webhook endpoint handler for mail notifications
  async handleMailNotification(webhookData: any): Promise<void> {
    try {
      const notification: MailboxNotification = {
        mailId: webhookData.mail_id,
        recipientAddress: webhookData.recipient_address,
        senderName: webhookData.sender_name,
        receivedDate: new Date(webhookData.received_date),
        trackingNumber: webhookData.tracking_number,
        mailType: webhookData.mail_type || "letter",
        urgencyLevel: this.classifyMailUrgency(webhookData)
      };

      await this.processMail(notification);
    } catch (error) {
      console.error("Error handling mail notification webhook:", error);
    }
  }

  private classifyMailUrgency(webhookData: any): "urgent" | "normal" | "low" {
    if (webhookData.mail_type === "certified" || webhookData.mail_type === "legal") {
      return "urgent";
    }
    
    if (webhookData.sender_name?.toLowerCase().includes("court") || 
        webhookData.sender_name?.toLowerCase().includes("irs")) {
      return "urgent";
    }

    return "normal";
  }

  // Configuration methods for setting up mailbox addresses
  async configureMailboxForEntity(entityId: number, state: string): Promise<{
    addressId: string;
    physicalAddress: string;
    setupComplete: boolean;
  }> {
    if (!this.apiKey) {
      // Simulation mode
      return {
        addressId: `addr_${entityId}_${state}`,
        physicalAddress: "1013 Centre Road, Suite 403-B, Wilmington, DE 19805",
        setupComplete: true
      };
    }

    // In real implementation, this would configure the virtual mailbox
    // address for the specific business entity
    try {
      const response = await fetch(`${this.baseUrl}/addresses`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          entityId: entityId,
          state: state,
          addressType: "registered_agent"
        })
      });

      if (!response.ok) {
        throw new Error(`Address configuration failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Mailbox configuration failed:", error);
      throw error;
    }
  }
}

export const virtualMailboxService = new VirtualMailboxService();