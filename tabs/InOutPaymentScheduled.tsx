import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS } from '@/constants';
import { inOutPaymentScheduled } from '@/data';
import InOutPaymentScheduledCard from '@/components/InOutPaymentScheduledCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';

const InOutPaymentScheduled = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    <View style={[styles.container, { 
      backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite }]}>
      <ScrollView style={{ marginVertical: 12 }}>
        <FlatList
          data={inOutPaymentScheduled}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <InOutPaymentScheduledCard
              name={item.name}
              image={item.image}
              date={item.date}
              time={item.time}
              price={item.price}
              type={item.type}
              status={item.status}
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

export default InOutPaymentScheduled