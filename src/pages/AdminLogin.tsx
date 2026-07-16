import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/seo/SEO';

const AdminLogin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  useEffect(() => {
    if (loading || !user) return;
    if (user.role === 'admin') {
      navigate(from, { replace: true });
    } else {
      setError('Admin access required. Please sign in with an admin account.');
    }
  }, [user, loading, navigate, from]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Admin Sign In" description="Admin sign in to AiTechWorlds" path="/admin/login" />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Admin Sign In</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Sign in with your admin Google account to access the dashboard
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 py-8 px-6 shadow-xl rounded-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <GoogleSignInButton />
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  Or continue as client
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Client Sign In
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Only authorized admin accounts can access the admin panel.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;