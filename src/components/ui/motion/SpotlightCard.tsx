import React, { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Color of the radial glow that follows the cursor. */
  glowColor?: string;
}

/**
 * Card with a spotlight that follows the cursor: a soft radial glow tracks the
 * pointer across the surface, and a thin border lights up on hover. Pure CSS
 * variable updates (cheap, no re-render). Reduced-motion users still get the
 * hover border but no moving glow.
 */
const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(37, 99, 235, 0.15)',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    ref.current.style.setProperty('--glow', glowColor);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-white/10 transition-colors duration-300 ${className}`}
      style={{ '--mx': '50%', '--my': '50%' } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx) var(--my), var(--glow), transparent 70%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};

export default SpotlightCard;
