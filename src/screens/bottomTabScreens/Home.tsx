import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { onDashboardAPICall } from '../../common/APIWebCall';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [userCases, setUserCases] = useState(0);
  const [providedHelp, setProvidedHelp] = useState(0);
  const [helpRecords, setHelpRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const response = await onDashboardAPICall();
      console.log(response, 'ress dashboard==>>');

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
      console.log('Dashboard API Error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />
      <View style={{ marginTop: 15, backgroundColor: '#f8fafc' }} />

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
            activeOpacity={0.85}
            // onPress={() =>
            //   navigation.navigate('Request', { initialTab: 'History' })
            // }
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
            activeOpacity={0.85}
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
        </View>
      )}
    </SafeAreaView>
  );
}

const CARD_WIDTH = width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
  },

  welcome: {
    fontSize: 24,
    fontWeight: '700',
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

  cardNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },

  cardLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    fontWeight: '600',
  },

  blueCard: {
    // backgroundColor: '#2563eb',
    backgroundColor: '#FFFFFF',
    borderColor: '#2563eb',
  },

  greenCard: {
    // backgroundColor: '#16a34a',
    backgroundColor: '#FFFFFF',
    borderColor: '#16a34a',
  },

  orangeCard: {
    // backgroundColor: '#f97316',
    backgroundColor: '#FFFFFF',
    borderColor: '#f97316',
  },
});
