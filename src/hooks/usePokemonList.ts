import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchPokemonList } from '@/api/pokeApi';
import { APP_ERROR_MESSAGES, ERROR_SUFFIXES } from '@/constants/errorMessages';
import { PAGE_SIZE } from '@/constants/theme';
import { getCachedPokemonList, saveCachedPokemonList } from '@/storage/pokemonStorage';
import { filterPokemonByName } from '@/utils/pokemonHelpers';
import { useNetworkStatus } from './useNetworkStatus';
import type { PokemonListItem } from '@/types/pokemon';

interface UsePokemonListOptions {
  searchQuery?: string;
}

export function usePokemonList({ searchQuery = '' }: UsePokemonListOptions = {}) {
  const { isOnline } = useNetworkStatus();
  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const isFetchingRef = useRef(false);

  const loadFromCache = useCallback(async () => {
    const cached = await getCachedPokemonList();
    if (cached?.items.length) {
      setItems(cached.items);
      setNextOffset(cached.nextOffset);
      setIsOfflineData(true);
      return true;
    }
    return false;
  }, []);

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }

      try {
        if (!isOnline) {
          const loaded = await loadFromCache();
          if (!loaded) {
            setError(APP_ERROR_MESSAGES.OFFLINE_NO_CACHE);
          }
          return;
        }

        const response = await fetchPokemonList(offset, PAGE_SIZE);
        setError(null);
        setIsOfflineData(false);

        setItems((current) => {
          const merged = append ? [...current, ...response.items] : response.items;
          void saveCachedPokemonList(merged, response.nextOffset);
          return merged;
        });
        setNextOffset(response.nextOffset);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : APP_ERROR_MESSAGES.LIST_LOAD_FAILED;
        const loaded = await loadFromCache();
        setError(
          loaded ? `${message} ${ERROR_SUFFIXES.SHOWING_CACHED_LIST}` : message
        );
      } finally {
        isFetchingRef.current = false;
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    },
    [isOnline, loadFromCache]
  );

  useEffect(() => {
    void fetchPage(0, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (searchQuery.trim() || nextOffset === null || isLoadingMore || isInitialLoading) {
      return;
    }
    void fetchPage(nextOffset, true);
  }, [fetchPage, isInitialLoading, isLoadingMore, nextOffset, searchQuery]);

  const refresh = useCallback(() => {
    void fetchPage(0, false);
  }, [fetchPage]);

  const filteredItems = useMemo(
    () => filterPokemonByName(items, searchQuery),
    [items, searchQuery]
  );

  const hasSearchQuery = searchQuery.trim().length > 0;
  const isEmpty = !isInitialLoading && filteredItems.length === 0;
  const emptyMessage = hasSearchQuery
    ? `No se encontraron Pokémon para "${searchQuery.trim()}".`
    : 'No hay Pokémon disponibles en este momento.';

  return {
    items: filteredItems,
    isInitialLoading,
    isLoadingMore,
    error,
    isOfflineData,
    isOnline,
    isEmpty,
    emptyMessage,
    hasMore: nextOffset !== null && !hasSearchQuery,
    loadMore,
    refresh,
  };
}
