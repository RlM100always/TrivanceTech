import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/seo/SEO';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
      <SEO
        title="Client Sign In"
        description="Sign in to your AiTechWorlds client portal to chat with our team and manage your project files."
        path="/login"
      />
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-primary-600 dark:text-primary-400" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Client Portal</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8 text-sm leading-relaxed">
          Sign in with Google to chat with our team, share project files, and track your requests.
        </p>
        <GoogleSignInButton />
      </div>
    </div>
  );
};

export default Login;
