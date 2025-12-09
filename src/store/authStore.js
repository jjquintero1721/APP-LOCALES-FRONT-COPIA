import { create } from 'zustand';
import authService from '../services/auth/authService';

const useAuthStore = create((set) => ({
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  login: async (credentials) => {
    const data = await authService.login(credentials);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
