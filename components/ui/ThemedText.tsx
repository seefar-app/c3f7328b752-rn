import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ThemedTextProps extends TextProps {
  variant?: 'default' | 'secondary' | 'tertiary' | 'heading' | 'label';
}

export function ThemedText({ style, variant = 'default', ...props }: ThemedTextProps) {
  const theme = useTheme();

  const textStyles: Record<string, any> = {
    default: { color: theme.text, fontSize: 16 },
    secondary: { color: theme.textSecondary, fontSize: 14 },
    tertiary: { color: theme.textTertiary, fontSize: 12 },
    heading: { color: theme.text, fontSize: 24, fontWeight: '700' as const },
    label: {
      color: theme.textTertiary,
      fontSize: 11,
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    },
  };

  return <Text style={[textStyles[variant], style]} {...props} />;
}