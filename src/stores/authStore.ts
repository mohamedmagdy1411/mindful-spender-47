import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthRequired: boolean;
  setAuthRequired: (required: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthRequired: false,
      setAuthRequired: (required) => set({ isAuthRequired: required }),
    }),
    {
      name: 'auth-storage',
    }
  )
);