import React from 'react';
import { Moon, Shield, LogOut, Mail, User as UserIcon, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, PageHeader, Badge } from '../../components/admin/ui';
import DarkModeToggle from '../../components/ui/DarkModeToggle';

const AdminSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="Your admin account and console preferences." />

      {/* Account */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon size={18} className="text-primary-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Account</h2>
        </div>
        <div className="flex items-center gap-4">
          {user?.picture ? (
            <img src={user.picture} alt="" className="w-14 h-14 rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 text-xl font-semibold">
              {(user?.name ?? 'A').charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white">{user?.name ?? 'Admin'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Mail size={13} /> {user?.email}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge tone="purple">{user?.role ?? 'admin'}</Badge>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 flex items-start gap-1.5">
          <Shield size={13} className="mt-0.5 flex-shrink-0" />
          Admin access is granted by adding your Google email to the <code className="px-1 rounded bg-gray-100 dark:bg-gray-700">ADMIN_EMAILS</code> Cloudflare secret. It can't be changed from this panel.
        </p>
      </Card>

      {/* Appearance */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Moon size={18} className="text-primary-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Theme</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Toggle light / dark mode for the console.</p>
          </div>
          <DarkModeToggle />
        </div>
      </Card>

      {/* System */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server size={18} className="text-primary-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">System</h2>
        </div>
        <dl className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
          {[
            ['Platform', 'Cloudflare Pages + D1'],
            ['Auth', 'Google Identity + signed HttpOnly session'],
            ['Chat', 'Polling (3.5s), no WebSockets'],
            ['File storage', 'Google Drive (drive.file scope)'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5">
              <dt className="text-gray-500 dark:text-gray-400">{k}</dt>
              <dd className="text-gray-800 dark:text-gray-200 text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Danger / session */}
      <Card className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Sign out</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">End your admin session on this device.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
