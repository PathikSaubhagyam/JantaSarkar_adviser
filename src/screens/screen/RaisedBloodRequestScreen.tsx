import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import Header from '../../components/Header';
import TextCommonBold from '../../components/TextCommonBold';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextCommonRegular from '../../components/TextCommonRegular';
import TextInputView from '../../components/TextInputView';
import CommonButton from '../../components/CommonButton';
import SnackBarCommon from '../../components/SnackBarCommon';
import { COLORS } from '../../constants/Colors';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';
import APIWebCall from '../../common/APIWebCall';

const BLOOD_GROUP_OPTIONS = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
];

const RaisedBloodRequestScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'generate' | 'list'>('generate');

  // ─── Generate Tab state ──────────────────────────────────────────
  const [bgOpen, setBgOpen] = useState(false);
  const [bgValue, setBgValue] = useState<string | null>(null);
  const [bgItems] = useState(BLOOD_GROUP_OPTIONS);
  const [reason, setReason] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState<number | null>(null);
  const [cityItems, setCityItems] = useState<any[]>([]);
  const [cityLoading, setCityLoading] = useState(false);

  // ─── List Tab state ──────────────────────────────────────────────
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);

  const [filterBGOpen, setFilterBGOpen] = useState(false);
  const [filterBGValue, setFilterBGValue] = useState<string | null>(null);
  const [filterBGItems] = useState(BLOOD_GROUP_OPTIONS);

  const [filterCityOpen, setFilterCityOpen] = useState(false);
  const [filterCityValue, setFilterCityValue] = useState<number | null>(null);
  const [filterCityItems, setFilterCityItems] = useState<any[]>([]);
  const [filterCityLoading, setFilterCityLoading] = useState(false);

  // ─── Load city list ──────────────────────────────────────────────
  const loadCityList = async (
    setItems: (v: any[]) => void,
    setLoading: (v: boolean) => void,
  ) => {
    try {
      setLoading(true);
      const res = await APIWebCall.oncityListAPICall();
      if (res?.status === true || res?.success === true) {
        const formattedCities = res?.data?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setItems(formattedCities);
      }
    } catch (error) {
      console.log('CITY LIST ERROR => ', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch blood requests ────────────────────────────────────────
  const fetchBloodRequests = useCallback(
    async (cityId: number | null = null, bloodGrp: string | null = null) => {
      try {
        setListLoading(true);
        const res = await APIWebCall.onBloodRequestListAPICall(
          cityId,
          bloodGrp,
        );
        if (res?.status === true || res?.success === true) {
          setBloodRequests(res?.results ?? []);
        } else {
          setBloodRequests([]);
        }
      } catch (error) {
        console.log('BLOOD REQUEST LIST ERROR => ', error);
      } finally {
        setListLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (activeTab === 'list') {
      fetchBloodRequests();
    }
  }, [activeTab]);

  // ─── Submit form ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!bgValue) {
      SnackBarCommon.displayMessage({
        message: 'Please select blood group',
        isSuccess: false,
      });
      return;
    }
    if (!reason.trim()) {
      SnackBarCommon.displayMessage({
        message: 'Please enter reason',
        isSuccess: false,
      });
      return;
    }
    if (mobileNo.trim().length !== 10) {
      SnackBarCommon.displayMessage({
        message: 'Please enter valid mobile number',
        isSuccess: false,
      });
      return;
    }
    if (!cityValue) {
      SnackBarCommon.displayMessage({
        message: 'Please select a city',
        isSuccess: false,
      });
      return;
    }
    try {
      setIsLoading(true);
      const params = {
        blood_group: bgValue,
        reason: reason.trim(),
        mobile_no: mobileNo.trim(),
        city_id: cityValue,
      };
      const res = await APIWebCall.onBloodRequestCreateAPICall(params);
      if (res?.status === true || res?.success === true) {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Blood request submitted successfully',
          isSuccess: true,
        });
        navigation.goBack();
      } else {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Failed to submit blood request',
          isSuccess: false,
        });
      }
    } catch (error) {
      console.log('BLOOD REQUEST ERROR => ', error);
      SnackBarCommon.displayMessage({
        message: 'Something went wrong. Please try again.',
        isSuccess: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = () => {
    fetchBloodRequests(filterCityValue, filterBGValue);
  };

  const handleClearFilter = () => {
    setFilterBGValue(null);
    setFilterCityValue(null);
    fetchBloodRequests();
  };

  const getRequestPhoneNumber = (item: any) => {
    return String(
      item?.mobile_no ?? item?.mobile ?? item?.phone_no ?? item?.phone ?? '',
    ).trim();
  };

  const handleCall = async (mobileNumber: string) => {
    const phoneNumber = String(mobileNumber ?? '').trim();

    if (!phoneNumber) {
      SnackBarCommon.displayMessage({
        message: 'Mobile number not available',
        isSuccess: false,
      });
      return;
    }

    try {
      const phoneUrl = `tel:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);

      if (!canOpen) {
        SnackBarCommon.displayMessage({
          message: 'Calling is not supported on this device',
          isSuccess: false,
        });
        return;
      }

      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.log('CALL ERROR => ', error);
      SnackBarCommon.displayMessage({
        message: 'Unable to start call',
        isSuccess: false,
      });
    }
  };

  // ─── Blood request card ──────────────────────────────────────────
  const renderBloodCard = ({ item }: { item: any }) => {
    const phoneNumber = getRequestPhoneNumber(item);

    return (
      <View style={styles.bloodCard}>
        <View style={styles.bloodCardHeader}>
          <View style={styles.bloodGroupBadge}>
            <Text style={styles.bloodGroupText}>{item.blood_group}</Text>
          </View>
          <TextCommonRegular
            text={item.created_at}
            textViewStyle={styles.cardDate}
          />
        </View>
        <View style={styles.cardRow}>
          <TextCommonMedium text="Reason: " textViewStyle={styles.cardLabel} />
          <TextCommonRegular
            text={item.reason}
            textViewStyle={styles.cardValue}
          />
        </View>
        <View style={styles.cardRow}>
          <TextCommonMedium text="City: " textViewStyle={styles.cardLabel} />
          <TextCommonRegular
            text={item.city}
            textViewStyle={styles.cardValue}
          />
        </View>
        <View style={styles.cardRow}>
          <TextCommonMedium text="Mobile: " textViewStyle={styles.cardLabel} />
          <TextCommonRegular
            text={phoneNumber || 'Not available'}
            textViewStyle={styles.cardValue}
          />
        </View>
        {/* <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(phoneNumber)}
          activeOpacity={0.8}
        >
          <Text style={styles.callButtonText}>Call Now</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Blood Request" onBackPress={() => navigation.goBack()} />

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'generate' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('generate')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'generate' && styles.tabTextActive,
            ]}
          >
            Generate Request
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'list' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('list')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'list' && styles.tabTextActive,
            ]}
          >
            Blood Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Generate Request Tab ── */}
      {activeTab === 'generate' && (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formCard}>
              <TextCommonBold
                text={'Blood Group'}
                textViewStyle={styles.label}
              />
              <View style={[styles.dropdownWrapper, { zIndex: 3000 }]}>
                <DropDownPicker
                  open={bgOpen}
                  value={bgValue}
                  items={bgItems}
                  setOpen={setBgOpen}
                  setValue={setBgValue}
                  setItems={() => {}}
                  placeholder="Select Blood Group"
                  searchable={true}
                  listMode="MODAL"
                  modalProps={{ animationType: 'slide' }}
                  modalContentContainerStyle={{ backgroundColor: '#fff' }}
                  searchContainerStyle={{
                    borderBottomColor: COLORS.colorLightGray,
                    borderBottomWidth: 1,
                    padding: 5,
                  }}
                  searchTextInputStyle={{
                    borderColor: COLORS.colorLightGray,
                    borderRadius: 8,
                    color: COLORS.black,
                  }}
                  searchPlaceholder="Search blood group..."
                  style={styles.dropdownInput}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>

              <TextCommonBold text={'Reason'} textViewStyle={styles.label} />
              <TextInputView
                containerStyle={styles.reasonInputContainer}
                style={styles.reasonInputText}
                placeholder="Enter reason"
                value={reason}
                onChangeText={setReason}
                maxLength={150}
                desheight="des"
              />
              <TextCommonMedium
                text={`${reason.length}/150`}
                textViewStyle={styles.charCounter}
              />

              <TextCommonBold
                text={'Mobile No'}
                textViewStyle={[styles.label, { marginTop: -10 }]}
              />
              <TextInputView
                placeholder="Enter 10 digit number"
                value={mobileNo}
                onChangeText={setMobileNo}
                keyboardType="number-pad"
                maxLength={10}
              />

              <TextCommonBold text={'City'} textViewStyle={styles.label} />
              <View style={styles.dropdownWrapper}>
                <DropDownPicker
                  open={cityOpen}
                  value={cityValue}
                  items={cityItems}
                  loading={cityLoading}
                  setOpen={open => {
                    setCityOpen(open);
                    if (open && cityItems.length === 0) {
                      loadCityList(setCityItems, setCityLoading);
                    }
                  }}
                  setValue={setCityValue}
                  setItems={setCityItems}
                  placeholder="Select City"
                  searchable={true}
                  listMode="MODAL"
                  modalProps={{ animationType: 'slide' }}
                  modalContentContainerStyle={{ backgroundColor: '#fff' }}
                  searchContainerStyle={{
                    borderBottomColor: COLORS.colorLightGray,
                    borderBottomWidth: 1,
                    padding: 5,
                  }}
                  searchTextInputStyle={{
                    borderColor: COLORS.colorLightGray,
                    borderRadius: 8,
                    color: COLORS.black,
                  }}
                  searchPlaceholder="Search city..."
                  style={styles.dropdownInput}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>

              <View style={styles.btnWrap}>
                <CommonButton
                  text={isLoading ? 'Submitting...' : 'Submit'}
                  onPress={handleSubmit}
                  disabled={isLoading}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* ── Blood Requests Tab ── */}
      {activeTab === 'list' && (
        <View style={styles.flex}>
          {/* Filter row */}
          <View style={styles.filterCard}>
            <View style={styles.filterRow}>
              <View style={[styles.filterDropdown, { zIndex: 3000 }]}>
                <DropDownPicker
                  open={filterBGOpen}
                  value={filterBGValue}
                  items={filterBGItems}
                  setOpen={open => {
                    setFilterBGOpen(open);
                    if (open) setFilterCityOpen(false);
                  }}
                  setValue={setFilterBGValue}
                  setItems={() => {}}
                  placeholder="Blood Group"
                  searchable={true}
                  listMode="MODAL"
                  modalProps={{ animationType: 'slide' }}
                  modalContentContainerStyle={{ backgroundColor: '#fff' }}
                  searchContainerStyle={{
                    borderBottomColor: COLORS.colorLightGray,
                    borderBottomWidth: 1,
                    padding: 5,
                  }}
                  searchTextInputStyle={{
                    borderColor: COLORS.colorLightGray,
                    borderRadius: 8,
                    color: COLORS.black,
                  }}
                  searchPlaceholder="Search blood group..."
                  style={styles.dropdownInput}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>
              <View style={[styles.filterDropdown, { zIndex: 2000 }]}>
                <DropDownPicker
                  open={filterCityOpen}
                  value={filterCityValue}
                  items={filterCityItems}
                  loading={filterCityLoading}
                  setOpen={open => {
                    setFilterCityOpen(open);
                    if (open) setFilterBGOpen(false);
                    if (open && filterCityItems.length === 0) {
                      loadCityList(setFilterCityItems, setFilterCityLoading);
                    }
                  }}
                  setValue={setFilterCityValue}
                  setItems={setFilterCityItems}
                  placeholder="City"
                  searchable={true}
                  listMode="MODAL"
                  modalProps={{ animationType: 'slide' }}
                  modalContentContainerStyle={{ backgroundColor: '#fff' }}
                  searchContainerStyle={{
                    borderBottomColor: COLORS.colorLightGray,
                    borderBottomWidth: 1,
                    padding: 5,
                  }}
                  searchTextInputStyle={{
                    borderColor: COLORS.colorLightGray,
                    borderRadius: 8,
                    color: COLORS.black,
                  }}
                  searchPlaceholder="Search city..."
                  style={styles.dropdownInput}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>
            </View>
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={handleApplyFilter}
                activeOpacity={0.8}
              >
                <Text style={styles.filterBtnText}>Apply Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterBtn, styles.clearBtn]}
                onPress={handleClearFilter}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterBtnText, styles.clearBtnText]}>
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {listLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={bloodRequests}
              keyExtractor={item => String(item.id)}
              renderItem={renderBloodCard}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <TextCommonMedium
                    text="No blood requests found."
                    textViewStyle={styles.emptyText}
                  />
                </View>
              }
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default RaisedBloodRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  // ─── Tab bar ─────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    backgroundColor: COLORS.colorLightGray,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_13,
    color: COLORS.gry_text,
  },
  tabTextActive: {
    color: COLORS.white,
    fontFamily: FONTS_Family.FontBold,
  },
  // ─── Generate form ────────────────────────────────────────────────
  formCard: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    color: COLORS.black,
  },
  reasonInputContainer: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    backgroundColor: COLORS.white,
    minHeight: 120,
    alignItems: 'flex-start',
  },
  reasonInputText: {
    flex: 1,
    width: '100%',
    textAlignVertical: 'top',
    color: COLORS.black,
  },
  charCounter: {
    marginTop: 6,
    textAlign: 'right',
    color: '#6B7280',
    fontSize: 12,
  },
  dropdownWrapper: {
    zIndex: 2000,
  },
  dropdownInput: {
    borderColor: COLORS.colorLightGray,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    minHeight: 46,
  },
  dropdownContainer: {
    borderColor: COLORS.colorLightGray,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  btnWrap: {
    marginTop: 24,
  },
  // ─── Filter ───────────────────────────────────────────────────────
  filterCard: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: COLORS.white,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterDropdown: {
    flex: 1,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterBtnText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_13,
    color: COLORS.white,
  },
  clearBtn: {
    backgroundColor: COLORS.colorLightGray,
  },
  clearBtnText: {
    color: COLORS.gry_text,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyWrap: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.gry_text,
    fontSize: FONTS_SIZE.txt_14,
  },
  // ─── Blood request card ───────────────────────────────────────────
  bloodCard: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: COLORS.white,
  },
  bloodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bloodGroupBadge: {
    backgroundColor: '#FDECEA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  bloodGroupText: {
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_14,
    color: COLORS.colorRed,
  },
  cardDate: {
    fontSize: FONTS_SIZE.txt_11,
    color: COLORS.gry_text,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  cardLabel: {
    fontSize: FONTS_SIZE.txt_13,
    color: COLORS.black,
  },
  cardValue: {
    flex: 1,
    fontSize: FONTS_SIZE.txt_13,
    color: COLORS.gry_text,
  },
  callButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  callButtonText: {
    color: COLORS.white,
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_13,
  },
});
