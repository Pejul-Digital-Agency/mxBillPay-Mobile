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
    console.log('onpress');
  };

  return (
    <FlatList
      data={transferData}
      keyExtractor={(item) => item.transaction_id.toString()}
      renderItem={({ item }) => (
        <TransferHistoryCard {...item} onPress={handleonPress} />
      )}
      scrollEnabled
      style={{ marginBottom: 12 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondaryWhite,
  },
});

export default TransferHistory;
