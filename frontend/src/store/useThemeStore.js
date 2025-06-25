import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamify-theme") || "sunset",
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("streamify-theme", theme);
  },
}));
