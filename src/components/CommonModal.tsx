import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTS_Family } from '../constants/Font';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

interface CommonModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: ModalType;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  visible,
  title,
  message,
  type = 'info',
  primaryText = 'OK',
  secondaryText,
  onPrimaryPress,
  onSecondaryPress,
}) => {
  const getColor = () => {
    switch (type) {
      case 'success':
        return '#22C55E';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* <View style={[styles.icon, { backgroundColor: getColor() }]} /> */}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            {secondaryText && onSecondaryPress && (
              <TouchableOpacity
                style={[styles.button, styles.secondary]}
                onPress={onSecondaryPress}
              >
                <Text style={styles.secondaryText}>{secondaryText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: getColor() }]}
              onPress={onPrimaryPress}
            >
              <Text style={styles.primaryText}>{primaryText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: FONTS_Family.Medium,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    fontFamily: FONTS_Family.Regular,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryText: {
    color: '#fff',
    fontFamily: FONTS_Family.Medium,
  },
  secondary: {
    backgroundColor: '#E5E7EB',
  },
  secondaryText: {
    color: '#333',
    fontFamily: FONTS_Family.Medium,
  },
});
