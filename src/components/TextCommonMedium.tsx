import * as React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';

import { FONTS_Family } from '../constants/Font';

interface textCommonMediumProps {
  onClickText?: () => void;
  textViewStyle: TextStyle;
  text: any;
  numberOfLines?: number;
}

const TextCommonMedium = (props: textCommonMediumProps) => {
  return (
    <>
      <Text
        onPress={props.onClickText}
        allowFontScaling={false}
        adjustsFontSizeToFit={true}
        style={[props.textViewStyle, { fontFamily: FONTS_Family.FontMedium }]}
        numberOfLines={props.numberOfLines}
      >
        {props.text}
      </Text>
    </>
  );
};

export default TextCommonMedium;

const styles = StyleSheet.create({
  container: {},
});
