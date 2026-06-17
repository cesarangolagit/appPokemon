import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeColors } from '@/constants/theme';

interface HeaderSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
}

export function HeaderSearch({
  value,
  onChangeText,
  placeholder = 'Buscar Pokémon...',
  testID = 'header-search',
}: HeaderSearchProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container} testID={testID}>
      <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        testID={`${testID}-input`}
        accessibilityLabel="Buscar Pokémon por nombre"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={8}
          style={styles.clearButton}
          testID={`${testID}-clear`}
          accessibilityLabel="Limpiar búsqueda"
        >
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.searchInput,
      borderRadius: 14,
      paddingHorizontal: 14,
      minHeight: 48,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 17,
      fontWeight: '500',
      color: colors.text,
      paddingVertical: 10,
    },
    clearButton: {
      marginLeft: 8,
      padding: 2,
    },
  });
}
