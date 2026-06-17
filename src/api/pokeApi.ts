import { pokeApiClient } from '@/api/axiosClient';
import { mapListResults } from '@/api/pokemonMappers';
import { POKEAPI_PATHS } from '@/constants/pokeApi';
import { PAGE_SIZE } from '@/constants/theme';
import type { PokemonDetail, PokemonListPage, PokemonListResponse } from '@/types/pokemon';

export { extractPokemonId, getPokemonImageUrl, mapListResults } from '@/api/pokemonMappers';

export async function fetchPokemonList(
  offset = 0,
  limit = PAGE_SIZE
): Promise<PokemonListPage> {
  const { data } = await pokeApiClient.get<PokemonListResponse>(POKEAPI_PATHS.POKEMON_LIST, {
    params: { offset, limit },
  });

  return {
    items: mapListResults(data.results),
    nextOffset: data.next ? offset + limit : null,
    total: data.count,
  };
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const { data } = await pokeApiClient.get<PokemonDetail>(
    POKEAPI_PATHS.pokemonDetail(idOrName)
  );

  return data;
}

export async function fetchPokemonDetailsBatch(ids: number[]): Promise<PokemonDetail[]> {
  if (ids.length === 0) {
    return [];
  }

  return Promise.all(ids.map((id) => fetchPokemonDetail(id)));
}
