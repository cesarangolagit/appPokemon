import { renderHook, waitFor } from '@testing-library/react-native';
import { fetchPokemonDetail } from '@/api/pokeApi';
import { usePokemonDetail } from '@/hooks/usePokemonDetail';
import { saveFavoritePokemon } from '@/storage/pokemonStorage';
import { mockPokemonDetail } from '@/test-utils/mockData';

jest.mock('@/api/pokeApi');

const mockFetchPokemonDetail = fetchPokemonDetail as jest.Mock;
const mockUseNetworkStatus = jest.fn(() => ({ isOnline: true }));

jest.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

describe('usePokemonDetail', () => {
  beforeEach(async () => {
    mockUseNetworkStatus.mockReturnValue({ isOnline: true });
    mockFetchPokemonDetail.mockReset();
    await saveFavoritePokemon([]);
  });

  it('loads pokemon detail online', async () => {
    const detail = mockPokemonDetail();
    mockFetchPokemonDetail.mockResolvedValueOnce(detail);

    const { result } = renderHook(() => usePokemonDetail(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon?.name).toBe('pikachu');
    expect(result.current.error).toBeNull();
    expect(result.current.isOfflineData).toBe(false);
  });

  it('loads favorite from cache when offline', async () => {
    mockUseNetworkStatus.mockReturnValue({ isOnline: false });
    const detail = mockPokemonDetail();
    await saveFavoritePokemon([detail]);

    const { result } = renderHook(() => usePokemonDetail(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon?.name).toBe('pikachu');
    expect(result.current.isOfflineData).toBe(true);
    expect(mockFetchPokemonDetail).not.toHaveBeenCalled();
  });

  it('shows offline error when pokemon is not cached', async () => {
    mockUseNetworkStatus.mockReturnValue({ isOnline: false });

    const { result } = renderHook(() => usePokemonDetail(999));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBe('Sin conexión. Este Pokémon no está disponible offline.');
  });

  it('handles fetch errors', async () => {
    mockFetchPokemonDetail.mockRejectedValueOnce(new Error('Pokémon no encontrado.'));

    const { result } = renderHook(() => usePokemonDetail(999));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Pokémon no encontrado.');
  });

  it('retries loading on demand', async () => {
    mockFetchPokemonDetail
      .mockRejectedValueOnce(new Error('Fallo temporal'))
      .mockResolvedValueOnce(mockPokemonDetail());

    const { result } = renderHook(() => usePokemonDetail(25));

    await waitFor(() => {
      expect(result.current.error).toBe('Fallo temporal');
    });

    await waitFor(async () => {
      await result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.pokemon?.name).toBe('pikachu');
    });
  });
});
