import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { FONTS_Family } from '../../constants/Font';
import CommonModal, { ModalType } from '../../components/CommonModal';
import {
  onExchangeCreateAPICall,
  onExchangeListAPICall,
} from '../../common/APIWebCall';

type ModalState = {
  visible: boolean;
  title: string;
  message: string;
  type: ModalType;
};

export default function AskGiveScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'ask' | 'give'>('give');

  const [item, setItem] = useState('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [askList, setAskList] = useState<any[]>([]);
  const [exchangeList, setExchangeList] = useState<any[]>([]);
  const [loadingExchange, setLoadingExchange] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const closeModal = () => {
    setModal(prev => ({ ...prev, visible: false }));
  };

  const showModal = (title: string, message: string, type: ModalType) => {
    setModal({
      visible: true,
      title,
      message,
      type,
    });
  };

  const fetchExchangeList = async () => {
    try {
      setLoadingExchange(true);
      const data = await onExchangeListAPICall();

      if (data?.status && Array.isArray(data?.data)) {
        setExchangeList(data.data);
      }
    } catch (error) {
      console.log('Error fetching exchange list:', error);
    } finally {
      setLoadingExchange(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'give') {
      fetchExchangeList();
    }
  }, [activeTab]);

  const submitAsk = async () => {
    const normalizedItem = item.trim();
    const normalizedDesc = desc.trim();
    const normalizedPhone = phone.replace(/\D/g, '');

    if (!normalizedItem || !normalizedDesc || !normalizedPhone) {
      showModal('Missing details', 'Please fill all fields.', 'warning');
      return;
    }

    if (normalizedPhone.length !== 10) {
      showModal(
        'Invalid Phone',
        'Please enter a valid 10-digit phone number.',
        'warning',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await onExchangeCreateAPICall({
        title: normalizedItem,
        description: normalizedDesc,
        contact_number: normalizedPhone,
      });

      if (data?.status || data?.success) {
        const newAsk = {
          id: Date.now().toString(),
          item: normalizedItem,
          desc: normalizedDesc,
          phone: normalizedPhone,
        };

        setAskList([newAsk, ...askList]);
        setItem('');
        setDesc('');
        setPhone('');
        showModal(
          'Request Submitted',
          data?.message || 'Your request has been created successfully.',
          'success',
        );
      } else {
        showModal(
          'Submission Failed',
          data?.message || 'Unable to submit your request. Please try again.',
          'error',
        );
      }
    } catch (error) {
      showModal(
        'Error',
        (error as Error)?.message || 'Something went wrong. Please try again.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCall = async (phoneNumber: string) => {
    try {
      const url = `tel:${phoneNumber.replace(/\s+/g, '')}`;
      await Linking.openURL(url);
    } catch (error) {
      showModal(
        'Cannot Make Call',
        'Phone dialer is not available on this device.',
        'error',
      );
    }
  };

  const renderGiveItem = ({ item: listItem }: { item: any }) => {
    return (
      <View style={styles.listCard}>
        <View style={styles.listHeaderRow}>
          <View style={styles.listIconWrap}>
            <Ionicons name="hand-left-outline" size={18} color="#1a1a1a" />
          </View>
          <View style={styles.listHeaderText}>
            <Text style={styles.listTitle}>{listItem.title}</Text>
            <Text style={styles.listUserName}>{listItem.user_name}</Text>
            <Text style={styles.listDate}>{listItem.created_at}</Text>
          </View>
        </View>

        <Text style={styles.listDesc}>{listItem.description}</Text>

        <View style={styles.listFooter}>
          <Text style={styles.listPhone}>Phone: {listItem.contact_number}</Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handleCall(listItem.contact_number)}
          >
            <Ionicons name="call-outline" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Header title="Ask & Give" onBackPress={() => navigation.goBack()} />

      <CommonModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onPrimaryPress={closeModal}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Hero banner — black bg, white text */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Community Exchange</Text>
          <Text style={styles.heroSubtitle}>
            Ask for what you need or share what you can.
          </Text>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'give' && styles.activeTab]}
            onPress={() => setActiveTab('give')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'give' && styles.activeText,
              ]}
            >
              Give
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ask' && styles.activeTab]}
            onPress={() => setActiveTab('ask')}
          >
            <Text
              style={[styles.tabText, activeTab === 'ask' && styles.activeText]}
            >
              Ask
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'ask' && (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.body}>
              <Text style={styles.label}>Need of Item</Text>
              <TextInput
                placeholder="Ex: Books, Food, Clothes"
                style={styles.input}
                maxLength={50}
                value={item}
                onChangeText={setItem}
                placeholderTextColor="#888888"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Write details..."
                style={[styles.input, styles.multilineInput]}
                multiline
                maxLength={100}
                value={desc}
                onChangeText={setDesc}
                placeholderTextColor="#888888"
                textAlignVertical="top"
              />

              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                placeholder="Enter phone number"
                style={styles.input}
                keyboardType="number-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#888888"
                maxLength={10}
              />

              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={submitAsk}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="send-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Submit Request</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {activeTab === 'give' && (
          <FlatList
            style={styles.flex}
            data={exchangeList}
            keyExtractor={listItem => String(listItem.id)}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
            onRefresh={fetchExchangeList}
            refreshing={loadingExchange}
            ListEmptyComponent={
              loadingExchange ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1a1a1a" />
                  <Text style={styles.loadingText}>Loading requests...</Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="sparkles-outline" size={34} color="#CCCCCC" />
                  <Text style={styles.emptyTitle}>No requests yet</Text>
                  <Text style={styles.emptyText}>
                    There are no requests to help with at the moment.
                  </Text>
                </View>
              )
            }
            renderItem={renderGiveItem}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    marginBottom: 45,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  // Hero — solid black banner
  hero: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: FONTS_Family.FontBold,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONTS_Family.FontMedium,
  },
  // Tab switcher — black/white pill
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#1a1a1a',
  },
  tabText: {
    fontFamily: FONTS_Family.FontMedium,
    color: '#555555',
    fontSize: 14,
  },
  activeText: {
    color: '#FFFFFF',
    fontFamily: FONTS_Family.FontBold,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    fontFamily: FONTS_Family.FontMedium,
    color: '#000000',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FONTS_Family.FontMedium,
    color: '#000000',
  },
  multilineInput: {
    minHeight: 100,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONTS_Family.FontBold,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyState: {
    marginTop: 30,
    padding: 22,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
    fontFamily: FONTS_Family.FontBold,
  },
  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    color: '#555555',
    fontFamily: FONTS_Family.FontMedium,
    lineHeight: 20,
  },
  // List cards — white with grey border
  listCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listHeaderText: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: FONTS_Family.FontBold,
    color: '#000000',
  },
  listDesc: {
    marginTop: 12,
    fontFamily: FONTS_Family.FontMedium,
    color: '#333333',
    lineHeight: 20,
  },
  listPhone: {
    marginTop: 2,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontBold,
  },
  callButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontFamily: FONTS_Family.FontBold,
    fontSize: 14,
  },
  listUserName: {
    marginTop: 2,
    fontSize: 12,
    color: '#555555',
    fontFamily: FONTS_Family.FontMedium,
  },
  listDate: {
    marginTop: 2,
    fontSize: 11,
    color: '#888888',
    fontFamily: FONTS_Family.FontMedium,
  },
  listFooter: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#555555',
    fontFamily: FONTS_Family.FontMedium,
  },
});
