/**
 * Authentication Store
 * Zustand store for current session auth state
 * - Access token & user profile stored here (in-memory)
 * - Refresh token stored in SecureStore (persistent)
 */

import * as SecureStorage from '@/services/secure-storage';
import { User } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  accessToken: null,
  isAdmin: false,
  isAuthenticated: false,
  isInitialized: false,

  // Set user and mark as authenticated
  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: user !== null 
    });
  },

  // Set access token for API calls
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  // Set admin status
  setIsAdmin: (isAdmin) => {
    set({ isAdmin });
  },

  // Mark initialization complete
  setInitialized: (isInitialized) => {
    set({ isInitialized });
  },

  // Logout: clear SecureStore and reset state
  logout: async () => {
    try {
      await SecureStorage.clearAllData();
      set({
        user: null,
        accessToken: null,
        isAdmin: false,
        isAuthenticated: false,
      });
      console.log('🔓 Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
}));

