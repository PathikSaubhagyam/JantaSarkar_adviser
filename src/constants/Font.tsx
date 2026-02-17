import { Platform } from 'react-native';

export const FONTS_Family = {
  FontExtraLight:
    Platform.OS === 'ios' ? 'Nunito-ExtraLight' : 'Nunito-ExtraLight', //200
  FontLight: Platform.OS === 'ios' ? 'Nunito-Light' : 'Nunito-Light', //300
  FontRegular: Platform.OS === 'ios' ? 'Nunito-Regular' : 'Nunito-Regular', //400
  FontMedium: Platform.OS === 'ios' ? 'Nunito-Medium' : 'Nunito-Medium', //500
  FontSemiBold: Platform.OS === 'ios' ? 'Nunito-SemiBold' : 'Nunito-SemiBold', //600
  FontBold: Platform.OS === 'ios' ? 'Nunito-Bold' : 'Nunito-Bold', //700
  FontExtraBold:
    Platform.OS === 'ios' ? 'Nunito-ExtraBold' : 'Nunito-ExtraBold', // 800
  FontDSDigi:
    // Platform.OS === 'ios' ? 'digital-7 (italic)' : 'digital-7 (italic)',
    Platform.OS === 'ios' ? 'DS-DIGI' : 'DS-DIGI',
  // Platform.OS === 'ios' ? 'digital-7 (mono)' : 'digital-7 (mono)',
};

export const FONTS_SIZE = {
  txt_4: 4,
  txt_8: 8,
  txt_9: 9,
  txt_10: 10,
  txt_11: 11,
  txt_12: 12,
  txt_13: 13,
  txt_14: 14,
  txt_15: 15,
  txt_16: 16,
  txt_17: 17,
  txt_18: 18,
  txt_20: 20,
  txt_21: 21,
  txt_22: 22,
  txt_24: 24,
  txt_25: 25,
  txt_26: 26,
  txt_27: 27,
  txt_28: 28,
  txt_30: 30,
  txt_35: 35,
  txt_40: 40,
  txt_45: 45,
  txt_50: 50,
  txt_60: 60,
  txt_80: 80,
  txt_90: 90,
};

const FontStyle = {
  FONTS_Family,
  FONTS_SIZE,
};

export default FontStyle;
