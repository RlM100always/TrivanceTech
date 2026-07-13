import { durations, easings, stagger } from './tokens';

export const motionTokens = {
  durations: {
    instant: durations.instant,
    fast: durations.fast,
    normal: durations.normal,
    slow: durations.slow,
    slower: durations.slower,
    slowest: durations.slowest,
    page: durations.page,
    modal: durations.modal,
    tooltip: durations.tooltip,
    toast: durations.toast,
  },
  easings: {
    linear: easings.linear,
    easeIn: easings.easeIn,
    easeOut: easings.easeOut,
    easeInOut: easings.easeInOut,
    easeOutExpo: easings.easeOutExpo,
    easeInOutExpo: easings.easeInOutExpo,
    easeOutBack: easings.easeOutBack,
    easeInBack: easings.easeInBack,
    bounce: easings.bounce,
    spring: easings.spring,
  },
  stagger: {
    fast: stagger.fast,
    normal: stagger.normal,
    slow: stagger.slow,
    slower: stagger.slower,
  },
} as const;

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: motionTokens.durations.page / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
} as const;

export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOut,
  },
} as const;

export const slideVariants = {
  up: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },
  down: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  },
  left: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  right: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
} as const;

export const slideTransition = {
  duration: motionTokens.durations.slow / 1000,
  ease: motionTokens.easings.easeOutExpo,
} as const;

export const scaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeOutBack,
  },
} as const;

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: motionTokens.stagger.normal,
      delayChildren: motionTokens.durations.fast / 1000,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: motionTokens.stagger.fast,
      staggerDirection: -1,
    },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.slow / 1000,
      ease: motionTokens.easings.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeIn,
    },
  },
} as const;

export const staggerItemFast = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeIn,
    },
  },
} as const;

export const staggerItemScale = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.easeOutBack,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeIn,
    },
  },
} as const;

export const hoverVariants = {
  scale: {
    scale: 1.02,
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeOut,
    },
  },
  scaleUp: {
    scale: 1.05,
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.easeOutBack,
    },
  },
  lift: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.easeOut,
    },
  },
  glow: {
    boxShadow: '0 0 30px -5px rgb(14 165 233 / 0.5)',
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.easeOut,
    },
  },
  rotate: {
    rotate: 3,
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeOut,
    },
  },
} as const;

export const tapVariants = {
  scale: {
    scale: 0.98,
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeIn,
    },
  },
  scaleDown: {
    scale: 0.95,
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeIn,
    },
  },
} as const;

export const focusVariants = {
  ring: {
    boxShadow: '0 0 0 3px rgb(14 165 233 / 0.4)',
    transition: {
      duration: motionTokens.durations.fast / 1000,
      ease: motionTokens.easings.easeOut,
    },
  },
} as const;

export const modalVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: motionTokens.durations.modal / 1000 },
  },
  content: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: {
      duration: motionTokens.durations.modal / 1000,
      ease: motionTokens.easings.easeOutExpo,
    },
  },
} as const;

export const toastVariants = {
  initial: { opacity: 0, x: 300, y: 0 },
  animate: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 300, y: 0 },
  transition: {
    duration: motionTokens.durations.toast / 1000,
    ease: motionTokens.easings.easeOutExpo,
  },
} as const;

export const tooltipVariants = {
  initial: { opacity: 0, scale: 0.9, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 10 },
  transition: {
    duration: motionTokens.durations.tooltip / 1000,
    ease: motionTokens.easings.easeOutBack,
  },
} as const;

export const drawerVariants = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: {
    type: 'spring',
    damping: 30,
    stiffness: 300,
  },
} as const;

export const accordionVariants = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: 0, opacity: 0 },
  transition: {
    duration: motionTokens.durations.normal / 1000,
    ease: motionTokens.easings.easeInOut,
  },
} as const;

export const tabsVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: {
    duration: motionTokens.durations.fast / 1000,
    ease: motionTokens.easings.easeOut,
  },
} as const;

export const magneticVariants = {
  initial: { x: 0, y: 0 },
  animate: { x: 0, y: 0 },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  },
} as const;

export const scrollRevealVariants = {
  initial: { opacity: 0, y: 40 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.slow / 1000,
      ease: motionTokens.easings.easeOutExpo,
    },
  },
  viewport: { once: true, margin: '-100px' },
} as const;

export const scrollRevealVariantsFast = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.easeOutExpo,
    },
  },
  viewport: { once: true, margin: '-50px' },
} as const;

export const staggerChildren = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: motionTokens.stagger.normal,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionTokens.durations.slow / 1000,
        ease: motionTokens.easings.easeOutExpo,
      },
    },
  },
} as const;

export const magneticButton = {
  whileHover: {
    scale: 1.02,
    transition: { duration: motionTokens.durations.fast / 1000 },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: motionTokens.durations.fast / 1000 },
  },
} as const;

export const cardHover = {
  whileHover: {
    y: -8,
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.easeOutExpo,
    },
  },
} as const;

export const linkHover = {
  whileHover: {
    x: 4,
    transition: { duration: motionTokens.durations.fast / 1000, ease: motionTokens.easings.easeOut },
  },
  whileTap: {
    x: -2,
    transition: { duration: motionTokens.durations.fast / 1000, ease: motionTokens.easings.easeIn },
  },
} as const;

export const inputFocus = {
  focus: {
    boxShadow: '0 0 0 3px rgb(14 165 233 / 0.3)',
    borderColor: '#0ea5e9',
    transition: { duration: motionTokens.durations.fast / 1000 },
  },
} as const;

export const loadingVariants = {
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  spin: {
    animate: { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: 'linear' } },
  },
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  skeleton: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
    },
  },
} as const;

export type MotionTokens = typeof motionTokens;
export type PageVariants = typeof pageVariants;
export type FadeVariants = typeof fadeVariants;
export type SlideVariants = typeof slideVariants;
export type ScaleVariants = typeof scaleVariants;
export type StaggerContainer = typeof staggerContainer;
export type StaggerItem = typeof staggerItem;
export type HoverVariants = typeof hoverVariants;
export type TapVariants = typeof tapVariants;
export type FocusVariants = typeof focusVariants;
export type ModalVariants = typeof modalVariants;
export type ToastVariants = typeof toastVariants;
export type TooltipVariants = typeof tooltipVariants;
export type DrawerVariants = typeof drawerVariants;
export type AccordionVariants = typeof accordionVariants;
export type TabsVariants = typeof tabsVariants;
export type MagneticVariants = typeof magneticVariants;
export type ScrollRevealVariants = typeof scrollRevealVariants;
export type LoadingVariants = typeof loadingVariants;