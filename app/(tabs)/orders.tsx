import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { Order } from '@/types';

export default function OrdersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orders } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled', 'returned'].includes(o.status)
  );
  const completedOrders = orders.filter((o) =>
    ['delivered', 'cancelled', 'returned'].includes(o.status)
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;

  const formatPrice = (price: number) => price.toLocaleString('fr-DZ') + ' DA';
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isLiveStatus = (status: string) =>
    ['out_for_delivery', 'shipped'].includes(status);

  return (
    <Animated.View style={{ flex: 1, backgroundColor: theme.background, opacity: fadeAnim }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 8,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '800', color: theme.text }}>
          Mes Commandes
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          backgroundColor: theme.backgroundSecondary,
          borderRadius: 12,
          padding: 4,
          marginBottom: 16,
        }}
      >
        {[
          { id: 'active' as const, label: 'En cours', count: activeOrders.length },
          { id: 'completed' as const, label: 'Terminées', count: completedOrders.length },
        ].map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab(tab.id);
            }}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: activeTab === tab.id ? theme.card : 'transparent',
              alignItems: 'center',
              shadowColor: activeTab === tab.id ? theme.shadow : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: activeTab === tab.id ? 0.08 : 0,
              shadowRadius: 4,
              elevation: activeTab === tab.id ? 2 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: activeTab === tab.id ? '700' : '500',
                color: activeTab === tab.id ? theme.text : theme.textSecondary,
              }}
            >
              {tab.label} ({tab.count})
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        {displayedOrders.length === 0 ? (
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
              <Ionicons name="receipt-outline" size={36} color={theme.textTertiary} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>
              Aucune commande
            </Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary }}>
              {activeTab === 'active'
                ? 'Vous n\'avez pas de commande en cours'
                : 'Votre historique est vide'}
            </Text>
          </View>
        ) : (
          displayedOrders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/order/${order.id}`);
              }}
              theme={theme}
              formatPrice={formatPrice}
              formatDate={formatDate}
              isLive={isLiveStatus(order.status)}
            />
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
}

function OrderCard({
  order,
  index,
  onPress,
  theme,
  formatPrice,
  formatDate,
  isLive,
}: {
  order: Order;
  index: number;
  onPress: () => void;
  theme: any;
  formatPrice: (p: number) => string;
  formatDate: (d: Date) => string;
  isLive: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: theme.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Top Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.textSecondary }}>
              #{order.trackingId}
            </Text>
            {isLive && <StatusIndicator color="#f97316" size={8} />}
          </View>
          <Badge status={order.status} size="sm" />
        </View>

        {/* Product Images */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {order.items.slice(0, 3).map((item, i) => (
            <Image
              key={i}
              source={{ uri: item.product.images[0] }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
              }}
              contentFit="cover"
            />
          ))}
          {order.items.length > 3 && (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                backgroundColor: theme.backgroundTertiary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.textSecondary }}>
                +{order.items.length - 3}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: theme.textTertiary }}>
            {formatDate(order.createdAt)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>
              {formatPrice(order.totalPrice)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.icon} />
          </View>
        </View>

        {/* Delivery estimate */}
        {order.estimatedDelivery && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              backgroundColor: theme.primaryBg,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Ionicons name="time-outline" size={14} color={theme.primary} />
            <Text style={{ fontSize: 12, color: theme.primary, fontWeight: '500' }}>
              {order.estimatedDelivery}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}