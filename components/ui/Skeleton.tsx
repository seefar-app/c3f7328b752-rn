import React, { useRef, useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.backgroundTertiary,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <Animated.View
      style={{
        width: 170,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <Skeleton width={170} height={170} borderRadius={16} />
      <Animated.View style={{ padding: 10, gap: 6 }}>
        <Skeleton width={120} height={14} />
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={16} />
      </Animated.View>
    </Animated.View>
  );
}