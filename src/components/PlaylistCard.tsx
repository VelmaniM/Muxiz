import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Playlist } from '../constants/mockData';
import { Colors } from '../constants/colors';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/playlist/${playlist.id}` as any);
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Image source={{ uri: playlist.cover }} style={styles.cover} />
      <Text style={styles.title} numberOfLines={1}>
        {playlist.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {playlist.subtitle}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 145,
    marginRight: 14,
    backgroundColor: Colors.cardBackground,
    padding: 10,
    borderRadius: 10,
  },
  cover: {
    width: '100%',
    height: 125,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
