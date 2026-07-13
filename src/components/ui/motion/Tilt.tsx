import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Perspective in px. */
  perspective?: number;
  /** Spring stiffness for the return-to-rest motion. */
  scale?: number;
}

/**
 * 3D tilt-on-hover card. Tracks the pointer across the surface and applies a
 * perspective rotation plus a subtle lift. Reduced-motion users get a static card.
 */
const Tilt: React.FC<TiltProps> = ({
  children,
  className = '',
  max = 10,
  perspective = 900,
  scale = 1.02,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 200,
    damping: 20,
  });
  const s = useSpring(1, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const enter = () => !reduce && s.set(scale);
  const leave = () => {
    s.set(1);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        rotateX: reduce ? 0 : rx,
        rotateY: reduce ? 0 : ry,
        scale: reduce ? 1 : s,
        perspective,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Tilt;
