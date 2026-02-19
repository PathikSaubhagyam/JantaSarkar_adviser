import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/Colors';

export default function TabChips({ tabs = [], selected, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#E9EDF3',
            borderRadius: 14,
            padding: 4,
            // marginBottom: 20,
            // paddingTop: 20,
            paddingHorizontal: 10,
            alignItems: 'center',
          }}
        >
          {tabs.map(tab => {
            const isActive = selected === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => onSelect(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.chipText, isActive && styles.activeChipText]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
  },

  scrollContainer: {
    paddingRight: 20,
  },

  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    // backgroundColor: COLORS.white, // 👈 Inactive BG White
    marginRight: 10,
    // borderWidth: 1,
    // borderColor: '#E5E7EB', // 👈 Light Border Nice Look
    // marginBottom: 15,
  },

  activeChip: {
    backgroundColor: COLORS.white, // 👈 Active BG Primary
    borderColor: COLORS.black,
  },

  chipText: {
    fontSize: 14,
    color: '#6B7A90',
    fontWeight: '600',
  },

  activeChipText: {
    color: '#0B1320',
  },
});
