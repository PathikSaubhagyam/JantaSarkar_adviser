import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import TabNavigator from './TabNavigator';
import { COLORS } from '../constants/Colors';
import CommunityFeedAdd from '../screens/bottomTabScreens/CommunityFeedAdd';
import RewardHistoryScreen from '../screens/screen/RewardHistoryScreen';
import BankDetailsScreen from '../screens/screen/BankDetailsScreen';
import NotificationScreen from '../screens/screen/NotificationScreen';
import PaymentHistoryScreen from '../screens/screen/PaymentHistoryScreen';
import HelpSupportScreen from '../screens/screen/HelpSupportScreen';
import AskGiveScreen from '../screens/screen/AskGiveScreen';
import RaisedBloodRequestScreen from '../screens/screen/RaisedBloodRequestScreen';
import PhoneDirectoryScreen from '../screens/screen/PhoneDirectoryScreen';
import UserAdvisorDetailScreen from '../screens/screen/UserAdvisorDetailScreen';
import CommunityDashboardScreen from '../screens/screen/CommunityDashboardScreen';
import SpecificAskCreateScreen from '../screens/screen/SpecificAskCreateScreen';
import SpecificGiveCreateScreen from '../screens/screen/SpecificGiveCreateScreen';
const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
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
          name="SpecificAskCreateScreen"
          component={SpecificAskCreateScreen}
        />
        <Stack.Screen
          name="SpecificGiveCreateScreen"
          component={SpecificGiveCreateScreen}
        />
        <Stack.Screen
          name="RaisedBloodRequestScreen"
          component={RaisedBloodRequestScreen}
        />
        <Stack.Screen
          name="PhoneDirectoryScreen"
          component={PhoneDirectoryScreen}
        />
        <Stack.Screen
          name="UserAdvisorDetailScreen"
          component={UserAdvisorDetailScreen}
        />
        <Stack.Screen
          name="CommunityDashboardScreen"
          component={CommunityDashboardScreen}
        />
      </Stack.Navigator>
    </View>
  );
};

export default HomeNavigator;
