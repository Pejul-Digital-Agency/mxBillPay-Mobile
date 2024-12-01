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
import {
  getBillerItemDetails,
  getBillerItems,
  IBillerCategory,
  IBillerItemDetails,
  IProviderData,
} from '@/utils/queries/appQueries';
import { IPayBill, payBillFn } from '@/utils/mutations/accountMutations';
import { validateCustomer } from '@/utils/mutations/accountMutations';
import { useMutation, useQuery } from '@tanstack/react-query';
import CustomModal from './custommodal';
import { useAppSelector } from '@/store/slices/authSlice';
import LabeledInput from '@/components/LabeledInput';
import Input from '@/components/Input';
import { reducer } from '@/utils/reducers/formReducers';
import { validateInput } from '@/utils/actions/formActions';
import showToast from '@/utils/showToast';
import { billServices } from '@/data';
import { applyCommission } from '@/utils/helpers/commissionedFee';
import RBSheet from 'react-native-raw-bottom-sheet';
import { ApiError } from '@/utils/customApiCall';
import CustomPicker from '@/components/Picker';

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
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  if (!route.params || Object.keys(route.params).length == 0)
    return navigate('/(tabs)');
  const {
    categoryData,
    providerData,
  }: { categoryData: IBillerCategory; providerData: IProviderData } =
    route.params as any;
  const [formState, dispatchFormState] = React.useReducer(
    reducer,
    initialState
  );
  const { token } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedBillerItemId, setSelectedBillerItemId] = React.useState('');
  const rbSheetRef = React.useRef<any>(null);
  const { userId } = useAppSelector((state) => state.auth);
  const [errorModal, setErrorModal] = React.useState(false);
  const [errorModalText, setErrorModalText] = React.useState('');

  const {
    data: billerItemsList,
    isLoading: isLoadingItemList,
    isError: isErrorItemsList,
    error: errorItemsList,
  } = useQuery({
    queryKey: ['billCategories', categoryData?.id],
    queryFn: () =>
      getBillerItems({
        categoryId: categoryData?.id.toString() as string,
        providerId: providerData?.id.toString() as string,
        token,
      }),
    enabled: categoryData != null || providerData != null,
  });
  const {
    data: billerItemData,
    isLoading: isLoadingItemData,
    isError: isErrorItemData,
    error: errorItemData,
  } = useQuery({
    queryKey: ['billerItems', selectedBillerItemId],
    queryFn: () =>
      getBillerItemDetails({
        itemId: selectedBillerItemId,
        token,
      }),
    enabled: selectedBillerItemId != '',
  });
  const { mutate: validate, isPending: isValidating } = useMutation({
    mutationFn: validateCustomer,
    onSuccess: (data) => {
      console.log(data);
      rbSheetRef?.current.open();
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
      console.log('transaction_data', data);
      rbSheetRef.current.close();
      reset({ index: 0, routes: [{ name: 'inoutpaymentviewereceipt' }] });
      navigate('inoutpaymentviewereceipt', {
        transactionData: data?.data,
        billerItemData: billerItemData?.data,
      });
    },
    onError: (error: ApiError) => {
      console.log(error);
      setErrorModalText(error.message);
      setErrorModal(true);
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
    if (billerItemData) {
      const reqData = {
        amount:
          billerItemData.data?.itemFee !== null &&
          billerItemData.data?.itemFee !== '0.00'
            ? billerItemData.data.itemFee
            : formState.inputValues.amount,
        billerId: billerItemData.data?.billerId,
        billerItemId: billerItemData.data?.id.toString(),
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
    }
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

    if (!selectedBillerItemId) {
      showToast({
        type: 'error',
        text1: 'Please choose a biller item',
      });
      return;
    }
    validate({
      data: {
        customerId: formState.inputValues.customerId,
        id: selectedBillerItemId,
      },
      token,
    });
  };

  const TopContainerItem = ({
    title,
    value,
  }: {
    title: string;
    value: string;
  }) => {
    return (
      <View style={styles.view}>
        <Text
          style={[
            styles.viewLeft,
            {
              color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.viewRight,
            {
              color: dark ? COLORS.white : COLORS.greyscale900,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    );
  };

  const SeparateLine = () => {
    return (
      <View
        style={[
          styles.separateLine,
          {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
          },
        ]}
      />
    );
  };

  const renderTopContainer = () => {
    return (
      <>
        <View style={styles.viewViewContainer}>
          {/* Title Section */}
          <View style={{ marginVertical: 16 }}>
            <Text
              style={[
                styles.subtitle,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                },
              ]}
            >
              Pay {billerItemData?.data?.paymentitemname} bills safely,
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

          <SeparateLine />
        </View>
        <View
          style={[
            styles.viewContainer,
            {
              backgroundColor: dark ? COLORS.dark2 : '#FAFAFA',
            },
          ]}
        >
          <TopContainerItem
            title={`Bill Amount (${billerItemData?.data?.itemCurrencySymbol})`}
            value={billerItemData?.data?.itemFee || '0.00'}
          />
          {/* <View style={styles.view}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                },
              ]}
            >
              Bill Amount ({data?.data?.itemCurrencySymbol})
            </Text>
            <Text
              style={[
                styles.viewRight,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              {data?.data?.itemFee
                ? applyCommission(
                    data?.data?.percentage_commission,
                    data?.data?.itemFee
                  )
                : 'Enter Amount Below'}
            </Text>
          </View> */}
          {billerItemData?.data?.itemFee &&
            billerItemData.data.itemFee !== '0.00' && (
              <>
                <TopContainerItem
                  title="Fixed Charges"
                  value={billerItemData?.data?.fixed_commission}
                />
                <TopContainerItem
                  title="Percentage Charges"
                  value={billerItemData?.data?.percentage_commission}
                />
              </>
            )}
          <SeparateLine />
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
      </>
    );
  };

  const RBSheetItem = ({ title, value }: { title: string; value: string }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingVertical: 4,
        }}
      >
        <Text
          style={{ color: dark ? COLORS.grayscale400 : COLORS.grayscale400 }}
        >
          {title}
        </Text>
        <Text
          style={{ color: dark ? COLORS.grayscale100 : COLORS.greyscale900 }}
        >
          {value}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
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
        <Header title={`Pay ${billerItemData?.data?.paymentitemname} Bill`} />
        {/* <Header title={data.data} /> */}
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {renderTopContainer()}
        <View style={{ height: 20 }} />
        {billerItemsList?.data?.itemList && (
          <CustomPicker
            selectedValue={selectedBillerItemId}
            setSelectedValue={setSelectedBillerItemId}
            placeholder="-Select Biller Item-"
            options={billerItemsList?.data?.itemList}
          />
        )}
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
        {/* {!data?.data?.itemFee ||
          (data?.data?.itemFee === '0.00' && ( */}
        <Input
          id="amount"
          // value={
          //   data?.data?.itemFee !== null && data?.data?.itemFee !== '0.00'
          //     ? data?.data?.itemFee
          //     : formState.inputValues.amount
          // }
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['amount']}
          placeholder="Amount"
          placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          icon={icons.wallet}
          keyboardType="number-pad"
        />
        {/* ))} */}

        <Button
          title={'Confirm & Verify Bill'}
          filled
          isLoading={isValidating}
          disabled={isValidating}
          style={styles.continueBtn}
          onPress={handleValidateCustomer}
          // onPress={() => navigate('paybillssuccessful')}
        />
        {/* </ScrollView> */}
      </View>
      <RBSheet
        ref={rbSheetRef}
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
            ...styles.rbsheetContainer,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          },
        }}
        customModalProps={{
          animationType: 'fade',
          statusBarTranslucent: true,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'bold',
            color: dark ? COLORS.grayTie : COLORS.greyscale900,
            marginBottom: 12,
          }}
        >
          ₦{formState.inputValues.amount}
        </Text>
        {/* <RBSheetItem title="Bank" value="VFD Microfinance Bank" /> */}
        <RBSheetItem
          title="Bill's cost (NGN)"
          value={billerItemData?.data?.itemFee || '0.00'}
        />
        <RBSheetItem
          title="Charges applied (NGN)"
          value={
            billerItemData?.data.itemFee
              ? (
                  +applyCommission(
                    billerItemData?.data?.percentage_commission,
                    billerItemData?.data?.itemFee
                  ) - +billerItemData?.data?.itemFee
                )
                  .toFixed(2)
                  .toString()
              : '0.00'
          }
        />
        <RBSheetItem
          title="Net Bill Amount (NGN)"
          value={applyCommission(
            billerItemData?.data?.percentage_commission,
            billerItemData?.data?.itemFee
          )}
        />
        <RBSheetItem
          title="Remaining amount"
          value={
            billerItemData?.data?.itemFee
              ? (+billerItemData?.data?.itemFee - +formState.inputValues.amount)
                  .toFixed(2)
                  .toString()
              : '0.00'
          }
        />
        <Button
          title="Pay"
          isLoading={isBillPaying}
          onPress={handlePaymentClick}
          disabled={isBillPaying}
          filled
          style={{
            width: '100%',
            marginTop: 16,
            position: 'absolute',
            bottom: 16,
          }}
        />
      </RBSheet>
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
  rbsheetContainer: {
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    height: 322,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
});

export default BillReviewSummary;
