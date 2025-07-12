import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '../securityService';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface AuthenticatedRequest extends Request {
  user?: any;
  securityContext?: {
    userId: string;
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    userRole: string;
  };
}

export class SecurityMiddleware {
  private securityService: SecurityService;

  constructor() {
    this.securityService = new SecurityService();
  }

  // Audit logging middleware
  auditLogger = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    // Check both session types - regular and admin
    const userId = req.user?.claims?.sub || (req as any).session?.userId || 'anonymous';
    const sessionId = req.sessionID || 'no-session';
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    // Get user role for security context
    let userRole = 'anonymous';
    if (userId !== 'anonymous') {
      try {
        // Check if this is an admin session first
        if ((req as any).session?.isAdmin) {
          userRole = (req as any).session.adminRole || 'admin';
        } else {
          const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
          userRole = user?.role || 'client';
        }
      } catch (error) {
        console.error(`Error detecting role for user ${userId}:`, error);
        userRole = 'client';
      }
    }

    // Set security context for downstream middleware
    req.securityContext = {
      userId,
      ipAddress,
      userAgent,
      sessionId,
      userRole
    };

    // Log the request
    await this.securityService.logAuditEvent({
      userId,
      action: 'api_request',
      resource: req.path,
      details: {
        method: req.method,
        query: req.query,
        body: this.sanitizeRequestBody(req.body),
        sessionId,
        userRole
      },
      ipAddress,
      userAgent
    });

    // Capture response details
    const originalSend = res.send;
    const securityService = this.securityService;
    res.send = function(data) {
      const responseTime = Date.now() - startTime;
      
      // Log response (asynchronously to avoid blocking)
      setImmediate(async () => {
        await securityService.logAuditEvent({
          userId,
          action: 'api_response',
          resource: req.path,
          details: {
            statusCode: res.statusCode,
            responseTime,
            success: res.statusCode < 400
          },
          ipAddress,
          userAgent
        });
      });

      return originalSend.call(this, data);
    };

    next();
  };

  // Role-based access control middleware
  requireRole = (allowedRoles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // Check both session types - regular user and admin
        const userId = req.user?.claims?.sub || (req as any).session?.userId;
        
        if (!userId) {
          await this.securityService.logSecurityIncident({
            type: 'unauthorized_access_attempt',
            description: 'Access attempted without authentication',
            severity: 'medium',
            details: {
              path: req.path,
              method: req.method,
              ip: req.ip
            }
          });
          return res.status(401).json({ error: 'Authentication required' });
        }

        // Get user role - prioritize admin session info
        let userRole = req.securityContext?.userRole;
        if ((req as any).session?.isAdmin) {
          userRole = (req as any).session.adminRole || 'admin';
        } else if (!userRole || userRole === 'anonymous') {
          try {
            const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
            userRole = user?.role || 'client';
          } catch (error) {
            console.error(`Database error checking role for user ${userId}:`, error);
            userRole = 'client';
          }
        }
        
        if (!allowedRoles.includes(userRole)) {
          await this.securityService.logSecurityIncident({
            type: 'insufficient_permissions',
            description: `User with role ${userRole} attempted to access ${req.path}`,
            severity: 'medium',
            userId,
            details: {
              userRole,
              requiredRoles: allowedRoles,
              path: req.path,
              method: req.method
            }
          });
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
      } catch (error) {
        await this.securityService.logSecurityIncident({
          type: 'rbac_error',
          description: 'Error during role-based access control check',
          severity: 'high',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
            path: req.path
          }
        });
        res.status(500).json({ error: 'Internal security error' });
      }
    };
  };

  // Data validation and sanitization middleware
  validateAndSanitize = (schema: any) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // Validate request body against schema
        const validatedData = schema.parse(req.body);
        req.body = validatedData;

        // Log data validation success
        if (req.securityContext?.userId) {
          await this.securityService.logAuditEvent({
            userId: req.securityContext.userId,
            action: 'data_validation',
            resource: req.path,
            details: {
              validationSuccess: true,
              fieldsValidated: Object.keys(validatedData)
            },
            ipAddress: req.securityContext.ipAddress,
            userAgent: req.securityContext.userAgent
          });
        }

        next();
      } catch (error) {
        await this.securityService.logSecurityIncident({
          type: 'data_validation_failure',
          description: 'Request data failed validation',
          severity: 'low',
          userId: req.securityContext?.userId,
          details: {
            path: req.path,
            validationError: error instanceof Error ? error.message : 'Unknown validation error'
          }
        });
        res.status(400).json({ error: 'Invalid request data' });
      }
    };
  };

  // Sensitive data encryption middleware
  encryptSensitiveData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.securityContext?.userId;
      if (!userId || userId === 'anonymous') {
        return next();
      }

      // Identify and encrypt sensitive fields
      if (req.body && this.hasSensitiveData(req.body)) {
        const sensitiveFields = this.extractSensitiveFields(req.body);
        
        for (const [field, value] of Object.entries(sensitiveFields)) {
          if (value && typeof value === 'string') {
            const { encrypted } = await this.securityService.encryptData(value, `pii_${field}`, userId);
            req.body[field] = encrypted;
          }
        }

        await this.securityService.logAuditEvent({
          userId,
          action: 'data_encryption',
          resource: 'sensitive_data',
          details: {
            encryptedFields: Object.keys(sensitiveFields),
            path: req.path
          },
          ipAddress: req.securityContext?.ipAddress || 'unknown',
          userAgent: req.securityContext?.userAgent || 'unknown'
        });
      }

      next();
    } catch (error) {
      await this.securityService.logSecurityIncident({
        type: 'encryption_middleware_error',
        description: 'Error during data encryption middleware',
        severity: 'high',
        userId: req.securityContext?.userId,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          path: req.path
        }
      });
      res.status(500).json({ error: 'Data processing error' });
    }
  };

  // Security headers middleware
  securityHeaders = (req: Request, res: Response, next: NextFunction) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // HSTS for HTTPS
    if (req.secure) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    next();
  };

  // Compliance monitoring middleware
  complianceMonitor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.securityContext?.userId;
    
    if (userId && userId !== 'anonymous' && this.isPersonalDataRequest(req)) {
      await this.securityService.logAuditEvent({
        userId,
        action: 'personal_data_access',
        resource: req.path,
        details: {
          dataType: this.identifyDataType(req),
          legalBasis: 'legitimate_interest',
          purpose: this.determinePurpose(req.path)
        },
        ipAddress: req.securityContext?.ipAddress || 'unknown',
        userAgent: req.securityContext?.userAgent || 'unknown'
      });
    }

    next();
  };

  // Data minimization middleware
  dataMinimization = (allowedFields: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.body && typeof req.body === 'object') {
        // Remove fields not in allowedFields list
        const sanitizedBody: any = {};
        for (const field of allowedFields) {
          if (req.body.hasOwnProperty(field)) {
            sanitizedBody[field] = req.body[field];
          }
        }
        req.body = sanitizedBody;

        // Log data minimization
        if (req.securityContext?.userId) {
          setImmediate(async () => {
            await this.securityService.logAuditEvent({
              userId: req.securityContext!.userId,
              action: 'data_minimization',
              resource: req.path,
              details: {
                allowedFields,
                actualFields: Object.keys(sanitizedBody)
              },
              ipAddress: req.securityContext!.ipAddress,
              userAgent: req.securityContext!.userAgent
            });
          });
        }
      }
      next();
    };
  };

  // Helper methods
  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'ssn', 'ein', 'creditCard', 'bankAccount', 'dateOfBirth'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private hasSensitiveData(data: any): boolean {
    const sensitiveFields = ['ssn', 'ein', 'dateOfBirth', 'bankAccount', 'creditCard'];
    return sensitiveFields.some(field => data.hasOwnProperty(field));
  }

  private extractSensitiveFields(data: any): Record<string, any> {
    const sensitiveFields = ['ssn', 'ein', 'dateOfBirth', 'bankAccount', 'creditCard'];
    const extracted: Record<string, any> = {};

    for (const field of sensitiveFields) {
      if (data[field]) {
        extracted[field] = data[field];
      }
    }

    return extracted;
  }

  private isPersonalDataRequest(req: Request): boolean {
    const personalDataPaths = ['/api/business-entities', '/api/user', '/api/boir-filings'];
    return personalDataPaths.some(path => req.path.startsWith(path));
  }

  private identifyDataType(req: Request): string {
    if (req.path.includes('business-entities')) return 'business_information';
    if (req.path.includes('user')) return 'personal_information';
    if (req.path.includes('boir')) return 'beneficial_ownership_information';
    return 'general_data';
  }

  private determinePurpose(path: string): string {
    if (path.includes('business-entities')) return 'business_entity_formation';
    if (path.includes('boir')) return 'regulatory_compliance';
    if (path.includes('mailbox')) return 'mail_management';
    return 'platform_operation';
  }
}

export const securityMiddleware = new SecurityMiddleware();