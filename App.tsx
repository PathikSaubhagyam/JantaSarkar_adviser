/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import TopNotificationBanner from './src/components/TopNotificationBanner';
import NotificationService from './src/services/NotificationService';
import APIWebCall from './src/common/APIWebCall';

const FCM_TOKEN_STORAGE_KEY = 'fcm_token';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Notification banner state
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerMessage, setBannerMessage] = useState('');

  // Show top notification banner with notification data
  const showNotificationBanner = useCallback(notification => {
    const notif = notification?.notification || notification;
    setBannerTitle(notif?.title || 'Notification');
    setBannerMessage(notif?.body || '');
    setBannerVisible(true);
  }, []);

  useEffect(() => {
    // Initialize FCM notifications
    initializeNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              showNotificationBanner(notification);
            },
          );

        // Setup notification opened listener
        NotificationService.setupNotificationOpenedListener(notification => {
          console.log('Notification opened:', notification);
          // Optionally handle navigation here
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
      <TopNotificationBanner
        visible={bannerVisible}
        title={bannerTitle}
        message={bannerMessage}
        onHide={() => setBannerVisible(false)}
      />
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
