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
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <ScrollToTop />
      <ScrollProgress />
      <PremiumNavbar />
      <main className="flex-grow pt-16 sm:pt-20 pb-16 lg:pb-0">
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