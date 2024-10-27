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
  resendOtp,
  verifyEmailOTP,
  verifyPasswordOTP,
} from '@/utils/mutations/authMutations';
import { useAppSelector } from '@/store/slices/authSlice';
import showToast from '@/utils/showToast';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Nav = {
  navigate: (value: string) => void;
};

type Params = {
  type: string;
};

const OTPVerification = () => {
  const { navigate } = useNavigation<Nav>();
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(45);
  const { colors, dark } = useTheme();
  const { type } = useLocalSearchParams<Params>();
  const [otp, setOtp] = useState('');
  const [timerOut, setTimerOut] = useState(false);
  const { userId, userEmail } = useAppSelector((state) => state.auth);
  const { mutate: submitOtp, isPending: submittingOtp } = useMutation({
    mutationFn: (data: { user_id: string; otp: string }) => {
      if (type == 'password') {
        return verifyPasswordOTP(data);
      } else {
        return verifyEmailOTP(data);
      }
    },
    onSuccess: (data) => {
      console.log('Email verified: ', data);
      type == 'email'
        ? router.push('/accountcreationmethod')
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
  const { mutate: resend, isPending: resedingOtp } = useMutation({
    mutationFn: (data: { email: string; userId: string }) => resendOtp(data),
    onSuccess: (data) => {
      console.log(data);
      setTime(45);
      setTimerOut(false);
      setTimeInterval(
        setInterval(() => {
          setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000)
      );
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
    // router.push('/accountcreationmethod');
    submitOtp({ user_id: userId.toString(), otp });
  };
  // console.log(isPending);

  useEffect(() => {
    setTimeInterval(
      setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000)
    );

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (time == 0) {
      console.log('ok');
      setTimerOut(true);
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    }
  }, [time]);

  const handleResendOtp = () => {
    // resend({ email: userEmail, userId: userId.toString() });
    // setTime(8);
    // setTimerOut(false);
    // setTimeInterval(
    //   setInterval(() => {
    //     setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    //   }, 1000)
    // );
  };

  console.log(timerOut);
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
            Code has been send to your email
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
          {time == 0 && timerOut && (
            <View style={styles.codeContainer}>
              <Text
                onPress={handleResendOtp}
                disabled={resedingOtp}
                style={[
                  styles.code,
                  {
                    color: COLORS.primary,
                    opacity: resedingOtp ? 0.7 : 1,
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                {resedingOtp ? 'Resending...' : 'Resend code'}
              </Text>
            </View>
          )}
          {time > 0 && (
            <View style={[styles.codeContainer, { flexDirection: 'row' }]}>
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
              <Text style={styles.time}>{`  ${time}  `}</Text>
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
          )}
        </ScrollView>
        <Button
          title="Verify"
          filled
          disabled={otp.length !== 4 || submittingOtp}
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
    // flexDirection: 'row',
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
