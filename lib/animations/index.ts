export * from './variants';

// Helper function to create stagger effect
export const createStagger = (staggerChildren: number = 0.1, delayChildren: number = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Helper function for custom page transition
export const createPageTransition = (duration: number = 0.3) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: duration * 0.7 }
  },
});
