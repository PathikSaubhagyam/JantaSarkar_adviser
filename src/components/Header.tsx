import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS_Family.FontExtraBold,
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  underline: {
    height: 3,
    backgroundColor: '#000000',
    width: 40,
    marginLeft: 16,
    marginTop: 4,
  },
});
