export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  dark: {
    bg: '#0a0a0a',
    bgSecondary: '#111111',
    bgTertiary: '#1a1a1a',
    card: '#111111',
    cardHover: '#1a1a1a',
    border: '#262626',
    borderHover: '#404040',
    text: '#fafafa',
    textSecondary: '#a3a3a3',
    textMuted: '#737373',
  },
  light: {
    bg: '#ffffff',
    bgSecondary: '#fafafa',
    bgTertiary: '#f5f5f5',
    card: '#ffffff',
    cardHover: '#fafafa',
    border: '#e5e5e5',
    borderHover: '#d4d4d4',
    text: '#0a0a0a',
    textSecondary: '#525252',
    textMuted: '#737373',
  },
  success: {
    light: '#22c55e',
    main: '#16a34a',
    dark: '#15803d',
  },
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
    secondary: 'linear-gradient(135deg, #f97316 0%, #0ea5e9 100%)',
    dark: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    mesh: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 50%, #f97316 100%)',
  },
  semantic: {
    background: 'var(--color-bg)',
    backgroundSecondary: 'var(--color-bg-secondary)',
    backgroundTertiary: 'var(--color-bg-tertiary)',
    surface: 'var(--color-surface)',
    surfaceHover: 'var(--color-surface-hover)',
    border: 'var(--color-border)',
    borderHover: 'var(--color-border-hover)',
    text: 'var(--color-text)',
    textSecondary: 'var(--color-text-secondary)',
    textMuted: 'var(--color-text-muted)',
    primary: 'var(--color-primary)',
    primaryHover: 'var(--color-primary-hover)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    focus: 'var(--color-focus)',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],
    '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
    '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
    '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
    '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 20px -5px rgb(14 165 233 / 0.5)',
  glowLg: '0 0 40px -10px rgb(14 165 233 / 0.4)',
  glowXl: '0 0 60px -15px rgb(14 165 233 / 0.3)',
  innerGlow: 'inset 0 0 20px -5px rgb(14 165 233 / 0.3)',
  dark: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.4)',
    glow: '0 0 20px -5px rgb(14 165 233 / 0.6)',
    glowLg: '0 0 40px -10px rgb(14 165 233 / 0.5)',
    glowXl: '0 0 60px -15px rgb(14 165 233 / 0.4)',
  },
} as const;

export const borderRadius = {
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
  button: '0.5rem',
  card: '1rem',
  input: '0.5rem',
  badge: '9999px',
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  max: 2147483647,
} as const;

export const transitions = {
  fast: '150ms ease-out',
  normal: '250ms ease-out',
  slow: '350ms ease-out',
  slower: '500ms ease-out',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  expo: '600ms cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
} as const;

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const;

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

export const durations = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 700,
  page: 300,
  modal: 200,
  tooltip: 100,
  toast: 300,
} as const;

export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: 'spring',
} as const;

export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  slower: 0.2,
} as const;

export const blur = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const;

export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const;

export const designTokens = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  zIndex,
  transitions,
  breakpoints,
  container,
  durations,
  easings,
  stagger,
  blur,
  opacity,
} as const;

export type DesignTokens = typeof designTokens;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Shadows = typeof shadows;
export type BorderRadius = typeof borderRadius;
export type ZIndex = typeof zIndex;
export type Transitions = typeof transitions;
export type Breakpoints = typeof breakpoints;
export type Container = typeof container;
export type Durations = typeof durations;
export type Easings = typeof easings;
export type Stagger = typeof stagger;
export type Blur = typeof blur;
export type Opacity = typeof opacity;