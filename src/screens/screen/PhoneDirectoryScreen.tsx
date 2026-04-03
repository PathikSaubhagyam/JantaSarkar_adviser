import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import SnackBarCommon from '../../components/SnackBarCommon';
import { FONTS_Family, FONTS_SIZE } from '../../constants/Font';
import APIWebCall from '../../common/APIWebCall';

const BW = {
  bg: '#F5F5F5',
  card: '#FFFFFF',
  black: '#000000',
  ink: '#111111',
  secondary: '#555555',
  muted: '#999999',
  border: '#E0E0E0',
  divider: '#EFEFEF',
  pill: '#F0F0F0',
};

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const CASTE_OPTIONS = ['General', 'OBC', 'SC', 'ST', 'EWS'];

const InfoChip = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.chip}>
    <Ionicons
      name={icon as any}
      size={11}
      color={BW.secondary}
      style={{ marginRight: 3 }}
    />
    <Text style={styles.chipText} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const PhoneDirectoryScreen = () => {
  const navigation = useNavigation<any>();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filterVisible, setFilterVisible] = useState(false);

  const [tempCaste, setTempCaste] = useState<string | null>(null);
  const [tempGender, setTempGender] = useState<string | null>(null);
  const [tempBiz, setTempBiz] = useState<string | null>(null);
  const [bizOpen, setBizOpen] = useState(false);
  const [bizItems, setBizItems] = useState<{ label: string; value: string }[]>(
    [],
  );

  const [appliedCaste, setAppliedCaste] = useState<string | null>(null);
  const [appliedGender, setAppliedGender] = useState<string | null>(null);
  const [appliedBiz, setAppliedBiz] = useState<string | null>(null);

  const appliedFiltersRef = useRef<{
    caste: string | null;
    gender: string | null;
    businessName: string | null;
  }>({ caste: null, gender: null, businessName: null });

  const activeFilterCount = [appliedCaste, appliedGender, appliedBiz].filter(
    Boolean,
  ).length;

  const fetchUsers = useCallback(
    async (
      page: number,
      caste: string | null,
      gender: string | null,
      businessName: string | null,
      append: boolean,
    ) => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await APIWebCall.onUserAdvisorListAPICall(
          page,
          caste,
          gender,
          businessName,
        );

        if (res?.status === true || res?.success === true) {
          const results = res?.results ?? [];

          setBizItems(prev => {
            const existing = new Set(prev.map((i: any) => i.value));
            const newEntries = results
              .filter(
                (u: any) => u.business_name && !existing.has(u.business_name),
              )
              .map((u: any) => ({
                label: u.business_name,
                value: u.business_name,
              }));
            return [...prev, ...newEntries];
          });

          setUsers(prev => (append ? [...prev, ...results] : results));
          setTotalPages(res?.total_pages ?? 1);
          setCurrentPage(res?.current_page ?? page);
          setTotalCount(res?.count ?? results.length);
        }
      } catch (error) {
        console.log('PHONE DIRECTORY ERROR => ', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchUsers(1, null, null, null, false);
  }, [fetchUsers]);

  const openFilterModal = () => {
    setTempCaste(appliedCaste);
    setTempGender(appliedGender);
    setTempBiz(appliedBiz);
    setBizOpen(false);
    setFilterVisible(true);
  };

  const handleApplyFilter = () => {
    setAppliedCaste(tempCaste);
    setAppliedGender(tempGender);
    setAppliedBiz(tempBiz);
    appliedFiltersRef.current = {
      caste: tempCaste,
      gender: tempGender,
      businessName: tempBiz,
    };
    setFilterVisible(false);
    fetchUsers(1, tempCaste, tempGender, tempBiz, false);
  };

  const handleClearModal = () => {
    setTempCaste(null);
    setTempGender(null);
    setTempBiz(null);
    setBizOpen(false);
  };

  const handleRemoveFilter = (type: 'caste' | 'gender' | 'biz') => {
    const nc = type === 'caste' ? null : appliedCaste;
    const ng = type === 'gender' ? null : appliedGender;
    const nb = type === 'biz' ? null : appliedBiz;
    setAppliedCaste(nc);
    setAppliedGender(ng);
    setAppliedBiz(nb);
    appliedFiltersRef.current = { caste: nc, gender: ng, businessName: nb };
    fetchUsers(1, nc, ng, nb, false);
  };

  const handleClearAllApplied = () => {
    setAppliedCaste(null);
    setAppliedGender(null);
    setAppliedBiz(null);
    appliedFiltersRef.current = {
      caste: null,
      gender: null,
      businessName: null,
    };
    fetchUsers(1, null, null, null, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && currentPage < totalPages) {
      const { caste, gender, businessName } = appliedFiltersRef.current;
      fetchUsers(currentPage + 1, caste, gender, businessName, true);
    }
  };

  const handleCall = async (phone: string) => {
    const number = String(phone ?? '').trim();
    if (!number) {
      SnackBarCommon.displayMessage({
        message: 'Phone number not available',
        isSuccess: false,
      });
      return;
    }

    try {
      const url = `tel:${number}`;
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        SnackBarCommon.displayMessage({
          message: 'Calling not supported on this device',
          isSuccess: false,
        });
        return;
      }
      await Linking.openURL(url);
    } catch {
      SnackBarCommon.displayMessage({
        message: 'Unable to start call',
        isSuccess: false,
      });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const initials = (item.full_name || item.phone_number || '?')
      .trim()
      .charAt(0)
      .toUpperCase();
    const phone =
      item.mobile_no ?? item.mobile ?? item.phone_no ?? item.phone ?? '';
    const isAdvisor = item.role === 'advisor' || item.is_advisor === true;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('UserAdvisorDetailScreen', { user: item })
        }
      >
        <View style={styles.cardTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.userName}>{item.full_name || 'Unknown'}</Text>
            <View style={styles.metaRow}>
              {isAdvisor && (
                <View style={styles.advisorPill}>
                  <Text style={styles.advisorPillText}>Advisor</Text>
                </View>
              )}
              {!!item.city && (
                <Text style={styles.cityText}>
                  <Ionicons
                    name="location-outline"
                    size={11}
                    color={BW.muted}
                  />{' '}
                  {item.city}
                </Text>
              )}
            </View>
          </View>

          {!!phone && (
            <TouchableOpacity
              onPress={() => handleCall(phone)}
              style={styles.callIcon}
              activeOpacity={0.7}
            >
              <Ionicons name="call-outline" size={18} color={BW.black} />
            </TouchableOpacity>
          )}
        </View>

        {(!!item.education || !!item.business_name) && (
          <View style={styles.chipsRow}>
            {!!item.education && (
              <InfoChip icon="school-outline" label={item.education} />
            )}
            {!!item.business_name && (
              <InfoChip icon="briefcase-outline" label={item.business_name} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFooter = () =>
    loadingMore ? (
      <ActivityIndicator
        size="small"
        color={BW.black}
        style={{ marginVertical: 14 }}
      />
    ) : null;

  const renderFilterModal = () => (
    <Modal
      visible={filterVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setFilterVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayDismiss}
          onPress={() => setFilterVisible(false)}
          activeOpacity={1}
        />

        <View style={styles.filterSheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter</Text>
            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color={BW.black} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.filterSectionLabel}>Caste</Text>
            <View style={styles.pillRow}>
              {CASTE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pill, tempCaste === opt && styles.pillActive]}
                  onPress={() => setTempCaste(tempCaste === opt ? null : opt)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      tempCaste === opt && styles.pillTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionLabel}>Gender</Text>
            <View style={styles.pillRow}>
              {GENDER_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pill, tempGender === opt && styles.pillActive]}
                  onPress={() => setTempGender(tempGender === opt ? null : opt)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      tempGender === opt && styles.pillTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {bizItems.length > 0 && (
              <>
                <Text style={styles.filterSectionLabel}>Business Name</Text>
                <View style={{ zIndex: 9000, marginBottom: 10 }}>
                  <DropDownPicker
                    open={bizOpen}
                    value={tempBiz}
                    items={bizItems}
                    setOpen={setBizOpen}
                    setValue={setTempBiz}
                    setItems={setBizItems}
                    placeholder="Select business..."
                    listMode="MODAL"
                    modalProps={{ animationType: 'slide' }}
                    searchable
                    searchPlaceholder="Search..."
                    style={styles.bizDropdown}
                    dropDownContainerStyle={styles.bizDropdownContainer}
                    searchContainerStyle={{ borderBottomColor: BW.border }}
                    searchTextInputStyle={{ color: BW.ink }}
                    placeholderStyle={{ color: BW.muted }}
                    labelStyle={{ color: BW.ink }}
                    listItemLabelStyle={{ color: BW.ink }}
                  />
                </View>
              </>
            )}
            <View style={{ height: 16 }} />
          </ScrollView>

          <View style={styles.sheetActions}>
            <TouchableOpacity
              style={styles.clearAllBtn}
              onPress={handleClearModal}
              activeOpacity={0.8}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApplyFilter}
              activeOpacity={0.8}
            >
              <Text style={styles.applyText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Phone Directory" onBackPress={() => navigation.goBack()} />

      <View style={styles.toolbar}>
        <Text style={styles.countText}>
          {loading
            ? 'Loading...'
            : `${totalCount > 0 ? totalCount : users.length} Members`}
        </Text>

        <TouchableOpacity
          onPress={openFilterModal}
          style={[
            styles.filterBtn,
            activeFilterCount > 0 && styles.filterBtnActive,
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={16}
            color={activeFilterCount > 0 ? BW.card : BW.black}
          />
          <Text
            style={[
              styles.filterBtnText,
              activeFilterCount > 0 && { color: BW.card },
            ]}
          >
            {activeFilterCount > 0
              ? `Filters (${activeFilterCount})`
              : 'Filter'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersBar}>
          {(
            [
              appliedCaste
                ? { label: appliedCaste, type: 'caste' as const }
                : null,
              appliedGender
                ? { label: appliedGender, type: 'gender' as const }
                : null,
              appliedBiz ? { label: appliedBiz, type: 'biz' as const } : null,
            ].filter(Boolean) as {
              label: string;
              type: 'caste' | 'gender' | 'biz';
            }[]
          ).map(f => (
            <View key={f.type} style={styles.activeChip}>
              <Text style={styles.activeChipText}>{f.label}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveFilter(f.type)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Ionicons name="close-circle" size={14} color={BW.secondary} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={handleClearAllApplied}>
            <Text style={styles.clearAllLink}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={BW.black}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="people-outline" size={52} color={BW.border} />
              <Text style={styles.emptyText}>No records found.</Text>
            </View>
          }
        />
      )}

      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default PhoneDirectoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BW.bg },
  loader: { marginTop: 50 },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: BW.card,
    borderBottomWidth: 1,
    borderBottomColor: BW.border,
  },
  countText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_13,
    color: BW.secondary,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BW.black,
    backgroundColor: 'transparent',
  },
  filterBtnActive: {
    backgroundColor: BW.black,
    borderColor: BW.black,
  },
  filterBtnText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_13,
    color: BW.black,
  },

  activeFiltersBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: BW.card,
    borderBottomWidth: 1,
    borderBottomColor: BW.divider,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BW.pill,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeChipText: {
    fontFamily: FONTS_Family.FontRegular,
    fontSize: FONTS_SIZE.txt_11,
    color: BW.ink,
  },
  clearAllLink: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_11,
    color: BW.secondary,
    textDecorationLine: 'underline',
    marginLeft: 2,
  },

  listContent: { paddingHorizontal: 16, paddingBottom: 28, paddingTop: 12 },
  emptyWrap: { marginTop: 80, alignItems: 'center', gap: 12 },
  emptyText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_14,
    color: BW.muted,
  },

  card: {
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: BW.card,
    borderWidth: 1,
    borderColor: BW.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BW.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_16,
    color: BW.card,
  },
  cardInfo: { flex: 1 },
  userName: {
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_14,
    color: BW.ink,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  advisorPill: {
    backgroundColor: BW.pill,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: BW.border,
  },
  advisorPillText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_11,
    color: BW.ink,
  },
  cityText: {
    fontFamily: FONTS_Family.FontRegular,
    fontSize: FONTS_SIZE.txt_11,
    color: BW.muted,
  },
  callIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BW.pill,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BW.border,
    marginLeft: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BW.divider,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BW.pill,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: {
    fontFamily: FONTS_Family.FontRegular,
    fontSize: FONTS_SIZE.txt_11,
    color: BW.secondary,
    maxWidth: 130,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  overlayDismiss: { flex: 1 },
  filterSheet: {
    backgroundColor: BW.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: BW.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_16,
    color: BW.ink,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BW.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSectionLabel: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_12,
    color: BW.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BW.border,
    backgroundColor: BW.card,
  },
  pillActive: {
    backgroundColor: BW.black,
    borderColor: BW.black,
  },
  pillText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_13,
    color: BW.ink,
  },
  pillTextActive: { color: BW.card },
  bizDropdown: {
    borderColor: BW.border,
    borderRadius: 10,
    backgroundColor: BW.card,
    minHeight: 46,
  },
  bizDropdownContainer: {
    borderColor: BW.border,
    borderRadius: 10,
    backgroundColor: BW.card,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BW.divider,
  },
  clearAllBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BW.border,
    alignItems: 'center',
  },
  clearAllText: {
    fontFamily: FONTS_Family.FontMedium,
    fontSize: FONTS_SIZE.txt_14,
    color: BW.secondary,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: BW.black,
    alignItems: 'center',
  },
  applyText: {
    fontFamily: FONTS_Family.FontBold,
    fontSize: FONTS_SIZE.txt_14,
    color: BW.card,
  },
});
