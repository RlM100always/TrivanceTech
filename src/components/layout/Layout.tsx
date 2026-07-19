import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PremiumNavbar from './PremiumNavbar';
import PremiumFooter from '../sections/PremiumFooter';
import BottomNav from './BottomNav';
import WhatsAppFloatingButton from '../ui/WhatsAppFloatingButton';
import ScrollProgress from '../ui/motion/ScrollProgress';
import ScrollToTop from '../ui/ScrollToTop';
import PageTransition from '../ui/motion/PageTransition';

const Layout = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    // The bottom padding clears the mobile BottomNav (removed at lg, where the
    // tab bar is hidden). It lives on the wrapper, not <main>, so the footer
    // clears the bar too.
    <div
      className="flex flex-col min-h-[100dvh] bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 lg:!pb-0"
      style={{ paddingBottom: 'calc(var(--bottom-nav-h) + env(safe-area-inset-bottom))' }}
    >
      <ScrollToTop />
      <ScrollProgress />
      <PremiumNavbar />
      <main className="flex-grow pt-16 sm:pt-20">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>{outlet}</PageTransition>
        </AnimatePresence>
      </main>
      <PremiumFooter />
      <BottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default Layout;