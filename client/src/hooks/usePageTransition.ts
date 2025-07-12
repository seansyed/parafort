import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function usePageTransition() {
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Start loading when location changes
    setIsLoading(true);
    
    // Scroll to top immediately when page changes
    window.scrollTo(0, 0);
    
    // Show loading for 300ms (just enough for smooth transition)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return { isLoading };
}