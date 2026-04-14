import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { FONTS_Family, FONTS_SIZE } from '../constants/Font';

type DropdownItem = {
  label: string;
  value: string | number;
};

type CustomDropdownProps = {
  items: DropdownItem[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  modalTitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  disabled?: boolean;
  onOpen?: () => void | Promise<void>;
  containerStyle?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  valueLabelFormatter?: (value: string | number | null) => string;
};

const CustomDropdown = ({
  items,
  value,
  onChange,
  placeholder = 'Select option',
  modalTitle = 'Select Option',
  searchable = true,
  searchPlaceholder = 'Search',
  loading = false,
  disabled = false,
  onOpen,
  containerStyle,
  triggerStyle,
  valueLabelFormatter,
}: CustomDropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedLabel = useMemo(() => {
    const matched = items.find(item => item.value === value);
    if (matched) {
      return matched.label;
    }

    if (valueLabelFormatter) {
      return valueLabelFormatter(value);
    }

    if (value === null || value === undefined || value === '') {
      return '';
    }

    return String(value);
  }, [items, value, valueLabelFormatter]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!searchable || !query) {
      return items;
    }

    return items.filter(
      item =>
        item.label.toLowerCase().includes(query) ||
        String(item.value).toLowerCase().includes(query),
    );
  }, [items, searchable, searchQuery]);

  const openPicker = () => {
    if (disabled) {
      return;
    }

    setVisible(true);
    if (onOpen) {
      onOpen();
    }
  };

  const closePicker = () => {
    setVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.trigger,
          disabled && styles.triggerDisabled,
          triggerStyle,
        ]}
        onPress={openPicker}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedLabel && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {selectedLabel || placeholder}
        </Text>
        <Text style={styles.arrowText}>v</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closePicker}
      >
        <View style={styles.overlay}>
          <View style={styles.sheetCard}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={closePicker}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            {searchable ? (
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor="#8A8A8A"
                style={styles.searchInput}
              />
            ) : null}

            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color="#1a1a1a" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredItems}
                keyExtractor={item => String(item.value)}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => {
                  const isSelected = value === item.value;

                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.itemRow,
                        isSelected && styles.itemRowSelected,
                      ]}
                      onPress={() => {
                        onChange(item.value);
                        closePicker();
                      }}
                    >
                      <View style={styles.itemLeftWrap}>
                        {/* <View
                          style={[
                            styles.indexBadge,
                            isSelected && styles.indexBadgeSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.indexText,
                              isSelected && styles.indexTextSelected,
                            ]}
                          >
                            {index + 1}
                          </Text>
                        </View> */}

                        <Text
                          style={[
                            styles.itemText,
                            isSelected && styles.itemTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {item.label}
                        </Text>
                      </View>

                      {isSelected ? (
                        <Text style={styles.selectedTag}>Selected</Text>
                      ) : (
                        <View style={styles.itemDot} />
                      )}
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                  <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>No matching result</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  trigger: {
    borderColor: '#DCDCDC',
    borderWidth: 1.2,
    borderRadius: 10,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerDisabled: {
    backgroundColor: '#F4F4F4',
  },
  triggerText: {
    flex: 1,
    color: '#1a1a1a',
    fontSize: FONTS_SIZE.txt_14,
    fontFamily: FONTS_Family.FontMedium,
  },
  placeholderText: {
    color: '#8A8A8A',
  },
  disabledText: {
    color: '#9F9F9F',
  },
  arrowText: {
    color: '#444444',
    fontSize: 14,
    fontFamily: FONTS_Family.FontBold,
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 16,
    maxHeight: '76%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sheetTitle: {
    color: '#111111',
    fontSize: 18,
    fontFamily: FONTS_Family.FontBold,
  },
  closeText: {
    color: '#333333',
    fontSize: 14,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  searchInput: {
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: 11,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    minHeight: 44,
    color: '#1a1a1a',
    fontFamily: FONTS_Family.FontMedium,
    marginBottom: 12,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#666666',
    fontSize: 13,
    fontFamily: FONTS_Family.FontMedium,
  },
  listContent: {
    paddingBottom: 6,
  },
  itemRow: {
    minHeight: 56,
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  itemRowSelected: {
    backgroundColor: '#F6F6F6',
    borderColor: '#1a1a1a',
  },
  itemLeftWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  indexBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadgeSelected: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  indexText: {
    color: '#3A3A3A',
    fontSize: 12,
    fontFamily: FONTS_Family.FontSemiBold,
  },
  indexTextSelected: {
    color: '#FFFFFF',
  },
  itemText: {
    flex: 1,
    color: '#1f1f1f',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },
  itemTextSelected: {
    color: '#111111',
    fontFamily: FONTS_Family.FontBold,
  },
  selectedTag: {
    color: '#111111',
    fontSize: 12,
    fontFamily: FONTS_Family.FontSemiBold,
    marginLeft: 8,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginRight: 6,
    marginLeft: 8,
  },
  separator: {
    height: 8,
  },
  emptyWrap: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: FONTS_Family.FontMedium,
  },
});
