import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextCommonRegular from '../../components/TextCommonRegular';
import TextCommonBold from '../../components/TextCommonBold';
import APIWebCall, { onProfileAPICall } from '../../common/APIWebCall';

type ProfileScreenProps = {
  onLogout?: () => void;
};

export default function Profile({}: ProfileScreenProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  console.log('ppppppppppp', profile);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await onProfileAPICall();

      console.log('PROFILE RESPONSE =>', response);

      if (response?.data) {
        setProfile(response.data);

        if (response.data.profile_image) {
          setProfileImage(response.data.profile_image);
        }
      }
    } catch (error) {
      console.log('PROFILE ERROR =>', error);
    }
  };

  const selectImage = () => {
    setShowImagePickerModal(true);
  };

  const uploadProfileImage = async (asset: any) => {
    if (!asset?.uri) {
      Alert.alert('Error', 'Please select a valid image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_image', {
        uri:
          Platform.OS === 'android'
            ? asset.uri
            : asset.uri.replace('file://', ''),
        name: asset.fileName || `profile_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      } as any);

      const response = await APIWebCall.onProfileImageUpdateAPICall(formData);

      if (response?.status === true || response?.success === true) {
        const updatedProfile = response?.data || {};
        setProfile(prev => ({ ...prev, ...updatedProfile }));
        setProfileImage(updatedProfile?.profile_image || asset.uri || null);
        Alert.alert(
          'Success',
          response?.message || 'Profile updated successfully',
        );
      } else {
        Alert.alert(
          'Upload failed',
          response?.message || 'Could not update profile image',
        );
      }
    } catch (error) {
      console.log('PROFILE IMAGE UPDATE ERROR =>', error);
      Alert.alert('Error', 'Something went wrong while updating profile image');
    }
  };

  // 📷 Open Camera
  const openCamera = async () => {
    setShowImagePickerModal(false);
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length) {
      await uploadProfileImage(result.assets[0]);
    }
  };

  // 🖼 Open Gallery
  const openGallery = async () => {
    setShowImagePickerModal(false);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length) {
      await uploadProfileImage(result.assets[0]);
    }
  };
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await AsyncStorage.multiRemove(['token']);
      console.log('Logout successful');
      navigation.replace('AuthNavigator');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const handleShareReferral = async () => {
    const referralCode = profile?.referral_code;

    if (!referralCode) {
      Alert.alert(
        'Referral code unavailable',
        'Your referral code is not available yet.',
      );
      return;
    }

    try {
      await Share.share({
        message: `Join me on Janta Sarkar Adviser and use my referral code: ${referralCode}`,
      });
    } catch (error) {
      console.log('Referral share error:', error);
    }
  };

  const renderMenuItem = (
    title,
    subtitle,
    iconName,
    bgColor,
    iconColor,
    onPress?,
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={20} color="#111111" />
        </View>

        <View style={{ marginLeft: 12 }}>
          <TextCommonMedium text={title} textViewStyle={styles.menuTitle} />
          <TextCommonRegular text={subtitle} textViewStyle={styles.menuSub} />
        </View>
      </View>

      <Icon name="chevron-forward" size={22} color="#CCCCCC" />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  profileImage ||
                  'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              }}
              style={styles.profileImage}
            />

            <TouchableOpacity style={styles.editIcon} onPress={selectImage}>
              <Icon name="camera-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <TextCommonBold
            text={profile?.full_name}
            textViewStyle={styles.name}
          />

          <View style={styles.referralCard}>
            <View style={styles.referralTitleRow}>
              <Icon name="pricetag-outline" size={16} color="#111111" />
              <Text style={styles.referralLabel}>Referral Code</Text>
            </View>
            <Text style={styles.referralCode}>
              {profile?.referral_code || 'Not available'}
            </Text>

            <Text style={styles.referralHintText}>
              Share this code with friends and get referral bonus
            </Text>

            <TouchableOpacity
              style={styles.shareReferralButton}
              onPress={handleShareReferral}
              activeOpacity={0.85}
            >
              <Icon name="share-social-outline" size={18} color="#FFFFFF" />
              <Text style={styles.shareReferralButtonText}>Share via App</Text>
            </TouchableOpacity>
          </View>

          {/* <TextCommonMedium
            text={`Verified Citizen • ${profile?.phone_number || ''}`}
            textViewStyle={styles.subText}
          /> */}
          <TextCommonMedium
            text={`${profile?.role || ''} • ${profile?.city || ''}`}
            textViewStyle={styles.subText}
          />
        </View>

        <TextCommonMedium
          text={'ACCOUNT SETTINGS'}
          textViewStyle={styles.sectionTitle}
        />
        <View style={styles.card}>
          {renderMenuItem(
            'My Profile',
            'Contact and basic info',
            'person-outline',
            '#FBE4D8',
            '#FF7A00',
            () =>
              navigation.navigate('ProfileDetails', { profileData: profile }),
          )}

          {renderMenuItem(
            'Identity Documents',
            'E-Valid for your IDs',
            'card-outline',
            '#DCE8F9',
            '#3A7BFF',
            () => navigation.navigate('UploadDocScreen'),
          )}
          {renderMenuItem(
            'Bank Details',
            'Manage your bank accounts',
            'card-outline',
            '#DFF3EA',
            '#00A86B',
            () => navigation.navigate('BankDetailsScreen'),
          )}
        </View>

        {/* PREFERENCES */}
        <TextCommonMedium
          text={'PREFERENCES'}
          textViewStyle={styles.sectionTitle}
        />
        <View style={styles.card}>
          {/* {renderMenuItem(
            'Settings',
            'Security and app settings',
            'settings',
            '#E9EDF3',
            '#5A6B85',
          )} */}
          {renderMenuItem(
            'Settings',
            'Security and app settings',
            'settings-outline',
            '#E9EDF3',
            '#5A6B85',
            () => navigation.navigate('SettingsScreen'),
          )}

          {renderMenuItem(
            'Notifications',
            'View your recent notifications',
            'notifications-outline',
            '#EEF2FF',
            '#3A7BFF',
            () => navigation.navigate('NotificationScreen'),
          )}

          {renderMenuItem(
            'Help & Support',
            'FAQs and legal aid desk',
            'help-circle-outline',
            '#E9EDF3',
            '#5A6B85',
            () => navigation.navigate('HelpSupportScreen'),
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#1a1a1a" />
          <TextCommonBold text={'Log Out'} textViewStyle={styles.logoutText} />
        </TouchableOpacity>

        <Modal
          visible={showImagePickerModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowImagePickerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.imagePickerModal}>
              <Text style={styles.modalTitle}>Update Profile Photo</Text>
              <Text style={styles.imagePickerMessage}>Choose an option</Text>

              <TouchableOpacity
                style={styles.imagePickerOption}
                onPress={openCamera}
                activeOpacity={0.85}
              >
                <Icon name="camera-outline" size={20} color="#111111" />
                <Text style={styles.imagePickerOptionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.imagePickerOption}
                onPress={openGallery}
                activeOpacity={0.85}
              >
                <Icon name="images-outline" size={20} color="#111111" />
                <Text style={styles.imagePickerOptionText}>Gallery</Text>
              </TouchableOpacity>

              <Pressable
                style={styles.imagePickerCancelButton}
                onPress={() => setShowImagePickerModal(false)}
              >
                <Text style={styles.imagePickerCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.logoutModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirm Logout</Text>
              </View>

              <Text style={styles.modalMessage}>
                Are you sure you want to log out?
              </Text>

              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.cancelButtonText}>No, Stay</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmLogout}
                >
                  <Text style={styles.confirmButtonText}>Yes, Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#1a1a1a',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    marginTop: 12,
    color: '#000000',
  },
  referralCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: '88%',
    alignItems: 'center',
  },
  referralTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  referralLabel: {
    fontSize: 12,
    color: '#111111',
    letterSpacing: 0.5,
  },
  referralCode: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 1,
  },
  referralHintText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: '#555555',
    textAlign: 'center',
  },
  shareReferralButton: {
    marginTop: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shareReferralButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 14,
    color: '#4A4A4A',
    marginTop: 4,
  },
  govText: {
    fontSize: 13,
    color: '#333333',
    marginTop: 6,
  },
  sectionTitle: {
    marginTop: 25,
    marginLeft: 20,
    fontSize: 11,
    color: '#444444',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E2E2',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 15,
    color: '#000000',
  },
  menuSub: {
    fontSize: 12,
    color: '#666666',
    marginTop: 3,
  },
  // Logout — black border, black text (no red)
  logoutBtn: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  logoutText: {
    color: '#1a1a1a',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: '#CFCFCF',
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
    }),
  },
  imagePickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: '#CFCFCF',
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
    }),
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    color: '#000000',
    fontFamily: undefined,
  },
  modalMessage: {
    fontSize: 15,
    color: '#444444',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ECECEC',
    borderWidth: 1,
    borderColor: '#CFCFCF',
  },
  confirmButton: {
    backgroundColor: '#1a1a1a',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#444444',
  },
  confirmButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  imagePickerMessage: {
    fontSize: 15,
    color: '#444444',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: '#F1F1F1',
  },
  imagePickerOptionText: {
    fontSize: 15,
    color: '#000000',
  },
  imagePickerCancelButton: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E3E3E3',
  },
  imagePickerCancelText: {
    fontSize: 15,
    color: '#444444',
  },
});
