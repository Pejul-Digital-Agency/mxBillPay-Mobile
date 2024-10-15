import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '@/constants';
import { ScrollView } from 'react-native-virtualized-view';
import { transactions } from '@/data';
import TransactionCard from '@/components/TransactionCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';

const CardTransactionsRoute = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    <View style={[styles.container, { 
      backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite
    }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 12 }}>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionCard
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondaryWhite
  }
})

export default CardTransactionsRoute