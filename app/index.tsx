import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import SocialButtonV2 from '../components/SocialButtonV2';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import { authSliceActions, useAppSelector } from '@/store/slices/authSlice';

import Button from '@/components/Button';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
// import { firebase } from '@react-native-firebase/analytics';
// import { firebase
// } from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
import { useQuery } from '@tanstack/react-query';
import { getPrivacyPageLink } from '@/utils/queries/accountQueries';
import { analytics } from '@/utils/firebaseConfig';

type Nav = {
  navigate: (value: string) => void;
};

// Welcome screen
const Welcome = () => {
  const { navigate, reset } = useNavigation<Nav>();
  // const { colors, dark } = useTheme();
  // const { navigate, reset } = useNavigation<Nav>();
  const { colors, dark } = useTheme();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const firebaseConfig = {
    apiKey: "AIzaSyBUfShuprYPZrrTsNT86cNBGKRMXvbW5Eg",
    authDomain: "mx-bill-pay-5c87d.firebaseapp.com",
    projectId: "mx-bill-pay-5c87d",           // Derived from the project number
    appId: "1:576378105680:ios:658b8a8835f05cb6eec655", // Updated based on new `google-services.json`
  };

  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  } else {
    console.log("Firebase is already initialized");
  }
  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedCredentials = await SecureStore.getItemAsync('authCredentials');
        if (storedCredentials) {
          const credentials = JSON.parse(storedCredentials);

          // Dispatch token and user data to Redux
          dispatch(authSliceActions.setToken(credentials.token));
          dispatch(
            authSliceActions.setUser({
              userProfile: credentials.user,
            })
          );
          reset({ index: 0, routes: [{ name: '(tabs)' }] });
          navigate('(tabs)');
        } else {
          setLoading(false); // No stored credentials, stop loading
        }
      } catch (error) {
        console.error('Error checking credentials:', error);
        setLoading(false); // Stop loading on error
      }
    };
    checkStoredCredentials();
  }, [reset, navigate]);
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        console.log('Initializing Firebase Analytics...');
        await analytics().logScreenView({
          screen_name: 'WelcomeScreen',
          screen_class: 'Welcome',
        });
        console.log('Firebase Analytics event logged successfully');
      } catch (error) {
        console.error('Error with Firebase Analytics:', error);
      }
    };
  
    // Delay analytics initialization by 3 seconds (optional)
    setTimeout(() => {
      initializeAnalytics();
    }, 3000);
  }, []);
  // const { token } = useAppSelector((state) => state.auth);
  const { data: privacyLink } = useQuery({
    queryKey: ['privacyLink'],
    queryFn: getPrivacyPageLink,
    enabled: true
  });

  const handlePrivacyClick = async () => {
    try {
      const url = privacyLink?.data;
      if (url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url); // Opens the URL in the browser
        } else {
          Alert.alert('Error', 'The provided URL cannot be opened.');
        }
      } else {
        Alert.alert('Error', 'No privacy link found.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to open the link.');
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]} he>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={images.mxlogo}
          contentFit="contain"
          style={styles.logo}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          Mx Bill Pay
        </Text>
        <Text
          style={[styles.subtitle, { color: dark ? COLORS.white : 'black' }]}
        >
          Mx Bill Pay is your go-to solution for seamless and secure bill payments. Manage and pay for electricity, airtime, data, cable, tolls, betting top up and internet services all in one place.
        </Text>
        <View style={{ marginVertical: 32 }}>
          <Button
            title={'Create Account'}
            filled
            isLoading={false}
            disabled={false}
            style={styles.button}
            onPress={() => navigate('signup')}
          // onPress={() => navigate('paybillssuccessful')}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.loginTitle,
              {
                color: dark ? COLORS.white : 'black',
              },
            ]}
          >
            Already have account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigate('login')}>
            <Text style={styles.loginSubtitle}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text
          style={[
            styles.bottomTitle,
            {
              color: dark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          By continuing, you accept the Terms Of Use and
        </Text>
        <TouchableOpacity onPress={handlePrivacyClick}>
          <Text
            style={[
              styles.bottomSubtitle,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Privacy Policy.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
    // opacity: isLoading ? 0.5 : 1
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 22,
    marginTop: -22,
    // tintColor: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontFamily: 'bold',
    color: COLORS.black,
    marginVertical: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'regular',
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  loginTitle: {
    fontSize: 14,
    fontFamily: 'regular',
    color: 'black',
  },
  loginSubtitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 32,
    right: 0,
    left: 0,
    width: SIZES.width - 32,
    alignItems: 'center',
  },
  bottomTitle: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.black,
  },
  bottomSubtitle: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.black,
    textDecorationLine: 'underline',
    marginTop: 2,
  },
});

export default Welcome;
