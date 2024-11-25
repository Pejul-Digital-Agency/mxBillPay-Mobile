import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons } from '@/constants';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  getBillerItemDetails,
  getBillerItems,
  IBillerCategory,
  IBillerItem,
  IBillerItemDetails,
  IProviderData,
} from '@/utils/queries/appQueries';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import Loader from './loader';
import { IBillerItemsList } from '@/utils/queries/appQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import { darkColors } from '@/theme/colors';

type Nav = {
  navigate: (value: number) => void;
};
const BillerItems = () => {
  const route = useRoute<RouteProp<any>>();
  if (!route.params || Object.keys(route.params).length == 0)
    return router.push('/(tabs)');
  const { token } = useAppSelector((state) => state.auth);
  const {
    categoryData,
    providerData,
  }: { categoryData: IBillerCategory; providerData: IProviderData } =
    route.params as any;
  const { colors, dark } = useTheme();
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();
  const {
    data: billerItemsData,
    isLoading: isPendingItems,
    error: errorItems,
  } = useQuery({
    queryKey: ['billCategories', categoryData?.id],
    queryFn: () =>
      getBillerItems({
        categoryId: categoryData?.id.toString() as string,
        providerId: providerData?.id.toString() as string,
        token,
      }),
    enabled: categoryData != null || providerData != null,
  });

  const handleClickItem = (id: number) => {
    navigate('billreviewsummary', { itemId: id.toString() });
  };

  // console.log(billerItemsData);
  // error && console.log(error);

  const renderListItem = ({ id, logo, paymentitemname }: IBillerItem) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.itemContainer,
          backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
        }}
        onPress={() => handleClickItem(id)}
      >
        <Image
          source={logo}
          contentFit="cover"
          style={{
            ...styles.itemImage,
            tintColor: dark ? COLORS.white : COLORS.greyscale900,
          }}
        />
        <Text
          style={{
            ...styles.itemName,
            color: dark ? COLORS.white : COLORS.greyscale900,
          }}
        >
          {paymentitemname}
        </Text>
        <View style={styles.itemRow}>
          <Text
            style={{
              ...styles.itemCashbackText,
              color: dark ? COLORS.greyscale300 : COLORS.greyscale600,
            }}
          >
            1% Cashback
          </Text>
          <View style={styles.itemStatRow}>
            <Image
              source={icons.upOutlined}
              contentFit="contain"
              style={styles.itemStatImage}
            />
            <Text style={styles.itemStatText}>5</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={billerItemsData?.data.itemList || []}
        renderItem={({ item }) => renderListItem(item)}
        style={{ gap: 12 }}
        keyExtractor={(item, index) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 12,
          flexDirection: 'row',
        }}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {isPendingItems && <Loader />}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={billerItemsData?.data?.category.category || ''} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewContainer}>
            <View style={styles.iconContainer}>
              <Image
                source={billerItemsData?.data?.category?.icon || icons.send}
                contentFit="contain"
                style={styles.icon}
                tintColor={billerItemsData?.data?.category?.iconColor}
              />
            </View>
            <Text
              style={[
                styles.title,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Choose category of {billerItemsData?.data?.category?.category}{' '}
              bills
            </Text>
            <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: dark
                    ? COLORS.greyscale900
                    : COLORS.grayscale200,
                },
              ]}
            />
          </View>
          {renderList()}
        </ScrollView>
      </View>
      {isPendingItems && <Loader />}
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
  iconContainer: {
    height: 124,
    width: 124,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: darkColors ? COLORS.greyScale800 : COLORS.grayscale100,
  },
  icon: {
    height: 60,
    width: 60,
    // tintColor: '#FFD300',
  },
  viewContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginTop: 32,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.greyScale800,
    textAlign: 'center',
  },
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 16,
  },
  idText: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginBottom: 12,
  },
  idInput: {
    width: SIZES.width - 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.greyscale900,
    paddingHorizontal: 12,
  },
  continueBtn: {
    marginVertical: 22,
  },
  itemContainer: {
    padding: 16, // Adjusted for SIZES.padding * 2
    width: '48%',
    rowGap: 8,
    borderRadius: 12,
    marginBottom: 16, // Adjusted for SIZES.padding
    alignItems: 'flex-start',
  },
  itemImage: {
    height: 24,
    width: 24,
    borderRadius: 50,
  },
  itemName: {
    fontSize: 16, // Adjusted for SIZES.h4
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemCashbackText: {
    fontSize: 12,
  },
  itemStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // This might require polyfilling if `gap` is not supported in your React Native version
  },
  itemStatImage: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary, // Static color; replace with dynamic color if needed
  },
  itemStatText: {
    fontSize: 12,
    fontWeight: 'thin', // Adjusted to '100' if needed as 'thin' isn't valid for React Native
    color: COLORS.primary, // Static color; replace with dynamic color if needed
  },
});

export default BillerItems;
