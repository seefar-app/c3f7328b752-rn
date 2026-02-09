import React, { useRef, useEffect } from 'react';
import { Pressable, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface AddToCartButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AddToCartButton({ onPress, disabled = false, loading = false }: AddToCartButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={{
          height: 50,
          borderRadius: 14,
          overflow: 'hidden',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <LinearGradient
          colors={['#f97316', '#ef4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? (
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
              Ajout en cours...
            </Text>
          ) : (
            <>
              <Ionicons name="cart" size={22} color="#fff" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
                Ajouter au panier
              </Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}