import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import APIWebCall from '../common/APIWebCall';

const ANDROID_NOTIFICATION_CHANNEL_ID = 'custom_sound_channel';

class NotificationService {
  isFirebaseReady() {
    return getApps().length > 0;
  }

  async createAndroidNotificationChannel() {
    await notifee.createChannel({
      id: ANDROID_NOTIFICATION_CHANNEL_ID,
      name: 'Custom Sound Notifications',
      sound: 'notification_sound',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  }

  getNotificationContent(remoteMessage: any) {
    const title =
      remoteMessage?.notification?.title ||
      remoteMessage?.data?.title ||
      'Notification';
    const body =
      remoteMessage?.notification?.body || remoteMessage?.data?.body || '';

    return { title, body };
  }

  async displayNotification(remoteMessage: any) {
    const { title, body } = this.getNotificationContent(remoteMessage);

    await this.createAndroidNotificationChannel();

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: ANDROID_NOTIFICATION_CHANNEL_ID,
        sound: 'notification_sound',
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  /**
   * Request notification permission from user
   */
  async requestUserPermission() {
    if (!this.isFirebaseReady()) {
      return false;
    }

    if (
      Platform.OS === 'ios' &&
      !messaging().isDeviceRegisteredForRemoteMessages
    ) {
      await messaging().registerDeviceForRemoteMessages();
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification authorization status:', authStatus);
      return true;
    }
    return false;
  }

  /**
   * Get FCM token and register it with backend
   */
  async getFCMToken() {
    try {
      if (!this.isFirebaseReady()) {
        return null;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('User not logged in, skipping FCM token registration');
        return null;
      }

      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      if (fcmToken) {
        // Save locally
        await AsyncStorage.setItem('fcm_token', fcmToken);

        // Register with backend
        await this.registerTokenWithBackend(fcmToken);

        return fcmToken;
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Register FCM token with backend server
   */
  async registerTokenWithBackend(fcmToken: string) {
    try {
      const response = await APIWebCall.onRegisterFCMTokenAPICall(fcmToken);
      console.log(response, 'push notification res==>>>');

      if (response?.status === true) {
        console.log('FCM token registered successfully with backend');
      } else {
        console.log('Failed to register FCM token:', response?.message);
      }
    } catch (error) {
      console.log('Error registering FCM token with backend:', error);
    }
  }

  /**
   * Setup foreground notification listener
   */
  setupForegroundNotificationListener(
    onNotificationReceived?: (remoteMessage: any) => void,
  ) {
    if (!this.isFirebaseReady()) {
      return () => {};
    }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);

      await this.displayNotification(remoteMessage);

      if (onNotificationReceived) {
        onNotificationReceived(remoteMessage);
      }
    });

    return unsubscribe;
  }

  /**
   * Setup background notification handler
   */
  setupBackgroundNotificationHandler() {
    console.log('Background notification handler is registered in index.js');
  }

  async handleBackgroundMessage(remoteMessage: any) {
    console.log('Background notification received:', remoteMessage);

    // Avoid duplicate system notifications when FCM already contains a notification payload.
    if (remoteMessage?.notification) {
      return;
    }

    await this.displayNotification(remoteMessage);
  }

  /**
   * Setup notification opened listener (when user taps on notification)
   */
  setupNotificationOpenedListener(
    onNotificationOpened?: (remoteMessage: any) => void,
  ) {
    if (!this.isFirebaseReady()) {
      return;
    }

    // Notification caused app to open from background state
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);

      if (onNotificationOpened) {
        onNotificationOpened(remoteMessage);
      }
    });

    // Check if notification opened app from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification opened app from quit state:',
            remoteMessage,
          );

          if (onNotificationOpened) {
            onNotificationOpened(remoteMessage);
          }
        }
      });
  }

  /**
   * Handle token refresh
   */
  setupTokenRefreshListener() {
    if (!this.isFirebaseReady()) {
      return () => {};
    }

    const unsubscribe = messaging().onTokenRefresh(async fcmToken => {
      console.log('FCM Token refreshed:', fcmToken);

      // Save new token
      await AsyncStorage.setItem('fcm_token', fcmToken);

      // Register new token with backend
      await this.registerTokenWithBackend(fcmToken);
    });

    return unsubscribe;
  }

  /**
   * Initialize all notification features
   */
  async initialize() {
    if (!this.isFirebaseReady()) {
      console.log(
        'Firebase app is not initialized; skipping notification setup.',
      );
      return false;
    }

    const hasPermission = await this.requestUserPermission();

    if (hasPermission) {
      await this.createAndroidNotificationChannel();
      await this.getFCMToken();
      this.setupBackgroundNotificationHandler();
      this.setupTokenRefreshListener();

      return true;
    }

    return false;
  }
}

export default new NotificationService();
