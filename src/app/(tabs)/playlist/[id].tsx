import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  TextInput,
  Modal,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_PLAYLISTS, MOCK_TRACKS } from '../../../constants/mockData';
import { TrackListItem } from '../../../components/TrackListItem';
import { useAudio } from '../../../context/AudioContext';

const { width } = Dimensions.get('window');

const FILTER_TAGS = [
  'More discovery tracks',
  'More mollywood vibes',
  'Go deeper into malayalam',
  'Similar artists',
];

export type SortOption =
  | 'Custom order'
  | 'Title (A-Z)'
  | 'Title (Z-A)'
  | 'Artist'
  | 'Album'
  | 'Recently added';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { playTrack, isPlaying, currentTrack, togglePlayPause, queue } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('Custom order');
  const [showSortModal, setShowSortModal] = useState(false);
  const [isHeaderPinned, setIsHeaderPinned] = useState(false);

  const playlist = MOCK_PLAYLISTS.find((p) => p.id === id) || MOCK_PLAYLISTS[0];
  const isNewlyAdded = id === 'pl_newly_added';
  const rawTracks = isNewlyAdded
    ? queue.length > 0
      ? queue
      : MOCK_TRACKS
    : playlist.tracks.length > 0
    ? playlist.tracks
    : MOCK_TRACKS;

  // Search Filter
  let tracks = searchQuery.trim()
    ? rawTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [...rawTracks];

  // Sorting Logic (Proper A-Z, Z-A, Artist, Album, Recently Added)
  if (sortOption === 'Title (A-Z)') {
    tracks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === 'Title (Z-A)') {
    tracks.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortOption === 'Artist') {
    tracks.sort((a, b) => a.artist.localeCompare(b.artist));
  } else if (sortOption === 'Album') {
    tracks.sort((a, b) => a.album.localeCompare(b.album));
  } else if (sortOption === 'Recently added') {
    tracks = [...tracks].reverse();
  }

  const isPlaylistPlaying = tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlayAll = () => {
    if (isPlaylistPlaying) {
      togglePlayPause();
    } else if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 220 && !isHeaderPinned) {
      setIsHeaderPinned(true);
    } else if (y <= 220 && isHeaderPinned) {
      setIsHeaderPinned(false);
    }
  };

  // Dynamic Artist Subtitle & Total Duration Calculation
  const dynamicSubtitle =
    playlist.subtitle && playlist.subtitle !== 'Vidyasagar Mix'
      ? playlist.subtitle
      : Array.from(new Set(rawTracks.map((t) => t.artist)))
          .slice(0, 3)
          .join(', ');

  const totalDurationSecs = rawTracks.reduce((acc, t) => acc + (t.duration || 210), 0);
  const durationHours = Math.floor(totalDurationSecs / 3600);
  const durationMins = Math.floor((totalDurationSecs % 3600) / 60);
  const formattedDuration =
    durationHours > 0 ? `${durationHours}h ${durationMins}m` : `${durationMins} min`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 📌 Pinned Top Header when scrolled down (Sticky title without play button) */}
      {isHeaderPinned && (
        <View style={styles.pinnedHeaderBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.pinnedHeaderTitle} numberOfLines={1}>
            {playlist.title}
          </Text>
          <View style={{ width: 26 }} />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Top Header Bar with Search & Sort matching Spotify screenshot */}
        <View style={styles.topHeaderBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </Pressable>

          {/* Search Box Pill */}
          <View style={styles.searchPill}>
            <Ionicons name="search" size={18} color="#B3B3B3" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Find on this page"
              placeholderTextColor="#999999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#999999" />
              </Pressable>
            )}
          </View>

          {/* Sort Button -> Opens Spotify Sort By Modal */}
          <Pressable style={styles.sortButton} onPress={() => setShowSortModal(true)}>
            <Text style={styles.sortButtonText}>Sort</Text>
          </Pressable>
        </View>

        {/* Large Centered Playlist Cover Image */}
        <View style={styles.coverSection}>
          <View style={styles.coverWrapper}>
            <Image source={{ uri: playlist.cover }} style={styles.coverImage} />
            {/* Spotify Badge on top left of image */}
            <View style={styles.spotifyLogoBadge}>
              <Ionicons name="logo-octocat" size={14} color="#1DB954" />
            </View>
            <View style={styles.coverTitleOverlay}>
              <Text style={styles.coverTitleOverlayText} numberOfLines={2}>
                {playlist.title}
              </Text>
            </View>
          </View>
        </View>

        {/* Dynamic Playlist Meta Details */}
        <View style={styles.metaSection}>
          <Text style={styles.artistsText} numberOfLines={2}>
            {dynamicSubtitle}
          </Text>

          {/* Spotify Brand Row */}
          <View style={styles.spotifyBrandRow}>
            <View style={styles.spotifyGreenCircle}>
              <Ionicons name="logo-octocat" size={12} color="#000000" />
            </View>
            <Text style={styles.spotifyBrandText}>Spotify</Text>
          </View>

          <Text style={styles.aboutText}>
            About recommendations and the impact of promotion
          </Text>
          <Text style={styles.durationText}>{formattedDuration}</Text>
        </View>

        {/* Action Buttons Row matching Spotify screenshot */}
        <View style={styles.actionRow}>
          <View style={styles.actionLeftGroup}>
            {/* Playing track mini thumbnail badge */}
            {currentTrack && (
              <Image source={{ uri: currentTrack.artwork }} style={styles.miniBadgeArtwork} />
            )}
            <Pressable style={styles.circleIconButton}>
              <Ionicons name="add-circle-outline" size={24} color="#B3B3B3" />
            </Pressable>
            <Pressable style={styles.circleIconButton}>
              <Ionicons name="arrow-down-circle-outline" size={24} color="#B3B3B3" />
            </Pressable>
            <Pressable style={styles.circleIconButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#B3B3B3" />
            </Pressable>
          </View>

          <View style={styles.actionRightGroup}>
            <Pressable style={styles.circleIconButton}>
              <Ionicons name="shuffle" size={24} color="#1DB954" />
            </Pressable>
            <Pressable style={styles.bigGreenPlayBtn} onPress={handlePlayAll}>
              <Ionicons
                name={isPlaylistPlaying ? 'pause' : 'play'}
                size={26}
                color="#000000"
                style={{ marginLeft: isPlaylistPlaying ? 0 : 3 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Filter Tag Pills Horizontal Scroll matching Spotify screenshot */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsScroll}
        >
          {FILTER_TAGS.map((tag) => {
            const isActive = activeFilterTag === tag;
            return (
              <Pressable
                key={tag}
                style={[styles.filterTagPill, isActive && styles.activeFilterTagPill]}
                onPress={() => setActiveFilterTag(isActive ? null : tag)}
              >
                <Text style={[styles.filterTagText, isActive && styles.activeFilterTagText]}>
                  {tag}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Track List Section */}
        <View style={styles.tracksSection}>
          {tracks.map((track) => (
            <TrackListItem key={track.id} track={track} playlistContext={tracks} />
          ))}
        </View>
      </ScrollView>

      {/* 🎵 Spotify Sort By Bottom Sheet Modal with A-Z and Z-A */}
      <Modal
        visible={showSortModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
          <Pressable style={styles.sortSheet} onPress={(e) => e.stopPropagation()}>
            {/* Drag Handle Bar */}
            <View style={styles.dragHandle} />

            <Text style={styles.sortSheetTitle}>Sort by</Text>

            <View style={styles.sortOptionsList}>
              {(
                [
                  'Custom order',
                  'Title (A-Z)',
                  'Title (Z-A)',
                  'Artist',
                  'Album',
                  'Recently added',
                ] as SortOption[]
              ).map((option) => {
                const isSelected = sortOption === option;
                return (
                  <Pressable
                    key={option}
                    style={styles.sortOptionRow}
                    onPress={() => {
                      setSortOption(option);
                      setShowSortModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        isSelected && styles.selectedSortOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={22} color="#1DB954" />}
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.cancelBtn} onPress={() => setShowSortModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 160,
  },

  /* 📌 Pinned Header Style (Clean Title Header) */
  pinnedHeaderBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  pinnedHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  /* Top Header Bar */
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  backButton: {
    padding: 4,
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#383838',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 0,
  },
  sortButton: {
    backgroundColor: '#535353',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sortButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  /* Centered Playlist Cover */
  coverSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  coverWrapper: {
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#282828',
    elevation: 8,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  spotifyLogoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  coverTitleOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  coverTitleOverlayText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* Playlist Metadata */
  metaSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  artistsText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  spotifyBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  spotifyGreenCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotifyBrandText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  aboutText: {
    color: '#B3B3B3',
    fontSize: 13,
    marginTop: 2,
  },
  durationText: {
    color: '#B3B3B3',
    fontSize: 13,
    marginTop: 4,
  },

  /* Actions Bar Row */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  actionLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  miniBadgeArtwork: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  circleIconButton: {
    padding: 4,
  },
  actionRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bigGreenPlayBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  /* Filter Tag Pills */
  filterPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterTagPill: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilterTagPill: {
    backgroundColor: '#1DB954',
  },
  filterTagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterTagText: {
    color: '#000000',
  },

  /* Track List */
  tracksSection: {
    paddingHorizontal: 4,
  },

  /* 🎵 Spotify Sort By Bottom Sheet Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sortSheet: {
    backgroundColor: '#242424',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#535353',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sortSheetTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sortOptionsList: {
    gap: 4,
  },
  sortOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sortOptionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  selectedSortOptionText: {
    color: '#1DB954',
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
