import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions } from 'react-native';

interface TopNotificationBannerProps {
  visible: boolean;
  title: string;
  message: string;
  onHide: () => void;
  duration?: number; // in ms
}

const { width } = Dimensions.get('window');

const TopNotificationBanner: React.FC<TopNotificationBannerProps> = ({
  visible,
  title,
  message,
  onHide,
  duration = 3000,
}) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width - 20,
    marginHorizontal: 10,
    backgroundColor: '#323232',
    borderRadius: 10,
    padding: 16,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: '#fff',
    fontSize: 14,
  },
});

export default TopNotificationBanner;
