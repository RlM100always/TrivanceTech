import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  role: 'client' | 'admin';
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: (idToken: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signInWithGoogle = useCallback(async (idToken: string) => {
    let res: Response;
    try {
      res = await fetch('/api/auth/google', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });
    } catch {
      throw new Error(
        'Cannot reach /api/auth/google. Are you running plain `npm run dev`? The /api routes are Cloudflare Pages Functions — use `npm run pages:dev` instead.'
      );
    }

    const contentType = res.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await res.json().catch(() => null)
      : null;

    if (!res.ok) {
      const message = (data as { error?: string } | null)?.error;
      throw new Error(message ?? `Sign-in failed (${res.status})`);
    }
    if (!data) {
      throw new Error(
        'Sign-in failed: server returned non-JSON. You are likely hitting `npm run dev` (no /api routes) instead of `npm run pages:dev`.'
      );
    }

    const user = data as AuthUser;
    setUser(user);
    return user;
  }, []);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
