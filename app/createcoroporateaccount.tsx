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
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { images } from '../constants';
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
import { useNavigation } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import showToast from '@/utils/showToast';
import { useAppSelector } from '@/store/slices/authSlice';
import { createCooperateAccount } from '@/utils/mutations/accountMutations';
import FileInput from '@/components/FIleInput';
import PhoneInput from '@/components/PhoneInput';

export interface ICooperateClient {
  userId: string;
  rcNumber: string;
  companyName: string;
  incorporationDate: string;
  bvn: string;
  profilePicture?: string;
  companyLogo?: string;
  cacCertificate?: string;
}
type initialStateType = {
  inputValues: {
    rcNumber: string;
    companyName: string;
    bvn: string;
    companyAddress: string;
    phoneNumber: string;
  };
  inputValidities: {
    rcNumber: boolean;
    companyName: boolean;
    bvn: boolean;
    companyAddress: boolean;
    phoneNumber: boolean;
  };
  formIsValid: boolean;
};
const initialState: initialStateType = {
  inputValues: {
    rcNumber: '',
    companyName: '',
    bvn: '',
    companyAddress: '',
    phoneNumber: '',
  },
  inputValidities: {
    rcNumber: false,
    companyName: false,
    bvn: false,
    companyAddress: false,
    phoneNumber: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const CreateCorporateAccount = () => {
  const { navigate } = useNavigation<Nav>();
  // const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [cacCertificate, setCacCertificate] = useState<any>(null);
  const { token, userId } = useAppSelector((state) => state.auth);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [startedDate, setStartedDate] = useState(
    `-Select Compnay's Incorporation Date-`
  );
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { colors, dark } = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: createCooperateAccount,
    onSuccess: (data) => {
      console.log(data);
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
    },
    [dispatchFormState]
  );

  const handlePickedDocument = (document: any) => {
    setCacCertificate(document);
  };

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    'YYYY/MM/DD'
  );

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  const pickImage = async () => {
    try {
      const imageData = await launchImagePicker();
      if (!imageData) return;
      setImage({ ...imageData });
    } catch (error) {}
  };
  // console.log(image);
  const handleSubmit = async () => {
    console.log(formState.formIsValid);
    if (
      !formState.formIsValid ||
      startedDate == `-Select Compnay's Incorporation Date-`
    ) {
      showToast({
        type: 'error',
        text1: 'Fill all fields with valid data',
      });
      return;
    }
    const { rcNumber, companyName, bvn, phoneNumber, companyAddress } =
      formState.inputValues;
    if (!image) {
      showToast({
        type: 'error',
        text1: 'Upload Company Logo',
      });
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('companyLogo', image as any);
    formData.append('rcNumber', rcNumber as string);
    formData.append('companyName', companyName as string);
    formData.append('bvn', bvn as string);
    formData.append('incorporationDate', startedDate);
    formData.append('cacCertificate', cacCertificate as any);
    formData.append('companyAddress', companyAddress as string);
    formData.append('phone', phoneNumber as string);
    console.log(formData);

    mutate({ data: formData, token });
  };

  //check if the keyBoard is open
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
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Fill your Company's Details" />
        <ScrollView showsVerticalScrollIndicator={false}>
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
          <View>
            <Input
              id="rcNumber"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['rcNumber']}
              placeholder="RC Number"
              placeholderTextColor={COLORS.gray}
            />
            <Input
              id="companyName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['companyName']}
              placeholder="Company Name"
              placeholderTextColor={COLORS.gray}
            />
            <Input
              id="bvn"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['bvn']}
              placeholder="BVN (of board of directors)"
              placeholderTextColor={COLORS.gray}
              keyboardType="numeric"
            />
            <PhoneInput
              id="phoneNumber"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['phoneNumber']}
            />
            <View
              style={{
                width: SIZES.width - 32,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.inputBtn,
                  {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
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
              </TouchableOpacity>
            </View>
            <Input
              id="companyAddress"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['companyAddress']}
              placeholder="Company Address"
              placeholderTextColor={COLORS.gray}
            />
            <FileInput
              onInputChanged={handlePickedDocument}
              placeholder="-Upload CAC Certificate-"
              errorText="Please upload CAC Certificate"
              icon={icons.attachFile}
            />
          </View>
        </ScrollView>
      </View>
      <DatePickerModal
        open={openStartDatePicker}
        endDate={startDate}
        selectedDate={startedDate}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => setStartedDate(date)}
      />
      {/* {RenderAreasCodesModal()} */}
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
            filled
            isLoading={isPending}
            disabled={isPending}
            style={styles.continueButton}
            onPress={handleSubmit}
          />
        </View>
      )}
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
    borderRadius: 50,
    // tintColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
    // borderRadius: 50,
  },
  avatarContainer: {
    marginVertical: 12,
    marginHorizontal: 'auto',
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
    color: COLORS.white,
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 52,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: 'space-between',
    marginVertical: 4,
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

export default CreateCorporateAccount;
