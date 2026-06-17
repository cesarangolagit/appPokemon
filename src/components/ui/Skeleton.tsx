import { useEffect, useMemo, useRef } from 'react';
import { Animated, Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeColors } from '@/constants/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  testID?: string;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
  testID,
}: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      testID={testID}
      style={[
        { backgroundColor: colors.skeleton },
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function PokemonCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createCardSkeletonStyles(colors), [colors]);

  if (variant === 'list') {
    return (
      <View style={styles.listCard} testID="pokemon-card-skeleton">
        <Skeleton width={4} height={88} borderRadius={0} />
        <View style={styles.listMedia}>
          <Skeleton width={72} height={72} borderRadius={36} />
        </View>
        <View style={styles.listFooter}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="30%" height={12} style={styles.detailGap} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card} testID="pokemon-card-skeleton">
      <Skeleton width="100%" height={4} borderRadius={0} />
      <View style={styles.media}>
        <Skeleton width={96} height={96} borderRadius={48} />
      </View>
      <View style={styles.footer}>
        <Skeleton width="70%" height={14} />
      </View>
    </View>
  );
}

export function PokemonDetailSkeleton() {
  const styles = useMemo(() => createDetailSkeletonStyles(), []);

  return (
    <View style={styles.detail} testID="pokemon-detail-skeleton">
      <Skeleton width={220} height={220} borderRadius={110} style={styles.detailImage} />
      <Skeleton width="60%" height={28} />
      <Skeleton width="100%" height={80} style={styles.detailGap} />
      <Skeleton width="100%" height={120} style={styles.detailGap} />
    </View>
  );
}

function createCardSkeletonStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      width: '47%',
      backgroundColor: colors.surface,
      borderRadius: Platform.OS === 'android' ? 16 : 20,
      overflow: 'hidden',
      marginBottom: Platform.OS === 'android' ? 12 : 14,
      borderWidth: Platform.OS === 'android' ? 1 : 0,
      borderColor: colors.border,
    },
    listCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 10,
      backgroundColor: colors.surface,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: Platform.OS === 'android' ? 1 : StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    listMedia: {
      padding: 8,
    },
    listFooter: {
      flex: 1,
      paddingVertical: 14,
    },
    media: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    footer: {
      alignItems: 'center',
      paddingBottom: 12,
    },
    detailGap: {
      marginTop: 16,
    },
  });
}

function createDetailSkeletonStyles() {
  return StyleSheet.create({
    detail: {
      alignItems: 'center',
      padding: 24,
    },
    detailImage: {
      marginBottom: 24,
    },
    detailGap: {
      marginTop: 16,
    },
  });
}
