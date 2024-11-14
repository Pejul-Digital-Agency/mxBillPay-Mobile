import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { COLORS, icons } from '@/constants';

interface Props extends React.ComponentProps<typeof TouchableOpacity> {
  iconName: keyof typeof icons;
  title: string;
}
const AccountOption = (props: Props) => {
  return (
    <TouchableOpacity {...props} style={styles.categoryContainer}>
      <View style={styles.categoryIconContainer}>
        <Image
          source={icons[props.iconName]}
          contentFit="contain"
          style={styles.categoryIcon}
        />
      </View>
      <Text numberOfLines={2} style={styles.categoryText}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default AccountOption;

const styles = StyleSheet.create({
  categoryContainer: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    height: 52,
    width: 52,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tansparentPrimary,
    marginBottom: 4,
  },
  categoryIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: COLORS.primary,
  },
});
