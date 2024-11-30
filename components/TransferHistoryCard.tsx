import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, icons, SIZES } from '@/constants';
import { Image } from 'expo-image';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { getFormattedDate, getTimeFromDate } from '@/utils/date';
import { ITrasnferTransaction } from '@/utils/queries/accountQueries';

interface TransferHistoryCardProps extends ITrasnferTransaction {
  onPress: () => void;
}

const TransferHistoryCard: React.FC<TransferHistoryCardProps> = ({
  category,
  item,
  logo,
  date,
  amount,
  status,
  onPress,
}) => {
  const { dark } = useTheme();
  console.log(logo);
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
          source={icons.wallet}
          contentFit="contain"
          tintColor={COLORS.primary}
          style={styles.avatar}
        />
        <View style={{ rowGap: 4 }}>
          <Text
            style={[
              styles.name,
              {
                color: dark ? COLORS.grayscale200 : COLORS.primary,
              },
            ]}
          >
            {category}
          </Text>
          <Text
            style={[
              styles.date,
              {
                color: dark ? COLORS.grayscale200 : COLORS.primary,
              },
            ]}
          >
            {item}
          </Text>
        </View>
      </View>
      <View style={styles.viewContainer}>
        <Text
          style={[
            styles.price,
            {
              color: dark ? COLORS.grayscale200 : COLORS.primary,
            },
          ]}
        >
          {amount}
        </Text>
        <Text
          style={[
            styles.price,
            {
              color: dark ? COLORS.grayscale200 : COLORS.primary,
            },
          ]}
        >
          {getFormattedDate(date)}
        </Text>

        {/* <View style={styles.typeContainer}>
          <SimpleLineIcons
            name={ty === 'negative' ? 'arrow-down-circle' : 'arrow-up-circle'}
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
            {type == 'inter' ? 'Bank' : 'Wallet'}
          </Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
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
    fontSize: 16,
    fontFamily: 'regular',
    marginLeft: 12,
    // marginBottom: 6,
  },
  date: {
    fontSize: 14,
    // fontFamily: 'bold',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  price: {
    fontSize: 16,
    fontFamily: 'bold',
    color: COLORS.primary,
    marginLeft: 12,
    // marginBottom: 6,
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
    rowGap: 4,
    alignItems: 'flex-end',
  },
});

export default TransferHistoryCard;
