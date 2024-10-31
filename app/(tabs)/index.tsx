import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import { NavigationProp, useNavigationState } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import SubHeaderItem from '@/components/SubHeaderItem';
import { invoiceItems, services } from '@/data';
import Category from '@/components/Category';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getBillerCategories,
  getBillerItems,
} from '@/utils/queries/billPayment';
import Loader from '../loader';
import { useAppSelector } from '@/store/slices/authSlice';

type Nav = {
  navigate: (value: string) => void;
};

const HomeScreen = () => {
  const [categoryId, setCategoryId] = React.useState<string>('');
  const { token } = useAppSelector((state) => state.auth);
  const {
    data: categoryData,
    isPending: isPendingCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ['billCategories'],
    queryFn: () => getBillerCategories({ token }),
    staleTime: 0, // Data is considered stale immediately
    refetchOnWindowFocus: true, // Optional: refetch when the window is focused
  });
  const {
    data: billerItemsData,
    isPending: isPendingItems,
    error: errorItems,
  } = useQuery({
    queryKey: ['billCategories', categoryId],
    queryFn: () =>
      getBillerItems({
        categoryId: categoryId,
        token,
      }),
    enabled: categoryId != '',
  });
  const { dark, colors } = useTheme();
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();

  const currentIndex = useNavigationState(
    (state) => state.routes[state.index].name
  );
  useEffect(() => {
    if (billerItemsData?.data) {
      console.log('index page', billerItemsData?.data);
      // setParams({
      //   billerItems: billerItemsData?.data,
      // });
      navigate('customcateogorypage', { billerItems: billerItemsData?.data });
    }
  }, [billerItemsData]);

  const handleClickCategory = (id: string) => {
    if (categoryId == id && billerItemsData?.data) {
      navigate('customcateogorypage', { billerItems: billerItemsData?.data });
      return;
    }
    setCategoryId(id);
  };
  // useEffect(() => {
  //   const backPressEvent = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     //prevent going back to login screen
  //     () => {
  //       // console.log(currentIndex);
  //       console.log('back pressed');
  //       return true;
  //     }
  //   );

  //   return () => backPressEvent.remove();
  // }, []);

  console.log('category id', categoryId);

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.viewLeft}>
          <Image
            source={images.user1}
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
              Andrew Ainsley
            </Text>
          </View>
        </View>
        <View style={styles.viewRight}>
          <TouchableOpacity onPress={() => navigate('promoanddiscount')}>
            <Image
              source={icons.discount3}
              contentFit="contain"
              style={[
                styles.bookmarkIcon,
                { tintColor: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            />
          </TouchableOpacity>
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
  /**
   * Render card
   */
  const renderCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.topCardContainer}>
          <View>
            <Text style={styles.username}>Andrew Ainsley</Text>
            <Text style={styles.cardNum}>.... .... .... 3779</Text>
          </View>
          <Image
            source={icons.mastercard}
            contentFit="contain"
            style={styles.cardIcon}
          />
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Your balance</Text>
          <Text style={styles.balanceAmount}>$12,689</Text>
        </View>
        <View style={styles.bottomCardContainer}>
          <TouchableOpacity
            onPress={() => navigate('transfertobankselectbank')}
            style={styles.categoryContainer}
          >
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.send}
                contentFit="contain"
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('sendmoney')}
            style={styles.categoryContainer}
          >
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.sendMoney}
                contentFit="contain"
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('requestmoney')}
            style={styles.categoryContainer}
          >
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.arrowDownSquare}
                contentFit="contain"
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('inoutpaymenthistory')}
            style={styles.categoryContainer}
          >
            <View style={styles.categoryIconContainer}>
              <Image
                source={icons.swapUpDown}
                contentFit="contain"
                style={styles.categoryIcon}
              />
            </View>
            <Text style={styles.categoryText}>In & Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  /**
   * render category
   */
  const renderCategories = () => {
    return (
      <View>
        <SubHeaderItem
          title="Services"
          navTitle="See all"
          onPress={() => navigate('allservices')}
        />
        <FlatList
          data={categoryData?.data || []}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={4} // Render four items per row
          style={{ marginTop: 0 }}
          renderItem={({ item, index }) => (
            <Category
              key={item.id}
              name={item.category}
              icon={item?.icon || icons.send}
              iconColor={item?.iconColor || colors.primary}
              backgroundColor={dark ? COLORS.greyScale800 : COLORS.grayscale100}
              onPress={() => handleClickCategory(item.id.toString())}
            />
          )}
        />
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
        </ScrollView>
      </View>
      {isPendingCategories && <Loader />}
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
    height: 340,
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
    marginBottom: 8,
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
    marginVertical: 32,
  },
  balanceText: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.white,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
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
  categoryContainer: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    height: 52,
    width: 52,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    marginBottom: 4,
  },
  categoryIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
});

export default HomeScreen;
