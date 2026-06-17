import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeColors } from '@/constants/theme';

interface LoaderProps {
  testID?: string;
}

export function Loader({ testID = 'loader' }: LoaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function createStyles(_colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
