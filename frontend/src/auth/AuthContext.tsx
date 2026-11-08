import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { CurrentUser, LoginResponse } from '../services/authService';

interface AuthState {
  session: LoginResponse | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<CurrentUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Token giữ trong bộ nhớ; refresh cookie HttpOnly khôi phục phiên sau F5.
  useEffect(() => {
    let active = true;
    authService.refresh()
      .then((result) => { if (active) setSession(result); })
      .catch(() => { if (active) setSession(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!session) return;
    const delay = Math.max(30, session.expiresIn - 60) * 1000;
    const timer = window.setTimeout(() => {
      authService.refresh().then(setSession).catch(() => setSession(null));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [session]);

  const login = async (username: string, password: string) => {
    const result = await authService.login(username, password);
    setSession(result);
    return result.user;
  };

  const logout = async () => {
    try { await authService.logout(); }
    finally { setSession(null); }
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return { ...context, user: context.session?.user ?? null, accessToken: context.session?.accessToken ?? null };
}
