import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';
import { useNavigation, router, useLocalSearchParams } from 'expo-router';
import { authSliceActions } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';

type Nav = {
  navigate: (value: string) => void;
};

const AccountCreationMethod = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation<Nav>();
  const [selectedMethod, setSelectedMethod] = useState<
    'individual' | 'cooperate'
  >('individual');
  const { colors, dark } = useTheme();

  const handleMethodPress = (method: any) => {
    setSelectedMethod(method);
  };
  const handleClick = () => {
    router.push({
      pathname:
        selectedMethod == 'individual'
          ? '/fillyourprofile'
          : '/createcoroporateaccount',
    });
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Account Creation Method" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.passwordContainer}>
            <Image
              source={
                dark ? illustrations.passwordDark : illustrations.password
              }
              contentFit="contain"
              style={styles.password}
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
            Select which type of account you want to create
          </Text>
          <TouchableOpacity
            style={[
              styles.methodContainer,
              selectedMethod === 'individual' && {
                borderColor: COLORS.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => handleMethodPress('individual')}
          >
            <View style={styles.iconContainer}>
              <Image
                source={icons.profile2}
                contentFit="contain"
                style={styles.icon}
              />
            </View>
            <View>
              {/* <Text style={styles.methodTitle}>via SMS:</Text> */}
              <Text
                style={[
                  styles.methodSubtitle,
                  {
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
              >
                Create Indivudal Account
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodContainer,
              selectedMethod === 'cooperate' && {
                borderColor: COLORS.primary,
                borderWidth: 2,
              }, // Customize the border color for Cooperate
            ]}
            onPress={() => handleMethodPress('cooperate')}
          >
            <View style={styles.iconContainer}>
              <Image
                source={icons.people6}
                contentFit="contain"
                style={styles.icon}
              />
            </View>
            <View>
              {/* <Text style={styles.methodTitle}>via Email:</Text> */}
              <Text
                style={[
                  styles.methodSubtitle,
                  {
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
              >
                Create Cooperate Account
              </Text>
            </View>
          </TouchableOpacity>
          <Button
            title="Continue"
            filled
            style={styles.button}
            onPress={handleClick}
            // navigate(
            //   selectedMethod === 'sms'
            //     ? 'forgotpasswordphonenumber'
            //     : 'forgotpasswordemail'
            // )
          />
        </ScrollView>
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
  password: {
    width: 276,
    height: 250,
  },
  passwordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 18,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
  },
  methodContainer: {
    width: SIZES.width - 32,
    height: 112,
    borderRadius: 32,
    borderColor: 'gray',
    borderWidth: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    marginHorizontal: 16,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: COLORS.primary,
  },
  methodTitle: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.greyscale600,
  },
  methodSubtitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.black,
    // marginTop: 12,
  },
  button: {
    borderRadius: 32,
    marginVertical: 22,
  },
});

export default AccountCreationMethod;
