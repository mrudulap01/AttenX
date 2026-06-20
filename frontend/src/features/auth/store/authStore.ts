import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  role: string | null;
  email: string | null;
  firstName: string | null;
  setAuth: (token: string, role: string, email: string, firstName: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: null,
  email: null,
  firstName: null,
  setAuth: (accessToken, role, email, firstName) => set({ accessToken, role, email, firstName }),
  clearAuth: () => set({ accessToken: null, role: null, email: null, firstName: null }),
}));
