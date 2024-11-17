import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { IBillerItemDetails } from '@/utils/queries/billPayment';
import { IPayBill, payBillFn } from '@/utils/mutations/accountMutations';
import { validateCustomer } from '@/utils/mutations/accountMutations';
import { useMutation } from '@tanstack/react-query';
import CustomModal from './custommodal';
import { useAppSelector } from '@/store/slices/authSlice';
import LabeledInput from '@/components/LabeledInput';
import Input from '@/components/Input';
import { reducer } from '@/utils/reducers/formReducers';
import { validateInput } from '@/utils/actions/formActions';
import showToast from '@/utils/showToast';
import { billServices } from '@/data';

interface InputValues {
  customerId: string;
  phone: string;
}

interface InputValidities {
  customerId: boolean | undefined;
  phone: boolean | undefined;
}

interface FormState {
  inputValues: InputValues;
  inputValidities: InputValidities;
  formIsValid: boolean;
}
const initialState: FormState = {
  inputValues: {
    customerId: '',
    phone: '',
  },
  inputValidities: {
    customerId: false,
    phone: false,
  },
  formIsValid: false,
};

const BillReviewSummary = () => {
  const { colors, dark } = useTheme();
  const { navigate } = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const [formState, dispatchFormState] = React.useReducer(
    reducer,
    initialState
  );
  const { token } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const { userId } = useAppSelector((state) => state.auth);
  const [errorModal, setErrorModal] = React.useState(false);
  const [errorModalText, setErrorModalText] = React.useState('');
  if (!route.params) return navigate('/(tabs)');
  const { billerItemDetails }: { billerItemDetails: IBillerItemDetails } =
    route.params as any;
  const { mutate: validate, isPending: isValidating } = useMutation({
    mutationFn: validateCustomer,
    onSuccess: (data) => {
      console.log(data);
      setModalOpen(true);
    },
    onError: (error) => {
      console.log(error.message);
      setErrorModalText(error.message);
      setErrorModal(true);
    },
  });
  const { mutate: payBill, isPending: isBillPaying } = useMutation({
    mutationFn: payBillFn,
    onSuccess: (data) => {
      console.log(data);
      setModalOpen(false);
      navigate('paybillssuccessful');
    },
    onError: (error) => {
      console.log(errorModalText);
      console.log(error.message);
    },
  });

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

  const handlePaymentClick = () => {
    if (!formState.formIsValid) {
      showToast({
        type: 'error',
        text1: 'Fill all fields with valid data',
      });
      return;
    }
    const reqData = {
      amount:
        billerItemDetails?.itemFee !== null &&
        billerItemDetails?.itemFee !== '0.00'
          ? billerItemDetails.itemFee
          : formState.inputValues.amount,
      billerId: billerItemDetails?.billerId,
      billerItemId: billerItemDetails?.id.toString(),
      customerId: formState.inputValues.customerId,
      phoneNumber: formState.inputValues.phone,
      userId,
    };
    console.log(reqData);
    // console.log(reqData);
    payBill({
      data: reqData,
      token,
    });
  };
  const handleErrorModal = () => {
    setErrorModal(false);
  };

  const handleValidateCustomer = () => {
    if (!formState.formIsValid) {
      showToast({
        type: 'error',
        text1: 'Fill all fields with valid data',
      });
      return;
    }
    validate({
      data: {
        customerId: formState.inputValues.customerId,
        id: billerItemDetails?.id.toString(),
      },
      token,
    });
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {
        <CustomModal
          btnText={isBillPaying ? 'Paying...' : 'Pay'}
          modalVisible={modalOpen}
          setModalVisible={setModalOpen}
          title="Successfully validated your customer id, please click below to continue"
          disabled={isBillPaying}
          onPress={handlePaymentClick}
        />
      }
      {
        <CustomModal
          btnText={'Error'}
          modalVisible={errorModal}
          setModalVisible={setErrorModal}
          title={errorModalText}
          disabled={isBillPaying}
          onPress={handleErrorModal}
        />
      }

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={`Pay ${billerItemDetails?.paymentitemname} Bill`} />
        {/* <Header title={billerItemDetails} /> */}
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={styles.viewViewContainer}>
          {/* <Text
            style={[
              styles.title,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Pay {billerItemDetails?.paymentitemname} Bill
          </Text> */}
          <View style={{ marginVertical: 12 }}>
            <Text
              style={[
                styles.subtitle,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                },
              ]}
            >
              Pay {billerItemDetails?.paymentitemname} bills safely,
              conveniently & easily.
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                },
              ]}
            >
              You can pay anytime and anywhere!
            </Text>
          </View>
          <View
            style={[
              styles.separateLine,
              {
                backgroundColor: dark
                  ? COLORS.greyscale900
                  : COLORS.grayscale200,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.viewContainer,
            {
              backgroundColor: dark ? COLORS.dark2 : '#FAFAFA',
            },
          ]}
        >
          {/* <Image
              source={images.user1}
              contentFit="contain"
              style={styles.avatar}
            /> */}
          {/* <View
              style={[
                styles.separateLine,
                {
                  backgroundColor: dark
                    ? COLORS.greyScale800
                    : COLORS.grayscale200,
                },
              ]}
            /> */}
          <View style={styles.view}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                },
              ]}
            >
              Bill Amount ({billerItemDetails?.itemCurrencySymbol})
            </Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              {billerItemDetails?.itemFee}
            </Text>
          </View>
          {/* <View style={styles.view}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                },
              ]}
            >
              Fixed Commission
            </Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              {billerItemDetails?.fixed_commission}
            </Text>
          </View>
          <View style={styles.view}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                },
              ]}
            >
              Percentage Commission
            </Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              {billerItemDetails?.percentage_commission}
            </Text>
          </View> */}
          <View
            style={[
              styles.separateLine,
              {
                backgroundColor: dark
                  ? COLORS.greyScale800
                  : COLORS.grayscale200,
              },
            ]}
          />
          <View style={styles.view}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                },
              ]}
            >
              Status
            </Text>
            <View style={styles.paidBtn}>
              <Text style={styles.paidBtnText}>Unpaid</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />

        <Input
          id="customerId"
          value={formState.inputValues.customerId}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['customerId']}
          placeholder="Customer Id"
          placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          icon={icons.profile2}
          keyboardType="number-pad"
        />

        <Input
          id="phone"
          value={formState.inputValues.phone}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['phone']}
          placeholder="Phone Number"
          placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          icon={icons.mobile}
          keyboardType="number-pad"
        />
        <Input
          id="amount"
          value={
            billerItemDetails?.itemFee !== null &&
            billerItemDetails?.itemFee !== '0.00'
              ? billerItemDetails.itemFee
              : formState.inputValues.amount
          }
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['amount']}
          placeholder="Amount"
          editable={
            billerItemDetails?.itemFee === null ||
            billerItemDetails?.itemFee === '0.00'
          }
          placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          icon={icons.wallet}
          keyboardType="number-pad"
        />

        <Button
          title={isValidating ? 'Verifying...' : 'Confirm & Verify Bill'}
          filled
          disabled={isValidating}
          style={styles.continueBtn}
          onPress={handleValidateCustomer}
          // onPress={() => navigate('paybillssuccessful')}
        />
        {/* </ScrollView> */}
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
  iconContainer: {
    height: 124,
    width: 124,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 211, 0, .12)',
  },
  icon: {
    height: 60,
    width: 60,
    tintColor: '#FFD300',
  },
  viewViewContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginTop: 32,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.greyScale800,
    textAlign: 'center',
  },
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12,
  },
  idText: {
    fontSize: 17,
    marginLeft: 6,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginVertical: 12,
  },
  idInput: {
    width: SIZES.width - 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.greyscale900,
    paddingHorizontal: 12,
  },
  continueBtn: {
    marginVertical: 22,
  },
  viewContainer: {
    width: SIZES.width - 32,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 6,
    marginVertical: 2,
    alignItems: 'center',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    width: SIZES.width - 32,
    paddingHorizontal: 10,
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.grayscale700,
  },
  viewRight: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 999,
  },
  paidBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 6,
  },
  paidBtnText: {
    fontSize: 10,
    fontFamily: 'regular',
    color: COLORS.white,
  },
});

export default BillReviewSummary;
