import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { useProfile } from '../context/ProfileContext';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.82;

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const { profileName, profileImage } = useProfile();

  const handleGoToProfile = () => {
    onClose();
    router.push('/profile');
  };

  const handleGoToSettings = () => {
    onClose();
    router.push('/premium');
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Transparent Backdrop to close on tap */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Side Drawer Content matching Spotify Screenshot 1 */}
        <View style={styles.drawerContent}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Header Row */}
              <Pressable style={styles.profileRow} onPress={handleGoToProfile}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>🥷</Text>
                  </View>
                )}
                <View style={styles.profileTextWrapper}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {profileName || '🥷'}
                  </Text>
                  <Text style={styles.viewProfileSub}>View profile</Text>
                </View>
              </Pressable>

              <View style={styles.divider} />

              {/* Drawer Menu Items */}
              <View style={styles.menuList}>
                {/* Add account */}
                <Pressable style={styles.menuItem} onPress={onClose}>
                  <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.menuText}>Add account</Text>
                </Pressable>

                {/* Your Premium */}
                <Pressable style={styles.menuItem} onPress={handleGoToSettings}>
                  <Ionicons name="logo-octocat" size={24} color="#FFFFFF" />
                  <Text style={styles.menuText}>Your Premium</Text>
                  <View style={styles.premiumBadge}>
                    <Text style={styles.badgeText}>Standard</Text>
                  </View>
                </Pressable>

                {/* Listening stats */}
                <Pressable style={styles.menuItem} onPress={onClose}>
                  <Ionicons name="analytics-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.menuText}>Listening stats</Text>
                </Pressable>

                {/* Recents */}
                <Pressable style={styles.menuItem} onPress={onClose}>
                  <Ionicons name="time-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.menuText}>Recents</Text>
                </Pressable>

                {/* Your Updates */}
                <Pressable style={styles.menuItem} onPress={onClose}>
                  <Ionicons name="megaphone-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.menuText}>Your Updates</Text>
                </Pressable>

                {/* Settings and privacy */}
                <Pressable style={styles.menuItem} onPress={handleGoToSettings}>
                  <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.menuText}>Settings and privacy</Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContent: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#191919',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B19CD9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  profileTextWrapper: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  viewProfileSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 16,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
});
