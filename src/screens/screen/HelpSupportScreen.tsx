import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import APIWebCall from '../../common/APIWebCall';
import Header from '../../components/Header';
import { FONTS_Family } from '../../constants/Font';
import { COLORS } from '../../constants/Colors';

type HelpSupportPayload = {
  id: number;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const decodeHtmlEntities = (text: string) => {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const htmlToPlainText = (html: string) => {
  return decodeHtmlEntities(
    html
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\s*\/p\s*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\r/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
};

export default function HelpSupportScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [pageData, setPageData] = useState<HelpSupportPayload | null>(null);

  useEffect(() => {
    const fetchHelpSupport = async () => {
      setLoading(true);
      setErrorText('');

      try {
        const response = await APIWebCall.onPageContentAPICall(
          'help & support',
        );
        console.log('HELP SUPPORT RESPONSE =>', response);

        if (response?.status && response?.data) {
          setPageData(response.data);
        } else {
          setPageData(null);
          setErrorText(response?.message || 'Unable to load help content.');
        }
      } catch (error: any) {
        console.log('HELP SUPPORT ERROR =>', error);
        setPageData(null);
        setErrorText(error?.message || 'Unable to load help content.');
      } finally {
        setLoading(false);
      }
    };

    fetchHelpSupport();
  }, []);

  const descriptionText = useMemo(() => {
    return pageData?.description ? htmlToPlainText(pageData.description) : '';
  }, [pageData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={{ marginTop: 15 }} />
      <Header title="Help & Support" onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#3A7BFF" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {errorText ? (
              <Text style={styles.errorText}>{errorText}</Text>
            ) : (
              <Text style={styles.description}>{descriptionText}</Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    // paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1f2937',
    fontFamily: FONTS_Family.FontRegular,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#b91c1c',
    fontFamily: FONTS_Family.FontMedium,
  },
});
