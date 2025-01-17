import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  TextInput,
  BackHandler,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { launchImagePicker } from '../utils/ImagePickerHelper';
import Input from '../components/Input';
import { getFormatedDate } from 'react-native-modern-datepicker';
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createIndividualAccount } from '@/utils/mutations/accountMutations';
import showToast from '@/utils/showToast';
import { authSliceActions, useAppSelector } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import CustomModal from './custommodal';
import { generateBvnLink } from '@/utils/mutations/authMutations';
import * as Linking from 'expo-linking';
import { checkBvnStatus } from '@/utils/queries/accountQueries';
import { NavigationProp } from '@react-navigation/native';
import SuccessModal from '@/components/SuccessModal';

export interface IClientCreation {
  userId: string;
  firstName: string;
  lastName: string;
  // dob: string;
  phone: string;
  profilePicture: {
    uri: string;
    type: string;
    name: string;
  };
}
type initialStateType = {
  inputValues: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  inputValidities: {
    firstName: boolean;
    lastName: boolean;
    phoneNumber: boolean;
  };
  formIsValid: boolean;
};
const initialState: initialStateType = {
  inputValues: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    phoneNumber: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const FillYourProfile = () => {
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [image, setImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState<any[]>([]);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [startedDate, setStartedDate] = useState(`-Select your Date of Birth`);
  const { colors, dark } = useTheme();
  // console.log(token);
  const { mutate, isPending } = useMutation({
    mutationFn: createIndividualAccount,
    onSuccess: (data) => {
      console.log(data);
      reset({ index: 0, routes: [{ name: 'fillyourprofile' }] });
      navigate('login');
    },
    onError: (error) => {
      console.log(error);
      showToast({
        type: 'error',
        text1: error.message,
      });
    },
  });

  const today = new Date();
  const endData = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    'YYYY/MM/DD'
  );

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
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

  const handleSubmit = async () => {
    console.log('readchec');
    if (!formState.formIsValid) {
      showToast({
        type: 'error',
        text1: 'Fill all fields with valid data',
      });
      return;
    }
    // if (!image) {
    //   showToast({
    //     type: 'error',
    //     text1: 'Please upload profile picture',
    //   });
    //   return;
    // }
    const { firstName, lastName, phoneNumber } = formState.inputValues;
    // const extension = image?.fileName.split('.').pop();
    // console.log(extension);
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    // formData.append('dob', startedDate);
    formData.append('phone', phoneNumber);
    if (image != null) {

      formData.append('profilePicture', {
        uri: image?.uri,
        name: image?.fileName,
        type: image?.mimeType,
      } as any);
    }

  // console.log(token);
    mutate({
      data: formData,
      token: token,
    });
  };

  useEffect(() => {
    fetch('https://restcountries.com/v2/name/Nigeria')
      .then((response) => response.json())
      .then((data) => {
        let areaData = data.map((item: any) => {
          return {
            code: item.alpha2Code,
            item: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
          };
        });
        setAreas(areaData);
      });
  }, []);

  const pickImage = async () => {
    try {
      const imageData = await launchImagePicker();
      if (!imageData) return;
      setImage({ ...imageData });
    } catch (error) { }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  });

  return (
    <>
      <SafeAreaView
        style={[styles.area, { backgroundColor: colors.background }]}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <Header title="Fill Your Profile" />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              <View style={styles.avatarContainer}>
                <Image
                  source={image === null ? icons.userDefault2 : image?.uri}
                  contentFit="cover"
                  style={styles.avatar}
                />
                <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Input
                id="firstName"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['firstName']}
                placeholder="First Name"
                placeholderTextColor={COLORS.gray}
              />
              <Input
                id="lastName"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['lastName']}
                placeholder="Last Name"
                placeholderTextColor={COLORS.gray}
              />
              {/* <Input
                id="bvn"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['bvn']}
                placeholder="Bank Verification Number (bvn)"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
              /> */}
              <View
                style={{
                  width: SIZES.width - 32,
                }}
              >
                {/* <TouchableOpacity
                  style={[
                    styles.inputBtn,
                    {
                      backgroundColor: dark
                        ? COLORS.dark2
                        : COLORS.greyscale500,
                      borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    },
                  ]}
                  onPress={handleOnPressStartDate}
                >
                  <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>
                    {startedDate}
                  </Text>
                  <Feather
                    name="calendar"
                    size={24}
                    color={COLORS.grayscale400}
                  />
                </TouchableOpacity> */}
              </View>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.selectFlagContainer}
                  onPress={() => { }}
                >
                  <View style={{ justifyContent: 'center' }}>
                    <Image
                      source={icons.down}
                      contentFit="contain"
                      style={styles.downIcon}
                    />
                  </View>
                  <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                    <Image
                      source={{ uri: areas.length > 0 && areas[0].flag }}
                      contentFit="contain"
                      style={styles.flagIcon}
                    />
                  </View>
                  <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                    <Text
                      style={{
                        color: dark ? COLORS.white : '#111',
                        fontSize: 12,
                      }}
                    >
                      {areas.length > 0 && areas[0]?.callingCode}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={COLORS.gray}
                  selectionColor={COLORS.primary}
                  keyboardType="numeric"
                  value={formState.inputValues['phoneNumber'].slice(4)}
                  onChangeText={(text) =>
                    inputChangedHandler(
                      'phoneNumber',
                      `${areas.length > 0 && areas[0]?.callingCode}${text}`
                    )
                  }
                />
              </View>
              {
                <Text style={{ color: 'red', fontSize: 12 }}>
                  {formState.inputValidities['phoneNumber']}
                </Text>
              }
            </View>
          </ScrollView>
        </View>
        <DatePickerModal
          open={openStartDatePicker}
          endDate={endData}
          selectedDate={startedDate}
          onClose={() => setOpenStartDatePicker(false)}
          onChangeStartDate={(date) => setStartedDate(date)}
        />
        {!keyboardVisible && (
          <View style={styles.bottomContainer}>
            <Text
              style={{
                ...FONTS.body4,
                color: dark ? COLORS.white : COLORS.primary,
                textAlign: 'center',
              }}
            >
              Please fill your credentials as per your legal documents.
            </Text>
            <Button
              title={isPending ? 'Submitting...' : 'Submit'}
              isLoading={isPending}
              filled
              disabled={isPending}
              style={styles.continueButton}
              onPress={handleSubmit}
            />
          </View>
        )}
        <SuccessModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPress={() => BackHandler.exitApp()}
          buttonTitle="Close App"
        />
        {/* <CustomModal
          btnText="Go to URL"
          modalVisible={redirectModalVisible}
          setModalVisible={setRedirectModalVisible}
          onPress={handleGoToBVNConsent}
          title={`${redirectURL}`}
        /> */}
        {/* <CustomModal
          btnText={generatingURL ? 'Generating...' : 'Generate Link'}
          modalVisible={generateModalVisible}
          disabled={generatingURL}
          setModalVisible={setGenerateModalVisible}
          onPress={handleGenerateLink}
          title="Generating your link requires your BVN consent. Please click below to get your bvn consent link"
        /> */}
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
  avatarContainer: {
    marginVertical: 12,
    alignItems: 'center',
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 12,
    height: 52,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: {
    width: 10,
    height: 10,
    tintColor: '#111',
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  flagIcon: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: COLORS.black,
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 52,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: 'space-between',
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: 'column',
    rowGap: 8,
    justifyContent: 'space-between',
    width: SIZES.width - 32,
    alignItems: 'center',
  },
  continueButton: {
    width: SIZES.width - 32 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    position: 'absolute',
    right: 16,
    top: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default FillYourProfile;
