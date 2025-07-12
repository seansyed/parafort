import { eq, and, desc, sql, isNull, or } from "drizzle-orm";
import { db } from "./db";
import { 
  documents, 
  documentVersions, 
  documentShares, 
  documentComments, 
  documentTags, 
  documentTagAssignments,
  documentTemplates 
} from "@shared/schema";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { geminiService } from "./geminiService";

export interface DocumentUploadData {
  userId: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  serviceType: string;
  category?: string;
  uploadedBy: string;
  uploadedByAdmin?: boolean;
  businessEntityId?: number;
}

export interface DocumentShareData {
  documentId: number;
  sharedWithUserId?: string;
  sharedWithEmail?: string;
  permission: 'view' | 'edit' | 'download';
  expiresAt?: Date;
  isPasswordProtected?: boolean;
  password?: string;
}

export interface DocumentVersionData {
  documentId: number;
  versionNumber: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  changeDescription?: string;
  createdBy: string;
}

class DocumentService {
  // Generate file hash for integrity verification
  private generateFileHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  // Generate secure share token
  private generateShareToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password for protected shares
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Create a new document with enhanced features
  async createDocument(data: DocumentUploadData) {
    try {
      // Generate file hash for integrity
      const fileHash = this.generateFileHash(data.filePath);

      // Process document with AI if it's a PDF or image
      let extractedText = null;
      let aiTags: string[] = [];
      let aiConfidenceScore = null;

      if (data.mimeType.includes('pdf') || data.mimeType.includes('image')) {
        try {
          const aiAnalysis = await this.processDocumentWithAI(data.filePath, data.mimeType);
          extractedText = aiAnalysis.extractedText;
          aiTags = aiAnalysis.tags;
          aiConfidenceScore = aiAnalysis.confidenceScore;
        } catch (error) {
          console.log('AI processing failed, continuing without AI metadata:', error);
        }
      }

      // Create document record
      const [document] = await db
        .insert(documents)
        .values({
          userId: data.userId,
          businessEntityId: data.businessEntityId,
          fileName: data.fileName,
          originalFileName: data.originalFileName,
          filePath: data.filePath,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          fileHash,
          documentType: data.documentType,
          serviceType: data.serviceType,
          category: data.category,
          extractedText,
          aiTags,
          aiConfidenceScore,
          uploadedBy: data.uploadedBy,
          uploadedByAdmin: data.uploadedByAdmin || false,
          version: 1,
          isLatestVersion: true,
          workflowStage: 'uploaded',
          status: 'active'
        })
        .returning();

      // Create initial version record
      await this.createDocumentVersion({
        documentId: document.id,
        versionNumber: 1,
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        changeDescription: 'Initial upload',
        createdBy: data.uploadedBy
      });

      // Auto-assign system tags based on AI analysis
      if (aiTags.length > 0) {
        await this.assignSystemTags(document.id, aiTags, data.uploadedBy);
      }

      return document;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Process document with AI for text extraction and categorization
  private async processDocumentWithAI(filePath: string, mimeType: string) {
    try {
      let extractedText = '';
      let tags: string[] = [];
      let confidenceScore = 0;

      if (mimeType.includes('image')) {
        // Process image with Gemini Vision
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString('base64');
        
        const visionResult = await geminiService.analyzeDocument(base64Image);
        extractedText = visionResult.extractedText || '';
        tags = visionResult.suggestedTags || [];
        confidenceScore = visionResult.confidence || 0;
      } else if (mimeType.includes('pdf')) {
        // For PDF processing, we would typically use a PDF parser
        // For now, we'll use basic categorization
        tags = this.categorizeByFileName(path.basename(filePath));
        confidenceScore = 0.7;
      }

      return {
        extractedText,
        tags,
        confidenceScore: Math.min(confidenceScore, 1.0)
      };
    } catch (error) {
      console.error('AI processing error:', error);
      return {
        extractedText: null,
        tags: [],
        confidenceScore: null
      };
    }
  }

  // Basic file categorization based on filename
  private categorizeByFileName(fileName: string): string[] {
    const tags: string[] = [];
    const lowerName = fileName.toLowerCase();

    if (lowerName.includes('invoice')) tags.push('invoice');
    if (lowerName.includes('receipt')) tags.push('receipt');
    if (lowerName.includes('contract')) tags.push('contract');
    if (lowerName.includes('tax')) tags.push('tax-document');
    if (lowerName.includes('payroll')) tags.push('payroll');
    if (lowerName.includes('w2')) tags.push('tax-form', 'w2');
    if (lowerName.includes('1099')) tags.push('tax-form', '1099');
    if (lowerName.includes('financial')) tags.push('financial-statement');
    if (lowerName.includes('report')) tags.push('report');

    return tags;
  }

  // Create document version
  async createDocumentVersion(data: DocumentVersionData) {
    return await db
      .insert(documentVersions)
      .values(data)
      .returning();
  }

  // Share document with user or external email
  async shareDocument(data: DocumentShareData) {
    const shareToken = this.generateShareToken();
    const passwordHash = data.password ? this.hashPassword(data.password) : null;

    const [share] = await db
      .insert(documentShares)
      .values({
        documentId: data.documentId,
        sharedWithUserId: data.sharedWithUserId,
        sharedWithEmail: data.sharedWithEmail,
        permission: data.permission,
        expiresAt: data.expiresAt,
        isPasswordProtected: data.isPasswordProtected || false,
        passwordHash,
        shareToken,
        createdBy: data.sharedWithUserId || 'system'
      })
      .returning();

    return { ...share, shareUrl: `/shared/${shareToken}` };
  }

  // Get document with access control
  async getDocument(documentId: number, userId: string) {
    const [document] = await db
      .select()
      .from(documents)
      .where(and(
        eq(documents.id, documentId),
        or(
          eq(documents.userId, userId),
          eq(documents.accessLevel, 'public')
        )
      ));

    if (!document) {
      // Check if user has shared access
      const [sharedAccess] = await db
        .select()
        .from(documentShares)
        .where(and(
          eq(documentShares.documentId, documentId),
          eq(documentShares.sharedWithUserId, userId)
        ));

      if (!sharedAccess) {
        return null;
      }
    }

    // Update access tracking
    await db
      .update(documents)
      .set({
        lastAccessedAt: new Date(),
        lastAccessedBy: userId,
        downloadCount: sql`${documents.downloadCount} + 1`
      })
      .where(eq(documents.id, documentId));

    return document;
  }

  // Get user documents with filtering and pagination
  async getUserDocuments(
    userId: string, 
    options: {
      serviceType?: string;
      documentType?: string;
      status?: string;
      limit?: number;
      offset?: number;
      search?: string;
    } = {}
  ) {
    let query = db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId));

    // Apply filters
    if (options.serviceType) {
      query = query.where(eq(documents.serviceType, options.serviceType));
    }
    if (options.documentType) {
      query = query.where(eq(documents.documentType, options.documentType));
    }
    if (options.status) {
      query = query.where(eq(documents.status, options.status));
    }

    // Apply search
    if (options.search) {
      query = query.where(
        or(
          sql`${documents.originalFileName} ILIKE ${'%' + options.search + '%'}`,
          sql`${documents.extractedText} ILIKE ${'%' + options.search + '%'}`
        )
      );
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.offset(options.offset);
    }

    // Order by creation date
    query = query.orderBy(desc(documents.createdAt));

    return await query;
  }

  // Get document versions
  async getDocumentVersions(documentId: number) {
    return await db
      .select()
      .from(documentVersions)
      .where(eq(documentVersions.documentId, documentId))
      .orderBy(desc(documentVersions.versionNumber));
  }

  // Add comment to document
  async addDocumentComment(
    documentId: number,
    userId: string,
    comment: string,
    isInternal: boolean = true,
    parentCommentId?: number
  ) {
    const [newComment] = await db
      .insert(documentComments)
      .values({
        documentId,
        userId,
        comment,
        isInternal,
        parentCommentId
      })
      .returning();

    return newComment;
  }

  // Get document comments
  async getDocumentComments(documentId: number, includeInternal: boolean = true) {
    let query = db
      .select()
      .from(documentComments)
      .where(eq(documentComments.documentId, documentId));

    if (!includeInternal) {
      query = query.where(eq(documentComments.isInternal, false));
    }

    return await query.orderBy(documentComments.createdAt);
  }

  // Assign tags to document
  private async assignSystemTags(documentId: number, tagNames: string[], assignedBy: string) {
    for (const tagName of tagNames) {
      // Get or create tag
      let [tag] = await db
        .select()
        .from(documentTags)
        .where(eq(documentTags.name, tagName));

      if (!tag) {
        [tag] = await db
          .insert(documentTags)
          .values({
            name: tagName,
            isSystemGenerated: true,
            createdBy: 'system'
          })
          .returning();
      }

      // Assign tag to document
      await db
        .insert(documentTagAssignments)
        .values({
          documentId,
          tagId: tag.id,
          assignedBy
        })
        .onConflictDoNothing();
    }
  }

  // Delete document (soft delete)
  async deleteDocument(documentId: number, userId: string) {
    const [document] = await db
      .select()
      .from(documents)
      .where(and(
        eq(documents.id, documentId),
        eq(documents.userId, userId)
      ));

    if (!document) {
      throw new Error('Document not found or access denied');
    }

    // Soft delete
    await db
      .update(documents)
      .set({
        status: 'deleted',
        updatedAt: new Date()
      })
      .where(eq(documents.id, documentId));

    return { message: 'Document deleted successfully' };
  }

  // Archive document
  async archiveDocument(documentId: number, userId: string) {
    await db
      .update(documents)
      .set({
        status: 'archived',
        updatedAt: new Date()
      })
      .where(and(
        eq(documents.id, documentId),
        eq(documents.userId, userId)
      ));

    return { message: 'Document archived successfully' };
  }

  // Get document analytics
  async getDocumentAnalytics(userId: string) {
    const analytics = await db
      .select({
        totalDocuments: sql<number>`count(*)`,
        totalSize: sql<number>`sum(${documents.fileSize})`,
        avgSize: sql<number>`avg(${documents.fileSize})`,
        serviceType: documents.serviceType,
        status: documents.status
      })
      .from(documents)
      .where(eq(documents.userId, userId))
      .groupBy(documents.serviceType, documents.status);

    return analytics;
  }

  // Verify document integrity
  async verifyDocumentIntegrity(documentId: number) {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId));

    if (!document || !document.fileHash) {
      return { isValid: false, message: 'Document or hash not found' };
    }

    try {
      const currentHash = this.generateFileHash(document.filePath);
      const isValid = currentHash === document.fileHash;

      return {
        isValid,
        message: isValid ? 'Document integrity verified' : 'Document has been modified',
        originalHash: document.fileHash,
        currentHash
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'File not accessible for verification'
      };
    }
  }
}

export const documentService = new DocumentService();