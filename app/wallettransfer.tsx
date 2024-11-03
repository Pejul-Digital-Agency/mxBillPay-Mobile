import { View, StyleSheet, Text, TextInput } from 'react-native';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, icons, images, SIZES } from '@/constants';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Image } from 'expo-image';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { IBankDetails } from '@/utils/queries/billPayment';
import Input from '@/components/Input';
import { reducer } from '@/utils/reducers/formReducers';
import { validateInput } from '@/utils/actions/formActions';
import showToast from '@/utils/showToast';
import { useAppSelector } from '@/store/slices/authSlice';
import { useMutation } from '@tanstack/react-query';
import { getReceipientDetails } from '@/utils/mutations/paymentMutations';
import { bankData } from '@/data';
import { ApiError } from '@/utils/customApiCall';
import Loader from './loader';

type FormState = {
  inputValues: {
    amount: string;
    accountNo: string;
  };
  inputValidities: {
    amount: boolean;
    accountNo: boolean;
  };
  formIsValid: boolean;
};
const initialState: FormState = {
  inputValues: {
    amount: '',
    accountNo: '',
    // transferType: '',
  },
  inputValidities: {
    amount: false,
    accountNo: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const WalletTransfer = () => {
  const refRBSheet = useRef<any>(null);
  const { navigate, goBack } = useNavigation<NavigationProp<any>>();
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const [formState, dispatchFormState] = React.useReducer(
    reducer,
    initialState
  );
  const { mutate, isPending } = useMutation({
    mutationKey: ['receipeintEnquiry'],
    mutationFn: getReceipientDetails,
    onSuccess: (data) => {
      if (data?.data) {
        navigate('sendmoneyreviewsummary', {
          receipientDetails: data?.data,
          amount: formState.inputValues.amount as string,
        });
      }
    },
    onError: (error: { data: ApiError }) => {
      console.log(error.data);
      showToast({
        type: 'error',
        text1: error.data.message,
      });
    },
  });
  const { colors, dark } = useTheme();

  const inputChangedHandler = React.useCallback(
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

  const handleNavigateReviewScreen = () => {
    if (!formState.formIsValid) {
      showToast({
        type: 'error',
        text1: 'Please fill all the required fields',
      });
      return;
    }

    // if (
    //   Number(formState.inputValues.amount) > Number(userProfile?.accountBalance)
    // ) {
    //   showToast({
    //     type: 'error',
    //     text1: 'Insufficient balance',
    //   });
    //   return;
    // }

    const { amount, accountNo } = formState.inputValues;
    const reqData = {
      accountNo: accountNo as string,
      bank: '999999',
      transfer_type: 'intra',
    };

    mutate({
      data: reqData,
      token,
    });
  };
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Transfer Via Wallet" />
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View
          style={{
            marginTop: 24,
            //   flex: 1,
            rowGap: 6,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={images.logo}
            contentFit="contain"
            style={{
              height: 80,
              width: 80,
              borderRadius: 50,
 
            }}
          />
          {/* <Text
            style={{
              color: dark ? COLORS.white : COLORS.greyscale900,
              fontSize: 20,
              fontWeight: '600',
            }}
          >
            {selectedBank.name}
          </Text> */}
        </View>

        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
            },
          ]}
        />
        <Input
          id="accountNo"
          onInputChanged={inputChangedHandler}
          icon={icons.profile}
          errorText={formState.inputValidities['accountNo']}
          placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          placeholder="Enter Receiver Account Number"
          keyboardType="numeric"
        />
        <Text
          style={[
            styles.amountText,
            {
              color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
            },
          ]}
        >
          Enter the amount to transfer
        </Text>
        <TextInput
          placeholder="₦1000"
          keyboardType="numeric"
          onChangeText={(text) => inputChangedHandler('amount', text)}
          placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          style={[
            styles.amountInput,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        />
        <Text
          style={[
            styles.amountText,
            {
              color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
            },
          ]}
        >
          Available balance:
          {Number(userProfile?.accountBalance).toFixed(2).toString()}
        </Text>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
            },
          ]}
        />
        {/* <Text
            style={[
              styles.amountText,
              {
                color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
              },
            ]}
          >
            Fee: USD $2.00 for transfers under $100.00
          </Text> */}
        {/* </ScrollView> */}
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          style={styles.sendBtn}
          onPress={() => {
            if (!formState.formIsValid) {
              showToast({
                type: 'error',
                text1: 'Please fill all the required fields',
              });
              return;
            }
            refRBSheet.current.open();
          }}
          filled
        />
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={322}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.dark3 : '#000',
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 322,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            alignItems: 'center',
          },
        }}
      >
        <Text
          style={[
            styles.bottomTitle,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        >
          Bank Transfer
        </Text>
        <View
          style={[
            styles.separateLine,
            {
              marginVertical: 22,
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            },
          ]}
        />
        <View style={styles.summaryViewContainer}>
          <Text
            style={[
              styles.summaryViewLeft,
              {
                color: dark ? COLORS.grayscale200 : COLORS.greyScale800,
              },
            ]}
          >
            Amount
          </Text>
          <Text
            style={[
              styles.summaryViewRight,
              {
                color: dark ? COLORS.grayscale200 : COLORS.greyScale800,
              },
            ]}
          >
            $1000.00
          </Text>
        </View>
        <Text
          style={[
            styles.summaryText,
            {
              color: dark ? COLORS.greyscale500 : COLORS.greyScale800,
            },
          ]}
        >
          If you are transferring money to a bank account, you may incur a
          transfer fee. Ensure you review the fee details before completing the
          transfer to avoid any unexpected charges.{' '}
        </Text>
        <View
          style={[
            styles.separateLine,
            {
              marginVertical: 22,
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            },
          ]}
        />
        <Button
          title={'Continue'}
          filled
          disabled={!formState.formIsValid || isPending}
          style={styles.requestButton}
          onPress={() => {
            refRBSheet.current.close();
            handleNavigateReviewScreen();
          }}
        />
      </RBSheet>
      {isPending && <Loader />}
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
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 16,
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyScale800,
    marginVertical: 16,
    textAlign: 'center',
  },
  amountInput: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 131,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: 24,
    fontSize: 48,
    fontFamily: 'bold',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginVertical: 12,
  },
  noteInput: {
    width: SIZES.width - 32,
    height: 116,
    borderRadius: 16,
    backgroundColor: COLORS.secondaryWhite,
    fontSize: 16,
    fontFamily: 'regular',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.greyscale900,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 28,
    right: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sendBtn: {
    width: SIZES.width - 32,
  },
  requestButton: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 18,
  },
  summaryViewContainer: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryViewLeft: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.greyScale800,
  },
  summaryViewRight: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyScale800,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.greyScale800,
    width: SIZES.width - 32,
    marginVertical: 12,
  },
});

export default WalletTransfer;
