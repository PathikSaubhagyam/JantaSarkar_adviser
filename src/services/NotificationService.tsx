import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIWebCall from '../common/APIWebCall';

class NotificationService {
  /**
   * Request notification permission from user
   */
  async requestUserPermission() {
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
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);

      if (onNotificationReceived) {
        onNotificationReceived(remoteMessage);
      }

      // You can show a local notification here using react-native-push-notification
      // or display an in-app notification
    });

    return unsubscribe;
  }

  /**
   * Setup background notification handler
   */
  setupBackgroundNotificationHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification received:', remoteMessage);
      // Handle background notification here
    });
  }

  /**
   * Setup notification opened listener (when user taps on notification)
   */
  setupNotificationOpenedListener(
    onNotificationOpened?: (remoteMessage: any) => void,
  ) {
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
    const hasPermission = await this.requestUserPermission();

    if (hasPermission) {
      await this.getFCMToken();
      this.setupBackgroundNotificationHandler();
      this.setupTokenRefreshListener();

      return true;
    }

    return false;
  }
}

export default new NotificationService();
