import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { useTheme } from '../theme/ThemeProvider';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { IBillerItemDetails } from '@/utils/queries/appQueries';
import { applyCommission } from '@/utils/helpers/commissionedFee';
import Button from '@/components/Button';
import { getUserProfile } from '@/utils/queries/accountQueries';
import { getFormatedDate } from 'react-native-modern-datepicker';
// import { useAppSelector } from '@/store/slices/authSlice';

// import { useAppSelector } from '@/store/slices/authSlice';
interface ReceiptData {
  status: string;
  item: string;
  amount: number;
  provider: string;
  category: string;
  transactionId: string;
  transactionDate: string;
  token?: string;
  totalAmount?: number;
}

const InOutPaymentViewEreceipt = () => {
  // const { token, userAccount, userProfile } = useAppSelector(
  //   (state) => state.auth
  // );
  const { navigate, reset, goBack } = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  if (!route.params || Object.keys(route.params).length == 0) {
    goBack();
    console.log("no params");
    return null;
  }

  const { transactionData, billerItemData } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { colors, dark } = useTheme();

  const dropdownItems = [
    { label: 'Share E-Receipt', value: 'share', icon: icons.shareOutline },
    {
      label: 'Download E-Receipt',
      value: 'downloadEReceipt',
      icon: icons.download2,
    },
    { label: 'Print', value: 'print', icon: icons.documentOutline },
  ];

  const handleDropdownSelect = (item: any) => {
    setSelectedItem(item.value);
    setModalVisible(false);

    // Perform actions based on the selected item
    switch (item.value) {
      case 'share':
        // Handle Share action
        setModalVisible(false);
        navigate('(tabs)');
        break;
      case 'downloadEReceipt':
        // Handle Download E-Receipt action
        setModalVisible(false);
        navigate('(tabs)');
        break;
      case 'print':
        // Handle Print action
        setModalVisible(false);
        navigate('(tabs)');
        break;
      default:
        break;
    }
  };

  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>

          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            E-Receipt
          </Text>
        </View>
      </View>
    );
  };
  /**
   * Render content
   */
  const renderContent = () => {
    const transactionId = 'SKD354822747'; // Replace with your actual transaction ID

    const handleCopyToClipboard = async () => {
      try {
        await Clipboard.setStringAsync(transactionData?.transactionId);
      } catch (error) {
        Alert.alert('Error!', 'Failed to copy transaction ID');
      }
    };

    const EntryRow = ({ title, value }: { title: string; value: string }) => {
      return (
        <View style={styles.viewContainer}>
          <Text
            style={[
              styles.viewLeft,
              {
                color: dark ? COLORS.grayscale400 : 'gray',
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.viewRight,
              {
                color: dark ? COLORS.white : COLORS.black,
                fontSize: value?.split(" ").length === 3 ? 13 : 16, // Adjust font size based on word count
              },
            ]}
          >
            {value}
          </Text>

        </View>
      );
    };

    return (
      <View style={{ marginBottom: 22 }}>

        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <EntryRow
            title="Amount Paid (NGN)"
            value={transactionData?.totalAmount?.toString()}
          />
          {transactionData?.token && (

            <View style={styles.viewContainer}>
              <Text
                style={[
                  styles.viewLeft,
                  {
                    color: dark ? COLORS.grayscale400 : 'gray',
                  },
                ]}
              >
                Token
              </Text>
              <View style={styles.copyContentContainer}>
                <Text style={styles.viewRight}>
                  {transactionData?.token?.toString().replace(/(\d{4})(?=\d)/g, "$1-")}
                </Text>

                <TouchableOpacity
                  style={{ marginLeft: 8 }}
                  onPress={handleCopyToClipboard}
                >
                  <MaterialCommunityIcons
                    name="content-copy"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <EntryRow title="Biller Category" value={transactionData?.category} />
          <EntryRow title="Biller Provider" value={transactionData?.provider} />
          <EntryRow title="Biller Item" value={transactionData?.item} />
        </View>

        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <EntryRow
            title="Transaction Date"
            value={getFormatedDate(transactionData?.transactionDate)}
          />

          <View style={styles.viewContainer}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.grayscale400 : 'gray',
                },
              ]}
            >
              Transaction ID
            </Text>
            <View style={styles.copyContentContainer}>
              <Text style={styles.viewRight}>
                {transactionData?.transactionId}
              </Text>
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={handleCopyToClipboard}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.viewContainer}>
            <Text
              style={[
                styles.viewLeft,
                {
                  color: dark ? COLORS.grayscale400 : 'gray',
                },
              ]}
            >
              Status
            </Text>
            <TouchableOpacity
              style={[
                styles.statusBtn,
                {
                  backgroundColor:
                    transactionData.status === 'completed' || transactionData.status === 'success'
                      ? COLORS.transparentPayment // Background for completed or success
                      : transactionData.status === 'pending'
                        ? 'yellow' // Background for pending
                        : COLORS.transparentRed, // Background for other statuses
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  {
                    color:
                      transactionData.status === 'completed' || transactionData.status === 'success'
                        ? 'white' // Text color for completed or success
                        : transactionData.status === 'pending'
                          ? 'black' // Text color for pending
                          : 'white', // Text color for other statuses
                  },
                ]}
              >
                {transactionData.status}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView
          style={[
            styles.scrollView,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
        <Button
          title="Go Back"
          onPress={() => {
            console.log('pressed');
            navigate('(tabs)');
          }}
          filled
        />
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ position: 'absolute', top: 112, right: 12 }}>
            <View
              style={{
                width: 202,
                padding: 16,
                backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
                borderRadius: 8,
              }}
            >
              <FlatList
                data={dropdownItems}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 12,
                    }}
                    onPress={() => handleDropdownSelect(item)}
                  >
                    <Image
                      source={item.icon as ImageSourcePropType}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 16,
                        tintColor: dark ? COLORS.white : COLORS.black,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'semiBold',
                        color: dark ? COLORS.white : COLORS.black,
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  scrollView: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.black,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  summaryContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },
  viewLeft: {
    fontSize: 16,
    fontFamily: 'regular',
    color: 'gray',
  },
  viewRight: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.black,
  },
  copyContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBtn: {
    width: 72,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',


    borderRadius: 6,
  },
  statusBtnText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
});

export default InOutPaymentViewEreceipt;
