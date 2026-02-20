import React, { useCallback, useEffect, useState } from 'react';
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
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
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
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import SnackBarCommon from '../../components/SnackBarCommon';
import TextCommonMedium from '../../components/TextCommonMedium';
import { FONTS_SIZE } from '../../constants/Font';
const { width } = Dimensions.get('window');
const RequestScreen = () => {
  const TABS = ['New', 'Ongoing', 'History'];
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
  useFocusEffect(
    useCallback(() => {
      loadComplaints();
    }, [activeTab]),
  );

  const loadComplaints = async () => {
    try {
      setLoading(true);

      let res;

      if (activeTab === 'New') {
        res = await onAdvisorComplaintsAPICall();
      } else if (activeTab === 'Ongoing') {
        res = await onAdvisorOngoingAPICall();
      } else if (activeTab === 'History') {
        res = await onAdvisorHistoryAPICall();
      }

      const list = res?.data || [];

      setFormatComplaintData(list);

      setTabCounts(prev => ({
        ...prev,
        [activeTab]: list.length,
      }));
    } catch (error) {
      console.log('LOAD ERROR =>', error);
    } finally {
      setLoading(false);
    }
  };

  const onAcceptPress = async complaintId => {
    try {
      setLoading(true);

      let res;

      if (activeTab === 'Ongoing') {
        res = await onCompletedComplaintAPICall(complaintId);
      } else {
        res = await onApproveComplaintAPICall(complaintId);
      }

      if (res?.success !== false) {
        loadComplaints();
      }

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

        loadComplaints();
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
      await loadComplaints();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

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
                  : moment(item.created_at).fromNow()
              }
              location={item.city}
              date={moment(item.created_at).format('DD-MM-YYYY')}
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
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  header: {
    fontSize: FONTS_SIZE.txt_27,
    fontWeight: '700',
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
    borderRadius: 10,
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
    fontWeight: '600',
  },

  activeTabText: {
    color: '#0B1320',
  },
});
