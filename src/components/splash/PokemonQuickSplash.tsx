import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { capitalize, hexWithAlpha } from '@/utils/pokemonHelpers';
import type { ThemeColors } from '@/constants/theme';

const FADE_MS = 220;

interface PokemonQuickSplashProps {
  name: string;
  imageUrl: string;
  visible: boolean;
  onHidden?: () => void;
}

export function PokemonQuickSplash({ name, imageUrl, visible, onHidden }: PokemonQuickSplashProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.75)).current;
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(true);
    opacity.setValue(1);
    scale.setValue(0.75);

    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [imageUrl, name, opacity, scale]);

  useEffect(() => {
    if (visible) return;

    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setMounted(false);
      onHidden?.();
    });
  }, [visible, opacity, onHidden]);

  if (!mounted) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity }]}
      pointerEvents={visible ? 'auto' : 'none'}
      testID="pokemon-quick-splash"
    >
      <View style={[styles.glowLarge, { backgroundColor: hexWithAlpha(colors.onPrimary, 0.12) }]} />
      <View style={[styles.glowSmall, { backgroundColor: hexWithAlpha(colors.onPrimary, 0.18) }]} />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.pokemon}
          contentFit="contain"
          accessibilityLabel={capitalize(name)}
        />
      </Animated.View>
      <Text style={styles.title}>{capitalize(name)}</Text>
    </Animated.View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
    glowLarge: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
    },
    glowSmall: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    pokemon: {
      width: 180,
      height: 180,
    },
    title: {
      marginTop: 16,
      fontSize: 26,
      fontWeight: '800',
      color: colors.onPrimary,
      letterSpacing: 0.5,
    },
  });
}
