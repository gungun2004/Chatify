import { create } from "zustand";

export const useThemeStore = create((set) => ({
  // ✅ Default theme hamesha "mycustomtheme" rahega
  theme: localStorage.getItem("theme") || "mycustomtheme",

  // ✅ Jab bhi theme change ho, localStorage me bhi save ho
  setTheme: (t) => {
    localStorage.setItem("theme", t);
    set({ theme: t });
  },
}));
