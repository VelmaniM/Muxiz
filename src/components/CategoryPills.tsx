import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface CategoryPillsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <Pressable
            key={cat}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelectCategory(cat)}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
  },
  pillActive: {
    backgroundColor: Colors.primary,
  },
  pillText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
});
