import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

const splashPokemon = require('../../../assets/splash-pokemon.png');

export function PokemonSplashScreen() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -8,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 8,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    return () => floatLoop.stop();
  }, [scale, float]);

  return (
    <View style={styles.container} testID="pokemon-splash">
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />
      <Animated.View
        style={{
          transform: [{ scale }, { translateY: float }],
        }}
      >
        <Image
          source={splashPokemon}
          style={styles.pokemon}
          contentFit="contain"
          accessibilityLabel="Pikachu"
        />
      </Animated.View>
      <Text style={styles.title}>Pokédex</Text>
      <Text style={styles.subtitle}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  glowLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  glowSmall: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  pokemon: {
    width: 220,
    height: 220,
  },
  title: {
    marginTop: 24,
    fontSize: 34,
    fontWeight: '800',
    color: colors.onPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
});
