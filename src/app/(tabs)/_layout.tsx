import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MiniPlayer } from '../../components/MiniPlayer';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'search' : 'search-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Your Library',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'library' : 'library-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            title: 'Upload',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'cloud-upload' : 'cloud-upload-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            href: null, // Hide from tab bar - accessible via Settings icon in drawer only
          }}
        />
        <Tabs.Screen
          name="playlist/[id]"
          options={{
            href: null, // Sub-route: tab bar and mini player remain visible
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null, // Sub-route: tab bar and mini player remain visible
          }}
        />
      </Tabs>

      {/* Floating MiniPlayer overlay directly above tab bar */}
      <View style={styles.miniPlayerWrapper}>
        <MiniPlayer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  tabBar: {
    backgroundColor: 'rgba(11, 12, 16, 0.98)',
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  miniPlayerWrapper: {
    position: 'absolute',
    bottom: 64, // Positioned cleanly right above the 64px tab bar
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
