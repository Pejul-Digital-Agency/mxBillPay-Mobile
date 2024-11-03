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
} from '@/utils/queries/billPayment';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import Loader from './loader';
import { IBillerItemsList } from '@/utils/queries/billPayment';
import { Route } from 'expo-router/build/Route';
import { useAppSelector } from '@/store/slices/authSlice';
import { darkColors } from '@/theme/colors';



type Nav = {
  navigate: (value: number) => void;
};
const CustomCategoryPage = () => {
  const route = useRoute<RouteProp<any>>();
  if (!route.params || Object.keys(route.params).length == 0)
    return router.push('/(tabs)');
  const { token } = useAppSelector((state) => state.auth);
  const {
    billerItems,
    billerCategory,
  }: { billerCategory: IBillerCategory; billerItems: IBillerItemsList } =
    route.params as any;
  // if (!params) {
  //   return router.push('/(tabs)');
  // }
  const { colors, dark } = useTheme();
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();
  const [itemId, setItemId] = useState('');
  const { data, error, isLoading } = useQuery({
    queryKey: ['billerItems', itemId],
    queryFn: () => getBillerItemDetails({ itemId, token }),
    enabled: itemId !== '',
  });

  const handleClickItem = (id: string) => {
    if (itemId == id && data?.data) {
      navigate('billreviewsummary', {
        billerItemDetails: data?.data,
      });
      return;
    }
    setItemId(id);
  };
  useEffect(() => {
    if (data?.data) {
      navigate('billreviewsummary', {
        billerItemDetails: data?.data,
      });
    }
  }, [data]);

  const renderListItem = (itemName: string, itemId: string) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          paddingHorizontal: SIZES.padding * 2,
          paddingVertical: SIZES.padding * 1.5,
          borderRadius: SIZES.radius,
          marginBottom: SIZES.padding,
        }}
        onPress={() => handleClickItem(itemId)}
      >
        <Text
          style={{
            color: dark ? COLORS.white : COLORS.greyscale900,
            fontSize: SIZES.h3,
          }}
        >
          {itemName}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderList = () => {
    return (
      <FlatList
        data={billerItems?.itemList || []}
        renderItem={({ item }) =>
          renderListItem(item.paymentitemname, item.id.toString())
        }
        keyExtractor={(item, index) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />
    );
  };
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={billerItems?.category?.category} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewContainer}>
            <View style={styles.iconContainer}>
              <Image
                source={billerItems?.category?.icon || icons.send}
                contentFit="contain"
                style={styles.icon}
                tintColor={billerItems?.category?.iconColor}
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
              Choose category of {billerItems?.category?.category} bills
            </Text>
            {/* <View style={{ marginVertical: 12 }}>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                  },
                ]}
              >
                Pay {categoryName} bills safely, conveniently & easily.
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                  },
                ]}
              >
                You can pay anytime and anywhere!
              </Text>
            </View> */}
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
          {/* <Text
            style={[
              styles.idText,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Customer ID
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="37173838939"
            style={[
              styles.idInput,
              {
                backgroundColor: dark ? COLORS.dark2 : '#FAFAFA',
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          /> */}
          {/* <Button
            title="Continue"
            filled
            style={styles.continueBtn}
            onPress={() => navigate('paybillselectricityreviewsummary')}
          /> */}
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
});

export default CustomCategoryPage;
