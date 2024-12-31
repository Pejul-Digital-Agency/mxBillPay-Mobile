import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
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
// import alert from '../assets/icons/alert-svgrepo-com.svg'
import CustomPicker from '@/components/Picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const { token, userAccount, userProfile } = useAppSelector(
    (state) => state.auth
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedBillerItemId, setSelectedBillerItemId] = React.useState('');
  const rbSheetRef = React.useRef<any>(null);
  const { userId } = useAppSelector((state) => state.auth);
  const [errorModal, setErrorModal] = React.useState(false);
  const [errorModalText, setErrorModalText] = React.useState('');
  const [modalButtonText, setModalButtonText] = React.useState('');
  const [btn2, setBtn2Status] = React.useState(false);
  const [userName, setUserName] = React.useState(userProfile?.firstName + " " + userProfile?.lastName);
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
      setUserName(data?.customerName ?? userProfile?.firstName + " " + userProfile?.lastName);;
      rbSheetRef?.current.open();
    },
    onError: (error) => {
      console.log(error.message);
      setErrorModalText(error.message);
      setModalButtonText('Close');
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
      console.log(error.data);
      setErrorModalText(error.message);
      setErrorModal(true);
      if (error.message == 'Insufficient balance') {
        setModalButtonText('Fund Wallet');
        setBtn2Status(true);

      } else {
        setModalButtonText('Close');
        setBtn2Status(false);
      }
    },
  });
  useEffect(() => {
    // console.log("loading category data")
    // console.log(categoryData);
  })
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
    if (categoryData.category == 'Airtime' || categoryData.category == 'Data') {

    } else {
      if (!formState.formIsValid) {
        showToast({
          type: 'error',
          text1: 'Fill all fields with valid data',
        });
        return;
      }

    }
    if (billerItemData) {

      const reqData = {
        amount:
          billerItemData.data?.amount !== null &&
            billerItemData.data?.amount !== 0
            ? billerItemData.data.amount
            : formState.inputValues.amount,
        billerId: billerItemData.data?.billerId,
        billerItemId: billerItemData.data?.id.toString(),
        customerId:
          categoryData.category == 'Airmtime' || categoryData.category == 'Data'
            ? formState.inputValues.phone
            : formState.inputValues.customerId,
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
    //navigate to fund wallet
    if (modalButtonText == 'Fund Wallet') {
      navigate('fundwallet');

    } else {
      console.log("modal closed with error ");
    }
  };

  const handleValidateCustomer = () => {
    if (!formState.inputValues.phone) {
      showToast({
        type: 'error',
        text1: 'Please enter a valid phone number',
      });
      return;
    }

    if (categoryData.category != 'Airtime' && categoryData.category != 'Data' && !formState.inputValues.customerId) {
      showToast({
        type: 'error',
        text1: 'Please enter a valid Customer Id',
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

    const customerId = categoryData.category == 'Airtime' || categoryData.category == 'Data'
      ? formState.inputValues.phone
      : formState.inputValues.customerId;

    validate({
      data: {
        customerId,
        id: selectedBillerItemId,
      },
      token,
    });
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
              {providerData.description || ` Pay ${providerData.title} bills safely, conveniently & easily.`}
              {/* Pay   {providerData.title} bills safely, conveniently & easily. */}
            </Text>

          </View>

          <SeparateLine />
        </View>
        <View style={[styles.viewContainer]}>
          <View style={styles.view}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.greyscale300 : COLORS.grayscale100,
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

  const RBSheetItem = ({
    title,
    value,
    isbold,
  }: {
    title: string;
    value: string;
    isbold?: boolean;
  }) => {
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
          style={{
            fontSize: 15,
            color: dark ? COLORS.grayscale400 : COLORS.primary,
            fontFamily: isbold ? 'bold' : 'regular',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: dark ? COLORS.grayscale100 : COLORS.primary,
            fontFamily: isbold ? 'bold' : 'regular',
          }}
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
          btnText={modalButtonText}
          modalVisible={errorModal}
          setModalVisible={setErrorModal}
          title={errorModalText}
          disabled={isBillPaying}
          onPress={handleErrorModal}
          icon={true}
          btn2={btn2}
        />
      }
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={10}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Header title={providerData.providerTitle || `Pay ${providerData?.title} Bill`} />
          {/* <Header title={data.data} /> */}
          {/* <ScrollView showsVerticalScrollIndicator={false}> */}
          {renderTopContainer()}
          <View style={{ height: 20 }} />
          {/* <Text> {billerItemData?.data.amount}</Text> */}
          {billerItemsList?.data?.itemList && (
            <CustomPicker
              selectedValue={selectedBillerItemId}
              setSelectedValue={setSelectedBillerItemId}
              placeholder={categoryData.selectTitle || 'Select Biller Item'
              }
              options={billerItemsList?.data?.itemList}
            />
          )}
          {categoryData.category != 'Airtime' && categoryData.category != 'Data' && (
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
          )}
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
              billerItemData?.data.amount && billerItemData?.data.amount !== 0
                ? billerItemData?.data.amount.toString()
                : formState.inputValues.amount
            }
            onInputChanged={inputChangedHandler}
            editable={billerItemData?.data.amount != 0} // Editable only if amount is not 0
            selectTextOnFocus={true} // Allows text selection on focus
            errorText={formState.inputValidities['amount']}
            placeholder="Amount"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.wallet}
            keyboardType="number-pad"
            style={{
              backgroundColor: billerItemData?.data.amount === 0 ? COLORS.white : COLORS.white,
            }}
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
      </KeyboardAwareScrollView>
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
        {/* <RBSheetItem title="Bank" value="VFD Microfinance Bank" /> */}
        <RBSheetItem
          title="Bill Name"
          value={billerItemData?.data?.paymentitemname || 'NA'}
        />
        <RBSheetItem
          title="Account Name"
          value={userName}
          isbold
        />
        <RBSheetItem
          title="Amount "
          value={formState.inputValues.amount || billerItemData?.data?.amount}
        // isbold
        />
        <RBSheetItem
          title="Charges applied "
          value={
            (parseFloat(applyCommission(billerItemData?.data?.percentage_commission, formState.inputValues.amount)) + parseFloat((billerItemData?.data?.fixed_commission))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        />
        <RBSheetItem
          title="Total Payment"
          value={
            (
              parseFloat(billerItemData?.data?.amount || formState.inputValues.amount) +
              parseFloat(
                applyCommission(
                  billerItemData?.data?.percentage_commission || '0',
                  billerItemData?.data?.amount || formState.inputValues.amount
                )
              ) +
              parseFloat(billerItemData?.data?.fixed_commission || '0') // Add fixed commission here
            )
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }


          isbold
        />
        <View
          style={[
            styles.viewContainer,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 8,
              paddingLeft: 8,
              // justifyContent: 'space-between',
            }}
          >
            <Image
              source={icons.wallet}
              contentFit="contain"
              style={{ width: 40, height: 40 }}
              tintColor={COLORS.white}
            />
            <Text
              style={{ fontFamily: 'bold', fontSize: 16, color: COLORS.white }}
            >
              Wallet Balance
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'regular',
              fontSize: 16,
              color: COLORS.white,
              paddingRight: 8,
            }}
          >
            ₦{userAccount?.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        </View>

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
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
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
    fontSize: 16,
    fontFamily: 'bold',
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
    backgroundColor: COLORS.grayscale100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidBtnText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.primary,
  },
  rbsheetContainer: {
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    height: 322,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
});

export default BillReviewSummary;
