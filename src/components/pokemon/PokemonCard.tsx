import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { typeColors, type ThemeColors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { capitalize, getAccentLabelColor, getCardAccentColor, hexWithAlpha } from '@/utils/pokemonHelpers';
import type { PokemonListItem } from '@/types/pokemon';
import type { PokemonViewMode } from '@/types/viewMode';

interface PokemonCardContextValue {
  pokemon: PokemonListItem;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  testID?: string;
  accentColor: string;
  variant: PokemonViewMode;
  styles: ReturnType<typeof createStyles>;
}

const PokemonCardContext = createContext<PokemonCardContextValue | null>(null);

function usePokemonCardContext() {
  const context = useContext(PokemonCardContext);
  if (!context) {
    throw new Error('PokemonCard.* debe usarse dentro de PokemonCard');
  }
  return context;
}

interface PokemonCardRootProps {
  pokemon: PokemonListItem;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  testID?: string;
  variant?: PokemonViewMode;
  children: ReactNode;
}

function Root({
  pokemon,
  onPress,
  isFavorite,
  onToggleFavorite,
  testID,
  variant = 'grid',
  children,
}: PokemonCardRootProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(1)).current;
  const accentColor = getCardAccentColor(pokemon.id);
  const isList = variant === 'list';

  const childArray = Children.toArray(children);
  const imageNode = childArray.find(
    (child) => isValidElement(child) && child.type === Image
  );
  const contentNode = childArray.find(
    (child) => isValidElement(child) && child.type === Content
  );
  const favoriteNode = childArray.find(
    (child) => isValidElement(child) && child.type === FavoriteButton
  );

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: isList ? 0.98 : 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const contextValue = {
    pokemon,
    onPress,
    isFavorite,
    onToggleFavorite,
    testID,
    accentColor,
    variant,
    styles,
  };

  if (isList) {
    return (
      <PokemonCardContext.Provider value={contextValue}>
        <Animated.View style={[styles.listWrapper, { transform: [{ scale }] }]}>
          <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.listCard,
              pressed && styles.cardPressed,
            ]}
            testID={testID ?? `pokemon-card-${pokemon.id}`}
          >
            <View style={[styles.listAccent, { backgroundColor: accentColor }]} />
            <View style={styles.listImageZone}>
              <View
                style={[
                  styles.listImageBackdrop,
                  { backgroundColor: hexWithAlpha(accentColor, 0.1) },
                ]}
              >
                {imageNode}
              </View>
            </View>
            <View style={styles.listContent}>{contentNode}</View>
            {favoriteNode}
          </Pressable>
        </Animated.View>
      </PokemonCardContext.Provider>
    );
  }

  return (
    <PokemonCardContext.Provider value={contextValue}>
      <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          testID={testID ?? `pokemon-card-${pokemon.id}`}
        >
          <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

          <View
            style={[
              styles.media,
              Platform.OS === 'android' && {
                backgroundColor: hexWithAlpha(accentColor, 0.07),
              },
            ]}
          >
            {Platform.OS === 'android' ? (
              <View
                style={[
                  styles.gridImageBackdrop,
                  { backgroundColor: hexWithAlpha(accentColor, 0.14) },
                ]}
              >
                {imageNode}
              </View>
            ) : (
              <>
                <View
                  style={[styles.glowLarge, { backgroundColor: hexWithAlpha(accentColor, 0.22) }]}
                />
                <View
                  style={[styles.glowSmall, { backgroundColor: hexWithAlpha(accentColor, 0.35) }]}
                />
                {imageNode}
              </>
            )}

            <View
              style={[
                styles.idBadge,
                Platform.OS === 'android' && {
                  backgroundColor: hexWithAlpha(accentColor, 0.12),
                  borderWidth: 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.idBadgeText,
                  { color: getAccentLabelColor(accentColor, colors) },
                ]}
              >
                #{String(pokemon.id).padStart(3, '0')}
              </Text>
            </View>
            {favoriteNode}
          </View>

          <View style={styles.footer}>{contentNode}</View>
        </Pressable>
      </Animated.View>
    </PokemonCardContext.Provider>
  );
}

function Image() {
  const { pokemon, variant, styles } = usePokemonCardContext();

  return (
    <ProgressiveImage
      uri={pokemon.imageUrl}
      style={variant === 'list' ? styles.listImage : styles.image}
      variant="card"
      testID={`pokemon-image-${pokemon.id}`}
      accessibilityLabel={`Imagen de ${capitalize(pokemon.name)}`}
    />
  );
}

function Content({ children }: { children: ReactNode }) {
  const { variant, styles } = usePokemonCardContext();
  return (
    <View style={variant === 'list' ? styles.listTextContent : styles.content}>{children}</View>
  );
}

function Name() {
  const { pokemon, variant, styles } = usePokemonCardContext();
  return (
    <Text
      style={variant === 'list' ? styles.listName : styles.name}
      numberOfLines={1}
    >
      {capitalize(pokemon.name)}
    </Text>
  );
}

function Id() {
  const { pokemon, variant, accentColor, styles } = usePokemonCardContext();
  const { colors } = useTheme();
  if (variant === 'grid') return null;

  const idColor = getAccentLabelColor(accentColor, colors);

  return (
    <View style={[styles.listIdBadge, { backgroundColor: hexWithAlpha(accentColor, 0.12) }]}>
      <Text style={[styles.listId, { color: idColor }]}>
        #{String(pokemon.id).padStart(3, '0')}
      </Text>
    </View>
  );
}

function FavoriteButton() {
  const { pokemon, isFavorite, onToggleFavorite, variant, styles } = usePokemonCardContext();

  if (!onToggleFavorite) return null;

  const isList = variant === 'list';

  return (
    <Pressable
      style={[
        isList ? styles.listFavoriteButton : styles.favoriteButton,
        isFavorite && styles.favoriteButtonActive,
      ]}
      onPress={(event) => {
        event.stopPropagation?.();
        onToggleFavorite();
      }}
      testID={`favorite-button-${pokemon.id}`}
      accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
        {isFavorite ? '★' : '☆'}
      </Text>
    </Pressable>
  );
}

export const PokemonCard = Object.assign(Root, {
  Image,
  Content,
  Name,
  Id,
  FavoriteButton,
});

export function TypeBadge({ type }: { type: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const backgroundColor = typeColors[type] ?? colors.textSecondary;

  return (
    <View style={[styles.badge, { backgroundColor }]} testID={`type-badge-${type}`}>
      <Text style={styles.badgeText}>{capitalize(type)}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  const cardShadow = Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
    android: {
      elevation: 0,
    },
    default: {},
  });

  const gridShadow = Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 0,
    },
    default: {},
  });

  return StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginHorizontal: Platform.OS === 'android' ? 5 : 6,
    marginBottom: Platform.OS === 'android' ? 12 : 14,
  },
  card: {
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: Platform.OS === 'android' ? 1 : StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...gridShadow,
  },
  listWrapper: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 96,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: Platform.OS === 'android' ? 1 : StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...cardShadow,
  },
  cardPressed: {
    opacity: Platform.OS === 'android' ? 0.94 : 1,
  },
  accentStrip: {
    height: Platform.OS === 'android' ? 3 : 4,
    width: '100%',
  },
  listAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  media: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Platform.OS === 'android' ? 128 : 140,
    paddingTop: Platform.OS === 'android' ? 14 : 12,
    paddingBottom: Platform.OS === 'android' ? 10 : 8,
    overflow: 'hidden',
  },
  gridImageBackdrop: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  listImageZone: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  listImageBackdrop: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowLarge: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    top: 18,
  },
  glowSmall: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    top: 36,
  },
  idBadge: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 8 : 10,
    left: Platform.OS === 'android' ? 8 : 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'android' ? 3 : 4,
    borderRadius: Platform.OS === 'android' ? 8 : 10,
    borderWidth: Platform.OS === 'android' ? 0 : 0,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 0,
      },
      android: {
        elevation: 0,
      },
      default: {},
    }),
  },
  idBadgeText: {
    fontSize: Platform.OS === 'android' ? 10 : 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  image: {
    width: Platform.OS === 'android' ? 88 : 112,
    height: Platform.OS === 'android' ? 88 : 112,
    zIndex: 2,
  },
  listImage: {
    width: 68,
    height: 68,
    zIndex: 2,
  },
  footer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingBottom: Platform.OS === 'android' ? 14 : 12,
    borderTopWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
    borderTopColor: hexWithAlpha(colors.border, 0.6),
  },
  content: {
    alignItems: 'center',
  },
  listContent: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  listTextContent: {
    flex: 1,
  },
  name: {
    fontSize: Platform.OS === 'android' ? 14 : 15,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  listName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.1,
  },
  listIdBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  listId: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 6 : 8,
    right: Platform.OS === 'android' ? 6 : 8,
    width: Platform.OS === 'android' ? 32 : 34,
    height: Platform.OS === 'android' ? 32 : 34,
    borderRadius: Platform.OS === 'android' ? 16 : 17,
    backgroundColor: Platform.OS === 'android' ? colors.background : colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 3,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 0,
      },
      default: {},
    }),
  },
  listFavoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 0,
      },
      default: {},
    }),
  },
  favoriteButtonActive: {
    backgroundColor: colors.favoriteBg,
  },
  favoriteIcon: {
    fontSize: Platform.OS === 'android' ? 16 : 18,
    color: colors.textSecondary,
    marginTop: -1,
  },
  favoriteIconActive: {
    color: colors.favorite,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  });
}
