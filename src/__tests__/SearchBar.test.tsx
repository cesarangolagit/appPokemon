import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '@/components/search/SearchBar';

describe('SearchBar compound component', () => {
  it('renders input and propagates text changes', () => {
    const onChangeText = jest.fn();

    const { getByTestId } = render(
      <SearchBar value="" onChangeText={onChangeText}>
        <SearchBar.Input />
      </SearchBar>
    );

    fireEvent.changeText(getByTestId('search-bar-input'), 'char');
    expect(onChangeText).toHaveBeenCalledWith('char');
  });
});
