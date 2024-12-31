// SettingsItem.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { SIZES, COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';

interface SettingsItemProps {
  icon: string;
  name: string;
  onPress: () => void;
  hasArrowRight?: boolean;
  subtitle?: string;
  color?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  name,
  onPress,
  hasArrowRight = true,
  subtitle,
  color,
}) => {
  const { dark } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={icon}
          contentFit="contain"
          {...color && { tintColor: color } 
        
        }
          style={[styles.icon, {   tintColor: color ? color : dark ? COLORS.white : COLORS.greyscale900 }]}
        />
        <View>
          <Text
            style={[
              styles.name,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {name}
          </Text>
          <Text
            style={{
              color: dark ? COLORS.white : COLORS.greyscale900,
              fontSize: 12,
              marginLeft: 12,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      {hasArrowRight && (
        <View style={{ borderWidth: 1, borderRadius: 12 }}>
          <Image
            source={icons.rightArrow}
            contentFit="contain"
            style={[
              styles.arrowRight,
              { tintColor: dark ? COLORS.white : COLORS.primary },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 29,
    width: 29,
    tintColor: COLORS.greyscale900,
  },
  name: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  arrowRight: {
    width: 45,
    height: 20,
  },
});

export default SettingsItem;
