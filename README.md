# Pokédex

Aplicación móvil de Pokédex construida con **Expo SDK 54**, **React Native**, **React Navigation v6**, **Axios** y **Compound Pattern**. Consume la [PokeAPI](https://pokeapi.co/) e incluye **búsqueda en tiempo real**, **vista grid y lista**, **modo oscuro**, **animaciones**, favoritos, modo offline y detalle completo de cada Pokémon.

---

## Tabla de contenidos

- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Cómo ejecutar la app](#cómo-ejecutar-la-app)
- [Scripts disponibles](#scripts-disponibles)
- [Funcionalidades de la app](#funcionalidades-de-la-app)
- [Qué probar en la app](#qué-probar-en-la-app)
- [Implementación técnica](#implementación-técnica)
- [Stack técnico](#stack-técnico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Testing](#testing)
- [Persistencia offline](#persistencia-offline)
- [Solución de problemas](#solución-de-problemas)
- [Decisiones técnicas](#decisiones-técnicas)

---

## Requisitos previos

Antes de clonar el repo, asegúrate de tener instalado:

| Herramienta | Versión recomendada | Para qué sirve |
|---|---|---|
| **Node.js** | 18 LTS o superior (20+ recomendado) | Runtime de JavaScript |
| **npm** | 9+ (incluido con Node) | Gestor de dependencias |
| **Git** | Cualquier versión reciente | Clonar el repositorio |

### Para probar en dispositivo físico (recomendado)

- Instala **[Expo Go](https://expo.dev/go)** en tu iPhone o Android.
- Tu computadora y el teléfono deben estar en la **misma red Wi‑Fi**.

### Para emuladores (opcional)

| Plataforma | Requisito extra |
|---|---|
| **iOS** (solo macOS) | Xcode + Simulador iOS |
| **Android** | Android Studio + emulador configurado |
| **Web** | Navegador moderno (Chrome, Firefox, Safari) |

> No necesitas cuenta de Expo ni variables de entorno. La app usa la PokeAPI pública.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPO>
cd appPokemon
```

### 2. Instalar dependencias

```bash
npm install
```

Este paso descarga Expo, React Native, React Navigation, Axios y el resto de paquetes definidos en `package.json`.

### 3. Verificar que TypeScript compila (opcional)

```bash
npm run lint
```

Si no hay errores, el proyecto está listo para ejecutarse.

---

## Cómo ejecutar la app

### Opción A — Expo Go en tu teléfono (más rápida)

```bash
npm start
```

Se abrirá **Expo Dev Tools** en la terminal y, en muchos entornos, también en el navegador.

1. Escanea el **código QR** con la cámara (iOS) o con la app **Expo Go** (Android).
2. Espera a que cargue el bundle.
3. Verás el splash con Pikachu y luego la Pokédex.

Atajos útiles en la terminal de Expo:

| Tecla | Acción |
|---|---|
| `i` | Abrir simulador iOS (macOS + Xcode) |
| `a` | Abrir emulador Android |
| `w` | Abrir versión web |
| `r` | Recargar la app |
| `m` | Menú de desarrollo |

### Opción B — Simulador iOS (macOS)

```bash
npm run ios
```

Equivalente a `expo start --ios`. Requiere Xcode instalado.

### Opción C — Emulador Android

```bash
npm run android
```

Equivalente a `expo start --android`. Requiere Android Studio con un AVD creado.

### Opción D — Navegador web

```bash
npm run web
```

Útil para revisar layout y flujos básicos. Algunas animaciones nativas pueden verse distinto que en móvil.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run ios` | Inicia Expo y abre simulador iOS |
| `npm run android` | Inicia Expo y abre emulador Android |
| `npm run web` | Inicia Expo en el navegador |
| `npm test` | Ejecuta la suite de tests (Jest) |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | Verificación de tipos con TypeScript (`tsc --noEmit`) |

---

## Funcionalidades de la app

Resumen de lo que incluye la Pokédex y cómo usarlo desde la interfaz.

### Listado de Pokémon (dos vistas)

En la pestaña **Lista**, puedes ver los Pokémon de **dos formas**:

| Vista | Icono en el header | Descripción |
|---|---|---|
| **Cuadrícula (grid)** | ⊞ Cuadrícula | Dos columnas con cards compactas: imagen, nombre y favorito |
| **Lista (list)** | ☰ Lista | Una fila por Pokémon: imagen, nombre, número e icono de favorito |

**Cómo cambiar de vista**

1. Abre la pestaña **Lista** (icono de Pokéball abajo).
2. En el header rojo, a la derecha del buscador, verás el toggle con **dos botones**.
3. Toca el icono de **cuadrícula** para grid o el de **lista** para listado.
4. La preferencia se mantiene al cambiar de pestaña (Favoritos usa la misma vista).

También funciona en la pestaña **Favoritos**.

### Búsqueda en tiempo real

- El **buscador** está integrado en el header de la pestaña Lista.
- Escribe el nombre de un Pokémon (ej: `pika`, `char`, `bulba`).
- Los resultados se **filtran al instante** sobre la lista ya cargada.
- Si no hay coincidencias, verás el estado vacío **"Sin resultados"** con icono de lupa.
- Borra el texto con la **X** del campo para volver a ver toda la lista.

> La búsqueda filtra localmente. Para cargar más Pokémon de la API, deja el buscador vacío y haz scroll hacia abajo (infinite scroll).

### Modo oscuro / claro

- En el header (esquina superior derecha) hay un botón con icono de **luna** (modo claro) o **sol** (modo oscuro).
- Toca para alternar entre **tema claro** y **tema oscuro**.
- La preferencia se **guarda automáticamente** y se restaura al reabrir la app.

### Animaciones

| Dónde | Qué hace |
|---|---|
| **Splash inicial** | Al abrir la app: Pikachu con animación de entrada y texto "Cargando..." (~1.8 s) |
| **Splash al abrir detalle** | Al tocar un Pokémon: overlay rápido con su imagen y nombre (~550 ms) |
| **Imágenes** | Carga progresiva: placeholder → fade-in + scale (`ProgressiveImage`) |
| **Cards** | Efecto spring al presionar (scale suave) |
| **Detalle — scroll** | La imagen del hero se **colapsa, encoge y desvanece** al bajar por stats e info |
| **Skeletons** | Pulso animado mientras cargan lista y detalle |

### Detalle de Pokémon

- Toca cualquier card para ver: imagen oficial, tipos, estadísticas, habilidades, altura y peso.
- Botón **Agregar / Quitar de favoritos** al final.
- Flecha **atrás** en el header para volver al listado.

### Favoritos

- Toca la **estrella** en cualquier card para guardar el Pokémon.
- Pestaña **Favoritos** (icono de corazón) con todos los guardados.
- Persistencia local: siguen ahí al cerrar la app.

### Modo offline

- Si pierdes conexión, la app muestra un **banner naranja** y la última lista cacheada.
- Los favoritos guardados siguen disponibles en detalle sin internet.

### Otras funcionalidades

- **Infinite scroll** — desliza hacia abajo para cargar más Pokémon desde PokeAPI.
- **Pull to refresh** — arrastra hacia abajo en la lista para recargar.
- **Estados de UI** — skeletons al cargar, loaders al paginar, mensajes de error y estados vacíos.
- **Safe area** — headers y tab bar adaptados a notch, cámara frontal y botones de navegación en Android.

---

## Qué probar en la app

Guía rápida para quien revisa el repositorio:

### Checklist de prueba

1. **Vista grid** → toggle cuadrícula en header → scroll infinito.
2. **Vista lista** → toggle lista → revisar cards horizontales.
3. **Búsqueda** → escribe `pika` → comprueba filtrado y estado vacío con `zzz`.
4. **Tema** → cambia claro/oscuro → cierra y reabre la app.
5. **Detalle** → abre un Pokémon → observa splash rápido y colapso de imagen al scroll.
6. **Favoritos** → marca 2–3 Pokémon → pestaña Favoritos → quita uno.
7. **Offline** → carga la lista con Wi‑Fi → modo avión → reabre la app.

### Tab Pokédex
- Scroll infinito con paginación desde PokeAPI.
- Toggle **grid / lista** en el header.
- **Buscador** en tiempo real por nombre.
- Tap en un Pokémon → splash rápido → pantalla de detalle.
- Botón de **favorito** (corazón) en cada card.

### Tab Favoritos
- Lista de Pokémon marcados como favoritos.
- Persistencia: cierra y vuelve a abrir la app; los favoritos siguen ahí.

### Detalle de Pokémon
- Imagen oficial, tipos, stats, habilidades, altura y peso.
- Agregar / quitar de favoritos.
- Animación de carga progresiva en imágenes.

### Modo offline
1. Abre la app con internet y deja que cargue la lista.
2. Activa modo avión o desconecta Wi‑Fi/datos.
3. Vuelve a abrir la app: verás banner offline y la última lista cacheada.
4. Los favoritos guardados siguen accesibles en detalle.

### Tema
- Toggle claro / oscuro en el header (persistido en AsyncStorage).

---

## Implementación técnica

Resumen de cómo está construido cada requerimiento en código:

| Requerimiento | Implementación |
|---|---|
| Listado con Infinite Scroll | `FlatList` + paginación con offset en `usePokemonList` |
| Carga progresiva de imágenes | `ProgressiveImage` con `expo-image`, placeholder y fade-in |
| Detalle completo | `PokemonDetailScreen` + `PokemonDetailView` (stats, tipos, habilidades, medidas) |
| Buscador en tiempo real | `SearchBar` compound + filtro local por nombre |
| Favoritos add/remove | `FavoritesContext` + AsyncStorage |
| Listado de favoritos | Tab `Favorites` |
| Offline + persistencia | Cache de lista y favoritos con AsyncStorage + NetInfo |
| UX y errores | Skeletons, loaders, `EmptyState`, `ErrorMessage`, banner offline |
| Animaciones | Splash, `ProgressiveImage`, scroll hero en detalle, spring en cards |
| Modo oscuro | `ThemeContext` + `ThemeToggle` + persistencia AsyncStorage |
| Vistas grid/lista | `ViewModeContext` + `ViewModeToggle` |
| Rendimiento lista | `PokemonListItemRow` memoizado + props FlatList optimizadas |
| Tests | Jest + Testing Library (~70 tests) |

---

## Stack técnico

- **Expo SDK 54** · **React Native 0.81** · **React 19**
- **React Navigation v6** (Native Stack + Bottom Tabs)
- **Axios** → [PokeAPI v2](https://pokeapi.co/api/v2)
- **AsyncStorage** — favoritos, cache de lista, tema
- **NetInfo** — detección de conectividad
- **expo-image** — imágenes con cache en disco
- **Jest + Testing Library** — tests unitarios e integración de UI

---

## Arquitectura del proyecto

```
appPokemon/
├── App.tsx                  # Providers globales + splash inicial
├── app.json                 # Configuración Expo
├── assets/                  # Iconos, splash, imágenes
├── jest.setup.ts            # Mocks globales para tests
└── src/
    ├── api/
    │   ├── axiosClient.ts       # Cliente HTTP + interceptor de errores
    │   ├── mapAxiosError.ts     # Mapeo de errores Axios → mensajes UI
    │   ├── pokeApi.ts           # Servicios fetch (lista, detalle, batch)
    │   └── pokemonMappers.ts    # Transformación URL → PokemonListItem
    ├── components/
    │   ├── compound/            # Utilidad compound pattern
    │   ├── navigation/          # Headers custom (búsqueda, tema, toggle vista)
    │   ├── pokemon/             # PokemonCard, PokemonList, PokemonDetailView
    │   ├── search/              # SearchBar, HeaderSearch
    │   ├── splash/              # Splash inicial y splash rápido en detalle
    │   └── ui/                  # Skeleton, Loader, Error, Empty, ProgressiveImage
    ├── constants/
    │   ├── errorMessages.ts     # Mensajes de error centralizados
    │   ├── pokeApi.ts           # Rutas y URLs de PokeAPI
    │   ├── storageKeys.ts       # Claves AsyncStorage
    │   └── theme.ts             # Paletas claro/oscuro + colores por tipo
    ├── context/                 # Favorites, Search, Theme, ViewMode
    ├── hooks/                   # usePokemonList, usePokemonDetail, useNetworkStatus
    ├── navigation/              # RootNavigator (tabs + stack)
    ├── screens/                 # PokemonList, Favorites, PokemonDetail
    ├── storage/                 # Persistencia local
    ├── test-utils/              # Mocks reutilizables en tests
    ├── types/                   # Tipos TypeScript
    └── utils/                   # Helpers de formato y filtrado
```

### Compound Pattern

Los componentes principales exponen subcomponentes reutilizables:

```tsx
<PokemonCard pokemon={item} onPress={() => navigation.navigate('PokemonDetail', { id, name })}>
  <PokemonCard.Image />
  <PokemonCard.Content>
    <PokemonCard.Name />
    <PokemonCard.Id />
  </PokemonCard.Content>
  <PokemonCard.FavoriteButton />
</PokemonCard>
```

Otros compounds: `SearchBar`, `PokemonList`, `PokemonDetailView`.

---

## Testing

```bash
# Ejecutar todos los tests
npm test

# Modo watch (desarrollo)
npm run test:watch

# Con reporte de cobertura (genera carpeta coverage/)
npm run test:coverage
```

### Cobertura principal

| Área | Archivos de test |
|---|---|
| API y mappers | `pokeApi.test.ts`, `pokemonMappers.test.ts`, `mapAxiosError.test.ts` |
| Hooks | `usePokemonList.test.ts`, `usePokemonDetail.test.ts` |
| Contextos | `FavoritesContext.test.tsx`, `contexts.test.tsx` |
| Componentes UI | `uiComponents.test.tsx`, `PokemonCard.test.tsx`, `PokemonList.test.tsx` |
| Pantallas | `PokemonListScreen.test.tsx`, `FavoritesScreen.test.tsx`, `PokemonDetailScreen.test.tsx` |
| Storage | `pokemonStorage.test.ts` |
| Utils | `pokemonHelpers.test.ts` |

---

## Persistencia offline

| Clave AsyncStorage | Contenido |
|---|---|
| `@pokedex/favorites` | Array de `PokemonDetail` completos |
| `@pokedex/cached_list` | Última lista cargada + offset de paginación |
| `@pokedex/theme` | Preferencia claro / oscuro |

Sin conexión, la app muestra la última lista cacheada, banner informativo y permite consultar favoritos guardados.

---

## Solución de problemas

### `npm install` falla o tarda mucho
- Verifica espacio en disco (se necesitan ~500 MB en `node_modules`).
- Prueba: `rm -rf node_modules package-lock.json && npm install`.

### El QR no carga / "Unable to connect"
- Confirma que PC y teléfono están en la **misma red Wi‑Fi**.
- Desactiva VPN si está activa.
- En Expo Dev Tools, cambia conexión de **LAN** a **Tunnel** (más lento, pero funciona con redes restrictivas).

### Error de versión de Expo Go
- Este proyecto usa **Expo SDK 54**. Actualiza Expo Go desde la App Store / Play Store.

### Simulador iOS no abre
- Instala Xcode desde la Mac App Store.
- Ejecuta una vez: `xcode-select --install`.

### Emulador Android no abre
- Abre Android Studio → Device Manager → crea un Virtual Device.
- Inicia el emulador manualmente y luego ejecuta `npm run android`.

### Tests fallan por Watchman (macOS)
```bash
npm test -- --watchAll=false
```

### TypeScript / lint
```bash
npm run lint
```

---

## Decisiones técnicas

1. **Infinite scroll + filtro local**: la búsqueda filtra sobre la lista ya cargada; la paginación sigue activa solo sin búsqueda activa.
2. **Favoritos con detalle completo**: se persiste `PokemonDetail` para consulta offline en la pantalla de detalle.
3. **Imágenes progresivas**: `expo-image` con transición, cache en disco y loader animado.
4. **Errores centralizados**: mensajes en `constants/errorMessages.ts` + interceptor Axios en `mapAxiosError.ts`.
5. **API modular**: `pokeApi.ts` (fetch), `pokemonMappers.ts` (transformaciones) y `constants/pokeApi.ts` (rutas/URLs).
6. **Splash en detalle**: overlay rápido con el Pokémon seleccionado mientras carga el detalle (~550 ms).
7. **Hero colapsable**: animación de altura, opacidad y parallax al hacer scroll en detalle.
8. **Tema y vista**: preferencias de modo oscuro y grid/lista persistidas en contexto + AsyncStorage.

---

## Licencia

Proyecto personal — Pokédex con React Native y Expo.
