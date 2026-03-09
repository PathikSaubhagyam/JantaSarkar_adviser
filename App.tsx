/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import NotificationService from './src/services/NotificationService';
import APIWebCall from './src/common/APIWebCall';

const FCM_TOKEN_STORAGE_KEY = 'fcm_token';

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

        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          await registerFcmTokenToServer(fcmToken);
        }

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

  const registerFcmTokenToServer = async (fcmToken: string) => {
    try {
      if (!fcmToken) {
        return;
      }
      console.log(fcmToken, 'token fcm123');

      const response = await APIWebCall.onRegisterFCMTokenAPICall(fcmToken);
      console.log(response, 'Token res----->>>');

      if (response?.status === true || response?.status === 'true') {
        await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, fcmToken);
      }
    } catch (error: unknown) {
      const normalizedError = error as {
        response?: { data?: unknown };
        message?: string;
      };

      console.log(
        'FCM token register failed:',
        normalizedError?.response?.data || normalizedError?.message,
      );
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
