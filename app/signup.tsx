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
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { isLoading } from 'expo-font';
import useApiRequest from '@/hooks/useApiRequest';
import { API_DOMAIN, API_ENDPOINTS } from '@/apiConfig';
import showToast from '@/utils/showToast';
import { useMutation } from '@tanstack/react-query';
import { signUpUser } from '@/utils/queries/mutations';

export interface InputValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface InputValidities {
  fullName: boolean | undefined;
  email: boolean | undefined;
  password: boolean | undefined;
  confirmPassword: boolean | undefined;
}

interface FormState {
  inputValues: InputValues;
  inputValidities: InputValidities;
  formIsValid: boolean;
}

const initialState: FormState = {
  inputValues: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const Signup = () => {
  // const { isLoading, isError, isSuccess, fetchRequest } = useApiRequest();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isChecked, setChecked] = useState(false);
  const { colors, dark } = useTheme();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: InputValues) => signUpUser(data),
    onSuccess: (data) => {
      console.log(data);
      navigate('reasonforusingallpay');
    },
  });

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

  const handleSignUp = async () => {
    // console.log(formState.formIsValid);
    // console.log(formState.inputValues);
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
    if (
      formState.inputValues.password !== formState.inputValues.confirmPassword
    ) {
      showToast({
        type: 'error',
        text1: 'Both passwords should match',
      });
      return;
    }
    navigate('reasonforusingallpay');
    // mutate({
    //   fullName: formState.inputValues.fullName,
    //   email: formState.inputValues.email,
    //   password: formState.inputValues.password,
    //   confirmPassword: formState.inputValues.confirmPassword,
    // });
  };

  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        text1: error.message || 'Something Went Wrong',
      });
    }
  }, [error]);

  //Event listener to check whether the keyBoard is open or not
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

  // implementing apple authentication
  const appleAuthHandler = () => {
    console.log('Apple Authentication');
  };

  // implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log('Facebook Authentication');
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log('Google Authentication');
  };

  // console.log(keyboardVisible);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            Create Your Account
          </Text>
          <Input
            id="fullName"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['fullName']}
            placeholder="Full Name"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.profile2}
            keyboardType="default"
          />
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
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['confirmPassword']}
            autoCapitalize="none"
            id="confirmPassword"
            placeholder="Confirm Password"
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
                  By continuing you accept our Privacy Policy
                </Text>
              </View>
            </View>
          </View>
          <Button
            title={isPending ? 'Signing Up...' : 'Sign Up'}
            filled
            disabled={isPending}
            onPress={handleSignUp}
            style={[styles.button, { opacity: isPending ? 0.5 : 1 }]}
          />
          {/* <View>
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
          </View> */}
        </ScrollView>
        <View
          style={[
            styles.bottomContainer,
            {
              opacity: keyboardVisible ? 0 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.bottomLeft,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Already have an account ?
          </Text>
          <TouchableOpacity onPress={() => navigate('login')}>
            <Text style={styles.bottomRight}> Sign In</Text>
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
    marginBottom: 12,
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
    // opacity: isLoading ? 0.5 : 1
  },
});

export default Signup;
