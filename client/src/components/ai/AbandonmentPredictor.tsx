import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AbandonmentRisk {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  triggers: string[];
  recommendations: string[];
}

interface AbandonmentPredictorProps {
  riskData: AbandonmentRisk | null;
  onOfferHelp: () => void;
  onOfferDiscount: () => void;
  onSimplifyForm: () => void;
  className?: string;
}

export default function AbandonmentPredictor({
  riskData,
  onOfferHelp,
  onOfferDiscount,
  onSimplifyForm,
  className = ''
}: AbandonmentPredictorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (riskData && riskData.riskLevel !== 'low' && !isDismissed) {
      // Show intervention after a delay to avoid being intrusive
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [riskData, isDismissed]);

  if (!riskData || !isVisible || isDismissed || riskData.riskLevel === 'low') {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getHelpMessage = (level: string) => {
    switch (level) {
      case 'high':
        return "We noticed you might need some assistance. Would you like help completing your order?";
      case 'medium':
        return "Having trouble with something? We're here to help make this process easier.";
      default:
        return "Let us know if you need any assistance with your order.";
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <Card className={`${className} ${getRiskColor(riskData.riskLevel)} border-2 animate-in slide-in-from-bottom-4 duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {getRiskIcon(riskData.riskLevel)}
          <div className="flex-1">
            <h4 className="font-medium mb-2">
              {getHelpMessage(riskData.riskLevel)}
            </h4>
            
            {riskData.recommendations.length > 0 && (
              <div className="space-y-2 mb-4">
                {riskData.recommendations.includes('Offer chat assistance') && (
                  <Button 
                    onClick={onOfferHelp}
                    size="sm" 
                    variant="outline"
                    className="mr-2 mb-2 bg-white hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    Get Help
                  </Button>
                )}
                
                {riskData.recommendations.includes('Offer onboarding discount') && (
                  <Button 
                    onClick={onOfferDiscount}
                    size="sm" 
                    className="mr-2 mb-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Apply Discount
                  </Button>
                )}
                
                {riskData.recommendations.includes('Offer simplified mobile form') && (
                  <Button 
                    onClick={onSimplifyForm}
                    size="sm" 
                    variant="outline"
                    className="mr-2 mb-2 bg-white hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 000 2h11.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 10-1.414 1.414L14.586 4H3z" clipRule="evenodd" />
                    </svg>
                    Simplify Form
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs opacity-75">
                Risk Level: {riskData.riskLevel.toUpperCase()} ({Math.round(riskData.riskScore * 100)}%)
              </div>
              <Button 
                onClick={handleDismiss}
                variant="ghost" 
                size="sm"
                className="text-xs h-6 px-2"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}