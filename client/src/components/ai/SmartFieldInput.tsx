import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MicrophoneIcon from './MicrophoneIcon';

interface SmartFieldInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  smartPrediction?: {
    fieldName?: string;
    suggestedValue?: string;
    probability: number;
    validationHint?: string;
  } | null;
  voiceEnabled?: boolean;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  isListening?: boolean;
  voiceResult?: string;
  className?: string;
}

export default function SmartFieldInput({
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  smartPrediction,
  voiceEnabled = true,
  onVoiceStart,
  onVoiceStop,
  isListening = false,
  voiceResult,
  className = ''
}: SmartFieldInputProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isVoiceSupported] = useState(
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Apply voice result when available
  useEffect(() => {
    if (voiceResult && voiceResult !== value) {
      onChange(voiceResult);
      setShowSuggestion(false);
    }
  }, [voiceResult, value, onChange]);

  // Show smart prediction when field is focused and empty
  useEffect(() => {
    if (smartPrediction && !value && smartPrediction.probability > 0.7) {
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }
  }, [smartPrediction, value]);

  const handleFocus = () => {
    onFocus?.();
    if (smartPrediction && !value && smartPrediction.probability > 0.7) {
      setShowSuggestion(true);
    }
  };

  const handleBlur = () => {
    onBlur?.();
    setTimeout(() => setShowSuggestion(false), 150); // Delay to allow suggestion click
  };

  const applySuggestion = () => {
    if (smartPrediction?.suggestedValue) {
      onChange(smartPrediction.suggestedValue);
      setShowSuggestion(false);
      inputRef.current?.focus();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      onVoiceStop?.();
    } else {
      onVoiceStart?.();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${className} ${
              smartPrediction && smartPrediction.probability > 0.7 
                ? 'border-green-300 focus:border-green-500' 
                : ''
            } ${isListening ? 'border-blue-300 bg-blue-50' : ''}`}
          />
          
          {/* Smart suggestion tooltip */}
          {smartPrediction?.validationHint && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{smartPrediction.validationHint}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Voice input button */}
        {voiceEnabled && isVoiceSupported && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVoiceToggle}
            className={`px-3 ${isListening ? 'bg-blue-100 border-blue-300' : ''}`}
            title={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? (
              <svg className="w-4 h-4 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </Button>
        )}
      </div>

      {/* Smart suggestion dropdown */}
      {showSuggestion && smartPrediction?.suggestedValue && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-green-200 rounded-md shadow-lg">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Smart Suggestion</span>
              <span className="text-xs text-green-600">
                {Math.round(smartPrediction.probability * 100)}% confident
              </span>
            </div>
            <button
              type="button"
              onClick={applySuggestion}
              className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors"
            >
              <div className="font-medium text-gray-900">
                {smartPrediction.suggestedValue}
              </div>
              {smartPrediction.validationHint && (
                <div className="text-sm text-gray-600 mt-1">
                  {smartPrediction.validationHint}
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}