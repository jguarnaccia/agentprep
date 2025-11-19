import { Variants } from 'framer-motion';

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
};

// Fade in from top
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  },
};

// Scale up
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Card flip animation
export const flipCard = {
  initial: { rotateY: 0 },
  flipped: { rotateY: 180 },
  transition: { duration: 0.6 },
};

// Hover lift effect
export const hoverLift = {
  rest: { y: 0 },
  hover: { 
    y: -4,
    transition: { duration: 0.2 }
  },
};

// Slide in from bottom (for modals)
export const slideUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: { 
    y: '100%', 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

// Page transition
export const pageTransition: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  },
};

// Pulse animation (for notifications)
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    repeatDelay: 1,
  },
};

// Bounce animation
export const bounce = {
  y: [0, -10, 0],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    repeatDelay: 0.5,
  },
};

// Rotate animation
export const rotate = {
  rotate: [0, 360],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

// Fade in simple
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
};

// Blur in
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { duration: 0.5 }
  },
};
