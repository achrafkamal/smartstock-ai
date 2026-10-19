import { create } from 'zustand';
import { authApi, User } from '../services/auth';
import { setAuthToken } from '../services/client';

export type { User };

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setAuth: (user: User, token: string) => {
    setAuthToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login({ email, password });
      setAuthToken(data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Échec de connexion',
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    setAuthToken(null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));

export default useAuthStore;
