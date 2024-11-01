import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { COLORS, SIZES } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { ScrollView } from 'react-native-virtualized-view';
// import { bankData } from '@/data';
import BankItem from '@/components/BankItem';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { IBankDetails } from '@/utils/queries/billPayment';

const TransferToBankSelectBank = () => {
  const { navigate, goBack } = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  if (!route.params) {
    return goBack();
  }
  // console.log(route.params);
  const { data } = route.params as { data: IBankDetails[] };
  const { colors, dark } = useTheme();
  const [selectedBank, setSelectedBank] = useState<IBankDetails | null>(null);

  const handleSelect = (bank: IBankDetails) => {
    setSelectedBank(bank);
  };
  const handleClickContinue = () => {
    if (!selectedBank) {
      return;
    }

    navigate('transfertobankamountform', selectedBank);
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Transfer to Your Bank" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bankCardContainer}>
            {data.map((bank) => (
              <BankItem
                key={bank.id}
                icon={bank.logo || ''}
                bankName={bank.name}
                // type={bank.type}
                // lastCardNumber={bank.lastCardNumber}
                selected={bank.id === selectedBank?.id}
                onSelect={() => handleSelect(bank)}
              />
            ))}
          </View>
          <Button
            title="Link a New Card"
            style={[
              styles.cardBtn,
              {
                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              },
            ]}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => navigate('addnewcard')}
          />
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          style={styles.sendBtn}
          onPress={handleClickContinue}
          filled
          disabled={!selectedBank}
        />
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
  bankCardContainer: {
    marginTop: 16,
  },
  cardBtn: {
    width: SIZES.width - 32,
    marginTop: 20,
    backgroundColor: COLORS.transparentPrimary,
    borderColor: COLORS.tansparentPrimary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 28,
    right: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sendBtn: {
    width: SIZES.width - 32,
  },
});

export default TransferToBankSelectBank;
