import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/Colors';

const RequestCard = ({
  initials = 'NA',
  name = '',
  tag = '',
  tagColor = '#EEE',
  time = '',
  description = '',
  location = '',
  date = '',
  onAccept = () => {},
  onReject = () => {},
  showButtons = true,
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
            <Text numberOfLines={1} style={styles.name}>
              {name}
            </Text>

            {!!tag && (
              <View style={[styles.tag, { backgroundColor: tagColor }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            )}
          </View>
        </View>

        {!!time && <Text style={styles.time}>{time}</Text>}
      </View>

      {/* Description */}
      {!!description && (
        <Text numberOfLines={3} style={styles.desc}>
          {description}
        </Text>
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
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.rejectBtn}
            onPress={onReject}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.acceptBtn}
            onPress={onAccept}
          >
            <Text style={styles.acceptText}>Accept</Text>
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
    padding: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  tag: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },

  time: {
    fontSize: 12,
    color: COLORS.textGrey,
    marginLeft: 8,
  },

  desc: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textGrey,
    lineHeight: 20,
  },

  footerRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  footerText: {
    marginRight: 16,
    fontSize: 13,
    color: COLORS.textGrey,
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
    color: COLORS.textDark,
  },

  acceptText: {
    fontWeight: '600',
    color: COLORS.white,
  },
});
