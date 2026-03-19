import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APIWebCall from '../../common/APIWebCall';
import Header from '../../components/Header';
import { COLORS } from '../../constants/Colors';
import { FONTS_Family } from '../../constants/Font';

type PaymentHistoryItem = {
  id: number;
  complaint_id: number;
  complaint_title: string;
  user_name: string;
  amount: number;
  type: string;
  status: string;
  razorpay_payout_id: string;
  date: string;
};

export default function PaymentHistoryScreen() {
  const navigation = useNavigation<any>();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPaymentHistory = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await APIWebCall.onPaymentHistoryAPICall();
      console.log('PAYMENT HISTORY =>', response);

      if (response?.status) {
        setPayments(response?.data ?? []);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.log('PAYMENT HISTORY ERROR =>', error);
      setPayments([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPaymentHistory(true);
    }, [fetchPaymentHistory]),
  );

  const renderItem = ({ item }: { item: PaymentHistoryItem }) => {
    const isSuccess = item.status?.toLowerCase() === 'success';
    const isCredit = item.type?.toLowerCase() === 'credit';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.amountWrap}>
            <Text style={[styles.amountText, isCredit && styles.creditText]}>
              {isCredit ? '+' : '-'}Rs. {Number(item.amount || 0).toFixed(2)}
            </Text>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>

          <View style={[styles.statusBadge, isSuccess && styles.successBadge]}>
            <Text style={[styles.statusText, isSuccess && styles.successText]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.complaintTitle}>{item.complaint_title}</Text>
        <Text style={styles.metaText}>User: {item.user_name}</Text>
        <Text style={styles.metaText}>Complaint ID: {item.complaint_id}</Text>
        <Text style={styles.metaText} numberOfLines={1}>
          Payout ID: {item.razorpay_payout_id}
        </Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrap}>
        <Header
          title="Payment History"
          onBackPress={() => navigation.goBack()}
        />

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={payments}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => fetchPaymentHistory(false)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="wallet-outline" size={46} color="#d1d5db" />
                <Text style={styles.emptyTitle}>No payment history found</Text>
                <Text style={styles.emptySubtitle}>
                  Completed payouts will appear here.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountWrap: {
    flex: 1,
    marginRight: 10,
  },
  amountText: {
    fontSize: 22,
    color: '#7c3aed',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  creditText: {
    color: '#16a34a',
  },
  typeText: {
    marginTop: 2,
    fontSize: 12,
    color: '#6b7280',
    fontFamily: FONTS_Family.FontMedium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#fef2f2',
  },
  successBadge: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 11,
    color: '#dc2626',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  successText: {
    color: '#166534',
  },
  complaintTitle: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 8,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  metaText: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 4,
    fontFamily: FONTS_Family.FontRegular,
  },
  dateText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: FONTS_Family.FontRegular,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 90,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 15,
    color: '#6b7280',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontFamily: FONTS_Family.FontRegular,
  },
});
