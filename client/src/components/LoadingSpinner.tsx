import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "minimal" | "pulse" | "dots";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8", 
  lg: "w-12 h-12",
  xl: "w-16 h-16"
};

const LoadingDots = ({ size = "md" }: { size: string }) => {
  const dotSize = size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4";
  
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${dotSize} bg-green-500 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  className = "",
  text 
}: LoadingSpinnerProps) {
  if (variant === "dots") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <LoadingDots size={size} />
        {text && (
          <motion.p 
            className="mt-3 text-sm text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-green-500 rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <motion.p 
            className="mt-3 text-sm text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} border-2 border-gray-200 border-t-green-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Default spinner with gradient and shadow
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-75"></div>
        <div className="absolute inset-1 bg-white rounded-full"></div>
        <div className="absolute inset-2 bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg"></div>
      </motion.div>
      {text && (
        <motion.p 
          className="mt-4 text-sm font-medium text-gray-700"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Full page loading component
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white z-[9999] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" text={text} />
        <motion.div
          className="mt-8 w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            animate={{
              x: [-256, 256],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Inline loading for components
export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner variant="dots" size="md" text={text} />
    </div>
  );
}

// Button loading state
export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <LoadingSpinner 
      variant="minimal" 
      size={size} 
      className="mr-2" 
    />
  );
}