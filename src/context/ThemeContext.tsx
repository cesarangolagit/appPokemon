import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getJsonItem, setJsonItem } from '@/storage/asyncStorage';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import {
  getThemeColors,
  type ThemeColors,
  type ThemeMode,
} from '@/constants/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getJsonItem<ThemeMode>(STORAGE_KEYS.THEME)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') {
          setModeState(stored);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    void setJsonItem(STORAGE_KEYS.THEME, nextMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((current) => {
      const nextMode = current === 'light' ? 'dark' : 'light';
      void setJsonItem(STORAGE_KEYS.THEME, nextMode);
      return nextMode;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      colors: getThemeColors(mode),
      isDark: mode === 'dark',
      setMode,
      toggleTheme,
      isReady,
    }),
    [mode, setMode, toggleTheme, isReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}
