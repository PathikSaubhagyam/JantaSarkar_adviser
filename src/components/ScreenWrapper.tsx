import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/Colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScreenWrapper = ({ children, style }: Props) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <LinearGradient
        colors={['#ea8101', '#faaa49ff', '#fcbe8eff']} // Example gradient
        // colors={['#3e117cff', '#5821b1ff', '#3379d4ff']}
        start={{ x: 1, y: 0 }} // top-right
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ full screen
  },
  gradient: {
    flex: 1, // ✅ full screen gradient
  },
});

export default ScreenWrapper;
