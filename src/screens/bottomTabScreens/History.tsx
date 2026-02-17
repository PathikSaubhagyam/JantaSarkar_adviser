import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const TABS = ['All', 'Completed', 'Ongoing'];

const CASES = [
  {
    id: '1',
    type: 'CIVIL CASE',
    caseNo: '#JS-8821',
    title: 'Rajesh Kumar vs. Realty Corp',
    date: 'Oct 24, 2023',
    client: 'R. Kumar',
    status: 'COMPLETED',
  },
  {
    id: '2',
    type: 'CRIMINAL',
    caseNo: '#JS-9012',
    title: 'State of MH vs. Aman Sharma',
    date: 'Jan 12, 2024',
    client: 'A. Sharma',
    status: 'ONGOING',
  },
  {
    id: '3',
    type: 'FAMILY LAW',
    caseNo: '#JS-7742',
    title: 'Priya Singh - Divorce Settlement',
    date: 'Sept 15, 2023',
    client: 'P. Singh',
    status: 'COMPLETED',
  },
];

export default function History() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredData = useMemo(() => {
    if (activeTab === 'All') return CASES;
    return CASES.filter(i => i.status === activeTab.toUpperCase());
  }, [activeTab]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.caseType}>
          {item.type} • {item.caseNo}
        </Text>

        <View
          style={[
            styles.statusBadge,
            item.status === 'COMPLETED' ? styles.completed : styles.ongoing,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'COMPLETED'
                ? styles.completedText
                : styles.ongoingText,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.divider} />

      <View style={styles.rowBetween}>
        <Text style={styles.meta}>{item.date}</Text>
        <Text style={styles.meta}>{item.client}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <Text style={styles.header}>Case History</Text>

      {/* Tabs */}
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
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
  },

  header: {
    fontSize: width * 0.07,
    fontWeight: '700',
    marginVertical: 20,
    color: '#0B1320',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9EDF3',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
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

  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: width * 0.04,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  caseType: {
    fontSize: 12,
    color: '#7A8CA5',
    fontWeight: '600',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1320',
    marginVertical: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F6',
    marginVertical: 10,
  },

  meta: {
    fontSize: 13,
    color: '#7A8CA5',
    fontWeight: '500',
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  completed: {
    backgroundColor: '#DFF5E7',
  },

  ongoing: {
    backgroundColor: '#FFE6CC',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  completedText: {
    color: '#1BAA5C',
  },

  ongoingText: {
    color: '#F97316',
  },
});
