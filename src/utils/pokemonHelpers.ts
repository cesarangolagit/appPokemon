import { cardAccentPalette } from '@/constants/theme';

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatStatName(name: string): string {
  return capitalize(name.replace('-', ' '));
}

export function formatHeight(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1)} m`;
}

export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

export function filterPokemonByName<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => item.name.toLowerCase().includes(normalized));
}

export function getPokemonArtwork(detail: {
  sprites: { other: { 'official-artwork': { front_default: string | null } } };
}): string | null {
  return detail.sprites.other['official-artwork'].front_default;
}

export function getCardAccentColor(id: number): string {
  return cardAccentPalette[id % cardAccentPalette.length] ?? '#6890F0';
}

/** Color de texto legible sobre fondo claro cuando el acento es muy claro (ej. electric). */
export function getAccentLabelColor(accent: string, colors: { textSecondary: string }): string {
  const hex = accent.replace('#', '');
  if (hex.length !== 6) return colors.textSecondary;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.62 ? colors.textSecondary : accent;
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
