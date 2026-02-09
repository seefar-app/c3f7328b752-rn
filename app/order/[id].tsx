import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import type { OrderStatus } from '@/types';

const statusSteps: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'pending', label: 'En attente', icon: 'time-outline' },
  { status: 'confirmed', label: 'Confirmée', icon: 'checkmark-circle-outline' },
  { status: 'processing', label: 'Préparation', icon: 'cube-outline' },
  { status: 'shipped', label: 'Expédiée', icon: 'airplane-outline' },
  { status: 'out_for_delivery', label: 'En livraison', icon: 'bicycle-outline' },
  { status: 'delivered', label: 'Livrée', icon: 'checkmark-done-outline' },
];

export default function OrderDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrderById } = useStore();

  const order = getOrderById(id || '');
  const [showMap, setShowMap] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginTop: 16 }}>
          Commande introuvable
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 15, color: theme.primary, fontWeight: '600' }}>
            ← Retour
          </Text>
        </Pressable>
      </View>
    );
  }

  const formatPrice = (price: number) => price.toLocaleString('fr-DZ') + ' DA';
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);
  const isLiveTracking = ['out_for_delivery', 'shipped'].includes(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  const handleCallDriver = () => {
    if (order.driver?.phone) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Linking.openURL(`tel:${order.driver.phone}`);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Annuler la commande',
      'Êtes-vous sûr de vouloir annuler cette commande ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            // In real app: API call to cancel order
            Alert.alert('Commande annulée', 'Votre commande a été annulée avec succès');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <Animated.View style={{ flex: 1, backgroundColor: theme.background, opacity: fadeAnim }}>
      {/* Header */}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
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
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>
              Commande #{order.trackingId}
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
          {isLiveTracking && <StatusIndicator color="#fff" size={10} />}
        </View>

        {/* Status Badge */}
        <View style={{ alignItems: 'flex-start' }}>
          <Badge status={order.status} size="lg" />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View
          style={{
            padding: 20,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Live Map (if driver available) */}
          {isLiveTracking && order.driver && order.shippingAddress.latitude && (
            <Card style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
              <Pressable onPress={() => setShowMap(!showMap)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: theme.primaryBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="location" size={22} color={theme.primary} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>
                        Suivi en temps réel
                      </Text>
                      <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
                        {order.estimatedDelivery}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={showMap ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.icon}
                  />
                </View>
              </Pressable>

              {showMap && (
                <View style={{ height: 250 }}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: order.shippingAddress.latitude,
                      longitude: order.shippingAddress.longitude!,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    }}
                  >
                    {/* Delivery Location */}
                    <Marker
                      coordinate={{
                        latitude: order.shippingAddress.latitude,
                        longitude: order.shippingAddress.longitude!,
                      }}
                      title="Adresse de livraison"
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: theme.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 3,
                          borderColor: '#fff',
                        }}
                      >
                        <Ionicons name="home" size={20} color="#fff" />
                      </View>
                    </Marker>

                    {/* Driver Location */}
                    {order.driver.latitude && order.driver.longitude && (
                      <Marker
                        coordinate={{
                          latitude: order.driver.latitude,
                          longitude: order.driver.longitude,
                        }}
                        title={order.driver.name}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#10b981',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 3,
                            borderColor: '#fff',
                          }}
                        >
                          <Ionicons name="bicycle" size={20} color="#fff" />
                        </View>
                      </Marker>
                    )}
                  </MapView>
                </View>
              )}

              {/* Driver Info */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  borderTopWidth: 0.5,
                  borderTopColor: theme.borderLight,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Image
                    source={{ uri: order.driver.avatar }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    contentFit="cover"
                  />
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>
                      {order.driver.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                      Votre livreur
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={handleCallDriver}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.primaryBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="call" size={20} color={theme.primary} />
                </Pressable>
              </View>
            </Card>
          )}

          {/* Order Timeline */}
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 16 }}>
              Suivi de commande
            </Text>
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <View key={step.status} style={{ flexDirection: 'row', gap: 12 }}>
                  {/* Timeline Line */}
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: isCompleted ? theme.primary : theme.backgroundTertiary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={step.icon as any}
                        size={16}
                        color={isCompleted ? '#fff' : theme.textTertiary}
                      />
                    </View>
                    {index < statusSteps.length - 1 && (
                      <View
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 40,
                          backgroundColor: isCompleted ? theme.primary : theme.borderLight,
                          marginVertical: 4,
                        }}
                      />
                    )}
                  </View>

                  {/* Step Info */}
                  <View style={{ flex: 1, paddingBottom: index < statusSteps.length - 1 ? 16 : 0 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: isCurrent ? '700' : '600',
                        color: isCompleted ? theme.text : theme.textTertiary,
                      }}
                    >
                      {step.label}
                    </Text>
                    {isCurrent && (
                      <Text style={{ fontSize: 12, color: theme.primary, marginTop: 2 }}>
                        En cours
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </Card>

          {/* Products */}
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 14 }}>
              Articles ({order.items.length})
            </Text>
            {order.items.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  paddingBottom: 12,
                  marginBottom: 12,
                  borderBottomWidth: index < order.items.length - 1 ? 0.5 : 0,
                  borderBottomColor: theme.borderLight,
                }}
              >
                <Image
                  source={{ uri: item.product.images[0] }}
                  style={{ width: 70, height: 70, borderRadius: 10 }}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: '600', color: theme.text }}
                    numberOfLines={2}
                  >
                    {item.product.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>
                    Quantité: {item.quantity}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primary, marginTop: 4 }}>
                    {formatPrice(item.price)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>

          {/* Delivery Address */}
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 14 }}>
              Adresse de livraison
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: theme.primaryBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="location" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>
                  {order.shippingAddress.label}
                </Text>
                <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4, lineHeight: 18 }}>
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                  {'\n'}
                  {order.shippingAddress.wilaya} {order.shippingAddress.postalCode}
                  {'\n'}
                  {order.shippingAddress.phone}
                </Text>
              </View>
            </View>
          </Card>

          {/* Payment & Summary */}
          <Card>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text, marginBottom: 14 }}>
              Résumé de paiement
            </Text>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: theme.textSecondary }}>Sous-total</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text }}>
                  {formatPrice(order.subtotal)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: theme.textSecondary }}>Livraison</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text }}>
                  {formatPrice(order.deliveryFee)}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: theme.border,
                  marginVertical: 4,
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>Total</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: theme.primary }}>
                  {formatPrice(order.totalPrice)}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 8,
                  paddingTop: 12,
                  borderTopWidth: 0.5,
                  borderTopColor: theme.borderLight,
                }}
              >
                <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                  Méthode de paiement:{' '}
                  <Text style={{ fontWeight: '600', color: theme.text }}>
                    {order.paymentMethod === 'cash_on_delivery'
                      ? 'Paiement à la livraison'
                      : order.paymentMethod === 'edahabia'
                      ? 'Carte Edahabia'
                      : 'CCP'}
                  </Text>
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      {(canCancel || isLiveTracking) && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            backgroundColor: theme.card,
            borderTopWidth: 0.5,
            borderTopColor: theme.borderLight,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {canCancel && (
              <View style={{ flex: 1 }}>
                <Button
                  title="Annuler"
                  onPress={handleCancelOrder}
                  variant="outline"
                  icon="close-circle-outline"
                />
              </View>
            )}
            {isLiveTracking && order.driver && (
              <View style={{ flex: 1 }}>
                <Button
                  title="Appeler"
                  onPress={handleCallDriver}
                  icon="call"
                />
              </View>
            )}
          </View>
        </View>
      )}
    </Animated.View>
  );
}