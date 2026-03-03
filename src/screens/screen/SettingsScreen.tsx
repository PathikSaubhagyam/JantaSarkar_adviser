import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../components/Header';
import CommonModal, { ModalType } from '../../components/CommonModal';
// import { BASE_URL } from '../utils/constant';
import { FONTS_Family } from '../../constants/Font';
import APIWebCall from '../../common/APIWebCall';

type ModalState = {
  visible: boolean;
  title: string;
  message: string;
  type: ModalType;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
};

export default function SettingsScreen() {
  const NOTIFICATION_STATUS_KEY = 'is_notification';
  const navigation = useNavigation<any>();
  const [isNotification, setIsNotification] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    title: '',
    message: '',
    type: 'error',
    primaryText: 'OK',
    onPrimaryPress: () => {},
  });

  useEffect(() => {
    const loadNotificationStatus = async () => {
      try {
        const savedStatus = await AsyncStorage.getItem(NOTIFICATION_STATUS_KEY);

        if (savedStatus !== null) {
          setIsNotification(JSON.parse(savedStatus));
        }
      } catch (error) {
        console.log('Failed to load notification status:', error);
      }
    };

    loadNotificationStatus();
  }, []);

  const updateNotificationSetting = async (nextValue: boolean) => {
    const previousValue = isNotification;
    setIsNotification(nextValue);
    setIsUpdating(true);

    try {
      const res = await APIWebCall.onNotificationSettingAPICall({
        is_notification: nextValue,
      });

      console.log('Notification API Response =>', res);

      if (res?.status || res?.success) {
        const updatedNotificationStatus = Boolean(res?.is_notification);

        setIsNotification(updatedNotificationStatus);

        await AsyncStorage.setItem(
          NOTIFICATION_STATUS_KEY,
          JSON.stringify(updatedNotificationStatus),
        );

        return;
      }

      throw new Error(res?.message || 'Failed to update notification setting.');
    } catch (error: any) {
      setIsNotification(previousValue);

      setModal({
        visible: true,
        type: 'error',
        title: 'Update Failed',
        message:
          error?.message ||
          'Failed to update notification setting. Please try again.',
        primaryText: 'OK',
        onPrimaryPress: () => setModal(prev => ({ ...prev, visible: false })),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <CommonModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        primaryText={modal.primaryText}
        secondaryText={modal.secondaryText}
        onPrimaryPress={modal.onPrimaryPress}
        onSecondaryPress={modal.onSecondaryPress}
      />

      <Header title="Settings" onBackPress={() => navigation.goBack()} />

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              Turn app notifications on or off
            </Text>
          </View>

          <Switch
            value={isNotification}
            disabled={isUpdating}
            onValueChange={updateNotificationSetting}
            trackColor={{ false: '#d1d5db', true: '#849ed3' }}
            thumbColor={isNotification ? '#3A7BFF' : '#f3f4f6'}
          />
        </View>

        {isUpdating && (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color="#3A7BFF" />
            <Text style={styles.loaderText}>Updating setting...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingHorizontal: 16,
  },
  card: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    color: '#111827',
    fontFamily: FONTS_Family.FontMedium,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
    fontFamily: FONTS_Family.FontMedium,
  },
  loaderRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderText: {
    marginLeft: 8,
    color: '#6b7280',
    fontSize: 13,
    fontFamily: FONTS_Family.FontMedium,
  },
});
