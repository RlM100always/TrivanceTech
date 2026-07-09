import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, FolderKanban, Phone } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Services', path: '/services', icon: Briefcase },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Contact', path: '/contact', icon: Phone },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className="relative flex flex-col items-center justify-center py-2.5 gap-0.5 group"
            >
              <span
                className={`flex items-center justify-center h-8 w-14 rounded-full transition-all duration-300 ${
                  active
                    ? 'bg-primary-100 dark:bg-primary-900/40'
                    : 'bg-transparent group-active:bg-gray-100 dark:group-active:bg-gray-800'
                }`}
              >
                <item.icon
                  size={20}
                  className={`transition-colors duration-300 ${
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  strokeWidth={active ? 2.4 : 2}
                />
              </span>
              <span
                className={`text-[11px] leading-none font-medium transition-colors duration-300 ${
                  active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
