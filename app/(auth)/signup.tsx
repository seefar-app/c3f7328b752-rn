import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';

export default function SignupScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLang, setSelectedLang] = useState<'fr' | 'ar'>('fr');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleSignup = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await signup({
      name,
      phone,
      email,
      preferredLanguage: selectedLang,
    });
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={['#f97316', '#ef4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 40,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>
            Créer votre compte
          </Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>
            Rejoignez la communauté Souk DZ
          </Text>
        </LinearGradient>

        <Animated.View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 28, opacity: fadeAnim }}>
          <Input
            label="Nom complet"
            placeholder="ex: Karim Bouzid"
            icon="person-outline"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Numéro de téléphone"
            placeholder="0555 12 34 56"
            icon="call-outline"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Input
            label="Email (optionnel)"
            placeholder="email@example.com"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Language selector */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: theme.textSecondary,
              marginBottom: 8,
            }}
          >
            Langue préférée
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
            {[
              { id: 'fr' as const, label: '🇫🇷 Français', labelShort: 'FR' },
              { id: 'ar' as const, label: '🇩🇿 العربية', labelShort: 'AR' },
            ].map((lang) => (
              <Pressable
                key={lang.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedLang(lang.id);
                }}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: selectedLang === lang.id ? theme.primary : theme.border,
                  backgroundColor: selectedLang === lang.id ? theme.primaryBg : theme.backgroundSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: selectedLang === lang.id ? theme.primary : theme.textSecondary,
                  }}
                >
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button
            title="Créer mon compte"
            onPress={handleSignup}
            loading={isLoading}
            icon="checkmark-circle"
          />

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 12, color: theme.textTertiary, textAlign: 'center', lineHeight: 18 }}>
              En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}