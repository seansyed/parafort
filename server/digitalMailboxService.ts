import { db } from './db';
import { 
  virtualMailboxAddresses,
  mailboxSubscriptions,
  receivedMail,
  mailActions,
  mailNotifications,
  digitalArchive,
  businessEntities,
  type InsertVirtualMailboxAddress,
  type InsertMailboxSubscription,
  type InsertReceivedMail,
  type InsertMailAction,
  type InsertMailNotification,
  type VirtualMailboxAddress,
  type MailboxSubscription,
  type ReceivedMail,
  type MailAction
} from '@shared/schema';
import { eq, and, desc, asc, sql, gte, lt } from 'drizzle-orm';

// Digital Mailbox Service with API integrations
export class DigitalMailboxService {

  // Initialize available virtual addresses
  async initializeVirtualAddresses(): Promise<void> {
    const addresses: InsertVirtualMailboxAddress[] = [
      {
        addressLine1: "1234 Business Plaza",
        addressLine2: "Suite 100",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        mailboxType: "premium",
        provider: "stable",
        monthlyFee: 4900, // $49/month
        setupFee: 2500, // $25 setup
        features: ["scanning", "forwarding", "shredding", "check_deposit", "certified_mail"],
        businessHours: "Monday-Friday 9AM-6PM EST",
        maxMailItems: 100,
        description: "Premium Manhattan business address with full-service mail handling"
      },
      {
        addressLine1: "5678 Corporate Center",
        addressLine2: "Unit 200",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        mailboxType: "premium",
        provider: "virtualpostmail",
        monthlyFee: 3900, // $39/month
        setupFee: 1500, // $15 setup
        features: ["scanning", "forwarding", "shredding", "check_deposit"],
        businessHours: "Monday-Friday 8AM-7PM PST",
        maxMailItems: 75,
        description: "Beverly Hills business address with comprehensive mail services"
      },
      {
        addressLine1: "910 Financial District",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        mailboxType: "standard",
        provider: "stable",
        monthlyFee: 2900, // $29/month
        setupFee: 1000, // $10 setup
        features: ["scanning", "forwarding", "shredding"],
        businessHours: "Monday-Friday 9AM-5PM CST",
        maxMailItems: 50,
        description: "Downtown Chicago address with essential mail services"
      },
      {
        addressLine1: "1122 Tech Hub",
        addressLine2: "Floor 3",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        mailboxType: "standard",
        provider: "virtualpostmail",
        monthlyFee: 2500, // $25/month
        setupFee: 500, // $5 setup
        features: ["scanning", "forwarding"],
        businessHours: "Monday-Friday 9AM-6PM CST",
        maxMailItems: 40,
        description: "Austin tech district address with digital-first approach"
      },
      {
        addressLine1: "3344 Innovation Way",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        mailboxType: "budget",
        provider: "stable",
        monthlyFee: 1900, // $19/month
        setupFee: 0,
        features: ["scanning", "forwarding"],
        businessHours: "Monday-Friday 10AM-4PM EST",
        maxMailItems: 25,
        description: "Affordable Miami business address with basic services"
      }
    ];

    // Check if addresses already exist
    const existingAddresses = await db.select().from(virtualMailboxAddresses);
    if (existingAddresses.length === 0) {
      await db.insert(virtualMailboxAddresses).values(addresses);
    }
  }

  // Get available virtual addresses
  async getAvailableAddresses(): Promise<VirtualMailboxAddress[]> {
    return await db
      .select()
      .from(virtualMailboxAddresses)
      .where(eq(virtualMailboxAddresses.isAvailable, true))
      .orderBy(asc(virtualMailboxAddresses.monthlyFee));
  }

  // Create mailbox subscription
  async createSubscription(data: InsertMailboxSubscription): Promise<MailboxSubscription> {
    // Simulate external API setup
    const apiAccountId = `mb_${Math.random().toString(36).substr(2, 9)}`;
    const mailboxNumber = `PMB${Math.floor(1000 + Math.random() * 9000)}`;

    const [subscription] = await db
      .insert(mailboxSubscriptions)
      .values({
        ...data,
        apiAccountId,
        mailboxNumber,
        apiAccessToken: 'encrypted_token_placeholder', // In production, encrypt this
      })
      .returning();

    // Initialize default settings
    await this.updateSubscriptionSettings(subscription.id, {
      notificationPreferences: {
        email: true,
        sms: false,
        webhook: false,
        emailAddress: 'user@example.com'
      },
      scanningPreferences: {
        autoScan: true,
        scanContents: true,
        ocrEnabled: true,
        archiveAfterScan: false
      },
      forwardingRules: {
        autoForward: false,
        forwardAddress: null,
        forwardCriteria: []
      }
    });

    return subscription;
  }

  // Update subscription settings
  async updateSubscriptionSettings(subscriptionId: number, settings: any): Promise<MailboxSubscription> {
    const [subscription] = await db
      .update(mailboxSubscriptions)
      .set({
        notificationPreferences: JSON.stringify(settings.notificationPreferences || {}),
        scanningPreferences: JSON.stringify(settings.scanningPreferences || {}),
        forwardingRules: JSON.stringify(settings.forwardingRules || {}),
        updatedAt: new Date()
      })
      .where(eq(mailboxSubscriptions.id, subscriptionId))
      .returning();

    return subscription;
  }

  // Get subscription for business entity
  async getSubscription(businessEntityId: number): Promise<MailboxSubscription | null> {
    const [subscription] = await db
      .select()
      .from(mailboxSubscriptions)
      .where(
        and(
          eq(mailboxSubscriptions.businessEntityId, businessEntityId),
          eq(mailboxSubscriptions.subscriptionStatus, 'active')
        )
      );

    return subscription || null;
  }

  // Simulate receiving mail from external provider
  async simulateMailReceival(subscriptionId: number): Promise<ReceivedMail> {
    const sampleMail = this.generateSampleMail();
    
    const [mail] = await db
      .insert(receivedMail)
      .values({
        subscriptionId,
        externalMailId: `mail_${Math.random().toString(36).substr(2, 9)}`,
        senderName: sampleMail.senderName,
        senderAddress: sampleMail.senderAddress,
        recipientName: sampleMail.recipientName,
        mailType: sampleMail.mailType,
        mailCategory: sampleMail.mailCategory,
        priority: sampleMail.priority,
        receivedDate: new Date(),
        scanStatus: 'pending',
        envelopeImageUrl: sampleMail.envelopeImageUrl,
      })
      .returning();

    // Trigger OCR processing
    await this.processMailWithOCR(mail.id);

    // Send notification
    await this.sendMailNotification(subscriptionId, mail.id, 'new_mail');

    return mail;
  }

  // OCR processing with Mindee API simulation
  async processMailWithOCR(mailId: number): Promise<void> {
    try {
      const [mail] = await db
        .select()
        .from(receivedMail)
        .where(eq(receivedMail.id, mailId));

      if (!mail) {
        throw new Error('Mail not found');
      }

      // Simulate OCR processing
      const ocrResult = await this.performOCR(mail.envelopeImageUrl);
      
      // Update mail with OCR results
      await db
        .update(receivedMail)
        .set({
          scanStatus: 'scanned',
          ocrText: ocrResult.text,
          extractedData: JSON.stringify(ocrResult.extractedData),
          contentImageUrls: ocrResult.contentImages,
          pdfUrl: ocrResult.pdfUrl,
          relatedModules: ocrResult.relatedModules,
          actionDate: new Date(),
          updatedAt: new Date()
        })
        .where(eq(receivedMail.id, mailId));

      // Create cross-module connections
      await this.createCrossModuleConnections(mailId, ocrResult.extractedData);

    } catch (error) {
      console.error('OCR processing failed:', error);
      await db
        .update(receivedMail)
        .set({
          scanStatus: 'failed',
          updatedAt: new Date()
        })
        .where(eq(receivedMail.id, mailId));
    }
  }

  // Simulate Mindee OCR API
  private async performOCR(imageUrl: string | null): Promise<any> {
    // In production, this would call the actual Mindee US Mail OCR API
    const sampleOCRResult = {
      text: "Internal Revenue Service\n1234 Main Street\nAnytown, ST 12345\n\nIMPORTANT TAX NOTICE\nEntity: Sample Business LLC\nEIN: 12-3456789\nDue Date: March 15, 2024\nAmount Due: $1,250.00",
      extractedData: {
        senderType: "government",
        senderName: "Internal Revenue Service",
        documentType: "tax_notice",
        entityName: "Sample Business LLC",
        ein: "12-3456789",
        dueDate: "2024-03-15",
        amountDue: 125000, // cents
        urgency: "high",
        keywords: ["tax", "due", "IRS", "payment", "deadline"],
        confidence: 0.95
      },
      contentImages: [
        "https://example.com/scanned/page1.jpg",
        "https://example.com/scanned/page2.jpg"
      ],
      pdfUrl: "https://example.com/scanned/document.pdf",
      relatedModules: ["tax-compliance", "annual-report-filing"]
    };

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    return sampleOCRResult;
  }

  // Create connections to other ParaFort modules
  private async createCrossModuleConnections(mailId: number, extractedData: any): Promise<void> {
    if (extractedData.documentType === 'tax_notice' && extractedData.ein) {
      // Link to annual report filing module
      console.log(`Linking mail ${mailId} to annual report filing for EIN ${extractedData.ein}`);
    }
    
    if (extractedData.documentType === 'legal_notice') {
      // Link to legal document module
      console.log(`Linking mail ${mailId} to legal document tracking`);
    }

    if (extractedData.senderType === 'government' && extractedData.keywords?.includes('license')) {
      // Link to business license module
      console.log(`Linking mail ${mailId} to business license compliance`);
    }
  }

  // Perform mail actions
  async performMailAction(mailId: number, actionType: string, actionDetails: any, createdBy: string): Promise<MailAction> {
    const [action] = await db
      .insert(mailActions)
      .values({
        mailId,
        actionType,
        actionStatus: 'pending',
        actionDetails: JSON.stringify(actionDetails),
        cost: this.calculateActionCost(actionType),
        createdBy
      })
      .returning();

    // Simulate action processing
    setTimeout(async () => {
      await this.completeMailAction(action.id, actionType, actionDetails);
    }, 3000);

    return action;
  }

  // Complete mail action
  private async completeMailAction(actionId: number, actionType: string, actionDetails: any): Promise<void> {
    try {
      let updateData: any = {
        actionStatus: 'completed',
        completedAt: new Date(),
        externalActionId: `ext_${Math.random().toString(36).substr(2, 9)}`
      };

      if (actionType === 'forward') {
        // Simulate forwarding process
        updateData.actionDetails = JSON.stringify({
          ...actionDetails,
          trackingNumber: `TRK${Math.floor(100000 + Math.random() * 900000)}`
        });
      } else if (actionType === 'deposit_check') {
        // Simulate check deposit
        updateData.actionDetails = JSON.stringify({
          ...actionDetails,
          depositId: `DEP${Math.floor(100000 + Math.random() * 900000)}`,
          expectedAvailability: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        });
      }

      await db
        .update(mailActions)
        .set(updateData)
        .where(eq(mailActions.id, actionId));

    } catch (error) {
      await db
        .update(mailActions)
        .set({
          actionStatus: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        })
        .where(eq(mailActions.id, actionId));
    }
  }

  // Calculate action costs
  private calculateActionCost(actionType: string): number {
    const costs = {
      scan: 100, // $1.00
      forward: 500, // $5.00
      shred: 50, // $0.50
      store: 25, // $0.25/month
      deposit_check: 300 // $3.00
    };
    return costs[actionType as keyof typeof costs] || 0;
  }

  // Send mail notifications
  async sendMailNotification(subscriptionId: number, mailId: number | null, notificationType: string): Promise<void> {
    const [subscription] = await db
      .select()
      .from(mailboxSubscriptions)
      .where(eq(mailboxSubscriptions.id, subscriptionId));

    if (!subscription) return;

    const preferences = subscription.notificationPreferences ? 
      JSON.parse(subscription.notificationPreferences) : {};

    if (preferences.email) {
      await db.insert(mailNotifications).values({
        subscriptionId,
        mailId,
        notificationType,
        notificationMethod: 'email',
        recipient: preferences.emailAddress || 'user@example.com',
        subject: this.getNotificationSubject(notificationType),
        message: this.getNotificationMessage(notificationType),
        deliveryStatus: 'sent',
        sentAt: new Date()
      });
    }
  }

  // Get mail for subscription
  async getMailForSubscription(subscriptionId: number, filters?: any): Promise<ReceivedMail[]> {
    let query = db
      .select()
      .from(receivedMail)
      .where(eq(receivedMail.subscriptionId, subscriptionId));

    if (filters?.category) {
      query = query.where(eq(receivedMail.mailCategory, filters.category));
    }

    if (filters?.unreadOnly) {
      query = query.where(eq(receivedMail.isRead, false));
    }

    return await query
      .orderBy(desc(receivedMail.receivedDate))
      .limit(filters?.limit || 50);
  }

  // Mark mail as read
  async markMailAsRead(mailId: number): Promise<void> {
    await db
      .update(receivedMail)
      .set({
        isRead: true,
        updatedAt: new Date()
      })
      .where(eq(receivedMail.id, mailId));
  }

  // Archive mail
  async archiveMail(mailId: number, archiveCategory: string): Promise<void> {
    const [mail] = await db
      .select()
      .from(receivedMail)
      .where(eq(receivedMail.id, mailId));

    if (!mail) throw new Error('Mail not found');

    // Move to archive
    await db.insert(digitalArchive).values({
      subscriptionId: mail.subscriptionId,
      mailId: mail.id,
      archiveCategory,
      documentType: this.inferDocumentType(mail.mailCategory, mail.ocrText),
      retentionPeriod: this.getRetentionPeriod(archiveCategory),
      encryptedFileUrl: mail.pdfUrl,
      searchableText: mail.ocrText,
      metadata: JSON.stringify({
        originalSender: mail.senderName,
        receivedDate: mail.receivedDate,
        mailType: mail.mailType
      })
    });

    // Mark as archived
    await db
      .update(receivedMail)
      .set({
        isArchived: true,
        updatedAt: new Date()
      })
      .where(eq(receivedMail.id, mailId));
  }

  // Dashboard data
  async getMailboxDashboard(businessEntityId: number): Promise<any> {
    const subscription = await this.getSubscription(businessEntityId);
    if (!subscription) return null;

    const mail = await this.getMailForSubscription(subscription.id);
    const actions = await this.getRecentActions(subscription.id);

    const summary = {
      totalMail: mail.length,
      unreadMail: mail.filter(m => !m.isRead).length,
      urgentMail: mail.filter(m => m.priority === 'urgent' || m.priority === 'high').length,
      pendingActions: actions.filter(a => a.actionStatus === 'pending').length
    };

    const mailByCategory = mail.reduce((acc, m) => {
      acc[m.mailCategory || 'unknown'] = (acc[m.mailCategory || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      subscription,
      summary,
      recentMail: mail.slice(0, 10),
      mailByCategory,
      recentActions: actions.slice(0, 5)
    };
  }

  // Get recent actions
  private async getRecentActions(subscriptionId: number): Promise<any[]> {
    return await db
      .select({
        action: mailActions,
        mail: receivedMail
      })
      .from(mailActions)
      .innerJoin(receivedMail, eq(mailActions.mailId, receivedMail.id))
      .where(eq(receivedMail.subscriptionId, subscriptionId))
      .orderBy(desc(mailActions.requestedAt))
      .limit(10);
  }

  // Helper methods
  private generateSampleMail() {
    const samples = [
      {
        senderName: "Internal Revenue Service",
        senderAddress: "1234 Tax St, Washington, DC 20001",
        recipientName: "Sample Business LLC",
        mailType: "letter",
        mailCategory: "tax",
        priority: "high",
        envelopeImageUrl: "https://example.com/envelope1.jpg"
      },
      {
        senderName: "State Licensing Board",
        senderAddress: "5678 License Ave, State Capital, ST 12345",
        recipientName: "Sample Business LLC",
        mailType: "certified",
        mailCategory: "legal",
        priority: "urgent",
        envelopeImageUrl: "https://example.com/envelope2.jpg"
      },
      {
        senderName: "First National Bank",
        senderAddress: "910 Banking Blvd, Financial City, ST 54321",
        recipientName: "Sample Business LLC",
        mailType: "statement",
        mailCategory: "business",
        priority: "normal",
        envelopeImageUrl: "https://example.com/envelope3.jpg"
      }
    ];

    return samples[Math.floor(Math.random() * samples.length)];
  }

  private getNotificationSubject(type: string): string {
    const subjects = {
      new_mail: "New Mail Received",
      action_complete: "Mail Action Completed",
      urgent_mail: "Urgent Mail Requires Attention"
    };
    return subjects[type as keyof typeof subjects] || "Mail Notification";
  }

  private getNotificationMessage(type: string): string {
    const messages = {
      new_mail: "You have received new mail at your virtual mailbox.",
      action_complete: "Your requested mail action has been completed.",
      urgent_mail: "You have received urgent mail that requires immediate attention."
    };
    return messages[type as keyof typeof messages] || "Mail notification";
  }

  private inferDocumentType(category: string | null, ocrText: string | null): string {
    if (category === 'tax') return 'tax_document';
    if (category === 'legal') return 'legal_notice';
    if (ocrText?.includes('invoice')) return 'invoice';
    if (ocrText?.includes('contract')) return 'contract';
    return 'general_correspondence';
  }

  private getRetentionPeriod(category: string): number {
    const periods = {
      tax_documents: 2555, // 7 years
      legal_notices: 1825, // 5 years
      business_correspondence: 1095, // 3 years
      personal: 365 // 1 year
    };
    return periods[category as keyof typeof periods] || 1095;
  }
}

export const digitalMailboxService = new DigitalMailboxService();