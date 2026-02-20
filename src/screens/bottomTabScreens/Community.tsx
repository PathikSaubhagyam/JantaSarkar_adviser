import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { FONTS_SIZE } from '../../constants/Font';
import { COLORS } from '../../constants/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TextCommonMedium from '../../components/TextCommonMedium';
import TextCommonBold from '../../components/TextCommonBold';
import { onCommunityFeedListAPICall } from '../../common/APIWebCall';

const Community = () => {
  const navigation = useNavigation<any>();
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
          id: item.id.toString(),
          department: item.department_name,
          issueType: item.description_issue,
          city: item.city_name,

          persons: [
            item.person1_name
              ? {
                  name: item.person1_name,
                  mobile: item.person1_mobile,
                }
              : null,

            item.person2_name
              ? {
                  name: item.person2_name,
                  mobile: item.person2_mobile,
                }
              : null,

            item.person3_name
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
            color: COLORS.primary,
          }}
        />

        {/* Issue */}
        <TextCommonMedium
          text={item?.issueType}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_14,
            color: COLORS.black,
            marginTop: 2,
          }}
        />

        {/* City */}
        <TextCommonMedium
          text={item?.city}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_14,
            color: '#666',
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
                  onPress={() => handleCall(person?.mobile)}
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
          <Text style={{ color: '#999', marginTop: 5 }}>
            No persons available
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Community Feed</Text>

        <FlatList
          data={requestList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CommunityFeedAdd');
        }}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Community;
const styles = StyleSheet.create({
  callButton: {
    padding: 8,
  },

  callIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '600',
  },
  title: {
    fontSize: FONTS_SIZE.txt_27,
    fontWeight: '700',
    color: COLORS.black,
    marginTop: 15,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  department: {
    fontSize: 16,
    color: '#007BFF',
  },

  issue: {
    fontSize: 16,
    color: COLORS.black,
  },

  personTitle: {
    marginTop: 10,
    fontWeight: '600',
    color: COLORS.black,
  },

  personRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  personName: {
    fontSize: 14,
    color: COLORS.black,
  },

  personMobile: {
    fontSize: 14,
    color: '#666',
    color: COLORS.black,
  },
});
