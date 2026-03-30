import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import TextInputView from '../../components/TextInputView';
import SnackBarCommon from '../../components/SnackBarCommon';
import APIWebCall from '../../common/APIWebCall';
import { COLORS } from '../../constants/Colors';
import { FONTS_Family } from '../../constants/Font';

type FormState = {
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
};

const INITIAL_FORM: FormState = {
  account_holder_name: '',
  account_number: '',
  ifsc_code: '',
  bank_name: '',
};

export default function BankDetailsScreen() {
  const navigation = useNavigation<any>();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const accountNumberRef = useRef<TextInput>(null);
  const ifscRef = useRef<TextInput>(null);
  const bankNameRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const response = await APIWebCall.onGetBankDetailsAPICall();
      
      if (response?.status && response?.bank_account) {
        const bankDetails = response.bank_account;
        setForm({
          account_holder_name: bankDetails.account_holder_name || '',
          account_number: bankDetails.account_number || '',
          ifsc_code: bankDetails.ifsc_code || '',
          bank_name: bankDetails.bank_name || '',
        });
      }
    } catch (error) {
      console.log('FETCH BANK DETAILS ERROR =>', error);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = useMemo(() => {
    return (
      form.account_holder_name.trim().length > 0 &&
      form.account_number.trim().length >= 9 &&
      form.ifsc_code.trim().length > 0 &&
      form.bank_name.trim().length > 0
    );
  }, [form]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.account_holder_name.trim()) {
      return 'Please enter account holder name';
    }

    if (!/^\d{9,18}$/.test(form.account_number.trim())) {
      return 'Please enter a valid account number';
    }

    if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifsc_code.trim())) {
      return 'Please enter a valid IFSC code';
    }

    if (!form.bank_name.trim()) {
      return 'Please enter bank name';
    }

    return null;
  };

  const onSubmit = async () => {
    const validationMessage = validate();
    if (validationMessage) {
      SnackBarCommon.displayMessage({
        message: validationMessage,
        isSuccess: false,
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        account_holder_name: form.account_holder_name.trim(),
        account_number: form.account_number.trim(),
        ifsc_code: form.ifsc_code.trim().toUpperCase(),
        bank_name: form.bank_name.trim(),
      };

      const response = await APIWebCall.onAddBankDetailsAPICall(payload);

      if (response?.status) {
        SnackBarCommon.displayMessage({
          message: response?.message || 'Bank account saved successfully',
          isSuccess: true,
        });
        navigation.goBack();
      } else {
        SnackBarCommon.displayMessage({
          message: response?.message || 'Could not save bank details',
          isSuccess: false,
        });
      }
    } catch (error) {
      console.log('ADD BANK DETAILS ERROR =>', error);
      SnackBarCommon.displayMessage({
        message: 'Something went wrong while saving bank details',
        isSuccess: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary || '#00A86B'} />
            <Text style={styles.loadingText}>Loading bank details...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Header
              title="Bank Details"
              onBackPress={() => navigation.goBack()}
            />

          <Text style={styles.subTitle}>
            Add your bank account details securely.
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Account Holder Name</Text>
            <TextInputView
              placeholder="Enter account holder name"
              value={form.account_holder_name}
              onChangeText={text => updateField('account_holder_name', text)}
              containerStyle={styles.inputContainer}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => accountNumberRef.current?.focus()}
            />

            <Text style={styles.label}>Account Number</Text>
            <TextInputView
              placeholder="Enter account number"
              value={form.account_number}
              onChangeText={text =>
                updateField('account_number', text.replace(/[^0-9]/g, ''))
              }
              keyboardType="number-pad"
              maxLength={18}
              containerStyle={styles.inputContainer}
              inputRef={accountNumberRef}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => ifscRef.current?.focus()}
            />

            <Text style={styles.label}>IFSC Code</Text>
            <TextInputView
              placeholder="e.g. HDFC0001234"
              value={form.ifsc_code}
              onChangeText={text =>
                updateField('ifsc_code', text.toUpperCase())
              }
              maxLength={11}
              containerStyle={styles.inputContainer}
              inputRef={ifscRef}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => bankNameRef.current?.focus()}
            />

            <Text style={styles.label}>Bank Name</Text>
            <TextInputView
              placeholder="Enter bank name"
              value={form.bank_name}
              onChangeText={text => updateField('bank_name', text)}
              containerStyle={styles.inputContainer}
              inputRef={bankNameRef}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!canSubmit || submitting) && styles.submitButtonDisabled,
            ]}
            onPress={onSubmit}
            activeOpacity={0.85}
            disabled={!canSubmit || submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Save Bank Details</Text>
            )}
          </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontFamily: FONTS_Family.FontRegular,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  subTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 14,
    fontFamily: FONTS_Family.FontRegular,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
    fontFamily: FONTS_Family.FontMedium,
  },
  inputContainer: {
    marginBottom: 14,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  submitButton: {
    marginTop: 18,
    backgroundColor: '#00A86B',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: FONTS_Family.FontSemiBold,
  },
});
