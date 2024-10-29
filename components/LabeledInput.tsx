import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import React from 'react';

type PropsTypes = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  placeholder: string;
};
const LabeledInput = ({ value, setValue, label, placeholder }: PropsTypes) => {
  const { dark } = useTheme();
  return (
    <React.Fragment>
      <Text
        style={[
          styles.idText,
          {
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={[
          styles.idInput,
          {
            backgroundColor: dark ? COLORS.dark2 : '#FAFAFA',
            color: dark ? COLORS.white : COLORS.greyscale900,
          },
        ]}
        placeholderTextColor={dark ? COLORS.grayscale100 : COLORS.greyscale900}
      />
    </React.Fragment>
  );
};

export default LabeledInput;

const styles = StyleSheet.create({
  idText: {
    fontSize: 17,
    marginLeft: 6,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginVertical: 12,
  },
  idInput: {
    width: SIZES.width - 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.greyscale900,
    paddingHorizontal: 12,
  },
});
