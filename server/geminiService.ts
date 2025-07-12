import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client
class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  // Analyze notification content and suggest prioritization
  async analyzeNotificationPriority(notification: {
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }): Promise<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    urgency: number; // 1-10 scale
    reasoning: string;
    suggestedAction?: string;
  }> {
    const prompt = `
    As an AI assistant for a business formation platform called ParaFort, analyze this notification and determine its priority level.

    Notification Details:
    - Type: ${notification.type}
    - Title: ${notification.title}
    - Message: ${notification.message}
    - Metadata: ${JSON.stringify(notification.metadata || {}, null, 2)}

    Consider these factors:
    1. Legal compliance urgency (deadlines, regulatory requirements)
    2. Business impact (revenue, operations, customer satisfaction)
    3. Time sensitivity (immediate action required vs can wait)
    4. User role and context

    Respond in JSON format with:
    {
      "priority": "low|medium|high|critical",
      "urgency": number (1-10),
      "reasoning": "explanation of priority decision",
      "suggestedAction": "recommended next step for user"
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const analysis = JSON.parse(text);
      return analysis;
    } catch (error) {
      console.error('Gemini analysis error:', error);
      // Fallback to basic analysis
      return {
        priority: 'medium',
        urgency: 5,
        reasoning: 'Default priority due to analysis error',
        suggestedAction: 'Review notification manually'
      };
    }
  }

  // Generate personalized notification summaries
  async generateNotificationSummary(notifications: any[], userContext: {
    role: string;
    businessCount: number;
    recentActivity: string[];
  }): Promise<{
    summary: string;
    keyActions: string[];
    urgentItems: number;
  }> {
    const prompt = `
    Generate a personalized notification summary for a ParaFort user.

    User Context:
    - Role: ${userContext.role}
    - Number of businesses: ${userContext.businessCount}
    - Recent activity: ${userContext.recentActivity.join(', ')}

    Notifications (${notifications.length} total):
    ${notifications.map((n, i) => `${i + 1}. [${n.type}] ${n.title}: ${n.message}`).join('\n')}

    Create a concise, actionable summary that:
    1. Highlights the most important items first
    2. Groups related notifications
    3. Suggests prioritized actions
    4. Uses professional, clear language

    Respond in JSON format:
    {
      "summary": "2-3 sentence overview",
      "keyActions": ["action 1", "action 2", "action 3"],
      "urgentItems": number_of_urgent_notifications
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const summary = JSON.parse(text);
      return summary;
    } catch (error) {
      console.error('Gemini summary error:', error);
      return {
        summary: `You have ${notifications.length} notifications requiring attention.`,
        keyActions: ['Review all notifications', 'Check compliance status', 'Update business information'],
        urgentItems: notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length
      };
    }
  }

  // Smart notification grouping and categorization
  async categorizeNotifications(notifications: any[]): Promise<{
    categories: {
      [key: string]: {
        notifications: any[];
        priority: string;
        summary: string;
      }
    };
    recommendations: string[];
  }> {
    const prompt = `
    Categorize and organize these business notifications from ParaFort:

    Notifications:
    ${notifications.map((n, i) => `${i + 1}. [${n.type}] ${n.title}: ${n.message} (Created: ${n.createdAt})`).join('\n')}

    Group them into logical categories such as:
    - Compliance & Legal
    - Financial & Payments
    - Business Operations
    - Administrative Tasks
    - System Updates

    For each category, provide:
    - List of notifications
    - Overall priority level
    - Brief summary of what needs attention

    Also provide 3-5 actionable recommendations for the user.

    Respond in JSON format:
    {
      "categories": {
        "Category Name": {
          "notifications": [notification_ids],
          "priority": "low|medium|high|critical",
          "summary": "what this category contains"
        }
      },
      "recommendations": ["recommendation 1", "recommendation 2", ...]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const categorization = JSON.parse(text);
      return categorization;
    } catch (error) {
      console.error('Gemini categorization error:', error);
      return {
        categories: {
          'All Notifications': {
            notifications: notifications,
            priority: 'medium',
            summary: 'Mixed notification types requiring review'
          }
        },
        recommendations: ['Review all notifications', 'Check for urgent items', 'Update preferences']
      };
    }
  }

  // Generate contextual help and guidance
  async generateContextualHelp(userQuery: string, userContext: any): Promise<{
    answer: string;
    relatedActions: string[];
    helpfulLinks: string[];
  }> {
    const prompt = `
    As a ParaFort business formation platform assistant, help answer this user question:

    Question: "${userQuery}"

    User Context:
    - Role: ${userContext.role || 'user'}
    - Current page: ${userContext.currentPage || 'unknown'}
    - Business entities: ${userContext.businessCount || 0}

    Provide a helpful, accurate response that:
    1. Directly answers their question
    2. Suggests related actions they might need
    3. References relevant platform features

    Focus on business formation, compliance, legal requirements, and platform functionality.

    Respond in JSON format:
    {
      "answer": "direct answer to their question",
      "relatedActions": ["action 1", "action 2", "action 3"],
      "helpfulLinks": ["Settings", "Dashboard", "Compliance Calendar"]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const help = JSON.parse(text);
      return help;
    } catch (error) {
      console.error('Gemini help error:', error);
      return {
        answer: 'I can help you with business formation, compliance, and platform features. Please try rephrasing your question.',
        relatedActions: ['Visit Help Center', 'Contact Support', 'Check Documentation'],
        helpfulLinks: ['Settings', 'Dashboard', 'Support']
      };
    }
  }

  // Analyze and fix code issues
  async analyzeAndFixCode(params: {
    codeSnippet?: string;
    errorMessage?: string;
    description: string;
    filePath?: string;
    projectContext: string;
  }): Promise<{
    analysis: string;
    fixedCode?: string;
    suggestions: string[];
    explanation: string;
  }> {
    const prompt = `
    You are an expert TypeScript/React developer working on ${params.projectContext}.

    ${params.description ? `Issue Description: ${params.description}` : ''}
    ${params.errorMessage ? `Error Message: ${params.errorMessage}` : ''}
    ${params.filePath ? `File Path: ${params.filePath}` : ''}
    ${params.codeSnippet ? `Code with Issues:\n\`\`\`typescript\n${params.codeSnippet}\n\`\`\`` : ''}

    Please analyze this code issue and provide:
    1. A detailed analysis of what's wrong
    2. Fixed code if applicable
    3. Step-by-step suggestions to resolve the issue
    4. Clear explanation of the solution

    Consider common TypeScript/React patterns, Drizzle ORM usage, and modern best practices.

    Respond in JSON format:
    {
      "analysis": "detailed analysis of the issue",
      "fixedCode": "corrected code if applicable",
      "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
      "explanation": "clear explanation of the fix"
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        analysis: text,
        suggestions: ['Review the code structure', 'Check type definitions', 'Verify imports'],
        explanation: 'Manual analysis required'
      };
    } catch (error) {
      console.error('Error analyzing code:', error);
      return {
        analysis: 'Code analysis failed',
        suggestions: ['Check syntax', 'Review type definitions', 'Verify imports'],
        explanation: 'AI analysis unavailable'
      };
    }
  }

  // Generate code based on requirements
  async generateCode(params: {
    requirements: string;
    codeType: string;
    existingCode?: string;
    framework: string;
    projectContext: string;
  }): Promise<{
    code: string;
    explanation: string;
    usage: string;
    dependencies?: string[];
  }> {
    const prompt = `
    You are an expert developer for ${params.projectContext}.

    Generate ${params.codeType} code for: ${params.requirements}

    Framework: ${params.framework}
    ${params.existingCode ? `Existing Code Context:\n\`\`\`typescript\n${params.existingCode}\n\`\`\`` : ''}

    Requirements:
    - Follow TypeScript best practices
    - Use modern React patterns (hooks, functional components)
    - Include proper type definitions
    - Follow the project's patterns (Drizzle ORM, Tailwind CSS, shadcn/ui)
    - Include error handling
    - Make it production-ready

    Respond in JSON format:
    {
      "code": "complete, production-ready code",
      "explanation": "explanation of the implementation",
      "usage": "how to use this code",
      "dependencies": ["any additional dependencies needed"]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        code: text,
        explanation: 'Generated code based on requirements',
        usage: 'Import and use as needed'
      };
    } catch (error) {
      console.error('Error generating code:', error);
      return {
        code: '// Code generation failed\n// Please implement manually',
        explanation: 'AI code generation unavailable',
        usage: 'Manual implementation required'
      };
    }
  }

  // Conversational chat interface
  async chat(message: string, context?: any): Promise<string> {
    const prompt = `
    You are an expert AI assistant for ParaFort, a business formation platform. You help developers with:
    - React/TypeScript development and debugging
    - Form state management and validation
    - Database operations with Drizzle ORM
    - UI/UX improvements with Tailwind CSS
    - Business logic implementation
    - API endpoint development
    - Error troubleshooting

    Project Context: ${context?.projectType || 'ParaFort Business Formation Platform'}
    Tech Stack: ${context?.tech || 'React, TypeScript, Express, PostgreSQL, Drizzle ORM, Tailwind CSS'}
    Current Issue: ${context?.currentIssue || 'General development assistance'}

    User Message: ${message}

    Provide helpful, specific, and actionable advice. Include code examples when relevant.
    If the question is about debugging, ask clarifying questions or suggest debugging steps.
    Keep responses conversational but professional.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      return 'I apologize, but I encountered an error processing your request. Please try rephrasing your question.';
    }
  }
}

export const geminiService = new GeminiService();