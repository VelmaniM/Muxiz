import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Track } from '../constants/mockData';
import { useAudio } from '../context/AudioContext';
import { EqualizerAnimation } from './EqualizerAnimation';
import { Colors } from '../constants/colors';

import { getCleanTitleOnly } from '../services/metadataService';

interface TrackListItemProps {
  track: Track;
  playlistContext?: Track[];
}

export const TrackListItem: React.FC<TrackListItemProps> = ({ track, playlistContext }) => {
  const router = useRouter();
  const { currentTrack, isPlaying, playTrack, togglePlayPause, likedTrackIds, toggleFavorite, addToQueue } = useAudio();

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isLiked = likedTrackIds.has(track.id);

  const handlePress = () => {
    if (isCurrentTrack) {
      if (!isPlaying) {
        togglePlayPause();
      }
      // Clicked again on currently playing song -> Navigate to full player screen
      router.push('/player');
    } else {
      // First click -> Start playing right here on this page without pushing player modal
      playTrack(track, playlistContext);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShare = async () => {
    try {
      setShowOptionsModal(false);
      await Share.share({
        message: `Listen to "${getCleanTitleOnly(track.title)}" by ${track.artist} on Muxiz! ${track.audioUrl}`,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  const handleAddToQueue = () => {
    addToQueue(track);
    setShowOptionsModal(false);
    Alert.alert('Added to Queue', `"${getCleanTitleOnly(track.title)}" added to your queue.`);
  };

  const handleGoToQueue = () => {
    setShowOptionsModal(false);
    router.push('/player');
  };

  const cleanTitle = getCleanTitleOnly(track.title);

  return (
    <>
      <Pressable style={styles.container} onPress={handlePress}>
        {/* Artwork */}
        <View style={styles.artworkContainer}>
          <Image source={{ uri: track.artwork }} style={styles.artwork} />
          {isCurrentTrack && (
            <View style={styles.playingOverlay}>
              {isPlaying ? (
                <EqualizerAnimation isPlaying={isPlaying} color={Colors.primary} size="small" barCount={3} />
              ) : (
                <Ionicons name="play" size={16} color={Colors.primary} />
              )}
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.title, isCurrentTrack && { color: Colors.primary }]} numberOfLines={1}>
            {cleanTitle}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>

        {/* Track Duration */}
        <Text style={styles.duration}>{formatTime(track.duration)}</Text>

        {/* Like / Heart Icon */}
        <Pressable
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(track.id);
          }}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? Colors.primary : Colors.textMuted}
          />
        </Pressable>

        {/* 3-Dot Options Icon */}
        <Pressable
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            setShowOptionsModal(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={Colors.textMuted} />
        </Pressable>
      </Pressable>

      {/* 🎵 Spotify 3-Dot Track Options Bottom Sheet Modal matching screenshot */}
      <Modal
        visible={showOptionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowOptionsModal(false)}>
          <Pressable style={styles.optionsSheet} onPress={(e) => e.stopPropagation()}>
            {/* Top Drag Handle Bar */}
            <View style={styles.dragHandle} />

            {/* Track Info Header */}
            <View style={styles.sheetTrackHeader}>
              <Image source={{ uri: track.artwork }} style={styles.sheetArtwork} />
              <View style={styles.sheetMetaWrapper}>
                <Text style={styles.sheetTitle} numberOfLines={1}>
                  {cleanTitle}
                </Text>
                <Text style={styles.sheetArtist} numberOfLines={1}>
                  {track.artist}
                </Text>
              </View>
            </View>

            {/* Options List matching user screenshot */}
            <View style={styles.optionsList}>
              {/* Share */}
              <Pressable style={styles.optionRow} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Share</Text>
              </Pressable>

              {/* Add to Liked Songs */}
              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  toggleFavorite(track.id);
                  setShowOptionsModal(false);
                }}
              >
                <LinearGradient colors={['#450AF5', '#8E44AD']} style={styles.likedSquareIcon}>
                  <Ionicons name="heart" size={14} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.optionText}>
                  {isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
                </Text>
              </Pressable>

              {/* Add to playlist */}
              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  setShowOptionsModal(false);
                  Alert.alert('Add to Playlist', `Added "${track.title}" to playlist.`);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Add to playlist</Text>
              </Pressable>

              {/* Hide in this playlist */}
              <Pressable
                style={styles.optionRow}
                onPress={() => setShowOptionsModal(false)}
              >
                <Ionicons name="close-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Hide in this playlist</Text>
              </Pressable>

              {/* Exclude track from your taste profile */}
              <Pressable
                style={styles.optionRow}
                onPress={() => setShowOptionsModal(false)}
              >
                <Ionicons name="remove-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Exclude track from your taste profile</Text>
              </Pressable>

              {/* Add to Queue */}
              <Pressable style={styles.optionRow} onPress={handleAddToQueue}>
                <Ionicons name="list-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Add to Queue</Text>
              </Pressable>

              {/* Go to Queue */}
              <Pressable style={styles.optionRow} onPress={handleGoToQueue}>
                <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Go to Queue</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  artworkContainer: {
    position: 'relative',
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  playingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  duration: {
    color: Colors.textMuted,
    fontSize: 12,
    marginRight: 12,
  },
  actionButton: {
    padding: 6,
  },

  /* 🎵 Options Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  optionsSheet: {
    backgroundColor: '#1C1D22',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTrackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  sheetArtwork: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  sheetMetaWrapper: {
    marginLeft: 14,
    flex: 1,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sheetArtist: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  optionsList: {
    gap: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 16,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  likedSquareIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
