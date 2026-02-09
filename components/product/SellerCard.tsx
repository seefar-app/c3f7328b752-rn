import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import type { Seller } from '@/types';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // router.push(`/seller/${seller.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        padding: 20,
        backgroundColor: theme.background,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        {/* Logo */}
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            backgroundColor: theme.backgroundTertiary,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: seller.logo }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 4 }}>
            {seller.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>
                {seller.rating.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 12, color: theme.textTertiary }}>
                ({seller.totalReviews})
              </Text>
            </View>
            <View style={{ width: 1, height: 12, backgroundColor: theme.border }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={14} color={theme.textTertiary} />
              <Text style={{ fontSize: 12, color: theme.textTertiary }}>
                {seller.responseTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 14,
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: theme.borderLight,
          gap: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: theme.textTertiary, marginBottom: 4 }}>
            Membre depuis
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>
            {seller.joinDate}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: theme.textTertiary, marginBottom: 4 }}>
            Localisation
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>
            {seller.location}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Pressable
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            backgroundColor: theme.primaryBg,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
          }}
        >
          <Ionicons name="storefront-outline" size={18} color={theme.primary} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.primary }}>
            Voir la boutique
          </Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
          }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={theme.text} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>
            Contacter
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}