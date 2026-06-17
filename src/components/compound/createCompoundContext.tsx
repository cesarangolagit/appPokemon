import { createContext, useContext, type ReactNode } from 'react';

interface CompoundContextValue {
  testID?: string;
}

export function createCompoundContext<T extends CompoundContextValue>() {
  const Context = createContext<T | null>(null);

  function Provider({ value, children }: { value: T; children: ReactNode }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useCompoundContext(componentName: string) {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`${componentName} debe usarse dentro de su contenedor compound.`);
    }
    return context;
  }

  return { Provider, useCompoundContext };
}
