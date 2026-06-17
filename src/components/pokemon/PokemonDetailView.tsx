import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { TypeBadge } from '@/components/pokemon/PokemonCard';
import { PokemonDetailSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { typeColors, type ThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import {
  capitalize,
  formatHeight,
  formatStatName,
  formatWeight,
  getPokemonArtwork,
  hexWithAlpha,
} from '@/utils/pokemonHelpers';
import { getContentBottomPadding } from '@/utils/safeArea';
import type { PokemonDetail } from '@/types/pokemon';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Distancia de scroll en la que el hero se colapsa por completo. */
const HERO_COLLAPSE_DISTANCE = 240;

interface PokemonDetailViewContextValue {
  pokemon: PokemonDetail;
  testID?: string;
  styles: ReturnType<typeof createStyles>;
  accentColor: string;
  scrollY: Animated.Value;
}

const PokemonDetailViewContext = createContext<PokemonDetailViewContextValue | null>(null);

function usePokemonDetailContext() {
  const context = useContext(PokemonDetailViewContext);
  if (!context) {
    throw new Error('PokemonDetailView.* debe usarse dentro de PokemonDetailView');
  }
  return context;
}

function getPrimaryTypeColor(pokemon: PokemonDetail): string {
  const primaryType = pokemon.types[0]?.type.name;
  return typeColors[primaryType] ?? '#6890F0';
}

const statIcons: Record<string, MaterialIconName> = {
  hp: 'heart-pulse',
  attack: 'sword',
  defense: 'shield',
  'special-attack': 'fire',
  'special-defense': 'shield-star',
  speed: 'run-fast',
};

function getStatBarColor(value: number, accentColor: string, colors: ThemeColors): string {
  if (value >= 100) return colors.success;
  if (value >= 70) return accentColor;
  if (value >= 40) return colors.offline;
  return colors.textSecondary;
}

interface RootProps {
  pokemon: PokemonDetail;
  testID?: string;
  children: ReactNode;
}

function Root({ pokemon, testID = 'pokemon-detail', children }: RootProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const accentColor = getPrimaryTypeColor(pokemon);
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentBottomPadding = getContentBottomPadding(insets, 32);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <PokemonDetailViewContext.Provider
      value={{ pokemon, testID, styles, accentColor, scrollY }}
    >
      <Animated.ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: contentBottomPadding }]}
        testID={testID}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {children}
      </Animated.ScrollView>
    </PokemonDetailViewContext.Provider>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: MaterialIconName;
  title: string;
}) {
  const { styles, accentColor } = usePokemonDetailContext();

  return (
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionIconWrap, { backgroundColor: hexWithAlpha(accentColor, 0.15) }]}>
        <MaterialCommunityIcons name={icon} size={18} color={accentColor} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Header({ children }: { children?: ReactNode }) {
  const { pokemon, styles, accentColor, scrollY } = usePokemonDetailContext();
  const artwork = getPokemonArtwork(pokemon);

  const heroHeight = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE],
    outputRange: [284, 0],
    extrapolate: 'clamp',
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE * 0.45, HERO_COLLAPSE_DISTANCE],
    outputRange: [1, 0.35, 0],
    extrapolate: 'clamp',
  });

  const heroScale = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE],
    outputRange: [1, 0.72],
    extrapolate: 'clamp',
  });

  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE],
    outputRange: [0, -36],
    extrapolate: 'clamp',
  });

  const glowScale = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE],
    outputRange: [1, 1.4],
    extrapolate: 'clamp',
  });

  const imageParallaxY = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE],
    outputRange: [0, 56],
    extrapolate: 'clamp',
  });

  const imageRotate = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE],
    outputRange: ['0deg', '-12deg'],
    extrapolate: 'clamp',
  });

  const metaTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE],
    outputRange: [0, -24],
    extrapolate: 'clamp',
  });

  const metaScale = scrollY.interpolate({
    inputRange: [0, HERO_COLLAPSE_DISTANCE * 0.6],
    outputRange: [1, 0.94],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.header}>
      <Animated.View
        style={[
          styles.heroWrapper,
          {
            height: heroHeight,
            opacity: heroOpacity,
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ translateY: heroTranslateY }, { scale: heroScale }],
          }}
        >
        <View style={[styles.heroCard, { backgroundColor: hexWithAlpha(accentColor, 0.12) }]}>
          <Animated.View
            style={[
              styles.heroGlowLarge,
              {
                backgroundColor: hexWithAlpha(accentColor, 0.2),
                transform: [{ scale: glowScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.heroGlowSmall,
              {
                backgroundColor: hexWithAlpha(accentColor, 0.3),
                transform: [{ scale: glowScale }],
              },
            ]}
          />
          {artwork ? (
            <Animated.View
              style={{
                transform: [{ translateY: imageParallaxY }, { rotate: imageRotate }],
              }}
            >
              <ProgressiveImage
                uri={artwork}
                style={styles.artwork}
                variant="detail"
                testID={`detail-image-${pokemon.id}`}
                accessibilityLabel={`Arte oficial de ${capitalize(pokemon.name)}`}
              />
            </Animated.View>
          ) : null}
        </View>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{
          alignItems: 'center',
          transform: [{ translateY: metaTranslateY }, { scale: metaScale }],
        }}
      >
        <View style={[styles.idPill, { backgroundColor: hexWithAlpha(accentColor, 0.15) }]}>
          <Text style={[styles.idPillText, { color: accentColor }]}>
            #{String(pokemon.id).padStart(3, '0')}
          </Text>
        </View>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        {children}
      </Animated.View>
    </View>
  );
}

function Types() {
  const { pokemon, styles } = usePokemonDetailContext();

  return (
    <View style={styles.section}>
      <SectionTitle icon="shape" title="Tipos" />
      <View style={styles.row}>
        {pokemon.types.map((entry) => (
          <TypeBadge key={entry.slot} type={entry.type.name} />
        ))}
      </View>
    </View>
  );
}

function Stats() {
  const { pokemon, styles, accentColor } = usePokemonDetailContext();
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <SectionTitle icon="chart-bar" title="Estadísticas" />
      {pokemon.stats.map((entry) => {
        const barColor = getStatBarColor(entry.base_stat, accentColor, colors);
        const iconName = statIcons[entry.stat.name] ?? 'circle-small';

        return (
          <View key={entry.stat.name} style={styles.statRow}>
            <View style={styles.statLabelWrap}>
              <MaterialCommunityIcons name={iconName} size={16} color={barColor} />
              <Text style={styles.statLabel}>{formatStatName(entry.stat.name)}</Text>
            </View>
            <View style={styles.statBarTrack}>
              <View
                style={[
                  styles.statBarFill,
                  {
                    width: `${Math.max(Math.min(entry.base_stat, 255) / 2.55, 4)}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
            <Text style={[styles.statValue, { color: barColor }]}>{entry.base_stat}</Text>
          </View>
        );
      })}
    </View>
  );
}

function Abilities() {
  const { pokemon, styles, accentColor } = usePokemonDetailContext();

  return (
    <View style={styles.section}>
      <SectionTitle icon="lightning-bolt" title="Habilidades" />
      <View style={styles.chipRow}>
        {pokemon.abilities.map((entry) => (
          <View
            key={entry.ability.name}
            style={[
              styles.abilityChip,
              {
                backgroundColor: entry.is_hidden
                  ? hexWithAlpha(accentColor, 0.1)
                  : hexWithAlpha(accentColor, 0.08),
                borderColor: hexWithAlpha(accentColor, 0.25),
              },
            ]}
          >
            <MaterialCommunityIcons
              name={entry.is_hidden ? 'eye-off-outline' : 'star-four-points-outline'}
              size={16}
              color={accentColor}
            />
            <Text style={styles.abilityText}>
              {capitalize(entry.ability.name.replace('-', ' '))}
              {entry.is_hidden ? ' · Oculta' : ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PhysicalInfo() {
  const { pokemon, styles, accentColor } = usePokemonDetailContext();

  return (
    <View style={styles.section}>
      <SectionTitle icon="ruler" title="Información física" />
      <View style={styles.physicalRow}>
        <View style={[styles.physicalCard, { borderColor: hexWithAlpha(accentColor, 0.2) }]}>
          <MaterialCommunityIcons name="human-male-height" size={22} color={accentColor} />
          <Text style={styles.physicalLabel}>Altura</Text>
          <Text style={styles.physicalValue}>{formatHeight(pokemon.height)}</Text>
        </View>
        <View style={[styles.physicalCard, { borderColor: hexWithAlpha(accentColor, 0.2) }]}>
          <MaterialCommunityIcons name="weight-kilogram" size={22} color={accentColor} />
          <Text style={styles.physicalLabel}>Peso</Text>
          <Text style={styles.physicalValue}>{formatWeight(pokemon.weight)}</Text>
        </View>
      </View>
    </View>
  );
}

function Actions({ children }: { children: ReactNode }) {
  const { styles } = usePokemonDetailContext();
  return <View style={styles.actions}>{children}</View>;
}

function Loading() {
  return <PokemonDetailSkeleton />;
}

function Error({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <ErrorMessage message={message} onRetry={onRetry} />;
}

export const PokemonDetailView = Object.assign(Root, {
  Header,
  Types,
  Stats,
  Abilities,
  PhysicalInfo,
  Actions,
  Loading,
  Error,
});

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.background,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
      overflow: 'hidden',
    },
    heroWrapper: {
      width: '100%',
      overflow: 'hidden',
    },
    heroCard: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 24,
      paddingVertical: 20,
      marginBottom: 12,
      overflow: 'visible',
    },
    heroGlowLarge: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    heroGlowSmall: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
    },
    artwork: {
      width: 240,
      height: 240,
      zIndex: 2,
    },
    idPill: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 8,
    },
    idPillText: {
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    name: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: 0.3,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: hexWithAlpha(colors.border, 0.8),
      shadowColor: colors.shadow,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
      gap: 10,
    },
    sectionIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
    },
    statLabelWrap: {
      width: 118,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statLabel: {
      flex: 1,
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    statBarTrack: {
      flex: 1,
      height: 10,
      backgroundColor: hexWithAlpha(colors.border, 0.7),
      borderRadius: 999,
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      borderRadius: 999,
      minWidth: 8,
    },
    statValue: {
      width: 34,
      textAlign: 'right',
      fontWeight: '800',
      fontSize: 14,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    abilityChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
    },
    abilityText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    physicalRow: {
      flexDirection: 'row',
      gap: 10,
    },
    physicalCard: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderRadius: 14,
      borderWidth: 1,
      backgroundColor: hexWithAlpha(colors.background, 0.5),
    },
    physicalLabel: {
      marginTop: 8,
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    physicalValue: {
      marginTop: 4,
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    actions: {
      marginTop: 4,
      marginBottom: 8,
    },
  });
}
