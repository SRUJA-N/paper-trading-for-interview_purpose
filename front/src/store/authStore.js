// front/src/store/authStore.js
import { create } from "zustand";
import { login, logout } from "@/api/auth";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  loginUser: async (email, password) => {
    try {
      const data = await login(email, password);
      set({ user: data.user, isAuthenticated: true });
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  },

  logoutUser: async () => {
    try {
      await logout();
      set({ user: null, isAuthenticated: false });
    } catch (err) {
      console.error("Logout failed", err);
    }
  },
}));

export default useAuthStore;
