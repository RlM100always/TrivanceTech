import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/seo/SEO';
import Logo from '../components/ui/Logo';
import { reveal } from '../lib/motion';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-950 via-primary-950 to-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
      <SEO title="Admin Sign In" description="Admin sign in to AiTechWorlds" path="/admin/login" />

      {/* Ambient backdrop — same register as ProductFactoryHero, so the admin
          surface still reads as AiTechWorlds, just clearly gated/secure. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-1/4 h-[45vh] w-[45vh] rounded-full bg-primary-500/15 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-[45vh] w-[45vh] rounded-full bg-primary-500/15 blur-3xl" />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={reveal({ direction: 'up', distance: 16 })}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo variant="light" size="lg" className="mb-6" />
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur-md">
            <Lock size={12} />
            Restricted Access
          </span>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Admin Console</h1>
          <p className="mt-2 text-neutral-400">Sign in with your authorized Google account to continue</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex justify-center rounded-xl border border-white/10 bg-white/[0.03] py-6">
              <GoogleSignInButton />
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-2 text-neutral-500">Not an admin?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="flex w-full justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10"
              >
                Go to Client Sign In
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-neutral-500">
          <ShieldCheck size={14} className="text-primary-400" />
          Access is limited to accounts on the admin allow-list — sign-in attempts are logged.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;