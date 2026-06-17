import { STORAGE_KEYS } from '@/constants/storageKeys';
import { getJsonItem, setJsonItem } from './asyncStorage';
import type { CachedPokemonList, PokemonDetail, PokemonListItem } from '@/types/pokemon';

export async function getCachedPokemonList(): Promise<CachedPokemonList | null> {
  return getJsonItem<CachedPokemonList>(STORAGE_KEYS.CACHED_LIST);
}

export async function saveCachedPokemonList(
  items: PokemonListItem[],
  nextOffset: number | null
): Promise<void> {
  const payload: CachedPokemonList = {
    items,
    nextOffset,
    updatedAt: Date.now(),
  };
  await setJsonItem(STORAGE_KEYS.CACHED_LIST, payload);
}

export async function getFavoritePokemon(): Promise<PokemonDetail[]> {
  return (await getJsonItem<PokemonDetail[]>(STORAGE_KEYS.FAVORITES)) ?? [];
}

export async function saveFavoritePokemon(favorites: PokemonDetail[]): Promise<void> {
  await setJsonItem(STORAGE_KEYS.FAVORITES, favorites);
}

export async function upsertFavorite(pokemon: PokemonDetail): Promise<PokemonDetail[]> {
  const favorites = await getFavoritePokemon();
  const exists = favorites.some((item) => item.id === pokemon.id);

  if (exists) {
    return favorites;
  }

  const updated = [...favorites, pokemon];
  await saveFavoritePokemon(updated);
  return updated;
}

export async function removeFavorite(id: number): Promise<PokemonDetail[]> {
  const favorites = await getFavoritePokemon();
  const updated = favorites.filter((item) => item.id !== id);
  await saveFavoritePokemon(updated);
  return updated;
}

export async function isFavorite(id: number): Promise<boolean> {
  const favorites = await getFavoritePokemon();
  return favorites.some((item) => item.id === id);
}
