import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { FONTS_Family, FONTS_SIZE } from '../constants/Font';
import { COLORS } from '../constants/Colors';
import TextCommonSemiBold from './TextCommonSemiBold';
import TextCommonMedium from './TextCommonMedium';

interface TextInputProps {
  containerStyle?: ViewStyle;
  style?: TextStyle;
  placeholder: string;
  placeholderTextColor?: String;
  onChangeText: (text: string) => void;
  value: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  editable?: boolean;
  desheight?: string;
  child1?: any;
  child2?: any;
  onPressIn?: () => void;
  placeholderColor?: string;
  errText?: any;
  textDisabled?: boolean;
  onTouchStart?: () => void;
  maxLength?: number;
}

const TextInputView = (props: TextInputProps) => {
  return (
    <>
      <View style={props.containerStyle ?? styles.textView}>
        {props.child1 && <>{props.child1}</>}
        <TextInput
          style={
            props.style ?? [
              styles.textInput,
              {
                color: props.textDisabled ? COLORS.gray : COLORS.black,
              },
            ]
          }
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderColor ?? COLORS.gray}
          onChangeText={props.onChangeText}
          value={props.value}
          secureTextEntry={props.secureTextEntry}
          keyboardType={props.keyboardType ?? 'default'}
          returnKeyType={'done'}
          editable={props.editable ?? true}
          multiline={props.desheight === 'des'}
          onPressIn={props.onPressIn}
          onTouchStart={props.onTouchStart}
          maxLength={props.maxLength}
        />
        {props.child2 && <>{props.child2}</>}
      </View>
      {props?.errText && (
        <TextCommonMedium
          text={props?.errText}
          textViewStyle={styles.errText}
        />
      )}
    </>
  );
};

export default TextInputView;

const styles = StyleSheet.create({
  errText: {
    color: COLORS.colorRed,
    fontSize: 12,
    paddingLeft: 2,
  },
  textView: {
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: "space-between",
    // backgroundColor: '',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    backgroundColor: COLORS.white,
    gap: 10,
  },
  textInput: {
    margin: 0,
    padding: 0,
    fontSize: FONTS_SIZE.txt_14,
    // fontWeight: '400',
    flex: 1,
    fontFamily: FONTS_Family.FontMedium,
  },
});
