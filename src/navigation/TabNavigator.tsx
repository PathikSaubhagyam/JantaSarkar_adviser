import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/Colors';
import Profile from '../screens/bottomTabScreens/Profile';
import Home from '../screens/bottomTabScreens/Home';
import History from '../screens/bottomTabScreens/History';
import Community from '../screens/bottomTabScreens/Community';
import ProfileScreen from '../screens/bottomTabScreens/Profile';
import TextCommonMedium from '../components/TextCommonMedium';
import { FONTS_SIZE } from '../constants/Font';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.colorPrimary,
        tabBarInactiveTintColor: COLORS.background_grey,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
          paddingTop: 10,
          ...Platform.select({
            ios: { height: 70 },
            android: { height: 30 },
          }),
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 70 : 70,
          borderTopWidth: 1,
          elevation: 0,
          borderTopColor: '#e5e7eb',
          backgroundColor: COLORS.white, // make it transparent to show gradient
        },
        // tabBarBackground: () => (
        //   <LinearGradient
        //     colors={['#ff7e5f', '#feb47b']} // Your gradient colors
        //     start={{ x: 0, y: 0 }}
        //     end={{ x: 1, y: 0 }}
        //     style={{
        //       flex: 1,
        //     }}
        //   />
        // ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',

                height: 45,
                width: 55,
                // elevation: 2,
              }}
            >
              <Image
                source={require('../assets/images/request.png')}
                style={{
                  height: 25,
                  width: 25,
                  tintColor: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
              <TextCommonMedium
                text={'Requests'}
                textViewStyle={{
                  fontSize: FONTS_SIZE.txt_13,
                  color: focused ? COLORS.primary : COLORS.gry_text,
                  textAlign: 'center',
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                width: 50,
              }}
            >
              <Image
                source={require('../assets/images/history.png')}
                style={{
                  height: 25,
                  width: 25,
                  tintColor: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
              <TextCommonMedium
                text={'History'}
                textViewStyle={{
                  fontSize: FONTS_SIZE.txt_13,
                  color: focused ? COLORS.primary : COLORS.gry_text,
                  textAlign: 'center',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                width: 68,
              }}
            >
              <Image
                source={require('../assets/images/community.png')}
                style={{
                  height: 25,
                  width: 25,
                  tintColor: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
              <TextCommonMedium
                text={'Community'}
                textViewStyle={{
                  fontSize: FONTS_SIZE.txt_13,
                  color: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                width: 50,
              }}
            >
              <Image
                source={require('../assets/images/user.png')}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
              <TextCommonMedium
                text={'Profile'}
                textViewStyle={{
                  fontSize: FONTS_SIZE.txt_13,
                  color: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
