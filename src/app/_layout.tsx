import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioProvider } from '../context/AudioContext';
import { ProfileProvider } from '../context/ProfileContext';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.background }}>
      <ProfileProvider>
        <AudioProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="player"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: false,
              }}
            />
          </Stack>
        </AudioProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
