import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface UserBehaviorData {
  sessionId: string;
  sessionStart: Date;
  fieldInteractions: Record<string, number>;
  pageViews: number;
  deviceType: string;
  hesitationScore: number;
  abandonmentRisk: number;
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

interface VoiceCommand {
  command: string;
  transcription: string;
  confidence: number;
  fieldName?: string;
  extractedValue?: string;
}

export function useAIFeatures(serviceId?: number) {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [behaviorData, setBehaviorData] = useState<UserBehaviorData>({
    sessionId,
    sessionStart: new Date(),
    fieldInteractions: {},
    pageViews: 1,
    deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    hesitationScore: 0,
    abandonmentRisk: 0
  });
  
  const [smartFields, setSmartFields] = useState<SmartFieldPrediction[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [dynamicPricing, setDynamicPricing] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState<VoiceCommand | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fieldStartTimes = useRef<Record<string, number>>({});
  const sessionStartTime = useRef(Date.now());

  // Initialize AI session tracking
  useEffect(() => {
    const initializeSession = async () => {
      try {
        await apiRequest('POST', '/api/ai/track-session', {
          sessionId,
          userId: null, // Will be set if user is authenticated
          fingerprint: generateFingerprint(),
          deviceType: behaviorData.deviceType,
          browserInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            screen: {
              width: screen.width,
              height: screen.height,
              colorDepth: screen.colorDepth
            }
          },
          ipAddress: await getClientIP()
        });
      } catch (error) {
        console.error('Failed to initialize AI session:', error);
      }
    };

    initializeSession();

    // Set up page unload tracking
    const handleBeforeUnload = () => {
      updateSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId]);

  // Smart field predictions
  useEffect(() => {
    if (serviceId) {
      const fetchSmartFields = async () => {
        try {
          const predictions = await apiRequest('GET', `/api/ai/smart-fields/${serviceId}`);
          setSmartFields(predictions);
        } catch (error) {
          console.error('Failed to fetch smart field predictions:', error);
        }
      };

      fetchSmartFields();
    }
  }, [serviceId]);

  // Personalized recommendations
  useEffect(() => {
    if (serviceId) {
      const fetchRecommendations = async () => {
        try {
          const recs = await apiRequest('GET', `/api/ai/recommendations/${serviceId}`, null, {
            'x-session-id': sessionId
          });
          setRecommendations(recs);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      };

      fetchRecommendations();
    }
  }, [serviceId, sessionId]);

  // Dynamic pricing
  useEffect(() => {
    if (serviceId) {
      const fetchDynamicPricing = async () => {
        try {
          const pricing = await apiRequest('GET', `/api/ai/dynamic-pricing/${serviceId}`, null, {
            'x-session-id': sessionId
          });
          setDynamicPricing(pricing);
        } catch (error) {
          console.error('Failed to fetch dynamic pricing:', error);
        }
      };

      fetchDynamicPricing();
    }
  }, [serviceId, sessionId]);

  // Track field interactions
  const trackFieldInteraction = async (fieldName: string, fieldType: string, value: string) => {
    const startTime = fieldStartTimes.current[fieldName];
    if (!startTime) return;

    const dwellTime = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      await apiRequest('POST', '/api/ai/field-interaction', {
        sessionId,
        serviceId,
        fieldName,
        fieldType,
        dwellTime,
        valueLength: value.length,
        changeCount: behaviorData.fieldInteractions[fieldName] || 0
      });

      setBehaviorData(prev => ({
        ...prev,
        fieldInteractions: {
          ...prev.fieldInteractions,
          [fieldName]: dwellTime
        }
      }));
    } catch (error) {
      console.error('Failed to track field interaction:', error);
    }
  };

  // Start tracking field focus
  const startFieldTracking = (fieldName: string) => {
    fieldStartTimes.current[fieldName] = Date.now();
  };

  // Analyze abandonment risk
  const analyzeAbandonmentRisk = async () => {
    try {
      const analysis = await apiRequest('POST', '/api/ai/analyze-abandonment', {
        ...behaviorData,
        sessionDuration: Math.floor((Date.now() - sessionStartTime.current) / 1000)
      });

      setBehaviorData(prev => ({
        ...prev,
        abandonmentRisk: analysis.riskScore,
        hesitationScore: analysis.riskScore
      }));

      return analysis;
    } catch (error) {
      console.error('Failed to analyze abandonment risk:', error);
      return null;
    }
  };

  // Voice-to-fill functionality
  const startVoiceInput = (fieldName: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      const command: VoiceCommand = {
        command: 'fill_field',
        transcription: transcript,
        confidence,
        fieldName,
        extractedValue: transcript.trim()
      };

      setVoiceCommand(command);

      try {
        await apiRequest('POST', '/api/ai/voice-command', {
          sessionId,
          serviceId,
          ...command
        });
      } catch (error) {
        console.error('Failed to record voice command:', error);
      }

      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Stop voice input
  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Fraud analysis
  const analyzeFraud = async (orderData: any) => {
    try {
      const analysis = await apiRequest('POST', '/api/ai/analyze-fraud', {
        orderData,
        behaviorData,
        sessionId
      });

      return analysis;
    } catch (error) {
      console.error('Failed to analyze fraud risk:', error);
      return null;
    }
  };

  // Update session data
  const updateSession = async () => {
    try {
      await apiRequest('POST', '/api/ai/update-session', {
        sessionId,
        updates: {
          totalDuration: Math.floor((Date.now() - sessionStartTime.current) / 1000),
          pageViews: behaviorData.pageViews,
          fraudRiskScore: behaviorData.abandonmentRisk
        }
      });
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  };

  // Get smart field suggestion
  const getFieldSuggestion = (fieldName: string): SmartFieldPrediction | null => {
    if (!Array.isArray(smartFields)) return null;
    return smartFields.find(field => field.fieldName === fieldName) || null;
  };

  return {
    sessionId,
    behaviorData,
    smartFields,
    recommendations,
    dynamicPricing,
    voiceCommand,
    isListening,
    
    // Methods
    trackFieldInteraction,
    startFieldTracking,
    analyzeAbandonmentRisk,
    startVoiceInput,
    stopVoiceInput,
    analyzeFraud,
    updateSession,
    getFieldSuggestion
  };
}

// Utility functions
function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return btoa(fingerprint).substring(0, 32);
}

async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return '127.0.0.1';
  }
}