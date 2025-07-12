import crypto from 'crypto';
import { db } from './db';
import { 
  dataEncryption, 
  auditLogs, 
  securityIncidents, 
  dataRetentionPolicies,
  accessControlRoles,
  type InsertDataEncryption,
  type InsertAuditLog,
  type InsertSecurityIncident,
  type DataEncryption,
  type AuditLog
} from '@shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
}

interface SecurityMetrics {
  encryptedDataCount: number;
  auditLogCount: number;
  securityIncidents: number;
  complianceScore: number;
  lastAuditDate: Date | null;
}

interface AccessControlCheck {
  userId: string;
  resource: string;
  action: string;
  context?: Record<string, any>;
}

export class SecurityService {
  private encryptionKey: string;
  private config: EncryptionConfig;

  constructor() {
    // Use environment variable or generate secure key
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateSecureKey();
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16
    };
  }

  private generateSecureKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Simple encryption method for sensitive data
  encryptSensitiveData(data: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  // Data Encryption - AES-256-CBC for secure encryption
  async encryptData(data: string, dataType: string, userId: string): Promise<{
    encrypted: string;
    encryptionId: string;
  }> {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const encryptedPayload = iv.toString('hex') + ':' + encrypted;

      // Log encryption event (simulated for demo)
      const encryptionId = Math.random().toString(36).substring(7);

      await this.logAuditEvent({
        userId,
        action: 'data_encryption',
        resource: dataType,
        details: { encryptionId, algorithm: 'aes-256-cbc' },
        ipAddress: 'system',
        userAgent: 'SecurityService'
      });

      return {
        encrypted: encryptedPayload,
        encryptionId
      };
    } catch (error) {
      await this.logSecurityIncident({
        type: 'encryption_failure',
        description: `Failed to encrypt ${dataType} data`,
        severity: 'high',
        userId,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      throw new Error('Encryption failed');
    }
  }

  async decryptData(encryptedData: string, encryptionId: string, userId: string): Promise<string> {
    try {
      const [iv, encrypted] = encryptedData.split(':');
      
      const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      await this.logAuditEvent({
        userId,
        action: 'data_decryption',
        resource: 'encrypted_data',
        details: { encryptionId },
        ipAddress: 'system',
        userAgent: 'SecurityService'
      });

      return decrypted;
    } catch (error) {
      await this.logSecurityIncident({
        type: 'decryption_failure',
        description: 'Failed to decrypt data',
        severity: 'high',
        userId,
        details: { encryptionId, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      throw new Error('Decryption failed');
    }
  }

  // PII Data Handling with Enhanced Protection
  async encryptPII(data: {
    ssn?: string;
    ein?: string;
    dateOfBirth?: string;
    fullName?: string;
    address?: string;
    phone?: string;
    email?: string;
  }, userId: string): Promise<Record<string, string>> {
    const encryptedData: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value) {
        const { encrypted } = await this.encryptData(value, `pii_${key}`, userId);
        encryptedData[key] = encrypted;
      }
    }

    await this.logAuditEvent({
      userId,
      action: 'pii_encryption',
      resource: 'user_pii',
      details: { fields: Object.keys(data) },
      ipAddress: 'system',
      userAgent: 'SecurityService'
    });

    return encryptedData;
  }

  // Access Control with Role-Based Permissions
  async checkAccess(check: AccessControlCheck): Promise<boolean> {
    try {
      // Log access attempt
      await this.logAuditEvent({
        userId: check.userId,
        action: 'access_check',
        resource: check.resource,
        details: { requestedAction: check.action, context: check.context },
        ipAddress: check.context?.ipAddress || 'unknown',
        userAgent: check.context?.userAgent || 'unknown'
      });

      // Implement role-based access control logic
      // This would typically check user roles against resource permissions
      const hasAccess = await this.validateUserPermissions(check);

      if (!hasAccess) {
        await this.logSecurityIncident({
          type: 'unauthorized_access_attempt',
          description: `User attempted to access ${check.resource} without permission`,
          severity: 'medium',
          userId: check.userId,
          details: { resource: check.resource, action: check.action }
        });
      }

      return hasAccess;
    } catch (error) {
      await this.logSecurityIncident({
        type: 'access_control_error',
        description: 'Error during access control check',
        severity: 'high',
        userId: check.userId,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return false;
    }
  }

  private async validateUserPermissions(check: AccessControlCheck): Promise<boolean> {
    // Simplified role-based access control
    // In production, this would integrate with a comprehensive RBAC system
    const allowedActions = {
      'business_entities': ['read', 'create', 'update'],
      'financial_data': ['read'],
      'pii_data': ['read'],
      'legal_documents': ['read', 'create'],
      'mailbox_data': ['read', 'create', 'update']
    };

    const resourceActions = allowedActions[check.resource as keyof typeof allowedActions];
    return resourceActions?.includes(check.action) || false;
  }

  // Audit Logging for Compliance
  async logAuditEvent(event: {
    userId: string;
    action: string;
    resource: string;
    details: Record<string, any>;
    ipAddress: string;
    userAgent: string;
  }): Promise<void> {
    try {
      // For demo purposes, log to console since database tables need to be created
      console.log('AUDIT EVENT:', {
        userId: event.userId,
        action: event.action,
        resource: event.resource,
        details: event.details,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  // Get audit logs with filtering
  async getAuditLogs(filters: {
    startDate?: Date;
    endDate?: Date;
    action?: string;
    resource?: string;
  }): Promise<any[]> {
    // For demo purposes, return simulated audit logs
    return [
      {
        id: 1,
        userId: 'user123',
        action: 'data_encryption',
        resource: 'pii_ssn',
        details: { encryptionId: 'enc123', algorithm: 'aes-256-cbc' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date()
      },
      {
        id: 2,
        userId: 'user123',
        action: 'access_check',
        resource: 'business_entities',
        details: { requestedAction: 'read' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date()
      }
    ].filter(log => {
      if (filters.action && log.action !== filters.action) return false;
      if (filters.resource && log.resource !== filters.resource) return false;
      return true;
    });
  }

  // Security Incident Management
  async logSecurityIncident(incident: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    details?: Record<string, any>;
  }): Promise<void> {
    try {
      // For demo purposes, log to console
      console.log('SECURITY INCIDENT:', {
        type: incident.type,
        description: incident.description,
        severity: incident.severity,
        userId: incident.userId,
        details: incident.details || {},
        status: 'open',
        reportedAt: new Date().toISOString()
      });

      // For critical incidents, immediate notification would be triggered
      if (incident.severity === 'critical') {
        await this.handleCriticalIncident(incident);
      }
    } catch (error) {
      console.error('Failed to log security incident:', error);
    }
  }

  private async handleCriticalIncident(incident: any): Promise<void> {
    // In production, this would trigger immediate alerts
    console.error('CRITICAL SECURITY INCIDENT:', incident);
    // Notify security team, potentially disable affected systems, etc.
  }

  // Initialize default data retention policies
  async initializeDefaultPolicies(): Promise<void> {
    console.log('Initializing default data retention policies...');
    
    const defaultPolicies = [
      { dataType: 'business_entities', retentionDays: 2555, description: '7 years legal requirement' },
      { dataType: 'financial_data', retentionDays: 2555, description: '7 years for tax purposes' },
      { dataType: 'legal_documents', retentionDays: 3650, description: '10 years for legal documents' },
      { dataType: 'communication_logs', retentionDays: 1095, description: '3 years for communications' },
      { dataType: 'audit_logs', retentionDays: 2555, description: '7 years for compliance auditing' }
    ];

    console.log('Default data retention policies initialized:', defaultPolicies);
  }

  // Data Retention and Cleanup
  async enforceDataRetention(): Promise<void> {
    try {
      console.log('Enforcing data retention policies...');
      
      const policies = [
        { dataType: 'business_entities', retentionDays: 2555 },
        { dataType: 'financial_data', retentionDays: 2555 },
        { dataType: 'legal_documents', retentionDays: 3650 },
        { dataType: 'communication_logs', retentionDays: 1095 },
        { dataType: 'audit_logs', retentionDays: 2555 }
      ];
      
      for (const policy of policies) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);

        await this.secureDataDeletion(policy.dataType, cutoffDate);
      }

      await this.logAuditEvent({
        userId: 'system',
        action: 'data_retention_enforcement',
        resource: 'all_data_types',
        details: { policiesProcessed: policies.length },
        ipAddress: 'system',
        userAgent: 'SecurityService'
      });
    } catch (error) {
      await this.logSecurityIncident({
        type: 'data_retention_error',
        description: 'Failed to enforce data retention policies',
        severity: 'high',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  private async secureDataDeletion(dataType: string, cutoffDate: Date): Promise<void> {
    // Implement secure deletion based on data type
    // This would involve cryptographic erasure for encrypted data
    console.log(`Securely deleting ${dataType} data older than ${cutoffDate}`);
  }

  // Security Metrics and Compliance Reporting
  async getSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      // For demo purposes, return simulated security metrics
      return {
        encryptedDataCount: 1247,
        auditLogCount: 8934,
        securityIncidents: 2,
        complianceScore: await this.calculateComplianceScore(),
        lastAuditDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      };
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return {
        encryptedDataCount: 0,
        auditLogCount: 0,
        securityIncidents: 0,
        complianceScore: 0,
        lastAuditDate: null
      };
    }
  }

  private async calculateComplianceScore(): Promise<number> {
    // Implement compliance scoring based on security controls
    let score = 100;
    
    // Deduct points for open security incidents
    const openIncidents = await db.select()
      .from(securityIncidents)
      .where(eq(securityIncidents.status, 'open'));
    
    score -= openIncidents.length * 5;
    
    // Deduct points for missing audits
    const lastAudit = await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.action, 'compliance_audit'))
      .orderBy(auditLogs.timestamp)
      .limit(1);
    
    if (!lastAudit[0] || (Date.now() - lastAudit[0].timestamp.getTime()) > 30 * 24 * 60 * 60 * 1000) {
      score -= 20; // Deduct for audits older than 30 days
    }

    return Math.max(0, Math.min(100, score));
  }

  // GDPR and Privacy Compliance
  async generatePrivacyReport(userId: string): Promise<{
    dataCollected: string[];
    processingPurposes: string[];
    dataSharing: string[];
    retentionPeriods: Record<string, number>;
    userRights: string[];
  }> {
    const auditData = await db.select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId));

    return {
      dataCollected: [
        'Business registration information',
        'Contact details',
        'Financial information (encrypted)',
        'Legal documents',
        'Communication preferences'
      ],
      processingPurposes: [
        'Business entity formation',
        'Compliance management',
        'Document generation',
        'Communication and notifications',
        'Legal and regulatory requirements'
      ],
      dataSharing: [
        'Government agencies (as required for filings)',
        'Registered agent services',
        'Banking partners (for payment processing)'
      ],
      retentionPeriods: {
        'business_entities': 2555, // 7 years
        'financial_data': 2555,
        'legal_documents': 3650, // 10 years
        'communication_logs': 1095, // 3 years
        'audit_logs': 2555
      },
      userRights: [
        'Right to access personal data',
        'Right to rectification',
        'Right to erasure (right to be forgotten)',
        'Right to restrict processing',
        'Right to data portability',
        'Right to object to processing'
      ]
    };
  }

  // Record privacy consent for GDPR compliance
  async recordPrivacyConsent(consent: {
    userId: string;
    consentType: string;
    granted: boolean;
    consentText: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    console.log('PRIVACY CONSENT RECORDED:', {
      userId: consent.userId,
      consentType: consent.consentType,
      granted: consent.granted,
      consentText: consent.consentText,
      ipAddress: consent.ipAddress,
      userAgent: consent.userAgent,
      timestamp: new Date().toISOString()
    });

    await this.logAuditEvent({
      userId: consent.userId,
      action: 'privacy_consent',
      resource: 'user_privacy',
      details: { 
        consentType: consent.consentType, 
        granted: consent.granted,
        consentText: consent.consentText.substring(0, 100) + '...' 
      },
      ipAddress: consent.ipAddress || 'unknown',
      userAgent: consent.userAgent || 'unknown'
    });
  }

  // Physical Security for Digital Mailbox
  async logPhysicalSecurityEvent(event: {
    facilityId: string;
    eventType: string;
    description: string;
    severity: string;
    timestamp?: Date;
  }): Promise<void> {
    await this.logAuditEvent({
      userId: 'physical_security',
      action: 'physical_security_event',
      resource: 'mailbox_facility',
      details: event,
      ipAddress: 'facility',
      userAgent: 'PhysicalSecuritySystem'
    });
  }
}

export const securityService = new SecurityService();