import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import {
  NavigationProp,
  StackActions,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import SubHeaderItem from '@/components/SubHeaderItem';
import { invoiceItems, services } from '@/data';
import Category from '@/components/Category';
import { useQuery } from '@tanstack/react-query';
import {
  getBanks,
  getBillerCategories,
  getBillerItems,
  IBillerCategory,
} from '@/utils/queries/appQueries';
import Loader from '../loader';
import { useAppSelector } from '@/store/slices/authSlice';
import {
  checkBvnStatus,
  generateBvnLinkAgain,
  getTransferHistory,
  verifyBvnStatus,
} from '@/utils/queries/accountQueries';
import CustomModal from '../custommodal';
import * as Linking from 'expo-linking';
import { authSliceActions } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import AccountOption from '@/components/AccountOption';
import TransferHistory from '@/tabs/TransferPaymentHistory';

type Nav = {
  navigate: (value: string) => void;
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();
  const [selectedCategory, setSelectedCategory] =
    React.useState<IBillerCategory | null>(null);
  const [isSelectedBankPayment, setIsSelectedBankPayment] =
    React.useState(false);
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const { dark, colors } = useTheme();

  const { data: billerCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['billCategories'],
    queryFn: () => getBillerCategories({ token }),
    enabled: !!token,
  });

  const {
    data: transferData,
    isLoading: loadingTransfer,
    error: errorTransfer,
  } = useQuery({
    queryKey: ['transferHistory'],
    queryFn: () => getTransferHistory(token),
    enabled: !!token,
  });

  const { data: banksData, isLoading: isLoadingBanks } = useQuery({
    queryKey: ['billerMethod'],
    queryFn: () => {
      if (isSelectedBankPayment) {
        return getBanks(token);
      }
    },
    enabled: isSelectedBankPayment,
  });

  useEffect(() => {
    if (banksData?.data) {
      navigate('transfertobankselectbank', { data: banksData?.data });
    }
  }, [banksData]);

  const handleClickCategory = (category: IBillerCategory) => {
    navigate('billerItems', { categoryData: category });
  };

  const handleNavigateToBankTransfer = () => {
    if (banksData?.data) {
      navigate('transfertobankselectbank', { data: banksData?.data });
      return;
    }
    setIsSelectedBankPayment(true);
  };

  const handleWalletTransfer = () => {
    navigate('wallettransfer');
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.viewLeft}>
          <Image
            source={userProfile?.profilePicture || icons.profile}
            contentFit="contain"
            style={styles.userIcon}
          />
          <View style={styles.viewNameContainer}>
            <Text style={styles.greeeting}>Good Morning👋</Text>
            <Text
              style={[
                styles.title,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              {userProfile?.firstName + ' ' + userProfile?.lastName}
            </Text>
          </View>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity onPress={() => navigate('notifications')}>
            <Image
              source={icons.notificationBell2}
              contentFit="contain"
              style={[
                styles.bellIcon,
                { tintColor: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.topCardContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => navigate('accountdetails')}
            activeOpacity={0.7}
          >
            <Text style={styles.username}>{'Fund Wallet'}</Text>
            {/* <Text style={styles.cardNum}>{userProfile?.accountNumber}</Text> */}
          </TouchableOpacity>
          <Image
            source={images.mxlogo}
            contentFit="contain"
            style={styles.cardIcon}
          />
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Your balance</Text>
          <Text style={styles.balanceAmount}>
            ₦
            {Number(userProfile?.accountBalance).toFixed(2).toString() ||
              '0.00'}
          </Text>
        </View>
        <View style={styles.bottomCardContainer}>
          <AccountOption
            iconName="bank"
            title="Bank Transfer"
            onPress={handleNavigateToBankTransfer}
          />
          <AccountOption
            iconName="wallet"
            title="Wallet Transfer"
            onPress={handleWalletTransfer}
          />
          <AccountOption
            iconName="swapUpDown"
            title="Transactions"
            onPress={() => navigate('inoutpaymenthistory')}
          />
        </View>
      </View>
    );
  };

  const renderCategories = () => {
    return (
      <View style={{ marginTop: 24, width: '100%' }}>
        {/* <View style={styles.bottomCategoryContainer}> */}
        {/* <SubHeaderItem
          title="Services"
          navTitle="See all"
          onPress={() => navigate('allservices')}
        /> */}
        {billerCategories?.data && (
          <FlatList
            data={billerCategories?.data}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            numColumns={3} // Render four items per row
            columnWrapperStyle={{ justifyContent: 'space-evenly' }}
            style={{
              marginTop: 0,
              flex: 1,
              // columnGap: 8,
              rowGap: 8,
              width: '100%',
            }}
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderCard()}
          {renderCategories()}
          {rederTransactionsHistory()}
        </ScrollView>
      </View>
      {(isLoadingBanks || isLoadingCategories || loadingTransfer) && <Loader />}
    </SafeAreaView>
  );
};

// Add your styles here, same as before
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
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
  viewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeeting: {
    fontSize: 12,
    fontFamily: 'regular',
    color: 'gray',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
  },
  viewNameContainer: {
    marginLeft: 12,
  },
  viewRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
  },
  bookmarkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  cardContainer: {
    width: SIZES.width - 32,
    height: 250,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    marginTop: 16,
    paddingHorizontal: 22,
  },
  topCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  balanceContainer: {
    marginVertical: 16,
  },
  balanceText: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.white,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontFamily: 'extraBold',
    color: COLORS.white,
  },
  bottomCardContainer: {
    width: '100%',
    height: 90,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
});

export default HomeScreen;
