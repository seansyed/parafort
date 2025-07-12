import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface PersonalizedRecommendationsProps {
  recommendations: PersonalizedRecommendation[];
  onAcceptRecommendation: (serviceId: number) => void;
  onDismissRecommendation: (serviceId: number) => void;
  className?: string;
}

export default function PersonalizedRecommendations({
  recommendations,
  onAcceptRecommendation,
  onDismissRecommendation,
  className = ''
}: PersonalizedRecommendationsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());

  const handleAccept = (serviceId: number) => {
    onAcceptRecommendation(serviceId);
  };

  const handleDismiss = (serviceId: number) => {
    setDismissedIds(prev => new Set([...prev, serviceId]));
    onDismissRecommendation(serviceId);
  };

  const visibleRecommendations = recommendations.filter(
    rec => !dismissedIds.has(rec.serviceId)
  );

  if (visibleRecommendations.length === 0) {
    return null;
  }

  return (
    <Card className={`${className} border-blue-200 bg-blue-50`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <CardTitle className="text-blue-800">Recommended for You</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleRecommendations.map((recommendation) => (
          <div
            key={recommendation.serviceId}
            className="bg-white rounded-lg border border-blue-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">
                    Service #{recommendation.serviceId}
                  </h4>
                  <Badge 
                    variant="secondary"
                    className={`text-xs ${
                      recommendation.confidence > 0.8 
                        ? 'bg-green-100 text-green-800' 
                        : recommendation.confidence > 0.6
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {Math.round(recommendation.confidence * 100)}% match
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {recommendation.reason}
                </p>
              </div>
            </div>

            {recommendation.pricing && (
              <div className="bg-gray-50 rounded-md p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {recommendation.pricing.discount && recommendation.pricing.discount > 0 ? (
                      <>
                        <span className="text-lg font-semibold text-green-600">
                          ${recommendation.pricing.suggestedPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${recommendation.pricing.originalPrice}
                        </span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {recommendation.pricing.discount}% off
                        </Badge>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-gray-900">
                        ${recommendation.pricing.originalPrice}
                      </span>
                    )}
                  </div>
                  {recommendation.pricing.discount && recommendation.pricing.discount > 0 && (
                    <span className="text-sm font-medium text-green-600">
                      Save ${(recommendation.pricing.originalPrice - recommendation.pricing.suggestedPrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleAccept(recommendation.serviceId)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add to Order
              </Button>
              <Button
                onClick={() => handleDismiss(recommendation.serviceId)}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                Not Interested
              </Button>
            </div>
          </div>
        ))}

        <div className="text-xs text-blue-600 pt-2 border-t border-blue-200">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>AI-powered recommendations based on your needs and preferences</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}