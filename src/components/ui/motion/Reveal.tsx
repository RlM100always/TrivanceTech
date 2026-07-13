import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { reveal, staggerContainer, type RevealDirection } from '../../../lib/motion';

type RevealProps = Omit<HTMLMotionProps<'div'>, 'variants'> & {
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  /** Re-run the animation every time it scrolls into view. */
  repeat?: boolean;
};

/**
 * Scroll-triggered reveal. Each instance uses whileInView so it animates the
 * first time it enters the viewport (or every time, with `repeat`).
 */
const Reveal: React.FC<RevealProps> = ({
  direction = 'up',
  distance = 24,
  duration = 0.6,
  delay = 0,
  amount = 0.2,
  repeat = false,
  children,
  ...rest
}) => {
  const variants = {
    hidden: reveal({ direction, distance, duration }).hidden,
    visible: reveal({ direction, distance, duration, delay }).visible,
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

/** Container that staggers child <StaggerItem> elements into view. */
export const StaggerContainer: React.FC<
  Omit<HTMLMotionProps<'div'>, 'variants'> & { stagger?: number; delay?: number; amount?: number }
> = ({ stagger = 0.08, delay = 0, amount = 0.15, children, ...rest }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount }}
    variants={staggerContainer(stagger, delay)}
    {...rest}
  >
    {children}
  </motion.div>
);

/** A single item inside a <StaggerContainer>. */
export const StaggerItem: React.FC<
  Omit<HTMLMotionProps<'div'>, 'variants'> & { direction?: RevealDirection; distance?: number }
> = ({ direction = 'up', distance = 24, children, ...rest }) => {
  const offset =
    direction === 'up'
      ? { y: distance }
      : direction === 'down'
      ? { y: -distance }
      : direction === 'left'
      ? { x: distance }
      : direction === 'right'
      ? { x: -distance }
      : {};
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
