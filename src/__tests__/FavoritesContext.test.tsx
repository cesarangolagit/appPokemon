import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import { FavoritesProvider, useFavorites } from '@/context/FavoritesContext';
import { saveFavoritePokemon } from '@/storage/pokemonStorage';
import type { PokemonDetail } from '@/types/pokemon';

const mockPokemon: PokemonDetail = {
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
  types: [],
  stats: [],
  abilities: [],
};

function TestConsumer() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <>
      <Text testID="count">{favorites.length}</Text>
      <Pressable testID="toggle" onPress={() => void toggleFavorite(mockPokemon)}>
        <Text>toggle</Text>
      </Pressable>
    </>
  );
}

describe('FavoritesContext', () => {
  beforeEach(async () => {
    await saveFavoritePokemon([]);
  });

  it('persists favorites locally', async () => {
    const { getByTestId } = render(
      <FavoritesProvider>
        <TestConsumer />
      </FavoritesProvider>
    );

    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(0);
    });

    await act(async () => {
      fireEvent.press(getByTestId('toggle'));
    });

    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(1);
    });
  });

  it('removes favorite when toggled twice', async () => {
    const { getByTestId } = render(
      <FavoritesProvider>
        <TestConsumer />
      </FavoritesProvider>
    );

    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(0);
    });

    await act(async () => {
      fireEvent.press(getByTestId('toggle'));
    });

    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(1);
    });

    await act(async () => {
      fireEvent.press(getByTestId('toggle'));
    });

    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(0);
    });
  });
});
