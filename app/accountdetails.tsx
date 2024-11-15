import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransferHistory } from '@/utils/queries/accountQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import SubHeaderItem from '@/components/SubHeaderItem';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import TransferHistory from '@/tabs/TransferPaymentHistory';
import { COLORS, icons, SIZES } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from './loader';

const accountdetails = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { navigate, goBack } = useNavigation<NavigationProp<any>>();
  const { dark, colors } = useTheme();
  const {
    data: transferData,
    isLoading: loadingTransfer,
    error: errorTransfer,
  } = useQuery({
    queryKey: ['transferHistory'],
    queryFn: () => getTransferHistory(token),
    enabled: !!token,
  });

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => goBack()}>
            <Image
              source={icons.back}
              contentFit="contain"
              style={[
                styles.headerLogo,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            In & Out Payment
          </Text>
        </View>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity>
            <Image
              source={icons.moreCircle}
              contentFit='contain'
              style={[styles.searchIcon, {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  const rederTransactionsHistory = () => {
    return (
      <View style={{ marginBottom: 8 }}>
        <SubHeaderItem
          title="Recent Transactions"
          navTitle="See all"
          onPress={() => navigate('inoutpaymenthistory')}
        />
        <View style={{ marginBottom: 12 }}>
          <TransferHistory
            transferData={transferData?.data.splice(0, 2) || []}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {loadingTransfer && <Loader />}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <Text>accountdetails</Text>
      </View>
    </SafeAreaView>
  );
};

export default accountdetails;

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'bold',
    color: COLORS.black,
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
