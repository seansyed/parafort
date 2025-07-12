import { useState, useEffect, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationType?: "slideUp" | "slideLeft" | "slideRight" | "fade" | "scale";
  delay?: number;
  id?: string;
}

export function AnimatedSection({ 
  children, 
  className = "", 
  animationType = "slideUp", 
  delay = 0,
  id 
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(id || 'animated-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [delay, id]);

  const getAnimationClass = () => {
    switch (animationType) {
      case "slideLeft":
        return isVisible 
          ? "translate-x-0 opacity-100" 
          : "-translate-x-12 opacity-0";
      case "slideRight":
        return isVisible 
          ? "translate-x-0 opacity-100" 
          : "translate-x-12 opacity-0";
      case "fade":
        return isVisible 
          ? "opacity-100" 
          : "opacity-0";
      case "scale":
        return isVisible 
          ? "scale-100 opacity-100" 
          : "scale-95 opacity-0";
      default: // slideUp
        return isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-12 opacity-0";
    }
  };

  return (
    <div
      id={id || 'animated-section'}
      className={`transform transition-all duration-700 ease-out ${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
}

export function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number; 
}) {
  return (
    <div
      className={`hover-lift group transition-all duration-300 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}