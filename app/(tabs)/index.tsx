import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, FONTS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { NavigationProp } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import SubHeaderItem from '@/components/SubHeaderItem';
import Category from '@/components/Category';
import { QueryClient, useQuery } from '@tanstack/react-query';
import {
  getBanks,
  getBillerCategories,
  getBillerItems,
  IBillerCategory,
} from '@/utils/queries/appQueries';
import Loader from '../loader';
import { authSliceActions, useAppSelector } from '@/store/slices/authSlice';
import { getBalance, getTransferHistory } from '@/utils/queries/accountQueries';
import TransferHistory from '@/tabs/TransferPaymentHistory';
import { usePusher } from '@/store/SocketContext';
// import { StatusBar } from 'expo-status-bar';
import { useAppStateContext } from '@/store/AppStateContext';
import { useDispatch } from 'react-redux';
import SlideComponent from '@/components/SlideComponent';
// import { useGlobalApis } from '@/store/GlobalApisContext';
import { CommonActions } from '@react-navigation/native';
const HomeScreen = () => {
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const { dark, colors } = useTheme();
  const queryClient = new QueryClient();
  const dispatch = useDispatch();
  const { channel } = usePusher();
  const { currentPage } = useAppStateContext();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true); // Preloader state
  const { data: billerCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['billCategories'],
    queryFn: () => getBillerCategories({ token }),
    enabled: !!token,
  });

  const {
    data: transactionsHistory,
    isLoading: isLoadingTransactions,
    isError: istransactionsError,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactionsHistory'],
    queryFn: () => getTransferHistory(token),
  });

  // console.log('index:', transactionsHistory);

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useQuery({
    queryKey: ['get Balance'],
    queryFn: () => {
      return getBalance(token)

    },
    refetchInterval: ({ state }) => {
      queryClient.invalidateQueries({ queryKey: ['get Balance'] });
      return 3000;
    },
    enabled: !!token,
  });

  useEffect(() => {
    // console.log(balance);
    if (balance) {
      dispatch(
        authSliceActions.setUserAccount({
          balance: balance.balance,
          totalIncome: balance.totalIncome,
          totalBillPayment: balance.totalBillPayment,
        })
      );
    }
  }, [balance]);
  useEffect(() => {
    const isAnyQueryLoading = isLoadingCategories || isLoadingTransactions || isLoadingBalance;
    setIsLoading(isAnyQueryLoading);
  }, [isLoadingCategories, isLoadingTransactions, isLoadingBalance]);
  useEffect(() => {
    if (token && !userProfile?.firstName) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'fillyourprofile' }], 
        })
      );
    }
  }, [token, userProfile, navigation]);
  const handleClickCategory = (category: IBillerCategory) => {
    if (!category) return;
    if (category.isCategory == 1) {
      navigate('billerproviders', { categoryData: category });
      return;
    }
    if (category.category == 'Deposit') {
      navigate('fundwallet');
      return;
    }
    if (category.category == 'History') {
      navigate('inoutpaymenthistory');
      return;
    }
  };

  // console.log('index rerendered');

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Image
          source={userProfile?.profilePicture || images.profile}
          contentFit="contain"
          style={styles.userIcon}
        />
        <Text style={[styles.title]}>{'MX BILL PAY'}</Text>
        <View style={styles.viewRight}>
          <TouchableOpacity onPress={() => navigate('notifications')}>
            <View>
              <Image
                source={icons.notification2}
                contentFit="contain"
                style={[styles.bellIcon, { tintColor: COLORS.grayscale200 }]}
              />
              {balance?.unreadNotification > 0 && (
                <View style={styles.redDot} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderOverlayLoader = () => (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
  const renderTopContainer = () => {
    return (
      <View style={styles.cardContainer}>
        {renderHeader()}
        <View style={{ alignItems: 'center', rowGap: 4, marginTop: 20 }}>
          <Text style={styles.balanceAmount}>
            ₦{balance?.balance ? balance.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00'}
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
              ₦{balance?.totalBillPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0.00'}
            </Text>
            <Text style={styles.balanceTextBottom}>Total Bill Payment</Text>
          </View>
          <View style={{ alignItems: 'center', rowGap: 3 }}>
            <Text style={styles.balanceAmountBottom}>
              ₦{balance?.totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '44.88'}
            </Text>
            <Text style={styles.balanceTextBottom}>Total Wallet Deposit</Text>
          </View>
        </View>
        {renderCategories()}
      </View>
    );
  };

  const renderCategories = () => {
    return (
      <View style={styles.categoryWrapper}>
        {billerCategories?.data && (
          <FlatList
            data={billerCategories?.data}
            keyExtractor={(item, index) => item.id.toString()}
            horizontal={false}
            numColumns={4} // Render four items per row
            columnWrapperStyle={{
              justifyContent: 'space-evenly',
            }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            style={styles.categoryList}
            renderItem={({ item, index }) => (
              <Category
                key={item.id}
                name={item.category}
                icon={item?.icon || icons.send}
                iconColor={item?.iconColor || colors.primary}
                backgroundColor={COLORS.grayscale100}
                onPress={() => handleClickCategory(item)}
              />
            )}
          />
        )}
      </View>
    );
  };

  const rederTransactionsHistory = () => {
    return (
      <View style={{ marginBottom: 2, marginTop: 130, paddingHorizontal: 16 }}>
        <SubHeaderItem
          title="Recent Transactions"
          navTitle="See all"
          onPress={() => navigate('inoutpaymenthistory')}
        />
        <View style={{ marginBottom: 2 }}>
          {transactionsHistory?.data && transactionsHistory.data.length > 0 ? (
            <TransferHistory
              transferData={[...transactionsHistory.data].splice(0, 2)}
            />
          ) : (
            <Text style={{ textAlign: 'center', ...FONTS.body3 }}>
              {istransactionsError
                ? transactionsError?.message || 'Error fetching transactions'
                : 'No recent transactions'}
            </Text>
          )}
        </View>


      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        {
          backgroundColor: dark ? COLORS.black : COLORS.grayscale200,
        },
      ]}
    >
      {isLoading ? renderOverlayLoader() : <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderTopContainer()}
        {rederTransactionsHistory()}
        <SlideComponent />
        {/* Uncomment the lines below if needed */}
        {/* {(isLoadingCategories || isLoadingTransactions || isLoadingBalance) && (
          <Loader />
        )} */}
      </ScrollView>}

    </SafeAreaView>
    // </View>
  );
};

// Add your styles here, same as before
const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
    // padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16, // Add padding for better scroll experience
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userIcon: {
    width: 34,
    height: 34,
    borderRadius: 32,
  },
  viewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeeting: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.grayscale200,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    // marginRight: 10,
    fontFamily: 'bold',
    color: '#dfa430',
  },
  viewNameContainer: {
    marginLeft: 12,
  },
  viewRight: {
    width: 34,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  cardContainer: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    zIndex: 1,
    paddingTop: 20,
    paddingBottom: 100,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    // rowGap: 16,
  },
  topCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.white,
    // marginBottom: 4,
  },
  cardNum: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.white,
  },
  cardIcon: {
    height: 45,
    width: 72,
  },
  // balanceContainer: {
  //   marginVertical: 16,
  // },
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
  bottomCardContainer: {
    width: '70%',
    marginHorizontal: 'auto',
    height: 90,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
  },
  categoryList: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.grayscale400,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 0,
    flex: 1,
    width: '100%',
    marginVertical: 'auto',
    height: 'auto',
  },
  categoryWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    top: '130%',
    paddingHorizontal: 14,
    left: 0,
    right: 0,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    position: 'absolute',
    top: -2,
    right: -2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.white,
  },
});

export default HomeScreen;
