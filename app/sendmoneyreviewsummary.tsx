import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons, images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { NavigationProp, useRoute } from '@react-navigation/core';
import {
  IRecepeintDetails,
  transferMoney,
} from '@/utils/mutations/paymentMutations';
import { useMutation } from '@tanstack/react-query';
import { payBillFn } from '@/utils/mutations/accountMutations';
import { ApiError } from '@/utils/customApiCall';
import showToast from '@/utils/showToast';
import { useAppSelector } from '@/store/slices/authSlice';
import Loader from './loader';

const SendMoneyReviewSummary = () => {
  const { navigate, goBack } = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  if (!route.params || Object.keys(route.params).length === 0) return goBack();
  const { receipientDetails, amount } = route.params as {
    receipientDetails: IRecepeintDetails;
    amount: string;
  };
  const { colors, dark } = useTheme();
  const [remarks, setRemarks] = useState({
    label: 'for goods and services',
    optionalNote: '',
  });
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const { mutate, isPending } = useMutation({
    mutationKey: ['transferPayment'],
    mutationFn: transferMoney,
    onSuccess: (data) => {
      console.log(data);
      navigate('sendmoneysuccessful');
    },
    onError: (error: { data: ApiError }) => {
      console.log(error);
      showToast({
        type: 'error',
        text1: error.data.message,
      });
    },
  });

  const paymentOptions = [
    { label: 'For goods and services', value: 'for goods and services' },
    { label: 'For Friends and Family', value: 'for friends and family' },
  ];

  const handlePaymentTypeChange = (value: string) => {
    setRemarks((prev) => ({
      ...prev,
      label: value,
    }));
  };

  const handleSendMoney = () => {
    if (!remarks.label) {
      showToast({
        type: 'error',
        text1: 'Please select payment type',
      });
      return;
    }
    mutate({
      token,
      data: {
        amount,
        remark: remarks.label + ' ' + remarks.optionalNote,
        toClient: receipientDetails?.name,
        toAccount: receipientDetails?.account.number,
        toBank: '999999',
        transferType: 'intra',
        toBvn: receipientDetails?.bvn,
        toClientId: receipientDetails?.clientId,
        toSavingsId: '1122',
        toClientName: receipientDetails?.name,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {isPending && <Loader />}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Review Summary" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            <Image
              //   source={receipientDetails?.profilePicture || images.profile}
              source={icons.profile}
              contentFit="contain"
              style={styles.avatar}
            />
            <Text
              style={[
                styles.username,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {receipientDetails?.name}
            </Text>
            <Text
              style={[
                styles.useremail,
                { color: dark ? COLORS.grayscale200 : COLORS.grayscale700 },
              ]}
            >
              christian_dawson@gmail.com
            </Text>
            <View
              style={[
                styles.viewContainer,
                {
                  backgroundColor: dark ? COLORS.dark2 : '#FAFAFA',
                },
              ]}
            >
              <View style={styles.view}>
                <Text
                  style={[
                    styles.viewLeft,
                    { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 },
                  ]}
                >
                  Amount (NGN)
                </Text>
                <Text
                  style={[
                    styles.viewRight,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  ₦{amount}
                </Text>
              </View>
              <View style={styles.view}>
                <Text
                  style={[
                    styles.viewLeft,
                    { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 },
                  ]}
                >
                  Tax
                </Text>
                <Text
                  style={[
                    styles.viewRight,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  - ₦{'0.00'}
                </Text>
              </View>
              <View
                style={[
                  styles.separateLine,
                  {
                    backgroundColor: dark
                      ? COLORS.grayscale700
                      : COLORS.grayscale200,
                  },
                ]}
              />
              <View style={styles.view}>
                <Text
                  style={[
                    styles.viewLeft,
                    { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.viewRight,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  ${(Number(amount) - 0.0).toFixed(2).toString()}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={[
              styles.reviewTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Payment Type
          </Text>
          <RNPickerSelect
            placeholder={{
              label: 'For goods and services',
              value: 'for goods and services',
            }}
            items={paymentOptions}
            onValueChange={(value) => handlePaymentTypeChange(value)}
            value={remarks.label}
            style={{
              inputIOS: {
                fontSize: 16,
                paddingHorizontal: 10,
                borderRadius: 12,
                color: COLORS.greyscale600,
                paddingRight: 30,
                height: 52,
                width: SIZES.width - 32,
                alignItems: 'center',
                backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                fontFamily: 'regular',
              },
              inputAndroid: {
                fontSize: 16,
                paddingHorizontal: 10,
                borderRadius: 12,
                color: COLORS.greyscale600,
                paddingRight: 30,
                height: 52,
                width: SIZES.width - 32,
                alignItems: 'center',
                backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                fontFamily: 'regular',
              },
            }}
          />
          <Text
            style={[
              styles.reviewTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Notes
          </Text>
          <TextInput
            placeholder="Add a note (optional)"
            multiline={true}
            onChangeText={(value) => {
              setRemarks((prev) => ({ ...prev, optionalNote: value }));
            }}
            placeholderTextColor={
              dark ? COLORS.grayscale400 : COLORS.greyscale900
            }
            style={[
              styles.noteInput,
              {
                backgroundColor: dark ? COLORS.dark2 : '#FAFAFA',
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Confirm &  Send"
          style={styles.sendBtn}
          onPress={handleSendMoney}
          //   onPress={() => navigate('sendmoneysuccessful')}
          filled
        />
      </View>
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
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginVertical: 16,
  },
  username: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.black,
  },
  useremail: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.grayscale700,
    marginVertical: 4,
  },
  viewContainer: {
    width: SIZES.width - 32,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 6,
    marginVertical: 16,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.grayscale700,
  },
  viewRight: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
  },
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grayscale200,
  },
  reviewTitle: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginVertical: 8,
  },
  noteInput: {
    width: SIZES.width - 32,
    height: 116,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    fontFamily: 'regular',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.greyscale900,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 28,
    right: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sendBtn: {
    width: SIZES.width - 32,
  },
});

export default SendMoneyReviewSummary;
