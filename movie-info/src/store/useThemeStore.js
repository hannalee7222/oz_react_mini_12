import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      //화면 기본값 light
      mode: 'light',
      setMode: (nextMode) => {
        if (typeof nextMode === 'string') {
          set({ mode: nextMode });
          return;
        }

        const prev = get().mode;
        set({ mode: nextMode(prev) });
      },
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
