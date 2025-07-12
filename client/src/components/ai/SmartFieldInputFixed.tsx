import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

// Check if browser supports speech recognition
const isVoiceSupported = typeof window !== 'undefined' && 
  ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

export default function SmartFieldInput({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  smartPrediction,
  voiceEnabled = false,
  onVoiceStart,
  onVoiceStop,
  isListening = false,
  voiceResult,
  className = ""
}: SmartFieldInputProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when voice result changes
  useEffect(() => {
    if (voiceResult && voiceResult.trim() !== '') {
      onChange(voiceResult);
    }
  }, [voiceResult, onChange]);

  // Show suggestion when smart prediction is available and field is focused
  useEffect(() => {
    if (smartPrediction?.suggestedValue && smartPrediction.probability > 0.7) {
      setShowSuggestion(true);
    }
  }, [smartPrediction]);

  const handleFocus = () => {
    onFocus?.();
    if (smartPrediction?.suggestedValue && smartPrediction.probability > 0.7) {
      setShowSuggestion(true);
    }
  };

  const handleBlur = () => {
    onBlur?.();
    // Delay hiding suggestion to allow clicking on it
    setTimeout(() => setShowSuggestion(false), 200);
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
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{smartPrediction.validationHint}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Voice input button with fixed microphone icon */}
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
              <svg className="w-4 h-4 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="19" y2="23"/>
                <line strokeLinecap="round" strokeLinejoin="round" x1="8" x2="16" y1="23" y2="23"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="19" y2="23"/>
                <line strokeLinecap="round" strokeLinejoin="round" x1="8" x2="16" y1="23" y2="23"/>
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

      {/* Voice feedback */}
      {isListening && (
        <div className="absolute z-10 mt-1 w-full bg-blue-50 border border-blue-200 rounded-md p-2">
          <div className="text-sm text-blue-700 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            Listening... Speak now
          </div>
        </div>
      )}
    </div>
  );
}