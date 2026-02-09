import React, { useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'flash' | 'horizontal';
  index?: number;
}

export function ProductCard({ product, variant = 'default', index = 0 }: ProductCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const { toggleWishlist } = useStore();

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/product/${product.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Horizontal variant for search results
  if (variant === 'horizontal') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 12 }}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            flexDirection: 'row',
            backgroundColor: theme.card,
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.border,
            padding: 12,
            gap: 12,
          }}
        >
          {/* Image */}
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: product.images[0] }}
              style={{ width: 100, height: 100, borderRadius: 12, backgroundColor: theme.backgroundTertiary }}
              contentFit="cover"
              transition={200}
            />
            {/* Badges */}
            {(variant === 'flash' || discount > 0) && (
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 6,
                  gap: 4,
                }}
              >
                {variant === 'flash' && (
                  <View
                    style={{
                      backgroundColor: '#ef4444',
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      borderRadius: 6,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Ionicons name="flash" size={10} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
                      FLASH
                    </Text>
                  </View>
                )}
                {discount > 0 && (
                  <View
                    style={{
                      backgroundColor: theme.error,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
                      -{discount}%
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Content */}
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: 6,
                }}
              >
                {product.title}
              </Text>

              {/* Rating */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={{ fontSize: 12, fontWeight: '600', color: theme.text }}>
                  {product.rating.toFixed(1)}
                </Text>
                <Text style={{ fontSize: 11, color: theme.textTertiary }}>
                  ({product.reviewCount})
                </Text>
              </View>
            </View>

            {/* Bottom Row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Price */}
              <View>
                <Text style={{ fontSize: 17, fontWeight: '800', color: theme.primary }}>
                  {product.price.toLocaleString()} DA
                </Text>
                {product.originalPrice && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      color: theme.textTertiary,
                      textDecorationLine: 'line-through',
                    }}
                  >
                    {product.originalPrice.toLocaleString()}
                  </Text>
                )}
              </View>

              {/* Favorite Button */}
              <Pressable
                onPress={handleFavoritePress}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: theme.backgroundSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name={product.isFavorite ? 'heart' : 'heart-outline'}
                  size={18}
                  color={product.isFavorite ? '#ef4444' : theme.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // Default vertical variant
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: theme.card,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        {/* Image */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: product.images[0] }}
            style={{ width: '100%', aspectRatio: 1, backgroundColor: theme.backgroundTertiary }}
            contentFit="cover"
            transition={200}
          />

          {/* Badges */}
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              right: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View style={{ gap: 6 }}>
              {variant === 'flash' && (
                <View
                  style={{
                    backgroundColor: '#ef4444',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ionicons name="flash" size={12} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                    FLASH
                  </Text>
                </View>
              )}
              {discount > 0 && (
                <View
                  style={{
                    backgroundColor: theme.error,
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                    -{discount}%
                  </Text>
                </View>
              )}
            </View>

            {/* Favorite Button */}
            <Pressable
              onPress={handleFavoritePress}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={product.isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={product.isFavorite ? '#ef4444' : theme.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: 12 }}>
          {/* Title */}
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme.text,
              marginBottom: 6,
              minHeight: 40,
            }}
          >
            {product.title}
          </Text>

          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={{ fontSize: 12, fontWeight: '600', color: theme.text }}>
              {product.rating.toFixed(1)}
            </Text>
            <Text style={{ fontSize: 11, color: theme.textTertiary }}>
              ({product.reviewCount})
            </Text>
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: theme.primary }}>
              {product.price.toLocaleString()} DA
            </Text>
            {product.originalPrice && (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: theme.textTertiary,
                  textDecorationLine: 'line-through',
                }}
              >
                {product.originalPrice.toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}