import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchPokemonDetail } from '@/api/pokeApi';
import {
  getFavoritePokemon,
  removeFavorite as removeFavoriteFromStorage,
  upsertFavorite,
} from '@/storage/pokemonStorage';
import type { PokemonDetail } from '@/types/pokemon';

interface FavoritesContextValue {
  favorites: PokemonDetail[];
  isLoading: boolean;
  isFavorite: (id: number) => boolean;
  addFavorite: (pokemon: PokemonDetail) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  toggleFavorite: (pokemon: PokemonDetail) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<PokemonDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFavorites = useCallback(async () => {
    const stored = await getFavoritePokemon();
    setFavorites(stored);
  }, []);

  useEffect(() => {
    refreshFavorites().finally(() => setIsLoading(false));
  }, [refreshFavorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const addFavorite = useCallback(async (pokemon: PokemonDetail) => {
    const updated = await upsertFavorite(pokemon);
    setFavorites(updated);
  }, []);

  const removeFavorite = useCallback(async (id: number) => {
    const updated = await removeFavoriteFromStorage(id);
    setFavorites(updated);
  }, []);

  const toggleFavorite = useCallback(
    async (pokemon: PokemonDetail) => {
      if (isFavorite(pokemon.id)) {
        await removeFavorite(pokemon.id);
      } else {
        await addFavorite(pokemon);
      }
    },
    [addFavorite, isFavorite, removeFavorite]
  );

  const value = useMemo(
    () => ({
      favorites,
      isLoading,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      refreshFavorites,
    }),
    [favorites, isLoading, isFavorite, addFavorite, removeFavorite, toggleFavorite, refreshFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
}

export async function ensureFavoriteDetail(id: number): Promise<PokemonDetail> {
  const favorites = await getFavoritePokemon();
  const cached = favorites.find((item) => item.id === id);
  if (cached) return cached;
  return fetchPokemonDetail(id);
}
