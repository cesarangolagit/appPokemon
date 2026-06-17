import type { PokemonDetail, PokemonListItem } from '@/types/pokemon';

export const mockListItem = (overrides: Partial<PokemonListItem> = {}): PokemonListItem => ({
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.com/pikachu.png',
  ...overrides,
});

export const mockPokemonDetail = (overrides: Partial<PokemonDetail> = {}): PokemonDetail => ({
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu.png',
      },
    },
  },
  types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
  ],
  abilities: [
    {
      ability: { name: 'static', url: '' },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: { name: 'lightning-rod', url: '' },
      is_hidden: true,
      slot: 3,
    },
  ],
  ...overrides,
});
