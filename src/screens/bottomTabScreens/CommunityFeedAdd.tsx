import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {
  oncityListAPICall,
  onCommunityFeedAPICall,
  onDepartmentAPICall,
} from '../../common/APIWebCall';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';
import { COLORS } from '../../constants/Colors';
import { activeOpacity } from '../../constants/Utils';
import TextInputView from '../../components/TextInputView';
import SnackBarCommon from '../../components/SnackBarCommon';
import CustomDropdown from '../../components/CustomDropdown';

const CommunityFeedAdd = () => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const [departmentItems, setDepartmentItems] = useState([]);
  const [departmentValue, setDepartmentValue] = useState(null);
  const [issueFeed, setIssueFeed] = useState('');

  const [cityItems, setCityItems] = useState([]);
  const [cityValue, setCityValue] = useState(null);
  const [cityLoading, setCityLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  // Person fields
  const [persons, setPersons] = useState([
    { name: '', mobile: '' },
    { name: '', mobile: '' },
    { name: '', mobile: '' },
  ]);

  useEffect(() => {
    loadDepartments();
    loadCities();
  }, []);

  const loadDepartments = async () => {
    try {
      setDepartmentLoading(true);
      const res = await onDepartmentAPICall();

      // if (res?.results) {
      //   const formatted = res.results.map(item => ({
      //     label: item.name,
      //     value: item.id,
      //   }));
      if (res?.data) {
        const formatted = res.data.map(item => ({
          label: item.name,
          value: item.id,
        }));

        setDepartmentItems(formatted);
      }
    } catch (error) {
      console.log('Department API Error:', error);
    } finally {
      setDepartmentLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      setCityLoading(true);

      const res = await oncityListAPICall();

      if (res?.data) {
        const formatted = res.data.map(item => ({
          label: item.name,
          value: item.id,
        }));

        setCityItems(formatted);
      }
    } catch (error) {
      console.log('City API Error:', error);
    } finally {
      setCityLoading(false);
    }
  };

  const handleSubmitClick = async () => {
    try {
      if (!departmentValue) {
        SnackBarCommon.displayMessage({
          message: 'Please select department',
        });
        return;
      }

      if (!cityValue) {
        SnackBarCommon.displayMessage({
          message: 'Please select city',
        });
        return;
      }

      if (!issueFeed.trim()) {
        SnackBarCommon.displayMessage({
          message: 'Please enter issue',
        });
        return;
      }

      const payload = {
        department: departmentValue,
        city: cityValue,
        description_issue: issueFeed.trim(),

        person1_name: persons[0]?.name || '',
        person1_mobile: persons[0]?.mobile || '',

        person2_name: persons[1]?.name || '',
        person2_mobile: persons[1]?.mobile || '',

        person3_name: persons[2]?.name || '',
        person3_mobile: persons[2]?.mobile || '',
      };

      console.log('FINAL PAYLOAD =>', payload);

      const response = await onCommunityFeedAPICall(payload);

      console.log('FINAL RESPONSE =>', response);

      setModalVisible(true);

      // alert(response?.message || 'Submission failed');
    } catch (error) {
      console.log('SUBMIT ERROR =>', error);
      // alert('Server error');
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...persons];
    updated[index][field] = value;
    setPersons(updated);
  };

  // // Open modal on submit click
  // const handleSubmitClick = () => {
  //   setModalVisible(true);
  // };

  const handleConfirmSubmit = () => {
    setModalVisible(false);

    const data = {
      department: departmentValue,
      issueType: issueValue,
      persons: persons,
    };

    console.log('Form Data:', data);

    setTimeout(() => {
      setModalVisible(true);
    }, 300);
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
            contentContainerStyle={{ padding: 16 }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // marginTop: 15,
                gap: 15,
              }}
            >
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Image
                  source={require('../../assets/images/back_icon.png')}
                  style={{ height: 22, width: 22, tintColor: COLORS.black }}
                />
              </TouchableOpacity>

              <Text style={styles.title}>Community Feed Form</Text>
            </View>

            <Text style={styles.label}>Select Department</Text>
            <View style={{ zIndex: 3000 }}>
              <CustomDropdown
                value={departmentValue}
                items={departmentItems}
                loading={departmentLoading}
                onChange={value => setDepartmentValue(value)}
                placeholder="Select Department"
                searchable={true}
                modalTitle="Select Department"
                searchPlaceholder="Search department"
              />
            </View>

            <Text style={styles.label}>Select City</Text>
            <View style={{ zIndex: 2000 }}>
              <CustomDropdown
                value={cityValue}
                items={cityItems}
                loading={cityLoading}
                onOpen={() => {
                  if (cityItems.length === 0) {
                    loadCities();
                  }
                }}
                onChange={value => setCityValue(value)}
                placeholder="Select City"
                searchable={true}
                modalTitle="Select City"
                searchPlaceholder="Search city"
              />
            </View>
            <Text style={styles.label}>Issue</Text>

            <TextInputView
              placeholder="Enter Issue"
              value={issueFeed}
              onChangeText={setIssueFeed}
              multiline={true}
              containerStyle={{
                borderRadius: 8,
                paddingHorizontal: 10,
                borderColor: COLORS.gray,
                borderWidth: 0.5,
                backgroundColor: COLORS.white,
                minHeight: 150,
              }}
              style={{
                fontSize: FONTS_SIZE.txt_14,
                flex: 1,
                height: '100%',
                textAlignVertical: 'top',
                color: COLORS.black,
              }}
            />
            <Text style={styles.label}>Person Details</Text>
            {persons.map((person, index) => (
              <View key={index} style={styles.personBox}>
                <Text style={styles.personTitle}>Person {index + 1}</Text>

                <TextInputView
                  placeholder="Enter Name"
                  value={person.name}
                  onChangeText={text => handleChange(index, 'name', text)}
                  containerStyle={{
                    alignItems: 'center',
                    flexDirection: 'row',

                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderColor: COLORS.gray,
                    borderWidth: 0.5,
                    backgroundColor: COLORS.white,
                    gap: 10,
                    marginTop: 8,
                  }}
                />
                <TextInputView
                  placeholder="Enter Mobile Number"
                  value={person.mobile}
                  onChangeText={text => handleChange(index, 'mobile', text)}
                  keyboardType="number-pad"
                  containerStyle={{
                    alignItems: 'center',
                    flexDirection: 'row',

                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderColor: COLORS.gray,
                    borderWidth: 0.5,
                    backgroundColor: COLORS.white,
                    gap: 10,
                    marginTop: 8,
                  }}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmitClick}>
              <Text style={styles.buttonText}>Submit Feed</Text>
            </TouchableOpacity>
          </ScrollView>

          <Modal transparent visible={modalVisible} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.successBox}>
                <Text style={styles.successIcon}>✓</Text>

                <Text style={styles.successTitle}>Request Submitted!</Text>

                <Text style={styles.successMessage}>
                  Your community request has been submitted successfully.
                </Text>

                <TouchableOpacity
                  style={styles.successButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.successButtonText}>OK, Got it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CommunityFeedAdd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    padding: 16,
  },

  title: {
    fontSize: FONTS_SIZE.txt_25,

    fontFamily: FONTS_Family.FontExtraBold,
    color: COLORS.black,
  },

  label: {
    fontSize: 15,
    fontFamily: FONTS_Family.FontBold,
    marginBottom: 8,
    marginTop: 12,
    color: COLORS.black,
  },

  dropdown: {
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    borderRadius: 10,
    minHeight: 50,
  },
  dropdownContainer: {
    borderColor: '#ddd',
    elevation: 1000,
  },
  personBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  personTitle: {
    fontSize: 16,
    fontFamily: FONTS_Family.FontBold,
    color: COLORS.black,
  },

  input: {
    borderColor: '#ddd',
    borderRadius: 10,
  },

  button: {
    backgroundColor: '#000000',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS_Family.FontBold,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS_Family.FontExtraBold,
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 15,
    marginBottom: 20,
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 10,
  },

  cancelButton: {
    backgroundColor: '#eee',
  },

  yesButton: {
    backgroundColor: '#000000',
  },

  cancelText: {
    color: '#333',
    fontFamily: FONTS_Family.FontBold,
  },

  yesText: {
    color: '#fff',
    fontFamily: FONTS_Family.FontBold,
  },
  successBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },

  successIcon: {
    fontSize: 50,
    color: '#28a745',
    marginBottom: 10,
  },

  successTitle: {
    fontSize: 22,
    fontFamily: FONTS_Family.FontExtraBold,
    color: '#28a745',
    marginBottom: 8,
  },

  successMessage: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },

  successButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },

  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS_Family.FontBold,
  },
});
