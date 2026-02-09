import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  showStatus?: boolean;
  statusColor?: string;
  style?: ViewStyle;
}

export function Avatar({
  uri,
  name,
  size = 44,
  showStatus = false,
  statusColor,
  style,
}: AvatarProps) {
  const theme = useTheme();
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const dotSize = size * 0.28;

  return (
    <View style={[{ width: size, height: size, position: 'relative' }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: size * 0.36, fontWeight: '700' }}>
            {initials}
          </Text>
        </View>
      )}
      {showStatus && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: statusColor || theme.success,
            borderWidth: 2,
            borderColor: theme.card,
          }}
        />
      )}
    </View>
  );
}