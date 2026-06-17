import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PokemonSplashScreen } from '@/components/splash/PokemonSplashScreen';
import { ThemedStatusBar } from '@/components/ui/ThemedStatusBar';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SearchProvider } from '@/context/SearchContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ViewModeProvider } from '@/context/ViewModeContext';
import { RootNavigator } from '@/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const SPLASH_MIN_MS = 1800;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      void SplashScreen.hideAsync().finally(() => setShowSplash(false));
    }, SPLASH_MIN_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SearchProvider>
          <ViewModeProvider>
            <FavoritesProvider>
              <RootNavigator />
              <ThemedStatusBar />
              {showSplash ? <PokemonSplashScreen /> : null}
            </FavoritesProvider>
          </ViewModeProvider>
        </SearchProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
