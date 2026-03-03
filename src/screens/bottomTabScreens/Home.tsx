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
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import APIWebCall from '../../common/APIWebCall';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
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
      const token = await AsyncStorage.getItem('access_token');
      console.log(token, 'token');

      const response = await axios.get(`${BASE_URL}/user/home-dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response, 'dashboard res===>>>');

      if (response.data?.status) {
        setUserCases(response.data.total_case);
        setProvidedHelp(response.data.provide_help);
        setHelpRecords(response.data.help_reward);
      } else {
        showErrorModal('Failed to load dashboard data');
      }
    } catch (error) {
      console.log('Dashboard API Error:', error);
      showErrorModal('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const res = await APIWebCall.onDashboardAPICall();

      console.log('DASHBOARD RESPONSE => ', res);

      if (res?.status === true || res?.success === true) {
        setUserCases(res?.total_case ?? 0);
        setProvidedHelp(res?.provide_help ?? 0);
        setHelpRecords(res?.help_reward ?? 0);
      } else {
        console.log('Dashboard API failed:', res?.message);
      }
    } catch (error) {
      console.log('DASHBOARD ERROR => ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />

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
              <Icon name="document-text-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.cardNumber}>{userCases}</Text>
            <Text style={styles.cardLabel}>Your Cases</Text>
          </TouchableOpacity>

          {/* Provided Help */}
          <TouchableOpacity style={[styles.card, styles.greenCard]}>
            <View style={styles.iconBox}>
              <Icon name="people-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.cardNumber}>{providedHelp}</Text>
            <Text style={styles.cardLabel}>Provided Help</Text>
          </TouchableOpacity>

          {/* Help Records */}
          <TouchableOpacity style={[styles.card, styles.orangeCard]}>
            <View style={styles.iconBox}>
              <Icon name="time-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.cardNumber}>{helpRecords}</Text>
            <Text style={styles.cardLabel}>Help Records</Text>
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
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
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
    backgroundColor: '#2563eb',
  },

  greenCard: {
    backgroundColor: '#16a34a',
  },

  orangeCard: {
    backgroundColor: '#f97316',
  },
});
