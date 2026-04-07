import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import APIWebCall from '../../common/APIWebCall';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';

type CommunityItem = {
  id: number;
  department_name?: string;
  city_name?: string;
  description_issue?: string;
  person1_name?: string;
  person1_mobile?: string;
  person2_name?: string;
  person2_mobile?: string;
  person3_name?: string;
  person3_mobile?: string;
};

const CommunityDashboardScreen = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CommunityItem[]>([]);

  const fetchCommunityDashboard = async () => {
    try {
      setLoading(true);
      const res = await APIWebCall.onCommunityDashboardAPICall();

      if (res?.status === true || res?.success === true) {
        setItems(res?.data || []);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.log('COMMUNITY DASHBOARD ERROR =>', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityDashboard();
  }, []);

  const renderContact = (label: string, name?: string, mobile?: string) => {
    if (!name && !mobile) {
      return null;
    }

    return (
      <View style={styles.contactRow}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>
          {name || '-'}
          {mobile ? ` • ${mobile}` : ''}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: CommunityItem }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.departmentText}>
            {item.department_name || 'Unknown Department'}
          </Text>
          <View style={styles.cityPill}>
            <Ionicons name="location-outline" size={12} color="#111111" />
            <Text style={styles.cityText}>{item.city_name || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.issueLabel}>Issue</Text>
        <Text style={styles.issueText}>
          {item.description_issue || 'No description available'}
        </Text>

        <View style={styles.divider} />

        {renderContact('Person 1', item.person1_name, item.person1_mobile)}
        {renderContact('Person 2', item.person2_name, item.person2_mobile)}
        {renderContact('Person 3', item.person3_name, item.person3_mobile)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Your Cases" onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#1A1A1A" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="folder-open-outline" size={46} color="#B0B0B0" />
              <Text style={styles.emptyText}>No community cases found.</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchCommunityDashboard}
                activeOpacity={0.8}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default CommunityDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 14,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  departmentText: {
    flex: 1,
    color: '#000000',
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_14,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#F2F2F2',
  },
  cityText: {
    color: '#111111',
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_11,
  },
  issueLabel: {
    marginTop: 10,
    color: '#555555',
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_12,
  },
  issueText: {
    marginTop: 4,
    color: '#1A1A1A',
    fontFamily: FONTS_Family.FontRegular,
    fontSize: FONTS_SIZE.txt_13,
    lineHeight: 19,
  },
  divider: {
    marginTop: 12,
    marginBottom: 10,
    height: 1,
    backgroundColor: '#ECECEC',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  contactLabel: {
    width: 62,
    color: '#666666',
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_12,
  },
  contactValue: {
    flex: 1,
    color: '#111111',
    fontFamily: FONTS_Family.FontRegular,
    fontSize: FONTS_SIZE.txt_12,
  },
  emptyWrap: {
    marginTop: 70,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#777777',
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_13,
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  retryText: {
    color: '#FFFFFF',
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_12,
  },
});
