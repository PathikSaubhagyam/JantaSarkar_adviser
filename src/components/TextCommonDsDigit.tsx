import * as React from 'react';
import { Text, TextStyle } from 'react-native';
import { FONTS_Family } from '../constants/Font';

interface ComponentNameProps {
  onClickText?: () => void;
  textViewStyle?: TextStyle;
  text: string | number;
  numberOfLines?: number;
}

const TextCommonDsDigit = (props: ComponentNameProps) => {
  return (
    <Text
      onPress={props.onClickText}
      allowFontScaling={false}
      style={[
        props.textViewStyle,
        { fontFamily: FONTS_Family.FontDSDigi }, // ✅ correct key
      ]}
      numberOfLines={props.numberOfLines}
    >
      {props.text}
    </Text>
  );
};

export default TextCommonDsDigit;
