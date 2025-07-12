interface MicrophoneIconProps {
  isListening: boolean;
  className?: string;
}

export default function MicrophoneIcon({ isListening, className = "" }: MicrophoneIconProps) {
  return (
    <svg 
      className={`w-4 h-4 ${isListening ? 'text-blue-600 animate-pulse' : 'text-gray-500'} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
      />
    </svg>
  );
}