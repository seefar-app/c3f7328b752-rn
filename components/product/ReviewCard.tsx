import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/Avatar';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderLight,
      }}
    >
      {/* User Info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <Avatar uri={review.userAvatar} name={review.userName} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>
            {review.userName}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textTertiary, marginTop: 2 }}>
            {format(review.createdAt, 'd MMMM yyyy', { locale: fr })}
          </Text>
        </View>
        {/* Rating */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>
            {review.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Comment */}
      <Text style={{ fontSize: 14, lineHeight: 20, color: theme.textSecondary, marginBottom: 10 }}>
        {review.comment}
      </Text>

      {/* Images */}
      {review.images.length > 0 && (
        <FlatList
          data={review.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          keyExtractor={(item, index) => `review-img-${index}`}
          renderItem={({ item }) => (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: theme.backgroundTertiary,
              }}
            >
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
          )}
        />
      )}
    </View>
  );
}