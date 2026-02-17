import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import TextCommonBold from './TextCommonBold';
import { COLORS } from '../constants/Colors';
import { FONTS_SIZE } from '../constants/Font';

const ToolBarBackButton = (props: any) => {
  return (
    <View style={styles.container}>
      {props.isHideBackButton == true ? null : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={props.onPressBackButton}
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <Image
            resizeMode="contain"
            source={require('../assets/images/back_icon.png')}
            style={styles.backImg}
          />
        </TouchableOpacity>
      )}

      <TextCommonBold text={props.text} textViewStyle={styles.btnTextStyle} />
    </View>
  );
};

export default ToolBarBackButton;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : 40,
    marginBottom: 10,
  },
  btnTextStyle: {
    color: COLORS.primary,
    fontSize: FONTS_SIZE.txt_20,
    textAlign: 'center',
  },
  backImg: {
    height: 18,
    width: 18,
    borderRadius: 10,
    alignSelf: 'center',
    tintColor: COLORS.colorDarkGrey,
  },
  // buttonStyle: { borderRadius: 20, height: 30, width: 30, marginTop: 20 },
});
