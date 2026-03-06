import React from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import { FONTS_Family } from '../../constants/Font';

type RewardItem = {
  id: string;
  city: string;
  issue: string;
  address: string;
  attendanceDate: string;
  rewardPoints: number;
};

const REWARD_HISTORY: RewardItem[] = [
  {
    id: '1',
    city: 'Bhopal',
    issue: 'Road Repair Assistance',
    address: 'Shivaji Nagar, Ward 14, Near Main Market',
    attendanceDate: '04 Mar 2026',
    rewardPoints: 45,
  },
  {
    id: '2',
    city: 'Indore',
    issue: 'Water Supply Follow-up',
    address: 'Vijay Nagar, Sector C, Opp. City Garden',
    attendanceDate: '01 Mar 2026',
    rewardPoints: 30,
  },
  {
    id: '3',
    city: 'Gwalior',
    issue: 'Street Light Complaint',
    address: 'Morar Road, Block B, Near Post Office',
    attendanceDate: '26 Feb 2026',
    rewardPoints: 20,
  },
  {
    id: '4',
    city: 'Jabalpur',
    issue: 'Drainage Clean-up Drive',
    address: 'Napier Town, Lane 3, Community Hall',
    attendanceDate: '22 Feb 2026',
    rewardPoints: 35,
  },
];

export default function RewardHistoryScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(14, Math.min(22, width * 0.045));

  const renderHistoryItem = ({ item }: { item: RewardItem }) => {
    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.cityText}>{item.city}</Text>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>+{item.rewardPoints} pts</Text>
          </View>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Issue</Text>
          <Text style={styles.value}>{item.issue}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value} numberOfLines={2}>
            {item.address}
          </Text>
        </View>

        <View style={styles.dateRow}>
          <Text style={styles.label}>Attendance Date</Text>
          <Text style={styles.dateValue}>{item.attendanceDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        backgroundColor="#f4f7fb"
        barStyle="dark-content"
        translucent={false}
      />

      <View
        style={[
          styles.innerContainer,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        <Header
          title="Reward History"
          onBackPress={() => navigation.goBack()}
          showBackButton
        />

        <Text style={styles.subtitle}>
          Track reward points earned from each issue attended.
        </Text>

        <FlatList
          data={REWARD_HISTORY}
          keyExtractor={item => item.id}
          renderItem={renderHistoryItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  innerContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    color: '#51607a',
    fontSize: 13,
    fontFamily: FONTS_Family.FontRegular,
    lineHeight: 19,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eef8',
    ...Platform.select({
      ios: {
        shadowColor: '#1f2937',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityText: {
    flex: 1,
    marginRight: 8,
    color: '#0f172a',
    fontSize: 17,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  pointsBadge: {
    backgroundColor: '#fff3e8',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pointsText: {
    color: '#ea580c',
    fontSize: 12,
    fontFamily: FONTS_Family.FontMedium,
  },
  infoGroup: {
    marginBottom: 10,
  },
  label: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: FONTS_Family.FontMedium,
    marginBottom: 3,
  },
  value: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS_Family.FontRegular,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
    paddingTop: 10,
    marginTop: 2,
  },
  dateValue: {
    color: '#0f172a',
    fontSize: 13,
    fontFamily: FONTS_Family.FontMedium,
  },
});
