import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAudio } from '../../context/AudioContext';
import { ProfileDrawer } from '../../components/ProfileDrawer';
import { useProfile } from '../../context/ProfileContext';
import { TrackListItem } from '../../components/TrackListItem';

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showDrawer, setShowDrawer] = useState(false);
  const { queue } = useAudio();
  const { profileImage } = useProfile();

  const categories = ['All', 'Music', 'Podcasts'];

  const homeGridCards = [
    {
      id: 'grid_1',
      title: queue.length > 0 ? queue[0].title : 'Newly Added',
      cover:
        queue.length > 0
          ? queue[0].artwork
          : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      isLivePlaying: true,
      playlistId: 'pl_newly_added',
    },
    {
      id: 'grid_2',
      title: 'Sai Abhyankkar Mix',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
      playlistId: 'pl_sai_abhyankkar',
    },
    {
      id: 'grid_3',
      title: 'Paruthiveeran',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
      playlistId: 'pl_paruthiveeran',
    },
    {
      id: 'grid_4',
      title: 'Trending Now Tamil',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
      playlistId: 'pl_trending_tamil',
    },
    {
      id: 'grid_5',
      title: 'DC Soundtrack',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
      playlistId: 'pl_dc_soundtrack',
    },
    {
      id: 'grid_6',
      title: 'Goindhamma Hits',
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
      playlistId: 'pl_goindhamma',
    },
    {
      id: 'grid_7',
      title: 'Pakka Local',
      cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
      playlistId: 'pl_pakka_local',
    },
    {
      id: 'grid_8',
      title: 'Sajanka Melodies',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      playlistId: 'pl_sajanka',
    },
  ];

  const topMixes = [
    {
      id: 'mix_1',
      title: 'Vidyasagar Mix',
      subtitle: 'M. G. Radhakrishnan, Berny-Ignatius and Ouseppachan',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
      badge: 'Vidyasagar Mix',
      badgeColor: '#E6D3B3',
      playlistId: 'pl_newly_added',
    },
    {
      id: 'mix_2',
      title: '2020s Mix',
      subtitle: 'Anirudh Ravichander, Sai Abhyankkar, Sundar C. Babu...',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
      badge: '2020s Mix',
      badgeColor: '#D8E2A2',
      playlistId: 'pl_sai_abhyankkar',
    },
    {
      id: 'mix_3',
      title: '2010s Mix',
      subtitle: 'Devi Sri Prasad, Harris Jayaraj, Yuvan Shankar Raja...',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
      badge: '2010s Mix',
      badgeColor: '#CD6EE7',
      playlistId: 'pl_trending_tamil',
    },
  ];

  const recommendedStations = [
    {
      id: 'st_1',
      title: 'Sid Sriram Radio',
      subtitle: 'Sid Sriram, Dhibu Ninan Thomas, Rajhesh Vaidhya...',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      badge: 'RADIO',
      playlistId: 'pl_paruthiveeran',
    },
    {
      id: 'st_2',
      title: 'Arijit Singh Radio',
      subtitle: 'Arijit Singh, Pritam, Atif Aslam...',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
      badge: 'RADIO',
      playlistId: 'pl_dc_soundtrack',
    },
    {
      id: 'st_3',
      title: 'Harris Jayaraj Radio',
      subtitle: 'Harris Jayaraj, Anirudh, Yuvan Shankar Raja...',
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
      badge: 'RADIO',
      playlistId: 'pl_sajanka',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          {/* Avatar -> Opens Side Profile Drawer */}
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

        {/* 2x4 Quick Grid Cards */}
        <View style={styles.gridContainer}>
          {homeGridCards.map((item) => (
            <Pressable
              key={item.id}
              style={styles.gridCard}
              onPress={() => router.push(`/playlist/${item.playlistId}` as any)}
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

        {/* Section 1: Your top mixes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your top mixes</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCardScroll}
        >
          {topMixes.map((mix) => (
            <Pressable
              key={mix.id}
              style={styles.cardItem}
              onPress={() => router.push(`/playlist/${mix.playlistId}` as any)}
            >
              <View style={styles.cardImageWrapper}>
                <Image source={{ uri: mix.cover }} style={styles.cardCover} />
                <View style={[styles.badgePill, { backgroundColor: mix.badgeColor }]}>
                  <Text style={styles.badgePillText}>{mix.badge}</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitleText} numberOfLines={2}>
                {mix.subtitle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Section 2: Recommended Stations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Stations</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCardScroll}
        >
          {recommendedStations.map((st) => (
            <Pressable
              key={st.id}
              style={styles.cardItem}
              onPress={() => router.push(`/playlist/${st.playlistId}` as any)}
            >
              <View style={styles.cardImageWrapper}>
                <Image source={{ uri: st.cover }} style={styles.cardCover} />
                <View style={styles.radioBadgePill}>
                  <Text style={styles.radioBadgeText}>RADIO</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitleText} numberOfLines={2}>
                {st.subtitle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Section 3: Your Songs Vertical Track List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Songs</Text>
        </View>

        <View style={styles.tracksWrapper}>
          {queue.map((track) => (
            <TrackListItem key={track.id} track={track} playlistContext={queue} />
          ))}
        </View>
      </ScrollView>

      {/* Side Profile Drawer Component */}
      <ProfileDrawer visible={showDrawer} onClose={() => setShowDrawer(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
  scrollContent: {
    paddingBottom: 110,
  },

  /* Header Row */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  avatarImgSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillChip: {
    backgroundColor: '#2A2A2A',
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
    fontWeight: '600',
  },
  activePillText: {
    color: '#000000',
  },

  /* 2x4 Quick Grid Cards */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  gridCard: {
    width: '48.5%',
    height: 56,
    backgroundColor: '#2A2A2A',
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  gridTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 4,
  },
  gridLiveIcon: {
    marginLeft: 4,
  },

  /* Section Styles */
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  horizontalCardScroll: {
    paddingHorizontal: 16,
    gap: 14,
  },

  /* Card Item */
  cardItem: {
    width: 154,
  },
  cardImageWrapper: {
    width: 154,
    height: 154,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1E1E',
  },
  cardCover: {
    width: '100%',
    height: '100%',
  },
  badgePill: {
    position: 'absolute',
    bottom: 10,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgePillText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  radioBadgePill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  radioBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardSubtitleText: {
    color: '#A7A7A7',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 6,
    lineHeight: 16,
  },
  tracksWrapper: {
    paddingHorizontal: 4,
  },
});
