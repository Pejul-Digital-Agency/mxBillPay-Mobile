import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { inOutPaymentHistory } from '@/data';
import InOutPaymentHistoryCard from '@/components/InOutPaymentHistoryCard';
import { COLORS } from '@/constants';
import { ScrollView } from 'react-native-virtualized-view';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';

const InOutPaymentMyHistory = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    <View style={[styles.container, { 
      backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite }]}>
      <ScrollView style={{ marginVertical: 12 }}>
        <FlatList
          data={inOutPaymentHistory}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <InOutPaymentHistoryCard
              name={item.name}
              image={item.image}
              date={item.date}
              time={item.time}
              price={item.price}
              type={item.type}
              onPress={() => navigation.navigate("inoutpaymentviewereceipt")}
            />
          )}
        />
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondaryWhite
  }
})

export default InOutPaymentMyHistory