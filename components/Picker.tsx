import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SIZES } from '@/constants';
// import { IBillerItemsList } from '@/utils/queries/appQueries';
import { Image } from 'expo-image';
import { IBillerItemsList } from '@/utils/queries/appQueries';

interface PickerProps {
  placeholder: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  options: IBillerItemsList['itemList'];
}

export default function CustomPicker(props: PickerProps) {
  const [isFocused, setIsFocused] = useState(false);
  const dark = false; // Change based on your theme

  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderColor: isFocused
            ? COLORS.primary
            : dark
            ? COLORS.dark2
            : COLORS.greyscale500,
          backgroundColor: isFocused
            ? COLORS.tansparentPrimary
            : dark
            ? COLORS.dark2
            : COLORS.greyscale500,
        },
      ]}
    >
      <Image
        source={'https://cdn-icons-png.flaticon.com/512/7310/7310495.png'}
        style={{ width: 20, height: 20 }}
        tintColor={isFocused ? COLORS.primary : '#BCBCBC'}
        contentFit="contain"
      />
      <Picker
        selectedValue={props.selectedValue}
        onValueChange={(itemValue) => props.setSelectedValue(itemValue)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.picker,
          {
            color:COLORS.black
          },
        ]}
        dropdownIconColor={isFocused ? COLORS.primary : '#BCBCBC'}
      >
        <Picker.Item
          enabled={false}
          label={props.placeholder}
          value=""
          color="#BCBCBC"
        />
        {props.options.map((item) => (
          <Picker.Item
            key={item.id.toString()}
            label={item.paymentitemname}
            value={item.id.toString()}
            color={
              props.selectedValue === item.id.toString()
                ? COLORS.grayscale700
                : COLORS.black
            }
            style={{fontSize:13}}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    position: 'relative',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    fontSize: 16,
  },
});
