import { useCallback, useEffect, useState } from 'react';
import { fetchPokemonDetail } from '@/api/pokeApi';
import { APP_ERROR_MESSAGES } from '@/constants/errorMessages';
import { getFavoritePokemon } from '@/storage/pokemonStorage';
import { useNetworkStatus } from './useNetworkStatus';
import type { PokemonDetail } from '@/types/pokemon';

export function usePokemonDetail(idOrName: string | number) {
  const { isOnline } = useNetworkStatus();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        const favorites = await getFavoritePokemon();
        const numericId = Number(idOrName);
        const cached = favorites.find(
          (item) => item.id === numericId || item.name === String(idOrName).toLowerCase()
        );

        if (cached) {
          setPokemon(cached);
          setIsOfflineData(true);
          return;
        }

        setError(APP_ERROR_MESSAGES.OFFLINE_DETAIL_UNAVAILABLE);
        return;
      }

      const detail = await fetchPokemonDetail(idOrName);
      setPokemon(detail);
      setIsOfflineData(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : APP_ERROR_MESSAGES.DETAIL_LOAD_FAILED;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [idOrName, isOnline]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  return {
    pokemon,
    isLoading,
    error,
    isOfflineData,
    retry: loadDetail,
  };
}
