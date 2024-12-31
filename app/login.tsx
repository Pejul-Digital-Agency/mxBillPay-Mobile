import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import { useTheme } from '../theme/ThemeProvider';
import { router, useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import { useMutation, useQueries } from '@tanstack/react-query';
import { forgotPassword, loginUser } from '@/utils/mutations/authMutations';
import showToast from '@/utils/showToast';
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch } from 'react-redux';
import { authSliceActions, useAppSelector } from '@/store/slices/authSlice';
import * as SecureStore from 'expo-secure-store';
import { NavigationProp } from '@react-navigation/native';
// import * as SecureStore from 'expo-secure-store';

export interface InputValues {
  email: string;
  password: string;
}

interface InputValidities {
  email: boolean | undefined;
  password: boolean | undefined;
}

interface FormState {
  inputValues: InputValues;
  inputValidities: InputValidities;
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const Login = () => {
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isChecked, setChecked] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { colors, dark } = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const { isPending: isPendingLogin, mutate: mutateLogin } = useMutation({
    mutationFn: (data: InputValues) => loginUser(data),
    onSuccess: async (data) => {
      try {
        console.log('Login Success:', data);

        // Save user data in SecureStore
        await SecureStore.setItemAsync(
          'authCredentials',
          JSON.stringify({
            token: data?.token,
            user: data.user,
          })
        );

        // Update Redux store
        dispatch(authSliceActions.setToken(data?.token));
        dispatch(
          authSliceActions.setUser({
            userProfile: data.user,
          })
        );

        // Navigate to the main screen
        reset({ index: 0, routes: [{ name: '(tabs)' }] });
        navigate('(tabs)');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    },
    onError: (error) => {
      console.error('Login Error:', error);
      showToast({
        type: 'error',
        text1: error.message || 'Login failed',
      });
    },
  });

  const { isPending: isPendingForgot, mutate: mutateForgotPassword } =
    useMutation({
      mutationFn: forgotPassword,
      onSuccess: (data) => {
        console.log(data);
        dispatch(
          authSliceActions.setUser({
            userEmail: formState.inputValues.email,
            userId: data.user_id,
          })
        );
        router.push({
          pathname: '/otpverification',
          params: {
            type: 'password',
          },
        });
      },
      onError: (error) => {
        console.log(error);
        showToast({
          type: 'error',
          text1: error.message,
        });
      },
    });

  const handleLogin = async () => {
    if (!formState.formIsValid) {
      showToast({
        type: 'error',
        text1: 'Fill all fields with valid data',
      });
      return;
    }
    mutateLogin({
      email: formState.inputValues.email,
      password: formState.inputValues.password,
    });
    // navigate('(tabs)');
  };

  const handleForgotPassword = async () => {
    console.log('Forgot Password Clicked');
    console.log('Email Validity:', formState.inputValidities.email);
    console.log('Entered Email:', formState.inputValues.email);

    if (!formState.inputValues.email) {
      // Show a modal for entering their email
      console.log('Email is not valid or not provided');
      Alert.alert('Error', 'Please enter a valid email address')
      // setModalVisible(true);
      return;
    }

    // Proceed if email is valid
    mutateForgotPassword({
      email: formState.inputValues.email as string,
    });
  };
  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  // check if hardware supports biometric authentication
  // useEffect(() => {
  //   const checkBiometric = async () => {
  //     const check = await LocalAuthentication.hasHardwareAsync();
  //     setIsBiometricAvailable(check);
  //   };
  //   checkBiometric();
  // }, []);

  //control keyboard opening
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is open
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is closed
      }
    );

    // Cleanup the listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  // console.log(isBiometricAvailable);

  //implementing Biometric authentication
  useEffect(() => {
    const handleBiometricLoginOnStart = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Login with Fingerprint',
          cancelLabel: 'Skip',
          disableDeviceFallback: true,
        });

        if (result.success) {
          const authCredentials = await SecureStore.getItemAsync('authCredentials');
          if (authCredentials) {
            const credentials = JSON.parse(authCredentials);
            if (credentials.email && credentials.password) {
              mutateLogin({
                email: credentials.email,
                password: credentials.password,
              });
            }
          }
        }
      }
    };

    handleBiometricLoginOnStart();
  }, []);

  useEffect(() => {
    const handleBiometricAuth = async () => {
      if (!isBiometricAvailable) {
        return;
      }
      const biometricEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log(biometricEnrolled);
      if (!biometricEnrolled) {
        console.log('not available');
        return;
      }
      console.log('reached');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to MX Bill with Biometric',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });
      console.log(result);
      if (result.success) {
        const authCredentials = await SecureStore.getItemAsync(
          'authCredentials'
        );
        if (authCredentials) {
          const credentials = JSON.parse(authCredentials);
          if (credentials.email && credentials.password) {
            mutateLogin({
              email: credentials.email,
              password: credentials.password,
            });
          }
        }
      }
      if (result.success === false) {
        showToast({
          type: 'error',
          text1: 'Invalid biometric, use password instead',
        });
      }
    };
    handleBiometricAuth();
  }, [isBiometricAvailable]);

  return (
    <>
      <SafeAreaView
        style={[
          styles.area,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <Header title="" />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <Image
                source={images.logo}
                contentFit="contain"
                style={styles.logo}
              />
            </View>
            <Text
              style={[
                styles.title,
                {
                  color: dark ? COLORS.white : COLORS.black,
                },
              ]}
            >
              Login to Your Account
            </Text>
            <Input
              id="email"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['email']}
              placeholder="Email"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              icon={icons.email}
              keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
              <Input
                id="password"
                onInputChanged={inputChangedHandler}
                placeholder="Password"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                icon={icons.padlock}
                secureTextEntry={!passwordVisible}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.showPasswordIcon}
              >
                <Image
                  source={passwordVisible ? icons.eye : icons.eyeOff}
                  style={styles.icon}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.checkBoxContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked}
                  color={
                    isChecked ? COLORS.primary : dark ? COLORS.primary : 'gray'
                  }
                  onValueChange={setChecked}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.privacy,
                      {
                        color: dark ? COLORS.white : COLORS.black,
                      },
                    ]}
                  >
                    Remember me
                  </Text>
                </View>
              </View>
            </View>
            <Button
              title={isPendingLogin ? 'Logging In...' : 'Login'}
              filled
              isLoading={isPendingLogin}
              disabled={isPendingLogin}
              onPress={handleLogin}
              style={styles.button}
            />
            <TouchableOpacity
              disabled={isPendingForgot}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordBtnText}>
                Forgot the password?
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {!keyboardVisible && (
            <View style={styles.bottomContainer}>
              <Text
                style={[
                  styles.bottomLeft,
                  {
                    color: dark ? COLORS.white : COLORS.black,
                  },
                ]}
              >
                Don't have an account ?
              </Text>
              <TouchableOpacity onPress={() => navigate('signup')}>
                <Text style={styles.bottomRight}>{'  '}Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>


      </SafeAreaView>
    </>
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: 80,
    // tintColor: COLORS.primary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: 'medium',
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 26,
  },
  socialBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
    position: 'absolute',
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: 'regular',
    color: 'black',
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default Login;
