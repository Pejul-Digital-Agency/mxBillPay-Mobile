import { View, Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';
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
  IBillerItemDetails,
  validateCustomer,
} from '@/utils/queries/billPayment';
import { useMutation } from '@tanstack/react-query';
import CustomModal from './custommodal';

const BillReviewSummary = () => {
  const { colors, dark } = useTheme();
  const { navigate } = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const [customerId, setCustomerId] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(true);
  if (!route.params) return navigate('/(tabs)');
  const { billerItemDetails }: { billerItemDetails: IBillerItemDetails } =
    route.params as any;
  const { mutate, isPending } = useMutation({
    mutationFn: validateCustomer,
    onSuccess: (data) => {
      console.log(data);
      //setModalOpen(true)
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handlePaymentClick = () => {
    console.log('clicked');
    setModalOpen(false);
    //navigate to success page
    // mutate({customerid: customerId})
  };

  console.log(billerItemDetails);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {
        <CustomModal
          btnText="Pay"
          modalVisible={modalOpen}
          setModalVisible={setModalOpen}
          title="Successfully validated your customer id, please click below to continue"
          onClick={handlePaymentClick}
        />
      }
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Electricity" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewViewContainer}>
            {/* <View style={styles.iconContainer}>
              <Image
                source={icons.electricity}
                contentFit="contain"
                style={styles.icon}
              />
            </View> */}
            <Text
              style={[
                styles.title,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              Pay {billerItemDetails?.paymentitemname} Bill
            </Text>
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
            <View style={styles.view}>
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
            </View>
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
          <Text
            style={[
              styles.idText,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Customer ID
          </Text>
          <TextInput
            value={customerId}
            onChangeText={setCustomerId}
            placeholder="37173838939"
            style={[
              styles.idInput,
              {
                backgroundColor: dark ? COLORS.dark2 : '#FAFAFA',
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
          />
          <Button
            title="Confirm & Pay Now"
            filled
            style={styles.continueBtn}
            onPress={() => navigate('paybillssuccessful')}
          />
        </ScrollView>
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
    marginTop: 22,
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
