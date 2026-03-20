import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  Animated,
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APIWebCall, { onWithdrawRequestAPICall } from '../../common/APIWebCall';
import CommonModal from '../../components/CommonModal';
import Header from '../../components/Header';
import { FONTS_Family } from '../../constants/Font';

const MONEY_ANIMATION = require('../../assets/animations/money-flying.json');

type ApiItem = {
  id: number;
  amount: number;
  transaction_type: string;
  source: string;
  note: string;
  balance_after_transaction: number;
  payment_status: string;
  created_at: string;
};

type UIItem = {
  id: string;
  title: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
};

export default function PaymentHistoryScreen() {
  const navigation = useNavigation<any>();

  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<UIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });
  const [successModal, setSuccessModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showMoneyAnim, setShowMoneyAnim] = useState(false);
  const lottieRef = useRef<LottieView | null>(null);
  const successTextAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showMoneyAnim) {
      Animated.timing(successTextAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }).start();
    } else {
      successTextAnim.setValue(0);
    }
  }, [showMoneyAnim, successTextAnim]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const fetchPaymentHistory = useCallback(async (showLoader = true) => {
    showLoader ? setLoading(true) : setRefreshing(true);

    try {
      const res = await APIWebCall.onPaymentHistoryAPICall();

      if (res?.status) {
        setBalance(res.balance || 0);

        const formatted: UIItem[] = (res.data || []).map((item: ApiItem) => {
          const isCredit = item.transaction_type?.toLowerCase() === 'credit';

          return {
            id: String(item.id),
            title: item.note || item.source || 'Transaction',
            amount: item.amount,
            type: isCredit ? 'credit' : 'debit',
            date: formatDate(item.created_at),
          };
        });

        setHistory(formatted);
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.log(e);
      setHistory([]);
    } finally {
      showLoader ? setLoading(false) : setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPaymentHistory(true);
    }, []),
  );

  const handleWithdraw = async () => {
    console.log('Withdraw button clicked');

    const amount = Number(withdrawAmount);

    if (!amount || amount <= 0) {
      setErrorModal({ visible: true, message: 'Enter valid amount' });
      return;
    }

    if (amount > balance) {
      setErrorModal({
        visible: true,
        message: 'Amount exceeds available balance',
      });
      return;
    }

    try {
      setWithdrawing(true);

      // Call API using the exported method
      const res = await onWithdrawRequestAPICall({ amount });
      console.log(res, 'withdrawall res');
      if (res && (res.status || res.message === 'Withdraw request submitted')) {
        setWithdrawModal(false);
        setWithdrawAmount('');
        setShowMoneyAnim(true);
        setTimeout(() => {
          setShowMoneyAnim(false);
          // setSuccessModal(true);
          setWithdrawing(false);
          // fetchPaymentHistory();
        }, 1800);
      } else {
        setWithdrawing(false);
        setErrorModal({
          visible: true,
          message: res?.message || 'Withdraw failed',
        });
      }
    } catch (e) {
      setWithdrawing(false);
      setErrorModal({ visible: true, message: 'Withdraw failed. Try again.' });
    }
  };

  // Render Lottie money animation overlay
  const renderMoneyAnimation = () =>
    showMoneyAnim && (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.15)',
          zIndex: 100,
        }}
      >
        <LottieView
          ref={lottieRef}
          source={MONEY_ANIMATION}
          autoPlay
          loop={false}
          style={{ width: 300, height: 300 }}
        />
        <Animated.View
          style={{
            marginTop: -26,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            backgroundColor: '#0f172a',
            opacity: successTextAnim,
            transform: [
              {
                translateY: successTextAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 0],
                }),
              },
            ],
          }}
        >
          <Text style={styles.successAnimText}>
            Request submitted successfully
          </Text>
        </Animated.View>
      </View>
    );

  const renderItem = ({ item }: { item: UIItem }) => {
    const isCredit = item.type === 'credit';

    return (
      <View style={styles.item}>
        <View style={styles.left}>
          <View
            style={[styles.icon, isCredit ? styles.creditBg : styles.debitBg]}
          >
            <Ionicons
              name={isCredit ? 'arrow-down' : 'arrow-up'}
              size={16}
              color={isCredit ? '#16a34a' : '#dc2626'}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>

        <Text style={[styles.amount, isCredit ? styles.credit : styles.debit]}>
          {isCredit ? '+' : '-'} ₹{item.amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderMoneyAnimation()}
      {withdrawing && !showMoneyAnim && (
        <View style={styles.fullscreenLoader}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loaderText}>Submitting your request...</Text>
        </View>
      )}
      <CommonModal
        visible={errorModal.visible}
        title={'Error'}
        message={errorModal.message}
        type="error"
        onPrimaryPress={() => setErrorModal({ visible: false, message: '' })}
      />
      <CommonModal
        visible={successModal}
        title={'Withdraw request submitted'}
        message={'Your withdraw request has been submitted successfully!'}
        type="success"
        onPrimaryPress={() => setSuccessModal(false)}
      />

      <Header title="Payment History" onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <>
          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => fetchPaymentHistory(false)}
            contentContainerStyle={{ padding: 16 }}
            ListHeaderComponent={
              <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceValue}>₹ {balance.toFixed(2)}</Text>
                <View style={styles.withdrawRow}>
                  <Text style={styles.withdrawInfo}>
                    Available for withdrawal
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Ionicons name="cash-outline" size={18} color="#fff" />
                  <Text
                    style={styles.withdrawText}
                    onPress={() => setWithdrawModal(true)}
                  >
                    Withdraw
                  </Text>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="wallet-outline" size={50} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>No payment history found</Text>
              </View>
            }
          />
          {withdrawModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Withdraw Balance</Text>
                <Text style={styles.modalSub}>Max: ₹ {balance.toFixed(2)}</Text>
                <TextInput
                  placeholder="Enter amount"
                  placeholderTextColor={'grey'}
                  keyboardType="numeric"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                  style={styles.input}
                />
                <View style={styles.modalBtnRow}>
                  <Text
                    style={styles.cancelBtn}
                    onPress={() => {
                      setWithdrawModal(false);
                      setWithdrawAmount('');
                    }}
                  >
                    Cancel
                  </Text>
                  <TouchableOpacity onPress={handleWithdraw}>
                    <Text style={styles.submitBtn}>Withdraw</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  balanceCard: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  balanceLabel: {
    color: '#c7d2fe',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },

  balanceValue: {
    marginTop: 6,
    fontSize: 32,
    color: '#fff',
    fontFamily: FONTS_Family.FontExtBold,
  },

  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  creditBg: {
    backgroundColor: '#dcfce7',
  },

  debitBg: {
    backgroundColor: '#fee2e2',
  },

  title: {
    fontSize: 14,
    color: '#111827',
    fontFamily: FONTS_Family.FontMedium,
  },

  date: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: FONTS_Family.FontRegular,
  },

  amount: {
    fontSize: 16,
    fontFamily: FONTS_Family.FontSemiBold,
  },

  credit: {
    color: '#16a34a',
  },

  debit: {
    color: '#dc2626',
  },

  empty: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyTitle: {
    marginTop: 10,
    color: '#6b7280',
  },
  withdrawRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  withdrawText: {
    marginLeft: 6,
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS_Family.FontSemiBold,
  },

  withdrawInfo: {
    color: '#e0ecff',
    fontSize: 12,
  },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    color: '#111827',
    fontFamily: FONTS_Family.FontSemiBold,
  },

  modalSub: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },

  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    color: '#111827',
  },

  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },

  cancelBtn: {
    marginRight: 16,
    color: '#6b7280',
  },

  submitBtn: {
    color: '#2563eb',
    fontFamily: FONTS_Family.FontSemiBold,
  },

  fullscreenLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  loaderText: {
    marginTop: 10,
    color: '#1e293b',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },

  successAnimText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: FONTS_Family.FontSemiBold,
  },
});
