import type { Variants, Transition } from 'framer-motion';

/**
 * Centralized motion language for AiTechWorlds.
 *
 * Every animation across the site should pull its easing / variants from here
 * so the feel stays consistent. Framer Motion's <MotionConfig reducedMotion="user">
 * (wired in main.tsx) already neutralizes motion for users who ask for less, so
 * we don't re-guard every variant.
 */

// Signature easing — a soft, confident "out" curve used almost everywhere.
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];
export const EASE_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

export const SPRING_SOFT: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 22,
  mass: 0.6,
};

export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 30,
  mass: 0.6,
};

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

const directionOffset = (
  direction: RevealDirection,
  distance: number
): { x: number; y: number } => {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

interface RevealOptions {
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  delay?: number;
}

/** Build a from/to reveal variant pair for a single element. */
export const reveal = (opts: RevealOptions = {}): Variants => {
  const {
    direction = 'up',
    distance = 24,
    duration = 0.6,
    delay = 0,
  } = opts;
  const offset = directionOffset(direction, distance);
  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: EASE_OUT, delay },
    },
  };
};

/** Parent container that staggers its children into view. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const fadeUp: Variants = reveal({ direction: 'up' });
export const fadeDown: Variants = reveal({ direction: 'down' });
export const fadeLeft: Variants = reveal({ direction: 'left' });
export const fadeRight: Variants = reveal({ direction: 'right' });

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_BACK },
  },
};

/** Page-level enter/exit used by the route transition wrapper. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
