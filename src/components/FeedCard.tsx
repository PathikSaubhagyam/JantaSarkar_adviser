import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/Colors';

export default function FeedCard({ item }) {
  return (
    <View style={styles.card}>
      {/* ===== HEADER ===== */}
      <View style={styles.headerRow}>
        {/* Profile Image + Name + Tag */}
        <View style={styles.userRow}>
          <Image
            source={{
              uri: item.profileImage || 'https://i.pravatar.cc/150?img=3',
            }}
            style={styles.profileImg}
          />

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.tag}>{item.tag}</Text>
          </View>
        </View>

        {/* 3 DOT MENU */}
        <TouchableOpacity>
          <Text style={styles.menuDots}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* ===== MESSAGE TEXT ===== */}
      {item.text ? <Text style={styles.message}>{item.text}</Text> : null}

      {/* ===== IMAGE ===== */}
      {item.type === 'image' && (
        <Image
          source={{ uri: item.fileUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* ===== PDF ===== */}
      {item.type === 'pdf' && (
        <View style={styles.pdfBox}>
          <View style={styles.pdfIconBox}>
            <Text style={{ fontSize: 16 }}>📄</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.pdfName}>{item.fileName}</Text>
            <Text style={styles.pdfSub}>2.4 MB • PDF</Text>
          </View>

          <Text style={{ fontSize: 18 }}>⬇</Text>
        </View>
      )}

      {/* ===== BOTTOM ACTIONS ===== */}
      <View style={styles.bottomRow}>
        {/* LIKE */}
        <View style={styles.actionRow}>
          <Text style={styles.likeIcon}>♡</Text>
          <Text style={styles.actionText}>{item.likes} Likes</Text>
        </View>

        {/* COMMENT */}
        <View style={styles.actionRow}>
          <Text style={styles.commentIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comments} Comments</Text>
        </View>

        {/* SHARE */}
        <TouchableOpacity>
          <Text style={styles.shareIcon}>⤴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },

  /* HEADER */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImg: {
    height: 45,
    width: 45,
    borderRadius: 25,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },

  tag: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
  },

  menuDots: {
    fontSize: 22,
    color: COLORS.textLight,
  },

  /* MESSAGE */
  message: {
    marginTop: 14,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
  },

  /* IMAGE */
  postImage: {
    marginTop: 14,
    height: 180,
    borderRadius: 14,
  },

  /* PDF */
  pdfBox: {
    marginTop: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  pdfIconBox: {
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  pdfName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },

  pdfSub: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },

  /* BOTTOM */
  bottomRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.textDark,
  },

  likeIcon: {
    fontSize: 18,
    color: '#FF6B6B',
  },

  commentIcon: {
    fontSize: 16,
  },

  shareIcon: {
    fontSize: 18,
    color: COLORS.textLight,
  },
});
