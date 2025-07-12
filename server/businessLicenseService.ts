import { db } from './db';
import { 
  businessProfiles, 
  licenseRequirements, 
  licenseApplications, 
  licenseRenewals, 
  licenseVerifications, 
  complianceAlerts,
  businessEntities,
  type InsertBusinessProfile,
  type InsertLicenseRequirement,
  type InsertLicenseApplication,
  type InsertLicenseVerification,
  type InsertComplianceAlert,
  type BusinessProfile,
  type LicenseRequirement,
  type LicenseApplication,
  type ComplianceAlert
} from '@shared/schema';
import { eq, and, desc, asc, sql, lt, gte } from 'drizzle-orm';

// Business License Service with API integrations
export class BusinessLicenseService {
  
  // Create or update business profile
  async createBusinessProfile(data: InsertBusinessProfile): Promise<BusinessProfile> {
    const [profile] = await db
      .insert(businessProfiles)
      .values({
        ...data,
        profileStatus: 'complete'
      })
      .returning();
    
    // Trigger license discovery after profile creation
    await this.discoverLicenseRequirements(profile.id);
    
    return profile;
  }

  async updateBusinessProfile(id: number, data: Partial<InsertBusinessProfile>): Promise<BusinessProfile> {
    const [profile] = await db
      .update(businessProfiles)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(businessProfiles.id, id))
      .returning();
    
    // Re-trigger license discovery if business activities or locations changed
    if (data.businessActivities || data.operatingLocations) {
      await this.discoverLicenseRequirements(id);
    }
    
    return profile;
  }

  async getBusinessProfile(businessEntityId: number): Promise<BusinessProfile | null> {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.businessEntityId, businessEntityId));
    
    return profile || null;
  }

  // License discovery using business verification APIs
  async discoverLicenseRequirements(businessProfileId: number): Promise<LicenseRequirement[]> {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.id, businessProfileId));

    if (!profile) {
      throw new Error('Business profile not found');
    }

    // Get existing requirements to avoid duplicates
    const existingRequirements = await db
      .select()
      .from(licenseRequirements)
      .where(eq(licenseRequirements.businessProfileId, businessProfileId));

    const newRequirements: InsertLicenseRequirement[] = [];

    try {
      // Simulate Avalara License Guidance API integration
      const avalaraRequirements = await this.getAvalaraLicenseRequirements(profile);
      newRequirements.push(...avalaraRequirements);

      // Add industry-specific requirements
      const industryRequirements = await this.getIndustrySpecificRequirements(profile);
      newRequirements.push(...industryRequirements);

      // Add location-based requirements
      const locationRequirements = await this.getLocationBasedRequirements(profile);
      newRequirements.push(...locationRequirements);

      // Filter out duplicates
      const uniqueRequirements = newRequirements.filter(req => 
        !existingRequirements.some(existing => 
          existing.licenseName === req.licenseName && 
          existing.jurisdiction === req.jurisdiction
        )
      );

      if (uniqueRequirements.length > 0) {
        const insertedRequirements = await db
          .insert(licenseRequirements)
          .values(uniqueRequirements)
          .returning();

        // Create compliance alerts for new requirements
        await this.createComplianceAlertsForNewRequirements(businessProfileId, insertedRequirements);

        return insertedRequirements;
      }

      return [];
    } catch (error) {
      console.error('Error discovering license requirements:', error);
      throw error;
    }
  }

  // Simulate Avalara License Guidance API
  private async getAvalaraLicenseRequirements(profile: BusinessProfile): Promise<InsertLicenseRequirement[]> {
    // In production, this would call the actual Avalara API
    const requirements: InsertLicenseRequirement[] = [];

    // Sales tax permits for businesses with sales activities
    if (profile.salesChannels?.some(channel => ['retail', 'online', 'wholesale'].includes(channel))) {
      for (const location of profile.operatingLocations) {
        const state = this.extractStateFromLocation(location);
        if (state) {
          requirements.push({
            businessProfileId: profile.id,
            licenseName: `${state} Sales Tax Permit`,
            licenseCategory: 'sales-tax',
            issuingAuthority: `${state} Department of Revenue`,
            jurisdiction: 'state',
            jurisdictionCode: state,
            description: `Required for businesses selling taxable goods or services in ${state}`,
            requirements: ['Business registration', 'Federal EIN', 'Business bank account'],
            applicationUrl: `https://${state.toLowerCase()}.gov/revenue/sales-tax-permit`,
            applicationFee: 0, // Many states don't charge for sales tax permits
            renewalPeriod: 'annual',
            processingTime: '2-4 weeks',
            priority: 'high',
            isRequired: true,
            naicsCompatible: ['44', '45', '72'], // Retail, wholesale, accommodation/food
            businessSizeRequirement: 'all'
          });
        }
      }
    }

    return requirements;
  }

  // Get industry-specific license requirements
  private async getIndustrySpecificRequirements(profile: BusinessProfile): Promise<InsertLicenseRequirement[]> {
    const requirements: InsertLicenseRequirement[] = [];
    const industryCode = profile.industryType;

    // Professional services requirements
    if (profile.specializedServices?.length) {
      for (const service of profile.specializedServices) {
        if (service.toLowerCase().includes('accounting') || service.toLowerCase().includes('cpa')) {
          requirements.push({
            businessProfileId: profile.id,
            licenseName: 'CPA License',
            licenseCategory: 'professional',
            issuingAuthority: 'State Board of Accountancy',
            jurisdiction: 'state',
            description: 'Required for providing certified public accounting services',
            requirements: ['CPA certification', 'State examination', 'Continuing education'],
            applicationFee: 15000, // $150 in cents
            renewalPeriod: 'annual',
            processingTime: '4-6 weeks',
            priority: 'high',
            isRequired: true,
            naicsCompatible: ['541211'],
            businessSizeRequirement: 'all'
          });
        }

        if (service.toLowerCase().includes('legal') || service.toLowerCase().includes('attorney')) {
          requirements.push({
            businessProfileId: profile.id,
            licenseName: 'Attorney Bar License',
            licenseCategory: 'professional',
            issuingAuthority: 'State Bar Association',
            jurisdiction: 'state',
            description: 'Required for practicing law and providing legal services',
            requirements: ['Law degree', 'Bar examination', 'Character and fitness review'],
            applicationFee: 50000, // $500 in cents
            renewalPeriod: 'annual',
            processingTime: '8-12 weeks',
            priority: 'high',
            isRequired: true,
            naicsCompatible: ['541110'],
            businessSizeRequirement: 'all'
          });
        }

        if (service.toLowerCase().includes('real estate')) {
          requirements.push({
            businessProfileId: profile.id,
            licenseName: 'Real Estate Broker License',
            licenseCategory: 'professional',
            issuingAuthority: 'State Real Estate Commission',
            jurisdiction: 'state',
            description: 'Required for real estate brokerage operations',
            requirements: ['Real estate education', 'Experience requirements', 'State examination'],
            applicationFee: 30000, // $300 in cents
            renewalPeriod: 'biennial',
            processingTime: '6-8 weeks',
            priority: 'high',
            isRequired: true,
            naicsCompatible: ['531210'],
            businessSizeRequirement: 'all'
          });
        }
      }
    }

    // Food service requirements
    if (profile.handlesFood) {
      requirements.push({
        businessProfileId: profile.id,
        licenseName: 'Food Service License',
        licenseCategory: 'health-safety',
        issuingAuthority: 'Local Health Department',
        jurisdiction: 'county',
        description: 'Required for businesses handling, preparing, or serving food',
        requirements: ['Food safety training', 'Kitchen inspection', 'Handler permits'],
        applicationFee: 20000, // $200 in cents
        renewalPeriod: 'annual',
        processingTime: '2-4 weeks',
        priority: 'high',
        isRequired: true,
        naicsCompatible: ['722'],
        businessSizeRequirement: 'all'
      });
    }

    // Contractor licenses based on industry
    if (industryCode?.startsWith('23')) { // Construction industry
      requirements.push({
        businessProfileId: profile.id,
        licenseName: 'General Contractor License',
        licenseCategory: 'industry-specific',
        issuingAuthority: 'State Contractor Licensing Board',
        jurisdiction: 'state',
        description: 'Required for construction and contracting work',
        requirements: ['Experience verification', 'Trade examination', 'Insurance requirements', 'Bond'],
        applicationFee: 40000, // $400 in cents
        renewalPeriod: 'biennial',
        processingTime: '4-8 weeks',
        priority: 'high',
        isRequired: true,
        naicsCompatible: ['236', '237', '238'],
        businessSizeRequirement: 'all'
      });
    }

    return requirements;
  }

  // Get location-based requirements
  private async getLocationBasedRequirements(profile: BusinessProfile): Promise<InsertLicenseRequirement[]> {
    const requirements: InsertLicenseRequirement[] = [];

    // General business licenses for each operating location
    for (const location of profile.operatingLocations) {
      const { city, county, state } = this.parseLocation(location);

      if (city) {
        requirements.push({
          businessProfileId: profile.id,
          licenseName: `${city} Business License`,
          licenseCategory: 'general',
          issuingAuthority: `City of ${city}`,
          jurisdiction: 'city',
          jurisdictionCode: city.toLowerCase().replace(/\s+/g, '-'),
          description: `General business license required to operate within ${city} city limits`,
          requirements: ['Business registration', 'Zoning compliance', 'Fire safety inspection'],
          applicationUrl: `https://${city.toLowerCase().replace(/\s+/g, '')}.gov/business-license`,
          applicationFee: 10000, // $100 in cents
          renewalPeriod: 'annual',
          processingTime: '1-2 weeks',
          priority: 'medium',
          isRequired: true,
          naicsCompatible: [], // Applies to all
          businessSizeRequirement: 'all'
        });
      }

      if (county && profile.hasPhysicalLocation) {
        requirements.push({
          businessProfileId: profile.id,
          licenseName: `${county} County Business Permit`,
          licenseCategory: 'general',
          issuingAuthority: `${county} County`,
          jurisdiction: 'county',
          jurisdictionCode: county.toLowerCase().replace(/\s+/g, '-'),
          description: `County business permit for operating in ${county} County`,
          requirements: ['Business registration', 'Health permit (if applicable)'],
          applicationFee: 7500, // $75 in cents
          renewalPeriod: 'annual',
          processingTime: '1-3 weeks',
          priority: 'medium',
          isRequired: true,
          naicsCompatible: [],
          businessSizeRequirement: 'all'
        });
      }
    }

    return requirements;
  }

  // Business verification using external APIs
  async verifyBusinessRegistration(businessEntityId: number, provider: 'middesk' | 'signzy' = 'middesk'): Promise<any> {
    try {
      // Get business entity details
      const [entity] = await db
        .select()
        .from(businessEntities)
        .where(eq(businessEntities.id, businessEntityId));

      if (!entity) {
        throw new Error('Business entity not found');
      }

      let verificationResult;
      
      if (provider === 'middesk') {
        verificationResult = await this.verifyWithMiddesk(entity);
      } else {
        verificationResult = await this.verifyWithSignzy(entity);
      }

      // Store verification result
      const [verification] = await db
        .insert(licenseVerifications)
        .values({
          businessEntityId,
          verificationProvider: provider,
          verificationResult: JSON.stringify(verificationResult),
          existingLicenses: JSON.stringify(verificationResult.licenses || []),
          businessRegistrationStatus: verificationResult.status,
          verificationScore: verificationResult.confidence || 85,
          discrepancies: verificationResult.discrepancies || [],
          nextVerificationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        })
        .returning();

      return verification;
    } catch (error) {
      console.error('Business verification failed:', error);
      throw error;
    }
  }

  // Simulate Middesk API verification
  private async verifyWithMiddesk(entity: any): Promise<any> {
    // In production, this would call the actual Middesk API
    return {
      status: 'active',
      confidence: 92,
      licenses: [
        {
          type: 'Business License',
          number: 'BL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          issuingAuthority: `${entity.state} Secretary of State`,
          status: 'active',
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      discrepancies: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Simulate Signzy API verification
  private async verifyWithSignzy(entity: any): Promise<any> {
    // In production, this would call the actual Signzy API
    return {
      status: 'verified',
      confidence: 88,
      licenses: [],
      discrepancies: ['Minor address formatting difference'],
      lastUpdated: new Date().toISOString()
    };
  }

  // License application management
  async createLicenseApplication(data: InsertLicenseApplication): Promise<LicenseApplication> {
    const [application] = await db
      .insert(licenseApplications)
      .values({
        ...data,
        statusHistory: JSON.stringify([{
          status: 'not_started',
          timestamp: new Date().toISOString(),
          note: 'Application created'
        }])
      })
      .returning();

    return application;
  }

  async updateLicenseApplicationStatus(
    applicationId: number, 
    status: string, 
    note?: string,
    additionalData?: any
  ): Promise<LicenseApplication> {
    const [currentApp] = await db
      .select()
      .from(licenseApplications)
      .where(eq(licenseApplications.id, applicationId));

    if (!currentApp) {
      throw new Error('License application not found');
    }

    const statusHistory = currentApp.statusHistory ? JSON.parse(currentApp.statusHistory) : [];
    statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || ''
    });

    const updateData: any = {
      applicationStatus: status,
      statusHistory: JSON.stringify(statusHistory),
      updatedAt: new Date()
    };

    if (status === 'submitted' && !currentApp.submittedAt) {
      updateData.submittedAt = new Date();
    }

    if (status === 'approved') {
      updateData.approvedAt = new Date();
      if (additionalData?.licenseNumber) {
        updateData.licenseNumber = additionalData.licenseNumber;
      }
      if (additionalData?.expiresAt) {
        updateData.expiresAt = new Date(additionalData.expiresAt);
      }
    }

    const [application] = await db
      .update(licenseApplications)
      .set(updateData)
      .where(eq(licenseApplications.id, applicationId))
      .returning();

    // Create renewal tracking for approved licenses
    if (status === 'approved' && application.expiresAt) {
      await this.scheduleRenewalReminder(application);
    }

    return application;
  }

  // Compliance monitoring and alerts
  async checkComplianceStatus(businessProfileId: number): Promise<ComplianceAlert[]> {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const today = new Date();

    // Check for upcoming renewals
    const upcomingRenewals = await db
      .select({
        application: licenseApplications,
        requirement: licenseRequirements
      })
      .from(licenseApplications)
      .innerJoin(licenseRequirements, eq(licenseApplications.licenseRequirementId, licenseRequirements.id))
      .where(
        and(
          eq(licenseApplications.businessProfileId, businessProfileId),
          eq(licenseApplications.applicationStatus, 'approved'),
          lt(licenseApplications.expiresAt, thirtyDaysFromNow),
          gte(licenseApplications.expiresAt, today)
        )
      );

    const alerts: InsertComplianceAlert[] = [];

    for (const renewal of upcomingRenewals) {
      const daysUntilExpiry = Math.ceil(
        (renewal.application.expiresAt!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      alerts.push({
        businessProfileId,
        alertType: 'renewal_due',
        alertTitle: `${renewal.requirement.licenseName} Renewal Due`,
        alertMessage: `Your ${renewal.requirement.licenseName} expires in ${daysUntilExpiry} days. Please renew to maintain compliance.`,
        severity: daysUntilExpiry <= 7 ? 'critical' : daysUntilExpiry <= 14 ? 'high' : 'medium',
        relatedApplicationId: renewal.application.id,
        actionUrl: renewal.requirement.applicationUrl || ''
      });
    }

    // Check for overdue applications
    const overdueApplications = await db
      .select({
        application: licenseApplications,
        requirement: licenseRequirements
      })
      .from(licenseApplications)
      .innerJoin(licenseRequirements, eq(licenseApplications.licenseRequirementId, licenseRequirements.id))
      .where(
        and(
          eq(licenseApplications.businessProfileId, businessProfileId),
          eq(licenseApplications.applicationStatus, 'not_started'),
          eq(licenseRequirements.priority, 'high')
        )
      );

    for (const overdue of overdueApplications) {
      alerts.push({
        businessProfileId,
        alertType: 'application_overdue',
        alertTitle: `High Priority License Application Pending`,
        alertMessage: `${overdue.requirement.licenseName} is required for your business operations. Please complete the application process.`,
        severity: 'high',
        relatedApplicationId: overdue.application.id,
        actionUrl: overdue.requirement.applicationUrl || ''
      });
    }

    // Insert new alerts
    if (alerts.length > 0) {
      const insertedAlerts = await db
        .insert(complianceAlerts)
        .values(alerts)
        .returning();

      return insertedAlerts;
    }

    return [];
  }

  // Helper methods
  private async createComplianceAlertsForNewRequirements(
    businessProfileId: number, 
    requirements: LicenseRequirement[]
  ): Promise<void> {
    const alerts: InsertComplianceAlert[] = requirements
      .filter(req => req.priority === 'high')
      .map(req => ({
        businessProfileId,
        alertType: 'new_requirement',
        alertTitle: 'New License Requirement Identified',
        alertMessage: `We've identified that your business may need a ${req.licenseName}. Please review and apply if applicable.`,
        severity: 'medium',
        relatedLicenseId: req.id,
        actionUrl: req.applicationUrl || ''
      }));

    if (alerts.length > 0) {
      await db.insert(complianceAlerts).values(alerts);
    }
  }

  private async scheduleRenewalReminder(application: LicenseApplication): Promise<void> {
    if (!application.expiresAt) return;

    const reminderDate = new Date(application.expiresAt.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days before

    await db
      .insert(licenseRenewals)
      .values({
        licenseApplicationId: application.id,
        renewalDueDate: application.expiresAt,
        renewalStatus: 'pending'
      });

    await db
      .update(licenseApplications)
      .set({
        nextReminderDate: reminderDate
      })
      .where(eq(licenseApplications.id, application.id));
  }

  private extractStateFromLocation(location: string): string | null {
    // Simple state extraction - in production, use a more robust location parser
    const stateAbbreviations = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    const parts = location.split(',').map(part => part.trim().toUpperCase());
    for (const part of parts) {
      if (stateAbbreviations.includes(part)) {
        return part;
      }
    }
    return null;
  }

  private parseLocation(location: string): { city?: string; county?: string; state?: string } {
    const parts = location.split(',').map(part => part.trim());
    
    return {
      city: parts[0] || undefined,
      county: parts[1]?.includes('County') ? parts[1] : undefined,
      state: this.extractStateFromLocation(location) || undefined
    };
  }

  // Dashboard data methods
  async getBusinessProfileDashboard(businessEntityId: number): Promise<any> {
    const profile = await this.getBusinessProfile(businessEntityId);
    if (!profile) return null;

    const [requirements, applications, alerts] = await Promise.all([
      db.select().from(licenseRequirements).where(eq(licenseRequirements.businessProfileId, profile.id)),
      db.select().from(licenseApplications).where(eq(licenseApplications.businessProfileId, profile.id)),
      db.select().from(complianceAlerts).where(
        and(
          eq(complianceAlerts.businessProfileId, profile.id),
          sql`${complianceAlerts.resolvedAt} IS NULL`
        )
      )
    ]);

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.applicationStatus] = (acc[app.applicationStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      profile,
      summary: {
        totalRequirements: requirements.length,
        completedApplications: statusCounts.approved || 0,
        pendingApplications: (statusCounts.not_started || 0) + (statusCounts.in_progress || 0),
        activeAlerts: alerts.length
      },
      requirements,
      applications,
      alerts
    };
  }
}

export const businessLicenseService = new BusinessLicenseService();