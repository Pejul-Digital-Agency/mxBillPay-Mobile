import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { COLORS, icons, SIZES } from '@/constants';
import { Image } from 'expo-image';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { getFormattedDate, getTimeFromDate } from '@/utils/date';

interface BillPaymentHistoryCardProps {
  name: string;
  // image?: ImageSourcePropType;
  category_icon: string;
  category: string;
  iconColor: string;
  date: string;
  amount: string;
  sign: 'negative' | 'positive';
  onPress: () => void;
}

const BillPaymentHistoryCard: React.FC<BillPaymentHistoryCardProps> = ({
  name,
  // image,
  category,
  category_icon,
  iconColor,
  date,
  amount,
  sign,
  onPress,
}) => {
  const { dark } = useTheme();
  console.log(amount);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
        },
      ]}
    >
      <View style={styles.viewLeftContainer}>
        <Image
          source={category_icon || icons.back}
          contentFit="contain"
          style={[styles.avatar, { tintColor: iconColor }]}
        />
        <View>
          <Text
            style={[
              styles.name,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            {name}
          </Text>
          <Text
            style={[
              styles.date,
              {
                color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
              },
            ]}
          >
            {getFormattedDate(date)} | {getTimeFromDate(date)}
          </Text>
        </View>
      </View>
      <View style={styles.viewContainer}>
        <Text
          style={[
            styles.price,
            {
              color: sign === 'positive' ? COLORS.primary : COLORS.red,
            },
          ]}
        >
          {amount}
        </Text>
        <View style={styles.typeContainer}>
          <SimpleLineIcons
            name={sign === 'negative' ? 'arrow-down-circle' : 'arrow-up-circle'}
            size={14}
            color={sign === 'positive' ? COLORS.primary : COLORS.red}
          />
          <Text
            style={[
              styles.type,
              {
                color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
              },
            ]}
          >
            {/* {category} */}
            {'Bill'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 40,
    height: 86,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  viewLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 58,
    width: 58,
    borderRadius: 999,
  },
  name: {
    fontSize: 12,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginLeft: 12,
    marginBottom: 6,
  },
  date: {
    fontSize: 10,
    fontFamily: 'regular',
    color: COLORS.grayscale700,
    marginLeft: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 12,
    marginBottom: 6,
  },
  type: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.grayscale700,
    marginLeft: 6,
  },
  typeContainer: {
    flexDirection: 'row',
  },
  viewContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

export default BillPaymentHistoryCard;
