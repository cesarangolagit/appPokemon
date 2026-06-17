import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeColors } from '@/constants/theme';

interface SearchBarContextValue {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  testID?: string;
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null);

function useSearchBarContext() {
  const context = useContext(SearchBarContext);
  if (!context) {
    throw new Error('SearchBar.* debe usarse dentro de SearchBar');
  }
  return context;
}

interface SearchBarRootProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
  children: ReactNode;
}

function Root({
  value,
  onChangeText,
  placeholder = 'Buscar Pokémon...',
  testID = 'search-bar',
  children,
}: SearchBarRootProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SearchBarContext.Provider value={{ value, onChangeText, placeholder, testID }}>
      <View style={styles.container} testID={testID}>
        {children}
      </View>
    </SearchBarContext.Provider>
  );
}

function Input() {
  const { value, onChangeText, placeholder, testID } = useSearchBarContext();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      autoCapitalize="none"
      autoCorrect={false}
      testID={`${testID}-input`}
      accessibilityLabel="Buscar Pokémon por nombre"
    />
  );
}

export const SearchBar = Object.assign(Root, {
  Input,
});

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
  });
}
