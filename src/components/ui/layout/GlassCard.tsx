import React from 'react';

/**
 * GlassCard — the standard surface for content sitting over the atmosphere.
 *
 * Translucent + blurred so the field reads faintly through it, with the same
 * radius, hairline border and lift-on-hover as the home page pillar cards.
 * Use `as="article"`/`as="li"` to keep the surrounding markup semantic.
 */
interface GlassCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Adds the hover lift + shadow. Default true. */
  interactive?: boolean;
  /** Removes internal padding when the card manages its own (e.g. media on top). */
  flush?: boolean;
  as?: 'div' | 'article' | 'li' | 'section';
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = true,
  flush = false,
  as: Tag = 'div',
  className = '',
  ...rest
}) => (
  <Tag
    className={[
      'relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/80 shadow-sm backdrop-blur-xl',
      'dark:border-white/10 dark:bg-white/[0.04]',
      flush ? '' : 'p-6',
      interactive
        ? 'transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:hover:border-primary-500/40'
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Tag>
);

export default GlassCard;
