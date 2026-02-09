import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles: Record<string, { height: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
    sm: { height: 36, paddingHorizontal: 14, fontSize: 13, iconSize: 16 },
    md: { height: 48, paddingHorizontal: 20, fontSize: 15, iconSize: 18 },
    lg: { height: 56, paddingHorizontal: 24, fontSize: 17, iconSize: 20 },
  };

  const s = sizeStyles[size];

  const variants: Record<string, { bg: string; text: string; border: string }> = {
    primary: { bg: theme.primary, text: '#ffffff', border: 'transparent' },
    secondary: { bg: theme.secondary, text: '#ffffff', border: 'transparent' },
    outline: { bg: 'transparent', text: theme.primary, border: theme.primary },
    ghost: { bg: 'transparent', text: theme.primary, border: 'transparent' },
    destructive: { bg: theme.error, text: '#ffffff', border: 'transparent' },
  };

  const v = variants[variant];
  const opacity = disabled ? 0.5 : 1;

  const containerStyle: ViewStyle = {
    height: s.height,
    paddingHorizontal: s.paddingHorizontal,
    backgroundColor: v.bg,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: variant === 'outline' ? 1.5 : 0,
    borderColor: v.border,
    opacity,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    gap: 8,
  };

  const textStyle: TextStyle = {
    fontSize: s.fontSize,
    fontWeight: '600',
    color: v.text,
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        style={containerStyle}
      >
        {loading ? (
          <ActivityIndicator size="small" color={v.text} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons name={icon} size={s.iconSize} color={v.text} />
            )}
            <Text style={textStyle}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Ionicons name={icon} size={s.iconSize} color={v.text} />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}