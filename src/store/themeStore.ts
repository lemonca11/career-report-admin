import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'light',
  toggleTheme: () =>
    set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
  setTheme: (mode: ThemeMode) => set({ themeMode: mode }),
  setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
}));
