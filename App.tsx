/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import MainNavigator from './src/navigation/MainNavigator';
import TopNotificationBanner from './src/components/TopNotificationBanner';
import NotificationService from './src/services/NotificationService';
import APIWebCall from './src/common/APIWebCall';
import CommonModal from './src/components/CommonModal';

const FCM_TOKEN_STORAGE_KEY = 'fcm_token';

function App() {
  // Notification banner state
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerMessage, setBannerMessage] = useState('');

  // Version update modal state
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [isForceUpdate, setIsForceUpdate] = useState(false);

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
    // Check for app version updates
    checkAppVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAppVersion = async () => {
    try {
      const response = await APIWebCall.onAppVersionAPICall('Advisor');
      console.log('App version response:', response);

      if (response?.status && response?.data) {
        const {
          android_version,
          android_is_app_update,
          ios_version,
          ios_is_app_update,
        } = response.data;

        const currentVersion = DeviceInfo.getBuildNumber(); // For Android it's versionCode
        const currentVersionName = DeviceInfo.getVersion();

        console.log('Current Build Number:', currentVersion);
        console.log('Current Version Name:', currentVersionName);

        if (Platform.OS === 'android') {
          const latestVersion = parseInt(android_version, 10);
          if (latestVersion > parseInt(currentVersion, 10)) {
            setIsForceUpdate(android_is_app_update === 1);
            setUpdateModalVisible(true);
          }
        } else if (Platform.OS === 'ios') {
          // Compare iOS version (usually string comparison or major.minor.patch)
          if (parseFloat(ios_version) > parseFloat(currentVersionName)) {
            setIsForceUpdate(ios_is_app_update === 1);
            setUpdateModalVisible(true);
          }
        }
      }
    } catch (error) {
      console.log('Error checking app version:', error);
    }
  };

  const handleUpdatePress = () => {
    const url = Platform.OS === 'android'
      ? 'market://details?id=com.jantasarkar.adviserapp' // Replace with your actual package name if different
      : 'https://apps.apple.com/app/id6443411111'; // Replace with your actual app id

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback for emulator or if market is not installed
        Linking.openURL(Platform.OS === 'android' 
          ? 'https://play.google.com/store/apps/details?id=com.jantasarkar.adviserapp' 
          : url);
      }
    });
  };

  const initializeNotifications = async () => {
    try {
      const initialized = await NotificationService.initialize();

      if (initialized) {
        console.log('Push notifications initialized successfully');

        // Register background handler once Firebase is ready
        try {
          messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log(
              'Background Message received in App.tsx:',
              remoteMessage,
            );
            await NotificationService.handleBackgroundMessage(remoteMessage);
          });
        } catch (bgError) {
          console.log('Background handler setup fallback:', bgError?.message);
        }

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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <AppContent />
      <TopNotificationBanner
        visible={bannerVisible}
        title={bannerTitle}
        message={bannerMessage}
        onHide={() => setBannerVisible(false)}
      />
      <CommonModal
        visible={updateModalVisible}
        title="Update Available"
        message="A new version of the app is available. Please update to continue using the app with latest features and improvements."
        type="warning"
        primaryText="Update Now"
        secondaryText={isForceUpdate ? undefined : 'Later'}
        onPrimaryPress={handleUpdatePress}
        onSecondaryPress={isForceUpdate ? undefined : () => setUpdateModalVisible(false)}
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
