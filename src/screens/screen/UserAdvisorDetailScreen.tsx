import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import SnackBarCommon from '../../components/SnackBarCommon';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';

// ─── helper ─────────────────────────────────────────────────────────────────
const val = (v: any) => (v ? String(v).trim() : null);

const UserAdvisorDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user: any = route.params?.user ?? {};

  const initials = (user.full_name || user.phone_number || '?')
    .trim()
    .charAt(0)
    .toUpperCase();

  const isAdvisor = user.role === 'Advisor';

  const handleCall = async () => {
    const number = String(user.phone_number ?? '').trim();
    if (!number) {
      SnackBarCommon.displayMessage({
        message: 'Phone number not available',
        isSuccess: false,
      });
      return;
    }
    const url = `tel:${number}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      SnackBarCommon.displayMessage({
        message: 'Calling not supported on this device',
        isSuccess: false,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile Detail" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ─── Hero card ──────────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.heroName}>
            {val(user.full_name) || 'Unknown'}
          </Text>

          <View style={styles.roleRow}>
            {/* <View
              style={[
                styles.rolePill,
                isAdvisor ? styles.advisorPill : styles.userPill,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  isAdvisor ? styles.advisorRoleText : styles.userRoleText,
                ]}
              >
                {user.role ?? 'User'}
              </Text>
            </View> */}
          </View>

          {/* Call button */}
          {!!val(user.phone_number) && (
            <TouchableOpacity
              style={styles.callBtn}
              //   onPress={handleCall}
              activeOpacity={0.85}
            >
              <Icon name="call-outline" size={18} color="#fff" />
              <Text style={styles.callBtnText}>{user.phone_number}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Sections ───────────────────────────────────────────────────── */}
        <Section title="Personal Info">
          <Row
            icon="person-outline"
            label="Full Name"
            value={val(user.full_name)}
          />
          <Row icon="mail-outline" label="Email" value={val(user.email)} />
          <Row icon="location-outline" label="City" value={val(user.city)} />
          <Row icon="people-outline" label="Gender" value={val(user.gender)} />
          <Row
            icon="calendar-outline"
            label="Date of Birth"
            value={val(user.dob)}
          />
          <Row
            icon="water-outline"
            label="Blood Group"
            value={val(user.blood_group)}
          />
          <Row icon="leaf-outline" label="Caste" value={val(user.caste)} />
          <Row
            icon="school-outline"
            label="Education"
            value={val(user.education)}
          />
        </Section>

        {isAdvisor && (
          <Section title="Business / Professional Info">
            <Row
              icon="briefcase-outline"
              label="Business Name"
              value={val(user.business_name)}
            />
            <Row
              icon="map-outline"
              label="Business Address"
              value={val(user.business_address)}
            />
            <Row
              icon="information-circle-outline"
              label="Other"
              value={val(user.business_other)}
            />
            {/* <Row
              icon="ribbon-outline"
              label="Bar Council Reg. No."
              value={val(user.bar_council_registration_no)}
            /> */}
            <Row
              icon="time-outline"
              label="Experience"
              value={val(user.experience)}
            />
          </Section>
        )}

        <Section title="Social">
          <Row
            icon="link-outline"
            label="Social Link"
            value={val(user.social_link)}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Section wrapper ─────────────────────────────────────────────────────────
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

// ─── Row item ────────────────────────────────────────────────────────────────
const Row = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null;
}) => {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={16} color="#000" />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
};

export default UserAdvisorDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scroll: {
    paddingBottom: 40,
  },
  // ─── Hero ────────────────────────────────────────────────────────────────────
  heroCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: FONTS_Family.FontBold,
    color: '#000',
  },
  heroName: {
    fontSize: FONTS_SIZE.txt_16,
    fontFamily: FONTS_Family.FontBold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  advisorPill: {
    backgroundColor: '#fff',
  },
  userPill: {
    backgroundColor: '#333',
  },
  roleText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_12,
  },
  advisorRoleText: {
    color: '#000',
  },
  userRoleText: {
    color: '#ccc',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#555',
  },
  callBtnText: {
    color: '#fff',
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_14,
  },
  // ─── Section ─────────────────────────────────────────────────────────────────
  section: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  sectionTitle: {
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  // ─── Row ─────────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowIcon: {
    width: 28,
    marginTop: 1,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_11,
    color: '#999',
    marginBottom: 2,
  },
  rowValue: {
    fontFamily: FONTS_Family.FontRegular,
    fontSize: FONTS_SIZE.txt_14,
    color: '#1A1A1A',
  },
});
