import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** How far the element travels toward the cursor (px). */
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * Wraps content in a magnetic hover effect: the element eases toward the
 * pointer while hovered and springs back on leave. Disabled for reduced-motion.
 */
const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.35,
  as = 'div',
  href,
  onClick,
  ariaLabel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion[as] as typeof motion.div;

  const tagProps: Record<string, unknown> = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onClick,
    style: { x: sx, y: sy },
    className,
  };
  if (as === 'a' && href) tagProps.href = href;
  if (ariaLabel) tagProps['aria-label'] = ariaLabel;

  return (
    <MotionTag {...tagProps}>
      {children}
    </MotionTag>
  );
};

export default MagneticButton;
