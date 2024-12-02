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
  getBillerProviders,
  IBillerCategory,
  IProviderData,
} from '@/utils/queries/appQueries';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import Loader from './loader';
import { useAppSelector } from '@/store/slices/authSlice';
import { darkColors } from '@/theme/colors';

const BillerProviders = () => {
  const route = useRoute<RouteProp<any>>();
  if (!route.params || Object.keys(route.params).length == 0)
    return router.push('/(tabs)');
  const { categoryData }: { categoryData: IBillerCategory } =
    route.params as any;
  // console.log(categoryData.category);
  const { token } = useAppSelector((state) => state.auth);
  const { colors, dark } = useTheme();
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();
  const { data, error, isLoading } = useQuery({
    queryKey: ['billerItems', categoryData?.id],
    queryFn: () =>
      getBillerProviders(categoryData?.id.toString() as string, token),
    enabled: categoryData != null,
  });

  const handleClickProvider = (providerData: IProviderData) => {
    navigate('billreviewsummary', { categoryData, providerData });
  };

  // console.log(billerItemsData);
  // error && console.log(error);

  const renderListItem = (provider: IProviderData) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.itemContainer,
          backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
        }}
        onPress={() => handleClickProvider(provider)}
      >
        <Image
          source={provider.logo}
          contentFit="cover"
          style={styles.fullImage}
        />
      </TouchableOpacity>
    );
  };
  
  const renderList = () => {
    return (
      <FlatList
        data={data?.data || []}
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
      {isLoading && <Loader />}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={categoryData?.category || ''} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewContainer}>
            <View style={styles.iconContainer}>
              <Image
                source={categoryData?.icon || icons.send}
                contentFit="contain"
                style={styles.icon}
                tintColor={COLORS.white}
              />
              <Text style={[styles.title]}>
                Fund Your {categoryData?.category} Account
              </Text>
            </View>
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
      {isLoading && <Loader />}
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
    height: 154,
    width: '100%',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -12,
    backgroundColor: darkColors ? COLORS.primary : COLORS.grayscale100,
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
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 12,
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
  // itemContainer: {
  //   padding: 16, // Adjusted for SIZES.padding * 2
  //   width: '48%',
  //   rowGap: 8,
  //   borderRadius: 12,
  //   marginBottom: 16, // Adjusted for SIZES.padding
  //   alignItems: 'flex-start',
  // },
  // itemImage: {
  //   height: 24,
  //   width: 24,
  //   borderRadius: 50,
  // },
  // itemName: {
  //   fontSize: 16, // Adjusted for SIZES.h4
  //   fontWeight: '600',
  // },
  itemContainer: {
    padding: 0, // Removed padding
    width: '48%',
    height: 110, // Adjust height based on design
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden', // Ensures the image is clipped to the border radius
  },
  fullImage: {
    width: '100%',
    height: '100%',
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

export default BillerProviders;
