import { render, fireEvent } from '@testing-library/react-native';
import { PokemonList } from '@/components/pokemon/PokemonList';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { mockListItem } from '@/test-utils/mockData';

describe('PokemonList compound component', () => {
  it('shows skeletons during initial loading', () => {
    const { getByTestId } = render(
      <PokemonList>
        <PokemonList.Content
          data={[]}
          renderItem={() => null}
          isInitialLoading
          isLoadingMore={false}
          hasMore={false}
          onEndReached={() => undefined}
          viewMode="grid"
        />
      </PokemonList>
    );

    expect(getByTestId('pokemon-list-skeleton')).toBeTruthy();
  });

  it('shows footer loader when loading more', () => {
    const item = mockListItem();
    const { getByTestId } = render(
      <PokemonList>
        <PokemonList.Content
          data={[item]}
          renderItem={({ item: pokemon }) => (
            <PokemonCard pokemon={pokemon}>
              <PokemonCard.Content>
                <PokemonCard.Name />
              </PokemonCard.Content>
            </PokemonCard>
          )}
          isInitialLoading={false}
          isLoadingMore
          hasMore
          onEndReached={() => undefined}
          viewMode="list"
        />
      </PokemonList>
    );

    expect(getByTestId('pokemon-list-footer-loader')).toBeTruthy();
    expect(getByTestId('pokemon-list-flatlist')).toBeTruthy();
  });

  it('shows empty state component', () => {
    const { getByText, getByTestId } = render(
      <PokemonList>
        <PokemonList.Empty
          title="Sin resultados"
          description="No hay coincidencias."
          variant="search"
        />
      </PokemonList>
    );

    expect(getByTestId('empty-state')).toBeTruthy();
    expect(getByText('Sin resultados')).toBeTruthy();
  });

  it('shows error message with retry', () => {
    const onRetry = jest.fn();
    const { getByText, getByTestId } = render(
      <PokemonList>
        <PokemonList.Error message="Error de red" onRetry={onRetry} />
      </PokemonList>
    );

    expect(getByText('Error de red')).toBeTruthy();
    fireEvent.press(getByTestId('error-retry-button'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows offline banner when visible', () => {
    const { getByTestId, getByText } = render(
      <PokemonList>
        <PokemonList.OfflineBanner visible />
      </PokemonList>
    );

    expect(getByTestId('offline-banner')).toBeTruthy();
    expect(getByText(/Modo offline/i)).toBeTruthy();
  });
});
