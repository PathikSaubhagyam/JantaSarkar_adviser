import * as React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { FONTS_Family } from '../constants/Font';

interface componentNameProps {
  onClickText?: () => void;
  textViewStyle: TextStyle;
  text: any;
  numberOfLines?: number;
}

const TextCommonSemiBold = (props: componentNameProps) => {
  return (
    <>
      <Text
        onPress={props.onClickText}
        allowFontScaling={false}
        adjustsFontSizeToFit={true}
        style={[props.textViewStyle, { fontFamily: FONTS_Family.FontSemiBold }]}
        numberOfLines={props.numberOfLines}
      >
        {props.text}
      </Text>
    </>
  );
};

export default TextCommonSemiBold;

const styles = StyleSheet.create({
  container: {},
});
