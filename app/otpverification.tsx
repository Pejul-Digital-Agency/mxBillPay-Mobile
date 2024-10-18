import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { OtpInput } from 'react-native-otp-entry';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { toDottedEmail } from '@/utils/helpers/toDottedEmail';
import { useMutation } from '@tanstack/react-query';
import {
  forgotPassword,
  verifyEmailOTP,
  verifyPasswordOTP,
} from '@/utils/queries/mutations';
import { useAppSelector } from '@/store/slices/authSlice';
import showToast from '@/utils/showToast';

type Nav = {
  navigate: (value: string) => void;
};

type Params = {
  type: string;
};

const OTPVerification = () => {
  const { navigate } = useNavigation<Nav>();
  const [time, setTime] = useState(50);
  const { colors, dark } = useTheme();
  const { type } = useLocalSearchParams<Params>();
  const [otp, setOtp] = useState('');
  const { userId, userEmail } = useAppSelector((state) => state.auth);
  const { mutate, isPending } = useMutation({
    mutationFn: (data: { user_id: string; otp: string }) => {
      if (type == 'password') {
        return verifyPasswordOTP(data);
      } else {
        return verifyEmailOTP(data);
      }
    },
    onSuccess: (data) => {
      console.log(data);
      type == 'email'
        ? router.push('/reasonforusingallpay')
        : router.push('/createnewpassword');
    },
    onError: (error) => {
      console.log(error);
      showToast({
        type: 'error',
        text1: error.message,
      });
    },
  });

  const handleVerifyOTP = () => {
    // console.log(otp);
    // console.log(type);
    mutate({ user_id: userId.toString(), otp });
  };
  // console.log(isPending);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Forgot Password" />
        <ScrollView>
          <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Code has been send to
          </Text>
          <OtpInput
            numberOfDigits={4}
            onTextChange={(text) => setOtp(text)}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
                borderWidth: 0.4,
                borderRadius: 10,
                height: 58,
                width: 58,
              },
              pinCodeTextStyle: {
                color: dark ? COLORS.white : COLORS.black,
              },
            }}
          />
          <View style={styles.codeContainer}>
            <Text
              style={[
                styles.code,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Resend code in
            </Text>
            <Text style={styles.time}>{`  ${time} `}</Text>
            <Text
              style={[
                styles.code,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              s
            </Text>
          </View>
        </ScrollView>
        <Button
          title="Verify"
          filled
          disabled={otp.length !== 4 || isPending}
          style={styles.button}
          onPress={handleVerifyOTP}
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
    padding: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: 54,
  },
  OTPStyle: {
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.white,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.4,
    borderWidth: 0.4,
    borderColor: 'gray',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    justifyContent: 'center',
  },
  code: {
    fontSize: 18,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
    textAlign: 'center',
  },
  time: {
    fontFamily: 'medium',
    fontSize: 18,
    color: COLORS.primary,
  },
  button: {
    borderRadius: 32,
  },
});

export default OTPVerification;
