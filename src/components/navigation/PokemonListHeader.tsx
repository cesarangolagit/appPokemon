import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ViewModeToggle } from '@/components/ui/ViewModeToggle';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';
import { useViewMode } from '@/context/ViewModeContext';
import type { ThemeColors } from '@/constants/theme';

export function PokemonListHeader() {
  const insets = useSafeAreaInsets();
  const { query, setQuery } = useSearch();
  const { viewMode, setViewMode } = useViewMode();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top + 10,
          paddingLeft: Math.max(insets.left, 16),
          paddingRight: Math.max(insets.right, 16),
        },
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>Pokédex</Text>
        <ThemeToggle />
      </View>
      <View style={styles.toolbar}>
        <HeaderSearch value={query} onChangeText={setQuery} />
        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: colors.primary,
      paddingBottom: 14,
      shadowColor: colors.shadow,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.onPrimary,
      letterSpacing: 0.5,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  });
}
