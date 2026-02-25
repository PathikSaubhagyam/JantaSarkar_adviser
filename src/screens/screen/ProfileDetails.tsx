// import React, { useEffect, useState } from 'react';
// import {
//   Image,
//   KeyboardAvoidingView,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   Text,
//   Platform,
//   StatusBar,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';

// import DropDownPicker from 'react-native-dropdown-picker';
// import { launchImageLibrary } from 'react-native-image-picker';

// import { COLORS } from '../../constants/Colors';
// import TextCommonSemiBold from '../../components/TextCommonSemiBold';
// import TextCommonMedium from '../../components/TextCommonMedium';
// import TextCommonBold from '../../components/TextCommonBold';
// import TextInputView from '../../components/TextInputView';
// import SnackBarCommon from '../../components/SnackBarCommon';
// import CommonButton from '../../components/CommonButton';
// import APIWebCall from '../../common/APIWebCall';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ProfileDetails = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();

//   const profileData = route?.params?.profileData;

//   const [fullName, setFullName] = useState('');
//   const [registorNo, setRegistorNo] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [profileImage, setProfileImage] = useState(null);

//   const [cityOpen, setCityOpen] = useState(false);
//   const [cityValue, setCityValue] = useState(null);
//   const [cityItems, setCityItems] = useState([]);

//   const [expOpen, setExpOpen] = useState(false);
//   const [expValue, setExpValue] = useState(null);
//   const [expItems, setExpItems] = useState([
//     { label: '0-1 Years', value: '0-1' },
//     { label: '1-3 Years', value: '1-3' },
//     { label: '3-5 Years', value: '3-5' },
//     { label: '5+ Years', value: '5+' },
//   ]);

//   useEffect(() => {
//     if (profileData) {
//       setFullName(profileData.full_name || '');
//       setEmail(profileData.email || '');
//       setPhoneNumber(profileData.phone_number || '');
//       setCityValue(profileData.city_id || null);
//       setRegistorNo(profileData.bar_council_registration_no || '');
//       setProfileImage(profileData.profile_image || null);
//     }
//   }, []);

//   const pickProfileImage = () => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo',
//         quality: 0.7,
//       },
//       response => {
//         if (response.assets?.length) {
//           setProfileImage(response.assets[0]);
//         }
//       },
//     );
//   };

//   const handleUpdate = async () => {
//     if (!fullName) {
//       return SnackBarCommon.displayMessage({
//         message: 'Enter Full Name',
//         isSuccess: false,
//       });
//     }

//     try {
//       let formData = new FormData();

//       formData.append('full_name', fullName);
//       formData.append('email', email);
//       formData.append('city_id', cityValue);
//       formData.append('experience', expValue);

//       if (profileImage?.uri) {
//         formData.append('profile_image', {
//           uri:
//             Platform.OS === 'android'
//               ? profileImage.uri
//               : profileImage.uri.replace('file://', ''),
//           name: 'profile.jpg',
//           type: 'image/jpeg',
//         });
//       }

//       const res = await APIWebCall.onUpdateProfile(formData);

//       if (res?.success) {
//         SnackBarCommon.displayMessage({
//           message: 'Profile Updated Successfully',
//           isSuccess: true,
//         });

//         navigation.goBack();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const loadCityList = async () => {
//     const res = await APIWebCall.oncityListAPICall();

//     if (res?.data) {
//       const formatted = res.data.map(item => ({
//         label: item.name,
//         value: item.id,
//       }));

//       setCityItems(formatted);
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.white }}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <SafeAreaView style={{ flex: 1 }}>
//           <StatusBar barStyle="dark-content" />

//           <ScrollView>
//             {/* Profile Image */}
//             <View style={styles.imageContainer}>
//               <TouchableOpacity onPress={pickProfileImage}>
//                 <Image
//                   source={{
//                     uri:
//                       profileImage?.uri ||
//                       profileImage ||
//                       'https://cdn-icons-png.flaticon.com/512/149/149071.png',
//                   }}
//                   style={styles.profileImage}
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Form */}

//             <View style={styles.formContainer}>
//               <TextCommonBold text="Full Name" />
//               <TextInputView value={fullName} onChangeText={setFullName} />

//               <TextCommonBold text="Email" />
//               <TextInputView value={email} onChangeText={setEmail} />

//               <TextCommonBold text="Mobile Number" />
//               <TextInputView value={phoneNumber} editable={false} />

//               <TextCommonBold text="Experience" />

//               <DropDownPicker
//                 open={expOpen}
//                 value={expValue}
//                 items={expItems}
//                 setOpen={setExpOpen}
//                 setValue={setExpValue}
//                 setItems={setExpItems}
//                 placeholder="Select Experience"
//               />

//               <TextCommonBold text="City" />

//               <DropDownPicker
//                 open={cityOpen}
//                 value={cityValue}
//                 items={cityItems}
//                 setOpen={open => {
//                   setCityOpen(open);
//                   if (open) loadCityList();
//                 }}
//                 setValue={setCityValue}
//                 setItems={setCityItems}
//                 placeholder="Select City"
//               />

//               <CommonButton text="Update Profile" onPress={handleUpdate} />
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// export default ProfileDetails;

// const styles = StyleSheet.create({
//   imageContainer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },

//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },

//   formContainer: {
//     padding: 20,
//   },
// });

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileDetails = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const profileData = route?.params?.profileData;
  console.log(profileData, 'profile get dat===>>>');

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
          setCityValue(apiProfile?.city?.id || apiProfile?.city_id || null);
        }
      } catch (error) {
        console.log('PROFILE API ERROR =>', error);
      }
    };

    fetchProfileDetails();
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
    if (!isChecked) {
      return SnackBarCommon.displayMessage({
        message: 'Please Check Terms Of Condition',
        isSuccess: false,
      });
    }
    handleSignupApiCall();
  };

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
            <TextCommonBold
              text={'Edite Profile'}
              textViewStyle={styles.title}
            />

            <View style={styles.formContainer}>
              <TextCommonBold text={'Full Name'} textViewStyle={styles.label} />
              <TextInputView
                placeholder="Adv. John Doe"
                value={fullName}
                onChangeText={setFullName}
              />

              <TextCommonBold
                text={'Mobile Number'}
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
                text={'Email Address'}
                textViewStyle={styles.label}
              />
              <TextInputView
                placeholder="Adv. John Doe"
                value={email}
                onChangeText={setEmail}
              />
              <TextCommonBold
                text={'Bar Council Registretion No.*'}
                textViewStyle={styles.label}
              />
              <TextInputView
                placeholder="Adv. John Doe"
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
                      setValue={callback => {
                        const value = callback(cityValue);
                        setCityValue(value);
                      }}
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
                      searchPlaceholder="Search city"
                      style={{
                        borderColor: COLORS.gray,
                        borderWidth: 0.5,
                        borderRadius: 10,
                        minHeight: 50,
                      }}
                      dropDownContainerStyle={{
                        borderBottomColor: COLORS.colorLightGray,
                        borderWidth: 1,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.halfContainer}>
                <TextCommonBold text={'City'} textViewStyle={styles.label} />

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
                    setValue={callback => {
                      const value = callback(cityValue);
                      setCityValue(value);
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
                    style={{
                      borderColor: COLORS.gray,
                      borderWidth: 0.5,
                      borderRadius: 10,
                      minHeight: 50,
                    }}
                    dropDownContainerStyle={{
                      borderBottomColor: COLORS.colorLightGray,
                      borderWidth: 1,
                    }}
                  />
                </View>
              </View>

              <View style={{ marginTop: 30 }}>
                <CommonButton text=" Update" onPress={handleSubmit} />
              </View>
            </View>
          </ScrollView>
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
    fontSize: FONTS_SIZE.txt_16,
    color: COLORS.black,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    color: COLORS.black,
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
