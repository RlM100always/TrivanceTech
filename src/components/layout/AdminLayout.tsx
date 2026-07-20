import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, CheckSquare, ShoppingCart, BarChart3, Settings, X, LogOut, Bell, FolderKanban, Receipt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DarkModeToggle from '../ui/DarkModeToggle';
import Logo from '../ui/Logo';
import AdminBottomNav from '../admin/AdminBottomNav';

const nav = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Clients', path: '/admin/clients', icon: Users },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { name: 'Finance', path: '/admin/finance', icon: Receipt },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string; type: string; message: string; read: number; created_at: string}>>([]);
  const [chatUnread, setChatUnread] = useState(0);

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const title = nav.find((n) => (n.exact ? location.pathname === n.path : location.pathname.startsWith(n.path)))?.name ?? 'Admin';

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
      }
    } catch { /* ignore */ }
  };

  const loadChatUnread = async () => {
    try {
      const res = await fetch('/api/conversations', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const total = (data.conversations ?? []).reduce((sum: number, c: { unread_count?: number }) => sum + (c.unread_count ?? 0), 0);
        setChatUnread(total);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    loadNotifications();
    loadChatUnread();
    const t = setInterval(() => { loadNotifications(); loadChatUnread(); }, 10000);
    return () => clearInterval(t);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: 1 } : n)));
    await fetch(`/api/notifications/${id}`, { method: 'PATCH', credentials: 'include' }).catch(() => {});
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-5 border-b border-gray-200 dark:border-gray-800">
        <Logo variant="dark" size="sm" />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                active
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800">
        AiTechWorlds Admin Console
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-40">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="lg:hidden fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0.12, duration: 0.4 }}
              className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
            >
              <button
                aria-label="Close menu"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <X size={20} />
              </button>
              {SidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 min-w-0">
            <span className="lg:hidden"><Logo variant="dark" size="sm" /></span>
            <h1 className="hidden lg:block text-lg font-semibold truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <DarkModeToggle />
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Notifications"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <Bell size={19} />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 font-semibold text-sm">Notifications</div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-400 px-4 py-6 text-center">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/40 ${n.read ? 'text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}
                          >
                            {n.message}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 pl-1">
              {user?.picture ? (
                <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 text-sm font-semibold">
                  {(user?.name ?? 'A').charAt(0)}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium">{user?.name?.split(' ')[0]}</span>
              <button onClick={handleSignOut} aria-label="Sign out" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Android-style bottom tab bar (mobile only) */}
      <AdminBottomNav onMore={() => setSidebarOpen(true)} moreActive={sidebarOpen} badge={unread > 0} chatUnread={chatUnread} />
    </div>
  );
};

export default AdminLayout;