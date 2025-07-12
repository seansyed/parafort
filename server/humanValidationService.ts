import { securityService } from './securityService';

export interface ValidationRequest {
  id: string;
  type: 'legal_document' | 'compliance_workflow' | 'document_template' | 'formation_filing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submittedBy: string;
  submittedAt: Date;
  content: {
    originalData: any;
    generatedOutput: any;
    context: {
      entityType: string;
      state: string;
      regulatoryRequirements: string[];
    };
  };
  validationChecks: ValidationCheck[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'requires_changes';
  reviewedBy?: string;
  reviewedAt?: Date;
  feedback?: string;
  approvalNotes?: string;
}

export interface ValidationCheck {
  checkType: 'legal_accuracy' | 'regulatory_compliance' | 'data_integrity' | 'template_consistency';
  description: string;
  automated: boolean;
  status: 'pending' | 'passed' | 'failed' | 'requires_manual_review';
  details?: string;
  checkPerformedAt: Date;
}

export interface ComplianceRule {
  id: string;
  jurisdiction: string;
  entityType: string;
  ruleType: 'filing_requirement' | 'document_content' | 'naming_convention' | 'disclosure_requirement';
  description: string;
  regulatory_source: string;
  effectiveDate: Date;
  lastUpdated: Date;
  isActive: boolean;
  validationLogic: {
    fieldChecks: Array<{
      fieldName: string;
      required: boolean;
      format?: string;
      maxLength?: number;
      allowedValues?: string[];
    }>;
    businessRules: Array<{
      condition: string;
      errorMessage: string;
    }>;
  };
}

export class HumanValidationService {
  private pendingValidations: Map<string, ValidationRequest> = new Map();
  private complianceRules: Map<string, ComplianceRule> = new Map();

  constructor() {
    this.initializeComplianceRules();
  }

  private initializeComplianceRules(): void {
    // Delaware LLC formation rules
    this.complianceRules.set('DE_LLC_FORMATION', {
      id: 'DE_LLC_FORMATION',
      jurisdiction: 'DE',
      entityType: 'LLC',
      ruleType: 'filing_requirement',
      description: 'Delaware LLC Certificate of Formation requirements',
      regulatory_source: 'Delaware Code Title 6, Chapter 18',
      effectiveDate: new Date('2023-01-01'),
      lastUpdated: new Date('2024-12-01'),
      isActive: true,
      validationLogic: {
        fieldChecks: [
          {
            fieldName: 'entityName',
            required: true,
            format: '^[A-Za-z0-9\\s\\.,\\-\']+\\s+(LLC|L\\.L\\.C\\.)$'
          },
          {
            fieldName: 'registeredAgentName',
            required: true,
            maxLength: 255
          },
          {
            fieldName: 'registeredAgentAddress',
            required: true
          }
        ],
        businessRules: [
          {
            condition: 'entityName.endsWith("LLC") || entityName.endsWith("L.L.C.")',
            errorMessage: 'Delaware LLC name must end with "LLC" or "L.L.C."'
          },
          {
            condition: 'registeredAgentAddress.state === "DE"',
            errorMessage: 'Registered agent must have Delaware address'
          }
        ]
      }
    });

    // California Corporation formation rules
    this.complianceRules.set('CA_CORP_FORMATION', {
      id: 'CA_CORP_FORMATION',
      jurisdiction: 'CA',
      entityType: 'Corporation',
      ruleType: 'filing_requirement',
      description: 'California Corporation Articles of Incorporation requirements',
      regulatory_source: 'California Corporations Code Section 202',
      effectiveDate: new Date('2023-01-01'),
      lastUpdated: new Date('2024-12-01'),
      isActive: true,
      validationLogic: {
        fieldChecks: [
          {
            fieldName: 'entityName',
            required: true,
            format: '^[A-Za-z0-9\\s\\.,\\-\']+\\s+(Corporation|Corp\\.|Inc\\.|Incorporated)$'
          },
          {
            fieldName: 'authorizedShares',
            required: true
          },
          {
            fieldName: 'incorporatorName',
            required: true
          }
        ],
        businessRules: [
          {
            condition: 'authorizedShares >= 1',
            errorMessage: 'Must authorize at least one share'
          },
          {
            condition: 'entityName.includes("Corporation") || entityName.includes("Corp.") || entityName.includes("Inc.") || entityName.includes("Incorporated")',
            errorMessage: 'California corporation name must include "Corporation", "Corp.", "Inc.", or "Incorporated"'
          }
        ]
      }
    });

    console.log(`Initialized ${this.complianceRules.size} compliance rules`);
  }

  async submitForValidation(
    type: ValidationRequest['type'],
    content: ValidationRequest['content'],
    submittedBy: string,
    priority: ValidationRequest['priority'] = 'medium'
  ): Promise<string> {
    const validationId = `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Perform automated checks first
    const validationChecks = await this.performAutomatedChecks(type, content);
    
    const request: ValidationRequest = {
      id: validationId,
      type,
      priority,
      submittedBy,
      submittedAt: new Date(),
      content,
      validationChecks,
      status: 'pending'
    };

    // If all automated checks pass and no manual review required, auto-approve
    const requiresManualReview = validationChecks.some(
      check => check.status === 'failed' || check.status === 'requires_manual_review'
    );

    if (!requiresManualReview && type !== 'formation_filing') {
      request.status = 'approved';
      request.reviewedBy = 'automated_system';
      request.reviewedAt = new Date();
      request.approvalNotes = 'Automatically approved - all validation checks passed';
    }

    this.pendingValidations.set(validationId, request);

    // Log validation request
    await securityService.logAuditEvent({
      userId: submittedBy,
      action: 'validation_request_submitted',
      resource: 'human_validation',
      details: {
        validationId,
        type,
        priority,
        requiresManualReview,
        autoApproved: !requiresManualReview
      },
      ipAddress: 'server',
      userAgent: 'HumanValidationService'
    });

    return validationId;
  }

  private async performAutomatedChecks(
    type: ValidationRequest['type'],
    content: ValidationRequest['content']
  ): Promise<ValidationCheck[]> {
    const checks: ValidationCheck[] = [];

    // Data integrity check
    checks.push({
      checkType: 'data_integrity',
      description: 'Verify data completeness and format',
      automated: true,
      status: this.validateDataIntegrity(content) ? 'passed' : 'failed',
      checkPerformedAt: new Date()
    });

    // Legal accuracy check
    if (type === 'legal_document' || type === 'formation_filing') {
      const legalCheck = await this.validateLegalAccuracy(content);
      checks.push({
        checkType: 'legal_accuracy',
        description: 'Verify compliance with legal requirements',
        automated: true,
        status: legalCheck.status,
        details: legalCheck.details,
        checkPerformedAt: new Date()
      });
    }

    // Regulatory compliance check
    const complianceCheck = await this.validateRegulatoryCompliance(content);
    checks.push({
      checkType: 'regulatory_compliance',
      description: 'Check against current regulatory requirements',
      automated: true,
      status: complianceCheck.status,
      details: complianceCheck.details,
      checkPerformedAt: new Date()
    });

    // Template consistency check (for document generation)
    if (type === 'document_template' || type === 'legal_document') {
      checks.push({
        checkType: 'template_consistency',
        description: 'Verify template structure and required sections',
        automated: true,
        status: this.validateTemplateConsistency(content) ? 'passed' : 'requires_manual_review',
        checkPerformedAt: new Date()
      });
    }

    return checks;
  }

  private validateDataIntegrity(content: ValidationRequest['content']): boolean {
    try {
      // Check for required fields based on entity type and state
      const requiredFields = this.getRequiredFields(
        content.context.entityType,
        content.context.state
      );

      for (const field of requiredFields) {
        if (!content.originalData[field] || content.originalData[field].trim() === '') {
          return false;
        }
      }

      // Check for data consistency
      if (content.originalData.entityName && content.generatedOutput.entityName) {
        if (content.originalData.entityName !== content.generatedOutput.entityName) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Data integrity validation failed:', error);
      return false;
    }
  }

  private async validateLegalAccuracy(
    content: ValidationRequest['content']
  ): Promise<{ status: ValidationCheck['status']; details?: string }> {
    const ruleKey = `${content.context.state}_${content.context.entityType.toUpperCase()}_FORMATION`;
    const rule = this.complianceRules.get(ruleKey);

    if (!rule) {
      return {
        status: 'requires_manual_review',
        details: `No automated validation rules found for ${content.context.state} ${content.context.entityType}`
      };
    }

    const violations: string[] = [];

    // Check field requirements
    for (const fieldCheck of rule.validationLogic.fieldChecks) {
      const value = content.originalData[fieldCheck.fieldName];

      if (fieldCheck.required && (!value || value.trim() === '')) {
        violations.push(`Required field ${fieldCheck.fieldName} is missing`);
        continue;
      }

      if (value && fieldCheck.format) {
        const regex = new RegExp(fieldCheck.format);
        if (!regex.test(value)) {
          violations.push(`Field ${fieldCheck.fieldName} does not match required format`);
        }
      }

      if (value && fieldCheck.maxLength && value.length > fieldCheck.maxLength) {
        violations.push(`Field ${fieldCheck.fieldName} exceeds maximum length of ${fieldCheck.maxLength}`);
      }

      if (fieldCheck.allowedValues && !fieldCheck.allowedValues.includes(value)) {
        violations.push(`Field ${fieldCheck.fieldName} contains invalid value`);
      }
    }

    // Check business rules
    for (const businessRule of rule.validationLogic.businessRules) {
      try {
        // Simple evaluation of business rules
        const condition = this.evaluateBusinessRule(businessRule.condition, content.originalData);
        if (!condition) {
          violations.push(businessRule.errorMessage);
        }
      } catch (error) {
        console.error('Business rule evaluation failed:', error);
        violations.push(`Business rule evaluation failed: ${businessRule.condition}`);
      }
    }

    if (violations.length > 0) {
      return {
        status: 'failed',
        details: violations.join('; ')
      };
    }

    return { status: 'passed' };
  }

  private evaluateBusinessRule(condition: string, data: any): boolean {
    // Simple rule evaluation - in production, use a proper expression evaluator
    try {
      if (condition.includes('entityName.endsWith')) {
        const match = condition.match(/entityName\.endsWith\("([^"]+)"\)/);
        if (match) {
          return data.entityName?.endsWith(match[1]) || false;
        }
      }

      if (condition.includes('registeredAgentAddress.state')) {
        const match = condition.match(/registeredAgentAddress\.state === "([^"]+)"/);
        if (match) {
          return data.registeredAgentAddress?.state === match[1];
        }
      }

      if (condition.includes('authorizedShares >= 1')) {
        return parseInt(data.authorizedShares) >= 1;
      }

      if (condition.includes('entityName.includes')) {
        const matches = condition.match(/entityName\.includes\("([^"]+)"\)/g);
        if (matches) {
          return matches.some(match => {
            const term = match.match(/"([^"]+)"/)?.[1];
            return term && data.entityName?.includes(term);
          });
        }
      }

      return true; // Default to true if rule can't be evaluated
    } catch (error) {
      console.error('Rule evaluation error:', error);
      return false;
    }
  }

  private async validateRegulatoryCompliance(
    content: ValidationRequest['content']
  ): Promise<{ status: ValidationCheck['status']; details?: string }> {
    const issues: string[] = [];

    // Check against current regulatory requirements
    for (const requirement of content.context.regulatoryRequirements) {
      if (requirement === 'BOIR_COMPLIANCE' && content.context.entityType === 'LLC') {
        // Check BOIR requirements (noting they were suspended as of March 2025)
        issues.push('BOIR filing requirements suspended as of March 21, 2025');
      }

      if (requirement === 'EIN_REQUIRED') {
        if (!content.originalData.ein && !content.originalData.needsEin) {
          issues.push('EIN is required for business operations');
        }
      }

      if (requirement === 'REGISTERED_AGENT_REQUIRED') {
        if (!content.originalData.registeredAgent) {
          issues.push('Registered agent is required for this entity type');
        }
      }
    }

    if (issues.length > 0) {
      return {
        status: 'requires_manual_review',
        details: issues.join('; ')
      };
    }

    return { status: 'passed' };
  }

  private validateTemplateConsistency(content: ValidationRequest['content']): boolean {
    // Check that generated output has required sections for the entity type
    const requiredSections = this.getRequiredDocumentSections(
      content.context.entityType,
      content.context.state
    );

    if (!content.generatedOutput || typeof content.generatedOutput !== 'object') {
      return false;
    }

    for (const section of requiredSections) {
      if (!content.generatedOutput[section]) {
        return false;
      }
    }

    return true;
  }

  private getRequiredFields(entityType: string, state: string): string[] {
    const baseFields = ['entityName', 'state', 'entityType'];
    
    if (entityType === 'LLC') {
      return [...baseFields, 'registeredAgent', 'managementStructure'];
    }
    
    if (entityType === 'Corporation' || entityType === 'C-Corporation') {
      return [...baseFields, 'registeredAgent', 'authorizedShares', 'incorporator'];
    }

    return baseFields;
  }

  private getRequiredDocumentSections(entityType: string, state: string): string[] {
    if (entityType === 'LLC') {
      return ['entityName', 'registeredAgent', 'managementStructure', 'purpose'];
    }
    
    if (entityType === 'Corporation' || entityType === 'C-Corporation') {
      return ['entityName', 'registeredAgent', 'authorizedShares', 'incorporator', 'purpose'];
    }

    return ['entityName', 'registeredAgent', 'purpose'];
  }

  async getValidationStatus(validationId: string): Promise<ValidationRequest | null> {
    return this.pendingValidations.get(validationId) || null;
  }

  async approveValidation(
    validationId: string,
    reviewedBy: string,
    approvalNotes?: string
  ): Promise<boolean> {
    const request = this.pendingValidations.get(validationId);
    if (!request) {
      return false;
    }

    request.status = 'approved';
    request.reviewedBy = reviewedBy;
    request.reviewedAt = new Date();
    request.approvalNotes = approvalNotes;

    // Log approval
    await securityService.logAuditEvent({
      userId: reviewedBy,
      action: 'validation_approved',
      resource: 'human_validation',
      details: {
        validationId,
        originalSubmitter: request.submittedBy,
        type: request.type,
        approvalNotes
      },
      ipAddress: 'server',
      userAgent: 'HumanValidationService'
    });

    return true;
  }

  async rejectValidation(
    validationId: string,
    reviewedBy: string,
    feedback: string
  ): Promise<boolean> {
    const request = this.pendingValidations.get(validationId);
    if (!request) {
      return false;
    }

    request.status = 'rejected';
    request.reviewedBy = reviewedBy;
    request.reviewedAt = new Date();
    request.feedback = feedback;

    // Log rejection
    await securityService.logAuditEvent({
      userId: reviewedBy,
      action: 'validation_rejected',
      resource: 'human_validation',
      details: {
        validationId,
        originalSubmitter: request.submittedBy,
        type: request.type,
        feedback
      },
      ipAddress: 'server',
      userAgent: 'HumanValidationService'
    });

    return true;
  }

  async getPendingValidations(priority?: ValidationRequest['priority']): Promise<ValidationRequest[]> {
    const pending = Array.from(this.pendingValidations.values())
      .filter(req => req.status === 'pending' || req.status === 'in_review');

    if (priority) {
      return pending.filter(req => req.priority === priority);
    }

    return pending.sort((a, b) => {
      // Sort by priority (critical first) then by submission date
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.submittedAt.getTime() - b.submittedAt.getTime();
    });
  }

  getValidationMetrics(): {
    totalValidations: number;
    pendingValidations: number;
    approvedValidations: number;
    rejectedValidations: number;
    averageProcessingTime: number;
  } {
    const validations = Array.from(this.pendingValidations.values());
    
    return {
      totalValidations: validations.length,
      pendingValidations: validations.filter(v => v.status === 'pending' || v.status === 'in_review').length,
      approvedValidations: validations.filter(v => v.status === 'approved').length,
      rejectedValidations: validations.filter(v => v.status === 'rejected').length,
      averageProcessingTime: this.calculateAverageProcessingTime(validations)
    };
  }

  private calculateAverageProcessingTime(validations: ValidationRequest[]): number {
    const completed = validations.filter(v => v.reviewedAt);
    if (completed.length === 0) return 0;

    const totalTime = completed.reduce((sum, validation) => {
      const processingTime = validation.reviewedAt!.getTime() - validation.submittedAt.getTime();
      return sum + processingTime;
    }, 0);

    return Math.round(totalTime / completed.length / (1000 * 60)); // Return in minutes
  }
}

export const humanValidationService = new HumanValidationService();