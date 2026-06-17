import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FavoritesHeader } from '@/components/navigation/FavoritesHeader';
import { DetailScreenHeader } from '@/components/navigation/DetailScreenHeader';
import { PokemonListHeader } from '@/components/navigation/PokemonListHeader';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { PokemonDetailScreen } from '@/screens/PokemonDetailScreen';
import { PokemonListScreen } from '@/screens/PokemonListScreen';
import { useTheme } from '@/context/ThemeContext';
import { getTabBarBottomInset, getTabBarHeight } from '@/utils/safeArea';
import type { ThemeColors } from '@/constants/theme';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = getTabBarBottomInset(insets);
  const tabStyles = useMemo(
    () => createTabStyles(colors, bottomInset),
    [colors, bottomInset]
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: tabStyles.tabBar,
        tabBarLabelStyle: tabStyles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="PokemonList"
        component={PokemonListScreen}
        options={{
          header: () => <PokemonListHeader />,
          tabBarLabel: 'Lista',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="pokeball" activeIcon="pokeball" />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          header: () => <FavoritesHeader />,
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="heart-outline"
              activeIcon="heart"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationShell() {
  const { colors, isDark } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: colors.onPrimary,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={({ route }) => ({
            title: route.params.name,
            header: (props) => <DetailScreenHeader {...props} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function RootNavigator() {
  return <NavigationShell />;
}

function createTabStyles(colors: ThemeColors, bottomInset: number) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: colors.tabBar,
      borderTopColor: colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: 8,
      paddingBottom: bottomInset,
      height: getTabBarHeight(bottomInset),
    },
    tabBarLabel: {
      fontSize: 12,
      fontWeight: '700',
      marginTop: 4,
      marginBottom: Platform.OS === 'android' ? 2 : 0,
    },
  });
}
