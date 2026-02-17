import * as React from 'react';
import { Text, View, StyleSheet, ImageStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

interface imageViewProps {
  style: ImageStyle;
  resizeMode: string;
  source: any;
}

const ImageView = (props: imageViewProps) => {
  const resizeMode = () => {
    let value;
    if (props.resizeMode === '' || props.resizeMode === undefined) {
      return FastImage.resizeMode.contain;
    }
    switch (props.resizeMode) {
      case 'contain':
        return (value = FastImage.resizeMode.contain);
        break;

      case 'cover':
        return (value = FastImage.resizeMode.cover);
        break;

      case 'stretch':
        return (value = FastImage.resizeMode.stretch);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <FastImage
        style={props.style ?? styles.container}
        source={props.source}
        resizeMode={resizeMode()}
      />
    </>
  );
};

export default ImageView;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
  },
});
