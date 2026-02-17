import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import TextCommonBold from './TextCommonBold';
import { activeOpacity } from '../constants/Utils';
import { COLORS } from '../constants/Colors';
import { FONTS_Family, FONTS_SIZE } from '../constants/Font';
import LinearGradient from 'react-native-linear-gradient';

const CommonButton = (props: any) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={props.btnStyle ?? styles.btnStyle}
      onPress={() => {
        console.log('✅ CommonButton clicked');
        props.onPress && props.onPress();
      }}
    >
      {props.child && props.child}
      <TextCommonBold
        text={props.text}
        textViewStyle={props.btnTextStyle ?? styles.btnTextStyle}
      />
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  btnTextStyle: {
    color: COLORS.white,
    fontSize: FONTS_SIZE.txt_18,
    textAlign: 'center',
    fontFamily: FONTS_Family.FontExtraLight,
  },
  btnStyle: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignSelf: 'flex-end',
    gap: 8,
    marginHorizontal: 10,
    // width: 150,
  },
});
