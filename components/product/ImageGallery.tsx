import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 1.1;

interface ImageGalleryProps {
  images: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageGallery({ images, selectedIndex, onIndexChange }: ImageGalleryProps) {
  const theme = useTheme();
  const [showFullscreen, setShowFullscreen] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fullscreenRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== selectedIndex) {
      onIndexChange(index);
      Haptics.selectionAsync();
    }
  };

  const handleThumbnailPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    onIndexChange(index);
    Haptics.selectionAsync();
  };

  const handleImagePress = () => {
    setShowFullscreen(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <>
      <View style={{ backgroundColor: theme.backgroundSecondary }}>
        {/* Main Image Carousel */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => `main-${index}`}
          renderItem={({ item }) => (
            <Pressable onPress={handleImagePress} style={{ width, height: IMAGE_HEIGHT }}>
              <Image
                source={{ uri: item }}
                style={{ width, height: IMAGE_HEIGHT }}
                contentFit="cover"
                transition={200}
              />
            </Pressable>
          )}
        />

        {/* Pagination Dots */}
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={{
                width: selectedIndex === index ? 24 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: selectedIndex === index ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </View>

        {/* Thumbnail Strip */}
        <View style={{ padding: 12, backgroundColor: theme.background }}>
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            keyExtractor={(item, index) => `thumb-${index}`}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => handleThumbnailPress(index)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: selectedIndex === index ? theme.primary : theme.border,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </Pressable>
            )}
          />
        </View>
      </View>

      {/* Fullscreen Modal */}
      <Modal
        visible={showFullscreen}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullscreen(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Pressable
            onPress={() => setShowFullscreen(false)}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>

          <FlatList
            ref={fullscreenRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedIndex}
            keyExtractor={(item, index) => `full-${index}`}
            renderItem={({ item }) => (
              <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: item }}
                  style={{ width, height: width }}
                  contentFit="contain"
                />
              </View>
            )}
          />

          {/* Fullscreen Pagination */}
          <View
            style={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {images.map((_, index) => (
              <View
                key={`full-dot-${index}`}
                style={{
                  width: selectedIndex === index ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: selectedIndex === index ? '#fff' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}