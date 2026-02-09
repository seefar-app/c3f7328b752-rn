import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  RefreshControl,
  Dimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ProductCard } from '@/components/shared/ProductCard';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const { products, categories, flashSaleProducts, selectedCategory, setSelectedCategory } = useStore();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();

    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setRefreshing(false);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: headerSlide }] }}>
          <LinearGradient
            colors={['#f97316', '#ef4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: insets.top + 10,
              paddingBottom: 20,
              paddingHorizontal: 20,
            }}
          >
            {/* Top row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                  {greeting()} 👋
                </Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 2 }}>
                  {user?.name || 'Bienvenue'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <Pressable
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="notifications-outline" size={22} color="#fff" />
                  <View
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 8,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#fbbf24',
                    }}
                  />
                </Pressable>
                <Avatar
                  uri={user?.avatar}
                  name={user?.name || 'Guest'}
                  size={40}
                />
              </View>
            </View>

            {/* Search bar */}
            <Pressable
              onPress={() => router.push('/(tabs)/search')}
              style={{
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 46,
                gap: 10,
              }}
            >
              <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
              <Text style={{ flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
                Rechercher un produit...
              </Text>
              <Pressable
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="camera-outline" size={18} color="#fff" />
              </Pressable>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* Flash Sale Banner */}
        {flashSaleProducts.length > 0 && (
          <Animated.View style={{ opacity: fadeAnim, marginTop: 20, paddingHorizontal: 20 }}>
            <Pressable
              style={{ borderRadius: 20, overflow: 'hidden' }}
            >
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800' }}
                style={{ height: 155 }}
              >
                <LinearGradient
                  colors={['rgba(249,115,22,0.92)', 'rgba(239,68,68,0.85)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flex: 1,
                    padding: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Ionicons name="flash" size={18} color="#fbbf24" />
                      <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
                        VENTE FLASH
                      </Text>
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 10 }}>
                      Jusqu'à -40%
                    </Text>
                    <CountdownTimer
                      endDate={new Date(Date.now() + 4 * 60 * 60 * 1000)}
                    />
                  </View>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          </Animated.View>
        )}

        {/* Categories */}
        <Animated.View style={{ opacity: fadeAnim, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 }}>
            <Text style={{ fontSize: 19, fontWeight: '700', color: theme.text }}>
              Catégories
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(null);
              }}
              style={{
                alignItems: 'center',
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  backgroundColor: !selectedCategory ? theme.primary : theme.backgroundTertiary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="grid"
                  size={26}
                  color={!selectedCategory ? '#fff' : theme.icon}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: !selectedCategory ? '700' : '500',
                  color: !selectedCategory ? theme.primary : theme.textSecondary,
                }}
              >
                Tous
              </Text>
            </Pressable>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                }}
                style={{ alignItems: 'center', gap: 8 }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    backgroundColor: selectedCategory === cat.id ? cat.color : theme.backgroundTertiary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={26}
                    color={selectedCategory === cat.id ? '#fff' : theme.icon}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: selectedCategory === cat.id ? '700' : '500',
                    color: selectedCategory === cat.id ? cat.color : theme.textSecondary,
                  }}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Flash Sale Products */}
        {!selectedCategory && flashSaleProducts.length > 0 && (
          <Animated.View style={{ opacity: fadeAnim, marginTop: 28 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                marginBottom: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="flash" size={20} color="#f97316" />
                <Text style={{ fontSize: 19, fontWeight: '700', color: theme.text }}>
                  Ventes Flash
                </Text>
              </View>
              <Pressable>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.primary }}>
                  Voir tout
                </Text>
              </Pressable>
            </View>

            {isLoading ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              >
                {[0, 1, 2].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </ScrollView>
            ) : (
              <FlatList
                data={flashSaleProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <ProductCard product={item} variant="flash" index={index} />
                )}
              />
            )}
          </Animated.View>
        )}

        {/* All Products / Filtered Products */}
        <View style={{ marginTop: 28, paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 19, fontWeight: '700', color: theme.text }}>
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || 'Produits'
                : 'Pour vous'}
            </Text>
            <Text style={{ fontSize: 13, color: theme.textTertiary }}>
              {filteredProducts.length} produits
            </Text>
          </View>

          {isLoading ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {[0, 1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingBottom: 30 }}>
              {filteredProducts.map((product, index) => (
                <View key={product.id} style={{ width: (width - 54) / 2 }}>
                  <ProductCard product={product} index={index} />
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}