/** Rutas relativas de PokeAPI (base URL en `axiosClient`). */
export const POKEAPI_PATHS = {
  POKEMON_LIST: '/pokemon',
  pokemonDetail: (idOrName: string | number) => `/pokemon/${idOrName}`,
} as const;

/** CDN de sprites oficial-artwork. */
export const POKEMON_ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/** Extrae el ID numérico de URLs como `/pokemon/25/`. */
export const POKEMON_ID_FROM_URL_REGEX = /\/pokemon\/(\d+)\/?$/;
