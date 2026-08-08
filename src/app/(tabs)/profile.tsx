import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAudio } from '../../context/AudioContext';
import { useProfile } from '../../context/ProfileContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { queue } = useAudio();
  const {
    profileName,
    profileHandle,
    profileImage,
    isUploadingAvatar,
    updateProfileDetails,
    pickAndUploadAvatar,
  } = useProfile();

  const [showEditModal, setShowEditModal] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [tempHandle, setTempHandle] = useState(profileHandle);

  const handleSaveProfile = () => {
    updateProfileDetails(tempName, tempHandle);
    setShowEditModal(false);
    Alert.alert('Profile Saved', 'Your profile details have been updated!');
  };

  const handlePickAvatar = async () => {
    const newAvatarUrl = await pickAndUploadAvatar();
    if (newAvatarUrl) {
      Alert.alert('Avatar Updated', 'Your profile picture has been saved!');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header Back Button matching Spotify Screenshot 2 */}
      <View style={styles.headerBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Info matching Spotify Screenshot 2 */}
        <View style={styles.profileHeader}>
          {/* Avatar Image Picker Circle */}
          <Pressable style={styles.avatarTouchArea} onPress={handlePickAvatar}>
            {isUploadingAvatar ? (
              <View style={styles.purpleAvatarCircle}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImageBig} />
            ) : (
              <View style={styles.purpleAvatarCircle}>
                <Text style={styles.avatarEmoji}>🥷</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </Pressable>

          <View style={styles.profileTitleWrapper}>
            <Text style={styles.profileNinjaTitle} numberOfLines={1}>
              {profileName || '🥷'}
            </Text>
            <Text style={styles.handleText}>{profileHandle}</Text>
            <Text style={styles.followersText}>0 followers • 4 following</Text>
          </View>
        </View>

        {/* Action Buttons Row: Edit | Share | Settings | Three Dots */}
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.editPillBtn}
            onPress={() => {
              setTempName(profileName);
              setTempHandle(profileHandle);
              setShowEditModal(true);
            }}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </Pressable>

          <Pressable style={styles.iconCircleBtn} onPress={handlePickAvatar}>
            <Ionicons name="image-outline" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.iconCircleBtn} onPress={() => router.push('/premium')}>
            <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.iconCircleBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Playlists Section matching Spotify Screenshot 2 */}
        <View style={styles.playlistsSection}>
          <Text style={styles.sectionHeading}>Playlists</Text>

          {queue.length > 0 ? (
            <View style={styles.uploadedList}>
              <Text style={styles.uploadedTitle}>Uploaded Tracks ({queue.length})</Text>
              {queue.map((track, idx) => (
                <View key={track.id + idx} style={styles.trackRow}>
                  <Ionicons name="musical-note" size={18} color="#1DB954" />
                  <Text style={styles.trackName} numberOfLines={1}>
                    {track.title}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noPlaylistsBox}>
              <Text style={styles.noPlaylistsTitle}>No playlists</Text>
              <Text style={styles.noPlaylistsSubtitle}>
                Others will be able to see what you're into, share your playlists and save them for later.
              </Text>

              <Pressable style={styles.addPlaylistsBtn} onPress={() => router.push('/upload')}>
                <Text style={styles.addPlaylistsBtnText}>Add playlists</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ✏️ Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.inputLabel}>Display Name</Text>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Display Name"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Profile Handle</Text>
            <TextInput
              style={styles.modalInput}
              value={tempHandle}
              onChangeText={setTempHandle}
              placeholder="@handle"
              placeholderTextColor={Colors.textMuted}
            />

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.modalSaveBtn} onPress={handleSaveProfile}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  avatarTouchArea: {
    position: 'relative',
  },
  purpleAvatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#B19CD9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImageBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#1DB954',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  avatarEmoji: {
    fontSize: 50,
  },
  profileTitleWrapper: {
    marginLeft: 18,
    flex: 1,
  },
  profileNinjaTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  handleText: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  followersText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  editPillBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  iconCircleBtn: {
    padding: 6,
  },
  playlistsSection: {
    marginTop: 10,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  noPlaylistsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noPlaylistsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noPlaylistsSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  addPlaylistsBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  addPlaylistsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  uploadedList: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  uploadedTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackName: {
    color: Colors.textPrimary,
    fontSize: 14,
    flex: 1,
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
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#3E3E3E',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
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
  modalSaveBtn: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  modalSaveText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
});
