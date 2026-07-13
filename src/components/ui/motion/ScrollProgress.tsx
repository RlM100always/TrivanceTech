import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient progress bar fixed to the top of the viewport, tracking page
 * scroll. Uses useScroll + a soft spring so it glides rather than jumps.
 */
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500"
      aria-hidden
    />
  );
};

export default ScrollProgress;
