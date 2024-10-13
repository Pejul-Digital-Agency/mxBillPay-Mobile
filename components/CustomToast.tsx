import { View, Text } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '@/constants';
import { BaseToast } from 'react-native-toast-message';

interface CustomToastProps extends React.ComponentProps<typeof BaseToast> {
  props: {
    customStyle?: {
      backgroundColor?: string; // Optional background color
      borderLeftColor?: string; // Optional left border color
      textColor?: string; // Optional text color
    };
  };
}

const CustomToast: React.FC<CustomToastProps> = (props) => {
  //   console.log(props.props);
  return (
    <BaseToast
      {...props}
      style={{
        borderLeftColor:
          props.props.customStyle?.borderLeftColor || COLORS.success, // Default value if not provided
        backgroundColor: props.props.customStyle?.backgroundColor || 'white', // Default value if not provided
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: props.props.customStyle?.textColor || 'black',
      }}
    />
  );
};

export default CustomToast;
