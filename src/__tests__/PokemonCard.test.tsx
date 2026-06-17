import { render, fireEvent } from '@testing-library/react-native';
import { PokemonCard } from '@/components/pokemon/PokemonCard';

const pokemon = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.com/pikachu.png',
};

describe('PokemonCard compound component', () => {
  it('renders name and id subcomponents', () => {
    const { getByText } = render(
      <PokemonCard pokemon={pokemon}>
        <PokemonCard.Content>
          <PokemonCard.Name />
          <PokemonCard.Id />
        </PokemonCard.Content>
      </PokemonCard>
    );

    expect(getByText('Pikachu')).toBeTruthy();
    expect(getByText('#025')).toBeTruthy();
  });

  it('renders image with progressive loading', () => {
    const { getByTestId } = render(
      <PokemonCard pokemon={pokemon}>
        <PokemonCard.Image />
      </PokemonCard>
    );

    expect(getByTestId('pokemon-image-25')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PokemonCard pokemon={pokemon} onPress={onPress} testID="pokemon-card-25">
        <PokemonCard.Content>
          <PokemonCard.Name />
        </PokemonCard.Content>
      </PokemonCard>
    );

    fireEvent.press(getByTestId('pokemon-card-25'));
    expect(onPress).toHaveBeenCalled();
  });
});
