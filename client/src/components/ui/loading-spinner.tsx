const favIconPath = "/parafort-logo-attached.svg?v=" + Date.now();

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const logoSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8", 
    xl: "w-12 h-12"
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Spinning border */}
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-[#27884b]`}></div>
      
      {/* ParaFort logo in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src={favIconPath} 
          alt="ParaFort" 
          className={`${logoSizeClasses[size]} object-contain`}
        />
      </div>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <LoadingSpinner size="xl" />
      <p className="mt-6 text-lg text-gray-600 font-medium">{message}</p>
    </div>
  );
}