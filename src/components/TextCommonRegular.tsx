import * as React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';

import { FONTS_Family } from '../constants/Font';

interface textCommonregularProps {
  onClickText?: () => void;
  textViewStyle: TextStyle;
  text: any;
  numberOfLines?: number;
}

const TextCommonRegular = (props: textCommonregularProps) => {
  return (
    <>
      <Text
        onPress={props.onClickText}
        allowFontScaling={false}
        adjustsFontSizeToFit={true}
        style={[props.textViewStyle, { fontFamily: FONTS_Family.FontRegular }]}
        numberOfLines={props.numberOfLines}
      >
        {props.text}
      </Text>
    </>
  );
};

export default TextCommonRegular;

const styles = StyleSheet.create({
  container: {},
});
