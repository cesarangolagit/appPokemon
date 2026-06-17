import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { hexWithAlpha } from '@/utils/pokemonHelpers';

interface ThemeToggleProps {
  testID?: string;
}

export function ThemeToggle({ testID = 'theme-toggle' }: ThemeToggleProps) {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: hexWithAlpha(colors.onPrimary, 0.2) }]}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      testID={testID}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={20}
        color={colors.onPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
