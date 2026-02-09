import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'card';
}

export function ThemedView({ style, variant = 'default', ...props }: ThemedViewProps) {
  const theme = useTheme();

  const bgColor =
    variant === 'secondary'
      ? theme.backgroundSecondary
      : variant === 'card'
      ? theme.card
      : theme.background;

  return <View style={[{ backgroundColor: bgColor }, style]} {...props} />;
}