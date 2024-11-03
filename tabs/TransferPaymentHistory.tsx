import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { inOutPaymentHistory } from '@/data';
import InOutPaymentHistoryCard from '@/components/TransferHistoryCard';
import { COLORS } from '@/constants';
import { ScrollView } from 'react-native-virtualized-view';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { ITrasnferTransaction } from '@/utils/queries/accountQueries';
import TransferHistoryCard from '@/components/TransferHistoryCard';

const TransferHistory = ({
  transferData,
}: {
  transferData: ITrasnferTransaction[];
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();
const handleonPress = () => {
  console.log("onpress")
}
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
          data={transferData}
          keyExtractor={(item) => item.transaction_id.toString()}
          renderItem={({ item }) => (
            <TransferHistoryCard
              name={item.to_client_name}
              sign={item.sign}
              // image={item.}
              date={item.transaction_date}
              amount={item.amount}
              type={item.transaction_type}
              onPress={handleonPress}
            />
            // <TransferHistoryCard
            //   name={item.to_client_name}
            //   sign={item.sign}
            //   // image={item.}
            //   date={item.transaction_date}
            //   amount={item.amount}
            //   type={item.transaction_type}
            //   onPress={() => navigation.navigate('inoutpaymentviewereceipt', { id: item.transaction_id })}
            // />
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

export default TransferHistory;
