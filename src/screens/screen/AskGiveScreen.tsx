import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { FONTS_Family } from '../../constants/Font';
import CommonModal, { ModalType } from '../../components/CommonModal';
import {
  onSpecificAskListAPICall,
  onSpecificGiveListAPICall,
} from '../../common/APIWebCall';

type ModalState = {
  visible: boolean;
  title: string;
  message: string;
  type: ModalType;
};

export default function AskGiveScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'ask' | 'give'>('ask');

  const [specificAskList, setSpecificAskList] = useState<any[]>([]);
  const [loadingSpecificAsk, setLoadingSpecificAsk] = useState(false);
  const [specificGiveList, setSpecificGiveList] = useState<any[]>([]);
  const [loadingSpecificGive, setLoadingSpecificGive] = useState(false);
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

  const fetchSpecificGiveList = async () => {
    try {
      setLoadingSpecificGive(true);
      const data = await onSpecificGiveListAPICall();

      if ((data?.status || data?.success) && Array.isArray(data?.data)) {
        setSpecificGiveList(data.data);
      } else {
        setSpecificGiveList([]);
      }
    } catch (error) {
      console.log('Error fetching specific give list:', error);
      setSpecificGiveList([]);
    } finally {
      setLoadingSpecificGive(false);
    }
  };

  const fetchSpecificAskList = async () => {
    try {
      setLoadingSpecificAsk(true);
      const data = await onSpecificAskListAPICall();

      if ((data?.status || data?.success) && Array.isArray(data?.data)) {
        setSpecificAskList(data.data);
      } else {
        setSpecificAskList([]);
      }
    } catch (error) {
      console.log('Error fetching specific ask list:', error);
      setSpecificAskList([]);
    } finally {
      setLoadingSpecificAsk(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'give') {
      fetchSpecificGiveList();
    } else {
      fetchSpecificAskList();
    }
  }, [activeTab]);

  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === 'ask') {
        fetchSpecificAskList();
      } else {
        fetchSpecificGiveList();
      }
    }, [activeTab]),
  );

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
    const contactLabel =
      String(listItem?.contact_person || '').trim() || 'No contact person';
    const usefulForLabel =
      String(listItem?.useful_for || '').trim() || 'No details shared';
    const imageUri = String(listItem?.image || '').trim();

    return (
      <View style={styles.listCard}>
        <View style={styles.listHeaderRow}>
          <View style={styles.listIconWrap}>
            <Ionicons name="gift-outline" size={18} color="#1a1a1a" />
          </View>
          <View style={styles.listHeaderText}>
            <Text style={styles.listTitle}>{contactLabel}</Text>
            <Text style={styles.listUserName}>
              {listItem?.user_name || '-'}
            </Text>
            <Text style={styles.listDate}>{listItem?.created_at || '-'}</Text>
          </View>
        </View>

        {!!imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.giveImage}
            resizeMode="cover"
          />
        )}

        <Text style={styles.listDesc}>{usefulForLabel}</Text>

        <View style={styles.giveMetaWrap}>
          <Text style={styles.giveMetaText}>
            Designation: {String(listItem?.designation || '-').trim() || '-'}
          </Text>
          <Text style={styles.giveMetaText}>
            Company: {String(listItem?.company_name || '-').trim() || '-'}
          </Text>
        </View>
      </View>
    );
  };

  const renderAskItem = ({ item: listItem }: { item: any }) => {
    const contactLabel =
      String(listItem?.contact_person || '').trim() || 'No contact person';
    const purposeLabel =
      String(listItem?.purpose || '').trim() || 'No purpose shared';
    const imageUri = String(listItem?.image || '').trim();

    return (
      <View style={styles.listCard}>
        <View style={styles.listHeaderRow}>
          <View style={styles.listIconWrap}>
            <Ionicons name="help-circle-outline" size={18} color="#1a1a1a" />
          </View>
          <View style={styles.listHeaderText}>
            <Text style={styles.listTitle}>{contactLabel}</Text>
            <Text style={styles.listUserName}>
              {listItem?.user_name || '-'}
            </Text>
            <Text style={styles.listDate}>{listItem?.created_at || '-'}</Text>
          </View>
        </View>

        {!!imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.askImage}
            resizeMode="cover"
          />
        )}

        <Text style={styles.listDesc}>{purposeLabel}</Text>

        <View style={styles.askMetaWrap}>
          <Text style={styles.askMetaText}>
            Designation: {String(listItem?.designation || '-').trim() || '-'}
          </Text>
          <Text style={styles.askMetaText}>
            Company: {String(listItem?.company_name || '-').trim() || '-'}
          </Text>
          <Text style={styles.askMetaText}>
            Area: {String(listItem?.area || '-').trim() || '-'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={{ marginTop: -15 }}>
        <Header title="Ask & Give" onBackPress={() => navigation.goBack()} />
      </View>

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
          <FlatList
            style={styles.flex}
            data={specificAskList}
            keyExtractor={listItem => String(listItem.id)}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
            onRefresh={fetchSpecificAskList}
            refreshing={loadingSpecificAsk}
            ListEmptyComponent={
              loadingSpecificAsk ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1a1a1a" />
                  <Text style={styles.loadingText}>Loading asks...</Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="help-buoy-outline"
                    size={34}
                    color="#CCCCCC"
                  />
                  <Text style={styles.emptyTitle}>No asks yet</Text>
                  <Text style={styles.emptyText}>
                    No specific ask posts available right now.
                  </Text>
                </View>
              )
            }
            renderItem={renderAskItem}
          />
        )}

        {activeTab === 'give' && (
          <FlatList
            style={styles.flex}
            data={specificGiveList}
            keyExtractor={listItem => String(listItem.id)}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
            onRefresh={fetchSpecificGiveList}
            refreshing={loadingSpecificGive}
            ListEmptyComponent={
              loadingSpecificGive ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1a1a1a" />
                  <Text style={styles.loadingText}>Loading gives...</Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="gift-outline" size={34} color="#CCCCCC" />
                  <Text style={styles.emptyTitle}>No gives yet</Text>
                  <Text style={styles.emptyText}>
                    No specific give posts available right now.
                  </Text>
                </View>
              )
            }
            renderItem={renderGiveItem}
          />
        )}

        {activeTab === 'ask' && (
          <TouchableOpacity
            style={styles.fabButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SpecificAskCreateScreen')}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {activeTab === 'give' && (
          <TouchableOpacity
            style={styles.fabButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SpecificGiveCreateScreen')}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    // marginBottom: 45,
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
  askImage: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: '#F0F0F0',
  },
  askMetaWrap: {
    marginTop: 10,
    gap: 4,
  },
  askMetaText: {
    color: '#444444',
    fontSize: 13,
    fontFamily: FONTS_Family.FontMedium,
  },
  giveImage: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: '#F0F0F0',
  },
  giveMetaWrap: {
    marginTop: 10,
    gap: 4,
  },
  giveMetaText: {
    color: '#444444',
    fontSize: 13,
    fontFamily: FONTS_Family.FontMedium,
  },
  fabButton: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
