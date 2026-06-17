export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  skeleton: string;
  offline: string;
  favorite: string;
  favoriteBg: string;
  onPrimary: string;
  tabBar: string;
  shadow: string;
  searchInput: string;
  toggleInactive: string;
}

export const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const cardAccentPalette = Object.values(typeColors);

export const lightColors: ThemeColors = {
  primary: '#EF5350',
  primaryDark: '#C62828',
  background: '#F8F9FC',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#D32F2F',
  success: '#388E3C',
  skeleton: '#E8ECF4',
  offline: '#FF9800',
  favorite: '#FFB300',
  favoriteBg: '#FFF8E1',
  onPrimary: '#FFFFFF',
  tabBar: '#FFFFFF',
  shadow: '#1A1A2E',
  searchInput: '#FFFFFF',
  toggleInactive: '#FFFFFF',
};

export const darkColors: ThemeColors = {
  primary: '#FF6B6B',
  primaryDark: '#EF5350',
  background: '#0F1218',
  surface: '#1A1F2B',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  border: '#2D3548',
  error: '#EF5350',
  success: '#66BB6A',
  skeleton: '#2A3142',
  offline: '#FFB74D',
  favorite: '#FFC107',
  favoriteBg: '#3D3520',
  onPrimary: '#FFFFFF',
  tabBar: '#1A1F2B',
  shadow: '#000000',
  searchInput: '#FFFFFF',
  toggleInactive: '#FFFFFF',
};

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? darkColors : lightColors;
}

/** @deprecated Use useTheme() instead */
export const colors = lightColors;

export const PAGE_SIZE = 20;
