import { memo, useCallback } from 'react';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import type { PokemonListItem } from '@/types/pokemon';
import type { PokemonViewMode } from '@/types/viewMode';

interface PokemonListItemRowProps {
  item: PokemonListItem;
  viewMode: PokemonViewMode;
  isFavorite: boolean;
  onPress: (id: number, name: string) => void;
  onToggleFavorite: (id: number) => void;
}

function PokemonListItemRowComponent({
  item,
  viewMode,
  isFavorite,
  onPress,
  onToggleFavorite,
}: PokemonListItemRowProps) {
  const handlePress = useCallback(() => {
    onPress(item.id, item.name);
  }, [item.id, item.name, onPress]);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(item.id);
  }, [item.id, onToggleFavorite]);

  return (
    <PokemonCard
      pokemon={item}
      variant={viewMode}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      onPress={handlePress}
    >
      <PokemonCard.Image />
      <PokemonCard.Content>
        <PokemonCard.Name />
        <PokemonCard.Id />
      </PokemonCard.Content>
      <PokemonCard.FavoriteButton />
    </PokemonCard>
  );
}

function arePropsEqual(prev: PokemonListItemRowProps, next: PokemonListItemRowProps): boolean {
  return (
    prev.item.id === next.item.id &&
    prev.item.name === next.item.name &&
    prev.item.imageUrl === next.item.imageUrl &&
    prev.viewMode === next.viewMode &&
    prev.isFavorite === next.isFavorite &&
    prev.onPress === next.onPress &&
    prev.onToggleFavorite === next.onToggleFavorite
  );
}

export const PokemonListItemRow = memo(PokemonListItemRowComponent, arePropsEqual);
