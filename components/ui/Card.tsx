import React, { useRef } from 'react';
import { Pressable, Animated, ViewStyle, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export function Card({ children, onPress, style, variant = 'default', padding = 16 }: CardProps) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    }
  };

  const baseStyle: ViewStyle = {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding,
    ...(variant === 'elevated'
      ? {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }
      : variant === 'outlined'
      ? { borderWidth: 1, borderColor: theme.border }
      : {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }),
  };

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          style={[baseStyle, style]}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={[baseStyle, style]}>{children}</View>;
}