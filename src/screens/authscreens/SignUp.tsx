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
import { FONTS_SIZE } from '../../constants/Font';
import CommonButton from '../../components/CommonButton';
import APIWebCall from '../../common/APIWebCall';
import { useNavigation, useRoute } from '@react-navigation/native';

const SignUp = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const routePhone = route?.params?.phoneNumber || '';
  const routeUserId = route?.params?.userId || '';

  const [fullName, setFullName] = useState('');
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
  /* ---------------- Experience Dropdown ---------------- */
  const [expOpen, setExpOpen] = useState(false);
  const [expValue, setExpValue] = useState(null);
  const [expItems, setExpItems] = useState([
    { label: '0-1 Years', value: '0-1' },
    { label: '1-3 Years', value: '1-3' },
    { label: '3-5 Years', value: '3-5' },
    { label: '5+ Years', value: '5+' },
  ]);

  useEffect(() => {
    if (routePhone) {
      setPhoneNumber(routePhone);
    }
  }, [routePhone]);

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
    if (!email.trim()) {
      return SnackBarCommon.displayMessage({
        message: 'Enter Email',
        isSuccess: false,
      });
    }

    handleSignupApiCall();
  };

  // const handleSignupApiCall = async () => {
  //   try {
  //     let formData = new FormData();

  //     formData.append('full_name', fullName || '');
  //     formData.append('email', email || '');
  //     formData.append('phone_number', phoneNumber || '');
  //     formData.append('bar_council_registration_no', registorNo || '');
  //     formData.append('experience', expValue || '');
  //     formData.append('city_id', '1');

  //     // ✅ Bar Certificate
  //     if (barDoc?.uri) {
  //       formData.append('bar_certificate', {
  //         uri:
  //           Platform.OS === 'android'
  //             ? barDoc.uri
  //             : barDoc.uri.replace('file://', ''),
  //         name: barDoc.name || 'bar_certificate.pdf',
  //         type: barDoc.type || 'application/pdf',
  //       });
  //     }

  //     // ✅ ID Proof
  //     if (idDoc?.uri) {
  //       formData.append('id_proof', {
  //         uri:
  //           Platform.OS === 'android'
  //             ? idDoc.uri
  //             : idDoc.uri.replace('file://', ''),
  //         name: idDoc.fileName || 'id_proof.jpg',
  //         type: idDoc.type || 'image/jpeg',
  //       });
  //     }

  //     console.log('FORM DATA =>', formData);

  //     const res = await APIWebCall.onSignUPAPICall(formData);

  //     console.log('SIGNUP RESPONSE =>', res);

  //     if (res?.status === true || res?.success === true) {
  //       SnackBarCommon.displayMessage({
  //         message: res?.message || 'Signup Success',
  //         isSuccess: true,
  //       });
  //       navigation.replace('HomeNavigator');
  //     } else {
  //       SnackBarCommon.displayMessage({
  //         message: res?.message || 'Signup Failed',
  //         isSuccess: false,
  //       });
  //     }
  //   } catch (error) {
  //     console.log('SIGNUP ERROR =>', error);

  //     SnackBarCommon.displayMessage({
  //       message: 'Signup Failed',
  //       isSuccess: false,
  //     });
  //   }
  // };

  const handleSignupApiCall = async () => {
    try {
      let formData = new FormData();

      formData.append('full_name', fullName || '');
      formData.append('email', email || '');
      formData.append('phone_number', phoneNumber || '');
      formData.append('bar_council_registration_no', registorNo || '');
      formData.append('experience', expValue || '');
      formData.append('city_id', cityValue || '');

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

      console.log('SIGNUP RESPONSE =>', res);

      if (res?.status === true || res?.success === true) {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Signup Success',
          isSuccess: true,
        });

        navigation.replace('HomeNavigator');
      } else {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Signup Failed',
          isSuccess: false,
        });
      }
    } catch (error) {
      console.log('SIGNUP ERROR =>', error);

      SnackBarCommon.displayMessage({
        message: 'Signup Failed',
        isSuccess: false,
      });
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/app_img.jpg')}
            style={{ height: 200, width: 200 }}
          />
        </View>
        <TextCommonBold
          text={'Lawyer Registration'}
          textViewStyle={styles.title}
        />
        <TextCommonSemiBold
          text={'Join our professional legal network'}
          textViewStyle={{
            textAlign: 'center',
            fontSize: FONTS_SIZE.txt_14,
            color: COLORS.gry_text,
          }}
        />
        <View style={styles.formContainer}>
          {/* Name */}
          <TextCommonBold text={'Full Name'} textViewStyle={styles.label} />
          <TextInputView
            placeholder="Adv. John Doe"
            value={fullName}
            onChangeText={setFullName}
          />

          {/* Phone */}
          <TextCommonBold text={'Mobile Number'} textViewStyle={styles.label} />

          <View style={styles.phoneRow}>
            <View style={styles.codeBox}>
              <Text>+91</Text>
            </View>

            <View style={{ flex: 1 }}>
              <TextInputView
                placeholder="9876543210"
                keyboardType="number-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
          <TextCommonBold text={'Email Address'} textViewStyle={styles.label} />
          <TextInputView
            placeholder="Adv. John Doe"
            value={email}
            onChangeText={setEmail}
          />
          <TextCommonBold
            text={'Bar Council Registretion No.'}
            textViewStyle={styles.label}
          />
          <TextInputView
            placeholder="Adv. John Doe"
            value={registorNo}
            onChangeText={setRegistorNo}
          />
          <View style={styles.row}>
            <View style={styles.halfContainer}>
              <TextCommonBold
                text={'Experience'}
                textViewStyle={styles.label}
              />

              <DropDownPicker
                open={expOpen}
                value={expValue}
                items={expItems}
                setOpen={setExpOpen}
                setValue={setExpValue}
                setItems={setExpItems}
                placeholder="Select Experience"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>
            <View style={styles.halfContainer}>
              <TextCommonBold text={'City'} textViewStyle={styles.label} />

              <DropDownPicker
                open={cityOpen}
                value={cityValue}
                items={cityItems}
                loading={cityLoading}
                searchable={true} // ✅ Search bar enabled
                searchPlaceholder="Search city..."
                setOpen={open => {
                  setCityOpen(open);

                  // ✅ Open thay tyare API call
                  if (open && cityItems.length === 0) {
                    loadCityList();
                  }
                }}
                setValue={callback => {
                  const value = callback(cityValue);
                  setCityValue(value);
                }}
                setItems={setCityItems}
                placeholder="Select City"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
          </View>

          {/* Upload Documents */}
          <TextCommonBold
            text={'Upload Documents'}
            textViewStyle={styles.label}
          />

          <View style={styles.uploadRow}>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={pickBarDocument}
            >
              <Text>Bar Certificate</Text>

              {barDoc && (
                <Text numberOfLines={1} style={{ marginTop: 5 }}>
                  {barDoc?.name || 'File Selected'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadBox} onPress={pickIdDocument}>
              <Text>ID Proof</Text>

              {idDoc && (
                <Text numberOfLines={1} style={{ marginTop: 5 }}>
                  {idDoc.fileName || 'Image Selected'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.termsContainer}>
            {/* Checkbox */}
            <TouchableOpacity
              style={[styles.checkbox, isChecked && styles.checkboxChecked]}
              onPress={() => setIsChecked(!isChecked)}
            >
              {isChecked && <Text style={styles.checkMark}>✓</Text>}
            </TouchableOpacity>

            {/* Text Section */}
            <View style={{ flex: 1 }}>
              <Text
                style={{ textAlign: 'center', fontSize: FONTS_SIZE.txt_13 }}
              >
                I confirm that the information provided is accurate and I agree
                to the{' '}
                <Text
                  style={{ color: COLORS.primary, fontSize: FONTS_SIZE.txt_14 }}
                  onPress={() => navigation.navigate('TermsOfService')}
                >
                  Terms of Service
                </Text>
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <CommonButton text=" Register As Lawyer" onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

/* ---------------- Styles ---------------- */

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
    fontWeight: 'bold',
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
    fontSize: FONTS_SIZE.txt_28,
    color: COLORS.black,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
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
