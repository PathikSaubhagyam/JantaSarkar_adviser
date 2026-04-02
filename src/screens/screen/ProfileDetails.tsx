import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import { pick } from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';

import { COLORS } from '../../constants/Colors';
import TextCommonSemiBold from '../../components/TextCommonSemiBold';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextCommonBold from '../../components/TextCommonBold';
import TextInputView from '../../components/TextInputView';
import SnackBarCommon from '../../components/SnackBarCommon';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';
import CommonButton from '../../components/CommonButton';
import APIWebCall from '../../common/APIWebCall';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';

const ProfileDetails = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const profileData = route?.params?.profileData;
  console.log(profileData, 'profile get dat===>>>');

  const routePhone = route?.params?.phoneNumber || '';
  // const routeUserId = route?.params?.userId || '';

  const [fullName, setFullName] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'personal' | 'business'>(
    'basic',
  );
  const [registorNo, setRegistorNo] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(routePhone);
  const [barDoc, setBarDoc] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityItems, setCityItems] = useState([]);
  const [routeUserId, setRouteUserId] = useState([]);
  /* ---------------- Experience Dropdown ---------------- */
  const [expOpen, setExpOpen] = useState(false);
  const [expValue, setExpValue] = useState(null);
  const [expItems, setExpItems] = useState([
    { label: '0-1 Years', value: '0-1' },
    { label: '1-3 Years', value: '1-3' },
    { label: '3-5 Years', value: '3-5' },
    { label: '5+ Years', value: '5+' },
  ]);

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Tran', value: 'tran' },
  ]);

  const [caste, setCaste] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [dobDayOpen, setDobDayOpen] = useState(false);
  const [dobMonthOpen, setDobMonthOpen] = useState(false);
  const [dobYearOpen, setDobYearOpen] = useState(false);
  const [dobDay, setDobDay] = useState<number | null>(null);
  const [dobMonth, setDobMonth] = useState<number | null>(null);
  const [dobYear, setDobYear] = useState<number | null>(null);
  const [dobDayItems, setDobDayItems] = useState(
    Array.from({ length: 31 }, (_, index) => ({
      label: String(index + 1).padStart(2, '0'),
      value: index + 1,
    })),
  );
  const [dobMonthItems, setDobMonthItems] = useState([
    { label: 'Jan', value: 1 },
    { label: 'Feb', value: 2 },
    { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 },
    { label: 'May', value: 5 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 },
    { label: 'Aug', value: 8 },
    { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 },
    { label: 'Nov', value: 11 },
    { label: 'Dec', value: 12 },
  ]);
  const currentYear = new Date().getFullYear();
  const [dobYearItems, setDobYearItems] = useState(
    Array.from({ length: 100 }, (_, index) => ({
      label: String(currentYear - index),
      value: currentYear - index,
    })),
  );
  const [education, setEducation] = useState('');
  const [socialLink, setSocialLink] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessOther, setBusinessOther] = useState('');

  const formatDobForDisplay = (value?: string) => {
    if (!value) {
      return '';
    }

    const rawValue = String(value).trim();

    if (/^\d{2}-\d{2}-\d{4}$/.test(rawValue)) {
      return rawValue;
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawValue);
    if (isoMatch) {
      return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`;
    }

    return rawValue;
  };

  const parseDobParts = (value?: string) => {
    if (!value) {
      return null;
    }

    const rawValue = String(value).trim();

    const ddMmYyyyMatch = /^(\d{2})-(\d{2})-(\d{4})$/.exec(rawValue);
    if (ddMmYyyyMatch) {
      return {
        day: Number(ddMmYyyyMatch[1]),
        month: Number(ddMmYyyyMatch[2]),
        year: Number(ddMmYyyyMatch[3]),
      };
    }

    const yyyyMmDdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawValue);
    if (yyyyMmDdMatch) {
      return {
        day: Number(yyyyMmDdMatch[3]),
        month: Number(yyyyMmDdMatch[2]),
        year: Number(yyyyMmDdMatch[1]),
      };
    }

    return null;
  };

  useEffect(() => {
    if (routePhone) {
      setPhoneNumber(routePhone);
    }
  }, [routePhone]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const res = await APIWebCall.onProfileAPICall();
        console.log(res, 'get profile data');

        if (res?.status === true || res?.success === true) {
          const apiProfile = res?.data || {};

          setFullName(apiProfile?.full_name || '');
          setEmail(apiProfile?.email || '');
          setPhoneNumber(apiProfile?.phone_number || routePhone || '');
          setRegistorNo(apiProfile?.bar_council_registration_no || '');
          setExpValue(apiProfile?.experience || null);
          setCityValue(apiProfile?.city_id || null);
          setRouteUserId(apiProfile?.id || null);
          setCaste(apiProfile?.caste || '');
          setBloodGroup(apiProfile?.blood_group || '');
          setDob(formatDobForDisplay(apiProfile?.dob));
          setAge(apiProfile?.age ? String(apiProfile.age) : '');
          setGenderValue(apiProfile?.gender || null);
          setEducation(apiProfile?.education || '');
          setSocialLink(apiProfile?.social_link || '');
          setBusinessName(apiProfile?.business_name || '');
          setBusinessAddress(apiProfile?.business_address || '');
          setBusinessOther(apiProfile?.business_other || '');

          const dobParts = parseDobParts(apiProfile?.dob);
          if (dobParts) {
            setDobDay(dobParts.day);
            setDobMonth(dobParts.month);
            setDobYear(dobParts.year);
          }

          // Also make sure city label exists in dropdown
          if (apiProfile?.city && apiProfile?.city_id) {
            setCityItems(prev => {
              const exists = prev.find(
                item => item.value === apiProfile.city_id,
              );
              if (!exists) {
                return [
                  ...prev,
                  {
                    label: apiProfile.city,
                    value: apiProfile.city_id,
                  },
                ];
              }
              return prev;
            });
          }
          // setCityValue(apiProfile?.city?.id || apiProfile?.city_id || null);
        }
      } catch (error) {
        console.log('PROFILE API ERROR =>', error);
      }
    };

    fetchProfileDetails();
  }, [routePhone]);

  useEffect(() => {
    const dobParts = parseDobParts(dob);

    if (!dobParts) {
      setAge('');
      return;
    }

    const { day, month, year } = dobParts;
    const monthIndex = month - 1;
    const parsedDob = new Date(year, monthIndex, day);

    if (
      Number.isNaN(parsedDob.getTime()) ||
      parsedDob.getDate() !== day ||
      parsedDob.getMonth() !== monthIndex ||
      parsedDob.getFullYear() !== year
    ) {
      setAge('');
      return;
    }

    const today = new Date();
    let computedAge = today.getFullYear() - parsedDob.getFullYear();
    const monthDiff = today.getMonth() - parsedDob.getMonth();
    const dayDiff = today.getDate() - parsedDob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      computedAge -= 1;
    }

    setAge(computedAge >= 0 ? String(computedAge) : '');
  }, [dob]);

  const calculateAgeFromDate = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month - 1, day);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getDate() !== day ||
      selectedDate.getMonth() !== month - 1 ||
      selectedDate.getFullYear() !== year
    ) {
      setAge('');
      return;
    }

    const today = new Date();
    let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      calculatedAge -= 1;
    }

    setAge(calculatedAge >= 0 ? String(calculatedAge) : '');
  };

  const openDobPicker = () => setDobModalVisible(true);
  const closeDobPicker = () => setDobModalVisible(false);

  const confirmDobSelection = () => {
    if (!dobDay || !dobMonth || !dobYear) {
      return;
    }

    const formattedDob = `${String(dobDay).padStart(2, '0')}-${String(
      dobMonth,
    ).padStart(2, '0')}-${dobYear}`;

    setDob(formattedDob);
    calculateAgeFromDate(dobDay, dobMonth, dobYear);
    closeDobPicker();
  };

  const pickBarDocument = async () => {
    try {
      const [file] = await pick({
        type: ['*/*'], // or ['application/pdf']
      });

      setBarDoc(file);

      SnackBarCommon.displayMessage({
        message: 'Bar Certificate Selected',
        isSuccess: true,
      });
    } catch (err) {
      SnackBarCommon.displayMessage({
        message: 'File selection failed',
        isSuccess: false,
      });
    }
  };

  const pickIdDocument = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.didCancel) return;

        if (response.errorCode) {
          SnackBarCommon.displayMessage({
            message: 'Image selection failed',
            isSuccess: false,
          });
          return;
        }

        if (response.assets?.length) {
          setIdDoc(response.assets[0]);

          SnackBarCommon.displayMessage({
            message: 'ID Selected',
            isSuccess: true,
          });
        }
      },
    );
  };

  const handleSubmit = () => {
    if (!fullName.trim()) {
      return SnackBarCommon.displayMessage({
        message: 'Enter Full Name',
        isSuccess: false,
      });
    }

    if (phoneNumber.length !== 10) {
      return SnackBarCommon.displayMessage({
        message: 'Enter Valid Mobile Number',
        isSuccess: false,
      });
    }
    if (!email) {
      return SnackBarCommon.displayMessage({
        message: 'Enter Email',
        isSuccess: false,
      });
    }
    if (!registorNo) {
      return SnackBarCommon.displayMessage({
        message: 'Enter Registretion No',
        isSuccess: false,
      });
    }
    if (!expValue) {
      return SnackBarCommon.displayMessage({
        message: 'Select Experience',
        isSuccess: false,
      });
    }

    if (!cityValue) {
      return SnackBarCommon.displayMessage({
        message: 'Select City',
        isSuccess: false,
      });
    }
    // if (!isChecked) {
    //   return SnackBarCommon.displayMessage({
    //     message: 'Please Check Terms Of Condition',
    //     isSuccess: false,
    //   });
    // }
    handleSignupApiCall();
  };

  const handleSignupApiCall = async () => {
    try {
      let formData = new FormData();

      const dobParts = parseDobParts(dob);
      const apiDob = dobParts
        ? `${dobParts.year}-${String(dobParts.month).padStart(2, '0')}-${String(
            dobParts.day,
          ).padStart(2, '0')}`
        : '';

      formData.append('full_name', fullName || '');
      formData.append('email', email || '');
      formData.append('phone_number', phoneNumber || '');
      formData.append('bar_council_registration_no', registorNo || '');
      formData.append('experience', expValue || '');
      formData.append('city_id', cityValue || '');
      formData.append('caste', caste || '');
      formData.append('blood_group', bloodGroup || '');
      formData.append('dob', apiDob || '');
      formData.append('gender', genderValue || '');
      formData.append('education', education || '');
      formData.append('social_link', socialLink || '');
      formData.append('business_name', businessName || '');
      formData.append('business_address', businessAddress || '');
      formData.append('business_other', businessOther || '');

      if (barDoc?.uri) {
        formData.append('bar_certificate', {
          uri:
            Platform.OS === 'android'
              ? barDoc.uri
              : barDoc.uri.replace('file://', ''),
          name: barDoc.name || 'bar_certificate.pdf',
          type: barDoc.type || 'application/pdf',
        });
      }

      if (idDoc?.uri) {
        formData.append('id_proof', {
          uri:
            Platform.OS === 'android'
              ? idDoc.uri
              : idDoc.uri.replace('file://', ''),
          name: idDoc.fileName || 'id_proof.jpg',
          type: idDoc.type || 'image/jpeg',
        });
      }

      const res = await APIWebCall.onSignUPAPICall(routeUserId, formData);
      console.log('User ID =>', routeUserId);

      if (res?.status === true || res?.success === true) {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Signup Success',
          isSuccess: true,
        });

        navigation.replace('HomeNavigator');
        if (res.user?.id) {
          await AsyncStorage.setItem('User_id', res.user?.id);
        }
      }
    } catch (error) {
      console.log('SIGNUP ERROR =>', error);

      // SnackBarCommon.displayMessage({
      //   message: 'Signup Failed',
      //   isSuccess: false,
      // });
    }
  };
  const loadCityList = async () => {
    try {
      setCityLoading(true);

      const res = await APIWebCall.oncityListAPICall();

      if (res?.status === true || res?.success === true) {
        const formattedCities = res?.data?.map(item => ({
          label: item.name,
          value: item.id,
        }));

        setCityItems(formattedCities);
      }
    } catch (error) {
      console.log('CITY LIST ERROR => ', error);
    } finally {
      setCityLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Header
              title="Edite Profile"
              onBackPress={() => navigation.goBack()}
            />

            <View style={styles.formContainer}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'basic' && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab('basic')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'basic' && styles.tabTextActive,
                    ]}
                  >
                    Basic Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'personal' && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab('personal')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'personal' && styles.tabTextActive,
                    ]}
                  >
                    Personal Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'business' && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab('business')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'business' && styles.tabTextActive,
                    ]}
                  >
                    Business Info
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'basic' && (
                <>
                  <TextCommonBold
                    text={'Full Name*'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="Adv. John Doe"
                    value={fullName}
                    onChangeText={setFullName}
                  />

                  <TextCommonBold
                    text={'Mobile Number*'}
                    textViewStyle={styles.label}
                  />

                  <View style={styles.phoneRow}>
                    <View style={styles.codeBox}>
                      <Text style={{ color: '#000000' }}>+91</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <TextInputView
                        placeholder="9876543210"
                        keyboardType="number-pad"
                        editable={false}
                        maxLength={10}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                  </View>

                  <TextCommonBold
                    text={'Email Address*'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="john@example.com"
                    value={email}
                    onChangeText={setEmail}
                  />

                  <TextCommonBold
                    text={'Bar Council Registretion No.*'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="Registration number"
                    value={registorNo}
                    editable={false}
                    onChangeText={setRegistorNo}
                  />

                  <View style={styles.row}>
                    <View style={styles.halfContainer}>
                      <TextCommonBold
                        text={'Experience'}
                        textViewStyle={styles.label}
                      />

                      <View style={{ zIndex: 2000 }}>
                        <DropDownPicker
                          open={expOpen}
                          value={expValue}
                          items={expItems}
                          setOpen={setExpOpen}
                          setValue={setExpValue}
                          setItems={setExpItems}
                          placeholder="Select Experience"
                          searchable={true}
                          listMode="MODAL"
                          modalProps={{
                            animationType: 'slide',
                          }}
                          modalContentContainerStyle={{
                            backgroundColor: '#fff',
                          }}
                          searchContainerStyle={{
                            borderBottomColor: COLORS.colorLightGray,
                            borderBottomWidth: 1,
                            padding: 5,
                          }}
                          searchTextInputStyle={{
                            borderColor: COLORS.colorLightGray,
                            borderBottomWidth: 1,
                            borderRadius: 8,
                            color: COLORS.black,
                          }}
                          searchPlaceholder="Select Experience"
                          style={styles.dropdownInput}
                          dropDownContainerStyle={styles.dropdownContainer}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.halfContainer}>
                    <TextCommonBold
                      text={'City'}
                      textViewStyle={styles.label}
                    />

                    <View style={{ zIndex: 2000 }}>
                      <DropDownPicker
                        open={cityOpen}
                        value={cityValue}
                        items={cityItems}
                        loading={cityLoading}
                        setOpen={open => {
                          setCityOpen(open);

                          if (open && cityItems.length === 0) {
                            loadCityList();
                          }
                        }}
                        setValue={setCityValue}
                        setItems={setCityItems}
                        placeholder="Select City"
                        searchable={true}
                        listMode="MODAL"
                        modalProps={{
                          animationType: 'slide',
                        }}
                        modalContentContainerStyle={{
                          backgroundColor: '#fff',
                        }}
                        searchContainerStyle={{
                          borderBottomColor: COLORS.colorLightGray,
                          borderBottomWidth: 1,
                          padding: 5,
                        }}
                        searchTextInputStyle={{
                          borderColor: COLORS.colorLightGray,
                          borderBottomWidth: 1,
                          borderRadius: 8,
                          color: COLORS.black,
                        }}
                        searchPlaceholder="Search city"
                        style={styles.dropdownInput}
                        dropDownContainerStyle={styles.dropdownContainer}
                      />
                    </View>
                  </View>
                </>
              )}

              {activeTab === 'personal' && (
                <>
                  <TextCommonBold text={'Caste'} textViewStyle={styles.label} />
                  <TextInputView
                    placeholder="Enter caste"
                    value={caste}
                    onChangeText={setCaste}
                  />

                  <TextCommonBold
                    text={'Blood Group'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="Ex: O+"
                    value={bloodGroup}
                    onChangeText={setBloodGroup}
                  />

                  <TextCommonBold text={'DOB'} textViewStyle={styles.label} />
                  <TouchableOpacity
                    style={styles.dobField}
                    onPress={openDobPicker}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dobFieldText,
                        !dob && styles.dobPlaceholder,
                      ]}
                    >
                      {dob || 'Select date of birth'}
                    </Text>
                  </TouchableOpacity>

                  <TextCommonBold text={'Age'} textViewStyle={styles.label} />
                  <TextInputView
                    placeholder="Auto filled from DOB"
                    value={age}
                    editable={false}
                    onChangeText={setAge}
                  />

                  <TextCommonBold
                    text={'Gender'}
                    textViewStyle={styles.label}
                  />
                  <View style={{ zIndex: 2000 }}>
                    <DropDownPicker
                      open={genderOpen}
                      value={genderValue}
                      items={genderItems}
                      setOpen={setGenderOpen}
                      setValue={setGenderValue}
                      setItems={setGenderItems}
                      placeholder="Select gender"
                      listMode="MODAL"
                      style={styles.dropdownInput}
                      dropDownContainerStyle={styles.dropdownContainer}
                    />
                  </View>

                  <TextCommonBold
                    text={'Education'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="Enter education"
                    value={education}
                    onChangeText={setEducation}
                  />

                  <TextCommonBold
                    text={'Social Link'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="https://..."
                    value={socialLink}
                    onChangeText={setSocialLink}
                  />
                </>
              )}

              {activeTab === 'business' && (
                <>
                  <TextCommonBold
                    text={'Business Name'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="Enter business name"
                    value={businessName}
                    onChangeText={setBusinessName}
                  />

                  <TextCommonBold
                    text={'Business Address'}
                    textViewStyle={styles.label}
                  />
                  <TextInputView
                    placeholder="Enter business address"
                    value={businessAddress}
                    onChangeText={setBusinessAddress}
                  />

                  <TextCommonBold text={'Other'} textViewStyle={styles.label} />
                  <TextInputView
                    placeholder="Other details"
                    value={businessOther}
                    onChangeText={setBusinessOther}
                  />
                </>
              )}

              <View style={{ marginTop: 30 }}>
                <CommonButton text=" Update" onPress={handleSubmit} />
              </View>
            </View>
          </ScrollView>

          <Modal
            visible={dobModalVisible}
            transparent
            animationType="fade"
            onRequestClose={closeDobPicker}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.dobModalCard}>
                <TextCommonBold
                  text={'Select DOB'}
                  textViewStyle={styles.dobModalTitle}
                />

                <View style={styles.dobPickerRow}>
                  <View style={[styles.dobPickerColumn, { zIndex: 3000 }]}>
                    <Text style={styles.dobPickerLabel}>Day</Text>
                    <DropDownPicker
                      open={dobDayOpen}
                      value={dobDay}
                      items={dobDayItems}
                      setOpen={setDobDayOpen}
                      setValue={setDobDay}
                      setItems={setDobDayItems}
                      placeholder="Day"
                      listMode="MODAL"
                      style={styles.dobDropdown}
                      dropDownContainerStyle={styles.dobDropdownContainer}
                    />
                  </View>

                  <View style={[styles.dobPickerColumn, { zIndex: 2000 }]}>
                    <Text style={styles.dobPickerLabel}>Month</Text>
                    <DropDownPicker
                      open={dobMonthOpen}
                      value={dobMonth}
                      items={dobMonthItems}
                      setOpen={setDobMonthOpen}
                      setValue={setDobMonth}
                      setItems={setDobMonthItems}
                      placeholder="Month"
                      listMode="MODAL"
                      style={styles.dobDropdown}
                      dropDownContainerStyle={styles.dobDropdownContainer}
                    />
                  </View>

                  <View style={[styles.dobPickerColumn, { zIndex: 1000 }]}>
                    <Text style={styles.dobPickerLabel}>Year</Text>
                    <DropDownPicker
                      open={dobYearOpen}
                      value={dobYear}
                      items={dobYearItems}
                      setOpen={setDobYearOpen}
                      setValue={setDobYear}
                      setItems={setDobYearItems}
                      placeholder="Year"
                      listMode="MODAL"
                      style={styles.dobDropdown}
                      dropDownContainerStyle={styles.dobDropdownContainer}
                    />
                  </View>
                </View>

                <View style={styles.dobActionRow}>
                  <TouchableOpacity
                    style={[styles.dobActionButton, styles.dobCancelButton]}
                    onPress={closeDobPicker}
                  >
                    <Text style={styles.dobCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dobActionButton, styles.dobSaveButton]}
                    onPress={confirmDobSelection}
                  >
                    <Text style={styles.dobSaveText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 30,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },

  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS_Family.FontBold,
  },

  termsText: {
    color: COLORS.color_txt_gray,
    fontSize: FONTS_SIZE.txt_14,
  },

  termsLink: {
    color: COLORS.primary,
    fontSize: FONTS_SIZE.txt_14,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  halfContainer: {
    flex: 1,
  },

  dropdown: {
    borderColor: '#ddd',
    minHeight: 50,
  },

  dropdownContainer: {
    borderColor: '#ddd',
  },

  label: {
    marginTop: 15,
    marginBottom: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: FONTS_SIZE.txt_16,
    color: COLORS.black,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 0,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray,
    borderRadius: 0,
    backgroundColor: COLORS.white,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 0,
  },
  tabText: {
    color: COLORS.black,
    fontSize: FONTS_SIZE.txt_12,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    color: COLORS.black,
  },
  dobField: {
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dobFieldText: {
    color: COLORS.black,
    fontSize: FONTS_SIZE.txt_14,
    fontFamily: FONTS_Family.FontMedium,
  },
  dobPlaceholder: {
    color: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dobModalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  dobModalTitle: {
    marginTop: 0,
    marginBottom: 14,
    color: COLORS.black,
  },
  dobPickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dobPickerColumn: {
    flex: 1,
  },
  dobPickerLabel: {
    marginBottom: 6,
    color: COLORS.black,
    fontFamily: FONTS_Family.FontMedium,
  },
  dobDropdown: {
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    borderRadius: 10,
    minHeight: 48,
  },
  dobDropdownContainer: {
    borderColor: COLORS.gray,
  },
  dobActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  dobActionButton: {
    minWidth: 90,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  dobCancelButton: {
    backgroundColor: '#E5E7EB',
  },
  dobSaveButton: {
    backgroundColor: COLORS.primary,
  },
  dobCancelText: {
    color: COLORS.black,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  dobSaveText: {
    color: COLORS.white,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  dropdownInput: {
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    borderRadius: 10,
    minHeight: 50,
  },
  dropdownContainer: {
    borderBottomColor: COLORS.colorLightGray,
    borderWidth: 1,
  },
  dropdown: {
    borderColor: '#ddd',
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  uploadBox: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
});
