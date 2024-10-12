import { COLORS, SIZES } from '@/constants';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BannerItemProps {
    discount: string;
    discountName: string;
    bottomTitle: string;
    bottomSubtitle: string;
    primaryColor: string;
    secondaryColor: string;
}

const BannerItem: React.FC<BannerItemProps> = ({ 
    discount, 
    discountName, 
    bottomSubtitle, 
    bottomTitle,
    primaryColor,
    secondaryColor
}) => {
  return (
    <LinearGradient 
      colors={[primaryColor, secondaryColor]}
      style={styles.bannerContainer}>
      <View style={styles.bannerTopContainer}>
        <View>
          <Text style={styles.bannerDiscount}>{discount} OFF</Text>
          <Text style={styles.bannerDiscountName}>{discountName}</Text>
        </View>
        <Text style={styles.bannerDiscountNum}>{discount}</Text>
      </View>
      <View style={styles.bannerBottomContainer}>
        <Text style={styles.bannerBottomTitle}>{bottomTitle}</Text>
        <Text style={styles.bannerBottomSubtitle}>{bottomSubtitle}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        marginBottom: 20
      },
      bannerTopContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
      bannerDiscount: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.white,
        marginBottom: 4
      },
      bannerDiscountName: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.white
      },
      bannerDiscountNum: {
        fontSize: 46,
        fontFamily: "bold",
        color: COLORS.white
      },
      bannerBottomContainer: {
        marginTop: 8
      },
      bannerBottomTitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.white
      },
      bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.white,
        marginTop: 4
      },
});

export default BannerItem;
