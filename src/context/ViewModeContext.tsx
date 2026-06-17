import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { PokemonViewMode } from '@/types/viewMode';

interface ViewModeContextValue {
  viewMode: PokemonViewMode;
  setViewMode: (mode: PokemonViewMode) => void;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<PokemonViewMode>('grid');

  const value = useMemo(
    () => ({
      viewMode,
      setViewMode,
      toggleViewMode: () => setViewMode((current) => (current === 'grid' ? 'list' : 'grid')),
    }),
    [viewMode]
  );

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode debe usarse dentro de ViewModeProvider');
  }
  return context;
}
