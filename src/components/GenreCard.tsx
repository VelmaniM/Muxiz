import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors } from '../constants/colors';

interface GenreCardProps {
  name: string;
  color: string;
  image: string;
  onPress?: () => void;
}

export const GenreCard: React.FC<GenreCardProps> = ({ name, color, image, onPress }) => {
  return (
    <Pressable style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.title}>{name}</Text>
      <Image source={{ uri: image }} style={styles.image} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    borderRadius: 10,
    padding: 12,
    margin: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    width: '70%',
  },
  image: {
    width: 65,
    height: 65,
    position: 'absolute',
    bottom: -8,
    right: -10,
    transform: [{ rotate: '25deg' }],
    borderRadius: 8,
  },
});
