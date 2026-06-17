import { Platform } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

const ANDROID_MIN_BOTTOM = 12;

/** Padding inferior seguro para contenido scroll (listas, detalle). */
export function getContentBottomPadding(insets: EdgeInsets, extra = 24): number {
  return extra + Math.max(insets.bottom, Platform.OS === 'android' ? ANDROID_MIN_BOTTOM : 0);
}

/** Inset inferior para la tab bar con botones de navegación de Android. */
export function getTabBarBottomInset(insets: EdgeInsets): number {
  return Math.max(insets.bottom, Platform.OS === 'android' ? ANDROID_MIN_BOTTOM : 8);
}

/** Altura total de la tab bar (iconos + label + safe area). */
export function getTabBarHeight(bottomInset: number): number {
  return 56 + bottomInset;
}
