import { renderHook, act, waitFor } from '@testing-library/react-native';
import { fetchPokemonList } from '@/api/pokeApi';
import { usePokemonList } from '@/hooks/usePokemonList';
import { saveCachedPokemonList } from '@/storage/pokemonStorage';
import { mockListItem } from '@/test-utils/mockData';

jest.mock('@/api/pokeApi');

const mockFetchPokemonList = fetchPokemonList as jest.Mock;

const mockUseNetworkStatus = jest.fn(() => ({ isOnline: true }));

jest.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

describe('usePokemonList', () => {
  beforeEach(async () => {
    mockUseNetworkStatus.mockReturnValue({ isOnline: true });
    mockFetchPokemonList.mockReset();
    await saveCachedPokemonList([], null);
  });

  it('loads initial pokemon list', async () => {
    mockFetchPokemonList.mockResolvedValueOnce({
      items: [mockListItem()],
      nextOffset: 20,
      total: 100,
    });

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(true);
  });

  it('filters items by search query', async () => {
    mockFetchPokemonList.mockResolvedValueOnce({
      items: [
        mockListItem({ id: 1, name: 'bulbasaur' }),
        mockListItem({ id: 25, name: 'pikachu' }),
      ],
      nextOffset: null,
      total: 2,
    });

    const { result } = renderHook(() => usePokemonList({ searchQuery: 'pika' }));

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.name).toBe('pikachu');
    expect(result.current.emptyMessage).toContain('pika');
    expect(result.current.hasMore).toBe(false);
  });

  it('shows empty search message when no matches', async () => {
    mockFetchPokemonList.mockResolvedValueOnce({
      items: [mockListItem({ name: 'bulbasaur' })],
      nextOffset: null,
      total: 1,
    });

    const { result } = renderHook(() => usePokemonList({ searchQuery: 'charizard' }));

    await waitFor(() => {
      expect(result.current.isEmpty).toBe(true);
    });

    expect(result.current.emptyMessage).toBe('No se encontraron Pokémon para "charizard".');
  });

  it('loads from cache when offline', async () => {
    mockUseNetworkStatus.mockReturnValue({ isOnline: false });
    await saveCachedPokemonList([mockListItem({ id: 1, name: 'bulbasaur' })], 20);

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.isOfflineData).toBe(true);
    expect(mockFetchPokemonList).not.toHaveBeenCalled();
  });

  it('sets error when offline without cache', async () => {
    mockUseNetworkStatus.mockReturnValue({ isOnline: false });

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    expect(result.current.error).toBe('Sin conexión y no hay datos guardados localmente.');
    expect(result.current.isEmpty).toBe(true);
  });

  it('falls back to cache on fetch error', async () => {
    await saveCachedPokemonList([mockListItem({ id: 7, name: 'squirtle' })], null);
    mockFetchPokemonList.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.error).toContain('Network error');
    expect(result.current.error).toContain('Mostrando última lista guardada.');
  });

  it('loads more pages when requested', async () => {
    mockFetchPokemonList
      .mockResolvedValueOnce({
        items: [mockListItem({ id: 1, name: 'bulbasaur' })],
        nextOffset: 20,
        total: 40,
      })
      .mockResolvedValueOnce({
        items: [mockListItem({ id: 2, name: 'ivysaur' })],
        nextOffset: null,
        total: 40,
      });

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(2);
    });
  });
});
