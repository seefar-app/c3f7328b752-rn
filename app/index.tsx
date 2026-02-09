import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/useAuthStore';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    title: 'Bienvenue sur\nSouk DZ',
    titleAr: 'مرحبا بكم في\nسوق دي زد',
    subtitle: 'Le meilleur du shopping algérien',
    subtitleAr: 'أفضل تجربة تسوق جزائرية',
    icon: 'bag-handle' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    title: 'Paiement\nSimple & Sécurisé',
    titleAr: 'دفع\nبسيط وآمن',
    subtitle: 'CCP, Edahabia, paiement à la livraison',
    subtitleAr: 'CCP، بريد الجزائر، الدفع عند الاستلام',
    icon: 'shield-checkmark' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    title: 'Livraison\nPartout en Algérie',
    titleAr: 'توصيل\nفي كل أنحاء الجزائر',
    subtitle: 'Suivi en temps réel de vos commandes',
    subtitleAr: 'تتبع طلباتك في الوقت الفعلي',
    icon: 'location' as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const buttonSlide = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
      return;
    }

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(contentSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(buttonSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/login');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={{ uri: slide.image }}
        style={{ flex: 1, width, height }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          locations={[0, 0.3, 0.6, 1]}
          style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: insets.bottom + 20 }}
        >
          {/* Skip button */}
          <Pressable
            onPress={handleSkip}
            style={{
              position: 'absolute',
              top: insets.top + 12,
              right: 20,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Passer</Text>
          </Pressable>

          {/* Logo area */}
          <Animated.View
            style={{
              position: 'absolute',
              top: insets.top + 60,
              left: 0,
              right: 0,
              alignItems: 'center',
              opacity: fadeAnim,
              transform: [{ scale: logoScale }],
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: '#f97316',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#f97316',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
              }}
            >
              <Ionicons name={slide.icon} size={36} color="#fff" />
            </View>
          </Animated.View>

          {/* Content */}
          <Animated.View
            style={{
              paddingHorizontal: 28,
              opacity: fadeAnim,
              transform: [{ translateY: contentSlide }],
            }}
          >
            <Text
              style={{
                fontSize: 38,
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: 46,
                marginBottom: 12,
              }}
            >
              {slide.title}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 24,
                marginBottom: 8,
              }}
            >
              {slide.subtitle}
            </Text>

            {/* Dots */}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 30 }}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === currentSlide ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i === currentSlide ? '#f97316' : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </View>
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            style={{
              paddingHorizontal: 28,
              gap: 12,
              opacity: fadeAnim,
              transform: [{ translateY: buttonSlide }],
            }}
          >
            <Pressable
              onPress={handleGetStarted}
              style={{
                height: 56,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['#f97316', '#ef4444']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>
                  Commencer
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleSkip}
              style={{
                height: 52,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' }}>
                Explorer sans compte
              </Text>
            </Pressable>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}