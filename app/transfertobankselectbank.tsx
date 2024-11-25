import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { COLORS, icons, SIZES } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { ScrollView } from 'react-native-virtualized-view';
// import { bankData } from '@/data';
import BankItem from '@/components/BankItem';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { IBankDetails } from '@/utils/queries/appQueries';

const TransferToBankSelectBank = () => {
  const { navigate, goBack } = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  if (!route.params) {
    return goBack();
  }
  // console.log(route.params);
  const { data } = route.params as { data: IBankDetails[] };
  const { colors, dark } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [displayBanks, setDisplayBanks] = useState<IBankDetails[]>(data);

  useEffect(() => {
    if (searchText) {
      const filteredBanks = data.filter((bank) =>
        bank.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setDisplayBanks(filteredBanks);
    }
  }, [searchText]);
  const handleSelect = (bank: IBankDetails) => {
    navigate('transfertobankamountform', bank);
  };
  // const handleClickContinue = () => {
  //   if (!selectedBank) {
  //     return;
  //   }

  //   navigate('transfertobankamountform', selectedBank);
  // };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Transfer to Your Bank" />
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100,
            },
          ]}
        >
          <TouchableOpacity>
            <Image
              source={icons.search}
              contentFit="contain"
              style={[
                styles.searchIcon,
                {
                  tintColor: dark ? COLORS.greyscale600 : COLORS.grayscale400,
                },
              ]}
            />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              {
                color: dark ? COLORS.greyscale300 : COLORS.grayscale400,
              },
            ]}
            placeholder="Search"
            placeholderTextColor={
              dark ? COLORS.greyscale600 : COLORS.grayscale400
            }
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
        {/* <View style={styles.bankCardContainer}> */}
        <FlatList
          data={displayBanks || []}
          renderItem={({ item: bank }) => (
            <BankItem
              key={bank.id}
              icon={bank.logo || ''}
              bankName={bank.name}
              // type={bank.type}
              // lastCardNumber={bank.lastCardNumber}
              selected={false}
              onSelect={() => handleSelect(bank)}
            />
          )}
        />
        {/* {data.map((bank) => (
            <BankItem
              key={bank.id}
              icon={bank.logo || ''}
              bankName={bank.name}
              // type={bank.type}
              // lastCardNumber={bank.lastCardNumber}
              selected={false}
              onSelect={() => handleSelect(bank)}
            />
          ))} */}
        {/* </View> */}
        {/* <Button
          title="Link a New Card"
          style={[
            styles.cardBtn,
            {
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            },
          ]}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigate('addnewcard')}
        /> */}
        {/* </ScrollView> */}
      </View>
      {/* <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          style={styles.sendBtn}
          onPress={handleClickContinue}
          filled
          disabled={!selectedBank}
        />
      </View> */}
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
  searchBar: {
    width: SIZES.width - 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.grayscale100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.grayscale400,
  },
  input: {
    flex: 1,
    color: COLORS.grayscale400,
    marginHorizontal: 12,
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
