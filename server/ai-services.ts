import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";
import type { User, Service, ServiceOrder } from "@shared/schema";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface UserBehaviorPattern {
  userId: string;
  sessionDuration: number;
  fieldDwellTimes: Record<string, number>;
  hesitationScore: number;
  deviceType: string;
  timeOfDay: string;
  previousServices: string[];
  abandonnmentRisk: number;
}

interface SmartFieldPrediction {
  fieldName: string;
  probability: number;
  suggestedValue?: string;
  validationHint?: string;
}

interface PersonalizedRecommendation {
  serviceId: number;
  reason: string;
  confidence: number;
  pricing?: {
    originalPrice: number;
    suggestedPrice: number;
    discount?: number;
  };
}

export class AICheckoutServices {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Smart Field Prediction - AI predicts required fields based on service type + user history
  async predictRequiredFields(
    serviceId: number,
    userId?: string,
    userHistory?: ServiceOrder[]
  ): Promise<SmartFieldPrediction[]> {
    try {
      const service = await storage.getService(serviceId);
      if (!service) return [];

      const prompt = `
        Analyze the service "${service.name}" and predict optimal form fields.
        
        Service Type: ${service.name}
        Service Category: ${service.category || 'Business Services'}
        
        ${userHistory ? `User History: ${userHistory.map(order => order.serviceName).join(', ')}` : ''}
        
        Based on this service type and user history, predict the most important fields to show first.
        Return JSON with predicted fields, probability scores, and validation hints.
        
        Format: {
          "predictions": [
            {
              "fieldName": "businessName",
              "probability": 0.95,
              "suggestedValue": "",
              "validationHint": "Enter your registered business name"
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response);
        return parsed.predictions || [];
      } catch {
        return [];
      }
    } catch (error) {
      console.error('Smart field prediction error:', error);
      return [];
    }
  }

  // Intelligent User Detection - Browser fingerprinting + email pattern recognition
  async detectReturningUser(
    email?: string,
    fingerprint?: string,
    browserData?: any
  ): Promise<{
    isReturningUser: boolean;
    confidence: number;
    suggestedData?: any;
    previousServices?: string[];
  }> {
    if (!email) return { isReturningUser: false, confidence: 0 };

    try {
      // Check email patterns and domain
      const emailDomain = email.split('@')[1];
      const businessUsers = await storage.getUsersByEmailDomain(emailDomain);
      
      if (businessUsers.length > 0) {
        const userOrders = await storage.getOrdersByUserId(businessUsers[0].id);
        
        return {
          isReturningUser: true,
          confidence: businessUsers.length > 1 ? 0.9 : 0.7,
          suggestedData: {
            businessName: businessUsers[0].businessName,
            phone: businessUsers[0].phone,
          },
          previousServices: userOrders.map(order => order.serviceName)
        };
      }

      return { isReturningUser: false, confidence: 0 };
    } catch (error) {
      console.error('User detection error:', error);
      return { isReturningUser: false, confidence: 0 };
    }
  }

  // Personalized Add-ons - AI recommends relevant service upgrades
  async getPersonalizedRecommendations(
    currentServiceId: number,
    userId?: string,
    businessType?: string
  ): Promise<PersonalizedRecommendation[]> {
    try {
      const allServices = await storage.getAllServices();
      const currentService = allServices.find(s => s.id === currentServiceId);
      
      if (!currentService) return [];

      let userHistory: ServiceOrder[] = [];
      if (userId) {
        userHistory = await storage.getOrdersByUserId(userId);
      }

      const prompt = `
        Recommend complementary services for a customer purchasing "${currentService.name}".
        
        Current Service: ${currentService.name}
        Business Type: ${businessType || 'General Business'}
        User History: ${userHistory.map(order => order.serviceName).join(', ')}
        
        Available Services: ${allServices.map(s => `${s.id}:${s.name}`).join(', ')}
        
        Recommend 3-5 services that commonly go together with the current service.
        Consider business formation workflows, compliance requirements, and service dependencies.
        
        Return JSON: {
          "recommendations": [
            {
              "serviceId": 7,
              "reason": "Registered Agent service is required for business formation",
              "confidence": 0.9,
              "pricing": {
                "originalPrice": 199,
                "suggestedPrice": 179,
                "discount": 20
              }
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response);
        return parsed.recommendations || [];
      } catch {
        return [];
      }
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return [];
    }
  }

  // Abandonment Predictor - Flags high-risk checkouts based on hesitation patterns
  analyzeAbandonmentRisk(behaviorData: UserBehaviorPattern): {
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    triggers: string[];
    recommendations: string[];
  } {
    const triggers: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // Analyze session duration
    if (behaviorData.sessionDuration > 600) { // 10+ minutes
      riskScore += 0.3;
      triggers.push('Extended session duration');
      recommendations.push('Offer chat assistance');
    }

    // Analyze field dwell times
    const avgDwellTime = Object.values(behaviorData.fieldDwellTimes).reduce((a, b) => a + b, 0) / 
                        Object.keys(behaviorData.fieldDwellTimes).length;
    
    if (avgDwellTime > 30) { // 30+ seconds per field
      riskScore += 0.25;
      triggers.push('High hesitation on form fields');
      recommendations.push('Provide field help tooltips');
    }

    // Device type considerations
    if (behaviorData.deviceType === 'mobile' && avgDwellTime > 20) {
      riskScore += 0.2;
      triggers.push('Mobile user struggling with form');
      recommendations.push('Offer simplified mobile form');
    }

    // Time of day patterns
    if (behaviorData.timeOfDay === 'late' || behaviorData.timeOfDay === 'early') {
      riskScore += 0.1;
      triggers.push('Off-hours usage');
    }

    // Previous service patterns
    if (behaviorData.previousServices.length === 0) {
      riskScore += 0.15;
      triggers.push('First-time customer');
      recommendations.push('Offer onboarding discount');
    }

    const riskLevel = riskScore > 0.6 ? 'high' : riskScore > 0.3 ? 'medium' : 'low';

    return {
      riskLevel,
      riskScore: Math.min(riskScore, 1),
      triggers,
      recommendations
    };
  }

  // Dynamic Pricing Engine - Generates personalized offers
  async generatePersonalizedPricing(
    serviceId: number,
    userId?: string,
    behaviorData?: UserBehaviorPattern
  ): Promise<{
    originalPrice: number;
    suggestedPrice: number;
    discount?: number;
    reason: string;
  }> {
    try {
      const service = await storage.getService(serviceId);
      if (!service) throw new Error('Service not found');

      const basePrice = parseFloat(service.oneTimePrice?.toString() || service.recurringPrice?.toString() || "0");
      let discount = 0;
      let reason = 'Standard pricing';

      // First-time customer discount
      if (userId) {
        const userOrders = await storage.getOrdersByUserId(userId);
        if (userOrders.length === 0) {
          discount = 0.1; // 10% first-time discount
          reason = 'First-time customer discount';
        }
      }

      // High abandonment risk - offer incentive
      if (behaviorData && behaviorData.abandonnmentRisk > 0.7) {
        discount = Math.max(discount, 0.15); // 15% retention discount
        reason = 'Limited time offer';
      }

      // Bundle discount for multiple services
      if (behaviorData && behaviorData.previousServices.length > 2) {
        discount = Math.max(discount, 0.05); // 5% loyalty discount
        reason = 'Loyal customer pricing';
      }

      const suggestedPrice = basePrice * (1 - discount);

      return {
        originalPrice: basePrice,
        suggestedPrice: Math.round(suggestedPrice * 100) / 100,
        discount: discount > 0 ? Math.round(discount * 100) : undefined,
        reason
      };
    } catch (error) {
      console.error('Dynamic pricing error:', error);
      const service = await storage.getService(serviceId);
      const basePrice = parseFloat(service?.oneTimePrice?.toString() || service?.recurringPrice?.toString() || "0");
      
      return {
        originalPrice: basePrice,
        suggestedPrice: basePrice,
        reason: 'Standard pricing'
      };
    }
  }

  // Fraud Shield - Behavioral analysis for suspicious patterns
  analyzeFraudRisk(orderData: any, behaviorData?: UserBehaviorPattern): {
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    recommendedActions: string[];
  } {
    const riskFactors: string[] = [];
    const recommendedActions: string[] = [];
    let riskScore = 0;

    // Unusual session patterns
    if (behaviorData) {
      if (behaviorData.sessionDuration < 60) { // Under 1 minute
        riskScore += 0.3;
        riskFactors.push('Unusually fast completion');
        recommendedActions.push('Require additional verification');
      }

      if (Object.keys(behaviorData.fieldDwellTimes).length < 3) {
        riskScore += 0.2;
        riskFactors.push('Minimal field interaction');
      }
    }

    // Email validation
    if (orderData.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(orderData.email)) {
        riskScore += 0.4;
        riskFactors.push('Invalid email format');
        recommendedActions.push('Verify email address');
      }

      // Disposable email check
      const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
      const emailDomain = orderData.email.split('@')[1];
      if (disposableDomains.includes(emailDomain)) {
        riskScore += 0.5;
        riskFactors.push('Disposable email detected');
        recommendedActions.push('Require phone verification');
      }
    }

    // Business name validation
    if (orderData.businessName && orderData.businessName.length < 3) {
      riskScore += 0.2;
      riskFactors.push('Suspicious business name');
    }

    const riskLevel = riskScore > 0.6 ? 'high' : riskScore > 0.3 ? 'medium' : 'low';

    return {
      riskLevel,
      riskFactors,
      recommendedActions
    };
  }

  // Cognitive Load Optimizer - Dynamically simplifies form layout
  optimizeFormComplexity(
    originalFields: any[],
    userBehavior: UserBehaviorPattern
  ): {
    prioritizedFields: any[];
    hiddenFields: any[];
    simplificationReasons: string[];
  } {
    const simplificationReasons: string[] = [];
    let maxFields = originalFields.length;

    // Reduce complexity for mobile users
    if (userBehavior.deviceType === 'mobile') {
      maxFields = Math.min(maxFields, 5);
      simplificationReasons.push('Optimized for mobile device');
    }

    // Reduce complexity during off-hours
    if (userBehavior.timeOfDay === 'late' || userBehavior.timeOfDay === 'early') {
      maxFields = Math.min(maxFields, 6);
      simplificationReasons.push('Simplified for off-hours usage');
    }

    // Reduce complexity for slow input speed
    const avgDwellTime = Object.values(userBehavior.fieldDwellTimes).reduce((a, b) => a + b, 0) / 
                        Object.keys(userBehavior.fieldDwellTimes).length;
    
    if (avgDwellTime > 25) {
      maxFields = Math.min(maxFields, 4);
      simplificationReasons.push('Reduced complexity for better user experience');
    }

    // Priority order: required fields first, then optional
    const prioritizedFields = originalFields
      .sort((a, b) => {
        if (a.required && !b.required) return -1;
        if (!a.required && b.required) return 1;
        return 0;
      })
      .slice(0, maxFields);

    const hiddenFields = originalFields.slice(maxFields);

    return {
      prioritizedFields,
      hiddenFields,
      simplificationReasons
    };
  }
}

export const aiServices = new AICheckoutServices();