import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
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

export default function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, verifyOtp, isLoading } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSendOTP = async () => {
    if (phone.length < 8) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro valide');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await login(phone);
    setStep('otp');
  };

  const handleVerifyOTP = async () => {
    const code = otpInputs.join('');
    if (code.length < 6) {
      Alert.alert('Erreur', 'Veuillez entrer le code complet');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const success = await verifyOtp(code);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newInputs = [...otpInputs];
    newInputs[index] = value;
    setOtpInputs(newInputs);
    if (value && index < 5) {
      // Auto-focus would need refs in production
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header gradient */}
        <LinearGradient
          colors={['#f97316', '#ef4444', '#ec4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 50,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="bag-handle" size={32} color="#fff" />
            </View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 }}>
              Souk DZ
            </Text>
            <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
              {step === 'phone' ? 'Connectez-vous avec votre téléphone' : 'Vérification du code'}
            </Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 32,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {step === 'phone' ? (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: theme.text,
                  marginBottom: 8,
                }}
              >
                Numéro de téléphone
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.textSecondary,
                  marginBottom: 24,
                  lineHeight: 20,
                }}
              >
                Nous vous enverrons un code de vérification par SMS
              </Text>

              <Input
                label="Téléphone"
                placeholder="0555 12 34 56"
                icon="call-outline"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={13}
              />

              <View style={{ marginTop: 8 }}>
                <Button
                  title="Envoyer le code"
                  onPress={handleSendOTP}
                  loading={isLoading}
                  icon="arrow-forward"
                  iconPosition="right"
                />
              </View>

              <View style={{ alignItems: 'center', marginTop: 24, gap: 12 }}>
                <Text style={{ fontSize: 13, color: theme.textTertiary }}>
                  Pas encore de compte ?
                </Text>
                <Pressable onPress={() => router.push('/(auth)/signup')}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.primary }}>
                    Créer un compte
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: theme.text,
                  marginBottom: 8,
                }}
              >
                Code de vérification
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.textSecondary,
                  marginBottom: 28,
                  lineHeight: 20,
                }}
              >
                Entrez le code envoyé au {phone}
              </Text>

              {/* OTP Inputs */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
                {otpInputs.map((digit, i) => (
                  <View
                    key={i}
                    style={{
                      width: 48,
                      height: 56,
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: digit ? theme.primary : theme.border,
                      backgroundColor: digit ? theme.primaryBg : theme.backgroundSecondary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>
                      {digit || '•'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* For demo: simple text input for OTP */}
              <Input
                placeholder="Entrez le code à 6 chiffres"
                icon="key-outline"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  const arr = text.split('').concat(Array(6).fill('')).slice(0, 6);
                  setOtpInputs(arr);
                }}
              />

              <Button
                title="Vérifier"
                onPress={handleVerifyOTP}
                loading={isLoading}
              />

              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStep('phone');
                }}
                style={{ alignItems: 'center', marginTop: 20 }}
              >
                <Text style={{ fontSize: 14, color: theme.primary, fontWeight: '500' }}>
                  ← Changer de numéro
                </Text>
              </Pressable>

              <Pressable style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                  Renvoyer le code dans 30s
                </Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}