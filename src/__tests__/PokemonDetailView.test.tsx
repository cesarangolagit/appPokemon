import { render, fireEvent } from '@testing-library/react-native';
import { PokemonDetailView } from '@/components/pokemon/PokemonDetailView';
import { mockPokemonDetail } from '@/test-utils/mockData';

describe('PokemonDetailView compound component', () => {
  const pokemon = mockPokemonDetail();

  it('renders header, types, stats, abilities and physical info', () => {
    const { getByText, getByTestId } = render(
      <PokemonDetailView pokemon={pokemon}>
        <PokemonDetailView.Header />
        <PokemonDetailView.Types />
        <PokemonDetailView.Stats />
        <PokemonDetailView.Abilities />
        <PokemonDetailView.PhysicalInfo />
      </PokemonDetailView>
    );

    expect(getByTestId('pokemon-detail')).toBeTruthy();
    expect(getByTestId('detail-image-25')).toBeTruthy();
    expect(getByText('Pikachu')).toBeTruthy();
    expect(getByText('#025')).toBeTruthy();
    expect(getByText('Tipos')).toBeTruthy();
    expect(getByText('Estadísticas')).toBeTruthy();
    expect(getByText('Habilidades')).toBeTruthy();
    expect(getByText('Información física')).toBeTruthy();
    expect(getByText('Static')).toBeTruthy();
    expect(getByText(/Oculta/)).toBeTruthy();
    expect(getByText('0.4 m')).toBeTruthy();
    expect(getByText('6.0 kg')).toBeTruthy();
  });

  it('shows loading skeleton', () => {
    const { toJSON } = render(<PokemonDetailView.Loading />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows error with retry', () => {
    const onRetry = jest.fn();
    const { getByText, getByTestId } = render(
      <PokemonDetailView.Error message="No se pudo cargar" onRetry={onRetry} />
    );

    expect(getByText('No se pudo cargar')).toBeTruthy();
    fireEvent.press(getByTestId('error-retry-button'));
    expect(onRetry).toHaveBeenCalled();
  });
});
