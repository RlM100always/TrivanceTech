import { useEffect, useRef, useState } from 'react';
import { renderGoogleSignInButton } from '../../lib/googleIdentity';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSignedIn?: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSignedIn }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    renderGoogleSignInButton(containerRef.current, async (idToken) => {
      try {
        setError(null);
        await signInWithGoogle(idToken);
        onSignedIn?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
      }
    })
      .then(() => setLoaded(true))
      .catch(() => setError('Could not load Google Sign-In. Please refresh the page.'));
  }, [signInWithGoogle, onSignedIn]);

  return (
    <div className="flex flex-col items-center gap-3">
      {!loaded && !error && (
        <div className="min-h-[44px] flex items-center justify-center">
          <Loader2 className="animate-spin text-neutral-400" size={20} />
        </div>
      )}
      <div ref={containerRef} className={loaded ? '' : 'hidden'} />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default GoogleSignInButton;
