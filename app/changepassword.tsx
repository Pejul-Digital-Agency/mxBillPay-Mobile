import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Checkbox from 'expo-checkbox';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Keyboard } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '@/utils/mutations/accountMutations';
import { ApiError } from '@/utils/customApiCall';
import { showErrorCSS } from 'react-native-svg/lib/typescript/deprecated';
import showToast from '@/utils/showToast';
import { useAppSelector } from '@/store/slices/authSlice';

const isTestMode = true;
interface InitialState {
  inputValues: {
    password: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  inputValidities: {
    password: boolean;
    newPassword: boolean;
    confirmNewPassword: boolean;
  };
  formIsValid: boolean;
}

const initialState: InitialState = {
  inputValues: {
    password: isTestMode ? '**********' : '',
    newPassword: isTestMode ? '**********' : '',
    confirmNewPassword: isTestMode ? '**********' : '',
  },
  inputValidities: {
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  },
  formIsValid: false,
};

const ChangePassword = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isPasswordsEqual, setIsPasswordsEqual] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAppSelector((state) => state.auth);
  // const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, dark } = useTheme();
  const { mutate, isPending } = useMutation({
    mutationKey: ['changePassword'],
    mutationFn: updatePassword,
    onSuccess: (data) => {
      console.log(data);
      setModalVisible(true);
    },
    onError: (error: ApiError) => {
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
    },
    [dispatchFormState]
  );

  const handleChangePassword = () => {
    if (!formState.formIsValid) {
      console.log('Password changed successfully');
      showToast({
        type: 'error',
        text1: 'Please fill in all the required fields with valid data',
      });
      return;
    }
    if (!isPasswordsEqual) {
      showToast({
        type: 'error',
        text1: 'Both passwords should match',
      });
      return;
    }
    const reqData = {
      oldPassword: formState.inputValues.password,
      password: formState.inputValues.newPassword,
      confirmPassword: formState.inputValues.confirmNewPassword,
    };
    mutate({
      token,
      data: reqData,
    });
  };

  useEffect(() => {
    console.log(formState.inputValidities['newPassword']);
    if (
      formState.inputValues.newPassword !==
      formState.inputValues.confirmNewPassword
    ) {
      setIsPasswordsEqual(false);
    } else {
      setIsPasswordsEqual(true);
    }
  }, [
    formState.inputValues.newPassword,
    formState.inputValues.confirmNewPassword,
  ]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error);
    }
  }, [error]);

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

  // render modal
  const renderModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalSubContainer,
                { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              ]}
            >
              <Image
                source={illustrations.passwordSuccess}
                resizeMode="contain"
                style={styles.modalIllustration}
              />
              <Text style={styles.modalTitle}>Congratulations!</Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  {
                    color: dark ? COLORS.greyscale300 : COLORS.greyscale600,
                  },
                ]}
              >
                Your account is ready to use. You will be redirected to the Home
                page in a few seconds..
              </Text>
              <Button
                title="Continue"
                filled
                onPress={() => {
                  setModalVisible(false);
                  navigation.goBack();
                }}
                style={{
                  width: '100%',
                  marginTop: 12,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Change Password" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={
                dark
                  ? illustrations.passwordSuccessDark
                  : illustrations.newPassword
              }
              resizeMode="contain"
              style={styles.success}
            />
          </View>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Reset Password
          </Text>
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Old Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['newPassword']}
            autoCapitalize="none"
            id="newPassword"
            placeholder="New Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={
              formState.inputValues['confirmNewPassword'].trim() == ''
                ? 'confirm password is required'
                : !isPasswordsEqual
                ? 'both passwords should match'
                : ''
            }
            autoCapitalize="none"
            id="confirmNewPassword"
            placeholder="Confirm New Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
          {/* <View style={styles.checkBoxContainer}>
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
                    { color: dark ? COLORS.white : COLORS.black },
                  ]}
                >
                  Remenber me
                </Text>
              </View>
            </View>
          </View> */}
          <View></View>
        </ScrollView>
        {!keyboardVisible && (
          <Button
            title={isPending ? 'Updating...' : 'Update Password'}
            disabled={isPending}
            filled
            onPress={handleChangePassword}
            style={styles.button}
          />
        )}
        {renderModal()}
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
  success: {
    width: SIZES.width * 0.8,
    height: 250,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 52,
  },
  title: {
    fontSize: 18,
    fontFamily: 'medium',
    color: COLORS.black,
    marginVertical: 12,
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
  modalTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.greyscale600,
    textAlign: 'center',
    marginVertical: 12,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22,
  },
});

export default ChangePassword;
