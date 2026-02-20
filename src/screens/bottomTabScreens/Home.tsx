import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/Colors';
import RequestCard from '../../components/RequestCard';
import { BASE_URL, DOBFormat } from '../../constants/Utils';
import {
  onAdvisorComplaintsAPICall,
  onAdvisorHistoryAPICall,
  onAdvisorOngoingAPICall,
  onApproveComplaintAPICall,
  onComplaintCancelAPICall,
  onCompletedComplaintAPICall,
  onRequestRejectAPICall,
} from '../../common/APIWebCall';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import SnackBarCommon from '../../components/SnackBarCommon';
import TextCommonMedium from '../../components/TextCommonMedium';
import { FONTS_SIZE } from '../../constants/Font';
import TextCommonBold from '../../components/TextCommonBold';
const { width } = Dimensions.get('window');
const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={{}}>
        <TextCommonBold
          text={'Comming Soon'}
          textViewStyle={{ fontSize: FONTS_SIZE.txt_18 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
