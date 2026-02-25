// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   Dimensions,
//   StatusBar,
//   ActivityIndicator,
// } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { COLORS } from '../../constants/Colors';
// import RequestCard from '../../components/RequestCard';
// import { BASE_URL, DOBFormat } from '../../constants/Utils';
// import {
//   onAdvisorComplaintsAPICall,
//   onAdvisorHistoryAPICall,
//   onAdvisorOngoingAPICall,
//   onApproveComplaintAPICall,
//   onComplaintCancelAPICall,
//   onCompletedComplaintAPICall,
//   onRequestRejectAPICall,
// } from '../../common/APIWebCall';
// import moment from 'moment';
// import { useFocusEffect } from '@react-navigation/native';
// import SnackBarCommon from '../../components/SnackBarCommon';
// import TextCommonMedium from '../../components/TextCommonMedium';
// import { FONTS_SIZE } from '../../constants/Font';
// import TextCommonBold from '../../components/TextCommonBold';
// const { width } = Dimensions.get('window');
// const Home = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

//       <View style={{}}>
//         <TextCommonBold
//           text={'Comming Soon'}
//           textViewStyle={{ fontSize: FONTS_SIZE.txt_18 }}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     paddingHorizontal: width * 0.04,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // demo values (later connect API)
  const userCases = 12;
  const providedHelp = 5;
  const helpRecords = 27;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome</Text>
        {/* <View style={styles.locationRow}>
          <Icon name="location-outline" size={18} color="#2563eb" />
          <Text style={styles.locationText}>Ahmedabad</Text>
        </View> */}
      </View>

      {/* Dashboard Cards */}
      <View style={styles.cardContainer}>
        {/* User Case */}
        <TouchableOpacity style={[styles.card, styles.blueCard]}>
          <View style={styles.iconBox}>
            <Icon name="document-text-outline" size={26} color="#fff" />
          </View>
          <Text style={styles.cardNumber}>{userCases}</Text>
          <Text style={styles.cardLabel}>Your Cases</Text>
        </TouchableOpacity>

        {/* Provide Help */}
        <TouchableOpacity style={[styles.card, styles.greenCard]}>
          <View style={styles.iconBox}>
            <Icon name="people-outline" size={26} color="#fff" />
          </View>
          <Text style={styles.cardNumber}>{providedHelp}</Text>
          <Text style={styles.cardLabel}>Provided Help</Text>
        </TouchableOpacity>

        {/* Help Record */}
        <TouchableOpacity style={[styles.card, styles.orangeCard]}>
          <View style={styles.iconBox}>
            <Icon name="time-outline" size={26} color="#fff" />
          </View>
          <Text style={styles.cardNumber}>{helpRecords}</Text>
          <Text style={styles.cardLabel}>Help Records</Text>
        </TouchableOpacity>
      </View>

      {/* Future Content Section */}
      {/* <View style={styles.bottomSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.sectionSub}>
          Your recent case & help activity will appear here.
        </Text>
      </View> */}
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

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  locationText: {
    marginLeft: 6,
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
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

  bottomSection: {
    marginTop: 30,
    paddingHorizontal: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  sectionSub: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 14,
  },
});
