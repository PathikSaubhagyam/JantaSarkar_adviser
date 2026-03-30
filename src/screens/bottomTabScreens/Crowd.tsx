import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS_Family } from '../../constants/Font';
import CommonModal, { ModalType } from '../../components/CommonModal';
import { onCrowdAttendanceAPICall } from '../../common/APIWebCall';
import { BASE_URL } from '../../constants/Utils';

type CrowdScreenProps = {
  onLogout?: () => void;
};

type CrowdItem = {
  id: number;
  crowd?: number;
  is_attendance?: boolean;
  city: number;
  city_name: string;
  department: number;
  department_name: string;
  authority: number;
  authority_name: string;
  title: string;
  description: string;
  issue_description: string;
  address: string;
  event_date: string;
  event_time: string;
  latitude: number;
  longitude: number;
  status: 'Pending' | 'Assigned' | 'Rejected' | string;
  created_at: string;
};

type CrowdApiResponse = {
  status?: boolean | string;
  success?: boolean | string;
  data?: CrowdItem[];
  results?: CrowdItem[];
  records?: CrowdItem[];
};

type AttendanceApiResponse = {
  status: boolean;
  message: string;
};

type ApiErrorData = {
  message?: string;
  detail?: string;
  error?: string;
  errors?: string[] | Record<string, string | string[]>;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

const CROWD_API_URL = `${BASE_URL}admin_api/crowd/`;

export default function Crowd({ onLogout }: CrowdScreenProps) {
  const [crowdData, setCrowdData] = useState<CrowdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [capturingId, setCapturingId] = useState<number | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState<Map<number, string>>(
    new Map(),
  );
  const [modalState, setModalState] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: ModalType;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const locationRetryCallback = useCallback(() => {
    setLocationModalVisible(false);
    if (locationRetryCallback) locationRetryCallback();
  }, []);

  const showModal = useCallback(
    (title: string, message: string, type: ModalType = 'info') => {
      setModalState({
        visible: true,
        title,
        message,
        type,
      });
    },
    [],
  );

  const hideModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const fetchCrowdData = useCallback(async () => {
    try {
      const token =
        (await AsyncStorage.getItem('token')) ||
        (await AsyncStorage.getItem('access_token'));
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get<CrowdApiResponse>(CROWD_API_URL, {
        headers,
      });
      console.log(response, 'crowd res');

      const payload = response.data || {};
      const isSuccess =
        payload.status === true ||
        payload.success === true ||
        payload.status === 'true' ||
        payload.success === 'true';
      const list = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.results)
        ? payload.results
        : Array.isArray(payload.records)
        ? payload.records
        : [];

      if (isSuccess || list.length > 0) {
        setCrowdData(list);
      } else {
        setCrowdData([]);
      }
    } catch (error) {
      setCrowdData([]);
      showModal(
        'Error',
        'Failed to load crowd data. Please try again.',
        'error',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showModal]);

  useEffect(() => {
    fetchCrowdData();
  }, [fetchCrowdData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCrowdData();
  };

  const getStatusStyle = useCallback((status: string) => {
    switch (status) {
      case 'Assigned':
        return styles.statusAssigned;
      case 'Rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  }, []);

  const getStatusTextStyle = useCallback((status: string) => {
    switch (status) {
      case 'Assigned':
        return styles.statusTextAssigned;
      case 'Rejected':
        return styles.statusTextRejected;
      default:
        return styles.statusTextPending;
    }
  }, []);

  const getLiveCoordinates =
    useCallback(async (): Promise<Coordinates | null> => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return null;
          }
        }

        return await new Promise(resolve => {
          Geolocation.getCurrentPosition(
            position => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            () => {
              resolve(null);
            },
            {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 0,
            },
          );
        });
      } catch {
        return null;
      }
    }, []);

  const handleAddAttendance = async (
    crowdId: number,
    fallbackLatitude?: number,
    fallbackLongitude?: number,
  ) => {
    try {
      setCapturingId(crowdId);

      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'front',
        saveToPhotos: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        showModal(
          'Camera Error',
          result.errorMessage || 'Unable to open camera',
          'error',
        );
        return;
      }

      const photoUri = result.assets?.[0]?.uri;

      if (!photoUri) {
        showModal('Error', 'No selfie captured. Please try again.', 'error');
        return;
      }

      const coordinates = await getLiveCoordinates();

      const latitude = coordinates?.latitude ?? fallbackLatitude;
      const longitude = coordinates?.longitude ?? fallbackLongitude;

      if (latitude == null || longitude == null) {
        showModal(
          'Location Error',
          'Unable to fetch location. Please enable location and try again.',
          'error',
        );
        return;
      }

      const fileName =
        result.assets?.[0]?.fileName || `selfie-${Date.now().toString()}.jpg`;
      const fileType = result.assets?.[0]?.type || 'image/jpeg';

      const formData = new FormData();
      formData.append('selfie', {
        uri: photoUri,
        name: fileName,
        type: fileType,
      } as any);
      formData.append('latitude', String(latitude));
      formData.append('longitude', String(longitude));
      console.log(formData, 'form data====>>>');

      const attendanceResponse = await onCrowdAttendanceAPICall(
        crowdId,
        formData,
      );
      console.log(attendanceResponse, 'attendance response==>');

      if (!attendanceResponse?.status) {
        showModal(
          'Error',
          attendanceResponse?.message || 'Failed to add attendance.',
          'error',
        );
        return;
      }

      setAttendanceMarked(prev => {
        const next = new Map(prev);
        next.set(crowdId, photoUri);
        return next;
      });

      showModal(
        'Attendance Added',
        attendanceResponse?.message || 'Attendance added successfully',
        'success',
      );
    } catch (error) {
      const apiMessage = axios.isAxiosError(error)
        ? (() => {
            const data = error.response?.data as ApiErrorData | undefined;

            if (typeof data?.message === 'string' && data.message.trim()) {
              return data.message;
            }

            if (typeof data?.detail === 'string' && data.detail.trim()) {
              return data.detail;
            }

            if (typeof data?.error === 'string' && data.error.trim()) {
              return data.error;
            }

            if (Array.isArray(data?.errors) && data.errors.length > 0) {
              return data.errors[0];
            }

            if (
              data?.errors &&
              typeof data.errors === 'object' &&
              !Array.isArray(data.errors)
            ) {
              const firstError = Object.values(data.errors)[0];

              if (Array.isArray(firstError) && firstError.length > 0) {
                return firstError[0];
              }

              if (typeof firstError === 'string' && firstError.trim()) {
                return firstError;
              }
            }

            return error.message;
          })()
        : undefined;

      showModal(
        'Error',
        apiMessage || 'Failed to add attendance. Please try again.',
        'error',
      );
    } finally {
      setCapturingId(null);
    }
  };

  const emptyStateText = useMemo(() => {
    if (loading) {
      return '';
    }

    return 'No crowd records available';
  }, [loading]);

  const formatEventDate = useCallback((value: string) => {
    if (!value) return '-';

    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, '0');
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const year = parsed.getFullYear();

      return `${day}-${month}-${year}`; // ✅ 13-03-2026
    }

    return value;
  }, []);

  const formatEventTime = useCallback((value: string) => {
    if (!value) return '-';

    const normalized = value.trim();

    // If already in AM/PM format
    const twelveHourMatch = normalized.match(
      /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i,
    );

    if (twelveHourMatch) {
      const hours = twelveHourMatch[1].padStart(2, '0');
      const minutes = twelveHourMatch[2];
      const period = twelveHourMatch[3].toUpperCase();

      return `${hours}:${minutes} ${period}`; // ✅ 02:30 PM
    }

    // Convert 24-hour → 12-hour
    const twentyFourHourMatch = normalized.match(
      /^(\d{1,2}):(\d{2})(?::\d{2})?$/,
    );

    if (twentyFourHourMatch) {
      let hours = Number(twentyFourHourMatch[1]);
      const minutes = twentyFourHourMatch[2];

      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
    }

    return normalized;
  }, []);

  const renderItem = ({ item }: { item: CrowdItem }) => {
    const hasAttendance = attendanceMarked.has(item.id);
    console.log(item, 'iterm data');
    const attendanceAdded = hasAttendance || item?.is_attendance;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        {/* <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
            {item.status}
          </Text>
        </View> */}

        <Text style={styles.rowText}>
          <Text style={styles.rowLabel}>City: </Text>
          {item.city_name}
        </Text>
        <Text style={styles.rowText}>
          <Text style={styles.rowLabel}>Department: </Text>
          {item.department_name}
        </Text>
        <Text style={styles.rowText}>
          <Text style={styles.rowLabel}>Authority: </Text>
          {item.authority_name}
        </Text>
        {/* <Text style={styles.rowText}>
          <Text style={styles.rowLabel}>Description: </Text>
          {item.description}
        </Text> */}
        <Text style={styles.rowText}>
          <Text style={styles.rowLabel}>Issue: </Text>
          {item.issue_description}
        </Text>
        <Text style={styles.rowText}>
          <Text style={styles.rowLabel}>Address: </Text>
          {item.address}
        </Text>

        <View style={styles.dateTimeRow}>
          <View style={styles.metaItem}>
            <Icon name="calendar-outline" size={16} color="#64748b" />
            <Text style={styles.metaText}>
              {formatEventDate(item.event_date)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="time-outline" size={16} color="#64748b" />
            <Text style={styles.metaText}>
              {formatEventTime(item.event_time)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.attendanceButton,
              attendanceAdded && styles.attendanceButtonDone,
            ]}
            onPress={() => handleAddAttendance(item.id)}
            disabled={capturingId === item.id || attendanceAdded}
          >
            {capturingId === item.id ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Icon
                name={attendanceAdded ? 'checkmark' : 'camera-outline'}
                size={18}
                color="#ffffff"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
      />
      <View style={{ marginTop: 8, backgroundColor: '#ffffff' }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crowd Management</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loaderText}>Loading crowd data...</Text>
        </View>
      ) : (
        <FlatList
          data={crowdData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="people-outline" size={56} color="#cbd5e1" />
              <Text style={styles.emptyText}>{emptyStateText}</Text>
            </View>
          }
        />
      )}

      <CommonModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onPrimaryPress={hideModal}
      />
      <CommonModal
        visible={locationModalVisible}
        title="Location Required"
        message="This app needs your location to continue. Please allow location access."
        onPrimaryPress={() => {
          setLocationModalVisible(false);
          if (locationRetryCallback) locationRetryCallback();
        }}
        primaryText="Retry"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    color: '#0f172a',
    fontFamily: FONTS_Family.FontBold,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#475569',
    fontFamily: FONTS_Family.FontMedium,
  },
  listContent: {
    padding: 14,
    paddingBottom: 110,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 7,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    fontFamily: FONTS_Family.FontBold,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusAssigned: {
    backgroundColor: '#dcfce7',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONTS_Family.FontBold,
  },
  statusTextPending: {
    color: '#a16207',
  },
  statusTextAssigned: {
    color: '#166534',
  },
  statusTextRejected: {
    color: '#b91c1c',
  },
  rowText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
    fontFamily: FONTS_Family.FontMedium,
  },
  rowLabel: {
    color: '#0f172a',
    fontFamily: FONTS_Family.FontBold,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: FONTS_Family.FontMedium,
  },
  attendanceButton: {
    backgroundColor: '#2563eb',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '28%',
  },
  attendanceButtonDone: {
    backgroundColor: '#16a34a',
  },
  attendanceButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: FONTS_Family.FontBold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 10,
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },
});
