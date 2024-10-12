import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { COLORS, SIZES, icons, images } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { ScrollView } from 'react-native-virtualized-view';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';

type Nav = {
  navigate: (value: string) => void
}

const TransferToBankReviewSummary = () => {
  const { colors, dark } = useTheme();
  const { navigate } = useNavigation<Nav>();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Review Summary" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.separateLine, {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
          }]} />
          <Text style={[styles.amount, {
            color: dark ? COLORS.white : COLORS.greyscale900,
          }]}>$1,000</Text>
          <View style={[styles.separateLine, {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
          }]} />
          <Text style={[styles.reviewText, {
            color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
          }]}>From</Text>
          <View style={styles.bankContainer}>
            <Image
              source={images.logo}
              contentFit='contain'
              style={styles.logoIcon} />
            <View>
              <Text style={[styles.bankName, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Payza Balance</Text>
              <Text style={[styles.bankAmount, {
                color: dark ? COLORS.greyscale300 : COLORS.greyScale800
              }]}>Available: $9,479.25</Text>
            </View>
          </View>
          <Text style={[styles.reviewText, {
            color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
          }]}>To</Text>
          <View style={styles.bankContainer}>
            <Image
              source={icons.bank}
              contentFit='contain'
              style={styles.logoIcon} />
            <View>
              <Text style={[styles.bankName, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Bank of America</Text>
              <Text style={[styles.bankAmount, {
                color: dark ? COLORS.greyscale300 : COLORS.greyScale800
              }]}>Checking ●●●● 4679</Text>
            </View>
          </View>
          <View style={[styles.separateLine, {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
          }]} />
          <View style={[styles.viewContainer, {
            backgroundColor: dark ? COLORS.dark2 : "#FAFAFA",
          }]}>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: dark ? COLORS.greyscale300 : COLORS.grayscale700
              }]}>Transfer Amount (USD)</Text>
              <Text style={[styles.viewRight, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>$1,000</Text>
            </View>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: dark ? COLORS.greyscale300 : COLORS.grayscale700
              }]}>Fee</Text>
              <Text style={[styles.viewRight, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Free</Text>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
            }]} />
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: dark ? COLORS.greyscale300 : COLORS.grayscale700
              }]}>You will get:</Text>
              <Text style={[styles.viewRight, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>$1,000.00</Text>
            </View>
          </View>
          <Text style={[styles.amountDate, {
            color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
            marginTop: 12
          }]}>Estimated arrival: 3 business days</Text>
          <Text style={[styles.amountTime, {
            color: dark ? COLORS.greyscale300 : COLORS.grayscale700
          }]}>Transfers made after 7.00 PM ET or on weekends or holidays take longer. All transfers are subject to review & could be delayed or stopped if we identify an issue.</Text>
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Continue"
          style={styles.sendBtn}
          onPress={() => navigate("transfertobanksuccessful")}
          filled
        />
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
    padding: 16,
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12
  },
  amount: {
    fontSize: 48,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginVertical: 12,
    textAlign: "center"
  },
  reviewText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyScale800,
    marginVertical: 12,
  },
  bankContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4
  },
  logoIcon: {
    height: 60,
    width: 60,
    marginRight: 16,
    tintColor: COLORS.primary
  },
  bankName: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 6,
  },
  bankAmount: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyScale800
  },
  viewContainer: {
    width: SIZES.width - 32,
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 6,
    marginVertical: 2
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700
  },
  viewRight: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  amountDate: {
    fontSize: 13,
    fontFamily: "medium",
    color: COLORS.grayscale700,
    marginBottom: 8
  },
  amountTime: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.grayscale700,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 28,
    right: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  sendBtn: {
    width: SIZES.width - 32
  },
})

export default TransferToBankReviewSummary