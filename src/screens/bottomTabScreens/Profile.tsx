import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/Colors';
import { BASE_URL } from '../../constants/Utils';
import { useNavigation } from '@react-navigation/native';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextCommonRegular from '../../components/TextCommonRegular';
import TextCommonBold from '../../components/TextCommonBold';
import { onProfileAPICall } from '../../common/APIWebCall';
const { width, height } = Dimensions.get('window');

type ProfileScreenProps = {
  onLogout?: () => void;
};

export default function Profile({ onLogout }: ProfileScreenProps) {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  console.log('ppppppppppp', profile);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  // 📷 Open Camera
  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // 🖼 Open Gallery
  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets) {
      setProfileImage(result.assets[0].uri);
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

  // 🔹 Reusable Menu Item
  const renderMenuItem = (title, subtitle, iconName, bgColor, iconColor) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Icon name={iconName} size={20} color={iconColor} />
        </View>

        <View style={{ marginLeft: 12 }}>
          <TextCommonMedium text={title} textViewStyle={styles.menuTitle} />
          <TextCommonRegular text={subtitle} textViewStyle={styles.menuSub} />
        </View>
      </View>

      <Icon name="chevron-right" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
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
              <Icon name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <TextCommonBold
            text={profile?.full_name}
            textViewStyle={styles.name}
          />

          <TextCommonMedium
            text={`Verified Citizen • ${profile?.phone_number || ''}`}
            textViewStyle={styles.subText}
          />
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
            'person',
            '#FBE4D8',
            '#FF7A00',
          )}

          {renderMenuItem(
            'Identity Documents',
            'E-Valid for your IDs',
            'badge',
            '#DCE8F9',
            '#3A7BFF',
          )}

          {renderMenuItem(
            'Legal History',
            'Past cases and records',
            'gavel',
            '#DFF3EA',
            '#00A86B',
          )}
        </View>

        {/* PREFERENCES */}
        <TextCommonMedium
          text={'PREFERENCES'}
          textViewStyle={styles.sectionTitle}
        />
        <View style={styles.card}>
          {renderMenuItem(
            'Settings',
            'Security and app settings',
            'settings',
            '#E9EDF3',
            '#5A6B85',
          )}

          {renderMenuItem(
            'Help & Support',
            'FAQs and legal aid desk',
            'help-outline',
            '#E9EDF3',
            '#5A6B85',
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <TextCommonMedium
            text={'Log Out'}
            textViewStyle={styles.logoutText}
          />
        </TouchableOpacity>

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
    backgroundColor: '#F4F6F9',
  },

  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },

  imageContainer: {
    position: 'relative',
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF7A00',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: {
    fontSize: 20,
    marginTop: 12,
    color: COLORS.black,
  },

  subText: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  govText: {
    fontSize: 13,
    color: '#FF7A00',
    marginTop: 6,
  },

  sectionTitle: {
    marginTop: 25,
    marginLeft: 20,
    fontSize: 12,
    color: '#9A9A9A',
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 8,
    elevation: 3,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuTitle: {
    fontSize: 15,
    color: COLORS.black,
  },

  menuSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  logoutBtn: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFEAEA',
    borderRadius: 12,
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#FFD6F7',
  },

  logoutText: {
    color: '#FF4D4D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    width: '85%',
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
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
    color: '#1a1a1a',
  },
  modalMessage: {
    fontSize: 15,
    color: '#6b7280',
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
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  confirmButton: {
    backgroundColor: '#FF4D4D',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#6b7280',
  },
  confirmButtonText: {
    fontSize: 15,
    color: '#ffffff',
  },
});
