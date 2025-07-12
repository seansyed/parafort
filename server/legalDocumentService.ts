import { 
  documentTemplates, 
  generatedDocuments, 
  documentRevisions,
  documentTemplateFields,
  aiDocumentSuggestions,
  businessEntities,
  type DocumentTemplate,
  type InsertDocumentTemplate,
  type GeneratedDocument,
  type InsertGeneratedDocument,
  type DocumentRevision,
  type InsertDocumentRevision,
  type DocumentTemplateField,
  type InsertDocumentTemplateField,
  type AiDocumentSuggestion,
  type InsertAiDocumentSuggestion,
  type BusinessEntity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { storage } from "./storage";
import OpenAI from "openai";

// Interface definitions
export interface DocumentGenerationRequest {
  templateId: number;
  businessEntityId?: number;
  formData: Record<string, any>;
  userId: string;
  enableAiSuggestions?: boolean;
}

export interface GeneratedDocumentResult {
  document: GeneratedDocument;
  content: string;
  aiSuggestions?: AiSuggestion[];
  downloadUrls: {
    docx: string;
    pdf: string;
  };
}

export interface AiSuggestion {
  id: string;
  type: "clause_refinement" | "addition" | "alternative_phrasing";
  originalText?: string;
  suggestedText: string;
  rationale: string;
  confidence: number;
  legalAccuracy: number;
  position: number;
}

export interface ConditionalLogicRule {
  condition: string;
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: any;
  action: "show" | "hide" | "required" | "optional";
  target: string;
}

export interface TemplateVariable {
  name: string;
  type: "text" | "number" | "date" | "currency" | "address" | "list";
  required: boolean;
  defaultValue?: any;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface DocumentExportOptions {
  format: "docx" | "pdf";
  includeMetadata?: boolean;
  watermark?: string;
  headerFooter?: {
    header?: string;
    footer?: string;
  };
}

export class LegalDocumentService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });
    } else {
      console.warn("OpenAI API key not configured - AI features will be limited");
    }
  }

  // Template Management
  async createTemplate(templateData: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const [template] = await db
      .insert(documentTemplates)
      .values(templateData)
      .returning();
    return template;
  }

  async getTemplates(category?: string, industry?: string): Promise<DocumentTemplate[]> {
    let query = db.select().from(documentTemplates).where(eq(documentTemplates.isActive, true));
    
    if (category) {
      query = query.where(eq(documentTemplates.category, category));
    }
    
    const templates = await query;
    
    if (industry) {
      return templates.filter(t => 
        !t.industrySpecific || 
        t.industrySpecific.includes(industry)
      );
    }
    
    return templates;
  }

  async getTemplate(templateId: number): Promise<DocumentTemplate | null> {
    const [template] = await db
      .select()
      .from(documentTemplates)
      .where(eq(documentTemplates.id, templateId));
    return template || null;
  }

  async getTemplateFields(templateId: number): Promise<DocumentTemplateField[]> {
    return await db
      .select()
      .from(documentTemplateFields)
      .where(eq(documentTemplateFields.templateId, templateId))
      .orderBy(documentTemplateFields.fieldOrder);
  }

  // Document Generation
  async generateDocument(request: DocumentGenerationRequest): Promise<GeneratedDocumentResult> {
    const template = await this.getTemplate(request.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    // Get business entity data for auto-population
    let businessEntity: BusinessEntity | null = null;
    if (request.businessEntityId) {
      businessEntity = await storage.getBusinessEntity(request.businessEntityId);
    }

    // Merge auto-populated data with form data
    const enrichedFormData = await this.enrichFormData(request.formData, businessEntity, template);

    // Apply conditional logic
    const processedData = await this.applyConditionalLogic(enrichedFormData, template);

    // Generate document content
    const content = await this.generateDocumentContent(template, processedData);

    // Create document record
    const documentData: InsertGeneratedDocument = {
      userId: request.userId,
      templateId: request.templateId,
      businessEntityId: request.businessEntityId,
      documentName: this.generateDocumentName(template, processedData),
      documentType: template.category,
      formData: JSON.stringify(processedData),
      generatedContent: content,
      documentStatus: "draft"
    };

    const [document] = await db
      .insert(generatedDocuments)
      .values(documentData)
      .returning();

    // Generate AI suggestions if enabled
    let aiSuggestions: AiSuggestion[] = [];
    if (request.enableAiSuggestions && this.openai) {
      aiSuggestions = await this.generateAiSuggestions(document.id, content, processedData);
    }

    // Generate download URLs
    const downloadUrls = await this.generateDownloadUrls(document.id, content);

    return {
      document,
      content,
      aiSuggestions,
      downloadUrls
    };
  }

  // AI-Powered Document Enhancement
  async generateAiSuggestions(documentId: number, content: string, formData: Record<string, any>): Promise<AiSuggestion[]> {
    if (!this.openai) {
      return [];
    }

    try {
      const prompt = this.buildAiSuggestionPrompt(content, formData);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a legal document expert. Analyze the provided document and suggest improvements for legal accuracy, clarity, and completeness. Provide specific suggestions with rationale."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const suggestions = JSON.parse(response.choices[0].message.content || "{}");
      const aiSuggestions: AiSuggestion[] = [];

      for (const suggestion of suggestions.suggestions || []) {
        const aiSuggestion: InsertAiDocumentSuggestion = {
          documentId,
          suggestionType: suggestion.type,
          originalText: suggestion.originalText,
          suggestedText: suggestion.suggestedText,
          rationale: suggestion.rationale,
          confidence: suggestion.confidence,
          legalAccuracy: suggestion.legalAccuracy,
          industry: formData.industry,
          jurisdiction: formData.state || formData.jurisdiction
        };

        const [saved] = await db
          .insert(aiDocumentSuggestions)
          .values(aiSuggestion)
          .returning();

        aiSuggestions.push({
          id: saved.id.toString(),
          type: saved.suggestionType as any,
          originalText: saved.originalText || undefined,
          suggestedText: saved.suggestedText,
          rationale: saved.rationale || "",
          confidence: saved.confidence || 0,
          legalAccuracy: saved.legalAccuracy || 0,
          position: 0
        });
      }

      return aiSuggestions;
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      return [];
    }
  }

  private buildAiSuggestionPrompt(content: string, formData: Record<string, any>): string {
    return `
Please analyze this legal document and provide suggestions for improvement:

Document Content:
${content}

Context:
- Business Type: ${formData.entityType || 'Not specified'}
- Industry: ${formData.industry || 'Not specified'}
- State/Jurisdiction: ${formData.state || formData.jurisdiction || 'Not specified'}
- Document Type: ${formData.documentType || 'Not specified'}

Please provide suggestions in JSON format:
{
  "suggestions": [
    {
      "type": "clause_refinement|addition|alternative_phrasing",
      "originalText": "text to be improved (if applicable)",
      "suggestedText": "improved or additional text",
      "rationale": "explanation for the suggestion",
      "confidence": 85,
      "legalAccuracy": 90,
      "position": 1
    }
  ]
}

Focus on:
1. Legal accuracy and compliance
2. Clarity and readability
3. Missing clauses that should be included
4. Industry-specific considerations
5. State-specific legal requirements
`;
  }

  // Data Integration and Auto-Population
  private async enrichFormData(
    formData: Record<string, any>, 
    businessEntity: BusinessEntity | null, 
    template: DocumentTemplate
  ): Promise<Record<string, any>> {
    const enriched = { ...formData };

    if (businessEntity) {
      // Auto-populate from business entity data
      enriched.companyName = enriched.companyName || businessEntity.legalName;
      enriched.businessName = enriched.businessName || businessEntity.legalName;
      enriched.entityType = enriched.entityType || businessEntity.entityType;
      enriched.state = enriched.state || businessEntity.stateOfIncorporation;
      enriched.address = enriched.address || businessEntity.businessAddress;
      
      // Parse address if it's a string
      if (typeof enriched.address === 'string') {
        enriched.businessAddress = enriched.address;
        const addressParts = enriched.address.split(',').map(p => p.trim());
        if (addressParts.length >= 3) {
          enriched.city = addressParts[addressParts.length - 3];
          enriched.state = addressParts[addressParts.length - 2];
          enriched.zipCode = addressParts[addressParts.length - 1];
        }
      }
    }

    // Get template fields for additional auto-population
    const templateFields = await this.getTemplateFields(template.id);
    
    for (const field of templateFields) {
      if (field.sourceModule && field.sourceField && !enriched[field.fieldName]) {
        const value = await this.getSourceFieldValue(field.sourceModule, field.sourceField, businessEntity);
        if (value) {
          enriched[field.fieldName] = value;
        }
      }
    }

    return enriched;
  }

  private async getSourceFieldValue(
    sourceModule: string, 
    sourceField: string, 
    businessEntity: BusinessEntity | null
  ): Promise<any> {
    if (!businessEntity) return null;

    switch (sourceModule) {
      case 'formation':
      case 'entity':
        return (businessEntity as any)[sourceField];
      default:
        return null;
    }
  }

  // Conditional Logic Processing
  private async applyConditionalLogic(
    formData: Record<string, any>, 
    template: DocumentTemplate
  ): Promise<Record<string, any>> {
    if (!template.conditionalLogic) {
      return formData;
    }

    try {
      const rules: ConditionalLogicRule[] = JSON.parse(template.conditionalLogic);
      const processed = { ...formData };

      for (const rule of rules) {
        const fieldValue = processed[rule.field];
        let conditionMet = false;

        switch (rule.operator) {
          case 'equals':
            conditionMet = fieldValue === rule.value;
            break;
          case 'not_equals':
            conditionMet = fieldValue !== rule.value;
            break;
          case 'contains':
            conditionMet = String(fieldValue).includes(String(rule.value));
            break;
          case 'greater_than':
            conditionMet = Number(fieldValue) > Number(rule.value);
            break;
          case 'less_than':
            conditionMet = Number(fieldValue) < Number(rule.value);
            break;
        }

        if (conditionMet) {
          switch (rule.action) {
            case 'show':
              processed[`_show_${rule.target}`] = true;
              break;
            case 'hide':
              processed[`_show_${rule.target}`] = false;
              break;
            case 'required':
              processed[`_required_${rule.target}`] = true;
              break;
            case 'optional':
              processed[`_required_${rule.target}`] = false;
              break;
          }
        }
      }

      return processed;
    } catch (error) {
      console.error("Error applying conditional logic:", error);
      return formData;
    }
  }

  // Document Content Generation
  private async generateDocumentContent(template: DocumentTemplate, formData: Record<string, any>): Promise<string> {
    try {
      const templateContent = JSON.parse(template.templateContent);
      return this.processTemplate(templateContent, formData);
    } catch (error) {
      console.error("Error generating document content:", error);
      throw new Error("Failed to generate document content");
    }
  }

  private processTemplate(templateContent: any, formData: Record<string, any>): string {
    let content = templateContent.content || "";
    
    // Replace variables
    content = content.replace(/\{\{(\w+)\}\}/g, (match: string, variable: string) => {
      return formData[variable] || match;
    });

    // Process conditional sections
    content = content.replace(/\{\%\s*if\s+(\w+)\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, 
      (match: string, condition: string, sectionContent: string) => {
        const shouldShow = formData[`_show_${condition}`] !== false && 
                          (formData[condition] || formData[`_show_${condition}`]);
        return shouldShow ? sectionContent : "";
      });

    // Process loops
    content = content.replace(/\{\%\s*for\s+(\w+)\s+in\s+(\w+)\s*\%\}(.*?)\{\%\s*endfor\s*\%\}/gs,
      (match: string, item: string, list: string, loopContent: string) => {
        const items = formData[list];
        if (!Array.isArray(items)) return "";
        
        return items.map((itemData, index) => {
          let processedContent = loopContent;
          processedContent = processedContent.replace(new RegExp(`\\{\\{${item}\\.(\\w+)\\}\\}`, 'g'), 
            (itemMatch: string, prop: string) => itemData[prop] || itemMatch);
          return processedContent;
        }).join("");
      });

    return content;
  }

  private generateDocumentName(template: DocumentTemplate, formData: Record<string, any>): string {
    const companyName = formData.companyName || formData.businessName || "Document";
    const timestamp = new Date().toISOString().split('T')[0];
    return `${companyName} - ${template.name} - ${timestamp}`;
  }

  // Document Export
  async exportDocument(documentId: number, options: DocumentExportOptions): Promise<Buffer> {
    const [document] = await db
      .select()
      .from(generatedDocuments)
      .where(eq(generatedDocuments.id, documentId));

    if (!document) {
      throw new Error("Document not found");
    }

    switch (options.format) {
      case 'docx':
        return await this.generateDocxDocument(document, options);
      case 'pdf':
        return await this.generatePdfDocument(document, options);
      default:
        throw new Error("Unsupported format");
    }
  }

  private async generateDocxDocument(document: GeneratedDocument, options: DocumentExportOptions): Promise<Buffer> {
    // Using docx library for Word document generation
    const docx = await import('docx');
    
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: document.documentName,
                bold: true,
                size: 28
              })
            ]
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: document.generatedContent,
                size: 24
              })
            ]
          })
        ]
      }]
    });

    return await docx.Packer.toBuffer(doc);
  }

  private async generatePdfDocument(document: GeneratedDocument, options: DocumentExportOptions): Promise<Buffer> {
    // Using pdf-lib for PDF generation
    const { PDFDocument, rgb } = await import('pdf-lib');
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    
    const font = await pdfDoc.embedFont('Helvetica');
    const fontSize = 12;
    
    // Add title
    page.drawText(document.documentName, {
      x: 50,
      y: 750,
      size: 16,
      font,
      color: rgb(0, 0, 0)
    });
    
    // Add content (simplified - would need proper text wrapping)
    const lines = document.generatedContent.split('\n');
    let yPosition = 700;
    
    for (const line of lines) {
      if (yPosition < 50) break; // Avoid writing off page
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
      yPosition -= 20;
    }
    
    return await pdfDoc.save();
  }

  private async generateDownloadUrls(documentId: number, content: string): Promise<{ docx: string; pdf: string }> {
    // In a real implementation, these would be actual file URLs
    // For now, return placeholder URLs that would trigger downloads
    return {
      docx: `/api/documents/${documentId}/download/docx`,
      pdf: `/api/documents/${documentId}/download/pdf`
    };
  }

  // AI Suggestion Management
  async applyAiSuggestion(suggestionId: number, documentId: number): Promise<GeneratedDocument> {
    const [suggestion] = await db
      .select()
      .from(aiDocumentSuggestions)
      .where(eq(aiDocumentSuggestions.id, suggestionId));

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    const [document] = await db
      .select()
      .from(generatedDocuments)
      .where(eq(generatedDocuments.id, documentId));

    if (!document) {
      throw new Error("Document not found");
    }

    // Apply the suggestion to the document content
    let updatedContent = document.generatedContent;
    
    if (suggestion.originalText) {
      updatedContent = updatedContent.replace(suggestion.originalText, suggestion.suggestedText);
    } else {
      // For additions, append to the document
      updatedContent += `\n\n${suggestion.suggestedText}`;
    }

    // Update document
    const [updatedDocument] = await db
      .update(generatedDocuments)
      .set({
        generatedContent: updatedContent,
        appliedSuggestions: [...(document.appliedSuggestions || []), suggestion.id.toString()],
        lastModified: new Date()
      })
      .where(eq(generatedDocuments.id, documentId))
      .returning();

    // Mark suggestion as applied
    await db
      .update(aiDocumentSuggestions)
      .set({
        status: "accepted",
        appliedAt: new Date()
      })
      .where(eq(aiDocumentSuggestions.id, suggestionId));

    return updatedDocument;
  }

  // Document Management
  async getUserDocuments(userId: string): Promise<GeneratedDocument[]> {
    return await db
      .select()
      .from(generatedDocuments)
      .where(eq(generatedDocuments.userId, userId))
      .orderBy(desc(generatedDocuments.createdAt));
  }

  async getDocument(documentId: number): Promise<GeneratedDocument | null> {
    const [document] = await db
      .select()
      .from(generatedDocuments)
      .where(eq(generatedDocuments.id, documentId));
    return document || null;
  }

  async updateDocument(documentId: number, updates: Partial<InsertGeneratedDocument>): Promise<GeneratedDocument> {
    const [document] = await db
      .update(generatedDocuments)
      .set({
        ...updates,
        lastModified: new Date()
      })
      .where(eq(generatedDocuments.id, documentId))
      .returning();
    
    return document;
  }

  // Template Library Initialization
  async initializeTemplateLibrary(): Promise<void> {
    const templates = await this.getStandardTemplates();
    
    for (const template of templates) {
      try {
        await this.createTemplate(template);
        console.log(`Created template: ${template.name}`);
      } catch (error) {
        console.log(`Template already exists: ${template.name}`);
      }
    }
  }

  private getStandardTemplates(): InsertDocumentTemplate[] {
    return [
      {
        name: "Independent Contractor Agreement",
        category: "contract",
        description: "Comprehensive independent contractor agreement with payment terms, scope of work, and intellectual property clauses",
        templateContent: JSON.stringify({
          content: `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement ("Agreement") is entered into on {{effectiveDate}} between {{companyName}}, a {{entityType}} organized under the laws of {{state}} ("Company"), and {{contractorName}} ("Contractor").

1. SERVICES
Contractor agrees to provide the following services: {{serviceDescription}}

{% if hasDeadlines %}
2. DEADLINES
The services shall be completed by {{completionDate}}.
{% endif %}

3. COMPENSATION
Company agrees to pay Contractor {{paymentAmount}} for the services described herein.
Payment terms: {{paymentTerms}}

4. INDEPENDENT CONTRACTOR STATUS
Contractor acknowledges that they are an independent contractor and not an employee of Company.

{% if includeIPClause %}
5. INTELLECTUAL PROPERTY
All work product created by Contractor shall be the exclusive property of Company.
{% endif %}

{% if includeConfidentiality %}
6. CONFIDENTIALITY
Contractor agrees to maintain confidentiality of all Company information.
{% endif %}

IN WITNESS WHEREOF, the parties have executed this Agreement.

Company: {{companyName}}
By: {{signerName}}, {{signerTitle}}

Contractor: {{contractorName}}`
        }),
        conditionalLogic: JSON.stringify([
          {
            condition: "hasDeadlines",
            field: "hasDeadlines",
            operator: "equals",
            value: true,
            action: "show",
            target: "deadlines"
          }
        ]),
        requiredFields: ["companyName", "contractorName", "serviceDescription", "paymentAmount"],
        optionalFields: ["effectiveDate", "completionDate", "paymentTerms"],
        supportedStates: ["CA", "NY", "TX", "FL", "IL"],
        industrySpecific: []
      },
      {
        name: "Non-Disclosure Agreement (NDA)",
        category: "agreement",
        description: "Mutual non-disclosure agreement to protect confidential information",
        templateContent: JSON.stringify({
          content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {{effectiveDate}} between {{party1Name}} ("Disclosing Party") and {{party2Name}} ("Receiving Party").

1. CONFIDENTIAL INFORMATION
Confidential Information includes: {{confidentialInfoDescription}}

2. OBLIGATIONS
Receiving Party agrees to:
- Keep all Confidential Information strictly confidential
- Use Confidential Information solely for {{purposeDescription}}
- Not disclose Confidential Information to third parties

{% if hasTerm %}
3. TERM
This Agreement shall remain in effect for {{termDuration}} from the effective date.
{% endif %}

4. RETURN OF INFORMATION
Upon termination, Receiving Party shall return all Confidential Information.

5. REMEDIES
Breach of this Agreement may result in irreparable harm, entitling Disclosing Party to equitable relief.

Disclosing Party: {{party1Name}}
Signature: _________________________

Receiving Party: {{party2Name}}
Signature: _________________________`
        }),
        conditionalLogic: JSON.stringify([
          {
            condition: "hasTerm",
            field: "hasTerm",
            operator: "equals",
            value: true,
            action: "show",
            target: "term"
          }
        ]),
        requiredFields: ["party1Name", "party2Name", "confidentialInfoDescription", "purposeDescription"],
        optionalFields: ["effectiveDate", "termDuration"],
        supportedStates: ["CA", "NY", "TX", "FL", "IL", "WA", "MA"],
        industrySpecific: []
      },
      {
        name: "Liability Waiver",
        category: "waiver",
        description: "General liability waiver for activities and services",
        templateContent: JSON.stringify({
          content: `LIABILITY WAIVER AND RELEASE

I, {{participantName}}, voluntarily participate in {{activityDescription}} provided by {{companyName}}.

ASSUMPTION OF RISK
I understand that participation in {{activityDescription}} involves risks including {{riskDescription}}.

RELEASE AND WAIVER
I hereby release {{companyName}} from any and all claims, demands, or causes of action arising from my participation.

{% if includeIndemnification %}
INDEMNIFICATION
I agree to indemnify and hold harmless {{companyName}} from any claims brought by third parties.
{% endif %}

{% if hasMinorParticipant %}
PARENT/GUARDIAN CONSENT
As parent/guardian of {{minorName}}, I give consent for their participation and agree to all terms herein.
Parent/Guardian: {{parentName}}
{% endif %}

GOVERNING LAW
This agreement shall be governed by the laws of {{state}}.

Participant Signature: _________________________
Date: {{signatureDate}}

{% if hasMinorParticipant %}
Parent/Guardian Signature: _________________________
Date: {{signatureDate}}
{% endif %}`
        }),
        conditionalLogic: JSON.stringify([
          {
            condition: "hasMinorParticipant",
            field: "hasMinorParticipant",
            operator: "equals",
            value: true,
            action: "show",
            target: "parentConsent"
          }
        ]),
        requiredFields: ["participantName", "activityDescription", "companyName", "riskDescription"],
        optionalFields: ["minorName", "parentName", "signatureDate"],
        supportedStates: ["CA", "NY", "TX", "FL", "IL", "WA", "MA", "CO", "AZ"],
        industrySpecific: ["fitness", "recreation", "sports", "events"]
      },
      {
        name: "Basic Service Contract",
        category: "contract",
        description: "General service agreement for professional services",
        templateContent: JSON.stringify({
          content: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is made between {{providerName}} ("Provider") and {{clientName}} ("Client") on {{effectiveDate}}.

1. SERVICES
Provider agrees to provide: {{serviceDescription}}

2. TIMELINE
{% if hasStartDate %}
Start Date: {{startDate}}
{% endif %}
{% if hasEndDate %}
Completion Date: {{endDate}}
{% endif %}

3. COMPENSATION
Total Fee: {{totalFee}}
Payment Schedule: {{paymentSchedule}}

{% if hasExpenses %}
4. EXPENSES
Client agrees to reimburse Provider for pre-approved expenses.
{% endif %}

5. CANCELLATION
Either party may cancel with {{cancellationNotice}} days written notice.

6. GOVERNING LAW
This Agreement is governed by {{state}} law.

Provider: {{providerName}}
Signature: _________________________

Client: {{clientName}}
Signature: _________________________`
        }),
        conditionalLogic: JSON.stringify([
          {
            condition: "hasExpenses",
            field: "hasExpenses",
            operator: "equals",
            value: true,
            action: "show",
            target: "expenses"
          }
        ]),
        requiredFields: ["providerName", "clientName", "serviceDescription", "totalFee"],
        optionalFields: ["startDate", "endDate", "paymentSchedule", "cancellationNotice"],
        supportedStates: ["CA", "NY", "TX", "FL", "IL", "WA", "MA", "CO", "AZ", "NV"],
        industrySpecific: []
      }
    ];
  }
}

export const legalDocumentService = new LegalDocumentService();