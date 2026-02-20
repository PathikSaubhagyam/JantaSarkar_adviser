import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/Colors';
import CommunityFeedAdd from '../screens/bottomTabScreens/CommunityFeedAdd';
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
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default HomeNavigator;
