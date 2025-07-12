// Animation utilities for ParaFort platform
// Implements micro-interactions, scroll-triggered animations, and hover effects

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const buttonHover = {
  whileHover: { 
    scale: 1.05,
    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
  },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const cardHover = {
  whileHover: { 
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
  },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const slideInFromBottom = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

export const slideInFromTop = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const iconBounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const counterAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Form field animations
export const formFieldFocus = {
  whileFocus: {
    scale: 1.02,
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
  },
  transition: { duration: 0.2 }
};

// Navigation animations
export const dropdownReveal = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" }
};

// Mobile menu animations
export const mobileMenuSlide = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Data visualization animations
export const chartAnimation = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 2, ease: "easeInOut" }
};

// Loading animations
export const spinAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Scroll reveal animations with intersection observer
export const useScrollReveal = (threshold = 0.1) => {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: threshold },
    transition: { duration: 0.6, ease: "easeOut" }
  };
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Reduced motion preferences
export const reduceMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

// Animation variants for accessibility
export const getAnimationVariant = (prefersReducedMotion: boolean, fullAnimation: any, reducedAnimation: any = reduceMotion) => {
  return prefersReducedMotion ? reducedAnimation : fullAnimation;
};