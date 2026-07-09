import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, UserCircle } from 'lucide-react';
import Logo from '../ui/Logo';
import DarkModeToggle from '../ui/DarkModeToggle';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Careers', path: '/careers' },
  { name: 'Blog', path: '/blog' },
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

  const isActive = (path: string) => location.pathname === path;

  // Home/Services/Projects/Contact already live in the mobile BottomNav tab bar —
  // keep the hamburger drawer to the remaining items so the two nav surfaces don't duplicate.
  const bottomNavPaths = ['/', '/services', '/projects', '/contact'];
  const mobileNavItems = navItems.filter((item) => !bottomNavPaths.includes(item.path));

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`mx-auto transition-all duration-500 ease-out ${
          isScrolled
            ? 'mt-3 max-w-6xl px-2 sm:px-0'
            : 'mt-0 max-w-none'
        }`}
      >
        <div
          className={`transition-all duration-500 ease-out backdrop-blur-xl ${
            isScrolled
              ? 'rounded-2xl bg-white/75 dark:bg-gray-900/75 border border-gray-200/70 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.15)]'
              : 'rounded-none bg-white/70 dark:bg-gray-950/60 border-b border-gray-200/60 dark:border-white/5'
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
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[13.5px] font-medium text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
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
                className="group flex items-center gap-1.5 pl-4 pr-3 py-2 text-[13.5px] font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full shadow-sm hover:shadow-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200"
              >
                Get Started
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 dark:bg-gray-900/10 transition-transform duration-200 group-hover:translate-x-0.5">
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
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-900/5 dark:hover:bg-white/10 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden border-t border-gray-200/60 dark:border-white/5 overflow-hidden"
            >
              <div className="px-3 pt-2 pb-4 space-y-0.5">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-700 dark:text-white bg-primary-500/10 dark:bg-white/10'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-900/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to={user ? portalPath : '/login'}
                  className="flex items-center gap-2 px-4 py-2.5 text-[15px] font-medium rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors duration-200"
                >
                  {user?.picture ? (
                    <img src={user.picture} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserCircle size={17} />
                  )}
                  {user ? user.name.split(' ')[0] : 'Sign in'}
                </Link>
                <Link
                  to="/order"
                  className="flex items-center justify-center gap-1.5 w-full mt-2.5 px-4 py-3 text-[15px] font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl shadow-sm"
                >
                  Get Started
                  <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
};

export default PremiumNavbar;
