import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIWebCall from '../../common/APIWebCall';
import InternetPermission from '../../components/InternetPermission';
import DeviceInfo from 'react-native-device-info';
import SnackBarCommon from '../../components/SnackBarCommon';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const init = async () => {
      try {
        // Splash delay
        setTimeout(async () => {
          const userId = await AsyncStorage.getItem('user_Id');

          console.log('USER ID =>', userId);

          if (userId) {
            navigation.replace('HomeNavigator');
          } else {
            navigation.replace('AuthNavigator');
          }
        }, 1500);
      } catch (error) {
        console.log('Splash Error =>', error);
        navigation.replace('AuthNavigator');
      }
    };

    init();
  }, []);
  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        style={{
          width: 300,
          height: 300,
          borderRadius: 10,
        }}
        source={require('../../assets/images/app_img.jpg')}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
