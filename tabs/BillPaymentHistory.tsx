import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { inOutPaymentHistory } from '@/data';
import InOutPaymentHistoryCard from '@/components/TransferHistoryCard';
import { COLORS } from '@/constants';
import { ScrollView } from 'react-native-virtualized-view';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import {
  IBillTransaction,
  ITrasnferTransaction,
} from '@/utils/queries/accountQueries';
import TransferHistoryCard from '@/components/TransferHistoryCard';
import BillPaymentHistoryCard from '@/components/BillPaymentHistoryCard';

const BillPaymentHistory = ({
  billPaymentData,
}: {
  billPaymentData: IBillTransaction[];
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
        },
      ]}
    >
      <ScrollView style={{ marginVertical: 12 }}>
        <FlatList
          data={billPaymentData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BillPaymentHistoryCard
              name={item.paymentitemname}
              category_icon={item.category_icon}
              iconColor={item.iconColor}
              sign={item.sign}
              // image={item.}
              date={item.transaction_date}
              amount={item.amount}
              category={item.category}
              onPress={() => navigation.navigate('inoutpaymentviewereceipt')}
            />
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondaryWhite,
  },
});

export default BillPaymentHistory;
