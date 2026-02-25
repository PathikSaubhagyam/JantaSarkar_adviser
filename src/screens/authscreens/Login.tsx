import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
  Linking,
  StatusBar,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from '../../constants/Colors';
import TextCommonSemiBold from '../../components/TextCommonSemiBold';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextInputView from '../../components/TextInputView';
import CommonButton from '../../components/CommonButton';
import { FONTS_SIZE } from '../../constants/Font';
import TextCommonBold from '../../components/TextCommonBold';
import SnackBarCommon from '../../components/SnackBarCommon';
import APIWebCall from '../../common/APIWebCall';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation<any>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [serverOtp, setServerOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const getOtpString = () => otp.join('');
  const otpInputs = useRef([]);

  useEffect(() => {
    let interval;
    if (showOtpSection && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpSection, timer]);

  const handleSendOtp = async () => {
    if (phoneNumber.trim().length !== 10) {
      SnackBarCommon.displayMessage({
        message: 'Enter valid mobile number',
        isSuccess: false,
      });
      return;
    }

    try {
      const payload = {
        phone_number: phoneNumber.trim(),
      };

      const res = await APIWebCall.onLoginAPICall(payload);

      if (res?.status === true) {
        setShowOtpSection(true);
        setTimer(60);
        setServerOtp(res?.otp || res?.data?.otp || '');
        console.log(res?.data, 'otp----');

        if (res?.data?.user_id) {
          await AsyncStorage.setItem('user_Id', res?.data?.user_id);
        }

        SnackBarCommon.displayMessage({
          message: res?.message || 'OTP Sent Successfully',
          isSuccess: true,
        });
      } else {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Failed to send OTP',
          isSuccess: false,
        });
      }
    } catch (error) {
      SnackBarCommon.displayMessage({
        message:
          error?.response?.data?.message || 'Server error. Please try again.',
        isSuccess: false,
      });
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = getOtpString();

    if (otpCode.length !== 6) {
      SnackBarCommon.displayMessage({
        message: 'Enter valid OTP',
        isSuccess: false,
      });
      return;
    }

    try {
      const payload = {
        phone_number: phoneNumber.trim(),
        otp: Number(otpCode),
      };

      const res = await APIWebCall.onVerifyOtpAPICall(payload);

      if (res?.status === true || res?.status === 'true') {
        // ✅ Save Token
        if (res?.access_token) {
          await AsyncStorage.setItem('token', res.access_token);
        }

        if (res.is_profile_complete === false) {
          SnackBarCommon.displayMessage({
            message: 'Please complete signup',
            isSuccess: false,
          });

          navigation.replace('SignUp', {
            phoneNumber: phoneNumber,
            userId: res?.user?.id,
          });
        } else {
          SnackBarCommon.displayMessage({
            message: res?.message || 'Login Success',
            isSuccess: true,
          });

          navigation.replace('HomeNavigator');
        }

        return;
      }

      SnackBarCommon.displayMessage({
        message: res?.message || 'Invalid OTP',
        isSuccess: false,
      });
    } catch (error) {
      console.log('VERIFY OTP ERROR =>', error);

      SnackBarCommon.displayMessage({
        message: error?.response?.data?.message || 'OTP verification failed',
        isSuccess: false,
      });
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setServerOtp('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/app_img.jpg')}
              style={{ height: 200, width: 200 }}
            />
          </View>

          <TextCommonBold text={'Welcome'} textViewStyle={styles.welcome} />

          <TextCommonMedium
            text={'Sign in to access secure government'}
            textViewStyle={styles.subtitle}
          />
          <TextCommonMedium text={'services'} textViewStyle={styles.subtitle} />

          {/* PHONE INPUT */}
          <View style={{ marginTop: 30, paddingHorizontal: 15 }}>
            <TextCommonMedium
              text={'Mobile Number'}
              textViewStyle={styles.inputLabel}
            />

            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <TextCommonMedium
                  text={'+91'}
                  textViewStyle={styles.countryCodeText}
                />
              </View>

              <View style={{ flex: 1 }}>
                <TextInputView
                  placeholder="9999999999"
                  onChangeText={setPhoneNumber}
                  value={phoneNumber}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* SEND OTP BUTTON */}
          <View style={{ marginTop: 30, paddingHorizontal: 5 }}>
            <CommonButton text="Send OTP" onPress={handleSendOtp} />
          </View>

          {showOtpSection && (
            <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
              <TextCommonSemiBold
                text={'VERIFICATION'}
                textViewStyle={styles.verificationHeader}
              />
              {serverOtp ? (
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: COLORS.black,
                    fontSize: FONTS_SIZE.txt_14,
                  }}
                >
                  Debug OTP: {serverOtp}
                </Text>
              ) : null}

              <Text style={styles.otpLabel}>Enter 6-Digit Code</Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (otpInputs.current[index] = ref)}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={value => handleOtpChange(value, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                ))}
              </View>

              <View style={styles.resendContainer}>
                <Pressable onPress={handleResendOtp} disabled={timer > 0}>
                  <Text
                    style={[
                      styles.resendText,
                      timer > 0 && styles.resendDisabled,
                    ]}
                  >
                    Resend OTP
                  </Text>
                </Pressable>

                <Text style={styles.timerText}>
                  {String(Math.floor(timer / 60)).padStart(2, '0')}:
                  {String(timer % 60).padStart(2, '0')}
                </Text>
              </View>
              <View style={{ marginTop: 30 }}>
                <CommonButton
                  text="Identify & Verify"
                  onPress={handleVerifyOtp}
                  btnStyle={{
                    backgroundColor: COLORS.secondary,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    marginHorizontal: 4,
                  }}
                />
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 20,
              marginTop: 30,
              paddingHorizontal: 20,
            }}
          >
            <TextCommonMedium
              text="By signing in, you agree to our "
              textViewStyle={{
                color: COLORS.color_txt_gray,
                fontSize: FONTS_SIZE.txt_14,
              }}
            />

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <TextCommonMedium
                text="Terms of Service"
                textViewStyle={{
                  color: COLORS.primary,
                  fontSize: FONTS_SIZE.txt_14,
                }}
              />
            </TouchableOpacity>

            <TextCommonMedium
              text=" and "
              textViewStyle={{
                color: COLORS.color_txt_gray,
                fontSize: FONTS_SIZE.txt_14,
              }}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <TextCommonMedium
                text="Privacy Policy"
                textViewStyle={{
                  color: COLORS.primary,
                  fontSize: FONTS_SIZE.txt_14,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: FONTS_SIZE.txt_15,
    color: COLORS.black,
    marginBottom: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  welcome: {
    fontSize: FONTS_SIZE.txt_28,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONTS_SIZE.txt_14,
    color: COLORS.gry_text,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryCode: {
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  countryCodeText: {
    fontSize: FONTS_SIZE.txt_14,
    color: '#111827',
  },

  verificationHeader: {
    textAlign: 'center',
    fontSize: FONTS_SIZE.txt_16,
    marginBottom: 15,
    color: COLORS.black,
  },
  otpLabel: {
    fontSize: FONTS_SIZE.txt_14,
    marginBottom: 3,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    width: 45,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.black,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resendText: {
    color: COLORS.color_cyan_dark,
    fontWeight: '600',
  },
  resendDisabled: {
    color: COLORS.gray,
  },
  timerText: {
    fontWeight: '600',
    color: COLORS.black,
  },
});
