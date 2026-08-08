import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_GENRES, MOCK_TRACKS } from '../../constants/mockData';
import { GenreCard } from '../../components/GenreCard';
import { TrackListItem } from '../../components/TrackListItem';
import { Colors } from '../../constants/colors';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = searchQuery.trim()
    ? MOCK_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>

        {/* Search Bar Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="What do you want to listen to?"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textMuted}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {searchQuery.length > 0 ? (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.sectionTitle}>
              {filteredTracks.length} Results Found
            </Text>
            {filteredTracks.map((track) => (
              <TrackListItem key={track.id} track={track} playlistContext={filteredTracks} />
            ))}
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Browse All Genres</Text>
            <View style={styles.genreGrid}>
              {MOCK_GENRES.map((g: any) => (
                <View key={g.id} style={styles.gridColumn}>
                  <GenreCard name={g.name} color={g.color} image={g.cover} />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 160,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 12,
    marginLeft: 6,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridColumn: {
    width: '50%',
  },
  searchResultsContainer: {
    paddingHorizontal: 6,
  },
});
