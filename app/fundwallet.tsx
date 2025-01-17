import {  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getFundAccountNo,
  getTransferHistory,
} from '@/utils/queries/accountQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import SubHeaderItem from '@/components/SubHeaderItem';
import { useNavigation, useRouter } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import TransferHistory from '@/tabs/TransferPaymentHistory';
import { COLORS, icons, SIZES } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from './loader';
import Button from '@/components/Button';
import * as ClipBoard from 'expo-clipboard';
import showToast from '@/utils/showToast';
import { formatDate } from '@/utils/helpers/formatDate';
import CustomModal from './custommodal';

const FundWallet = () => {
  const { token, userProfile, userAccount } = useAppSelector(
    (state) => state.auth
  );
  const { navigate,reset, goBack } = useNavigation<NavigationProp<any>>();
  const { dark, colors } = useTheme();
  const [showModal, setShowModal] = React.useState(false);
  const router = useRouter();
//  const { navigate, reset, goBack } = useNavigation<NavigationProp<any>>();
  const {
    data: transferData,
    isLoading: loadingTransfer,
    error: errorTransferData,
  } = useQuery({
    queryKey: ['transferHistory'],
    queryFn: () => getTransferHistory(token),
    enabled: !!token,
  });

  const {
    data: fundData,
    isLoading: loadingFund,
    error: errorFund,
    isError: isErrorFund,
    refetch: refetchFund,
  } = useQuery({
    queryKey: ['fundWallet'],
    queryFn: () => getFundAccountNo(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (isErrorFund) {
      setShowModal(true);
    }
  }, [isErrorFund]);

  const handleRetry = () => {
    setShowModal(false);
    refetchFund();
  };

  const handleGoBack = () => {
    setShowModal(false);
    router.replace('/(tabs)');
  };

  const handleCopyAccountNo = async () => {
    try {
      if (fundData?.data?.accountNumber) {
        await ClipBoard.setStringAsync(fundData.data.accountNumber);
        showToast({
          type: 'success',
          text1: 'Account number copied to clipboard',
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Failed to copy account number',
      });
    }
  };

  // const renderHeader = () => {
  //   return (
  //     <View style={styles.headerContainer}>
  //       <View style={styles.headerLeft}>
  //         <TouchableOpacity onPress={() => goBack()}>
  //           <Image
  //             source={icons.back}
  //             contentFit="contain"
  //             style={[
  //               styles.headerLogo,
  //               {
  //                 tintColor: dark ? COLORS.white : COLORS.greyscale900,
  //               },
  //             ]}
  //           />
  //         </TouchableOpacity>
  //         <Text
  //           style={[
  //             styles.headerTitle,
  //             {
  //               color: dark ? COLORS.white : COLORS.greyscale900,
  //             },
  //           ]}
  //         >
  //           In & Out Payment
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

  const renderTopContainer = () => {
    return (
      <>
        {/* Balance Section */}

        <View style={styles.topContainer}>
          <Text style={styles.mxtitle}>FUND WALLET
          </Text>
          <Text style={styles.balanceAmount}>₦{userAccount?.balance || 0}</Text>
          <Text style={styles.balanceText}>Current Balance</Text>
        </View>

        {/* Wallet Fund Section */}
        <View style={styles.walletFundSection}>
          {/* <Text
            style={{
              ...styles.walletTitle,
              color: dark ? COLORS.white : COLORS.greyscale900,
            }}
          >
            Fund your naira wallet
          </Text> */}
          <View
            style={{
              ...styles.walletDescription,

            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              HOW TO FUND YOUR WALLET
            </Text>

            <Text style={{ fontSize: 14, marginBottom: 10 }}>
              To make bill payments, fund your wallet by following these steps:
            </Text>

            <Text style={{ fontSize: 13, marginBottom: 5 }}>
              1. Copy the bank account details below.
            </Text>
            <Text style={{ fontSize: 13, marginBottom: 5 }}>
              2. Open your banking app and select VFD Microfinance Bank (VFD MFB).
            </Text>
            <Text style={{ fontSize: 13, marginBottom: 5 }}>
              3. Transfer your desired amount to the provided account name: Mx Bill Pay.
            </Text>
            <Text style={{ fontSize: 13, marginBottom: 5 }}>
              4. Wait 10–45 seconds to receive a notification and see the funds in your wallet.
            </Text>
            <Text style={{ fontSize: 13, marginBottom: 5 }}>
              5. If funds don’t appear within 5 minutes, visit the Help Center and contact Support.
            </Text>

            <Text style={{ marginTop: 5, fontSize: 13 }}>
              That’s it! Now you’re ready to pay bills with ease.
            </Text>
          </View>



        </View >
        {fundData?.data?.expiryDate && (
          <Text
            style={{
              color: COLORS.greeen,
              fontSize: 12,
              textAlign: 'center',
              fontWeight: '500',
              marginBottom: 0,
            }}
          >
            Account number is valid until{' '}
            {fundData?.data?.expiryDate &&
              formatDate(fundData?.data?.expiryDate)}
          </Text>
        )
        }

        {/* Bank Account Section */}
        <View style={styles.bankAccountBox}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.accountLabel}>Account No</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  ...styles.accountNumber,
                  color: COLORS.white,
                }}
              >
                {fundData?.data?.accountNumber}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyAccountNo}
              >
                <Image
                  source={icons.copy} // Replace with your copy icon path
                  style={styles.copyIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Bank Name</Text>
              <Text style={styles.value}>VFD Microfinance Bank</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Account Name</Text>
              <Text style={styles.value}>Mx Bill Pay</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderTransactionsHistory = () => {
    return (
      <View style={{ marginBottom: 8 }}>
        <SubHeaderItem
          title="Recent Transactions"
          navTitle="See all"
          onPress={() => navigate('inoutpaymenthistory')}
        />
        <View style={{ marginBottom: 12 }}>
          {transferData?.data && transferData.data.length > 0 && (
            <TransferHistory
              transferData={[...transferData?.data].splice(0, 2) || []}
            />
          )}
          {!transferData?.data ||
            (transferData?.data.length == 0 && (
              <Text
                style={{ color: COLORS.red, fontSize: 16, textAlign: 'center' }}
              >
                No recent transactions
              </Text>
            ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {(loadingTransfer || loadingFund) && <Loader />}
      <View style={[{ backgroundColor: colors.background }]}>
        {/* {renderHeader()} */}
        {renderTopContainer()}
        <View style={{ paddingHorizontal: 16 }}>
        <Button
          title="Go Back"
          onPress={() => {
            console.log('pressed');
            reset({ index: 0, routes: [{ name: 'tabs' }] });
            navigate('(tabs)');
          }}
          filled
        />
          {/* {renderTransactionsHistory()} */}
        </View>
      </View>
      <CustomModal
        modalVisible={showModal}
        setModalVisible={setShowModal}
        title={errorFund?.message || 'Error creating virtual account'}
        btnText="Retry"
        btn2Text="Go Back"
        onPress2={handleGoBack}
        onPress={handleRetry}
      />
    </SafeAreaView>
  );
};

export default FundWallet;

const styles = StyleSheet.create({
  bankAccountBox: {
    backgroundColor: '#0F0333', // Dark purple background
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  accountLabel: {
    color: '#FFFFFF', // White color
    fontWeight: 'bold',
    fontSize: 14,
  },
  accountNumber: {
    color: '#FFFFFF', // White color
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
  },
  label: {
    color: '#B0B0B0', // Light gray
    fontSize: 12,
  },
  value: {
    color: '#FFFFFF', // White color
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 2,
  },
  copyButton: {
    backgroundColor: '#0D0227', // Slightly darker purple
    padding: 8,
    borderRadius: 5,
  },
  copyIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF', // White icon color
  },
  area: {
    flex: 1,
    marginTop: 0,
    backgroundColor: COLORS.white,
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
  balanceAmount: {
    textAlign: 'center',
    fontSize: 28,
    marginTop: 4,
    fontFamily: 'extraBold',
    color: COLORS.white,
  },
  balanceText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'regular',
    color: COLORS.white,
    // marginBottom: 4,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  balanceBox: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'flex-start',
  },
  balanceTitle: {
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 4,
  },
  // balanceAmount: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  walletFundSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '17%',
    rowGap: 4,
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  walletDescription: {
    // fontSize: 16,
    marginTop: 14,
    textAlign: 'left',
    // fontWeight: '500',
    marginBottom: 24,
  },
  // bankAccountBox: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   backgroundColor: COLORS.primary,
  //   padding: 16,
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#e0e0e0',
  //   marginBottom: 24,
  //   marginHorizontal: 16,
  // },
  bankName: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  bankCharge: {
    fontSize: 12,
    marginTop: 4,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    gap: 4,
  },
  // accountNumber: {
  //   fontSize: 12,
  //   fontWeight: '400',
  // },
  // copyButton: {
  //   padding: 4,
  //   borderRadius: 4,
  // },
  // copyIcon: {
  //   width: 16,
  //   height: 16,
  // },
  withdrawBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  withdrawTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  withdrawFee: {
    fontSize: 12,
    marginTop: 4,
  },
  withdrawButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  withdrawButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
