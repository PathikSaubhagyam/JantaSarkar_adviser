import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import TextCommonBold from '../../components/TextCommonBold';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextInputView from '../../components/TextInputView';
import CommonButton from '../../components/CommonButton';
import SnackBarCommon from '../../components/SnackBarCommon';
import { COLORS } from '../../constants/Colors';

const RaisedBloodRequestScreen = () => {
  const navigation = useNavigation<any>();
  const [bloodGroup, setBloodGroup] = useState('');
  const [reason, setReason] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  const handleSubmit = () => {
    if (!bloodGroup.trim()) {
      SnackBarCommon.displayMessage({
        message: 'Please enter blood group',
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

    SnackBarCommon.displayMessage({
      message: 'Blood request submitted',
      isSuccess: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header
            title="Raised Blood Request"
            onBackPress={() => navigation.goBack()}
          />

          <View style={styles.formCard}>
            <TextCommonBold text={'Blood Group'} textViewStyle={styles.label} />
            <TextInputView
              placeholder="Ex: O+, A-, B+"
              value={bloodGroup}
              onChangeText={setBloodGroup}
              maxLength={20}
            />

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

            <View style={styles.btnWrap}>
              <CommonButton text="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RaisedBloodRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingBottom: 24,
  },
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
  btnWrap: {
    marginTop: 24,
  },
});
