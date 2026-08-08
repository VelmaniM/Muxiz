import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  Share,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useAudio } from '../context/AudioContext';
import { EqualizerAnimation } from '../components/EqualizerAnimation';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  const {
    currentTrack,
    isPlaying,
    positionMillis,
    durationMillis,
    togglePlayPause,
    seekTo,
    nextTrack,
    previousTrack,
    likedTrackIds,
    toggleFavorite,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    queue,
    playTrack,
    addNewTrackAndPlay,
  } = useAudio();

  if (!currentTrack) return null;

  const isLiked = likedTrackIds.has(currentTrack.id);

  const formatTime = (millis: number) => {
    if (!millis || millis < 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatRemainingTime = (currentMillis: number, totalMillis: number) => {
    const remaining = totalMillis - currentMillis;
    if (remaining <= 0) return '-0:00';
    return `-${formatTime(remaining)}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Listening to "${currentTrack.title}" by ${currentTrack.artist} on Spotify & Apple Music!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleSleepTimer = () => {
    Alert.alert(
      'Sleep Timer',
      'Select time to automatically stop playback:',
      [
        { text: 'Off', onPress: () => setSleepTimerMinutes(null) },
        { text: '15 Minutes', onPress: () => setSleepTimerMinutes(15) },
        { text: '30 Minutes', onPress: () => setSleepTimerMinutes(30) },
        { text: '45 Minutes', onPress: () => setSleepTimerMinutes(45) },
        { text: '60 Minutes', onPress: () => setSleepTimerMinutes(60) },
      ]
    );
  };

  const backgroundGradients = currentTrack.gradient || ['#1DB954', '#0B0C10'];

  const lyricLines = currentTrack.lyrics && currentTrack.lyrics.length > 0
    ? currentTrack.lyrics
    : [`${currentTrack.title} - ${currentTrack.artist}`, "Playing live audio stream"];

  const currentLyricIndex = durationMillis > 0
    ? Math.floor((positionMillis / durationMillis) * lyricLines.length)
    : 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={backgroundGradients} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="chevron-down" size={28} color={Colors.textPrimary} />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Text style={styles.headerSubtitle}>PLAYING FROM PLAYLIST</Text>
              {isPlaying && <EqualizerAnimation isPlaying={isPlaying} color={Colors.primary} size="small" barCount={3} />}
            </View>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {currentTrack.album || 'Top Hits'}
            </Text>
          </View>

          {/* Three Dots -> Opens Spotify More Options Sheet */}
          <Pressable style={styles.headerButton} onPress={() => setShowMoreOptionsModal(true)}>
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Large Album Artwork */}
          <View style={styles.artworkWrapper}>
            <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
          </View>

          {/* Song Title, Artist & Action Icons */}
          <View style={styles.infoRow}>
            <View style={styles.trackDetails}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <Pressable onPress={() => toggleFavorite(currentTrack.id)} style={styles.iconPad}>
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isLiked ? Colors.primary : Colors.textPrimary}
                />
              </Pressable>
              <Pressable style={styles.iconPad} onPress={() => Alert.alert('Saved', `Added "${currentTrack.title}" to library`)}>
                <Ionicons name="add-circle-outline" size={26} color={Colors.textPrimary} />
              </Pressable>
            </View>
          </View>

          {/* Audio Scrubber Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={durationMillis || 1}
              value={positionMillis}
              minimumTrackTintColor={Colors.textPrimary}
              maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              thumbTintColor={Colors.textPrimary}
              onSlidingComplete={(value) => seekTo(value)}
            />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
              <Text style={styles.timeText}>
                {formatRemainingTime(positionMillis, durationMillis)}
              </Text>
            </View>
          </View>

          {/* Main Controls Row */}
          <View style={styles.controlsRow}>
            <Pressable onPress={toggleShuffle} style={styles.iconPad}>
              <Ionicons
                name="shuffle"
                size={24}
                color={isShuffle ? Colors.primary : Colors.textMuted}
              />
            </Pressable>

            <Pressable onPress={previousTrack} style={styles.iconPad}>
              <Ionicons name="play-skip-back" size={32} color={Colors.textPrimary} />
            </Pressable>

            <Pressable style={styles.playButton} onPress={togglePlayPause}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={34}
                color="#000000"
                style={{ marginLeft: isPlaying ? 0 : 4 }}
              />
            </Pressable>

            <Pressable onPress={nextTrack} style={styles.iconPad}>
              <Ionicons name="play-skip-forward" size={32} color={Colors.textPrimary} />
            </Pressable>

            <Pressable onPress={toggleRepeat} style={styles.iconPad}>
              <Ionicons
                name={repeatMode === 'one' ? 'repeat-outline' : 'repeat'}
                size={24}
                color={repeatMode !== 'off' ? Colors.primary : Colors.textMuted}
              />
            </Pressable>
          </View>

          {/* Utility Action Row */}
          <View style={styles.utilityRow}>
            <Pressable style={styles.utilityIcon}>
              <Ionicons name="hardware-chip-outline" size={22} color={Colors.textSecondary} />
            </Pressable>

            <View style={styles.utilityRightGroup}>
              <Pressable style={styles.utilityIcon} onPress={handleShare}>
                <Ionicons name="share-outline" size={22} color={Colors.textSecondary} />
              </Pressable>

              {/* Queue Icon -> Opens Spotify Queue Modal */}
              <Pressable style={styles.utilityIcon} onPress={() => setShowQueueModal(true)}>
                <Ionicons name="list" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>
          </View>


        </ScrollView>
      </SafeAreaView>

      {/* 🎵 Spotify Style Queue Bottom Sheet Modal */}
      <Modal
        visible={showQueueModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQueueModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowQueueModal(false)}
          />

          <View style={styles.queueSheetContainer}>
            {/* Sheet Top Handle */}
            <View style={styles.sheetHandle} />

            {/* Queue Header */}
            <View style={styles.queueHeaderRow}>
              <View>
                <Text style={styles.queueHeaderTitle}>Queue</Text>
                <Text style={styles.queueHeaderSubtitle}>
                  Playing <Text style={styles.queueHeaderSubtitleBold}>{currentTrack.album || 'Hits'}</Text>
                </Text>
              </View>

              <Pressable style={styles.editPillButton}>
                <Text style={styles.editPillText}>Edit</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.queueListScroll}>
              {/* Currently Playing Track */}
              <View style={styles.queueTrackRowActive}>
                <Image source={{ uri: currentTrack.artwork }} style={styles.queueArt} />
                <View style={styles.queueTextContainer}>
                  <Text style={styles.queueTitleActive} numberOfLines={1}>
                    ... {currentTrack.title}
                  </Text>
                  <Text style={styles.queueArtistText} numberOfLines={1}>
                    {currentTrack.artist}
                  </Text>
                </View>
                <Pressable onPress={togglePlayPause} style={styles.queuePlayCircleBtn}>
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={20}
                    color="#000000"
                    style={{ marginLeft: isPlaying ? 0 : 2 }}
                  />
                </Pressable>
              </View>

              {/* Up Next List */}
              {queue.map((track, idx) => {
                if (track.id === currentTrack.id) return null;
                return (
                  <Pressable
                    key={track.id + '_' + idx}
                    style={styles.queueTrackRow}
                    onPress={() => playTrack(track, queue)}
                  >
                    <Image source={{ uri: track.artwork }} style={styles.queueArt} />
                    <View style={styles.queueTextContainer}>
                      <Text style={styles.queueTitleText} numberOfLines={1}>
                        {track.title}
                      </Text>
                      <Text style={styles.queueArtistText} numberOfLines={1}>
                        {track.artist}
                      </Text>
                    </View>
                    <Ionicons name="reorder-two-outline" size={24} color={Colors.textMuted} />
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Bottom 3 Control Pills */}
            <View style={styles.queueBottomPillRow}>
              <Pressable
                style={[styles.queueControlPill, isShuffle && styles.queueControlPillActive]}
                onPress={toggleShuffle}
              >
                <Ionicons
                  name="shuffle"
                  size={20}
                  color={isShuffle ? '#000000' : Colors.textPrimary}
                />
                <Text
                  style={[
                    styles.queueControlPillText,
                    isShuffle && styles.queueControlPillTextActive,
                  ]}
                >
                  Shuffle
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.queueControlPill,
                  repeatMode !== 'off' && styles.queueControlPillActive,
                ]}
                onPress={toggleRepeat}
              >
                <Ionicons
                  name={repeatMode === 'one' ? 'repeat-outline' : 'repeat'}
                  size={20}
                  color={repeatMode !== 'off' ? '#000000' : Colors.textPrimary}
                />
                <Text
                  style={[
                    styles.queueControlPillText,
                    repeatMode !== 'off' && styles.queueControlPillTextActive,
                  ]}
                >
                  Repeat
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.queueControlPill,
                  sleepTimerMinutes !== null && styles.queueControlPillActive,
                ]}
                onPress={handleSleepTimer}
              >
                <Ionicons
                  name="timer-outline"
                  size={20}
                  color={sleepTimerMinutes !== null ? '#000000' : Colors.textPrimary}
                />
                <Text
                  style={[
                    styles.queueControlPillText,
                    sleepTimerMinutes !== null && styles.queueControlPillTextActive,
                  ]}
                >
                  {sleepTimerMinutes ? `${sleepTimerMinutes}m` : 'Timer'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔮 Spotify Style Three-Dot More Options Bottom Sheet Modal */}
      <Modal
        visible={showMoreOptionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMoreOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowMoreOptionsModal(false)}
          />

          <View style={styles.moreOptionsSheetContainer}>
            {/* Sheet Handle */}
            <View style={styles.sheetHandle} />

            {/* Track Header Card */}
            <View style={styles.moreOptionsHeaderCard}>
              <Image source={{ uri: currentTrack.artwork }} style={styles.moreOptionsArt} />
              <View style={styles.moreOptionsHeaderText}>
                <Text style={styles.moreOptionsTrackTitle} numberOfLines={1}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.moreOptionsArtistName} numberOfLines={1}>
                  {currentTrack.artist} • {currentTrack.album}
                </Text>
              </View>
            </View>

            <View style={styles.sheetDivider} />

            {/* Action Items List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  handleShare();
                }}
              >
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Share</Text>
              </Pressable>

              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  setIsLyricsExpanded(prev => !prev);
                }}
              >
                <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Lyrics • On</Text>
              </Pressable>

              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  toggleFavorite(currentTrack.id);
                  setShowMoreOptionsModal(false);
                }}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isLiked ? Colors.primary : '#FFFFFF'}
                />
                <Text style={styles.optionText}>
                  {isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  Alert.alert('Playlist', `Added "${currentTrack.title}" to playlist`);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Add to playlist</Text>
              </Pressable>

              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  Alert.alert('Hidden', `"${currentTrack.title}" hidden in this playlist`);
                }}
              >
                <Ionicons name="close-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Hide in this playlist</Text>
              </Pressable>

              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  Alert.alert('Excluded', 'Track excluded from your taste profile');
                }}
              >
                <Ionicons name="remove-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Exclude track from your taste profile</Text>
              </Pressable>

              <Pressable
                style={styles.optionRow}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  Alert.alert('Queue', `Added "${currentTrack.title}" to queue`);
                }}
              >
                <Ionicons name="list-outline" size={24} color="#FFFFFF" />
                <Text style={styles.optionText}>Add to Queue</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
  },
  headerButton: {
    padding: 6,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1.2,
  },
  headerTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  artworkWrapper: {
    width: width - 48,
    height: width - 48,
    maxHeight: 360,
    maxWidth: 360,
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  trackDetails: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  artistName: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconPad: {
    padding: 8,
  },
  sliderContainer: {
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -6,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 8,
  },
  playButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  utilityIcon: {
    padding: 8,
  },
  utilityRightGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  lyricsCard: {
    backgroundColor: '#D81B60',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  lyricsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lyricsCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  lyricsCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cardIconButton: {
    padding: 4,
  },
  lyricsBody: {
    gap: 6,
  },
  lyricsLine: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 24,
  },
  lyricsLineActive: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  /* Common Modal Overlay & Backdrop */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },

  /* 🎵 Queue Bottom Sheet Styles */
  queueSheetContainer: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  queueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  queueHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  queueHeaderSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  queueHeaderSubtitleBold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  editPillButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  queueListScroll: {
    maxHeight: 380,
  },
  queueTrackRowActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  queueTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  queueArt: {
    width: 46,
    height: 46,
    borderRadius: 8,
  },
  queueTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  queueTitleActive: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1DB954',
  },
  queueTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  queueArtistText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  queuePlayCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueBottomPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  queueControlPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  queueControlPillActive: {
    backgroundColor: '#FFFFFF',
  },
  queueControlPillText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  queueControlPillTextActive: {
    color: '#000000',
  },

  /* 🔮 More Options Bottom Sheet Styles */
  moreOptionsSheetContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
    maxHeight: '80%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  moreOptionsHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  moreOptionsArt: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  moreOptionsHeaderText: {
    flex: 1,
    marginLeft: 14,
  },
  moreOptionsTrackTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  moreOptionsArtistName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
