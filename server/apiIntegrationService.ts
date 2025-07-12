import { securityService } from './securityService';

export interface ApiProviderConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  rateLimit: number;
  timeout: number;
  retryAttempts: number;
}

export interface BusinessVerificationRequest {
  businessName: string;
  state: string;
  entityType: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface BusinessVerificationResponse {
  isValid: boolean;
  confidence: number;
  status: 'active' | 'inactive' | 'suspended' | 'dissolved' | 'unknown';
  registrationNumber?: string;
  registrationDate?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  officers?: Array<{
    name: string;
    title: string;
    address?: string;
  }>;
  filingStatus: {
    goodStanding: boolean;
    lastFilingDate?: string;
    nextFilingDue?: string;
  };
  complianceAlerts: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    dueDate?: string;
  }>;
}

export interface StateFilingRequirement {
  state: string;
  entityType: string;
  requirements: Array<{
    type: string;
    description: string;
    fee: number;
    timeframe: string;
    isRequired: boolean;
  }>;
  processingTime: string;
  filingMethods: Array<'online' | 'mail' | 'fax' | 'in_person'>;
  additionalDocuments: string[];
}

export class ApiIntegrationService {
  private providers: Map<string, ApiProviderConfig> = new Map();
  private rateLimiters: Map<string, { requests: number; resetTime: number }> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Middesk - Business verification and compliance
    if (process.env.MIDDESK_API_KEY) {
      this.providers.set('middesk', {
        name: 'Middesk',
        baseUrl: 'https://api.middesk.com/v1',
        apiKey: process.env.MIDDESK_API_KEY,
        rateLimit: 100,
        timeout: 30000,
        retryAttempts: 3
      });
    }

    // Signzy - Alternative business verification
    if (process.env.SIGNZY_API_KEY) {
      this.providers.set('signzy', {
        name: 'Signzy',
        baseUrl: 'https://api.signzy.com/v2',
        apiKey: process.env.SIGNZY_API_KEY,
        rateLimit: 50,
        timeout: 30000,
        retryAttempts: 3
      });
    }

    // Avalara - Tax compliance and licensing
    if (process.env.AVALARA_API_KEY) {
      this.providers.set('avalara', {
        name: 'Avalara',
        baseUrl: 'https://api.avalara.com/v2',
        apiKey: process.env.AVALARA_API_KEY,
        rateLimit: 200,
        timeout: 30000,
        retryAttempts: 3
      });
    }

    console.log(`Initialized ${this.providers.size} API providers`);
  }

  private async checkRateLimit(provider: string): Promise<boolean> {
    const config = this.providers.get(provider);
    if (!config) return false;

    const limiter = this.rateLimiters.get(provider);
    const now = Date.now();

    if (!limiter) {
      this.rateLimiters.set(provider, { requests: 1, resetTime: now + 60000 });
      return true;
    }

    if (now > limiter.resetTime) {
      this.rateLimiters.set(provider, { requests: 1, resetTime: now + 60000 });
      return true;
    }

    if (limiter.requests >= config.rateLimit) {
      return false;
    }

    limiter.requests++;
    return true;
  }

  private async makeApiRequest(
    provider: string,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    userId?: string
  ): Promise<any> {
    const config = this.providers.get(provider);
    if (!config) {
      throw new Error(`Provider ${provider} not configured`);
    }

    if (!await this.checkRateLimit(provider)) {
      throw new Error(`Rate limit exceeded for provider ${provider}`);
    }

    const url = `${config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ParaFort/1.0'
    };

    // Log API request for audit
    if (userId) {
      await securityService.logAuditEvent({
        userId,
        action: 'api_request',
        resource: `${provider}_api`,
        details: { endpoint, method, provider },
        ipAddress: 'server',
        userAgent: 'ApiIntegrationService'
      });
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // Log successful API response
        if (userId) {
          await securityService.logAuditEvent({
            userId,
            action: 'api_response_success',
            resource: `${provider}_api`,
            details: { endpoint, method, provider, status: response.status },
            ipAddress: 'server',
            userAgent: 'ApiIntegrationService'
          });
        }

        return result;

      } catch (error) {
        lastError = error as Error;
        console.error(`API request attempt ${attempt + 1} failed:`, error);

        if (attempt < config.retryAttempts - 1) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Log failed API request
    if (userId) {
      await securityService.logAuditEvent({
        userId,
        action: 'api_request_failed',
        resource: `${provider}_api`,
        details: { endpoint, method, provider, error: lastError?.message },
        ipAddress: 'server',
        userAgent: 'ApiIntegrationService'
      });
    }

    throw lastError || new Error('All API request attempts failed');
  }

  async verifyBusiness(
    request: BusinessVerificationRequest,
    userId?: string,
    preferredProvider?: string
  ): Promise<BusinessVerificationResponse> {
    // Try preferred provider first, then fallback to available providers
    const providers = preferredProvider && this.providers.has(preferredProvider)
      ? [preferredProvider, ...Array.from(this.providers.keys()).filter(p => p !== preferredProvider)]
      : Array.from(this.providers.keys());

    for (const provider of providers) {
      try {
        if (provider === 'middesk') {
          return await this.verifyWithMiddesk(request, userId);
        } else if (provider === 'signzy') {
          return await this.verifyWithSignzy(request, userId);
        }
      } catch (error) {
        console.error(`Business verification failed with ${provider}:`, error);
        continue;
      }
    }

    // If all providers fail, return a simulated response based on business rules
    console.warn('All business verification providers failed, using fallback verification');
    
    return {
      isValid: request.businessName.length > 3 && request.state.length === 2,
      confidence: 0.6,
      status: 'unknown',
      filingStatus: {
        goodStanding: false
      },
      complianceAlerts: [{
        type: 'verification_failed',
        severity: 'medium',
        description: 'Unable to verify business with external providers. Manual verification recommended.'
      }]
    };
  }

  private async verifyWithMiddesk(
    request: BusinessVerificationRequest,
    userId?: string
  ): Promise<BusinessVerificationResponse> {
    const response = await this.makeApiRequest(
      'middesk',
      '/businesses/search',
      'POST',
      {
        name: request.businessName,
        address: request.address,
        state: request.state
      },
      userId
    );

    // Transform Middesk response to our standard format
    return {
      isValid: response.status === 'active',
      confidence: response.confidence_score || 0.8,
      status: response.status,
      registrationNumber: response.registration_number,
      registrationDate: response.incorporation_date,
      address: response.address ? {
        street: response.address.street_line_1,
        city: response.address.city,
        state: response.address.state,
        zipCode: response.address.postal_code
      } : undefined,
      officers: response.officers?.map((officer: any) => ({
        name: officer.name,
        title: officer.title,
        address: officer.address
      })) || [],
      filingStatus: {
        goodStanding: response.good_standing,
        lastFilingDate: response.last_filing_date,
        nextFilingDue: response.next_filing_due
      },
      complianceAlerts: response.compliance_alerts?.map((alert: any) => ({
        type: alert.type,
        severity: alert.severity,
        description: alert.description,
        dueDate: alert.due_date
      })) || []
    };
  }

  private async verifyWithSignzy(
    request: BusinessVerificationRequest,
    userId?: string
  ): Promise<BusinessVerificationResponse> {
    const response = await this.makeApiRequest(
      'signzy',
      '/business/verify',
      'POST',
      {
        businessName: request.businessName,
        state: request.state,
        entityType: request.entityType
      },
      userId
    );

    // Transform Signzy response to our standard format
    return {
      isValid: response.isValid,
      confidence: response.confidence,
      status: response.businessStatus,
      registrationNumber: response.registrationId,
      registrationDate: response.incorporationDate,
      filingStatus: {
        goodStanding: response.goodStanding,
        lastFilingDate: response.lastFilingDate
      },
      complianceAlerts: response.alerts?.map((alert: any) => ({
        type: alert.alertType,
        severity: alert.priority,
        description: alert.message,
        dueDate: alert.dueDate
      })) || []
    };
  }

  async getStateFilingRequirements(
    state: string,
    entityType: string,
    userId?: string
  ): Promise<StateFilingRequirement> {
    try {
      // Try Avalara first for comprehensive state requirements
      if (this.providers.has('avalara')) {
        const response = await this.makeApiRequest(
          'avalara',
          `/nexus/requirements/${state}/${entityType}`,
          'GET',
          undefined,
          userId
        );

        return {
          state,
          entityType,
          requirements: response.requirements.map((req: any) => ({
            type: req.type,
            description: req.description,
            fee: req.fee,
            timeframe: req.timeframe,
            isRequired: req.mandatory
          })),
          processingTime: response.processing_time,
          filingMethods: response.filing_methods,
          additionalDocuments: response.required_documents
        };
      }
    } catch (error) {
      console.error('Failed to fetch state requirements from API:', error);
    }

    // Fallback to static state requirements
    return this.getStaticStateRequirements(state, entityType);
  }

  private getStaticStateRequirements(state: string, entityType: string): StateFilingRequirement {
    const baseRequirements = [
      {
        type: 'articles_of_incorporation',
        description: `File Articles of ${entityType === 'LLC' ? 'Organization' : 'Incorporation'}`,
        fee: this.getStateFee(state, entityType),
        timeframe: '1-3 business days',
        isRequired: true
      },
      {
        type: 'registered_agent',
        description: 'Designate a registered agent in the state',
        fee: 0,
        timeframe: 'Required at filing',
        isRequired: true
      }
    ];

    if (entityType === 'LLC') {
      baseRequirements.push({
        type: 'operating_agreement',
        description: 'Create an Operating Agreement (recommended)',
        fee: 0,
        timeframe: 'After formation',
        isRequired: false
      });
    }

    return {
      state,
      entityType,
      requirements: baseRequirements,
      processingTime: '1-5 business days',
      filingMethods: ['online', 'mail'],
      additionalDocuments: ['EIN confirmation', 'Business license (if applicable)']
    };
  }

  private getStateFee(state: string, entityType: string): number {
    const fees: Record<string, Record<string, number>> = {
      'DE': { 'LLC': 90, 'Corporation': 89, 'C-Corporation': 89 },
      'CA': { 'LLC': 70, 'Corporation': 100, 'C-Corporation': 100 },
      'NY': { 'LLC': 200, 'Corporation': 125, 'C-Corporation': 125 },
      'TX': { 'LLC': 300, 'Corporation': 300, 'C-Corporation': 300 },
      'FL': { 'LLC': 125, 'Corporation': 70, 'C-Corporation': 70 }
    };

    return fees[state]?.[entityType] || 100;
  }

  async testConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [name, config] of this.providers) {
      try {
        const response = await fetch(`${config.baseUrl}/health`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'User-Agent': 'ParaFort/1.0'
          },
          signal: AbortSignal.timeout(5000)
        });

        results[name] = response.ok;
      } catch (error) {
        results[name] = false;
      }
    }

    return results;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getProviderStatus(): Record<string, { name: string; configured: boolean; lastTest?: boolean }> {
    const status: Record<string, { name: string; configured: boolean; lastTest?: boolean }> = {};
    
    for (const [key, config] of this.providers) {
      status[key] = {
        name: config.name,
        configured: true
      };
    }

    return status;
  }
}

export const apiIntegrationService = new ApiIntegrationService();