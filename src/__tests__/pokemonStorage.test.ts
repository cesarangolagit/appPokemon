import {
  getCachedPokemonList,
  getFavoritePokemon,
  removeFavorite,
  saveCachedPokemonList,
  saveFavoritePokemon,
  upsertFavorite,
} from '@/storage/pokemonStorage';
import { mockListItem, mockPokemonDetail } from '@/test-utils/mockData';

describe('pokemonStorage', () => {
  beforeEach(async () => {
    await saveFavoritePokemon([]);
    await saveCachedPokemonList([], null);
  });

  it('saves and reads cached pokemon list', async () => {
    const items = [mockListItem({ id: 1, name: 'bulbasaur' })];
    await saveCachedPokemonList(items, 20);

    const cached = await getCachedPokemonList();

    expect(cached?.items).toEqual(items);
    expect(cached?.nextOffset).toBe(20);
    expect(cached?.updatedAt).toEqual(expect.any(Number));
  });

  it('returns empty favorites by default', async () => {
    await expect(getFavoritePokemon()).resolves.toEqual([]);
  });

  it('upserts favorite without duplicates', async () => {
    const pokemon = mockPokemonDetail();

    await upsertFavorite(pokemon);
    await upsertFavorite(pokemon);

    const favorites = await getFavoritePokemon();
    expect(favorites).toHaveLength(1);
  });

  it('removes favorite by id', async () => {
    const pokemon = mockPokemonDetail();
    await upsertFavorite(pokemon);

    const updated = await removeFavorite(25);

    expect(updated).toHaveLength(0);
    await expect(getFavoritePokemon()).resolves.toEqual([]);
  });
});
