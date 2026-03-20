import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { COLORS } from '../../constants/Colors';
import RequestCard from '../../components/RequestCard';
import { BASE_URL, DOBFormat } from '../../constants/Utils';
import {
  onAdvisorComplaintsAPICall,
  onAdvisorHistoryAPICall,
  onAdvisorOngoingAPICall,
  onApproveComplaintAPICall,
  onComplaintCancelAPICall,
  onCompletedComplaintAPICall,
  onRequestRejectAPICall,
} from '../../common/APIWebCall';
import NotificationService from '../../services/NotificationService';
import moment from 'moment';
import { useRoute, useIsFocused } from '@react-navigation/native';
import SnackBarCommon from '../../components/SnackBarCommon';
import TextCommonMedium from '../../components/TextCommonMedium';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';
const { width } = Dimensions.get('window');

type Coordinates = {
  latitude: number;
  longitude: number;
};

const RequestScreen = () => {
  const TABS = ['New', 'Ongoing', 'History'];
  const route = useRoute<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('New');
  const [formatComplaintData, setFormatComplaintData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [DATA, setDATA] = useState({
    new: [],
    pending: [],
    history: [],
  });
  const [tabCounts, setTabCounts] = useState({
    New: 0,
    Ongoing: 0,
    History: 0,
  });
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No access token found');
        return;
      }

      // Fetch profile from API
      const response = await fetch(`${BASE_URL}/mobile/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data, 'profile api response');

      if (data?.status && data?.data) {
        // Save profile to AsyncStorage
        await AsyncStorage.setItem('profile', JSON.stringify(data.data));
      } else {
        console.log('Profile API did not return expected data');
      }
    } catch (error) {
      console.log('Error fetching profile from API:', error);
    }
  };

  useEffect(() => {
    // Handle initial tab from route params
    const requestedTab = route?.params?.initialTab;
    if (
      requestedTab &&
      TABS.includes(requestedTab) &&
      requestedTab !== activeTab
    ) {
      setActiveTab(requestedTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.initialTab]);

  const fetchComplaints = useCallback(
    async (showLoader: boolean = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        // Fetch all tab data in parallel
        const [coordinates, newRes, ongoingRes, historyRes] = await Promise.all(
          [
            getLiveCoordinates(),
            onAdvisorComplaintsAPICall(),
            onAdvisorOngoingAPICall(),
            onAdvisorHistoryAPICall(),
          ],
        );

        // If activeTab is New, refetch with coordinates
        let activeList = [];
        if (activeTab === 'New') {
          const coordRes = await onAdvisorComplaintsAPICall(
            coordinates?.latitude,
            coordinates?.longitude,
          );
          activeList = coordRes?.data || [];
        } else if (activeTab === 'Ongoing') {
          activeList = ongoingRes?.data || [];
        } else if (activeTab === 'History') {
          activeList = historyRes?.data || [];
        }

        setFormatComplaintData(activeList);

        setTabCounts({
          New: (newRes?.data || []).length,
          Ongoing: (ongoingRes?.data || []).length,
          History: (historyRes?.data || []).length,
        });
      } catch (error) {
        console.log('LOAD ERROR =>', error);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [activeTab],
  );

  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Poll every 1 second
    pollingIntervalRef.current = setInterval(() => {
      console.log('Polling for complaint updates...');
      fetchComplaints(false);
    }, 1000);
  }, [fetchComplaints]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isFocused) {
      stopPolling();
      return;
    }

    fetchComplaints(true);
    startPolling();

    return () => {
      stopPolling();
    };
  }, [isFocused, activeTab, fetchComplaints, startPolling, stopPolling]);

  useEffect(() => {
    const syncFCMToken = async () => {
      try {
        await NotificationService.getFCMToken();
      } catch (error) {
        console.log('FCM TOKEN SYNC ERROR =>', error);
      }
    };

    syncFCMToken();
  }, []);

  const getLiveCoordinates = async (): Promise<Coordinates | null> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission denied');
          return null;
        }
      }

      return await new Promise(resolve => {
        Geolocation.getCurrentPosition(
          position => {
            console.log('LOCATION SUCCESS =>', position);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            console.log('LOCATION ERROR =>', error);
            resolve(null);
          },
          {
            enableHighAccuracy: false, // ✅ changed
            timeout: 30000, // ✅ increased
            maximumAge: 0, // ✅ changed
          },
        );
      });
    } catch (error) {
      console.log('GET LOCATION ERROR =>', error);
      return null;
    }
  };

  const onAcceptPress = async complaintId => {
    try {
      setLoading(true);
      console.log('hii1');

      let res;

      if (activeTab === 'Ongoing') {
        console.log('hiii');

        res = await onCompletedComplaintAPICall(complaintId);
      } else {
        res = await onApproveComplaintAPICall(complaintId);
      }

      if (res?.success !== false) {
        fetchComplaints(false);
      }
      console.log(res, 'complete res===');

      SnackBarCommon.displayMessage({
        message: res?.message || 'Success',
        isSuccess: true,
      });
    } catch (error) {
      console.log('ACTION ERROR =>', error);
    } finally {
      setLoading(false);
    }
  };
  const onCancelOrRejectPress = async complaintId => {
    try {
      setLoading(true);

      let res;

      if (activeTab === 'Ongoing') {
        res = await onComplaintCancelAPICall(complaintId);
      } else if (activeTab === 'New') {
        res = await onRequestRejectAPICall(complaintId);
      }

      console.log('CANCEL/REJECT RESPONSE =>', res);

      if (res?.success !== false) {
        SnackBarCommon.displayMessage({
          message: res?.message || 'Success',
          isSuccess: true,
        });

        fetchComplaints(false);
        SnackBarCommon.displayMessage({
          message: res?.message || 'Failed',
          isSuccess: true,
        });
      }
    } catch (error) {
      console.log('ERROR =>', error);

      SnackBarCommon.displayMessage({
        message: 'Something went wrong',
        isSuccess: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const getTabCount = tab => {
    return complaintsList.filter(item => item.status === tab).length;
  };
  const canShowCancelButton = accepted_time => {
    if (!accepted_time) return false;

    const acceptedMoment = moment(accepted_time, 'DD-MM-YYYY hh:mm A');
    const now = moment();

    const diffMinutes = now.diff(acceptedMoment, 'minutes');

    return diffMinutes <= 10;
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchComplaints(false);
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={{ marginTop: 15, backgroundColor: '#f8fafc' }} />

      <Text style={styles.header}>Client Request</Text>

      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab} ({tabCounts[tab] || 0})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={formatComplaintData}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 0 }}
          refreshing={refreshing} // ✅ ADD THIS
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RequestCard
              initials={item.short_name}
              authority_person_name={item.authority_person_name}
              name={item.user_name}
              description_issue={item.description_issue}
              department={item.department}
              tagColor={item.tagColor}
              time={
                activeTab === 'Ongoing' && item.accepted_time
                  ? moment(item.accepted_time, 'DD-MM-YYYY hh:mm A').fromNow()
                  : ''
              }
              location={item.city}
              date={item.created_at}
              onAccept={() => onAcceptPress(item.complaint_id)}
              acceptLabel={activeTab === 'Ongoing' ? 'Complete' : 'Accept'}
              onReject={() => onCancelOrRejectPress(item.complaint_id)}
              rejectLabel={activeTab === 'Ongoing' ? 'Cancel' : 'Reject'}
              showButtons={activeTab !== 'History'}
              showCancelButton={
                activeTab === 'Ongoing'
                  ? canShowCancelButton(item.accepted_time)
                  : true
              }
            />
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No Data Found</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9EDF3',
    borderRadius: 7,
    padding: 4,
    marginBottom: 20,
  },
  header: {
    fontSize: FONTS_SIZE.txt_27,
    fontFamily: FONTS_Family.FontBold,
    // marginVertical: 20,
    marginTop: 25,
    color: '#0B1320',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.04,
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  tabActive: {
    backgroundColor: COLORS.primary,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },

  activeTab: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  tabText: {
    fontSize: 14,
    color: '#6B7A90',
    fontFamily: FONTS_Family.FontBold,
  },

  activeTabText: {
    color: '#0B1320',
  },
});
