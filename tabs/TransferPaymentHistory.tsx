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
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTrsansactionDetails } from '@/utils/queries/appQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import { ApiError } from '@/utils/customApiCall';


const TransferHistory = ({
  transferData,
}: {
  transferData: ITrasnferTransaction[];
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const { token, userAccount, userProfile } = useAppSelector(
    (state) => state.auth
  );
  const { mutate: getDetail, isPending: isBillPaying } = useMutation({
    mutationFn: getTrsansactionDetails,
    onSuccess: (data) => {
      console.log('transaction_data', data);
      navigate('inoutpaymentviewereceipt', {
        transactionData: data.data,
        billerItemData: data.data,
      });
    },
    onError: (error: ApiError) => {
      console.log(error);
      // setErrorModalText(error.message);
      // setErrorModal(true);
    },
  });
  const handleonPress = (id: string) => {
    console.log('onpress', id);
    getDetail({ id, token });
  };

  return (
    <FlatList
      data={transferData}
      keyExtractor={(item) => item.transaction_id.toString()}
      renderItem={({ item }) => (
        <TransferHistoryCard {...item} onPress={handleonPress} />
      )}
      scrollEnabled
      style={{ marginBottom: 2 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondaryWhite,
  },
});

export default TransferHistory;
