import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';
import { COLORS } from '../../constants/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextCommonBold from '../../components/TextCommonBold';
import { onCommunityFeedListAPICall } from '../../common/APIWebCall';

const Community = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  // Sample data (later replace with API data)
  const [requestList, setRequestList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadCommunityFeed();
    }, []),
  );

  const loadCommunityFeed = async () => {
    try {
      const res = await onCommunityFeedListAPICall();

      console.log('API RESPONSE FULL:', res);

      if (res && res.data && Array.isArray(res.data)) {
        const formattedData = res.data.map(item => ({
          id: item?.id?.toString() || Math.random().toString(),
          department: item?.department_name || 'N/A',
          issueType: item?.description_issue || 'N/A',
          city: item?.city_name || 'N/A',

          persons: [
            item?.person1_name
              ? {
                  name: item.person1_name,
                  mobile: item.person1_mobile,
                }
              : null,

            item?.person2_name
              ? {
                  name: item.person2_name,
                  mobile: item.person2_mobile,
                }
              : null,

            item?.person3_name
              ? {
                  name: item.person3_name,
                  mobile: item.person3_mobile,
                }
              : null,
          ].filter(Boolean),
        }));

        setRequestList(formattedData);
      } else {
        console.log('Invalid API response:', res);
      }
    } catch (error) {
      console.log('LOAD ERROR:', error);
    }
  };
  const handleCall = mobile => {
    if (!mobile) return;

    Linking.openURL(`tel:${mobile}`).catch(err =>
      console.log('Call Error:', err),
    );
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Department */}
        <TextCommonBold
          text={item?.department}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_16,
            color: '#000000',
          }}
        />

        {/* Issue */}
        <TextCommonMedium
          text={item?.issueType}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_14,
            color: '#1a1a1a',
            marginTop: 2,
          }}
        />

        {/* City */}
        <TextCommonMedium
          text={item?.city}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_14,
            color: '#555555',
            marginTop: 2,
          }}
        />

        <Text style={styles.personTitle}>Persons:</Text>

        {item?.persons && item.persons.length > 0 ? (
          item.persons.map((person, index) => (
            <View key={index} style={styles.personRow}>
              <Text style={styles.personName}>{person?.name || 'N/A'}</Text>

              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <Text style={styles.personMobile}>
                  {person?.mobile || 'N/A'}
                </Text>
                <TouchableOpacity
                  disabled={true}
                  // onPress={() => handleCall(person?.mobile)}
                  style={styles.callButton}
                >
                  <Image
                    source={require('../../assets/images/call_icon.png')}
                    style={styles.callIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: '#888888', marginTop: 5 }}>
            No persons available
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={[styles.headerView, { paddingTop: Math.max(insets.top, 16) }]}>
          <Text style={styles.title}>Community Feed</Text>
        </View>
        <View style={{ padding: 16 }}>
          <FlatList
            data={requestList}
            keyExtractor={item => item.id}
            style={{ marginLeft: 1 }}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CommunityFeedAdd');
        }}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Community;
const styles = StyleSheet.create({
  headerView: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  callButton: {
    padding: 8,
  },
  callIcon: {
    width: 18,
    height: 18,
    tintColor: '#1a1a1a',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1a1a1a',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: FONTS_Family.FontMedium,
    marginTop: 8,
  },
  title: {
    textAlignVertical: 'top',
    marginTop: -10,
    fontSize: 24,
    fontFamily: FONTS_Family.FontBold,
    color: '#000000',
    letterSpacing: 0.3,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '99%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  department: {
    fontSize: 16,
    color: '#000000',
  },
  issue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  personTitle: {
    marginTop: 10,
    fontFamily: FONTS_Family.FontExtraBold,
    color: '#000000',
  },
  personRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personName: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  personMobile: {
    fontSize: 14,
    color: '#555555',
  },
});
