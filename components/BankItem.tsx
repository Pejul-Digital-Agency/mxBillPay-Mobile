import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';

interface BankItemProps {
  icon: any;
  bankName: string;
  // type: string;
  // lastCardNumber: string;
  selected: boolean;
  onSelect: () => void;
}

const BankItem: React.FC<BankItemProps> = ({
  icon,
  bankName,
  selected,
  onSelect,
}) => {
  const { dark } = useTheme();

  return (
    <TouchableOpacity onPress={onSelect}>
      <View
        style={[
          styles.container,
          {
            borderBottomColor: dark ? COLORS.greyscale900 : COLORS.grayscale200,
          },
        ]}
      >
        <View style={styles.leftContainer}>
          <Image
            source={icon || icons.bank}
            contentFit="contain"
            style={styles.icon}
          />
          <View>
            <Text
              style={[
                styles.bankName,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
              // numberOfLines={2}
            >
              {bankName}
            </Text>
            {/* <Text style={[styles.type, {
                            color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                        }]}>{type} ●●●● {lastCardNumber}</Text> */}
          </View>
        </View>
        {selected && (
          <Image
            source={icons.check3}
            contentFit="contain"
            style={styles.checkIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 50,
    width: 50,
    marginRight: 16,
    borderRadius: 50,
  },
  bankName: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginBottom: 6,
  },
  type: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyScale800,
  },
  checkIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
  },
});

export default BankItem;
