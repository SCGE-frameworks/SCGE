import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ACCESS_LEVEL, hasMinAccess } from '../constants/accessLevels';
import { clearAuth, getStoredUser, getToken } from '../services/auth/auth.storage';
import { fetchMeApi, loginApi, logoutApi } from '../services/auth/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchMeApi();
        setUser(currentUser);
      } catch {
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user && getToken()),
      login: async (email, password) => {
        const loggedUser = await loginApi(email, password);
        setUser(loggedUser);
        return loggedUser;
      },
      logout: async () => {
        await logoutApi();
        setUser(null);
      },
      hasAccess: (minLevel) => hasMinAccess(user, minLevel),
      isAdmin: hasMinAccess(user, ACCESS_LEVEL.ADMIN),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
