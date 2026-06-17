import {
  extractPokemonId,
  getPokemonImageUrl,
  mapListResults,
} from '@/api/pokemonMappers';
import { APP_ERROR_MESSAGES } from '@/constants/errorMessages';
import { POKEMON_ARTWORK_BASE_URL } from '@/constants/pokeApi';

describe('pokemonMappers', () => {
  it('extracts pokemon id from url', () => {
    expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('throws on invalid pokemon url', () => {
    expect(() => extractPokemonId('invalid-url')).toThrow(APP_ERROR_MESSAGES.INVALID_POKEMON_URL);
  });

  it('builds artwork url from id', () => {
    expect(getPokemonImageUrl(25)).toBe(`${POKEMON_ARTWORK_BASE_URL}/25.png`);
  });

  it('maps list results to list items', () => {
    const items = mapListResults([
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    ]);

    expect(items).toEqual([
      {
        id: 25,
        name: 'pikachu',
        imageUrl: getPokemonImageUrl(25),
      },
    ]);
  });
});
