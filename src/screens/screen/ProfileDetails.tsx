import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
  TextInput,
} from 'react-native';

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
import CustomDropdown from '../../components/CustomDropdown';

type DropdownOption = {
  label: string;
  value: string | number;
};

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
  const [barDoc, setBarDoc] = useState<any>(null);
  const [idDoc, setIdDoc] = useState<any>(null);
  const [cityValue, setCityValue] = useState<string | number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityItems, setCityItems] = useState<DropdownOption[]>([]);
  const [hasLoadedCityList, setHasLoadedCityList] = useState(false);
  const [routeUserId, setRouteUserId] = useState<number | null>(null);
  /* ---------------- Experience Dropdown ---------------- */
  const [expValue, setExpValue] = useState(null);
  const [expItems, setExpItems] = useState([
    { label: '0-1 Years', value: '0-1' },
    { label: '1-3 Years', value: '1-3' },
    { label: '3-5 Years', value: '3-5' },
    { label: '5+ Years', value: '5+' },
  ]);

  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    // { label: 'Tran', value: 'tran' },
  ]);

  const [caste, setCaste] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [yearSearch, setYearSearch] = useState('');
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
  const [businessCategoryOpen, setBusinessCategoryOpen] = useState(false);
  const [businessCategoryValue, setBusinessCategoryValue] = useState<
    string | null
  >(null);
  const [businessCategoryLoading, setBusinessCategoryLoading] = useState(false);
  const [businessCategoryItems, setBusinessCategoryItems] = useState<
    DropdownOption[]
  >([]);
  const [businessCategorySearch, setBusinessCategorySearch] = useState('');
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
          setBusinessCategoryValue(apiProfile?.business_category || null);
          setBusinessOther(apiProfile?.business_other || '');

          const dobParts = parseDobParts(apiProfile?.dob);
          if (dobParts) {
            setDobDay(dobParts.day);
            setDobMonth(dobParts.month);
            setDobYear(dobParts.year);
          }

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
  const closeDobPicker = () => {
    setDobModalVisible(false);
    setYearPickerVisible(false);
    setYearSearch('');
  };

  const openYearPicker = () => setYearPickerVisible(true);

  const closeYearPicker = () => {
    setYearPickerVisible(false);
    setYearSearch('');
  };

  const selectDobYear = (year: number) => {
    setDobYear(year);
    closeYearPicker();
  };

  const filteredDobYearItems = dobYearItems.filter(item =>
    item.label.includes(yearSearch.trim()),
  );

  const openBusinessCategoryPicker = async () => {
    setBusinessCategoryOpen(true);
    if (businessCategoryItems.length === 0) {
      await loadBusinessCategoryList();
    }
  };

  const closeBusinessCategoryPicker = () => {
    setBusinessCategoryOpen(false);
    setBusinessCategorySearch('');
  };

  const filteredBusinessCategoryItems = businessCategoryItems.filter(item =>
    item.label
      .toLowerCase()
      .includes(businessCategorySearch.toLowerCase().trim()),
  );

  const selectedBusinessCategoryLabel =
    businessCategoryItems.find(item => item.value === businessCategoryValue)
      ?.label ||
    (businessCategoryValue
      ? String(businessCategoryValue)
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase())
      : '');

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
      formData.append('business_category', businessCategoryValue || '');
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

        const responseUserId =
          res?.user?.id ?? res?.data?.user?.id ?? res?.data?.id ?? null;
        if (responseUserId !== null && responseUserId !== undefined) {
          await AsyncStorage.setItem('User_id', String(responseUserId));
        }

        navigation.replace('HomeNavigator');
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
        const citySource = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res?.data?.results)
          ? res.data.results
          : [];

        const formattedCities: DropdownOption[] = citySource
          .map((item: any) => ({
            label: String(item?.name ?? item?.city ?? ''),
            value: item?.id ?? item?.city_id,
          }))
          .filter((item: DropdownOption) => item.label && item.value != null);

        if (formattedCities.length > 0) {
          // Keep prefilled city option (if any) and merge server list without duplicates.
          setCityItems(prev => {
            const merged = [...prev, ...formattedCities];
            const seen = new Set<string>();

            return merged.filter(item => {
              const key = String(item.value);
              if (seen.has(key)) {
                return false;
              }
              seen.add(key);
              return true;
            });
          });
        }

        setHasLoadedCityList(true);
      }
    } catch (error) {
      console.log('CITY LIST ERROR => ', error);
    } finally {
      setCityLoading(false);
    }
  };

  const loadBusinessCategoryList = async () => {
    try {
      setBusinessCategoryLoading(true);

      const res = await APIWebCall.onBusinessCategoryListAPICall();

      if (res?.status === true || res?.success === true) {
        const formattedCategories = (res?.data || []).map((item: any) => ({
          label: String(item?.value || '')
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase()),
          value: item?.key,
        }));

        setBusinessCategoryItems(formattedCategories);
      }
    } catch (error) {
      console.log('BUSINESS CATEGORY LIST ERROR => ', error);
    } finally {
      setBusinessCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (!businessCategoryValue || businessCategoryItems.length === 0) {
      return;
    }

    setBusinessCategoryItems(prev => {
      const exists = prev.find(item => item.value === businessCategoryValue);
      if (exists) {
        return prev;
      }

      return [
        ...prev,
        {
          label: String(businessCategoryValue)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase()),
          value: businessCategoryValue,
        },
      ];
    });
  }, [businessCategoryValue, businessCategoryItems.length]);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F7F7F7' }}
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
            <View style={{ marginTop: -15 }}>
              <Header
                title="Edit Profile"
                onBackPress={() => navigation.goBack()}
              />
            </View>
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
                        <CustomDropdown
                          value={expValue}
                          items={expItems}
                          onChange={value => setExpValue(String(value))}
                          placeholder="Select Experience"
                          searchable
                          modalTitle="Select Experience"
                          searchPlaceholder="Search experience"
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
                      <CustomDropdown
                        value={cityValue}
                        items={cityItems}
                        loading={cityLoading}
                        onOpen={() => {
                          if (!hasLoadedCityList && !cityLoading) {
                            loadCityList();
                          }
                        }}
                        onChange={value => setCityValue(value)}
                        placeholder="Select City"
                        searchable
                        modalTitle="Select City"
                        searchPlaceholder="Search city"
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
                    <CustomDropdown
                      value={genderValue}
                      items={genderItems}
                      onChange={value => setGenderValue(String(value))}
                      placeholder="Select gender"
                      modalTitle="Select Gender"
                      searchable={false}
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

                  <TextCommonBold
                    text={'Business Category'}
                    textViewStyle={styles.label}
                  />
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.customCategoryTrigger}
                    onPress={openBusinessCategoryPicker}
                  >
                    <Text
                      style={[
                        styles.customCategoryTriggerText,
                        !selectedBusinessCategoryLabel &&
                          styles.customCategoryTriggerPlaceholder,
                      ]}
                    >
                      {selectedBusinessCategoryLabel ||
                        'Select business category'}
                    </Text>
                    <Text style={styles.customCategoryTriggerArrow}>v</Text>
                  </TouchableOpacity>

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
                    <CustomDropdown
                      value={dobDay}
                      items={dobDayItems}
                      onChange={value => setDobDay(Number(value))}
                      placeholder="Day"
                      modalTitle="Select Day"
                      searchPlaceholder="Search day"
                    />
                  </View>

                  <View style={[styles.dobPickerColumn, { zIndex: 2000 }]}>
                    <Text style={styles.dobPickerLabel}>Month</Text>
                    <CustomDropdown
                      value={dobMonth}
                      items={dobMonthItems}
                      onChange={value => setDobMonth(Number(value))}
                      placeholder="Month"
                      modalTitle="Select Month"
                      searchPlaceholder="Search month"
                    />
                  </View>

                  <View style={[styles.dobPickerColumn, { zIndex: 1000 }]}>
                    <Text style={styles.dobPickerLabel}>Year</Text>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.customYearTrigger}
                      onPress={openYearPicker}
                    >
                      <Text
                        style={[
                          styles.customYearTriggerText,
                          !dobYear && styles.customYearTriggerPlaceholder,
                        ]}
                      >
                        {dobYear ? String(dobYear) : 'Select year'}
                      </Text>
                      <Text style={styles.customYearTriggerArrow}>v</Text>
                    </TouchableOpacity>
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

          <Modal
            visible={yearPickerVisible}
            transparent
            animationType="slide"
            onRequestClose={closeYearPicker}
          >
            <View style={styles.yearPickerOverlay}>
              <View style={styles.yearPickerCard}>
                <View style={styles.yearPickerHeader}>
                  <Text style={styles.yearPickerTitle}>Select Year</Text>
                  <TouchableOpacity onPress={closeYearPicker}>
                    <Text style={styles.yearPickerCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={yearSearch}
                  onChangeText={setYearSearch}
                  placeholder="Search year"
                  placeholderTextColor="#8A8A8A"
                  keyboardType="number-pad"
                  style={styles.yearPickerSearchInput}
                />

                <FlatList
                  data={filteredDobYearItems}
                  keyExtractor={item => String(item.value)}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => {
                    const isSelected = dobYear === item.value;

                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.yearPickerItem,
                          isSelected && styles.yearPickerItemSelected,
                        ]}
                        onPress={() => selectDobYear(Number(item.value))}
                      >
                        <Text
                          style={[
                            styles.yearPickerItemText,
                            isSelected && styles.yearPickerItemTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected ? (
                          <Text style={styles.yearPickerSelectedTag}>
                            Selected
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  }}
                  ItemSeparatorComponent={() => (
                    <View style={styles.yearPickerSeparator} />
                  )}
                  ListEmptyComponent={
                    <View style={styles.yearPickerEmptyWrap}>
                      <Text style={styles.yearPickerEmptyText}>
                        No matching year
                      </Text>
                    </View>
                  }
                />
              </View>
            </View>
          </Modal>

          <Modal
            visible={businessCategoryOpen}
            transparent
            animationType="slide"
            onRequestClose={closeBusinessCategoryPicker}
          >
            <View style={styles.categoryPickerOverlay}>
              <View style={styles.categoryPickerCard}>
                <View style={styles.categoryPickerHeader}>
                  <Text style={styles.categoryPickerTitle}>
                    Business Category
                  </Text>
                  <TouchableOpacity onPress={closeBusinessCategoryPicker}>
                    <Text style={styles.categoryPickerCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={businessCategorySearch}
                  onChangeText={setBusinessCategorySearch}
                  placeholder="Search category"
                  placeholderTextColor="#8A8A8A"
                  style={styles.categoryPickerSearchInput}
                />

                {businessCategoryLoading ? (
                  <View style={styles.categoryLoadingWrap}>
                    <ActivityIndicator color="#1a1a1a" size="small" />
                    <Text style={styles.categoryLoadingText}>
                      Loading categories...
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredBusinessCategoryItems}
                    keyExtractor={item => String(item.value)}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.categoryPickerListContent}
                    renderItem={({ item, index }) => {
                      const isSelected = businessCategoryValue === item.value;

                      return (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={[
                            styles.categoryPickerItem,
                            isSelected && styles.categoryPickerItemSelected,
                          ]}
                          onPress={() => {
                            setBusinessCategoryValue(String(item.value));
                            closeBusinessCategoryPicker();
                          }}
                        >
                          <View style={styles.categoryPickerItemLeft}>
                            <Text
                              style={[
                                styles.categoryPickerItemText,
                                isSelected &&
                                  styles.categoryPickerItemTextSelected,
                              ]}
                            >
                              {item.label}
                            </Text>
                          </View>
                          {isSelected ? (
                            <Text style={styles.categoryPickerSelectedTag}>
                              Selected
                            </Text>
                          ) : (
                            <View style={styles.categoryPickerItemDot} />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={styles.categoryPickerSeparator} />
                    )}
                    ListEmptyComponent={
                      <View style={styles.categoryPickerEmptyWrap}>
                        <Text style={styles.categoryPickerEmptyText}>
                          No matching category
                        </Text>
                      </View>
                    }
                  />
                )}
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
    borderColor: '#1a1a1a',
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#1a1a1a',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONTS_Family.FontBold,
  },
  termsText: {
    color: '#555555',
    fontSize: FONTS_SIZE.txt_14,
  },
  termsLink: {
    color: '#1a1a1a',
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
    borderColor: '#DCDCDC',
    minHeight: 50,
  },
  dropdownContainer: {
    borderColor: '#DCDCDC',
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    color: '#000000',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: FONTS_SIZE.txt_16,
    color: '#000000',
  },
  // Tab bar matches Blood Request screen styling
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.colorLightGray,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.gry_text,
    fontSize: FONTS_SIZE.txt_13,
    fontFamily: FONTS_Family.FontMedium,
  },
  tabTextActive: {
    color: COLORS.white,
    fontFamily: FONTS_Family.FontBold,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  dobField: {
    borderWidth: 0.5,
    borderColor: '#888888',
    backgroundColor: '#FFFFFF',
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dobFieldText: {
    color: '#000000',
    fontSize: FONTS_SIZE.txt_14,
    fontFamily: FONTS_Family.FontMedium,
  },
  dobPlaceholder: {
    color: '#888888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dobModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  dobModalTitle: {
    marginTop: 0,
    marginBottom: 14,
    color: '#000000',
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
    color: '#000000',
    fontFamily: FONTS_Family.FontMedium,
  },
  dobDropdown: {
    borderColor: '#DCDCDC',
    borderWidth: 1.2,
    borderRadius: 12,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  dobDropdownContainer: {
    borderColor: '#DCDCDC',
  },
  dobLabelStyle: {
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontMedium,
  },
  dobModalContentContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  dobSelectedItemContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
  },
  dobSelectedItemLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontBold,
  },
  dobItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    marginVertical: 2,
  },
  dobItemLabel: {
    fontSize: 14,
    color: '#333333',
    fontFamily: FONTS_Family.FontMedium,
  },
  customYearTrigger: {
    borderColor: '#DCDCDC',
    borderWidth: 1.2,
    borderRadius: 12,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customYearTriggerText: {
    color: '#1a1a1a',
    fontSize: 15,
    fontFamily: FONTS_Family.FontMedium,
  },
  customYearTriggerPlaceholder: {
    color: '#888888',
  },
  customYearTriggerArrow: {
    color: '#444444',
    fontSize: 14,
    fontFamily: FONTS_Family.FontBold,
  },
  yearPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  yearPickerCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 16,
    maxHeight: '72%',
  },
  yearPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  yearPickerTitle: {
    color: '#111111',
    fontSize: 18,
    fontFamily: FONTS_Family.FontBold,
  },
  yearPickerCloseText: {
    color: '#333333',
    fontSize: 14,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  yearPickerSearchInput: {
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 11,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    minHeight: 44,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontMedium,
    marginBottom: 12,
  },
  yearPickerItem: {
    minHeight: 50,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yearPickerItemSelected: {
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  yearPickerItemText: {
    color: '#222222',
    fontSize: 15,
    fontFamily: FONTS_Family.FontMedium,
  },
  yearPickerItemTextSelected: {
    color: '#111111',
    fontFamily: FONTS_Family.FontBold,
  },
  yearPickerSelectedTag: {
    color: '#111111',
    fontSize: 12,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  yearPickerSeparator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginHorizontal: 2,
  },
  yearPickerEmptyWrap: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  yearPickerEmptyText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },
  customCategoryTrigger: {
    borderColor: '#DCDCDC',
    borderWidth: 1.2,
    borderRadius: 12,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customCategoryTriggerText: {
    flex: 1,
    color: '#1a1a1a',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },
  customCategoryTriggerPlaceholder: {
    color: '#888888',
  },
  customCategoryTriggerArrow: {
    color: '#444444',
    fontSize: 14,
    fontFamily: FONTS_Family.FontBold,
    marginLeft: 10,
  },
  categoryPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  categoryPickerCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 16,
    maxHeight: '76%',
  },
  categoryPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPickerTitle: {
    color: '#111111',
    fontSize: 18,
    fontFamily: FONTS_Family.FontBold,
  },
  categoryPickerCloseText: {
    color: '#333333',
    fontSize: 14,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  categoryPickerSearchInput: {
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 11,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    minHeight: 44,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontMedium,
    marginBottom: 12,
  },
  categoryLoadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  categoryLoadingText: {
    color: '#666666',
    fontSize: 13,
    fontFamily: FONTS_Family.FontMedium,
  },
  categoryPickerListContent: {
    paddingBottom: 6,
  },
  categoryPickerItem: {
    minHeight: 56,
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  categoryPickerItemSelected: {
    backgroundColor: '#F6F6F6',
    borderColor: '#1a1a1a',
  },
  categoryPickerItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryPickerIndexBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPickerIndexBadgeSelected: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  categoryPickerIndexText: {
    color: '#3A3A3A',
    fontSize: 12,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  categoryPickerIndexTextSelected: {
    color: '#FFFFFF',
  },
  categoryPickerItemText: {
    flex: 1,
    color: '#1f1f1f',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },
  categoryPickerItemTextSelected: {
    color: '#111111',
    fontFamily: FONTS_Family.FontBold,
  },
  categoryPickerSelectedTag: {
    color: '#111111',
    fontSize: 12,
    fontFamily: FONTS_Family.FontSemiBold,
    marginLeft: 8,
  },
  categoryPickerItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginRight: 6,
    marginLeft: 8,
  },
  categoryPickerSeparator: {
    height: 8,
  },
  categoryPickerEmptyWrap: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  categoryPickerEmptyText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
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
    backgroundColor: '#EBEBEB',
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },
  dobSaveButton: {
    backgroundColor: '#1a1a1a',
  },
  dobCancelText: {
    color: '#000000',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  dobSaveText: {
    color: '#FFFFFF',
    fontFamily: FONTS_Family.FontSemiBold,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  dropdownInput: {
    borderColor: '#DCDCDC',
    borderWidth: 1.2,
    borderRadius: 10,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  dropdownLabelStyle: {
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontMedium,
  },
  dropdownModaContentContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  dropdownSearchContainer: {
    borderBottomColor: '#EBEBEB',
    borderBottomWidth: 1,
    padding: 12,
    paddingHorizontal: 16,
  },
  dropdownSearchInput: {
    borderColor: '#DCDCDC',
    borderWidth: 1.2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontMedium,
    backgroundColor: '#F9F9F9',
  },
  dropdownSelectedItemContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#1a1a1a',
    paddingHorizontal: 16,
  },
  dropdownSelectedItemLabel: {
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontBold,
  },
  dropdownItemContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemLabel: {
    fontSize: 14,
    color: '#333333',
    fontFamily: FONTS_Family.FontMedium,
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
    borderColor: '#DCDCDC',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
});
