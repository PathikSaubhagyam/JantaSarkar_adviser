import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';

import FeedCard from '../../components/FeedCard';
import TabChips from '../../components/TabChips';
import { COLORS } from '../../constants/Colors';
import BottomNav from '../../components/BottomNav';
import { FONTS_SIZE } from '../../constants/Font';

const { width } = Dimensions.get('window');

const TABS = ['All Posts', 'Civil Law', 'Criminal Case', 'Corporate', 'IPR'];

const DATA = [
  {
    id: '1',
    name: 'Adv. Rajesh Sharma',
    tag: 'Supreme Court Specialist',
    text: 'Important update on the new labor law reforms.',
    type: 'pdf',
    fileName: 'Labour_Law_Update.pdf',
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    name: 'Adv. Priya Menon',
    tag: 'IPR & Copyright Expert',
    text: 'Future of AI in legal tech is here.',
    type: 'image',
    fileUrl:
      'https://tile.jawg.io/jawg-dark/14/11954/7618.png?access-token=8k5zP4A1X2xj6cYwJ9g2Fq0mR3v7uD6B',
    likes: 156,
    comments: 12,
  },
  {
    id: '3',
    name: 'Adv. Amit Shah',
    tag: 'Corporate Lawyer',
    text: 'New corporate compliance rules released.',
    type: 'text',
    likes: 50,
    comments: 5,
  },
];

export default function Community() {
  const [selectedTab, setSelectedTab] = useState('All Posts');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Community Feed</Text>
            <Text style={styles.subtitle}>Professional Network</Text>
          </View>
        </View>

        <TabChips
          tabs={TABS}
          selected={selectedTab}
          onSelect={setSelectedTab}
          says
        />

        {/* Feed */}
        <FlatList
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <FeedCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.04,
  },
  header: {
    // paddingVertical: 10,
    marginTop: 60,
  },
  title: {
    fontSize: FONTS_SIZE.txt_27,
    fontWeight: '700',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: width * 0.032,
    color: COLORS.textLight,
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
});
