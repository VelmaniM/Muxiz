import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAudio } from '../../context/AudioContext';
import { ProfileDrawer } from '../../components/ProfileDrawer';
import { useProfile } from '../../context/ProfileContext';

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showDrawer, setShowDrawer] = useState(false);
  const { playTrack, queue } = useAudio();
  const { profileImage } = useProfile();

  const categories = ['All', 'Music', 'Podcasts'];

  const homeGridCards = [
    {
      id: 'grid_1',
      title: queue.length > 0 ? queue[0].title : 'Newly Added',
      subtitle: queue.length > 0 ? queue[0].artist : 'Latest Uploads',
      cover: queue.length > 0 ? queue[0].artwork : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      isLivePlaying: true,
    },
    {
      id: 'grid_2',
      title: 'Sai Abhyankkar Mix',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    },
    {
      id: 'grid_3',
      title: 'Paruthiveeran',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    },
    {
      id: 'grid_4',
      title: 'Trending Now Tamil',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    },
    {
      id: 'grid_5',
      title: 'DC (Original Motion Picture Soundtrack)',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    },
    {
      id: 'grid_6',
      title: 'Goindhamma (From "Meesaya Murukku...")',
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    },
    {
      id: 'grid_7',
      title: 'Pakka Local',
      cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    },
    {
      id: 'grid_8',
      title: 'Sajanka',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    },
  ];

  const moreOfWhatYouLike = [
    {
      id: 'rec_1',
      title: 'Latest Dance Tamil தமிழ்',
      artists: 'Anirudh Ravichander, Sai Abhyankkar, G. V. Prakash...',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    },
    {
      id: 'rec_2',
      title: '00s Dance Tamil தமிழ்',
      artists: 'KK, Devi Sri Prasad, Harris Jayaraj, Thaman S...',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    },
    {
      id: 'rec_3',
      title: 'Mass Intros',
      artists: 'Anirudh Ravichander, A. R. Rahman, Yuvan Shankar Raja...',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    },
  ];

  const basedOnRecent = [
    {
      id: 'recent_1',
      title: 'Leo / Master Hits',
      artists: 'Anirudh Ravichander, Thalapathy Vijay',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    },
    {
      id: 'recent_2',
      title: 'Thalapathy Vijay Hits',
      artists: 'Top Tamil Blockbuster Hits',
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header matching Spotify Screenshot */}
        <View style={styles.headerRow}>
          {/* Ninja Avatar -> Opens Side Profile Drawer */}
          <Pressable style={styles.avatarBtn} onPress={() => setShowDrawer(true)}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImgSmall} />
            ) : (
              <Text style={styles.avatarEmoji}>🥷</Text>
            )}
          </Pressable>

          {/* Category Filter Pills */}
          <View style={styles.pillsRow}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.pillChip,
                  activeCategory === cat && styles.activePillChip,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.pillText,
                    activeCategory === cat && styles.activePillText,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 2x4 Grid Container (8 Grid Cards) */}
        <View style={styles.gridContainer}>
          {homeGridCards.map((item) => (
            <Pressable
              key={item.id}
              style={styles.gridCard}
              onPress={() => router.push('/playlist/pl_newly_added')}
            >
              <Image source={{ uri: item.cover }} style={styles.gridImage} />
              <View style={styles.gridTextWrapper}>
                <Text style={styles.gridTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.isLivePlaying && (
                  <Ionicons name="ellipsis-horizontal" size={14} color="#1DB954" style={styles.gridLiveIcon} />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Section 1: More of what you like */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>More of what you like</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {moreOfWhatYouLike.map((item) => (
            <Pressable
              key={item.id}
              style={styles.largeSquareCard}
              onPress={() => router.push('/playlist/pl_newly_added')}
            >
              <View style={styles.cardImageWrapper}>
                <Image source={{ uri: item.cover }} style={styles.cardImage} />
                <View style={styles.spotifyBadge}>
                  <Ionicons name="logo-octocat" size={12} color="#1DB954" />
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardArtists} numberOfLines={2}>
                {item.artists}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Section 2: Based on your recent listening */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Based on your recent listening</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {basedOnRecent.map((item) => (
            <Pressable
              key={item.id}
              style={styles.largeSquareCard}
              onPress={() => router.push('/playlist/pl_newly_added')}
            >
              <View style={styles.cardImageWrapper}>
                <Image source={{ uri: item.cover }} style={styles.cardImage} />
                <View style={styles.spotifyBadge}>
                  <Ionicons name="logo-octocat" size={12} color="#1DB954" />
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardArtists} numberOfLines={2}>
                {item.artists}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Side Profile Drawer Modal */}
      <ProfileDrawer visible={showDrawer} onClose={() => setShowDrawer(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 12,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImgSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillChip: {
    backgroundColor: '#282828',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activePillChip: {
    backgroundColor: '#1DB954',
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  activePillText: {
    color: '#000000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 8,
  },
  gridCard: {
    width: '48.5%',
    height: 56,
    backgroundColor: '#282828',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gridImage: {
    width: 56,
    height: 56,
  },
  gridTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  gridTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  gridLiveIcon: {
    marginLeft: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  largeSquareCard: {
    width: 154,
  },
  cardImageWrapper: {
    width: 154,
    height: 154,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  spotifyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 4,
    borderRadius: 12,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  cardArtists: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
});
