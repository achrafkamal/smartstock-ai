import { create } from 'zustand';
import { api, setAuthToken } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const data = await api.login(email, password);
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
