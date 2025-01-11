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
  // onPress: () => void;
  onPress: (id: string) => void;
}

const TransferHistoryCard: React.FC<TransferHistoryCardProps> = ({
  category,
  item,
  logo,
  date,
  amount,
  status,
  transaction_id,
  onPress,
}) => {
  const { dark } = useTheme();
  // console.log(logo);
  return (
    <TouchableOpacity
      onPress={() => onPress(transaction_id.toString())}
      style={[
        styles.container,
        {
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
        },
      ]}
    >
      <View style={styles.viewLeftContainer}>
        <View style={{
          backgroundColor: COLORS.primary, width: 58,
          height: 58, borderRadius: 50, justifyContent: 'center', alignItems: 'center'
        }}>

          <Image
            source={logo || icons.wallet}
            contentFit="contain"
            tintColor={COLORS.white}
            style={styles.avatar}
          />
        </View>
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
                fontSize: 12
              },
            ]}
          >
            {item?.length > 15 ? `${item.substring(0, 15)}...` : item}
          </Text>

        </View>
      </View>
      <View style={styles.viewContainer}>
        <Text
          style={[
            styles.price,
            {
              color: dark ? COLORS.grayscale200 : COLORS.primary,
              // marginLeft:60
              textAlign:'right',
              marginRight:-30
            },
          ]}
        >
          {parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}         </Text>
        <Text
          style={[
            styles.price,
            {
              color: dark ? COLORS.grayscale200 : COLORS.primary,
              fontSize: 12
            },
          ]}
        >
          {getFormattedDate(date)}
        </Text>


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
    marginBottom: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 1
  },
  viewLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 34,
    width: 34,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
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
    fontSize: 14,
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
    textAlign:'right',
    rowGap: 4,
    alignItems: 'flex-end',
  },
});

export default TransferHistoryCard;
