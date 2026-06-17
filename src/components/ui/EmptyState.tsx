import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { hexWithAlpha } from '@/utils/pokemonHelpers';
import type { ThemeColors } from '@/constants/theme';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type EmptyStateVariant = 'default' | 'search' | 'favorites';

interface EmptyStateProps {
  title: string;
  description?: string;
  variant?: EmptyStateVariant;
  testID?: string;
}

const iconByVariant: Record<EmptyStateVariant, MaterialIconName> = {
  default: 'pokeball',
  search: 'magnify-close',
  favorites: 'heart-off-outline',
};

export function EmptyState({
  title,
  description,
  variant = 'default',
  testID = 'empty-state',
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const iconName = iconByVariant[variant];

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={iconName} size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      padding: 32,
      alignItems: 'center',
    },
    iconWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: hexWithAlpha(colors.primary, 0.12),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    description: {
      marginTop: 8,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 280,
    },
  });
}
