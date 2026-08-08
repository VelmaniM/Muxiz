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
          tabBarShowLabel: false, // Display ONLY clean icons without text names
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#A7A7A7',
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'search' : 'search-outline'} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Your Library',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'library' : 'library-outline'} size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            title: 'Upload',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'cloud-upload' : 'cloud-upload-outline'} size={26} color={color} />
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
    backgroundColor: '#000000',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 0.5,
    height: 60,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabItem: {
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPlayerWrapper: {
    position: 'absolute',
    bottom: 60, // Positioned cleanly right above the 60px tab bar
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 99,
  },
});
