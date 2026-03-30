/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Register background handler for FCM
try {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background Message received in index.js:', remoteMessage);
  });
} catch (e) {
  console.warn('Firebase messaging not available:', e);
}

AppRegistry.registerComponent(appName, () => App);
