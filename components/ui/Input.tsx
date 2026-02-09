import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, TextInputProps, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.error
    : focused
    ? theme.primary
    : theme.border;

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: theme.textSecondary,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.backgroundSecondary,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor,
          paddingHorizontal: 14,
          height: 52,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? theme.primary : theme.icon}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: theme.text,
          }}
          placeholderTextColor={theme.textTertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress}>
            <Ionicons name={rightIcon} size={20} color={theme.icon} />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={{ fontSize: 12, color: theme.error, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
}