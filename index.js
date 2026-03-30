/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import NotificationService from './src/services/NotificationService';

// Register background handler for FCM
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message received in index.js:', remoteMessage);
  await NotificationService.handleBackgroundMessage(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
