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
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { launchImagePicker } from '../utils/ImagePickerHelper';
import Input from '../components/Input';
import { getFormatedDate } from 'react-native-modern-datepicker';
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { useAppSelector } from '@/store/slices/authSlice';
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getUserProfile } from '@/utils/queries/accountQueries';
import PhoneInput from '@/components/PhoneInput';
import { isPending } from '@reduxjs/toolkit';
import { updateProfile } from '@/utils/mutations/accountMutations';
import { ApiError } from '@/utils/customApiCall';
import showToast from '@/utils/showToast';
import { authSliceActions } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import Loader from './loader';

interface Item {
  flag: string;
  item: string;
  code: string;
}

interface IInitialState {
  inputValues: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    occupation: string;
  };
  inputValidities: {
    firstName: boolean;
    lastName: boolean;
    phoneNumber: boolean;
    occupation: boolean;
  };
  formIsValid: boolean;
}

interface RenderItemProps {
  item: Item;
}

const isTestMode = true;

const initialState: IInitialState = {
  inputValues: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    occupation: '',
  },
  inputValidities: {
    firstName: true,
    lastName: true,
    phoneNumber: true,
    occupation: true,
  },
  formIsValid: true,
};

const EditProfile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const queryClient = useQueryClient();
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const [image, setImage] = useState<any>(null);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  // const [selectedArea, setSelectedArea] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');

  const { dark } = useTheme();
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profileDetails'],
    queryFn: () => getUserProfile(token),
    refetchOnMount: true,
  });
  const [dob, setDob] = useState(profileData?.data?.dob || '');
  useEffect(() => {
    if (profileData?.data) {
      // const formattedDob = profileData?.data?.dob
      //   ? format(new Date(profileData.data.dob), 'yyyy-MM-dd') // Format to YYYY-MM-DD
      //   : '';
      setDob(profileData?.data?.dob || '');
      console.log("profileData", profileData);

      formState.inputValues.occupation = profileData?.data?.occupation || '';
      formState.inputValues.firstName = profileData?.data?.firstName || '';
      formState.inputValues.lastName = profileData?.data?.lastName || '';
      formState.inputValues.phoneNumber = profileData?.data?.phone || '';
      setSelectedGender(profileData?.data?.gender || '');
      setImage({ uri: profileData?.data?.profilPicture });
    }
  }, [profileData]);
  const [openDobPicker, setOpenDobPicker] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: updateProfile,
    onSuccess: (data) => {
      console.log(data);
      //show toaster
      showToast({
        type: 'success',
        text1: 'Profile updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['profileDetails'] });
      dispatch(
        authSliceActions.setUser({
          userProfile: {
            accountBalance: data?.data?.accountBalance,
            accountNumber: data?.data?.account_number,
            firstName: data?.data?.firstName,
            lastName: data?.data?.lastName,
            phone: data?.data?.phone,
            profilePicture: data?.data?.profile_picture,
            created_at: data?.data?.created_at,
            updated_at: data?.data?.updated_at,
            email: userProfile?.email as string,
          },
        })
      );
    },
    onError: (error: ApiError) => {
      console.log(error);
      showToast({
        type: 'error',
        text1: error.message,
      });
    },
  });


  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    if (profileData?.data) {
      formState.inputValues.occupation = profileData?.data?.occupation || '';
      formState.inputValues.firstName = profileData?.data?.firstName || '';
      formState.inputValues.lastName = profileData?.data?.lastName || '';
      formState.inputValues.phoneNumber =
        profileData?.data?.phone || '';
      setSelectedGender(profileData?.data?.gender || '');
      setImage({ uri: profileData?.data?.profilPicture });
    }
  }, [profileData]);

  const handleUpdateProfile = async () => {
    const { firstName, lastName, phoneNumber, occupation } = formState.inputValues;
    const formData = new FormData();
    let hasChanges = false;

    // Check other fields
    const fieldsToCheck = [
      { key: 'firstName', value: firstName, original: profileData?.data.firstName },
      { key: 'lastName', value: lastName, original: profileData?.data.lastName },
      { key: 'phone', value: phoneNumber, original: profileData?.data.phone },
      { key: 'occupation', value: occupation, original: profileData?.data.occupation },
      { key: 'gender', value: selectedGender, original: profileData?.data.gender },
      { key: 'dob', value: dob, original: profileData?.data.dob },
    ];

    fieldsToCheck.forEach(({ key, value, original }) => {
      if (value !== original) {
        formData.append(key, value);
        hasChanges = true;
      }
    });

    // Handle image
    if (image && image?.uri !== profileData?.data.profilPicture) {
      formData.append('profilePicture', {
        uri: image?.uri,
        name: image?.fileName,
        type: image?.mimeType,
      } as any);
      hasChanges = true;
    }
    // If no changes, show a toast and return
    if (!hasChanges) {
      showToast({
        type: 'info',
        text1: 'No changes made to update.',
      });
      return;
    }

    console.log('Prepared formData:', formData);

    // Call the mutate function
    try {
      mutate({ token, data: formData });
      console.log('Mutation triggered');
    } catch (error) {
      console.error('Error triggering mutation:', error);
    }
  };





  const handleGenderChange = (value: any) => {
    setSelectedGender(value);
  };

  // console.log(image);
  // console.log(profileData?.data.profilPicture);

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    'YYYY/MM/DD'
  );

  const [startedDate, setStartedDate] = useState('12/12/2023');
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

  const pickImage = async () => {
    try {
      const imageData = await launchImagePicker();
      if (!imageData) return;
      setImage({ ...imageData });
    } catch (error) { }
  };

  React.useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleDobChange = (selectedDate) => {
    setDob(selectedDate);
    setOpenDobPicker(false); // Close the date picker after selection
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
      ]}
    >
      {isLoading && <Loader />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.container,
              { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
          >
            <Header title="Personal Profile" />
            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              <View style={styles.avatarContainer}>
                <Image
                  source={image?.uri}
                  contentFit="contain"
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

            {/* Input Fields */}
            <View>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                First Name
              </Text>
              <Input
                id="firstName"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['fullName']}
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                isEditable={true}
                value={formState.inputValues.firstName}
              />

              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                Last Name
              </Text>
              <Input
                id="lastName"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['nickname']}
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                isEditable={true}
                value={formState.inputValues.lastName}
              />
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                Email
              </Text>
              <View pointerEvents="none">
                <Input
                  id="email"
                  onInputChanged={inputChangedHandler}
                  errorText={formState.inputValidities['nickname']}
                  placeholderTextColor={COLORS.grayTie}
                  value={userProfile?.email}
                  style={{
                    color: COLORS.greyscale300, // Optional: Adjust color for a disabled look
                  }}
                />
              </View>

              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                Phone
              </Text>
              <PhoneInput
                isEditable={true}
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['phoneNumber']}
                value={formState.inputValues.phoneNumber.replace('+234', '')}
              />

              {/* Gender */}
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  Gender
                </Text>
                <RNPickerSelect
                  placeholder={{ label: 'Select', value: '' }}
                  items={genderOptions}
                  onValueChange={(value) => handleGenderChange(value)}
                  value={selectedGender}
                  style={{
                    inputIOS: {
                      fontSize: 16,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      color: COLORS.greyscale600,
                      paddingRight: 30,
                      marginVertical: 5,
                      height: 52,
                      width: SIZES.width - 32,
                      alignItems: 'center',
                      backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    },
                    inputAndroid: {
                      fontSize: 16,
                      paddingHorizontal: 10,
                      marginVertical: 5,
                      borderRadius: 10,
                      color: COLORS.greyscale600,
                      paddingRight: 30,
                      height: 52,
                      width: SIZES.width - 32,
                      alignItems: 'center',
                      backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    },
                  }}
                />
              </View>

              {/* Date of Birth */}
              {/* Date of Birth */}
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  Date of Birth
                </Text>
                <View style={styles.rowContainer}>
                  {/* Date Input */}
                  <TextInput
                    style={[
                      styles.dobInput,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                        color: dark ? COLORS.white : COLORS.black,
                      },
                    ]}
                    placeholder="DD"
                    placeholderTextColor={COLORS.grayscale400}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={dob.split('-')[2] || ''} // Extract day from dob
                    onChangeText={(value) => {
                      const [year, month] = dob.split('-');
                      setDob(`${year || ''}-${month || ''}-${value}`);
                    }}
                  />
                  {/* Month Input */}
                  <TextInput
                    style={[
                      styles.dobInput,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                        color: dark ? COLORS.white : COLORS.black,
                      },
                    ]}
                    placeholder="MM"
                    placeholderTextColor={COLORS.grayscale400}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={dob.split('-')[1] || ''} // Extract month from dob
                    onChangeText={(value) => {
                      const [year, , day] = dob.split('-');
                      setDob(`${year || ''}-${value}-${day || ''}`);
                    }}
                  />
                  {/* Year Input */}
                  <TextInput
                    style={[
                      styles.dobInput,
                      {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                        color: dark ? COLORS.white : COLORS.black,
                      },
                    ]}
                    placeholder="YYYY"
                    placeholderTextColor={COLORS.grayscale400}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={dob.split('-')[0] || ''} // Extract year from dob
                    onChangeText={(value) => {
                      const [, month, day] = dob.split('-');
                      setDob(`${value}-${month || ''}-${day || ''}`);
                    }}
                  />
                </View>
              </View>


              <DatePickerModal
                open={openDobPicker}
                selectedDate={dob}
                onClose={() => setOpenDobPicker(false)}
                onChangeStartDate={handleDobChange}
                endDate={getFormatedDate(new Date(), 'YYYY-MM-DD')}
              />

              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                Occupation
              </Text>
              <Input
                id="occupation"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities['occupation']}
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                isEditable={true}
                value={formState.inputValues.occupation}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        {!keyboardVisible && (
          <View style={styles.bottomContainer}>
            <Button
              isLoading={isPending}
              title={isPending ? 'Updating...' : 'Update'}
              filled
              disabled={isPending}
              style={styles.continueButton}
              onPress={handleUpdateProfile}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dobInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    marginHorizontal: 5,
    fontSize: 16,
    borderColor: COLORS.greyscale500,
  },
  
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
  label: {
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10,
    fontWeight: 'light',
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
    borderRadius: 10,
    height: 52,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 5,
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
    color: '#111',
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 50,
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
    // position: 'absolute',
    bottom: 32,
    marginTop: 32,
    right: 16,
    left: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SIZES.width - 32,
    alignItems: 'center',
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderContainer: {
    flexDirection: 'row',
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16,
  },
});

export default EditProfile;
