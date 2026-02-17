import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';

export default function BottomNav() {
  return (
    <View style={styles.nav}>
      <Text>Home</Text>
      <Text style={{ color: COLORS.primary }}>Community</Text>
      <Text>Cases</Text>
      <Text>Earnings</Text>
      <Text>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
