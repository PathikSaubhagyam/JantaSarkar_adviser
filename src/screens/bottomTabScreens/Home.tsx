import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { onDashboardAPICall } from '../../common/APIWebCall';
import { FONTS_Family } from '../../constants/Font';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [userCases, setUserCases] = useState(0);
  const [providedHelp, setProvidedHelp] = useState(0);
  const [helpRecords, setHelpRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dot animation refs
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const dot4 = useRef(new Animated.Value(0)).current;
  const dot5 = useRef(new Animated.Value(0)).current;
  const dot6 = useRef(new Animated.Value(0)).current;
  const dot7 = useRef(new Animated.Value(0)).current;
  const dot8 = useRef(new Animated.Value(0)).current;
  const dot9 = useRef(new Animated.Value(0)).current;
  const dot10 = useRef(new Animated.Value(0)).current;
  const dot11 = useRef(new Animated.Value(0)).current;
  const dot12 = useRef(new Animated.Value(0)).current;
  const dot13 = useRef(new Animated.Value(0)).current;
  const dot14 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getDashboardData();

    const floatDot = (
      anim: Animated.Value,
      duration: number,
      toValue: number,
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    floatDot(dot1, 3000, -18);
    floatDot(dot2, 4200, 22);
    floatDot(dot3, 2800, -14);
    floatDot(dot4, 3600, 16);
    floatDot(dot5, 5000, -20);
    floatDot(dot6, 3300, 12);
    floatDot(dot7, 4700, -16);
    floatDot(dot8, 2600, 18);
    floatDot(dot9, 3100, -22);
    floatDot(dot10, 4400, 20);
    floatDot(dot11, 3800, -18);
    floatDot(dot12, 5200, 24);
    floatDot(dot13, 2900, -20);
    floatDot(dot14, 4100, 16);
  }, []);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const response = await onDashboardAPICall();

      if (response?.status || response?.success) {
        setUserCases(Number(response?.total_case) || 0);
        setProvidedHelp(Number(response?.provide_help) || 0);
        setHelpRecords(Number(response?.help_reward) || 0);
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Failed to load dashboard data',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />

      {/* Colorful floating dots background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 7,
              height: 7,
              backgroundColor: '#60a5fa',
              top: '8%',
              left: '12%',
              transform: [{ translateY: dot1 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 5,
              height: 5,
              backgroundColor: '#f472b6',
              top: '15%',
              right: '18%',
              transform: [{ translateY: dot2 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 6,
              height: 6,
              backgroundColor: '#34d399',
              top: '28%',
              left: '78%',
              transform: [{ translateY: dot3 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 4,
              height: 4,
              backgroundColor: '#fbbf24',
              top: '38%',
              left: '8%',
              transform: [{ translateY: dot4 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 6,
              height: 6,
              backgroundColor: '#a78bfa',
              top: '52%',
              right: '10%',
              transform: [{ translateY: dot5 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 5,
              height: 5,
              backgroundColor: '#fb923c',
              top: '63%',
              left: '25%',
              transform: [{ translateY: dot6 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 7,
              height: 7,
              backgroundColor: '#38bdf8',
              top: '76%',
              right: '28%',
              transform: [{ translateY: dot7 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 4,
              height: 4,
              backgroundColor: '#f87171',
              top: '88%',
              left: '55%',
              transform: [{ translateY: dot8 }],
            },
          ]}
        /> */}

        {/* Bottom row — slightly bigger dots */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 11,
              height: 11,
              backgroundColor: '#818cf8',
              bottom: '6%',
              left: '5%',
              transform: [{ translateY: dot9 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 9,
              height: 9,
              backgroundColor: '#2dd4bf',
              bottom: '10%',
              left: '22%',
              transform: [{ translateY: dot10 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 12,
              height: 12,
              backgroundColor: '#f9a8d4',
              bottom: '5%',
              left: '40%',
              transform: [{ translateY: dot11 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 10,
              height: 10,
              backgroundColor: '#86efac',
              bottom: '9%',
              left: '58%',
              transform: [{ translateY: dot12 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 9,
              height: 9,
              backgroundColor: '#fcd34d',
              bottom: '4%',
              left: '74%',
              transform: [{ translateY: dot13 }],
            },
          ]}
        /> */}
        {/* <Animated.View
          style={[
            styles.dot,
            {
              width: 11,
              height: 11,
              backgroundColor: '#f87171',
              bottom: '8%',
              right: '4%',
              transform: [{ translateY: dot14 }],
            },
          ]}
        /> */}
      </View>

      <View style={{ marginTop: 15 }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <View style={styles.cardContainer}>
          {/* Your Cases */}
          <TouchableOpacity style={[styles.card, styles.blueCard]}>
            <View style={styles.iconBox}>
              <Icon name="document-text-outline" size={26} color="#2563eb" />
            </View>
            <Text style={[styles.cardNumber, { color: '#2563eb' }]}>
              {userCases}
            </Text>
            <Text style={[styles.cardLabel, { color: '#2563eb' }]}>
              Your Cases
            </Text>
          </TouchableOpacity>

          {/* Provided Help */}
          <TouchableOpacity
            style={[styles.card, styles.greenCard]}
            onPress={() =>
              navigation.navigate('Request', { initialTab: 'History' })
            }
          >
            <View style={styles.iconBox}>
              <Icon name="people-outline" size={26} color="#16a34a" />
            </View>
            <Text style={[styles.cardNumber, { color: '#16a34a' }]}>
              {providedHelp}
            </Text>
            <Text style={[styles.cardLabel, { color: '#16a34a' }]}>
              Provided Help
            </Text>
          </TouchableOpacity>

          {/* Help Records */}
          <TouchableOpacity
            style={[styles.card, styles.orangeCard]}
            onPress={() => navigation.navigate('RewardHistoryScreen')}
          >
            <View style={styles.iconBox}>
              <Icon name="time-outline" size={26} color="#f97316" />
            </View>
            <Text style={[styles.cardNumber, { color: '#f97316' }]}>
              {helpRecords}
            </Text>
            <Text style={[styles.cardLabel, { color: '#f97316' }]}>
              Your Rewards ⭐⭐⭐
            </Text>
          </TouchableOpacity>

          {/* Payment */}
          <TouchableOpacity
            style={[styles.card, styles.purpleCard]}
            onPress={() => navigation.navigate('PaymentHistoryScreen')}
          >
            <View style={styles.iconBox}>
              <Icon name="wallet-outline" size={26} color="#7c3aed" />
            </View>

            <Text style={[styles.cardLabel, { color: '#7c3aed' }]}>
              Payment History
            </Text>

            <Text style={[styles.addMoney, { color: '#7c3aed' }]}>
              View Payments
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const CARD_WIDTH = width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
  },

  welcome: {
    fontSize: 24,
    fontFamily: FONTS_Family.FontExtraBold,
    color: '#0f172a',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 6,
    padding: 18,
    marginTop: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    backgroundColor: '#fff',
  },

  iconBox: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  dot: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.45,
  },

  purpleCard: {
    borderColor: '#7c3aed',
  },

  blueCard: {
    borderColor: '#2563eb',
  },

  greenCard: {
    borderColor: '#16a34a',
  },

  orangeCard: {
    borderColor: '#f97316',
  },

  cardNumber: {
    fontSize: 26,
    fontFamily: FONTS_Family.FontExtraBold,
  },

  cardLabel: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: FONTS_Family.FontBold,
  },

  addMoney: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: FONTS_Family.FontExtraBold,
  },
});
