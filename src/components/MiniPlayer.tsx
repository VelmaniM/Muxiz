import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../context/AudioContext';
import { Colors } from '../constants/colors';
import { getCleanTitleOnly } from '../services/metadataService';

export const MiniPlayer: React.FC = () => {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, positionMillis, durationMillis } = useAudio();

  if (!currentTrack) return null;

  const progressPercent = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;
  const cleanTitle = getCleanTitleOnly(currentTrack.title);

  return (
    <Pressable style={styles.container} onPress={() => router.push('/player')}>
      {/* Top progress bar line */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, progressPercent))}%` }]} />
      </View>

      <View style={styles.contentRow}>
        {/* Album Art Thumbnail: 56px by 56px square */}
        <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />

        {/* Track Title & Artist */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {cleanTitle}
          </Text>
          <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
            {currentTrack.artist}
          </Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsRow}>
          <Pressable
            hitSlop={12}
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            style={styles.controlButton}
          >
            <Ionicons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={36}
              color={Colors.textPrimary}
            />
          </Pressable>

          <Pressable
            hitSlop={12}
            onPress={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            style={styles.controlButton}
          >
            <Ionicons name="play-skip-forward" size={24} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    height: 90, // Exact 90px total height specified by user
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  progressBarBackground: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 87, // 90px total height minus 3px progress line
  },
  artwork: {
    width: 56, // Exact 56px width specified by user
    height: 56, // Exact 56px height specified by user
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  artist: {
    color: '#A7A7A7',
    fontSize: 12,
    marginTop: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    padding: 4,
  },
});
