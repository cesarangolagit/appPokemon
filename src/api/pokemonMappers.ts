import { APP_ERROR_MESSAGES } from '@/constants/errorMessages';
import {
  POKEMON_ARTWORK_BASE_URL,
  POKEMON_ID_FROM_URL_REGEX,
} from '@/constants/pokeApi';
import type { PokemonListItem, PokemonListResponse } from '@/types/pokemon';

export function extractPokemonId(url: string): number {
  const match = url.match(POKEMON_ID_FROM_URL_REGEX);

  if (!match) {
    throw new Error(APP_ERROR_MESSAGES.INVALID_POKEMON_URL);
  }

  return Number(match[1]);
}

export function getPokemonImageUrl(id: number): string {
  return `${POKEMON_ARTWORK_BASE_URL}/${id}.png`;
}

export function mapListResults(results: PokemonListResponse['results']): PokemonListItem[] {
  return results.map((item) => {
    const id = extractPokemonId(item.url);

    return {
      id,
      name: item.name,
      imageUrl: getPokemonImageUrl(id),
    };
  });
}
