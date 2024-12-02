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
import { QueryClient, useQuery } from '@tanstack/react-query';
import {
  getBalance,
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
  // const { token } = useAppSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState<Tab>('Transfer History');
  const { token, userProfile } = useAppSelector((state) => state.auth);

  // const {
  //   data: billPaymentData,
  //   isLoading: loadingBill,
  //   error: errorBill,
  // } = useQuery({
  //   queryKey: ['billPayments'],
  //   queryFn: () => getBillPaymentHistory(token),
  // });
  const queryClient = new QueryClient();
  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useQuery({
    queryKey: ['get Balance'],
    queryFn: () => getBalance(token),
    refetchInterval: () => {
      queryClient.invalidateQueries({ queryKey: ['get Balance'] });
      return 3000;
    },
    enabled: !!token,
  });
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
      <View style={styles.cardContainer}>
      {/* {renderHeader()} */}
      <View style={{ alignItems: 'center', rowGap: 4, marginTop: 20 }}>
        <Text style={styles.balanceAmount}>
          ₦{balance?.balance.toFixed(2) || '0.00'}
        </Text>
        <Text style={styles.balanceText}>Current balance</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginTop: 8,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ alignItems: 'center', rowGap: 3 }}>
          <Text style={styles.balanceAmountBottom}>
            ₦{balance?.totalBillPayment.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.balanceTextBottom}>Total Bill Payment</Text>
        </View>
        <View style={{ alignItems: 'center', rowGap: 3 }}>
          <Text style={styles.balanceAmountBottom}>
            ₦{balance?.totalIncome.toFixed(2) || '44.88'}
          </Text>
          <Text style={styles.balanceTextBottom}>Total Wallet Deposit</Text>
        </View>
      </View>
      {/* {renderCategories()} */}
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
              {/* {['Transfer History', 'Bill Payments'].map((tab) => (
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
              ))} */}
            </View>
            <View style={styles.contentContainer}>{renderContent()}</View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    zIndex: 1,
    paddingTop: 20,
    paddingBottom: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    // rowGap: 16,
  },
  balanceText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.white,
    // marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontFamily: 'extraBold',
    color: COLORS.white,
  },
  balanceTextBottom: {
    fontSize: 10,
    fontFamily: 'regular',
    color: COLORS.white,
    // marginBottom: 4,
  },
  balanceAmountBottom: {
    fontSize: 20,
    fontFamily: 'regular',
    color: COLORS.white,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // padding: 16,
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
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 18,
    color: COLORS.black,
  },
  topContainer: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    zIndex: 1,
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 0,
  },
  //for mx bill payment title
  mxtitle: {
    textAlign: 'center',
    fontSize: 19,
    marginTop: 4,
    fontWeight: '500',
    textTransform: 'uppercase',

    fontFamily: 'regular',
    color: 'orange',
    // marginBottom: 4,
  },
  // balanceAmount: {
  //   textAlign: 'center',
  //   fontSize: 28,
  //   marginTop: 4,
  //   fontFamily: 'extraBold',
  //   color: COLORS.white,
  // },
  // balanceText: {
  //   textAlign: 'center',
  //   fontSize: 12,
  //   marginTop: 4,
  //   fontFamily: 'regular',
  //   color: COLORS.white,
  //   // marginBottom: 4,
  // },
});

export default InOutPaymentHistory;
