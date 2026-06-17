/** Errores devueltos por la API (Axios / PokeAPI). */
export const API_ERROR_MESSAGES = {
  NOT_FOUND: 'Pokémon no encontrado.',
  SERVER_ERROR: 'El servidor de Pokémon no está disponible. Intenta más tarde.',
  TIMEOUT: 'La solicitud tardó demasiado. Verifica tu conexión.',
  NO_CONNECTION: 'Sin conexión a internet. Mostrando datos guardados localmente.',
  UNKNOWN: 'Error inesperado al conectar con la API.',
} as const;

/** Errores de la app (hooks, pantallas, storage). */
export const APP_ERROR_MESSAGES = {
  LIST_LOAD_FAILED: 'Error al cargar la lista de Pokémon.',
  DETAIL_LOAD_FAILED: 'Error al cargar el detalle del Pokémon.',
  DETAIL_UNAVAILABLE: 'Pokémon no disponible.',
  OFFLINE_NO_CACHE: 'Sin conexión y no hay datos guardados localmente.',
  OFFLINE_DETAIL_UNAVAILABLE: 'Sin conexión. Este Pokémon no está disponible offline.',
  INVALID_POKEMON_URL: 'URL de Pokémon inválida.',
} as const;

/** Fragmentos reutilizables para mensajes compuestos. */
export const ERROR_SUFFIXES = {
  SHOWING_CACHED_LIST: 'Mostrando última lista guardada.',
} as const;

export type ApiErrorMessage = (typeof API_ERROR_MESSAGES)[keyof typeof API_ERROR_MESSAGES];
export type AppErrorMessage = (typeof APP_ERROR_MESSAGES)[keyof typeof APP_ERROR_MESSAGES];
