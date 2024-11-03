import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Keyboard,
  Modal,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
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
import { Redirect, router, useNavigation } from 'expo-router';
import { isLoading } from 'expo-font';
import showToast from '@/utils/showToast';
import { useMutation } from '@tanstack/react-query';
import { generateBvnLink, signUpUser } from '@/utils/mutations/authMutations';
import { authSliceActions } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import CustomModal from './custommodal';

export interface InputValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface InputValidities {
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
    email: '',
    password: '',
    confirmPassword: '',
  },
  inputValidities: {
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
  const [userBvn, setUserBvn] = useState('');
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isPasswordsEqual, setIsPasswordsEqual] = useState(true);
  const [isChecked, setChecked] = useState(false);
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();
  const { mutate: signUp, isPending: signingUp } = useMutation({
    mutationFn: (data: InputValues) => signUpUser(data),
    onSuccess: (data) => {
      console.log(data);
      dispatch(authSliceActions.setToken(data?.token));
      dispatch(
        authSliceActions.setUser({
          userEmail: data.user.email,
          userId: data.user_id,
        })
      );
      router.push({
        pathname: '/otpverification',
        params: {
          type: 'email',
        },
      });
      // setModalVisible(true);
    },
    onError: (error) => {
      console.log(error);
      showToast({
        type: 'error',
        text1: error.message,
      });
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
      console.log(formState.inputValues);
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (
      formState.inputValues.password === formState.inputValues.confirmPassword
    ) {
      console.log(true);
      setIsPasswordsEqual(true);
    } else {
      console.log('falase');
      setIsPasswordsEqual(false);
    }
  }, [formState.inputValues.password, formState.inputValues.confirmPassword]);
  // console.log(formState.inputValues);

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
    console.log(formState.inputValues);
    signUp({
      email: formState.inputValues.email,
      password: formState.inputValues.password,
      confirmPassword: formState.inputValues.confirmPassword,
    });
  };

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
            errorText={
              formState.inputValues['confirmPassword'].trim() == ''
                ? 'confirm password is required'
                : !isPasswordsEqual
                ? 'both passwords should match'
                : ''
            }
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
            title={signingUp ? 'Signing Up...' : 'Sign Up'}
            filled
            isLoading={signingUp}
            disabled={signingUp}
            onPress={handleSignUp}
            style={[styles.button, { opacity: signingUp ? 0.5 : 1 }]}
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
      {/* modal for going to the bvn consent */}
      {/*<Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={{ textAlign: 'center', ...FONTS.h3 }}>
              Activating your account requires your BVN consent
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleGoToBVNConsent}
            >
              <Text style={styles.modalButtonText}>Click to continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>*/}
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
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    alignItems: 'center',
    borderRadius: 15,
  },
  modalButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: '50%',
    marginTop: 20,
  },
  modalButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    lineHeight: 17,
  },
});

export default Signup;
