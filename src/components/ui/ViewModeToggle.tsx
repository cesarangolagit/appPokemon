import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { hexWithAlpha } from '@/utils/pokemonHelpers';
import type { ThemeColors } from '@/constants/theme';
import type { PokemonViewMode } from '@/types/viewMode';

interface ViewModeToggleProps {
  value: PokemonViewMode;
  onChange: (mode: PokemonViewMode) => void;
  testID?: string;
}

export function ViewModeToggle({
  value,
  onChange,
  testID = 'view-mode-toggle',
}: ViewModeToggleProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container} testID={testID}>
      <Pressable
        style={[styles.button, value === 'grid' && styles.buttonActive]}
        onPress={() => onChange('grid')}
        accessibilityRole="button"
        accessibilityLabel="Vista en cuadrícula"
        testID={`${testID}-grid`}
      >
        <Ionicons
          name="grid"
          size={18}
          color={value === 'grid' ? colors.primary : colors.toggleInactive}
        />
      </Pressable>
      <Pressable
        style={[styles.button, value === 'list' && styles.buttonActive]}
        onPress={() => onChange('list')}
        accessibilityRole="button"
        accessibilityLabel="Vista en listado"
        testID={`${testID}-list`}
      >
        <Ionicons
          name="list"
          size={20}
          color={value === 'list' ? colors.primary : colors.toggleInactive}
        />
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 12,
      padding: 3,
      gap: 4,
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: hexWithAlpha(colors.onPrimary, 0.2),
    },
    buttonActive: {
      backgroundColor: colors.searchInput,
    },
  });
}
