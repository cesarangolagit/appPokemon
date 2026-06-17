import { render, waitFor } from '@testing-library/react-native';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { ViewModeProvider } from '@/context/ViewModeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { saveFavoritePokemon } from '@/storage/pokemonStorage';
import { mockPokemonDetail } from '@/test-utils/mockData';

const navigation = {
  navigate: jest.fn(),
} as never;

function renderScreen() {
  return render(
    <ViewModeProvider>
      <FavoritesProvider>
        <FavoritesScreen navigation={navigation} route={{ key: 'fav', name: 'Favorites' }} />
      </FavoritesProvider>
    </ViewModeProvider>
  );
}

describe('FavoritesScreen', () => {
  beforeEach(async () => {
    navigation.navigate = jest.fn();
    await saveFavoritePokemon([]);
  });

  it('shows empty favorites state', async () => {
    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('No tienes favoritos')).toBeTruthy();
    });
  });

  it('renders saved favorites', async () => {
    await saveFavoritePokemon([mockPokemonDetail()]);

    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('Pikachu')).toBeTruthy();
    });
  });
});
