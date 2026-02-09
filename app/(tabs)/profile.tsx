import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAuthenticated, logout, language, setLanguage } = useAuthStore();
  const { orders, wishlistIds } = useStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const stats = [
    { label: 'Commandes', value: orders.length, icon: 'receipt-outline' as const },
    { label: 'Favoris', value: wishlistIds.length, icon: 'heart-outline' as const },
    { label: 'Adresses', value: user?.addresses?.length || 0, icon: 'location-outline' as const },
  ];

  const menuSections = [
    {
      title: 'Compte',
      items: [
        { label: 'Informations personnelles', icon: 'person-outline' as const, color: '#3b82f6' },
        { label: 'Mes adresses', icon: 'location-outline' as const, color: '#10b981' },
        { label: 'Méthodes de paiement', icon: 'card-outline' as const, color: '#8b5cf6' },
        { label: 'Mes favoris', icon: 'heart-outline' as const, color: '#ef4444' },
      ],
    },
    {
      title: 'Préférences',
      items: [
        {
          label: `Langue · ${language === 'fr' ? 'Français' : 'العربية'}`,
          icon: 'language-outline' as const,
          color: '#f59e0b',
          onPress: () => {
            Haptics.selectionAsync();
            setLanguage(language === 'fr' ? 'ar' : 'fr');
          },
        },
        { label: 'Notifications', icon: 'notifications-outline' as const, color: '#f97316' },
        { label: 'Mode sombre', icon: 'moon-outline' as const, color: '#6366f1' },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Centre d\'aide', icon: 'help-circle-outline' as const, color: '#06b6d4' },
        { label: 'Nous contacter', icon: 'chatbubble-outline' as const, color: '#14b8a6' },
        { label: 'À propos', icon: 'information-circle-outline' as const, color: '#64748b' },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <Animated.View style={{ flex: 1, backgroundColor: theme.background, opacity: fadeAnim }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#f97316', '#ef4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 20,
            paddingBottom: 30,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          {isAuthenticated && user ? (
            <View style={{ alignItems: 'center' }}>
              <Avatar uri={user.avatar} name={user.name} size={80} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#fff',
                  marginTop: 12,
                }}
              >
                {user.name}
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                {user.phone}
              </Text>
              <Pressable
                style={{
                  marginTop: 12,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                  Modifier le profil
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Avatar name="G" size={80} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#fff',
                  marginTop: 12,
                }}
              >
                Bienvenue
              </Text>
              <Pressable
                onPress={() => router.push('/(auth)/login')}
                style={{
                  marginTop: 12,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                  Se connecter
                </Text>
              </Pressable>
            </View>
          )}
        </LinearGradient>

        {/* Stats Row */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: -20,
            gap: 10,
          }}
        >
          {stats.map((stat, i) => (
            <Card key={i} variant="elevated" style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
              <Ionicons name={stat.icon} size={22} color={theme.primary} />
              <Text style={{ fontSize: 20, fontWeight: '800', color: theme.text, marginTop: 6 }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>
                {stat.label}
              </Text>
            </Card>
          ))}
        </View>

        {/* Menu Sections */}
        <View style={{ paddingHorizontal: 20, marginTop: 24, paddingBottom: 40 }}>
          {menuSections.map((section, si) => (
            <View key={si} style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: theme.textTertiary,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                {section.title}
              </Text>
              <Card padding={0}>
                {section.items.map((item, ii) => (
                  <Pressable
                    key={ii}
                    onPress={item.onPress || (() => Haptics.selectionAsync())}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderBottomWidth: ii < section.items.length - 1 ? 0.5 : 0,
                      borderBottomColor: theme.borderLight,
                      gap: 14,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: item.color + '15',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 15, color: theme.text }}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={18} color={theme.icon} />
                  </Pressable>
                ))}
              </Card>
            </View>
          ))}

          {/* Logout */}
          {isAuthenticated && (
            <Pressable
              onPress={handleLogout}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 14,
                backgroundColor: theme.errorLight,
                borderRadius: 14,
                gap: 8,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={theme.error} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: theme.error }}>
                Se déconnecter
              </Text>
            </Pressable>
          )}

          {/* Version */}
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: theme.textTertiary,
              marginTop: 20,
            }}
          >
            Souk DZ v1.0.0
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}