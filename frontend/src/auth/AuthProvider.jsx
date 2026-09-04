import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(authApi.token()));

  useEffect(() => {
    if (!authApi.token()) return;
    authApi.me()
      .then((payload) => setUser(payload.data.user))
      .catch(() => authApi.setToken(null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    signIn: async (credentials) => {
      const payload = await authApi.login(credentials);
      authApi.setToken(payload.data.accessToken);
      setUser(payload.data.user);
      return payload.data.user;
    },
    signOut: async () => {
      try { await authApi.logout(); } finally { authApi.setToken(null); setUser(null); }
    },
    updateUser: setUser,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// This hook is intentionally colocated with its provider so consumers share one auth contract.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
