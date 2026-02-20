import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/Colors';
import { FONTS_SIZE } from '../constants/Font';
import TextCommonBold from './TextCommonBold';
import TextCommonMedium from './TextCommonMedium';
import TextCommonRegular from './TextCommonRegular';

const RequestCard = ({
  initials = 'NA',
  name = '',
  department = '',
  description_issue = '',
  authority_person_name = '',
  tag = '',
  tagColor = '#EEE',
  time = '',
  description = '',
  location = '',
  date = '',
  onAccept = () => {},
  onReject = () => {},
  acceptLabel = 'Accept',
  rejectLabel = 'Reject',
  showButtons = true,
  showCancelButton = true,
}) => {
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.nameWrapper}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TextCommonBold text={name} textViewStyle={styles.name} />
              {!!time && (
                <TextCommonMedium text={time} textViewStyle={styles.time} />
              )}
            </View>

            <TextCommonMedium
              text={department}
              textViewStyle={{
                fontSize: FONTS_SIZE.txt_14,
                color: COLORS.black,
              }}
            />

            {!!tag && (
              <View style={[styles.tag, { backgroundColor: tagColor }]}>
                <TextCommonMedium text={tag} textViewStyle={styles.tagText} />
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <TextCommonMedium
          text={'Consignee Officer : '}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_14,
            color: COLORS.black,
            marginTop: 5,
          }}
        />
        <TextCommonRegular
          text={authority_person_name}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_14,
            color: COLORS.black,
            marginTop: 5,
          }}
        />
      </View>

      {description_issue && (
        <TextCommonRegular
          text={description_issue}
          textViewStyle={{
            fontSize: FONTS_SIZE.txt_14,
            color: COLORS.black,
            marginTop: 5,
          }}
        />
      )}
      {/* Description */}

      {!!description && (
        <TextCommonRegular
          text={description}
          numberOfLines={3}
          textViewStyle={styles.desc}
        />
      )}

      {/* Footer */}
      {(location || date) && (
        <View style={styles.footerRow}>
          {!!location && <Text style={styles.footerText}>📍 {location}</Text>}
          {!!date && <Text style={styles.footerText}>📅 {date}</Text>}
        </View>
      )}

      {/* Buttons */}
      {showButtons && (
        <View style={styles.btnRow}>
          {/* Cancel button */}
          {showCancelButton && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.rejectBtn}
              onPress={onReject}
            >
              <Text style={styles.rejectText}>{rejectLabel}</Text>
            </TouchableOpacity>
          )}

          {/* Complete button always show */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.acceptBtn,
              !showCancelButton && { marginLeft: 0, flex: 1 },
            ]}
            onPress={onAccept}
          >
            <Text style={styles.acceptText}>{acceptLabel}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 8,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: COLORS.colorLightGray,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftRow: {
    flexDirection: 'row',
    flex: 1,
  },

  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#E8EEF9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  nameWrapper: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontSize: FONTS_SIZE.txt_16,
    color: COLORS.black,
  },

  tag: {
    marginTop: 4,
    alignSelf: 'flex-start',
    // paddingHorizontal: 15,
    padding: 5,
    // paddingVertical: 4,
    borderRadius: 5,
  },

  tagText: {
    fontSize: FONTS_SIZE.txt_12,
  },

  time: {
    fontSize: 12,
    color: COLORS.gry_text,
    marginLeft: 8,
  },

  desc: {
    marginTop: 12,
    fontSize: FONTS_SIZE.txt_14,
    color: COLORS.gry_text,
    lineHeight: 20,
  },

  footerRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  footerText: {
    marginRight: 16,
    fontSize: FONTS_SIZE.txt_15,
    color: COLORS.gry_text,
  },

  btnRow: {
    flexDirection: 'row',
    marginTop: 16,
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: COLORS.rejectBg || '#EEE',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },

  rejectText: {
    fontWeight: '600',
    color: COLORS.black,
  },

  acceptText: {
    fontWeight: '600',
    color: COLORS.white,
  },
});
