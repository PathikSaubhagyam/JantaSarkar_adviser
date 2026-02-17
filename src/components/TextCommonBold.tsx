import * as React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';

import { FONTS_Family } from '../constants/Font';

interface componentNameProps {
  onClickText?: () => void;
  textViewStyle: TextStyle;
  text: any;
  numberOfLines?: number;
}

const TextCommonBold = (props: componentNameProps) => {
  return (
    <>
      <Text
        onPress={props.onClickText}
        allowFontScaling={false}
        style={[props.textViewStyle, { fontFamily: FONTS_Family.FontBold }]}
        numberOfLines={props.numberOfLines}
      >
        {props.text}
      </Text>
    </>
  );
};

export default TextCommonBold;

const styles = StyleSheet.create({
  container: {},
});
