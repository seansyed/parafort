import {
  users,
  passwordResets,
  businessEntities,
  registeredAgentAddresses,
  registeredAgentConsent,
  receivedDocuments,
  documentAuditLog,
  einApplications,
  einVerifications,
  documents,
  bookkeepingDocuments,
  payrollDocuments,
  documentRequests,
  userMailboxSubscriptions,
  type User,
  type UpsertUser,
  type BusinessEntity,
  type InsertBusinessEntity,
  type UpdateBusinessEntity,
  type RegisteredAgentAddress,
  type InsertRegisteredAgentAddress,
  type RegisteredAgentConsent,
  type InsertRegisteredAgentConsent,
  type ReceivedDocument,
  // type InsertReceivedDocument,
  type EinApplication,
  type InsertEinApplication,
  type EinVerification,
  type InsertEinVerification,
  type Document,
  type InsertDocument,
  type BookkeepingDocument,
  type InsertBookkeepingDocument,
  type PayrollDocument,
  type InsertPayrollDocument,
  type DocumentRequest,
  type InsertDocumentRequest,
  type UserMailboxSubscription,
  type InsertUserMailboxSubscription,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gt } from "drizzle-orm";

// Generate a 12-digit numeric client ID
function generateClientId(): string {
  // Generate a random 12-digit number, ensuring it starts with at least one non-zero digit
  const min = 100000000000; // 12 digits minimum
  const max = 999999999999; // 12 digits maximum
  const clientId = Math.floor(Math.random() * (max - min + 1)) + min;
  return clientId.toString().padStart(12, '0');
}

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  
  // Order and subscription operations
  createOrder(orderData: any): Promise<any>;
  createMailboxSubscription(subscriptionData: InsertUserMailboxSubscription): Promise<UserMailboxSubscription>;
  getMailboxPlan(planId: number): Promise<any>;
  getService(serviceId: number): Promise<any>;
  
  // Business entity operations
  getBusinessEntities(userId: string): Promise<BusinessEntity[]>;
  getBusinessEntity(id: string | number, userId: string): Promise<BusinessEntity | undefined>;
  createBusinessEntity(entity: InsertBusinessEntity): Promise<BusinessEntity>;
  updateBusinessEntity(id: string | number, userId: string, updates: UpdateBusinessEntity): Promise<BusinessEntity | undefined>;
  deleteBusinessEntity(id: string, userId: string): Promise<boolean>;

  // Registered Agent operations
  getRegisteredAgentAddress(state: string): Promise<RegisteredAgentAddress | undefined>;
  createRegisteredAgentAddress(address: InsertRegisteredAgentAddress): Promise<RegisteredAgentAddress>;
  getAgentConsent(businessEntityId: number): Promise<RegisteredAgentConsent | undefined>;
  createAgentConsent(consent: InsertRegisteredAgentConsent): Promise<RegisteredAgentConsent>;
  getReceivedDocuments(businessEntityId: number): Promise<ReceivedDocument[]>;
  // createReceivedDocument(document: InsertReceivedDocument): Promise<ReceivedDocument>;

  // EIN operations
  getEinApplications(businessEntityId: number): Promise<EinApplication[]>;
  createEinApplication(application: InsertEinApplication): Promise<EinApplication>;
  updateEinApplication(id: number, updates: Partial<InsertEinApplication>): Promise<EinApplication | undefined>;
  getEinVerifications(businessEntityId: number): Promise<EinVerification[]>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocuments(userId: string, serviceType?: string): Promise<Document[]>;
  getDocument(id: number, userId: string): Promise<Document | undefined>;
  deleteDocument(id: number, userId: string): Promise<boolean>;
  
  // Bookkeeping document operations
  createBookkeepingDocument(document: InsertBookkeepingDocument): Promise<BookkeepingDocument>;
  getBookkeepingDocuments(businessEntityId: number): Promise<BookkeepingDocument[]>;
  getBookkeepingDocument(id: number): Promise<BookkeepingDocument | undefined>;
  deleteBookkeepingDocument(id: number): Promise<boolean>;
  
  // Payroll document operations
  createPayrollDocument(document: InsertPayrollDocument): Promise<PayrollDocument>;
  getPayrollDocuments(businessEntityId: number): Promise<PayrollDocument[]>;
  getPayrollDocument(id: number): Promise<PayrollDocument | undefined>;
  deletePayrollDocument(id: number): Promise<boolean>;
  createEinVerification(verification: InsertEinVerification): Promise<EinVerification>;

  // Document request operations
  createDocumentRequest(request: InsertDocumentRequest): Promise<DocumentRequest>;
  getDocumentRequests(): Promise<DocumentRequest[]>;
  getDocumentRequestsByClient(clientId: string): Promise<DocumentRequest[]>;
  updateDocumentRequest(id: number, updates: Partial<InsertDocumentRequest>): Promise<DocumentRequest | undefined>;

  // Stripe operations
  updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<User>;
  
  // Password operations
  updateUserPassword(email: string, password: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUser(userData.id);
    
    if (existingUser) {
      // Check if existing user needs a client ID
      let clientId = existingUser.clientId;
      
      if (!clientId) {
        // Generate unique client ID for existing user
        let isUnique = false;
        do {
          clientId = generateClientId();
          const existingClientId = await db
            .select()
            .from(users)
            .where(eq(users.clientId, clientId))
            .limit(1);
          isUnique = existingClientId.length === 0;
        } while (!isUnique);
      }
      
      // Update existing user
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          clientId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id))
        .returning();
      return user;
    } else {
      // Create new user with client ID
      let clientId: string;
      let isUnique = false;
      
      // Ensure unique client ID
      do {
        clientId = generateClientId();
        const existingClientId = await db
          .select()
          .from(users)
          .where(eq(users.clientId, clientId))
          .limit(1);
        isUnique = existingClientId.length === 0;
      } while (!isUnique);
      
      const [user] = await db
        .insert(users)
        .values({
          ...userData,
          clientId,
        })
        .returning();
      return user;
    }
  }

  async createUser(userData: UpsertUser): Promise<User> {
    // Generate unique client ID for new user
    let clientId: string;
    let isUnique = false;
    
    do {
      clientId = generateClientId();
      const existingClientId = await db
        .select()
        .from(users)
        .where(eq(users.clientId, clientId))
        .limit(1);
      isUnique = existingClientId.length === 0;
    } while (!isUnique);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        clientId,
      })
      .returning();
    return user;
  }

  // Order and subscription operations
  async createOrder(orderData: any): Promise<any> {
    // For now, return a simple order object
    // This would be implemented with proper order tables in the schema
    return {
      id: Math.floor(Math.random() * 1000000),
      ...orderData,
      createdAt: new Date(),
    };
  }

  async createMailboxSubscription(subscriptionData: InsertUserMailboxSubscription): Promise<UserMailboxSubscription> {
    const [subscription] = await db
      .insert(userMailboxSubscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  async getMailboxPlan(planId: number): Promise<any> {
    // Return mock mailbox plan data for now
    const plans = [
      { id: 1, name: "Basic", monthlyPrice: 25 },
      { id: 2, name: "Growing", monthlyPrice: 50 },
      { id: 3, name: "Enterprise", monthlyPrice: 100 }
    ];
    return plans.find(plan => plan.id === planId);
  }

  // Password Reset methods
  async storePasswordReset(email: string, resetCode: string, expiresAt: Date): Promise<void> {
    console.log(`Storing password reset for ${email} with code ${resetCode}`);
    try {
      await db.insert(passwordResets).values({
        email,
        resetCode,
        expiresAt,
        used: false
      }).onConflictDoUpdate({
        target: passwordResets.email,
        set: {
          resetCode,
          expiresAt,
          used: false,
          createdAt: new Date()
        }
      });
      console.log(`Password reset stored successfully for ${email}`);
    } catch (error) {
      console.error('Error storing password reset:', error);
      throw error;
    }
  }

  async verifyPasswordReset(email: string, resetCode: string): Promise<boolean> {
    const [reset] = await db.select()
      .from(passwordResets)
      .where(and(
        eq(passwordResets.email, email),
        eq(passwordResets.resetCode, resetCode),
        eq(passwordResets.used, false),
        gt(passwordResets.expiresAt, new Date())
      ));
    
    if (reset) {
      // Mark as used
      await db.update(passwordResets)
        .set({ used: true })
        .where(eq(passwordResets.email, email));
      return true;
    }
    return false;
  }

  async clearPasswordReset(email: string): Promise<void> {
    await db.delete(passwordResets)
      .where(eq(passwordResets.email, email));
  }



  async getService(serviceId: number): Promise<any> {
    // Return mock service data for now
    const services = [
      { id: 1, name: "Business Formation", oneTimePrice: 299 },
      { id: 2, name: "EIN Application", oneTimePrice: 99 },
      { id: 3, name: "Registered Agent", oneTimePrice: 149 },
      { id: 5, name: "Annual Report Filing", oneTimePrice: 199 },
      { id: 6, name: "Operating Agreement", oneTimePrice: 299 },
      { id: 9, name: "Legal Documents", oneTimePrice: 199 },
      { id: 10, name: "S-Corp Election", oneTimePrice: 149 },
      { id: 11, name: "BOIR Filing", oneTimePrice: 199 },
      { id: 16, name: "Business Formation", oneTimePrice: 399 },
      { id: 17, name: "EIN Service", oneTimePrice: 99 },
      { id: 30, name: "Documents", oneTimePrice: 99 }
    ];
    return services.find(service => service.id === serviceId);
  }

  // Business entity operations
  async getBusinessEntities(userId: string): Promise<BusinessEntity[]> {
    const numericUserId = parseInt(userId, 10);
    return await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.userId, numericUserId))
      .orderBy(businessEntities.createdAt);
  }

  async getBusinessEntity(id: string | number, userId: string): Promise<BusinessEntity | undefined> {
    // Convert IDs to number for database query
    const numericId = typeof id === 'number' ? id : parseInt(id, 10);
    const numericUserId = parseInt(userId, 10);
    
    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(and(eq(businessEntities.id, numericId), eq(businessEntities.userId, numericUserId)));
    return entity;
  }

  async createBusinessEntity(entity: InsertBusinessEntity): Promise<BusinessEntity> {
    const [newEntity] = await db
      .insert(businessEntities)
      .values(entity)
      .returning();
    return newEntity;
  }

  async updateBusinessEntity(id: string | number, userId: string, updates: UpdateBusinessEntity): Promise<BusinessEntity | undefined> {
    // Convert IDs to number for database query
    const numericId = typeof id === 'number' ? id : parseInt(id, 10);
    const numericUserId = parseInt(userId, 10);
    
    const [updatedEntity] = await db
      .update(businessEntities)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(businessEntities.id, numericId), eq(businessEntities.userId, numericUserId)))
      .returning();
    return updatedEntity;
  }

  async deleteBusinessEntity(id: string, userId: string): Promise<boolean> {
    const numericId = parseInt(id, 10);
    const numericUserId = parseInt(userId, 10);
    const result = await db
      .delete(businessEntities)
      .where(and(eq(businessEntities.id, numericId), eq(businessEntities.userId, numericUserId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Registered Agent operations
  async getRegisteredAgentAddress(state: string): Promise<RegisteredAgentAddress | undefined> {
    const [address] = await db
      .select()
      .from(registeredAgentAddresses)
      .where(eq(registeredAgentAddresses.state, state));
    return address;
  }

  async createRegisteredAgentAddress(address: InsertRegisteredAgentAddress): Promise<RegisteredAgentAddress> {
    const [newAddress] = await db
      .insert(registeredAgentAddresses)
      .values(address)
      .returning();
    return newAddress;
  }

  async getAgentConsent(businessEntityId: number): Promise<RegisteredAgentConsent | undefined> {
    const [consent] = await db
      .select()
      .from(registeredAgentConsent)
      .where(eq(registeredAgentConsent.businessEntityId, businessEntityId));
    return consent;
  }

  async createAgentConsent(consent: InsertRegisteredAgentConsent): Promise<RegisteredAgentConsent> {
    const [newConsent] = await db
      .insert(registeredAgentConsent)
      .values(consent)
      .returning();
    return newConsent;
  }

  async getReceivedDocuments(businessEntityId: number): Promise<ReceivedDocument[]> {
    return await db
      .select()
      .from(receivedDocuments)
      .where(eq(receivedDocuments.businessEntityId, businessEntityId))
      .orderBy(desc(receivedDocuments.receivedDate));
  }

  // async createReceivedDocument(document: InsertReceivedDocument): Promise<ReceivedDocument> {
  //   const [newDocument] = await db
  //     .insert(receivedDocuments)
  //     .values(document)
  //     .returning();
  //   return newDocument;
  // }

  // EIN operations
  async getEinApplications(businessEntityId: number): Promise<EinApplication[]> {
    return await db
      .select()
      .from(einApplications)
      .where(eq(einApplications.businessEntityId, businessEntityId))
      .orderBy(einApplications.createdAt);
  }

  async createEinApplication(application: InsertEinApplication): Promise<EinApplication> {
    const [newApplication] = await db
      .insert(einApplications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateEinApplication(id: number, updates: Partial<InsertEinApplication>): Promise<EinApplication | undefined> {
    const [updatedApplication] = await db
      .update(einApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(einApplications.id, id))
      .returning();
    return updatedApplication;
  }

  async getEinVerifications(businessEntityId: number): Promise<EinVerification[]> {
    return await db
      .select()
      .from(einVerifications)
      .where(eq(einVerifications.businessEntityId, businessEntityId))
      .orderBy(einVerifications.createdAt);
  }

  async createEinVerification(verification: InsertEinVerification): Promise<EinVerification> {
    const [newVerification] = await db
      .insert(einVerifications)
      .values(verification)
      .returning();
    return newVerification;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values(document)
      .returning();
    return newDocument;
  }

  async getDocuments(userId: string, serviceType?: string): Promise<Document[]> {
    if (serviceType) {
      return await db
        .select()
        .from(documents)
        .where(and(eq(documents.userId, userId), eq(documents.serviceType, serviceType)))
        .orderBy(desc(documents.createdAt));
    }
    
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async getDocument(id: number, userId: string): Promise<Document | undefined> {
    const [document] = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));
    return document;
  }

  async deleteDocument(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Bookkeeping document operations
  async createBookkeepingDocument(document: InsertBookkeepingDocument): Promise<BookkeepingDocument> {
    const [newDocument] = await db
      .insert(bookkeepingDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async getBookkeepingDocuments(businessEntityId: number): Promise<BookkeepingDocument[]> {
    return await db
      .select()
      .from(bookkeepingDocuments)
      .where(eq(bookkeepingDocuments.businessEntityId, businessEntityId))
      .orderBy(desc(bookkeepingDocuments.createdAt));
  }

  async getBookkeepingDocument(id: number): Promise<BookkeepingDocument | undefined> {
    const [document] = await db
      .select()
      .from(bookkeepingDocuments)
      .where(eq(bookkeepingDocuments.id, id));
    return document;
  }

  async deleteBookkeepingDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(bookkeepingDocuments)
      .where(eq(bookkeepingDocuments.id, id))
      .returning();
    return result.length > 0;
  }

  // Payroll document operations
  async createPayrollDocument(document: InsertPayrollDocument): Promise<PayrollDocument> {
    const [newDocument] = await db
      .insert(payrollDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async getPayrollDocuments(businessEntityId: number): Promise<PayrollDocument[]> {
    return await db
      .select()
      .from(payrollDocuments)
      .where(eq(payrollDocuments.businessEntityId, businessEntityId))
      .orderBy(desc(payrollDocuments.createdAt));
  }

  async getPayrollDocument(id: number): Promise<PayrollDocument | undefined> {
    const [document] = await db
      .select()
      .from(payrollDocuments)
      .where(eq(payrollDocuments.id, id));
    return document;
  }

  async deletePayrollDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(payrollDocuments)
      .where(eq(payrollDocuments.id, id))
      .returning();
    return result.length > 0;
  }

  // Document request operations
  async createDocumentRequest(request: InsertDocumentRequest): Promise<DocumentRequest> {
    const [documentRequest] = await db
      .insert(documentRequests)
      .values(request)
      .returning();
    return documentRequest;
  }

  async getDocumentRequests(): Promise<DocumentRequest[]> {
    return await db.select().from(documentRequests);
  }

  async getDocumentRequestsByClient(clientId: string): Promise<DocumentRequest[]> {
    return await db
      .select()
      .from(documentRequests)
      .where(eq(documentRequests.clientId, clientId));
  }

  async updateDocumentRequest(id: number, updates: Partial<InsertDocumentRequest>): Promise<DocumentRequest | undefined> {
    const [updatedRequest] = await db
      .update(documentRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documentRequests.id, id))
      .returning();
    return updatedRequest;
  }

  // Stripe operations
  async updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        stripeCustomerId: stripeInfo.customerId,
        stripeSubscriptionId: stripeInfo.subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async updateUserPassword(email: string, password: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        password: password,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning();
    return updatedUser;
  }
}

export const storage = new DatabaseStorage();
