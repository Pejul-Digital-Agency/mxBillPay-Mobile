import React, { useState, FC, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import { COLORS, icons, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';
import * as DocumentPicker from 'expo-document-picker';

interface InputProps {
  icon?: string;
  errorText?: string;
  placeholder: string;
  onInputChanged: (document: any) => void;
}

const FileInput: FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { dark } = useTheme();
  const inputRef = React.useRef<TextInput>(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled) {
      const { size } = result.assets[0];
      if (size && size <= 2000000) {
        props.onInputChanged(result.assets[0]);
        setSelectedDocument(result.assets[0]);
      }
    }
  };

  const handleEditPress = () => {
    console.log('clicked');
    setIsEditing(true);
    // console.log(inputRef.current);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      setIsFocused(true);
    }
  }, [isEditing]);

  // console.log(props.id == 'occupation' && props.isEditable);

  return (
    <View style={styles.container}>
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
        <Text
          style={[
            styles.input,
            { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 },
          ]}
        >
          {selectedDocument ? selectedDocument.name : props.placeholder}
        </Text>
        {props.icon && (
          <TouchableOpacity
            onPress={pickDocument}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              //   paddingHorizontal: 10,
              justifyContent: 'center',
            }}
          >
            <Image
              source={props.icon}
              style={[
                styles.icon,
                {
                  tintColor: isFocused ? COLORS.primary : '#BCBCBC',
                },
              ]}
            />
          </TouchableOpacity>
        )}
        {/* <TextInput
          {...props}
          ref={inputRef}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: dark ? COLORS.white : COLORS.black }]}
          placeholder={props.placeholder}
          editable={props.isEditable ? isEditing : true}
          placeholderTextColor={props.placeholderTextColor}
          autoCapitalize="none"
        /> */}
        {/* {props.isEditable && !isEditing && (
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={handleEditPress}
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
        )} */}
      </View>
      {isFocused && props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
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
  icon: {
    // marginRight: 10,
    height: 25,
    width: 25,
    tintColor: '#BCBCBC',
  },
  editIconContainer: {
    position: 'absolute',
    zIndex: 10,
    aspectRatio: '1/1',
    height: '100%',
    right: 10,
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
    color: COLORS.black,
    flex: 1,
    fontFamily: 'regular',
    fontSize: 14,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default FileInput;
