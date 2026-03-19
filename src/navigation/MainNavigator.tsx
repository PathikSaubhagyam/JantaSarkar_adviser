import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splashscreen/SplashScreen';
import AuthNavigator from './AuthNavigator';
import { SafeAreaView } from 'react-native';
import { COLORS } from '../constants/Colors';
import HomeNavigator from './HomeNavigator';
import ProfileDetails from '../screens/screen/ProfileDetails';
import UploadDocScreen from '../screens/screen/UploadDocScreen';
import SettingsScreen from '../screens/screen/SettingsScreen';
import RewardHistoryScreen from '../screens/screen/RewardHistoryScreen';
import RequestScreen from '../screens/bottomTabScreens/RequestScreen';
import BankDetailsScreen from '../screens/screen/BankDetailsScreen';
import NotificationScreen from '../screens/screen/NotificationScreen';
import PaymentHistoryScreen from '../screens/screen/PaymentHistoryScreen';
// import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
          <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
          <Stack.Screen name="UploadDocScreen" component={UploadDocScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen
            name="RewardHistoryScreen"
            component={RewardHistoryScreen}
          />
          <Stack.Screen name="RequestScreen" component={RequestScreen} />
          <Stack.Screen
            name="BankDetailsScreen"
            component={BankDetailsScreen}
          />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
          />
          <Stack.Screen
            name="PaymentHistoryScreen"
            component={PaymentHistoryScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
