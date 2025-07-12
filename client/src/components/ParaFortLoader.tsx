import React from 'react';
// Using public asset - Vite will handle this correctly
const parafortLogo = '/parafort-logo-attached.svg?v=' + Date.now();

interface ParaFortLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ParaFortLoader: React.FC<ParaFortLoaderProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 animate-spin">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="70 30"
            className="opacity-75"
          />
        </svg>
      </div>
      
      {/* ParaFort Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-full p-1 shadow-sm">
          <img
            src={parafortLogo}
            alt="ParaFort"
            className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-10 h-10' : 'w-14 h-14'} rounded-full object-contain`}
          />
        </div>
      </div>
    </div>
  );
};

// Full page loader component
export const ParaFortPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="text-center">
        <ParaFortLoader size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">Loading ParaFort...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your business formation tools</p>
      </div>
    </div>
  );
};

// Inline loader component
export const ParaFortInlineLoader: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  text = "Loading...", 
  size = 'md' 
}) => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <ParaFortLoader size={size} className="mx-auto mb-3" />
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

// Button loader component
export const ParaFortButtonLoader: React.FC = () => {
  return (
    <ParaFortLoader size="sm" className="mr-2" />
  );
};

// Default export for the main loader component
export default ParaFortLoader;