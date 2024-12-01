import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons } from '@/constants';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { ScrollView } from 'react-native-virtualized-view';
import { NavigationProp } from '@react-navigation/native';
// import {
//   InOutPaymentMyHistory,
//   InOutPaymentRequested,
//   InOutPaymentScheduled,
// } from '@/tabs';
import { useQuery } from '@tanstack/react-query';
import {
  getBillPaymentHistory,
  getTransferHistory,
} from '@/utils/queries/accountQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import TransferHistory from '@/tabs/TransferPaymentHistory';
import BillPaymentHistory from '@/tabs/BillPaymentHistory';
import Loader from './loader';

type Tab = 'Transfer History' | 'Bill Payments';

const InOutPaymentHistory = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { token } = useAppSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState<Tab>('Transfer History');
  // const {
  //   data: billPaymentData,
  //   isLoading: loadingBill,
  //   error: errorBill,
  // } = useQuery({
  //   queryKey: ['billPayments'],
  //   queryFn: () => getBillPaymentHistory(token),
  // });
  const {
    data: transferData,
    isLoading: loadingTransfer,
    error: errorTransfer,
  } = useQuery({
    queryKey: ['transactionsHistory'],
    queryFn: () => getTransferHistory(token),
  });

  const renderContent = () => {
    switch (selectedTab) {
      case 'Transfer History':
        return <TransferHistory transferData={transferData?.data || []} />;
      // case 'Bill Payments':
      //   return (
      //     <BillPaymentHistory billPaymentData={billPaymentData?.data || []} />
      //   );
      default:
        return null;
    }
  };
  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {loadingTransfer && <Loader />}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewContainer}>
            <View
              style={[
                styles.tabContainer,
                {
                  backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                },
              ]}
            >
              {['Transfer History', 'Bill Payments'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab as Tab)}
                  style={[
                    styles.tabButton,
                    selectedTab === tab && styles.activeTabButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      selectedTab === tab && styles.activeTabButtonText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.contentContainer}>{renderContent()}</View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

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
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12,
  },
  viewContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'bold',
  },
  activeTabButtonText: {
    color: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: COLORS.black,
  },
});

export default InOutPaymentHistory;
