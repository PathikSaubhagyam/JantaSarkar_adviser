import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APIWebCall from '../../common/APIWebCall';
import Header from '../../components/Header';
import { FONTS_Family } from '../../constants/Font';
import { COLORS } from '../../constants/Colors';

type NotificationItem = {
  id: number;
  title: string;
  body: string;
  image_url: string | null;
  video_url: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await APIWebCall.onNotificationListAPICall();
      console.log('NOTIFICATIONS =>', response);

      if (response?.status) {
        setNotifications(response?.data ?? []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.log('NOTIFICATION LIST ERROR =>', error);
      setNotifications([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(true);
    }, [fetchNotifications]),
  );

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={[styles.card, !item.is_read && styles.cardUnread]}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={item.is_read ? 'notifications-outline' : 'notifications'}
          size={22}
          color={item.is_read ? '#9ca3af' : '#3A7BFF'}
        />
      </View>

      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.body} numberOfLines={3}>
          {item.body}
        </Text>
        <Text style={styles.createdAt}>{item.created_at}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 15 }} />
      <Header title="Notifications" onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#3A7BFF" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => fetchNotifications(false)}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#d1d5db"
              />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // marginTop: 15,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
      },
    }),
  },
  cardUnread: {
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontFamily: FONTS_Family.FontSemiBold,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3A7BFF',
  },
  body: {
    fontSize: 13,
    color: '#4b5563',
    fontFamily: FONTS_Family.FontRegular,
    lineHeight: 18,
    marginBottom: 6,
  },
  createdAt: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: FONTS_Family.FontRegular,
  },
  emptyWrap: {
    marginTop: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: FONTS_Family.FontRegular,
  },
});
