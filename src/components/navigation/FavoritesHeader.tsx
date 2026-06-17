import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ViewModeToggle } from '@/components/ui/ViewModeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useViewMode } from '@/context/ViewModeContext';
import type { ThemeColors } from '@/constants/theme';

export function FavoritesHeader() {
  const insets = useSafeAreaInsets();
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
      <View style={styles.row}>
        <Text style={styles.title}>Favoritos</Text>
        <View style={styles.actions}>
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
          <ThemeToggle />
        </View>
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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.onPrimary,
      letterSpacing: 0.5,
    },
  });
}
