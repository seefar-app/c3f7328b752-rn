import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Share,
  FlatList,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ProductCard } from '@/components/shared/ProductCard';
import { Avatar } from '@/components/ui/Avatar';
import { ReviewCard } from '@/components/product/ReviewCard';
import { ImageGallery } from '@/components/product/ImageGallery';
import { SellerCard } from '@/components/product/SellerCard';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import type { Product } from '@/types';

const { width, height } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { products, addToCart, toggleFavorite, cart } = useStore();
  const { user } = useAuthStore();

  const product = products.find((p) => p.id === id);
  const relatedProducts = products.filter(
    (p) => p.category === product?.category && p.id !== id
  ).slice(0, 6);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginTop: 16 }}>
          Produit introuvable
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: theme.primary,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
            Retour
          </Text>
        </Pressable>
      </View>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez ${product.title} sur Souk DZ!\nPrix: ${product.price} DA`,
        url: `soukdz://product/${product.id}`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      product,
      quantity,
      price: product.price,
      sellerId: product.sellerId,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/(tabs)/cart');
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          opacity: headerOpacity,
        }}
      >
        <LinearGradient
          colors={['rgba(249,115,22,0.98)', 'rgba(239,68,68,0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingTop: insets.top + 8,
            paddingBottom: 12,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: 16, fontWeight: '700', color: '#fff' }}
          >
            {product.title}
          </Text>
          <Pressable
            onPress={handleShare}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="share-outline" size={20} color="#fff" />
          </Pressable>
        </LinearGradient>
      </Animated.View>

      {/* Floating Header Buttons */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          left: 20,
          right: 20,
          zIndex: 99,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={handleShare}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="share-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable
            onPress={handleToggleFavorite}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={product.isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={product.isFavorite ? '#ef4444' : '#fff'}
            />
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <ImageGallery
          images={product.images}
          selectedIndex={selectedImageIndex}
          onIndexChange={setSelectedImageIndex}
        />

        {/* Content */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Price & Title */}
          <View style={{ padding: 20, backgroundColor: theme.background }}>
            {/* Flash Sale Badge */}
            {product.isFlashSale && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <LinearGradient
                  colors={['#f97316', '#ef4444']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ionicons name="flash" size={14} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                    VENTE FLASH
                  </Text>
                </LinearGradient>
                {discount > 0 && (
                  <View
                    style={{
                      backgroundColor: theme.errorLight,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: theme.error, fontSize: 11, fontWeight: '700' }}>
                      -{discount}%
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Title */}
            <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text, marginBottom: 8 }}>
              {product.title}
            </Text>

            {/* Rating & Reviews */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>
                  {product.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                ({product.reviewCount} avis)
              </Text>
              <View style={{ width: 1, height: 12, backgroundColor: theme.border }} />
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                {product.inventory} en stock
              </Text>
            </View>

            {/* Price */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: theme.primary }}>
                {product.price.toLocaleString()} DA
              </Text>
              {product.originalPrice && (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textTertiary,
                    textDecorationLine: 'line-through',
                  }}
                >
                  {product.originalPrice.toLocaleString()} DA
                </Text>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 8, backgroundColor: theme.backgroundSecondary }} />

          {/* Quantity Selector */}
          <View style={{ padding: 20, backgroundColor: theme.background }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
              Quantité
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Pressable
                onPress={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                    Haptics.selectionAsync();
                  }
                }}
                disabled={quantity <= 1}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: quantity <= 1 ? theme.backgroundTertiary : theme.primaryBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={quantity <= 1 ? theme.textTertiary : theme.primary}
                />
              </Pressable>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text, minWidth: 40, textAlign: 'center' }}>
                {quantity}
              </Text>
              <Pressable
                onPress={() => {
                  if (quantity < product.inventory) {
                    setQuantity(quantity + 1);
                    Haptics.selectionAsync();
                  }
                }}
                disabled={quantity >= product.inventory}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: quantity >= product.inventory ? theme.backgroundTertiary : theme.primaryBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={quantity >= product.inventory ? theme.textTertiary : theme.primary}
                />
              </Pressable>
              <Text style={{ fontSize: 13, color: theme.textSecondary, marginLeft: 8 }}>
                Max: {product.inventory}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 8, backgroundColor: theme.backgroundSecondary }} />

          {/* Description */}
          <View style={{ padding: 20, backgroundColor: theme.background }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
              Description
            </Text>
            <Text
              numberOfLines={showFullDescription ? undefined : 4}
              style={{ fontSize: 14, lineHeight: 22, color: theme.textSecondary }}
            >
              {product.description}
            </Text>
            {product.description.length > 150 && (
              <Pressable
                onPress={() => {
                  setShowFullDescription(!showFullDescription);
                  Haptics.selectionAsync();
                }}
                style={{ marginTop: 8 }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.primary }}>
                  {showFullDescription ? 'Voir moins' : 'Voir plus'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Divider */}
          <View style={{ height: 8, backgroundColor: theme.backgroundSecondary }} />

          {/* Seller Card */}
          {product.seller && (
            <>
              <SellerCard seller={product.seller} />
              <View style={{ height: 8, backgroundColor: theme.backgroundSecondary }} />
            </>
          )}

          {/* Reviews */}
          <View style={{ padding: 20, backgroundColor: theme.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>
                Avis clients ({product.reviewCount})
              </Text>
              <Pressable>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.primary }}>
                  Voir tout
                </Text>
              </Pressable>
            </View>

            {product.reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>

          {/* Divider */}
          <View style={{ height: 8, backgroundColor: theme.backgroundSecondary }} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={{ padding: 20, backgroundColor: theme.background }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text, marginBottom: 16 }}>
                Produits similaires
              </Text>
              <FlatList
                data={relatedProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <View style={{ width: (width - 60) / 2 }}>
                    <ProductCard product={item} index={index} />
                  </View>
                )}
              />
            </View>
          )}

          <View style={{ height: 100 }} />
        </Animated.View>
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom,
          paddingTop: 12,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={handleAddToCart}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 14,
              backgroundColor: theme.primaryBg,
              borderWidth: 1.5,
              borderColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Ionicons name="cart-outline" size={22} color={theme.primary} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primary }}>
              Ajouter
            </Text>
          </Pressable>
          <Pressable
            onPress={handleBuyNow}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['#f97316', '#ef4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
                Acheter maintenant
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}