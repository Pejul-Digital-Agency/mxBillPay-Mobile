import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '@/constants';
import Card from '@/components/Card';
import { Image } from 'expo-image';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';

const CardDetailsRoute = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.viewContainer}>
        <Text style={[styles.viewLeft, {
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>Balance</Text>
        <Text style={[styles.viewRight, {
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>$225.50</Text>
      </View>
      <Card
        containerStyle={styles.card}
        number="•••• •••• •••• ••••"
        balance="10000"
        date="11/2029"
      />
      <Text style={[styles.midText, {
        color: dark ? COLORS.greyscale300 : COLORS.grayscale700
      }]}>Tap the card to see the number and CVV</Text>
      <View style={[styles.viewLineContainer, {
        backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite
      }]}>
        <View style={[styles.statsContainer, {
          backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite
        }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ecardtopup")}
            style={[styles.iconViewContainer, {
              backgroundColor: dark ? COLORS.dark1 : COLORS.white
            }]}>
            <View style={styles.iconContainer}>
              <Image
                source={icons.arrowDownSquare}
                contentFit='contain'
                style={styles.icon}
              />
            </View>
            <Text style={[styles.iconText, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Top Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ecardrefund")}
            style={[styles.iconViewContainer, {
              backgroundColor: dark ? COLORS.dark1 : COLORS.white
            }]}>
            <View style={styles.iconContainer}>
              <Image
                source={icons.arrowUpSquare}
                contentFit='contain'
                style={styles.icon}
              />
            </View>
            <Text style={[styles.iconText, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Refund</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.separateLine, {
          backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
        }]} />
        <View style={[styles.bottomViewContainer, {
          backgroundColor: dark ? COLORS.dark1 : COLORS.white
        }]}>
          <View style={styles.topViewContainer}>
            <Text style={[styles.limitText, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Limit Settings</Text>
            <View style={styles.editBtn}>
              <Image
                source={icons.edit3}
                contentFit='contain'
                style={styles.editIcon}
              />
              <Text style={styles.editBtnText}>Edit</Text>
            </View>
          </View>
          <View style={[styles.separateLine2, {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
          }]} />
          <View style={styles.viewBottomContainer}>
            <Text style={[styles.viewBottomLimitText, {
              color: dark ? COLORS.grayscale200 : COLORS.grayscale700
            }]}>Limit Per Transaction</Text>
            <Text style={[styles.limitAmount, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>$500</Text>
          </View>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12
  },
  viewLeft: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  viewRight: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  card: {
    width: SIZES.width - 32,
    borderRadius: 16,
    marginVertical: 6,
    backgroundColor: "rgba(254,157,43,255)"
  },
  midText: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 12,
    marginHorizontal: 16,
  },
  viewLineContainer: {
    backgroundColor: COLORS.secondaryWhite,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.secondaryWhite,
    paddingVertical: 8,
    paddingHorizontal: 6
  },
  iconViewContainer: {
    height: 72,
    width: (SIZES.width - 54) / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16
  },
  iconContainer: {
    height: 52,
    width: 52,
    borderRadius: 999,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary
  },
  iconText: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginHorizontal: 12
  },
  separateLine: {
    height: 1,
    width: SIZES.width - 32,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  bottomViewContainer: {
    height: 112,
    width: SIZES.width - 44,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    marginBottom: 22
  },
  topViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 0
  },
  limitText: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  editBtn: {
    width: 72,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 16
  },
  editIcon: {
    height: 14,
    width: 14,
    tintColor: COLORS.white
  },
  editBtnText: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.white,
    marginHorizontal: 8
  },
  separateLine2: {
    height: 1,
    width: "100%",
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12,
  },
  viewBottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  viewBottomLimitText: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700
  },
  limitAmount: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900
  }
})

export default CardDetailsRoute