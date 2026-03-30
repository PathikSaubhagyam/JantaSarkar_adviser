import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  onAdminUserCrowdAttendanceAPICall,
  onProfileAPICall,
} from '../../common/APIWebCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONTS_Family } from '../../constants/Font';
import Header from '../../components/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type RewardRecord = {
  id: string;
  crowdName: string;
  issue: string;
  address: string;
  attendedDate: string;
  rewardPoint: number;
};

type CrowdAttendanceItem = {
  crowd_id: number;
  crowd_name: string;
  attended_at: string;
  latitude: number;
  longitude: number;
};

type RewardHistoryScreenProps = {
  onBack?: () => void;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const formatAttendedDate = (value: string) => {
  if (!value) {
    return '';
  }

  const toDisplay = (
    day: number,
    month: number,
    year: number,
    hour: number,
    minute: number,
    hasTime: boolean,
  ) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    const yyyy = String(year);

    if (!hasTime) {
      return `${dd}-${mm}-${yyyy}`;
    }

    const safeHour = Number.isFinite(hour) ? hour : 0;
    const safeMinute = Number.isFinite(minute) ? minute : 0;
    const period = safeHour >= 12 ? 'PM' : 'AM';
    const hour12 = safeHour % 12 || 12;

    return `${dd}-${mm}-${yyyy} ${String(hour12).padStart(2, '0')}:${String(
      safeMinute,
    ).padStart(2, '0')} ${period}`;
  };

  const normalized = value.trim();

  const customFormatMatch = normalized.match(
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/,
  );
  if (customFormatMatch) {
    const [, day, month, year, hour = '0', minute = '0'] = customFormatMatch;
    const hasTime = customFormatMatch[4] !== undefined;
    return toDisplay(
      Number(day),
      Number(month),
      Number(year),
      Number(hour),
      Number(minute),
      hasTime,
    );
  }

  const parsedDate = new Date(normalized);
  if (!Number.isNaN(parsedDate.getTime())) {
    return toDisplay(
      parsedDate.getDate(),
      parsedDate.getMonth() + 1,
      parsedDate.getFullYear(),
      parsedDate.getHours(),
      parsedDate.getMinutes(),
      true,
    );
  }

  return normalized;
};

export default function RewardHistoryScreen({
  onBack,
}: RewardHistoryScreenProps) {
  const navigation = useNavigation<any>();
  const [rewardRecords, setRewardRecords] = useState<RewardRecord[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetchRewardHistory();
  }, []);

  const fetchRewardHistory = async (showLoader = true) => {
    try {
      console.log('STEP 1 → start fetch');

      if (showLoader) setLoading(true);
      else setRefreshing(true);

      // ✅ FIRST API — PROFILE
      const profileRes = await onProfileAPICall();
      console.log('PROFILE RESPONSE =>', profileRes);

      let userId: string | null = null;

      if (profileRes?.data?.id) {
        userId = String(profileRes.data.id);
        setProfile(profileRes.data);
      }

      console.log('USER ID =>', userId);

      // 🚨 if profile failed stop here
      if (!userId) {
        console.log('❌ No userId found. Stop API chain.');
        setRewardRecords([]);
        setTotalPoints(0);
        return;
      }

      // ✅ SECOND API — ATTENDANCE HISTORY
      const attendanceRes = await onAdminUserCrowdAttendanceAPICall(userId);
      console.log('ATTENDANCE RESPONSE =>', attendanceRes);

      if (attendanceRes?.status) {
        setTotalPoints(Number(attendanceRes?.total_points ?? 0));

        const mappedData: RewardRecord[] = (attendanceRes?.data ?? []).map(
          (item: CrowdAttendanceItem) => ({
            id: String(item.crowd_id),
            crowdName: item.crowd_name,
            issue: 'Crowd Attendance',
            address: `Lat: ${item.latitude}, Lng: ${item.longitude}`,
            attendedDate: item.attended_at,
            rewardPoint: 1,
          }),
        );

        setRewardRecords(mappedData);
      } else {
        console.log('❌ Attendance API returned false status');
        setRewardRecords([]);
        setTotalPoints(0);
      }
    } catch (error) {
      console.log('❌ Reward history API error:', error);
      setRewardRecords([]);
      setTotalPoints(0);
    } finally {
      if (showLoader) setLoading(false);
      else setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: RewardRecord }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cityName}>{item.crowdName}</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{item.rewardPoint} pts</Text>
        </View>
      </View>

      {/* <View style={styles.issueBox}>
        <Text style={styles.issueLabel}>Issue</Text>
        <Text style={styles.issueValue}>{item.issue}</Text>
      </View> */}

      {/* // <Row label="Address" value={item.address} /> */}
      <Row label="Attended" value={formatAttendedDate(item.attendedDate)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f4f7fb" barStyle="dark-content" />

      {/* <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
       

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Reward History</Text>
          <Text style={styles.headerSubtitle}>Issue Attendance Rewards</Text>
        </View>
      </View> */}
      <Header title="Reward History" onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={rewardRecords}
          keyExtractor={item => item.id}
          style={{ marginBottom: 80 }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={() => fetchRewardHistory(false)}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              Your Reward Points: {totalPoints}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No reward history found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6ebf2',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    color: '#0f172a',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: FONTS_Family.FontRegular,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 10,
    fontFamily: FONTS_Family.FontMedium,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6ebf2',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cityName: {
    flex: 1,
    fontSize: 17,
    color: '#0f172a',
    fontFamily: FONTS_Family.FontSemiBold,
    marginRight: 10,
  },
  pointsBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  pointsText: {
    fontSize: 12,
    color: '#166534',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  issueBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 10,
  },
  issueLabel: {
    fontSize: 11,
    color: '#9a3412',
    marginBottom: 3,
    textTransform: 'uppercase',
    fontFamily: FONTS_Family.FontMedium,
  },
  issueValue: {
    fontSize: 14,
    color: '#7c2d12',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  rowLabel: {
    width: 72,
    fontSize: 13,
    color: '#64748b',
    fontFamily: FONTS_Family.FontMedium,
  },
  rowValue: {
    flex: 1,
    fontSize: 13,
    color: '#1f2937',
    fontFamily: FONTS_Family.FontRegular,
    lineHeight: 18,
  },
  emptyWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 13,
    fontFamily: FONTS_Family.FontRegular,
  },
});
