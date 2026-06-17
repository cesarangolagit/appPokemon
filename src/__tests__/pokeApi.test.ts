import { pokeApiClient } from '@/api/axiosClient';
import {
  fetchPokemonDetail,
  fetchPokemonDetailsBatch,
  fetchPokemonList,
} from '@/api/pokeApi';
import { POKEAPI_PATHS } from '@/constants/pokeApi';
import { mockPokemonDetail } from '@/test-utils/mockData';

jest.mock('@/api/axiosClient', () => ({
  pokeApiClient: {
    get: jest.fn(),
  },
}));

const mockedGet = pokeApiClient.get as jest.Mock;

describe('pokeApi service', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('fetches paginated pokemon list', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        previous: null,
        results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      },
    });

    const result = await fetchPokemonList(0, 20);

    expect(mockedGet).toHaveBeenCalledWith(POKEAPI_PATHS.POKEMON_LIST, {
      params: { offset: 0, limit: 20 },
    });
    expect(result.items).toHaveLength(1);
    expect(result.nextOffset).toBe(20);
    expect(result.total).toBe(1302);
  });

  it('returns null next offset when api has no next page', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      },
    });

    const result = await fetchPokemonList(0, 20);
    expect(result.nextOffset).toBeNull();
  });

  it('fetches pokemon detail by id', async () => {
    const detail = mockPokemonDetail();
    mockedGet.mockResolvedValueOnce({ data: detail });

    const result = await fetchPokemonDetail(25);

    expect(mockedGet).toHaveBeenCalledWith(POKEAPI_PATHS.pokemonDetail(25));
    expect(result.name).toBe('pikachu');
  });

  it('fetches pokemon details in batch', async () => {
    const detail = mockPokemonDetail();
    mockedGet.mockResolvedValue({ data: detail });

    const results = await fetchPokemonDetailsBatch([25, 26]);

    expect(results).toHaveLength(2);
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it('returns empty array for batch with no ids', async () => {
    const results = await fetchPokemonDetailsBatch([]);
    expect(results).toEqual([]);
    expect(mockedGet).not.toHaveBeenCalled();
  });
});
