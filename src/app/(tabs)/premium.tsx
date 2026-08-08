import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';

const SETTINGS_ITEMS = [
  {
    id: 'account',
    title: 'Account',
    subtitle: 'Username • Refer friends to Premium Standard',
    icon: 'person-circle-outline',
  },
  {
    id: 'content_display',
    title: 'Content and display',
    subtitle: 'Music videos • Languages for music',
    icon: 'musical-note-outline',
  },
  {
    id: 'privacy_social',
    title: 'Privacy and social',
    subtitle: 'Private session • Public playlists',
    icon: 'lock-closed-outline',
  },
  {
    id: 'playback',
    title: 'Playback',
    subtitle: 'Gapless playback • Autoplay',
    icon: 'volume-medium-outline',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Push • Email',
    icon: 'notifications-outline',
  },
  {
    id: 'apps_devices',
    title: 'Apps and devices',
    subtitle: 'Connected accounts • Google Maps',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'data_saving',
    title: 'Data-saving and offline',
    subtitle: 'Data Saver • Offline mode',
    icon: 'arrow-down-circle-outline',
  },
  {
    id: 'media_quality',
    title: 'Media quality',
    subtitle: 'Wi-Fi streaming quality • Audio download quality',
    icon: 'stats-chart-outline',
  },
  {
    id: 'about',
    title: 'About',
    subtitle: 'Version • Privacy Policy',
    icon: 'information-circle-outline',
  },
];

export default function PremiumScreen() {
  const router = useRouter();

  const handleLogOut = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Settings Header matching Spotify Screenshot */}
      <View style={styles.headerBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>

        <Pressable style={styles.searchBtn}>
          <Ionicons name="search-outline" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Settings List Items */}
        {SETTINGS_ITEMS.map((item, index) => (
          <Pressable
            key={item.id}
            style={[
              styles.settingRow,
              index !== SETTINGS_ITEMS.length - 1 && styles.settingRowBorder,
            ]}
            onPress={() => {}}
          >
            <Ionicons name={item.icon as any} size={24} color="#FFFFFF" style={styles.settingIcon} />

            <View style={styles.settingTextWrapper}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </Pressable>
        ))}

        {/* Log out Button */}
        <Pressable style={styles.logoutBtn} onPress={handleLogOut}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 160,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingIcon: {
    width: 32,
    marginRight: 16,
  },
  settingTextWrapper: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 13,
    marginTop: 3,
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    marginTop: 32,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 56,
  },
  logoutText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
});
