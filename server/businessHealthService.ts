import { db } from './db';
import { 
  businessEntities, 
  businessHealthMetrics, 
  businessHealthInsights, 
  businessHealthTrends,
  type BusinessHealthMetrics, 
  type InsertBusinessHealthMetrics,
  type InsertBusinessHealthInsights,
  type InsertBusinessHealthTrends,
  type BusinessHealthInsights
} from '@shared/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';

export class BusinessHealthService {
  private scoreToGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  async calculateHealthMetrics(businessId: string): Promise<BusinessHealthMetrics | null> {
    try {
      console.log('=== CALCULATING HEALTH METRICS ===');
      console.log('Business ID:', businessId);

      // Verify business exists
      const business = await db.select().from(businessEntities)
        .where(eq(businessEntities.id, businessId))
        .limit(1);

      if (!business.length) {
        console.log('Business not found');
        return null;
      }

      console.log('Business found:', business[0].businessName);

      // Calculate health metrics
      const complianceHealth = await this.calculateComplianceHealth(businessId);
      const documentHealth = await this.calculateDocumentHealth(businessId);
      const financialHealth = await this.calculateFinancialHealth(businessId);
      const riskLevel = await this.calculateRiskLevel(businessId);
      const activityMetrics = await this.calculateActivityMetrics(businessId);

      const healthData: InsertBusinessHealthMetrics = {
        businessEntityId: businessId,
        metricDate: new Date(),
        complianceScore: complianceHealth.score,
        documentScore: documentHealth.score,
        financialScore: financialHealth.score,
        overallScore: Math.round((complianceHealth.score + documentHealth.score + financialHealth.score) / 3),
        riskLevel: riskLevel,
        pendingDeadlines: complianceHealth.pendingDeadlines,
        overdueItems: complianceHealth.overdueItems,
        documentsReceived: documentHealth.received,
        documentsProcessed: documentHealth.processed,
        activeAlerts: activityMetrics.activeAlerts,
        lastActivityDate: activityMetrics.lastActivity,
        complianceGrade: this.scoreToGrade(complianceHealth.score),
        documentGrade: this.scoreToGrade(documentHealth.score),
        financialGrade: this.scoreToGrade(financialHealth.score),
        overallGrade: this.scoreToGrade(Math.round((complianceHealth.score + documentHealth.score + financialHealth.score) / 3))
      };

      console.log('Health data calculated:', healthData);

      // Insert the new metrics
      const [result] = await db.insert(businessHealthMetrics)
        .values(healthData)
        .returning();

      console.log('Health metrics saved to database');
      return result;
    } catch (error) {
      console.error('Error calculating health metrics:', error);
      throw error;
    }
  }

  private async calculateComplianceHealth(businessId: string) {
    // Placeholder implementation - would integrate with compliance system
    const score = Math.floor(Math.random() * 30) + 70; // 70-99
    const pendingDeadlines = Math.floor(Math.random() * 5);
    const overdueItems = Math.floor(Math.random() * 3);
    
    return {
      score,
      pendingDeadlines,
      overdueItems
    };
  }

  private async calculateDocumentHealth(businessId: string) {
    // Placeholder implementation - would integrate with document system
    const received = Math.floor(Math.random() * 20) + 10;
    const processed = Math.floor(Math.random() * received) + Math.floor(received * 0.7);
    const score = Math.round((processed / received) * 100);
    
    return {
      score,
      received,
      processed
    };
  }

  private async calculateFinancialHealth(businessId: string) {
    // Placeholder implementation - would integrate with financial system
    const score = Math.floor(Math.random() * 40) + 60; // 60-99
    
    return {
      score
    };
  }

  private async calculateRiskLevel(businessId: string) {
    // Placeholder implementation - would use complex risk assessment
    const risks = ['low', 'medium', 'high', 'critical'];
    return risks[Math.floor(Math.random() * risks.length)] as 'low' | 'medium' | 'high' | 'critical';
  }

  private async calculateActivityMetrics(businessId: string) {
    // Placeholder implementation
    return {
      activeAlerts: Math.floor(Math.random() * 5),
      lastActivity: new Date()
    };
  }

  async generatePredictiveInsights(businessId: string): Promise<BusinessHealthInsights[]> {
    try {
      console.log('=== GENERATING PREDICTIVE INSIGHTS ===');
      console.log('Business ID:', businessId);

      // Get business context
      const business = await db.select().from(businessEntities)
        .where(eq(businessEntities.id, businessId))
        .limit(1);

      if (!business.length) {
        throw new Error('Business not found');
      }

      // Get recent health metrics for context
      const recentMetrics = await db.select()
        .from(businessHealthMetrics)
        .where(eq(businessHealthMetrics.businessEntityId, businessId))
        .orderBy(desc(businessHealthMetrics.metricDate))
        .limit(5);

      console.log('Recent metrics count:', recentMetrics.length);

      // Generate insights
      const insights = [];
      const savedInsights = [];

      for (const insight of insights) {
        const insertData: InsertBusinessHealthInsights = {
          businessEntityId: businessId,
          insightType: insight.type,
          title: insight.title,
          description: insight.description,
          priority: insight.priority,
          category: insight.category,
          recommendation: insight.recommendation,
          predictedOutcome: insight.predictedOutcome,
          confidenceScore: insight.confidenceScore,
          isActionable: insight.isActionable,
          dataSource: insight.dataSource,
          aiModel: insight.aiModel
        };

        const [saved] = await db.insert(businessHealthInsights)
          .values(insertData)
          .returning();

        savedInsights.push(saved);
      }

      return savedInsights;
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return [];
    }
  }

  async generateInsights(businessId: string): Promise<any[]> {
    try {
      console.log('=== GENERATING INSIGHTS ===');
      console.log('Business ID:', businessId);

      // Verify business exists
      const business = await db.select().from(businessEntities)
        .where(eq(businessEntities.id, businessId))
        .limit(1);

      if (!business.length) {
        throw new Error('Business not found');
      }

      // Get recent health metrics for context
      const metrics = await db.select()
        .from(businessHealthMetrics)
        .where(eq(businessHealthMetrics.businessEntityId, businessId))
        .orderBy(desc(businessHealthMetrics.metricDate))
        .limit(10);

      // Generate insights using AI (placeholder for now)
      const insights = await this.generateAIInsights(business[0], metrics);

      // Store the insights in database
      for (const insight of insights) {
        await db.insert(businessHealthInsights).values({
          businessEntityId: businessId,
          insightType: insight.type,
          title: insight.title,
          description: insight.description,
          priority: insight.severity,
          category: insight.category || 'operational',
          recommendation: Array.isArray(insight.recommendedActions) 
            ? insight.recommendedActions.join('; ') 
            : insight.recommendedActions,
          predictedOutcome: insight.predictedImpact,
          confidenceScore: insight.confidence,
          isActionable: insight.isActionable,
          dataSource: ['ai_generated'],
          aiModel: 'gemini'
        });
      }

      // Update last insight generation timestamp
      await db.update(businessEntities)
        .set({ lastInsightGeneration: new Date() })
        .where(eq(businessEntities.id, businessId));

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }

  private async generateAIInsights(business: any, metrics: any[]): Promise<any[]> {
    // Placeholder for AI insight generation
    const insights = [];

    // Analyze compliance trends
    if (metrics.length > 0) {
      const latestMetric = metrics[0];
      const complianceScore = latestMetric.complianceScore || 0;

      if (complianceScore < 70) {
        insights.push({
          type: 'compliance_risk',
          title: 'Low Compliance Score Detected',
          description: `Your current compliance score is ${complianceScore}%, which is below the recommended threshold of 70%.`,
          severity: 'high',
          category: 'compliance',
          isActionable: true,
          predictedImpact: 'Potential regulatory penalties and business disruptions',
          recommendedActions: ['Review overdue compliance items', 'Schedule compliance audit', 'Update internal processes'],
          confidence: 85
        });
      }

      if (latestMetric.overdueItems > 5) {
        insights.push({
          type: 'deadline_management',
          title: 'Multiple Overdue Items',
          description: `You have ${latestMetric.overdueItems} overdue compliance items that require immediate attention.`,
          severity: 'critical',
          category: 'compliance',
          isActionable: true,
          predictedImpact: 'Risk of regulatory non-compliance and potential fines',
          recommendedActions: ['Prioritize overdue tasks', 'Set up automated reminders', 'Delegate urgent items'],
          confidence: 95
        });
      }

      if (latestMetric.riskLevel === 'high' || latestMetric.riskLevel === 'critical') {
        insights.push({
          type: 'risk_assessment',
          title: 'Elevated Risk Level',
          description: `Your business risk level is currently ${latestMetric.riskLevel}. This requires immediate attention.`,
          severity: latestMetric.riskLevel === 'critical' ? 'critical' : 'high',
          category: 'operational',
          isActionable: true,
          predictedImpact: 'Potential business disruptions and regulatory issues',
          recommendedActions: ['Conduct risk assessment', 'Implement mitigation strategies', 'Monitor key risk indicators'],
          confidence: 90
        });
      }
    }

    // Business-specific insights
    if (business.entityType === 'LLC' && !business.ein) {
      insights.push({
        type: 'documentation',
        title: 'Missing EIN Registration',
        description: 'Your LLC does not have an EIN registered, which is required for tax reporting and business operations.',
        severity: 'medium',
        category: 'legal',
        isActionable: true,
        predictedImpact: 'Delays in business operations and tax filing issues',
        recommendedActions: ['Apply for EIN through IRS', 'Update business registration documents'],
        confidence: 100
      });
    }

    return insights.slice(0, 5); // Limit to 5 insights
  }

  async recordTrend(businessId: string, periodType: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<void> {
    try {
      let startDate: Date;
      const endDate = new Date();

      switch (periodType) {
        case 'daily':
          startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      // Get metrics for the period
      const periodMetrics = await db.select()
        .from(businessHealthMetrics)
        .where(
          and(
            eq(businessHealthMetrics.businessEntityId, businessId),
            gte(businessHealthMetrics.metricDate, startDate)
          )
        )
        .orderBy(desc(businessHealthMetrics.metricDate));

      if (periodMetrics.length === 0) return;

      // Calculate trend data
      const avgCompliance = Math.round(periodMetrics.reduce((sum, m) => sum + (m.complianceScore || 0), 0) / periodMetrics.length);
      const avgDocument = Math.round(periodMetrics.reduce((sum, m) => sum + (m.documentScore || 0), 0) / periodMetrics.length);
      const avgFinancial = Math.round(periodMetrics.reduce((sum, m) => sum + (m.financialScore || 0), 0) / periodMetrics.length);
      const avgOverall = Math.round((avgCompliance + avgDocument + avgFinancial) / 3);

      const trendData: InsertBusinessHealthTrends = {
        businessEntityId: businessId,
        periodType,
        periodStart: startDate,
        periodEnd: endDate,
        avgComplianceScore: avgCompliance,
        avgDocumentScore: avgDocument,
        avgFinancialScore: avgFinancial,
        avgOverallScore: avgOverall,
        totalAlerts: periodMetrics.reduce((sum, m) => sum + (m.activeAlerts || 0), 0),
        improvementAreas: this.identifyImprovementAreas(periodMetrics)
      };

      await db.insert(businessHealthTrends).values(trendData);
    } catch (error) {
      console.error('Error recording trend:', error);
    }
  }

  private identifyImprovementAreas(metrics: BusinessHealthMetrics[]): string[] {
    const areas = [];
    
    const avgCompliance = metrics.reduce((sum, m) => sum + (m.complianceScore || 0), 0) / metrics.length;
    const avgDocument = metrics.reduce((sum, m) => sum + (m.documentScore || 0), 0) / metrics.length;
    const avgFinancial = metrics.reduce((sum, m) => sum + (m.financialScore || 0), 0) / metrics.length;

    if (avgCompliance < 75) areas.push('compliance');
    if (avgDocument < 75) areas.push('document_management');
    if (avgFinancial < 75) areas.push('financial_health');

    return areas;
  }

  async canGenerateInsights(businessId: string): Promise<{ canGenerate: boolean; nextAvailable?: Date; daysRemaining?: number }> {
    try {
      // Get business to check last insight generation
      const [business] = await db.select()
        .from(businessEntities)
        .where(eq(businessEntities.id, businessId))
        .limit(1);

      if (!business) {
        return { canGenerate: false };
      }

      // Rate limiting: Allow insights generation once per week
      const lastGeneration = business.lastInsightGeneration;
      if (!lastGeneration) {
        return { canGenerate: true };
      }

      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      const timeSinceLastGeneration = Date.now() - lastGeneration.getTime();
      
      if (timeSinceLastGeneration >= weekInMs) {
        return { canGenerate: true };
      }

      const nextAvailable = new Date(lastGeneration.getTime() + weekInMs);
      const daysRemaining = Math.ceil((nextAvailable.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

      return {
        canGenerate: false,
        nextAvailable,
        daysRemaining
      };
    } catch (error) {
      console.error('Error checking insight generation eligibility:', error);
      return { canGenerate: false };
    }
  }
}

export const businessHealthService = new BusinessHealthService();