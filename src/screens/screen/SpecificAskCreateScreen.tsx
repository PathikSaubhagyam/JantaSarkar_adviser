import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

import Header from '../../components/Header';
import TextInputView from '../../components/TextInputView';
import CommonButton from '../../components/CommonButton';
import SnackBarCommon from '../../components/SnackBarCommon';
import { FONTS_Family } from '../../constants/Font';
import { onSpecificAskCreateAPICall } from '../../common/APIWebCall';

const SpecificAskCreateScreen = () => {
  const navigation = useNavigation<any>();

  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [area, setArea] = useState('');
  const [purpose, setPurpose] = useState('');
  const [imageFile, setImageFile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          SnackBarCommon.displayMessage({
            message: 'Image selection failed',
            isSuccess: false,
          });
          return;
        }

        if (response.assets?.length) {
          setImageFile(response.assets[0]);
        }
      },
    );
  };

  const submitSpecificAsk = async () => {
    if (!contactPerson.trim() || !designation.trim() || !companyName.trim()) {
      SnackBarCommon.displayMessage({
        message: 'Please fill contact, designation and company name',
        isSuccess: false,
      });
      return;
    }

    if (!area.trim() || !purpose.trim()) {
      SnackBarCommon.displayMessage({
        message: 'Please fill area and purpose',
        isSuccess: false,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('contact_person', contactPerson.trim());
      formData.append('designation', designation.trim());
      formData.append('company_name', companyName.trim());
      formData.append('area', area.trim());
      formData.append('purpose', purpose.trim());

      if (imageFile?.uri) {
        formData.append('image', {
          uri:
            Platform.OS === 'android'
              ? imageFile.uri
              : imageFile.uri.replace('file://', ''),
          name: imageFile.fileName || imageFile.name || 'specific_ask.jpg',
          type: imageFile.type || 'image/jpeg',
        } as any);
      }

      const res = await onSpecificAskCreateAPICall(formData);

      if (res?.status === true || res?.success === true) {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Specific Ask posted successfully.',
          isSuccess: true,
        });
        navigation.goBack();
        return;
      }

      SnackBarCommon.displayMessage({
        message: res?.message || 'Unable to post specific ask',
        isSuccess: false,
      });
    } catch (error) {
      console.log('SPECIFIC ASK CREATE ERROR =>', error);
      SnackBarCommon.displayMessage({
        message: 'Something went wrong',
        isSuccess: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create Specific Ask"
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Contact Person</Text>
          <TextInputView
            value={contactPerson}
            onChangeText={setContactPerson}
            placeholder="Rahul Shah"
          />

          <Text style={styles.label}>Designation</Text>
          <TextInputView
            value={designation}
            onChangeText={setDesignation}
            placeholder="Manager"
          />

          <Text style={styles.label}>Company Name</Text>
          <TextInputView
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Pvt Ltd"
          />

          <Text style={styles.label}>Area</Text>
          <TextInputView
            value={area}
            onChangeText={setArea}
            placeholder="Ahmedabad"
          />

          <Text style={styles.label}>Purpose</Text>
          <TextInputView
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Looking for T-shirt printing vendor"
            multiline
            desheight="des"
          />

          <Text style={styles.label}>Image</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Text style={styles.imagePickerText}>
              {imageFile?.fileName || imageFile?.name || 'Pick image'}
            </Text>
          </TouchableOpacity>

          {imageFile?.uri ? (
            <Image
              source={{ uri: imageFile.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.buttonWrap}>
            <CommonButton
              text={isSubmitting ? 'Submitting...' : 'Post Specific Ask'}
              onPress={submitSpecificAsk}
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SpecificAskCreateScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  label: {
    marginTop: 14,
    marginBottom: 8,
    color: '#000000',
    fontFamily: FONTS_Family.FontMedium,
  },
  imagePicker: {
    minHeight: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  imagePickerText: {
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontMedium,
  },
  previewImage: {
    height: 180,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonWrap: {
    marginTop: 24,
  },
});
