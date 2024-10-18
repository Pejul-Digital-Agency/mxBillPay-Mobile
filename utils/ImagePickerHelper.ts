import { Platform, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const launchImagePicker = async (): Promise<object | undefined> => {
  console.log('reached image picker');
  await checkMediaPermissions();
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  console.log(result);

  if (!result.canceled) {
    const { uri, fileName, mimeType } = result.assets[0];
    return { uri, fileName, mimeType };
  }
};

const checkMediaPermissions = async (): Promise<void> => {
  if (Platform.OS !== 'web') {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(permissionResult);

    if (!permissionResult.granted) {
      if (!permissionResult.canAskAgain) {
        // Redirect the user to the app settings to enable permission manually
        alert(
          'Permission is permanently denied. Please go to settings to enable it.'
        );
        Linking.openSettings();
        return Promise.reject('Permission permanently denied');
      }
      return Promise.reject('We need permission to access your photos');
    }
  }
  return Promise.resolve();
};
