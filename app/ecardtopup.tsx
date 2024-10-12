import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { Image } from 'expo-image';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-virtualized-view';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Slider from '@react-native-community/slider';

const EcardTopup = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const [price, setPrice] = useState<number>(0);

  /**
 * Render header
 */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              contentFit='contain'
              style={[styles.headerLogo, { 
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Top Up E-Card</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Image
              source={icons.moreCircle}
              contentFit='contain'
              style={[styles.searchIcon, {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card
            containerStyle={styles.card}
            number="•••• •••• •••• ••••"
            balance="10000"
            date="11/2029"
          />
          <Text style={[styles.inputTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Top Up Amount</Text>
          <TextInput
            placeholder='$7,500'
            placeholderTextColor={dark ? COLORS.white : COLORS.greyscale900}
            style={[styles.input, { 
              backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
              color: dark? COLORS.white : COLORS.greyscale900
            }]}
            value={`$${price}`}
            editable={true}
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={15000}
            step={1}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray}
            thumbTintColor={COLORS.primary}
            value={price}
            onValueChange={(value) => setPrice(value)}
          />
          <Button
            title="Continue"
            filled
            style={styles.btnContinue}
            onPress={()=>navigation.goBack()}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerLogo: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 12
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12
  },
  card: {
    width: SIZES.width - 32,
    borderRadius: 16,
    marginVertical: 6
  },
  inputTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginVertical: 8
  },
  input: {
    height: 52,
    width: SIZES.width - 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondaryWhite,
    fontSize: 16,
    fontFamily: "regular",
    paddingHorizontal: 12
  },
  btnContinue: {
    marginVertical: 32
  },
  slider: {
    width: '100%',
    height: 40,
  },
})

export default EcardTopup