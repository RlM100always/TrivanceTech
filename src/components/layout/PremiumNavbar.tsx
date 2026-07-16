import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, UserCircle, Info, Users, Newspaper, LucideIcon } from 'lucide-react';
import Logo from '../ui/Logo';
import DarkModeToggle from '../ui/DarkModeToggle';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Careers', path: '/careers', icon: Users },
  { name: 'Blog', path: '/blog', icon: Newspaper },
  { name: 'Contact', path: '/contact' },
];

const PremiumNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const portalPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open (native app feel)
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  // Items already in the mobile BottomNav tab bar — keep them out of the
  // hamburger drawer so the two surfaces don't duplicate (standard app pattern).
  const bottomNavPaths = ['/', '/services', '/projects', '/contact'];
  const mobileNavItems = navItems.filter((item) => !bottomNavPaths.includes(item.path));

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`mx-auto transition-all duration-500 ease-out ${
          isScrolled ? 'mt-3 max-w-6xl px-2 sm:px-0' : 'mt-0 max-w-none'
        }`}
      >
        <div
          className={`transition-all duration-500 ease-out backdrop-blur-xl ${
            isScrolled
              ? 'rounded-2xl bg-white/75 dark:bg-neutral-900/75 border border-neutral-200/70 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.15)]'
              : 'rounded-none bg-white/70 dark:bg-neutral-950/60 border-b border-neutral-200/60 dark:border-white/5'
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-14 px-4 sm:px-5' : 'h-16 sm:h-[72px] px-4 sm:px-6 lg:px-10'}`}>
            {/* Logo */}
            <Link to="/" className="flex-shrink-0" aria-label="AiTechWorlds home">
              <Logo variant="dark" size={isScrolled ? 'sm' : 'md'} className="transition-all duration-500" />
            </Link>

            {/* Desktop Navigation — sliding active pill */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center gap-0.5 rounded-full p-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`relative px-3.5 py-1.5 text-[13.5px] font-medium rounded-full transition-colors duration-200 ${
                        active
                          ? 'text-primary-700 dark:text-white'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="navbar-active-pill"
                          transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }}
                          className="absolute inset-0 rounded-full bg-primary-500/10 dark:bg-white/10 ring-1 ring-primary-500/20 dark:ring-white/10"
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-2.5">
              <DarkModeToggle />
              <Link
                to={user ? portalPath : '/login'}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[13.5px] font-medium text-neutral-600 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
              >
                {user?.picture ? (
                  <img src={user.picture} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <UserCircle size={15} strokeWidth={2.2} />
                )}
                {user ? user.name.split(' ')[0] : 'Sign in'}
              </Link>
              <Link
                to="/order"
                className="group flex items-center gap-1.5 pl-4 pr-3 py-2 text-[13.5px] font-semibold text-white bg-primary-600 rounded-full shadow-sm shadow-primary-500/25 hover:shadow-md hover:bg-primary-700 transition-all duration-200"
              >
                Get Started
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-1.5">
              <DarkModeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="p-2 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-900/5 dark:hover:bg-white/10 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation — Android app style slide-in drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0.12, duration: 0.4 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-neutral-950 shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100 dark:border-neutral-800">
                <Logo variant="dark" size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 -mr-2 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Nav list */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {mobileNavItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-medium transition-colors duration-200 ${
                        active
                          ? 'bg-primary-500/10 text-primary-700 dark:text-primary-300'
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {Icon && (
                        <Icon
                          size={20}
                          className={active ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'}
                        />
                      )}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer actions */}
              <div className="px-4 py-5 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                <Link
                  to={user ? portalPath : '/login'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-[15px] font-semibold border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200"
                >
                  {user?.picture ? (
                    <img src={user.picture} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserCircle size={18} />
                  )}
                  {user ? user.name.split(' ')[0] : 'Sign in'}
                </Link>
                <Link
                  to="/order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-xl text-[15px] font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors duration-200"
                >
                  Get Started
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PremiumNavbar;
