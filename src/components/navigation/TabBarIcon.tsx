import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { hexWithAlpha } from '@/utils/pokemonHelpers';
import type { ThemeColors } from '@/constants/theme';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabBarIconProps {
  focused: boolean;
  icon: MaterialIconName;
  activeIcon?: MaterialIconName;
}

export function TabBarIcon({ focused, icon, activeIcon }: TabBarIconProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.wrap, focused && styles.wrapActive]}>
      <MaterialCommunityIcons
        name={focused ? (activeIcon ?? icon) : icon}
        size={focused ? 27 : 24}
        color={focused ? colors.primary : colors.textSecondary}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      width: 44,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
    },
    wrapActive: {
      backgroundColor: hexWithAlpha(colors.primary, 0.14),
    },
  });
}
