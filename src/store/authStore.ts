import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserData } from "@/types/database";

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
