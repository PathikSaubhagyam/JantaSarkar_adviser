import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import TextCommonBold from './TextCommonBold';
import TextCommonSemiBold from './TextCommonSemiBold';
import { COLORS } from '../constants/Colors';
import { activeOpacity } from '../constants/Utils';

interface CommonModalProps {
  visible: boolean;
  onRequestClose: () => void;
  modelTitle: string;
  description: string;
  leftButtonText: string;
  rightButtonText: string;
  onPressLeftButton: () => void;
  onPressRightButton: () => void;
}

const CommanModelLogout: React.FC<CommonModalProps> = ({
  visible,
  onRequestClose,
  modelTitle,
  description,
  leftButtonText,
  rightButtonText,
  onPressLeftButton,
  onPressRightButton,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity style={styles.container} onPress={onRequestClose}>
        <TouchableWithoutFeedback>
          <View style={styles.content}>
            {/* Title */}
            <TextCommonBold text={modelTitle} textViewStyle={styles.title} />

            {/* Description */}
            <TextCommonSemiBold
              text={description}
              textViewStyle={styles.description}
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={activeOpacity}
                style={styles.leftButton}
                onPress={onPressLeftButton}
              >
                <TextCommonBold
                  text={leftButtonText}
                  textViewStyle={styles.btnText}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={activeOpacity}
                style={styles.rightButton}
                onPress={onPressRightButton}
              >
                <TextCommonBold
                  text={rightButtonText}
                  textViewStyle={[styles.btnText, { color: COLORS.white }]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default CommanModelLogout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '85%',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    color: COLORS.black,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  leftButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    alignItems: 'center',
  },
  rightButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: COLORS.colorRed,
    textAlign: 'center',
  },
});
