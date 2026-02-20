import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, View, Platform } from 'react-native';
import { COLORS } from '../constants/Colors';
import Profile from '../screens/bottomTabScreens/Profile';
import Home from '../screens/bottomTabScreens/Home';
import History from '../screens/bottomTabScreens/History';
import Community from '../screens/bottomTabScreens/Community';
import ProfileScreen from '../screens/bottomTabScreens/Profile';
import TextCommonMedium from '../components/TextCommonMedium';
import { FONTS_SIZE } from '../constants/Font';
import RequestScreen from '../screens/bottomTabScreens/RequestScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Request"
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
                width: 65,
                // elevation: 2,
              }}
            >
              <Image
                source={require('../assets/images/home.png')}
                style={{
                  height: 22,
                  width: 22,
                  tintColor: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
              <TextCommonMedium
                text={'Home'}
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
        name="Request"
        component={RequestScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',

                height: 45,
                width: 65,
                // elevation: 2,
              }}
            >
              <Image
                source={require('../assets/images/request.png')}
                style={{
                  height: 22,
                  width: 22,
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

      {/* <Tab.Screen
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
                  height: 22,
                  width: 22,
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
      /> */}
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
                width: 80,
              }}
            >
              <Image
                source={require('../assets/images/community.png')}
                style={{
                  height: 22,
                  width: 22,
                  tintColor: focused ? COLORS.primary : COLORS.gry_text,
                }}
              />
              <TextCommonMedium
                text={'Feed'}
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
                  height: 22,
                  width: 22,
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
