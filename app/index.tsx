import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  // Check for stored credentials
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}he>
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
          {/* <SocialButtonV2
            title="Continue with Apple"
            icon={icons.appleLogo}
            onPress={() => navigate('signup')}
            iconStyles={{ tintColor: dark ? COLORS.white : COLORS.black }}
          />
          <SocialButtonV2
            title="Continue with Google"
            icon={icons.google}
            onPress={() => navigate('signup')}
          /> */}
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
        <TouchableOpacity onPress={() => navigate('login')}>
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
