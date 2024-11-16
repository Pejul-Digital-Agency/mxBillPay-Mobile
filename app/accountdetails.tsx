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
import * as ClipBoard from 'expo-clipboard';
import showToast from '@/utils/showToast';

const accountdetails = () => {
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const { navigate, goBack } = useNavigation<NavigationProp<any>>();
  const { dark, colors } = useTheme();

  const {
    data: transferData,
    isLoading: loadingTransfer,
    error: errorTransferData,
  } = useQuery({
    queryKey: ['transferHistory'],
    queryFn: () => getTransferHistory(token),
    enabled: !!token,
  });

  const handleCopyAccountNo = async () => {
    try {
      if (userProfile?.accountNumber) {
        await ClipBoard.setStringAsync(userProfile?.accountNumber);
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

  const renderTopContainer = () => {
    return (
      <>
        {/* Balance Section */}
        <View style={styles.row}>
          <View style={[styles.balanceBox]}>
            <Text
              style={{
                ...styles.balanceTitle,
                color: dark ? COLORS.secondaryWhite : COLORS.greyScale800,
              }}
            >
              Pending Balance
            </Text>
            <Text
              style={{
                ...styles.balanceAmount,
                color: dark ? COLORS.white : COLORS.black,
              }}
            >
              ₦{userProfile?.accountBalance || 0}
            </Text>
          </View>
          <View style={[styles.balanceBox]}>
            <Text
              style={{
                ...styles.balanceTitle,
                color: dark ? COLORS.secondaryWhite : COLORS.greyScale800,
              }}
            >
              Escrow Balance
            </Text>
            <Text
              style={{
                ...styles.balanceAmount,
                color: dark ? COLORS.white : COLORS.black,
              }}
            >
              ₦0
            </Text>
          </View>
        </View>

        {/* Wallet Fund Section */}
        <View style={styles.walletFundSection}>
          <Text
            style={{
              ...styles.walletTitle,
              color: dark ? COLORS.white : COLORS.greyscale900,
            }}
          >
            Fund your naira wallet
          </Text>
          <Text
            style={{
              ...styles.walletDescription,
              color: dark ? COLORS.secondaryWhite : COLORS.greyScale800,
            }}
          >
            Fund your Cardify Naira wallet by transferring Naira from any bank
            to your unique account(s) listed below.
          </Text>
        </View>

        {/* Bank Account Section */}
        <View style={styles.bankAccountBox}>
          <View>
            <Text
              style={{
                ...styles.bankName,
                color: dark ? COLORS.white : COLORS.greyscale900,
              }}
            >
              Vfd Microfinance Bank
            </Text>
            <Text
              style={{
                ...styles.bankCharge,
                color: dark ? COLORS.secondaryWhite : COLORS.greyScale800,
              }}
            >
              0.5% Charge
            </Text>
          </View>
          <View
            style={{
              ...styles.accountInfo,
              backgroundColor: dark ? COLORS.blackTie : COLORS.secondaryWhite,
            }}
          >
            <Text
              style={{
                ...styles.accountNumber,
                color: dark ? COLORS.white : COLORS.greyscale900,
              }}
              //   ref={accountNumberRef}
            >
              {userProfile?.accountNumber}
            </Text>
            <TouchableOpacity
              style={{
                ...styles.copyButton,
                backgroundColor: dark ? COLORS.blackTie : COLORS.secondaryWhite,
              }}
              onPress={handleCopyAccountNo}
            >
              <Image
                source={icons.copy}
                contentFit="contain"
                style={styles.copyIcon}
                tintColor={dark ? COLORS.white : COLORS.greyscale900}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Withdraw Section */}
        <View style={styles.withdrawBox}>
          <View>
            <Text
              style={{
                ...styles.withdrawTitle,
                color: dark ? COLORS.white : COLORS.greyscale900,
              }}
            >
              Withdraw NGN
            </Text>
            <Text
              style={{
                ...styles.withdrawFee,
                color: dark ? COLORS.secondaryWhite : COLORS.greyScale800,
              }}
            >
              Processor fee applies
            </Text>
          </View>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
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
        {renderTopContainer()}
        {renderTransactionsHistory()}
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
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  walletFundSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '22%',
    rowGap: 4,
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  walletDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
  bankAccountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
  },
  bankName: {
    fontSize: 14,
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
  accountNumber: {
    fontSize: 12,
    fontWeight: '400',
  },
  copyButton: {
    padding: 4,
    borderRadius: 4,
  },
  copyIcon: {
    width: 16,
    height: 16,
  },
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
