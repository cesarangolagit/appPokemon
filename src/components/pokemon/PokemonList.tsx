import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState, type EmptyStateVariant } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { PokemonCardSkeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/context/ThemeContext';
import { getContentBottomPadding } from '@/utils/safeArea';
import type { ThemeColors } from '@/constants/theme';
import type { PokemonListItem } from '@/types/pokemon';
import type { PokemonViewMode } from '@/types/viewMode';

interface PokemonListContextValue {
  testID?: string;
}

const PokemonListContext = createContext<PokemonListContextValue | null>(null);

function usePokemonListContext() {
  const context = useContext(PokemonListContext);
  if (!context) {
    throw new Error('PokemonList.* debe usarse dentro de PokemonList');
  }
  return context;
}

interface PokemonListRootProps {
  testID?: string;
  children: ReactNode;
}

function Root({ testID = 'pokemon-list', children }: PokemonListRootProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <PokemonListContext.Provider value={{ testID }}>
      <View style={styles.root} testID={testID}>
        {children}
      </View>
    </PokemonListContext.Provider>
  );
}

interface ContentProps {
  data: PokemonListItem[];
  renderItem: ListRenderItem<PokemonListItem>;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onEndReached: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  ListHeaderComponent?: ReactNode;
  viewMode?: PokemonViewMode;
}

function Content({
  data,
  renderItem,
  isInitialLoading,
  isLoadingMore,
  hasMore,
  onEndReached,
  onRefresh,
  isRefreshing = false,
  ListHeaderComponent,
  viewMode = 'grid',
}: ContentProps) {
  const { testID } = usePokemonListContext();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isGrid = viewMode === 'grid';
  const listBottomPadding = getContentBottomPadding(insets);

  const keyExtractor = useCallback((item: PokemonListItem) => String(item.id), []);

  const handleEndReached = useCallback(() => {
    if (hasMore) onEndReached();
  }, [hasMore, onEndReached]);

  const listHeader = useMemo(
    () => (ListHeaderComponent ? () => <>{ListHeaderComponent}</> : undefined),
    [ListHeaderComponent]
  );

  const footer = useMemo(
    () => (isLoadingMore ? <Loader testID={`${testID}-footer-loader`} /> : null),
    [isLoadingMore, testID]
  );

  const contentStyle = useMemo(
    () =>
      data.length === 0
        ? styles.emptyContainer
        : isGrid
          ? [styles.listContentGrid, { paddingBottom: listBottomPadding }]
          : [styles.listContentList, { paddingBottom: listBottomPadding }],
    [data.length, isGrid, listBottomPadding, styles]
  );

  if (isInitialLoading) {
    return (
      <View
        testID={`${testID}-skeleton`}
        style={[
          isGrid ? styles.skeletonGrid : styles.skeletonList,
          { paddingBottom: listBottomPadding },
        ]}
      >
        {ListHeaderComponent}
        {Array.from({ length: isGrid ? 6 : 4 }).map((_, index) => (
          <PokemonCardSkeleton key={index} variant={viewMode} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      key={viewMode}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={isGrid ? 2 : 1}
      columnWrapperStyle={isGrid ? styles.columnWrapper : undefined}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={listHeader}
      ListFooterComponent={footer}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        ) : undefined
      }
      contentContainerStyle={contentStyle}
      initialNumToRender={isGrid ? 8 : 10}
      maxToRenderPerBatch={isGrid ? 6 : 8}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      removeClippedSubviews={Platform.OS === 'android'}
      testID={`${testID}-flatlist`}
    />
  );
}

function Error({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <ErrorMessage message={message} onRetry={onRetry} />;
}

function Empty({
  title,
  description,
  variant,
}: {
  title: string;
  description?: string;
  variant?: EmptyStateVariant;
}) {
  return <EmptyState title={title} description={description} variant={variant} />;
}

function OfflineBanner({ visible }: { visible: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!visible) return null;

  return (
    <View style={styles.offlineBanner} testID="offline-banner">
      <Text style={styles.offlineText}>Modo offline: mostrando datos guardados localmente.</Text>
    </View>
  );
}

export const PokemonList = Object.assign(Root, {
  Content,
  Error,
  Empty,
  OfflineBanner,
});

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContentGrid: {
      paddingTop: 8,
      paddingHorizontal: Platform.OS === 'android' ? 12 : 10,
    },
    listContentList: {
      paddingTop: 8,
      paddingHorizontal: 4,
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    skeletonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
      justifyContent: 'space-between',
    },
    skeletonList: {
      paddingTop: 8,
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    offlineBanner: {
      backgroundColor: colors.offline,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    offlineText: {
      color: colors.onPrimary,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
