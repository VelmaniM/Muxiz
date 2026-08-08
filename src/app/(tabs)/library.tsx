import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MOCK_PLAYLISTS, Playlist } from '../../constants/mockData';
import { Colors } from '../../constants/colors';
import { useAudio } from '../../context/AudioContext';
import { ProfileDrawer } from '../../components/ProfileDrawer';

export default function LibraryScreen() {
  const router = useRouter();
  const { likedTrackIds } = useAudio();

  const [activeFilter, setActiveFilter] = useState<'Playlists' | 'Artists'>('Playlists');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDrawer, setShowDrawer] = useState(false);

  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>([]);

  // Create Playlist Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }
    const newPl: Playlist = {
      id: 'pl_custom_' + Date.now(),
      title: newPlaylistTitle.trim(),
      subtitle: 'Playlist • Velmanikandan',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      tracks: [],
      followers: 'Velmanikandan',
    };
    setCustomPlaylists(prev => [newPl, ...prev]);
    setNewPlaylistTitle('');
    setShowCreateModal(false);
  };

  // Combine default & user custom playlists
  const allLibraryPlaylists = [
    ...MOCK_PLAYLISTS,
    ...customPlaylists,
  ];

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'list' ? 'grid' : 'list'));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Bar matching Spotify Screenshot */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Pressable style={styles.avatar} onPress={() => setShowDrawer(true)}>
            <Text style={styles.avatarEmoji}>🥷</Text>
          </Pressable>
          <Text style={styles.title}>Your Library</Text>
        </View>

        <View style={styles.headerIcons}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/search')}>
            <Ionicons name="search" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add" size={28} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* Filter Chips (Playlists / Artists) */}
      <View style={styles.filterRow}>
        <Pressable
          style={[
            styles.filterChip,
            activeFilter === 'Playlists' && styles.activeFilterChip,
          ]}
          onPress={() => setActiveFilter('Playlists')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'Playlists' && styles.activeFilterText,
            ]}
          >
            Playlists
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            activeFilter === 'Artists' && styles.activeFilterChip,
          ]}
          onPress={() => setActiveFilter('Artists')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'Artists' && styles.activeFilterText,
            ]}
          >
            Artists
          </Text>
        </Pressable>
      </View>

      {/* Sub-Header Row: Recents & Interactive View Toggle (List <-> Grid) */}
      <View style={styles.subHeaderRow}>
        <Pressable style={styles.recentsButton}>
          <Ionicons name="swap-vertical" size={16} color={Colors.textPrimary} />
          <Text style={styles.recentsText}>Recents</Text>
        </Pressable>

        <Pressable style={styles.viewToggleIcon} onPress={toggleViewMode}>
          <Ionicons
            name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
            size={22}
            color={Colors.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* LIST VIEW MODE */}
        {viewMode === 'list' ? (
          <View style={styles.listViewContainer}>
            {/* 1. Liked Songs Row */}
            <Pressable
              style={styles.libraryItemRow}
              onPress={() => router.push('/playlist/pl_newly_added')}
            >
              <LinearGradient
                colors={['#450AF5', '#8E44AD']}
                style={styles.likedIconContainer}
              >
                <Ionicons name="heart" size={28} color="#FFFFFF" />
              </LinearGradient>

              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>Liked Songs</Text>
                <Text style={styles.itemSubtitle}>
                  Playlist • {likedTrackIds.size} songs
                </Text>
              </View>
            </Pressable>

            {/* 2. Playlist Rows */}
            {allLibraryPlaylists.map((pl) => (
              <Pressable
                key={pl.id}
                style={styles.libraryItemRow}
                onPress={() => router.push(`/playlist/${pl.id}` as any)}
              >
                <Image source={{ uri: pl.cover }} style={styles.itemCover} />
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {pl.title}
                  </Text>
                  <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {pl.subtitle}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          /* 2-COLUMN GRID VIEW MODE */
          <View style={styles.gridViewContainer}>
            {/* Liked Songs Grid Card */}
            <Pressable
              style={styles.gridCardItem}
              onPress={() => router.push('/playlist/pl_newly_added')}
            >
              <LinearGradient
                colors={['#450AF5', '#8E44AD']}
                style={styles.gridLikedIcon}
              >
                <Ionicons name="heart" size={36} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.gridItemTitle} numberOfLines={1}>
                Liked Songs
              </Text>
              <Text style={styles.gridItemSubtitle} numberOfLines={1}>
                Playlist • {likedTrackIds.size} songs
              </Text>
            </Pressable>

            {/* Playlist Grid Cards */}
            {allLibraryPlaylists.map((pl) => (
              <Pressable
                key={pl.id}
                style={styles.gridCardItem}
                onPress={() => router.push(`/playlist/${pl.id}` as any)}
              >
                <Image source={{ uri: pl.cover }} style={styles.gridCoverImage} />
                <Text style={styles.gridItemTitle} numberOfLines={1}>
                  {pl.title}
                </Text>
                <Text style={styles.gridItemSubtitle} numberOfLines={1}>
                  {pl.subtitle}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ➕ Create New Playlist Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Give your playlist a name</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="New Playlist Name"
              placeholderTextColor={Colors.textMuted}
              value={newPlaylistTitle}
              onChangeText={setNewPlaylistTitle}
              autoFocus
            />

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.modalCreateBtn} onPress={handleCreatePlaylist}>
                <Text style={styles.modalCreateText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  filterChip: {
    backgroundColor: '#282828',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilterChip: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#000000',
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  recentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentsText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  viewToggleIcon: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },

  /* List View Styles */
  listViewContainer: {
    gap: 4,
  },
  libraryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  likedIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCover: {
    width: 64,
    height: 64,
    borderRadius: 6,
  },
  itemTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  itemTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  /* Grid View Styles */
  gridViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 8,
  },
  gridCardItem: {
    width: '48%',
    marginBottom: 12,
  },
  gridLikedIcon: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCoverImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  gridItemTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  gridItemSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#282828',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#3E3E3E',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  modalCreateBtn: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  modalCreateText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
});
