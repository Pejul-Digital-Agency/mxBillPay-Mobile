import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
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
import { useMutation } from '@tanstack/react-query';
import { forgotPassword, loginUser } from '@/utils/mutations/authMutations';
import showToast from '@/utils/showToast';
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '@/store/slices/authSlice';

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

type Nav = {
  navigate: (value: string) => void;
};

const Login = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isChecked, setChecked] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();
  const { isPending: isPendingLogin, mutate: mutateLogin } = useMutation({
    mutationFn: (data: InputValues) => loginUser(data),
    onSuccess: (data) => {
      console.log(data);
      navigate('(tabs)');
    },
    onError: (error) => {
      console.log(error);
      showToast({
        type: 'error',
        text1: error.message,
      });
    },
  });
  const { isPending: isPendingForgot, mutate: mutateForgotPassword } =
    useMutation({
      mutationFn: (email: string) => forgotPassword(email),
      onSuccess: (data) => {
        console.log(data);
        dispatch(
          authSliceActions.setUser({
            email: formState.inputValues.email,
            userId: data.user_id,
          })
        );
        router.push('/forgotpasswordmethods');
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
    if (!isChecked) {
      showToast({
        type: 'error',
        text1: 'Please accept the terms and conditions',
      });
      return;
    }
    if (!formState.formIsValid) {
      showToast({
        type: 'error',
        text1: 'Fill all fields with valid data',
      });
      return;
    }
    // mutateLogin({
    //   email: formState.inputValues.email,
    //   password: formState.inputValues.password,
    // });
    navigate('fillyourprofile');
  };

  const handleForgotPassword = async () => {
    if (!formState.formIsValid) {
      return;
    }
    mutateForgotPassword(formState.inputValues.email);
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
  useEffect(() => {
    const checkBiometric = async () => {
      const check = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricAvailable(check);
    };
    checkBiometric();
  }, []);
  // console.log(isBiometricAvailable);

  //implementing Biometric authentication
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
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to MX Bill with Biometric',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });
      console.log(result);
      if (result.success) {
        showToast({
          type: 'success',
          text1: 'Login Successful',
        });
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

  // Implementing apple authentication
  const appleAuthHandler = () => {
    console.log('Apple Authentication');
  };

  // Implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log('Facebook Authentication');
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log('Google Authentication');
  };

  return (
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
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
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
                  Remenber me
                </Text>
              </View>
            </View>
          </View>
          <Button
            title="Login"
            filled
            onPress={handleLogin}
            style={styles.button}
          />
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordBtnText}>
              Forgot the password?
            </Text>
          </TouchableOpacity>
          <View>
            <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                onPress={appleAuthHandler}
                tintColor={dark ? COLORS.white : COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={facebookAuthHandler}
              />
              <SocialButton icon={icons.google} onPress={googleAuthHandler} />
            </View>
          </View>
        </ScrollView>
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
  logo: {
    width: 100,
    height: 100,
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
