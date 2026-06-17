import '@testing-library/jest-native/extend-expect';

jest.mock('@/context/ThemeContext', () => {
  const { lightColors } = require('@/constants/theme');
  return {
    useTheme: () => ({
      mode: 'light',
      colors: lightColors,
      isDark: false,
      setMode: jest.fn(),
      toggleTheme: jest.fn(),
      isReady: true,
    }),
  };
});

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => inset,
    initialWindowMetrics: { insets: inset, frame: { x: 0, y: 0, width: 390, height: 844 } },
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    })
  ),
}));

jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Image: ({
      testID,
      accessibilityLabel,
      onLoad,
      onLoadStart,
      onError,
      ...rest
    }: {
      testID?: string;
      accessibilityLabel?: string;
      onLoad?: () => void;
      onLoadStart?: () => void;
      onError?: () => void;
    }) => {
      React.useEffect(() => {
        onLoadStart?.();
        onLoad?.();
      }, [onLoad, onLoadStart]);

      return React.createElement(View, {
        testID: testID ?? 'expo-image',
        accessibilityLabel,
        ...rest,
      });
    },
  };
});
