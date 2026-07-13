import { motion } from 'framer-motion';
import { pageTransition } from '../../../lib/motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps a route's content with an enter/exit transition. Used inside <Layout>
 * with <AnimatePresence mode="wait"> keyed by pathname so navigations cross
 * fade instead of snapping.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
