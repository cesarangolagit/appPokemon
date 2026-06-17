import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { PokemonDetailScreen } from '@/screens/PokemonDetailScreen';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { usePokemonDetail } from '@/hooks/usePokemonDetail';
import { mockPokemonDetail } from '@/test-utils/mockData';

jest.mock('@/hooks/usePokemonDetail');

const mockUsePokemonDetail = usePokemonDetail as jest.Mock;

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as never;

const route = {
  key: 'PokemonDetail-25',
  name: 'PokemonDetail' as const,
  params: { id: 25, name: 'Pikachu' },
};

function renderScreen() {
  return render(
    <FavoritesProvider>
      <PokemonDetailScreen navigation={navigation} route={route} />
    </FavoritesProvider>
  );
}

describe('PokemonDetailScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUsePokemonDetail.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows quick splash while loading', () => {
    mockUsePokemonDetail.mockReturnValue({
      pokemon: null,
      isLoading: true,
      error: null,
      isOfflineData: false,
      retry: jest.fn(),
    });

    const { getByTestId } = renderScreen();
    expect(getByTestId('pokemon-quick-splash')).toBeTruthy();
  });

  it('renders detail content after loading', async () => {
    const pokemon = mockPokemonDetail();
    mockUsePokemonDetail.mockReturnValue({
      pokemon,
      isLoading: false,
      error: null,
      isOfflineData: false,
      retry: jest.fn(),
    });

    const { getByText, getByTestId } = renderScreen();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(getByText('Pikachu')).toBeTruthy();
    });

    expect(getByTestId('pokemon-detail')).toBeTruthy();
    expect(getByTestId('detail-favorite-button')).toBeTruthy();
  });

  it('shows error state when detail fails', async () => {
    const retry = jest.fn();
    mockUsePokemonDetail.mockReturnValue({
      pokemon: null,
      isLoading: false,
      error: 'Pokémon no encontrado.',
      isOfflineData: false,
      retry,
    });

    const { getByText, getByTestId } = renderScreen();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(getByText('Pokémon no encontrado.')).toBeTruthy();
    });

    fireEvent.press(getByTestId('error-retry-button'));
    expect(retry).toHaveBeenCalled();
  });

  it('shows offline banner when using cached detail', async () => {
    mockUsePokemonDetail.mockReturnValue({
      pokemon: mockPokemonDetail(),
      isLoading: false,
      error: null,
      isOfflineData: true,
      retry: jest.fn(),
    });

    const { getByText } = renderScreen();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(getByText(/datos guardados sin conexión/i)).toBeTruthy();
    });
  });
});
