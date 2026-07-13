import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, ShoppingCart, MoreHorizontal, LucideIcon } from 'lucide-react';

interface Tab {
  name: string;
  path?: string;
  icon: LucideIcon;
  exact?: boolean;
  action?: 'more';
}

const tabs: Tab[] = [
  { name: 'Home', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Clients', path: '/admin/clients', icon: Users },
  { name: 'Chat', path: '/admin/messages', icon: MessageSquare },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'More', icon: MoreHorizontal, action: 'more' },
];

// Android-app style fixed bottom tab bar for the admin console (mobile only).
// Mirrors the public BottomNav so the whole product feels like one native app.
const AdminBottomNav: React.FC<{ onMore: () => void; moreActive?: boolean; badge?: boolean; chatUnread?: number }> = ({ onMore, moreActive, badge, chatUnread = 0 }) => {
  const location = useLocation();

  const isActive = (t: Tab) => {
    if (t.action === 'more') return !!moreActive;
    if (!t.path) return false;
    return t.exact ? location.pathname === t.path : location.pathname.startsWith(t.path);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = isActive(t);
          const inner = (
            <>
              <span
                className={`relative flex items-center justify-center h-8 w-14 rounded-full transition-all duration-300 ${
                  active ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-transparent group-active:bg-gray-100 dark:group-active:bg-gray-800'
                }`}
              >
                <t.icon
                  size={20}
                  className={`transition-colors duration-300 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
                  strokeWidth={active ? 2.4 : 2}
                />
                {t.action === 'more' && badge && (
                  <span className="absolute top-0.5 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                )}
                {t.name === 'Chat' && chatUnread > 0 && (
                  <span className="absolute -top-0.5 right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                    {chatUnread > 9 ? '9+' : chatUnread}
                  </span>
                )}
              </span>
              <span className={`text-[11px] leading-none font-medium transition-colors duration-300 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {t.name}
              </span>
            </>
          );

          const cls = 'relative flex flex-col items-center justify-center py-2.5 gap-0.5 group';

          return t.action === 'more' ? (
            <button key={t.name} onClick={onMore} className={cls} aria-label="More">
              {inner}
            </button>
          ) : (
            <Link key={t.name} to={t.path!} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminBottomNav;
