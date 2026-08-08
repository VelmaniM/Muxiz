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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <Pressable style={styles.avatarBtn} onPress={() => setShowDrawer(true)}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImgSmall} />
            ) : (
              <Text style={styles.avatarEmoji}>🥷</Text>
            )}
          </Pressable>

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

        {/* Essential Playlist Banner */}
        <Pressable
          style={styles.playlistBannerCard}
          onPress={() => router.push('/playlist/pl_newly_added')}
        >
          <View style={styles.bannerIconBox}>
            <Ionicons name="musical-notes" size={28} color="#1DB954" />
          </View>
          <View style={styles.bannerTextGroup}>
            <Text style={styles.bannerTitle}>Newly Added</Text>
            <Text style={styles.bannerSubtitle}>
              {queue.length > 0 ? `${queue.length} songs available` : 'Upload tracks to your library'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999999" />
        </Pressable>

        {/* Songs List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Songs</Text>
        </View>

        {queue.length > 0 ? (
          <View style={styles.tracksWrapper}>
            {queue.map((track) => (
              <TrackListItem key={track.id} track={track} playlistContext={queue} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="cloud-upload-outline" size={48} color="#555555" />
            <Text style={styles.emptyStateTitle}>No Songs Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Tap the Upload tab to add MP3 tracks to your library.
            </Text>
            <Pressable
              style={styles.uploadNowBtn}
              onPress={() => router.push('/upload')}
            >
              <Text style={styles.uploadNowBtnText}>Upload Songs</Text>
            </Pressable>
          </View>
        )}
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
    paddingBottom: 12,
    gap: 12,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  avatarImgSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
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

  /* Banner Card */
  playlistBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1D22',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  bannerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(29, 185, 84, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextGroup: {
    flex: 1,
    marginLeft: 14,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: '#999999',
    fontSize: 13,
    marginTop: 2,
  },

  /* Sections */
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  tracksWrapper: {
    paddingHorizontal: 4,
  },

  /* Empty State */
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyStateSubtitle: {
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  uploadNowBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  uploadNowBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
