import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import React from 'react';
import { COLORS, icons, SIZES } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';

interface PhoneInputProps extends TextInputProps {
  isEditable?: boolean;
  errorText?: string;
  onInputChanged: (id: string, text: string) => void;
}
const PhoneInput = (props: PhoneInputProps) => {
  //   const [modalVisible, setModalVisible] = React.useState(false);
  const [areas, setAreas] = React.useState<any[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const { dark } = useTheme();

  React.useEffect(() => {
    fetch('https://restcountries.com/v2/name/Nigeria')
      .then((response) => response.json())
      .then((data) => {
        // console.log('countries', data);
        let areaData = data.map((item: any) => {
          return {
            code: item.alpha2Code,
            item: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
          };
        });
        // console.log('AreaDta', areaData);
        setAreas(areaData);
        // if (areaData.length > 0) {
        //   let defaultData = areaData.filter((a: any) => a.code == 'US');

        //   if (defaultData.length > 0) {
        //     setSelectedArea(defaultData[0]);
        //   }
        // }
      });
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isEditing) {
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      setIsFocused(true);
    }
  }, [isEditing]);

  return (
    <>
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
        <TouchableOpacity
          style={styles.selectFlagContainer}
          // onPress={() => setModalVisible(true)}
        >
          {/* <View style={{ justifyContent: 'center' }}>
          <Image
            source={icons.down}
            contentFit="contain"
            style={styles.downIcon}
          />
        </View> */}
          <View style={{ justifyContent: 'center', marginLeft: 5 }}>
            <Image
              source={{ uri: areas.length > 0 && areas[0].flag }}
              contentFit="contain"
              style={styles.flagIcon}
            />
          </View>
          <View style={{ justifyContent: 'center', marginLeft: 5 }}>
            <Text
              style={{
                color: dark ? COLORS.white : '#111',
                fontSize: 12,
              }}
            >
              {areas.length > 0 && areas[0]?.callingCode}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Phone Number Text Input */}
        <TextInput
          {...props}
          ref={inputRef}
          style={[styles.input, { color: dark ? COLORS.white : COLORS.black }]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={(text) =>
            props.onInputChanged(
              'phoneNumber',
              `${areas.length > 0 && areas[0]?.callingCode}${text}`
            )
          }
          placeholderTextColor={dark ? COLORS.grayscale100 : COLORS.black}
          selectionColor="#111"
          keyboardType="numeric"
          editable={props.isEditable ? isEditing : true}
        />
        {props.isEditable && !isEditing && (
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={() => setIsEditing(true)}
          >
            <Image
              source={icons.edit}
              style={[
                styles.editIcon,
                {
                  tintColor: COLORS.primary,
                },
              ]}
            />
          </TouchableOpacity>
        )}
      </View>
      {isFocused && props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 10,
    height: 52,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: {
    width: 10,
    height: 10,
    tintColor: '#111',
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: 'row',
  },
  flagIcon: {
    width: 30,
    height: 30,
  },
  editIconContainer: {
    position: 'absolute',
    zIndex: 10,
    aspectRatio: '1/1',
    height: '100%',
    right: 0,
    // width: 'wi',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    zIndex: 10,
    height: 20,
    width: 20,
    tintColor: '#BCBCBC',
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: '#111',
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
