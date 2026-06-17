import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPokemonImageUrl } from '@/api/pokeApi';
import { APP_ERROR_MESSAGES } from '@/constants/errorMessages';
import { PokemonDetailView } from '@/components/pokemon/PokemonDetailView';
import { PokemonQuickSplash } from '@/components/splash/PokemonQuickSplash';
import { useFavorites } from '@/context/FavoritesContext';
import { useTheme } from '@/context/ThemeContext';
import { usePokemonDetail } from '@/hooks/usePokemonDetail';
import { hexWithAlpha } from '@/utils/pokemonHelpers';
import type { ThemeColors } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/types';

const MIN_SPLASH_MS = 550;

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

export function PokemonDetailScreen({ route }: Props) {
  const { id, name } = route.params;
  const { pokemon, isLoading, error, isOfflineData, retry } = usePokemonDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const splashStartedAt = useRef(Date.now());
  const [overlayMounted, setOverlayMounted] = useState(true);
  const [readyToDismiss, setReadyToDismiss] = useState(false);

  useEffect(() => {
    setOverlayMounted(true);
    setReadyToDismiss(false);
    splashStartedAt.current = Date.now();
  }, [id]);

  useEffect(() => {
    if (isLoading) {
      setOverlayMounted(true);
      setReadyToDismiss(false);
      splashStartedAt.current = Date.now();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    if (error || !pokemon) {
      setReadyToDismiss(true);
      return;
    }

    const elapsed = Date.now() - splashStartedAt.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
    const timer = setTimeout(() => setReadyToDismiss(true), remaining);
    return () => clearTimeout(timer);
  }, [isLoading, error, pokemon, id]);

  const handleToggleFavorite = useCallback(async () => {
    if (!pokemon) return;
    await toggleFavorite(pokemon);
  }, [pokemon, toggleFavorite]);

  const handleSplashHidden = useCallback(() => {
    setOverlayMounted(false);
  }, []);

  const showContent = !isLoading && pokemon && !error;
  const showError = !isLoading && (error || !pokemon);

  return (
    <View style={styles.root}>
      {showContent ? (
        <PokemonDetailView pokemon={pokemon}>
          <PokemonDetailView.Header />
          {isOfflineData ? (
            <View style={styles.offlineBanner}>
              <Ionicons name="cloud-offline-outline" size={16} color={colors.offline} />
              <Text style={styles.offlineHint}>Mostrando datos guardados sin conexión.</Text>
            </View>
          ) : null}
          <PokemonDetailView.Types />
          <PokemonDetailView.Stats />
          <PokemonDetailView.Abilities />
          <PokemonDetailView.PhysicalInfo />
          <PokemonDetailView.Actions>
            <Pressable
              style={[styles.favoriteButton, isFavorite(pokemon.id) && styles.favoriteButtonActive]}
              onPress={() => void handleToggleFavorite()}
              testID="detail-favorite-button"
            >
              <Ionicons
                name={isFavorite(pokemon.id) ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite(pokemon.id) ? colors.onPrimary : colors.primary}
              />
              <Text
                style={[
                  styles.favoriteText,
                  isFavorite(pokemon.id) && styles.favoriteTextActive,
                ]}
              >
                {isFavorite(pokemon.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              </Text>
            </Pressable>
          </PokemonDetailView.Actions>
        </PokemonDetailView>
      ) : null}

      {showError ? (
        <PokemonDetailView.Error
          message={error ?? APP_ERROR_MESSAGES.DETAIL_UNAVAILABLE}
          onRetry={retry}
        />
      ) : null}

      {overlayMounted ? (
        <PokemonQuickSplash
          name={name}
          imageUrl={getPokemonImageUrl(id)}
          visible={!readyToDismiss}
          onHidden={handleSplashHidden}
        />
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    offlineBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 14,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: hexWithAlpha(colors.offline, 0.12),
    },
    offlineHint: {
      color: colors.offline,
      fontWeight: '600',
      fontSize: 13,
    },
    favoriteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: hexWithAlpha(colors.primary, 0.1),
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 15,
    },
    favoriteButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    favoriteText: {
      color: colors.primary,
      fontWeight: '800',
      fontSize: 16,
    },
    favoriteTextActive: {
      color: colors.onPrimary,
    },
  });
}
