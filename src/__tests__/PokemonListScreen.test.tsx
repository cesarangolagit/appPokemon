import { render, fireEvent } from '@testing-library/react-native';
import { PokemonListScreen } from '@/screens/PokemonListScreen';
import { SearchProvider } from '@/context/SearchContext';
import { ViewModeProvider } from '@/context/ViewModeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { usePokemonList } from '@/hooks/usePokemonList';
import { mockListItem } from '@/test-utils/mockData';

jest.mock('@/hooks/usePokemonList');
jest.mock('@/api/pokeApi', () => ({
  fetchPokemonDetail: jest.fn(),
  getPokemonImageUrl: (id: number) => `https://example.com/${id}.png`,
}));

const mockUseSearch = jest.fn(() => ({
  query: '',
  setQuery: jest.fn(),
  clearQuery: jest.fn(),
}));

jest.mock('@/context/SearchContext', () => ({
  useSearch: () => mockUseSearch(),
  SearchProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockUsePokemonList = usePokemonList as jest.Mock;

const navigation = {
  navigate: jest.fn(),
} as never;

function renderScreen() {
  return render(
    <SearchProvider>
      <ViewModeProvider>
        <FavoritesProvider>
          <PokemonListScreen navigation={navigation} route={{ key: 'list', name: 'PokemonList' }} />
        </FavoritesProvider>
      </ViewModeProvider>
    </SearchProvider>
  );
}

describe('PokemonListScreen', () => {
  beforeEach(() => {
    mockUsePokemonList.mockReset();
    mockUseSearch.mockReturnValue({
      query: '',
      setQuery: jest.fn(),
      clearQuery: jest.fn(),
    });
    navigation.navigate = jest.fn();
  });

  it('shows empty search state', () => {
    mockUseSearch.mockReturnValue({
      query: 'zzz',
      setQuery: jest.fn(),
      clearQuery: jest.fn(),
    });
    mockUsePokemonList.mockReturnValue({
      items: [],
      isInitialLoading: false,
      isLoadingMore: false,
      error: null,
      isOfflineData: false,
      isEmpty: true,
      emptyMessage: 'No se encontraron Pokémon para "zzz".',
      hasMore: false,
      loadMore: jest.fn(),
      refresh: jest.fn(),
    });

    const { getByText } = renderScreen();
    expect(getByText('Sin resultados')).toBeTruthy();
    expect(getByText(/No se encontraron Pokémon/i)).toBeTruthy();
  });

  it('shows error when list is empty and fetch failed', () => {
    const refresh = jest.fn();
    mockUsePokemonList.mockReturnValue({
      items: [],
      isInitialLoading: false,
      isLoadingMore: false,
      error: 'Sin conexión y no hay datos guardados localmente.',
      isOfflineData: false,
      isEmpty: true,
      emptyMessage: 'No hay Pokémon disponibles en este momento.',
      hasMore: false,
      loadMore: jest.fn(),
      refresh,
    });

    const { getByText, getByTestId } = renderScreen();
    expect(getByText(/Sin conexión/i)).toBeTruthy();
    fireEvent.press(getByTestId('error-retry-button'));
    expect(refresh).toHaveBeenCalled();
  });

  it('renders pokemon cards and navigates to detail', () => {
    mockUsePokemonList.mockReturnValue({
      items: [mockListItem()],
      isInitialLoading: false,
      isLoadingMore: false,
      error: null,
      isOfflineData: false,
      isEmpty: false,
      emptyMessage: '',
      hasMore: false,
      loadMore: jest.fn(),
      refresh: jest.fn(),
    });

    const { getByText } = renderScreen();
    fireEvent.press(getByText('Pikachu'));

    expect(navigation.navigate).toHaveBeenCalledWith('PokemonDetail', {
      id: 25,
      name: 'Pikachu',
    });
  });
});
