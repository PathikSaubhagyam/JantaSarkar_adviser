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
  ScrollView,
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
        setUserCases(Number(response?.get_help) || 0);
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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome</Text>
        <View style={styles.headerAccent} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Your Cases */}
            <TouchableOpacity
              style={[styles.card, styles.cardDark]}
              onPress={() => navigation.navigate('CommunityDashboardScreen')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#333' }]}>
                <Icon name="document-text-outline" size={22} color="#FFFFFF" />
              </View>
              <Text style={[styles.cardNumber, { color: '#FFFFFF' }]}>
                {userCases}
              </Text>
              <Text style={[styles.cardLabel, { color: '#CCCCCC' }]}>
                Your Cases
              </Text>
            </TouchableOpacity>

            {/* Provided Help */}
            <TouchableOpacity
              style={[styles.card, styles.cardLight]}
              onPress={() =>
                navigation.navigate('Request', { initialTab: 'History' })
              }
            >
              <View style={[styles.iconBox, { backgroundColor: '#F0F0F0' }]}>
                <Icon name="people-outline" size={22} color="#1a1a1a" />
              </View>
              <Text style={[styles.cardNumber, { color: '#1a1a1a' }]}>
                {providedHelp}
              </Text>
              <Text style={[styles.cardLabel, { color: '#555555' }]}>
                Provided Help
              </Text>
            </TouchableOpacity>

            {/* Payment History */}
            <TouchableOpacity
              style={[styles.card, styles.cardLight]}
              onPress={() => navigation.navigate('PaymentHistoryScreen')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F0F0F0' }]}>
                <Icon name="wallet-outline" size={22} color="#1a1a1a" />
              </View>
              <Text style={[styles.cardLabel, { color: '#1a1a1a' }]}>
                Payment History
              </Text>
              <Text style={[styles.addMoney, { color: '#888' }]}>
                View Payments
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions Section */}
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            {/* Ask & Give */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AskGiveScreen')}
              activeOpacity={0.75}
            >
              <View
                style={[styles.actionIconBox, { backgroundColor: '#F0F0F0' }]}
              >
                <Icon
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color="#111111"
                />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Ask & Give</Text>
                <Text style={styles.actionSubtitle}>
                  Open the community exchange
                </Text>
              </View>
              <View style={styles.chevronBox}>
                <Icon name="chevron-forward" size={16} color="#888" />
              </View>
            </TouchableOpacity>

            {/* Give / Raise Blood Request */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('RaisedBloodRequestScreen')}
              activeOpacity={0.75}
            >
              <View
                style={[styles.actionIconBox, { backgroundColor: '#F0F0F0' }]}
              >
                <Icon name="water-outline" size={22} color="#111111" />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>
                  Give / Raise Blood Request
                </Text>
                <Text style={styles.actionSubtitle}>
                  Donate or submit requirement details
                </Text>
              </View>
              <View style={styles.chevronBox}>
                <Icon name="chevron-forward" size={16} color="#888" />
              </View>
            </TouchableOpacity>

            {/* Phone Directory */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('PhoneDirectoryScreen')}
              activeOpacity={0.75}
            >
              <View
                style={[styles.actionIconBox, { backgroundColor: '#F0F0F0' }]}
              >
                <Icon name="call-outline" size={22} color="#111111" />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Phone Directory</Text>
                <Text style={styles.actionSubtitle}>
                  Browse users and advisors
                </Text>
              </View>
              <View style={styles.chevronBox}>
                <Icon name="chevron-forward" size={16} color="#888" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const CARD_WIDTH = width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  welcome: {
    fontSize: 24,
    fontFamily: FONTS_Family.FontBold,
    color: '#000000',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  headerAccent: {
    marginTop: 6,
    width: 36,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  quickActionsTitle: {
    marginTop: 24,
    marginBottom: 10,
    marginHorizontal: 16,
    fontSize: 11,
    letterSpacing: 1,
    color: '#666666',
    fontFamily: FONTS_Family.FontBold,
    textTransform: 'uppercase',
  },
  actionsContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    color: '#111111',
    fontFamily: FONTS_Family.FontBold,
  },
  actionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#888888',
    fontFamily: FONTS_Family.FontMedium,
  },
  chevronBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 8,
    padding: 18,
    marginTop: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 2,
    borderColor: '#000000',
  },
  // Dark card — black bg, white text
  cardDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#000000',
    borderWidth: 2,
  },
  // Light card — white bg, black text
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.45,
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
