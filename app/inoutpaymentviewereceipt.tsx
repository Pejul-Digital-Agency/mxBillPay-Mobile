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

interface ReceiptData {
  status: string;
  item: string;
  amount: number;
  provider: string;
  category: string;
  transactionId: string;
  transactionDate: string;
}

const InOutPaymentViewEreceipt = () => {
  const { navigate, reset, goBack } = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();
  if (!route.params || Object.keys(route.params).length == 0) return goBack();
  const {
    transactionData,
    billerItemData,
  }: { transactionData: ReceiptData; billerItemData: IBillerItemDetails } =
    route.params as any;
  if (!transactionData || !billerItemData) return goBack();
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
          {/* <TouchableOpacity onPress={() => goBack()}>
            <Image
              source={icons.back as ImageSourcePropType}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.black,
                },
              ]}
            />
          </TouchableOpacity> */}
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
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={icons.moreCircle as ImageSourcePropType}
            resizeMode="contain"
            style={[
              styles.moreIcon,
              {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.black,
              },
            ]}
          />
        </TouchableOpacity>
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
              },
            ]}
          >
            {value}
          </Text>
        </View>
      );
    };

    return (
      <View style={{ marginVertical: 22 }}>
        <Barcode
          format="EAN13"
          value="0123456789012"
          text="0123456789012"
          width={SIZES.width - 64}
          height={72}
          style={{
            marginBottom: 4,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          }}
          lineColor={dark ? COLORS.white : COLORS.black}
          textStyle={{
            color: dark ? COLORS.white : COLORS.black,
          }}
          maxWidth={SIZES.width - 64}
        />
        <View
          style={[
            styles.summaryContainer,
            {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              borderRadius: 6,
            },
          ]}
        >
          <EntryRow title="Bill Amount (NGN)" value={billerItemData?.itemFee} />
          <EntryRow
            title="Percentage Charges"
            value={billerItemData?.percentage_commission}
          />
          <EntryRow
            title="Net Bill Amount (NGN)"
            value={applyCommission(
              billerItemData?.percentage_commission,
              billerItemData?.itemFee
            )}
          />
          <EntryRow
            title="Amount Paid (NGN)"
            value={transactionData?.amount.toFixed(2).toString()}
          />
          <EntryRow
            title="Remaining Bill Amount (NGN)"
            value={(
              +applyCommission(
                billerItemData?.percentage_commission,
                billerItemData?.itemFee
              ) - transactionData?.amount
            ).toString()}
          />
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
          <EntryRow title="Country" value={'Nigeria'} />
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
            value={transactionData?.transactionDate}
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
            <TouchableOpacity style={styles.statusBtn}>
              <Text style={styles.statusBtnText}>Paid</Text>
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
            reset({ index: 0, routes: [{ name: 'tabs' }] });
            navigate('(tabs)');
          }}
          filled
        />
      </View>
      {/* Modal for dropdown selection */}
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
    fontSize: 12,
    fontFamily: 'regular',
    color: 'gray',
  },
  viewRight: {
    fontSize: 14,
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
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 6,
  },
  statusBtnText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
});

export default InOutPaymentViewEreceipt;
