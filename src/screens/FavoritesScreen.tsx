import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPokemonImageUrl } from '@/api/pokeApi';
import { PokemonListItemRow } from '@/components/pokemon/PokemonListItemRow';
import { PokemonList } from '@/components/pokemon/PokemonList';
import { useFavorites } from '@/context/FavoritesContext';
import { useTheme } from '@/context/ThemeContext';
import { useViewMode } from '@/context/ViewModeContext';
import { capitalize } from '@/utils/pokemonHelpers';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import type { PokemonDetail, PokemonListItem } from '@/types/pokemon';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Favorites'>,
  NativeStackScreenProps<RootStackParamList>
>;

function mapFavoriteToListItem(favorite: PokemonDetail): PokemonListItem {
  return {
    id: favorite.id,
    name: favorite.name,
    imageUrl:
      favorite.sprites.other['official-artwork'].front_default ??
      getPokemonImageUrl(favorite.id),
  };
}

export function FavoritesScreen({ navigation }: Props) {
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const { viewMode } = useViewMode();
  const { colors } = useTheme();
  const containerStyle = useMemo(
    () => ({ flex: 1, backgroundColor: colors.background }),
    [colors.background]
  );

  const listItems = useMemo(
    () => favorites.map(mapFavoriteToListItem),
    [favorites]
  );

  const handlePress = useCallback(
    (id: number, name: string) => {
      navigation.navigate('PokemonDetail', {
        id,
        name: capitalize(name),
      });
    },
    [navigation]
  );

  const handleRemoveFavorite = useCallback(
    (id: number) => {
      void removeFavorite(id);
    },
    [removeFavorite]
  );

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonListItemRow
        item={item}
        viewMode={viewMode}
        isFavorite
        onPress={handlePress}
        onToggleFavorite={handleRemoveFavorite}
      />
    ),
    [handlePress, handleRemoveFavorite, viewMode]
  );

  return (
    <View style={containerStyle}>
      <PokemonList>
        {isLoading ? (
          <PokemonList.Content
            data={[]}
            renderItem={() => null}
            isInitialLoading
            isLoadingMore={false}
            hasMore={false}
            onEndReached={() => undefined}
            viewMode={viewMode}
          />
        ) : listItems.length === 0 ? (
          <PokemonList.Empty
            title="No tienes favoritos"
            description="Marca Pokémon con la estrella para verlos aquí, incluso sin conexión."
            variant="favorites"
          />
        ) : (
          <PokemonList.Content
            data={listItems}
            renderItem={renderItem}
            isInitialLoading={false}
            isLoadingMore={false}
            hasMore={false}
            onEndReached={() => undefined}
            viewMode={viewMode}
          />
        )}
      </PokemonList>
    </View>
  );
}
