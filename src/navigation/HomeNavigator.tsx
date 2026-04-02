import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/Colors';
import CommunityFeedAdd from '../screens/bottomTabScreens/CommunityFeedAdd';
import RewardHistoryScreen from '../screens/screen/RewardHistoryScreen';
import BankDetailsScreen from '../screens/screen/BankDetailsScreen';
import NotificationScreen from '../screens/screen/NotificationScreen';
import PaymentHistoryScreen from '../screens/screen/PaymentHistoryScreen';
import HelpSupportScreen from '../screens/screen/HelpSupportScreen';
import AskGiveScreen from '../screens/screen/AskGiveScreen';
import RaisedBloodRequestScreen from '../screens/screen/RaisedBloodRequestScreen';
const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: COLORS.white }}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="TabNavigator"
      >
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="CommunityFeedAdd" component={CommunityFeedAdd} />
        <Stack.Screen
          name="RewardHistoryScreen"
          component={RewardHistoryScreen}
        />
        <Stack.Screen name="BankDetailsScreen" component={BankDetailsScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="PaymentHistoryScreen"
          component={PaymentHistoryScreen}
        />
        <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
        <Stack.Screen name="AskGiveScreen" component={AskGiveScreen} />
        <Stack.Screen
          name="RaisedBloodRequestScreen"
          component={RaisedBloodRequestScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default HomeNavigator;
