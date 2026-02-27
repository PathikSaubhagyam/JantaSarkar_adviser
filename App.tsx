/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { COLORS } from './src/constants/Colors';
import MainNavigator from './src/navigation/MainNavigator';
import NotificationService from './src/services/NotificationService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize FCM notifications
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      const initialized = await NotificationService.initialize();

      if (initialized) {
        console.log('Push notifications initialized successfully');

        // Setup foreground notification listener
        const unsubscribeForeground =
          NotificationService.setupForegroundNotificationListener(
            notification => {
              console.log('Foreground notification:', notification);
              // You can show in-app notification here
            },
          );

        // Setup notification opened listener
        NotificationService.setupNotificationOpenedListener(notification => {
          console.log('Notification opened:', notification);
          // Navigate to specific screen based on notification data
        });

        // Cleanup on unmount
        return () => {
          unsubscribeForeground();
        };
      }
    } catch (error) {
      console.log('Error initializing notifications:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <MainNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
