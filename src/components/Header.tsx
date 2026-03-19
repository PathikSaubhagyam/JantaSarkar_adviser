import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS_Family } from '../constants/Font';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
};

export default function Header({
  title,
  onBackPress,
  showBackButton = true,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {showBackButton ? (
          <Pressable style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="chevron-back" size={22} color="#1f2937" />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#1f2937',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: FONTS_Family.FontExtraBold,
    color: '#1f2937',
  },
  underline: {
    height: 3,
    backgroundColor: '#3A7BFF',
    width: 40,
    marginTop: 8,
  },
});
