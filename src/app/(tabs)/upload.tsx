import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { uploadToCloudinary } from '../../config/cloudinary';
import { saveTrackToFirestore } from '../../services/trackService';
import { extractAudioFileMetadata, TrackMetadata } from '../../services/metadataService';
import { useAudio } from '../../context/AudioContext';
import { Colors } from '../../constants/colors';
import { Track } from '../../constants/mockData';

export default function UploadScreen() {
  const { addNewTrackAndPlay } = useAudio();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [lastUploadedTrack, setLastUploadedTrack] = useState<TrackMetadata | null>(null);
  const [createdTrackObject, setCreatedTrackObject] = useState<Track | null>(null);

  // GPay Style Success Modal State
  const [showGPaySuccess, setShowGPaySuccess] = useState(false);

  // AbortController ref to cancel upload mid-way
  const abortControllerRef = useRef<AbortController | null>(null);

  // Single-Click Upload Handler with Cancel Support
  const handleSelectAndUpload = async () => {
    try {
      // Create new AbortController instance
      abortControllerRef.current = new AbortController();

      // 1. Open File Picker
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];

      setIsUploading(true);
      setUploadStatus('Uploading song...');

      // Check if cancelled
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('UPLOAD_CANCELLED');
      }

      // 2. Extract Real Track Metadata & Official Spotify Cover Artwork
      const metadata = await extractAudioFileMetadata(asset.name);
      setLastUploadedTrack(metadata);

      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('UPLOAD_CANCELLED');
      }

      // 3. Upload Audio File to Cloudinary
      const audioUploadRes = await uploadToCloudinary(
        asset.uri,
        asset.name,
        'video'
      );

      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('UPLOAD_CANCELLED');
      }

      setUploadStatus('Upload successful! Saved to Database');

      // 4. Save Metadata to Firestore Database
      const newTrack = await saveTrackToFirestore({
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        genre: metadata.genre,
        audioUrl: audioUploadRes.secure_url,
        artwork: metadata.artwork,
        duration: Math.round(audioUploadRes.duration || 210),
        lyrics: metadata.lyrics,
        gradient: ['#1DB954', '#0B0C10'],
      });

      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('UPLOAD_CANCELLED');
      }

      setCreatedTrackObject(newTrack);
      setIsUploading(false);

      // Trigger GPay Style Success Screen!
      setShowGPaySuccess(true);
    } catch (error: any) {
      if (error?.message === 'UPLOAD_CANCELLED') {
        console.log('Upload cancelled by user.');
        Alert.alert('Cancelled', 'Upload cancelled. Nothing was saved to Database.');
      } else {
        console.log('Upload error:', error);
      }
      setIsUploading(false);
      setUploadStatus('');
      abortControllerRef.current = null;
    }
  };

  // Cancel Upload Button Handler
  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploading(false);
    setUploadStatus('');
  };

  // Play Now from GPay Modal
  const handlePlayNow = () => {
    if (createdTrackObject && addNewTrackAndPlay) {
      addNewTrackAndPlay(createdTrackObject);
    }
    setShowGPaySuccess(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add to Library</Text>
          <Text style={styles.headerSubtitle}>
            Upload MP3 tracks directly to your Muxiz cloud
          </Text>
        </View>

        {/* Sleek Spotify Upload Card */}
        <View style={styles.spotifyUploadCard}>
          {isUploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color="#1DB954" />
              <Text style={styles.uploadingTitle}>Uploading Song...</Text>
              <Text style={styles.uploadingSubtitle}>{uploadStatus}</Text>

              {/* 🚫 Cancel Upload Button */}
              <Pressable style={styles.cancelButton} onPress={handleCancelUpload}>
                <Ionicons name="close-circle" size={20} color="#FF7675" />
                <Text style={styles.cancelButtonText}>Cancel Upload</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.dropzonePressable} onPress={handleSelectAndUpload}>
              <View style={styles.spotifyIconCircle}>
                <Ionicons name="cloud-upload" size={40} color="#1DB954" />
              </View>
              <Text style={styles.cardTitle}>Choose MP3 Song</Text>
              <Text style={styles.cardSubtitle}>
                Tap to pick audio file from phone or Mac
              </Text>
              <View style={styles.selectPillBtn}>
                <Text style={styles.selectPillText}>Select File</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Extracted Song Details Card */}
        {lastUploadedTrack && !isUploading && (
          <View style={styles.spotifyTrackCard}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="checkmark-circle" size={20} color="#1DB954" />
              <Text style={styles.cardHeaderTitle}>Recently Uploaded</Text>
            </View>

            <View style={styles.trackItemRow}>
              <Image source={{ uri: lastUploadedTrack.artwork }} style={styles.trackArt} />
              <View style={styles.trackMetaInfo}>
                <Text style={styles.trackMetaTitle} numberOfLines={1}>
                  {lastUploadedTrack.title}
                </Text>
                <Text style={styles.trackMetaArtist} numberOfLines={1}>
                  {lastUploadedTrack.artist} • {lastUploadedTrack.album}
                </Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.badgeText}>Cloudinary CDN</Text>
                  <Text style={styles.badgeText}>Firestore DB</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 💳 GPay Style Success Full Screen Modal */}
      <Modal
        visible={showGPaySuccess}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowGPaySuccess(false)}
      >
        <LinearGradient
          colors={['#00B894', '#009473', '#0984E3', '#0B0C10']}
          style={styles.gpayModalContainer}
        >
          <SafeAreaView style={styles.gpaySafeContent}>
            {/* Close Button */}
            <Pressable
              style={styles.gpayCloseBtn}
              onPress={() => setShowGPaySuccess(false)}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </Pressable>

            {/* Animated Check Circle */}
            <View style={styles.gpayCheckOuterCircle}>
              <View style={styles.gpayCheckInnerCircle}>
                <Ionicons name="checkmark" size={64} color="#00B894" />
              </View>
            </View>

            {/* GPay Success Amount/Title */}
            <Text style={styles.gpaySuccessTitle}>Song Published!</Text>
            <Text style={styles.gpaySuccessSubtitle}>
              Saved to Cloudinary CDN & Firebase Firestore DB
            </Text>

            {/* Track Info Box */}
            {lastUploadedTrack && (
              <View style={styles.gpayTrackCard}>
                <Image
                  source={{ uri: lastUploadedTrack.artwork }}
                  style={styles.gpayArtwork}
                />
                <Text style={styles.gpayTrackTitle} numberOfLines={1}>
                  {lastUploadedTrack.title}
                </Text>
                <Text style={styles.gpayArtistName} numberOfLines={1}>
                  {lastUploadedTrack.artist} • {lastUploadedTrack.album}
                </Text>
                <View style={styles.gpayBadgeRow}>
                  <View style={styles.gpayBadge}>
                    <Ionicons name="cloud-done" size={14} color="#1DB954" />
                    <Text style={styles.gpayBadgeText}>Cloudinary CDN</Text>
                  </View>
                  <View style={styles.gpayBadge}>
                    <Ionicons name="server" size={14} color="#0984E3" />
                    <Text style={styles.gpayBadgeText}>Firestore DB</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.gpayActionWrapper}>
              <Pressable style={styles.gpayPlayBtn} onPress={handlePlayNow}>
                <Ionicons name="play" size={22} color="#000000" />
                <Text style={styles.gpayPlayBtnText}>Play Song Now</Text>
              </Pressable>

              <Pressable
                style={styles.gpayDoneBtn}
                onPress={() => setShowGPaySuccess(false)}
              >
                <Text style={styles.gpayDoneBtnText}>Done</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 160,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  spotifyUploadCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dropzonePressable: {
    alignItems: 'center',
    width: '100%',
  },
  spotifyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(29, 185, 84, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(29, 185, 84, 0.3)',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  selectPillBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  selectPillText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  uploadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  uploadingSubtitle: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 6,
    fontWeight: '600',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 118, 117, 0.12)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 118, 117, 0.3)',
    gap: 8,
  },
  cancelButtonText: {
    color: '#FF7675',
    fontSize: 14,
    fontWeight: '700',
  },
  spotifyTrackCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardHeaderTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  trackItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackArt: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },
  trackMetaInfo: {
    marginLeft: 12,
    flex: 1,
  },
  trackMetaTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  trackMetaArtist: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.primary,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
  },

  /* 💳 GPay Success Modal Styles */
  gpayModalContainer: {
    flex: 1,
  },
  gpaySafeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  gpayCloseBtn: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  gpayCheckOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  gpayCheckInnerCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  gpaySuccessTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 16,
  },
  gpaySuccessSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 6,
  },
  gpayTrackCard: {
    backgroundColor: 'rgba(22, 24, 30, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 20,
  },
  gpayArtwork: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginBottom: 12,
  },
  gpayTrackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gpayArtistName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  gpayBadgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  gpayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  gpayBadgeText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  gpayActionWrapper: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  gpayPlayBtn: {
    backgroundColor: '#1DB954',
    borderRadius: 28,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  gpayPlayBtnText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '900',
  },
  gpayDoneBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 28,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpayDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
