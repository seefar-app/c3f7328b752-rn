import React, { useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Product } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'horizontal' | 'flash';
  index?: number;
}

export function ProductCard({ product, variant = 'grid', index = 0 }: ProductCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useStore();
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const isFav = isInWishlist(product.id);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${product.id}`);
  };

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleWishlist(product.id);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  if (variant === 'horizontal') {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={{
            flexDirection: 'row',
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 12,
            marginBottom: 12,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: product.images[0] }}
              style={{ width: 100, height: 100, borderRadius: 12 }}
              contentFit="cover"
            />
            {discount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 6,
                  backgroundColor: '#ef4444',
                  borderRadius: 8,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                  -{discount}%
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 14, justifyContent: 'center' }}>
            <Text
              style={{ fontSize: 15, fontWeight: '600', color: theme.text }}
              numberOfLines={2}
            >
              {product.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
              <Ionicons name="star" size={13} color="#f59e0b" />
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                {product.rating} ({product.reviewCount})
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: theme.primary }}>
                {formatPrice(product.price)}
              </Text>
              {product.originalPrice && (
                <Text
                  style={{
                    fontSize: 13,
                    color: theme.textTertiary,
                    textDecorationLine: 'line-through',
                  }}
                >
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
            </View>
          </View>
          <Pressable
            onPress={handleFav}
            style={{ padding: 4, position: 'absolute', top: 12, right: 12 }}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color={isFav ? '#ef4444' : theme.icon}
            />
          </Pressable>
        </Pressable>
      </Animated.View>
    );
  }

  // Grid variant
  const cardWidth = variant === 'flash' ? 155 : 170;
  const imageHeight = variant === 'flash' ? 140 : 160;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale }],
        width: cardWidth,
      }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={{
          backgroundColor: theme.card,
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: product.images[0] }}
            style={{ width: '100%', height: imageHeight }}
            contentFit="cover"
          />
          {discount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: '#ef4444',
                borderRadius: 8,
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                -{discount}%
              </Text>
            </View>
          )}
          <Pressable
            onPress={handleFav}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.9)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={isFav ? '#ef4444' : '#64748b'}
            />
          </Pressable>
          {product.isFlashSale && (
            <View
              style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(249,115,22,0.9)',
                borderRadius: 8,
                paddingHorizontal: 6,
                paddingVertical: 3,
                gap: 3,
              }}
            >
              <Ionicons name="flash" size={11} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>FLASH</Text>
            </View>
          )}
        </View>
        <View style={{ padding: 10 }}>
          <Text
            style={{ fontSize: 13, fontWeight: '500', color: theme.text, lineHeight: 18 }}
            numberOfLines={2}
          >
            {product.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 3 }}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={{ fontSize: 11, color: theme.textSecondary }}>
              {product.rating}
            </Text>
            <Text style={{ fontSize: 11, color: theme.textTertiary }}>
              ({product.reviewCount})
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primary }}>
              {formatPrice(product.price)}
            </Text>
          </View>
          {product.originalPrice && (
            <Text
              style={{
                fontSize: 11,
                color: theme.textTertiary,
                textDecorationLine: 'line-through',
                marginTop: 1,
              }}
            >
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}