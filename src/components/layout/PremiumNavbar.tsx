import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, UserCircle } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
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
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'pt-2 sm:pt-3 px-2 sm:px-4' : 'pt-0 px-0'}`}>
      <nav
        className={`mx-auto max-w-7xl transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200/60 dark:border-gray-700/60 rounded-2xl'
            : 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm rounded-none'
        }`}
      >
        {/* Top accent line — brand gradient hairline, only visible when floating */}
        {isScrolled && (
          <div className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x" />
        )}

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <Logo
                variant="dark"
                size="md"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                      active
                        ? 'text-white shadow-lg shadow-primary-500/30'
                        : isScrolled
                          ? 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                          : 'text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-300'
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-500" />
                    )}
                    {!active && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-gray-900/0 dark:bg-white/0 hover:bg-gray-900/5 dark:hover:bg-white/10 transition-colors duration-300" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              <DarkModeToggle />
              <Link
                to={user ? portalPath : '/login'}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
              >
                {user?.picture ? (
                  <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <UserCircle size={18} />
                )}
                {user ? user.name.split(' ')[0] : 'Client Login'}
              </Link>
              <Link
                to="/order"
                className="group relative inline-flex items-center gap-1.5 px-5 py-2.5 overflow-hidden text-sm font-semibold text-white rounded-full shadow-lg shadow-accent-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/40 hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-[length:200%_100%] group-hover:animate-gradient-x" />
                <Sparkles size={14} className="relative" />
                <span className="relative">Get Started</span>
                <ArrowRight size={14} className="relative transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              <DarkModeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isScrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200/60 dark:border-gray-700/60 animate-slide-in-from-top duration-300">
              <div className="px-1 pt-3 pb-4 space-y-1">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-2.5 text-base font-semibold rounded-xl transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-md'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to={user ? portalPath : '/login'}
                  className="flex items-center gap-2 px-4 py-2.5 text-base font-semibold rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {user?.picture ? (
                    <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserCircle size={18} />
                  )}
                  {user ? user.name.split(' ')[0] : 'Client Login'}
                </Link>
                <Link
                  to="/order"
                  className="flex items-center justify-center gap-1.5 w-full mt-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl text-center shadow-lg"
                >
                  <Sparkles size={15} />
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default PremiumNavbar;
