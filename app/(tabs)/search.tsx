import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  TextInput,
  LayoutAnimation,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { ProductCard } from '@/components/shared/ProductCard';

export default function SearchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    products,
    searchQuery,
    setSearchQuery,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    categories,
  } = useStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleSearch = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const handleSubmit = () => {
    if (localQuery.trim()) {
      addToSearchHistory(localQuery.trim());
    }
  };

  const handleHistoryPress = (query: string) => {
    Haptics.selectionAsync();
    setLocalQuery(query);
    setSearchQuery(query);
    setIsSearching(true);
  };

  const results = isSearching
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(localQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(localQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(localQuery.toLowerCase()))
      )
    : [];

  const trendingSearches = ['iPhone 15', 'Nike Air Max', 'Samsung Galaxy', 'Montre connectée', 'Écouteurs'];

  return (
    <Animated.View style={{ flex: 1, backgroundColor: theme.background, opacity: fadeAnim }}>
      {/* Search Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: theme.background,
          borderBottomWidth: 0.5,
          borderBottomColor: theme.borderLight,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 48,
            gap: 10,
          }}
        >
          <Ionicons name="search" size={20} color={theme.icon} />
          <TextInput
            ref={inputRef}
            style={{
              flex: 1,
              fontSize: 16,
              color: theme.text,
            }}
            placeholder="Rechercher sur Souk DZ..."
            placeholderTextColor={theme.textTertiary}
            value={localQuery}
            onChangeText={handleSearch}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoFocus
          />
          {localQuery.length > 0 && (
            <Pressable
              onPress={() => {
                setLocalQuery('');
                setSearchQuery('');
                setIsSearching(false);
              }}
            >
              <Ionicons name="close-circle" size={20} color={theme.icon} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {isSearching ? (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 13, color: theme.textTertiary, marginBottom: 16 }}>
              {results.length} résultat{results.length !== 1 ? 's' : ''} pour "{localQuery}"
            </Text>

            {results.length === 0 ? (
              <View style={{ alignItems: 'center', paddingTop: 60, gap: 16 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: theme.backgroundTertiary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="search-outline" size={36} color={theme.textTertiary} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>
                  Aucun résultat
                </Text>
                <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center' }}>
                  Essayez avec d'autres mots-clés ou parcourez les catégories
                </Text>
              </View>
            ) : (
              results.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="horizontal"
                  index={index}
                />
              ))
            )}
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            {/* Search History */}
            {searchHistory.length > 0 && (
              <View style={{ marginBottom: 28 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}
                >
                  <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text }}>
                    Recherches récentes
                  </Text>
                  <Pressable onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    clearSearchHistory();
                  }}>
                    <Text style={{ fontSize: 13, color: theme.primary, fontWeight: '500' }}>
                      Effacer
                    </Text>
                  </Pressable>
                </View>
                {searchHistory.map((query, i) => (
                  <Pressable
                    key={i}
                    onPress={() => handleHistoryPress(query)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderBottomWidth: 0.5,
                      borderBottomColor: theme.borderLight,
                      gap: 12,
                    }}
                  >
                    <Ionicons name="time-outline" size={18} color={theme.icon} />
                    <Text style={{ flex: 1, fontSize: 15, color: theme.text }}>{query}</Text>
                    <Ionicons name="arrow-up-outline" size={16} color={theme.icon} style={{ transform: [{ rotate: '-45deg' }] }} />
                  </Pressable>
                ))}
              </View>
            )}

            {/* Trending */}
            <View style={{ marginBottom: 28 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 14 }}>
                Tendances 🔥
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {trendingSearches.map((term, i) => (
                  <Pressable
                    key={i}
                    onPress={() => handleHistoryPress(term)}
                    style={{
                      backgroundColor: theme.backgroundSecondary,
                      borderRadius: 20,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: theme.borderLight,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: theme.text }}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Browse Categories */}
            <View>
              <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 14 }}>
                Parcourir par catégorie
              </Text>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => handleHistoryPress(cat.name)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme.borderLight,
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      backgroundColor: cat.color + '15',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 15, fontWeight: '500', color: theme.text }}>
                    {cat.name}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.icon} />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}