import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';

import { COLORS } from '../../constants/Colors';
import RequestCard from '../../components/RequestCard';
const { width } = Dimensions.get('window');
const Home = () => {
  const [activeTab, setActiveTab] = useState('new');

  const DATA = {
    new: [
      {
        id: '1',
        initials: 'RK',
        name: 'Rajesh Kumar',
        tag: 'GST Dispute',
        tagColor: '#FFE6CC',
        time: '15 mins ago',
        desc: 'Facing a tax notice regarding input credit mismatch from FY 2022-23.',
        location: 'Mumbai, MH',
        date: 'Oct 24, 2023',
      },
      {
        id: '2',
        initials: 'AS',
        name: 'Anita Sharma',
        tag: 'Property Law',
        tagColor: '#D4F5E9',
        time: '1 hour ago',
        desc: 'Need help with commercial lease agreement and title verification.',
        location: 'Bangalore, KA',
        date: 'Oct 24, 2023',
      },
    ],
    pending: [
      {
        id: '3',
        initials: 'VP',
        name: 'Vikram Patel',
        tag: 'Corporate Litigation',
        tagColor: '#FFE0E0',
        time: '3 hours ago',
        desc: 'Shareholder dispute involving medium scale company.',
        location: 'Delhi, NCR',
        date: 'Oct 23, 2023',
      },
    ],
    history: [],
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {['new', 'pending', 'history'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabBtn, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <Text style={styles.header}>Client Request</Text>
      {renderTabs()}

      <FlatList
        data={DATA[activeTab]}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <RequestCard
            initials={item.initials}
            name={item.name}
            tag={item.tag}
            tagColor={item.tagColor}
            time={item.time}
            description={item.desc}
            location={item.location}
            date={item.date}
            onAccept={() => console.log('Accept', item.id)}
            onReject={() => console.log('Reject', item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No Data Found</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9EDF3',
    borderRadius: 14,
    padding: 4,
    // marginBottom: 20,
    marginHorizontal: 15,
    marginTop: 10,
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: '700',
    // marginVertical: 20,
    marginTop: 50,
    color: '#0B1320',
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F2F4F7',
  },

  tabActive: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontWeight: '600',
    color: '#666',
  },

  tabTextActive: {
    color: '#FFF',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
  // tabContainer: {
  //   flexDirection: 'row',
  //   backgroundColor: '#E9EDF3',
  //   borderRadius: 14,
  //   padding: 4,
  //   marginBottom: 20,
  // },

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
