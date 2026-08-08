import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../context/AudioContext';
import { Colors } from '../constants/colors';

export const MiniPlayer: React.FC = () => {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, positionMillis, durationMillis } = useAudio();

  if (!currentTrack) return null;

  const progressPercent = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

  return (
    <Pressable style={styles.container} onPress={() => router.push('/player')}>
      {/* Top progress bar line */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, progressPercent))}%` }]} />
      </View>

      <View style={styles.contentRow}>
        {/* Track Artwork */}
        <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />

        {/* Track Title & Artist */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {currentTrack.title}
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
              size={32}
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
            <Ionicons name="play-skip-forward" size={22} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(22, 24, 30, 0.96)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginHorizontal: 10,
    marginBottom: 4,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
    height: 60,
  },
  progressBarBackground: {
    height: 2.5,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 57.5,
  },
  artwork: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
    justifyContent: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    padding: 4,
  },
});
