import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioProvider } from '../context/AudioContext';
import { ProfileProvider } from '../context/ProfileContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: '#000000', flex: 1 }}>
      <ProfileProvider>
        <AudioProvider>
          <StatusBar style="light" />
          <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#000000' },
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
          </View>
        </AudioProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
