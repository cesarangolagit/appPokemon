import { render, fireEvent } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import { SearchProvider, useSearch } from '@/context/SearchContext';
import { ViewModeProvider, useViewMode } from '@/context/ViewModeContext';

function SearchConsumer() {
  const { query, setQuery, clearQuery } = useSearch();
  return (
    <>
      <Text testID="query">{query}</Text>
      <Pressable testID="set-query" onPress={() => setQuery('char')}>
        <Text>set</Text>
      </Pressable>
      <Pressable testID="clear-query" onPress={clearQuery}>
        <Text>clear</Text>
      </Pressable>
    </>
  );
}

function ViewModeConsumer() {
  const { viewMode, toggleViewMode, setViewMode } = useViewMode();
  return (
    <>
      <Text testID="mode">{viewMode}</Text>
      <Pressable testID="toggle-mode" onPress={toggleViewMode}>
        <Text>toggle</Text>
      </Pressable>
      <Pressable testID="set-list" onPress={() => setViewMode('list')}>
        <Text>list</Text>
      </Pressable>
    </>
  );
}

describe('SearchContext', () => {
  it('updates and clears search query', () => {
    const { getByTestId } = render(
      <SearchProvider>
        <SearchConsumer />
      </SearchProvider>
    );

    expect(getByTestId('query').props.children).toBe('');

    fireEvent.press(getByTestId('set-query'));
    expect(getByTestId('query').props.children).toBe('char');

    fireEvent.press(getByTestId('clear-query'));
    expect(getByTestId('query').props.children).toBe('');
  });
});

describe('ViewModeContext', () => {
  it('toggles between grid and list', () => {
    const { getByTestId } = render(
      <ViewModeProvider>
        <ViewModeConsumer />
      </ViewModeProvider>
    );

    expect(getByTestId('mode').props.children).toBe('grid');

    fireEvent.press(getByTestId('toggle-mode'));
    expect(getByTestId('mode').props.children).toBe('list');

    fireEvent.press(getByTestId('set-list'));
    expect(getByTestId('mode').props.children).toBe('list');
  });
});
