import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, icons } from '@/constants';
import {
    getBanks,
    getBillerCategories,
    getBillerItems,
} from '@/utils/queries/billPayment';
import { billServices, insuranceServices, optionServices } from '@/data';
import Category from '@/components/Category';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { useAppSelector } from '@/store/slices/authSlice';
import { useQuery } from '@tanstack/react-query';

const AllServices = () => {
    const { navigate, setParams } = useNavigation<NavigationProp<any>>();
    const [categoryId, setCategoryId] = React.useState('');
    //   const { colors, dark } = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();
    const [isSelectedBankPayment, setIsSelectedBankPayment] =
        React.useState(false);
    const { token, userProfile } = useAppSelector((state) => state.auth);

    const {
        data: billerCategories,
        error: errorCategories,
        isLoading: isLoadingCategories,
    } = useQuery({
        queryKey: ['billCategories'],
        queryFn: () => getBillerCategories({ token }),
        enabled: !!token,
    });
    const {
        data: billerItemsData,
        isLoading: isPendingItems,
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
    const {
        data: banksData,
        isLoading: isLoadingBanks,
        error: isErrorBanks,
    } = useQuery({
        queryKey: ['billerMethod'],
        queryFn: () => {
            if (isSelectedBankPayment) {
                return getBanks(token);
            }
        },
        enabled: isSelectedBankPayment,
    });

    const { dark, colors } = useTheme();

    useEffect(() => {
        if (billerItemsData?.data) {
            // console.log('index page', billerItemsData?.data);
            // setParams({
            //   billerItems: billerItemsData?.data,
            // });
            navigate('customcateogorypage', { billerItems: billerItemsData?.data });
        }
    }, [billerItemsData]);

    useEffect(() => {
        if (banksData?.data) {
            console.log('index page', banksData?.data);
            navigate('transfertobankselectbank', { data: banksData?.data });
        }
    }, [banksData]);

    const handleClickCategory = (id: string) => {
        if (categoryId == id && billerItemsData?.data) {
            navigate('customcateogorypage', { billerItems: billerItemsData?.data });
            return;
        }
        setCategoryId(id);
    };

    const handleNavigateToBankTransfer = () => {
        if (banksData?.data) {
            navigate('transfertobankselectbank', { data: banksData?.data });
            return;
        }
        console.log('reached');
        setIsSelectedBankPayment(true);
    };

    const handleWalletTransfer = () => {
        navigate('wallettransfer');
    };


    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="All Services" />
                <ScrollView
                    contentContainerStyle={{ marginVertical: 12 }}
                    showsVerticalScrollIndicator={false}>
                    <Text style={[styles.subtitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Bill</Text>
                    {billerCategories?.data && (
                        <FlatList
                            data={billerCategories?.data}
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
                                    backgroundColor={
                                        dark ? COLORS.greyScale800 : COLORS.grayscale100
                                    }
                                    onPress={() => handleClickCategory(item.id.toString())}
                                />
                            )}
                        />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 16
    }
})
export default AllServices