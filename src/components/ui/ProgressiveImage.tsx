import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeColors } from '@/constants/theme';

type ImageVariant = 'card' | 'detail';

interface ProgressiveImageProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
  testID?: string;
  accessibilityLabel?: string;
  variant?: ImageVariant;
}

const CARD_PADDING = 10;
const DETAIL_PADDING = 16;

export function ProgressiveImage({
  uri,
  style,
  testID,
  accessibilityLabel,
  variant = 'card',
}: ProgressiveImageProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, variant), [colors, variant]);
  const [isLoading, setIsLoading] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(variant === 'detail' ? 0.8 : 0.85)).current;

  useEffect(() => {
    opacity.setValue(0);
    scale.setValue(variant === 'detail' ? 0.8 : 0.85);
    setIsLoading(true);
  }, [uri, variant, opacity, scale]);

  const handleLoad = () => {
    setIsLoading(false);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: variant === 'detail' ? 500 : 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: variant === 'detail' ? 0.95 : 0.92,
        friction: variant === 'detail' ? 6 : 7,
        tension: variant === 'detail' ? 50 : 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
    >
      {isLoading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}
      <Animated.View
        style={[
          styles.imageFrame,
          { opacity, transform: [{ scale }] },
        ]}
      >
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="contain"
          contentPosition="center"
          transition={200}
          cachePolicy="memory-disk"
          accessibilityLabel={accessibilityLabel}
          onLoadStart={() => setIsLoading(true)}
          onLoad={handleLoad}
          onError={() => setIsLoading(false)}
        />
      </Animated.View>
    </View>
  );
}

function createStyles(colors: ThemeColors, variant: ImageVariant) {
  const padding = variant === 'card' ? CARD_PADDING : DETAIL_PADDING;

  return StyleSheet.create({
    container: {
      overflow: 'visible',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageFrame: {
      width: '100%',
      height: '100%',
      padding,
      overflow: 'visible',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
}
