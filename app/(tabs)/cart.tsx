import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  LayoutAnimation,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PaymentMethodType } from '@/types';

const paymentMethods = [
  { id: 'cash_on_delivery' as PaymentMethodType, label: 'Paiement à la livraison', icon: 'cash-outline' as const, desc: 'Payez en espèces' },
  { id: 'edahabia' as PaymentMethodType, label: 'Carte Edahabia', icon: 'card-outline' as const, desc: 'Algérie Poste' },
  { id: 'ccp' as PaymentMethodType, label: 'CCP', icon: 'wallet-outline' as const, desc: 'Virement postal' },
];

export default function CartScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Safely get store methods with fallbacks
  const store = useStore();
  const cartItems = store?.cartItems ?? [];
  const cartTotal = store?.cartTotal ?? 0;
  const updateCartQuantity = store?.updateCartQuantity ?? (() => {});
  const removeFromCart = store?.removeFromCart ?? (() => {});
  const clearCart = store?.clearCart ?? (() => {});
  const placeOrder = store?.placeOrder ?? (() => ({ id: '' }));

  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('cash_on_delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) return '0 DA';
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  const deliveryFee = 400;
  const total = cartTotal + (cartItems.length > 0 ? deliveryFee : 0);

  const handleRemove = (productId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handlePlaceOrder = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const order = placeOrder(selectedPayment);
      if (order?.id) {
        setOrderPlaced(true);
        setTimeout(() => {
          setShowCheckout(false);
          setOrderPlaced(false);
          router.push(`/order/${order.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Erreur', 'Impossible de passer la commande. Veuillez réessayer.');
    }
  };

  // Safety check for theme
  if (!theme) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ fontSize: 16, color: '#64748b' }}>Chargement...</Text>
      </View>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: theme.background ?? '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 40,
          opacity: fadeAnim,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.primaryBg ?? '#fff7ed',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons name="cart-outline" size={48} color={theme.primary ?? '#f97316'} />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text ?? '#0f172a', marginBottom: 8 }}>
          Votre panier est vide
        </Text>
        <Text style={{ fontSize: 15, color: theme.textSecondary ?? '#64748b', textAlign: 'center', lineHeight: 22 }}>
          Découvrez nos produits et ajoutez-les à votre panier
        </Text>
        <View style={{ marginTop: 24, width: '100%' }}>
          <Button
            title="Commencer à acheter"
            onPress={() => router.push('/(tabs)')}
            icon="bag-outline"
          />
        </View>
      </Animated.View>
    );
  }

  if (showCheckout) {
    return (
      <Animated.View style={{ flex: 1, backgroundColor: theme.background ?? '#ffffff', opacity: fadeAnim }}>
        <View
          style={{
            paddingTop: insets.top + 10,
            paddingHorizontal: 20,
            paddingBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Pressable onPress={() => setShowCheckout(false)}>
            <Ionicons name="arrow-back" size={24} color={theme.text ?? '#0f172a'} />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text ?? '#0f172a' }}>
            Paiement
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 200 }}>
          {/* Delivery Address */}
          <Card style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: theme.primaryBg ?? '#fff7ed',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="location" size={22} color={theme.primary ?? '#f97316'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text ?? '#0f172a' }}>
                  Adresse de livraison
                </Text>
                <Text style={{ fontSize: 13, color: theme.textSecondary ?? '#64748b', marginTop: 2 }}>
                  12 Rue Didouche Mourad, Alger Centre
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.icon ?? '#64748b'} />
            </View>
          </Card>

          {/* Payment Method */}
          <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text ?? '#0f172a', marginBottom: 14 }}>
            Méthode de paiement
          </Text>

          {paymentMethods.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPayment(method.id);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: selectedPayment === method.id ? (theme.primaryBg ?? '#fff7ed') : (theme.card ?? '#ffffff'),
                borderRadius: 14,
                borderWidth: 2,
                borderColor: selectedPayment === method.id ? (theme.primary ?? '#f97316') : (theme.border ?? '#e2e8f0'),
                marginBottom: 10,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: selectedPayment === method.id
                    ? (theme.primary ?? '#f97316')
                    : (theme.backgroundTertiary ?? '#f1f5f9'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name={method.icon}
                  size={22}
                  color={selectedPayment === method.id ? '#fff' : (theme.icon ?? '#64748b')}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text ?? '#0f172a' }}>
                  {method.label}
                </Text>
                <Text style={{ fontSize: 12, color: theme.textSecondary ?? '#64748b' }}>{method.desc}</Text>
              </View>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 2,
                  borderColor: selectedPayment === method.id ? (theme.primary ?? '#f97316') : (theme.border ?? '#e2e8f0'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedPayment === method.id && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: theme.primary ?? '#f97316',
                    }}
                  />
                )}
              </View>
            </Pressable>
          ))}

          {/* Order Summary */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.text ?? '#0f172a', marginBottom: 14 }}>
              Résumé de la commande
            </Text>
            <Card>
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: theme.textSecondary ?? '#64748b' }}>
                    Sous-total ({cartItems.reduce((s, i) => s + (i?.quantity ?? 0), 0)} articles)
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text ?? '#0f172a' }}>
                    {formatPrice(cartTotal)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: theme.textSecondary ?? '#64748b' }}>Livraison</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text ?? '#0f172a' }}>
                    {formatPrice(deliveryFee)}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.border ?? '#e2e8f0',
                    marginVertical: 4,
                  }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text ?? '#0f172a' }}>Total</Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: theme.primary ?? '#f97316' }}>
                    {formatPrice(total)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Security badge */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 20,
            }}
          >
            <Ionicons name="shield-checkmark" size={16} color={theme.success ?? '#10b981'} />
            <Text style={{ fontSize: 12, color: theme.textTertiary ?? '#94a3b8' }}>
              Paiement sécurisé · Protection acheteur
            </Text>
          </View>
        </ScrollView>

        {/* Checkout Button */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            backgroundColor: theme.card ?? '#ffffff',
            borderTopWidth: 0.5,
            borderTopColor: theme.borderLight ?? '#f1f5f9',
          }}
        >
          {orderPlaced ? (
            <View style={{ alignItems: 'center', paddingVertical: 12, gap: 8 }}>
              <Ionicons name="checkmark-circle" size={32} color={theme.success ?? '#10b981'} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.success ?? '#10b981' }}>
                Commande confirmée !
              </Text>
            </View>
          ) : (
            <Button
              title={`Confirmer · ${formatPrice(total)}`}
              onPress={handlePlaceOrder}
              icon="checkmark-circle"
            />
          )}
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ flex: 1, backgroundColor: theme.background ?? '#ffffff', opacity: fadeAnim }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '800', color: theme.text ?? '#0f172a' }}>
          Panier
        </Text>
        <Pressable
          onPress={() => {
            Alert.alert('Vider le panier', 'Êtes-vous sûr ?', [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Vider',
                style: 'destructive',
                onPress: () => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  clearCart();
                },
              },
            ]);
          }}
        >
          <Text style={{ fontSize: 14, color: theme.error ?? '#ef4444', fontWeight: '500' }}>Tout supprimer</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 180 }}
      >
        {cartItems.map((item) => {
          // Safety checks for item properties
          if (!item?.product) return null;
          
          const productImage = item.product.images?.[0] ?? '';
          const productTitle = item.product.title ?? 'Produit';
          const itemPrice = item.price ?? 0;
          const itemQuantity = item.quantity ?? 1;
          const productId = item.productId ?? '';

          return (
            <View
              key={productId}
              style={{
                flexDirection: 'row',
                backgroundColor: theme.card ?? '#ffffff',
                borderRadius: 16,
                padding: 12,
                marginBottom: 12,
                shadowColor: theme.shadow ?? '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Image
                source={{ uri: productImage }}
                style={{ width: 90, height: 90, borderRadius: 12 }}
                contentFit="cover"
              />
              <View style={{ flex: 1, marginLeft: 14, justifyContent: 'space-between' }}>
                <View>
                  <Text
                    style={{ fontSize: 14, fontWeight: '600', color: theme.text ?? '#0f172a' }}
                    numberOfLines={2}
                  >
                    {productTitle}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: theme.primary ?? '#f97316', marginTop: 4 }}>
                    {formatPrice(itemPrice)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Quantity controls */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: theme.backgroundSecondary ?? '#f8fafc',
                      borderRadius: 10,
                      gap: 0,
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        Haptics.selectionAsync();
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        updateCartQuantity(productId, itemQuantity - 1);
                      }}
                      style={{ padding: 8 }}
                    >
                      <Ionicons name="remove" size={18} color={theme.text ?? '#0f172a'} />
                    </Pressable>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: theme.text ?? '#0f172a',
                        minWidth: 28,
                        textAlign: 'center',
                      }}
                    >
                      {itemQuantity}
                    </Text>
                    <Pressable
                      onPress={() => {
                        Haptics.selectionAsync();
                        updateCartQuantity(productId, itemQuantity + 1);
                      }}
                      style={{ padding: 8 }}
                    >
                      <Ionicons name="add" size={18} color={theme.primary ?? '#f97316'} />
                    </Pressable>
                  </View>
                  <Pressable onPress={() => handleRemove(productId)} style={{ padding: 6 }}>
                    <Ionicons name="trash-outline" size={18} color={theme.error ?? '#ef4444'} />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          backgroundColor: theme.card ?? '#ffffff',
          borderTopWidth: 0.5,
          borderTopColor: theme.borderLight ?? '#f1f5f9',
          shadowColor: theme.shadow ?? '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ fontSize: 14, color: theme.textSecondary ?? '#64748b' }}>
            Total ({cartItems.reduce((s, i) => s + (i?.quantity ?? 0), 0)} articles)
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: theme.text ?? '#0f172a' }}>
            {formatPrice(total)}
          </Text>
        </View>
        <Button
          title="Passer la commande"
          onPress={() => setShowCheckout(true)}
          icon="arrow-forward"
          iconPosition="right"
        />
      </View>
    </Animated.View>
  );
}