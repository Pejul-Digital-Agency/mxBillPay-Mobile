import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SIZES } from '@/constants';
import { IBillerItemsList } from '@/utils/queries/appQueries';

interface PickerProps {
  placeholder: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  options: IBillerItemsList['itemList'];
}

export default function CustomPicker(props: PickerProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
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
      <Picker
        selectedValue={props.selectedValue}
        onValueChange={(itemValue) => props.setSelectedValue(itemValue)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.picker,
          {
            color: dark
              ? selectedValue == ''
                ? COLORS.grayscale200
                : COLORS.white
              : !dark
              ? COLORS.grayscale700
              : COLORS.greyscale900,
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
              selectedValue === item.id.toString() ? COLORS.primary : '#BCBCBC'
            }
          />
        ))}
        {/* <Picker.Item label="Option 1" value="option1" color="blue" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" /> */}
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
