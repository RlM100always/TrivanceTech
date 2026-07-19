import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ActionButton — the one CTA style for the whole site, so "Start Your Project"
 * looks identical on every page. Renders a react-router <Link> when given `to`,
 * an <a> when given `href`, otherwise a <button>.
 *
 * Variants follow the Contact-vs-Order convention in CLAUDE.md: use `primary`
 * for the main conversion action and `ghost` for the secondary one.
 */
type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface ActionButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 hover:shadow-primary-600/35',
  secondary:
    'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100',
  ghost:
    'border border-neutral-300 bg-white/70 text-neutral-800 backdrop-blur hover:border-primary-400 hover:text-primary-700 dark:border-white/15 dark:bg-white/5 dark:text-neutral-100 dark:hover:border-primary-500/50 dark:hover:text-primary-300',
};

const SIZES: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950',
    disabled ? 'cursor-not-allowed opacity-60' : 'hover:-translate-y-0.5',
    VARIANTS[variant],
    SIZES[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};

export default ActionButton;
