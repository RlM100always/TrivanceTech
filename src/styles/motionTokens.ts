import { designTokens } from './designTokens';

export const motionTokens = {
  durations: {
    instant: 0,
    fastest: 50,
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 700,
    modal: 300,
    toast: 400,
    tooltip: 200,
    page: 400,
    stagger: 50,
  },
  easings: {
    linear: 'linear',
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    easeOutExpo: [0.19, 1, 0.22, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.55, 0.27, 1.55],
    bounce: [0.68, -0.55, 0.27, 1.55],
    spring: [0.175, 0.885, 0.32, 1.275],
    gentle: [0.25, 0.46, 0.45, 0.94],
    sharp: [0.4, 0, 0.6, 1],
  },
  stagger: {
    fast: 0.03,
    normal: 0.05,
    slow: 0.08,
    slower: 0.12,
    grid: 0.05,
    list: 0.04,
    stack: 0.06,
  },
  spring: {
    gentle: { type: 'spring', stiffness: 120, damping: 14 },
    default: { type: 'spring', stiffness: 260, damping: 20 },
    stiff: { type: 'spring', stiffness: 400, damping: 25 },
    bouncy: { type: 'spring', stiffness: 300, damping: 10 },
    wobbly: { type: 'spring', stiffness: 180, damping: 8 },
    slow: { type: 'spring', stiffness: 100, damping: 15 },
    fast: { type: 'spring', stiffness: 500, damping: 30 },
  },
} as const;

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: motionTokens.durations.page / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const fadeOut = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  exit: { opacity: 1 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeIn,
  },
};

export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const slideDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const slideLeft = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const slideRight = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const scaleOut = {
  initial: { opacity: 1, scale: 1 },
  animate: { opacity: 0, scale: 0.95 },
  exit: { opacity: 1, scale: 1 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeIn,
  },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: motionTokens.stagger.normal,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: motionTokens.stagger.fast,
      staggerDirection: -1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const staggerItemFast = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const staggerItemSlow = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
  transition: {
    duration: motionTokens.durations.slower / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const staggerItemLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const staggerItemRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const staggerItemScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOutBack,
  },
};

export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: motionTokens.durations.fast / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const hoverScaleDown = {
  scale: 0.98,
  transition: {
    duration: motionTokens.durations.fast / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const hoverLift = {
  y: -4,
  boxShadow: designTokens.shadows.lg,
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const hoverGlow = {
  boxShadow: designTokens.shadows.glow.DEFAULT,
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const tapScale = {
  scale: 0.96,
  transition: {
    duration: motionTokens.durations.fastest / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const tapScaleDown = {
  scale: 0.94,
  transition: {
    duration: motionTokens.durations.fastest / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const focusRing = {
  boxShadow: designTokens.shadows.focus,
  transition: {
    duration: motionTokens.durations.fast / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const magneticVariants = {
  initial: { x: 0, y: 0 },
  animate: { x: 0, y: 0 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
};

export const tiltVariants = {
  initial: { rotateX: 0, rotateY: 0 },
  animate: { rotateX: 0, rotateY: 0 },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
};

export const cardHover = {
  y: -8,
  rotateX: 2,
  rotateY: -2,
  boxShadow: designTokens.shadows.xl,
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const cardHoverSubtle = {
  y: -4,
  boxShadow: designTokens.shadows.lg,
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: {
    duration: motionTokens.durations.modal / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const modalBackdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: motionTokens.durations.modal / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const tooltipVariants = {
  initial: { opacity: 0, scale: 0.9, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 10 },
  transition: {
    duration: motionTokens.durations.tooltip / 1000,
    ease: motionTokens.easings.easeOutBack,
  },
};

export const toastVariants = {
  initial: { opacity: 0, x: 300, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 300, scale: 0.9 },
  transition: {
    duration: motionTokens.durations.toast / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const dropdownVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const accordionVariants = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: 0, opacity: 0 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeInOut,
  },
};

export const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const listVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: motionTokens.stagger.list,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: motionTokens.stagger.fast,
      staggerDirection: -1,
    },
  },
};

export const gridVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: motionTokens.stagger.grid,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: motionTokens.stagger.fast,
      staggerDirection: -1,
    },
  },
};

export const revealVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const revealVariantsFast = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOut,
  },
};

export const revealVariantsSlow = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: motionTokens.durations.slower / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const textRevealVariants = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '-100%' },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const textRevealVariantsStaggered = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const shimmerVariants = {
  initial: { backgroundPosition: '200% 0' },
  animate: {
    backgroundPosition: '-200% 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const rotateVariants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const orbitVariants = (radius: number, duration: number, delay: number = 0) => ({
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration,
      repeat: Infinity,
      ease: 'linear',
      delay,
    },
  },
});

export const scrollRevealVariants = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const scrollRevealVariantsLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const scrollRevealVariantsRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
};

export const scrollRevealVariantsScale = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: {
    duration: motionTokens.durations.slow / 1000,
    ease: motionTokens.easings.easeOutBack,
  },
};

export const createStaggerContainer = (stagger: number = motionTokens.stagger.normal, delayChildren: number = 0.1) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
  exit: {
    transition: {
      staggerChildren: motionTokens.stagger.fast,
      staggerDirection: -1,
    },
  },
});

export const createStaggerItem = (direction: 'up' | 'down' | 'left' | 'right' | 'scale' = 'up', duration: number = motionTokens.durations.slow) => {
  const base = {
    transition: {
      duration: duration / 1000,
      ease: motionTokens.easings.easeOutExpo,
    },
  };

  switch (direction) {
    case 'up':
      return { ...base, initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } };
    case 'down':
      return { ...base, initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 30 } };
    case 'left':
      return { ...base, initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } };
    case 'right':
      return { ...base, initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 30 } };
    case 'scale':
      return { ...base, initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } };
    default:
      return base;
  }
};

export type MotionTokens = typeof motionTokens;
export type MotionDurations = typeof motionTokens.durations;
export type MotionEasings = typeof motionTokens.easings;
export type MotionStagger = typeof motionTokens.stagger;
export type MotionSpring = typeof motionTokens.spring;