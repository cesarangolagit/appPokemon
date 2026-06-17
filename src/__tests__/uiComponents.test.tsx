import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { PokemonCardSkeleton, PokemonDetailSkeleton } from '@/components/ui/Skeleton';
import { PokemonQuickSplash } from '@/components/splash/PokemonQuickSplash';

describe('UI feedback components', () => {
  it('shows empty state message', () => {
    const { getByTestId, getByText } = render(
      <EmptyState title="Sin resultados" description="No hay coincidencias." variant="search" />
    );

    expect(getByTestId('empty-state')).toBeTruthy();
    expect(getByText('Sin resultados')).toBeTruthy();
    expect(getByText('No hay coincidencias.')).toBeTruthy();
  });

  it('shows favorites empty variant', () => {
    const { getByText } = render(
      <EmptyState
        title="No tienes favoritos"
        description="Marca Pokémon con la estrella."
        variant="favorites"
      />
    );

    expect(getByText('No tienes favoritos')).toBeTruthy();
  });

  it('shows retry action on error', () => {
    const onRetry = jest.fn();
    const { getByTestId } = render(
      <ErrorMessage message="Error de red" onRetry={onRetry} />
    );

    fireEvent.press(getByTestId('error-retry-button'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders loader indicator', () => {
    const { getByTestId } = render(<Loader testID="custom-loader" />);
    expect(getByTestId('custom-loader')).toBeTruthy();
  });

  it('renders card and detail skeletons', () => {
    const { toJSON: gridJson } = render(<PokemonCardSkeleton variant="grid" />);
    const { toJSON: listJson } = render(<PokemonCardSkeleton variant="list" />);
    const { toJSON: detailJson } = render(<PokemonDetailSkeleton />);

    expect(gridJson()).toBeTruthy();
    expect(listJson()).toBeTruthy();
    expect(detailJson()).toBeTruthy();
  });

  it('renders progressive image', () => {
    const { getByTestId } = render(
      <ProgressiveImage uri="https://example.com/pikachu.png" testID="progressive-image" />
    );

    expect(getByTestId('progressive-image')).toBeTruthy();
  });

  it('renders quick splash overlay', () => {
    const { getByTestId, getByText } = render(
      <PokemonQuickSplash
        name="pikachu"
        imageUrl="https://example.com/pikachu.png"
        visible
      />
    );

    expect(getByTestId('pokemon-quick-splash')).toBeTruthy();
    expect(getByText('Pikachu')).toBeTruthy();
  });
});
