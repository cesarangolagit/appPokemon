import {
  capitalize,
  filterPokemonByName,
  formatHeight,
  formatStatName,
  formatWeight,
  getCardAccentColor,
  getPokemonArtwork,
  hexWithAlpha,
} from '@/utils/pokemonHelpers';
import { mockPokemonDetail } from '@/test-utils/mockData';

describe('pokemonHelpers', () => {
  it('capitalizes pokemon names', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur');
  });

  it('formats stat names', () => {
    expect(formatStatName('special-attack')).toBe('Special attack');
  });

  it('filters pokemon by name in real time', () => {
    const items = [
      { id: 1, name: 'bulbasaur', imageUrl: '' },
      { id: 25, name: 'pikachu', imageUrl: '' },
    ];

    expect(filterPokemonByName(items, 'pika')).toHaveLength(1);
    expect(filterPokemonByName(items, '')).toHaveLength(2);
    expect(filterPokemonByName(items, '   ')).toHaveLength(2);
  });

  it('formats height and weight', () => {
    expect(formatHeight(40)).toBe('4.0 m');
    expect(formatWeight(600)).toBe('60.0 kg');
  });

  it('returns pokemon artwork url', () => {
    const artwork = getPokemonArtwork(mockPokemonDetail());
    expect(artwork).toBe('https://example.com/pikachu.png');
  });

  it('builds rgba color with alpha', () => {
    expect(hexWithAlpha('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('returns card accent color by id', () => {
    expect(getCardAccentColor(25)).toMatch(/^#/);
    expect(getCardAccentColor(26)).toBeTruthy();
  });
});
