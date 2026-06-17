import { useCallback, useMemo } from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchPokemonDetail } from '@/api/pokeApi';
import { PokemonListItemRow } from '@/components/pokemon/PokemonListItemRow';
import { PokemonList } from '@/components/pokemon/PokemonList';
import { useFavorites } from '@/context/FavoritesContext';
import { useSearch } from '@/context/SearchContext';
import { useViewMode } from '@/context/ViewModeContext';
import { usePokemonList } from '@/hooks/usePokemonList';
import { capitalize } from '@/utils/pokemonHelpers';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import type { PokemonListItem } from '@/types/pokemon';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'PokemonList'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function PokemonListScreen({ navigation }: Props) {
  const { query: searchQuery } = useSearch();
  const { viewMode } = useViewMode();
  const { favorites, toggleFavorite } = useFavorites();
  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);
  const {
    items,
    isInitialLoading,
    isLoadingMore,
    error,
    isOfflineData,
    isEmpty,
    emptyMessage,
    hasMore,
    loadMore,
    refresh,
  } = usePokemonList({ searchQuery });

  const handleToggleFavorite = useCallback(
    async (id: number) => {
      const detail = await fetchPokemonDetail(id);
      await toggleFavorite(detail);
    },
    [toggleFavorite]
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

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonListItemRow
        item={item}
        viewMode={viewMode}
        isFavorite={favoriteIds.has(item.id)}
        onPress={handlePress}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [favoriteIds, handlePress, handleToggleFavorite, viewMode]
  );

  return (
    <PokemonList>
      <PokemonList.OfflineBanner visible={isOfflineData} />

      {error && !isInitialLoading && isEmpty ? (
        <PokemonList.Error message={error} onRetry={refresh} />
      ) : isEmpty ? (
        <PokemonList.Empty
          title={searchQuery ? 'Sin resultados' : 'Lista vacía'}
          description={emptyMessage}
          variant={searchQuery.trim() ? 'search' : 'default'}
        />
      ) : (
        <>
          {error ? <PokemonList.Error message={error} onRetry={refresh} /> : null}
          <PokemonList.Content
            data={items}
            renderItem={renderItem}
            isInitialLoading={isInitialLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onEndReached={loadMore}
            onRefresh={refresh}
            isRefreshing={isInitialLoading}
            viewMode={viewMode}
          />
        </>
      )}
    </PokemonList>
  );
}
