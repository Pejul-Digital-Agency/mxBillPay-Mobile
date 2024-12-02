import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { SIZES, COLORS, icons } from '../constants';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { Image } from 'expo-image';
import CustomModal from '@/app/custommodal';

interface HeaderProps {
  title: string;
  backWarning?: boolean;
  cantGoBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, backWarning, cantGoBack }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [warningModalVisible, setWarningModalVisible] = React.useState(false);
  const { colors, dark } = useTheme();

  const handleBackPress = () => {
    if (!backWarning) {
      navigation.goBack();
      return;
    }
    setWarningModalVisible(true);
  };
  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          },
        ]}
      >
        {!cantGoBack && (
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={icons.back as ImageSourcePropType}
              contentFit="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: colors.text,
                },
              ]}
            />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      {
        <CustomModal
          modalVisible={warningModalVisible}
          setModalVisible={setWarningModalVisible}
          title="Your progress will be lost. Are you sure to leave this page?"
          btnText="Leave"
          btn2Text="Cancel"
          onPress2={() => setWarningModalVisible(false)}
          onPress={() => {
            navigation.goBack();
          }}
        />
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: SIZES.width - 32,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  } as ImageStyle,
  title: {
    fontSize: 22,
    fontFamily: 'bold',
    color: COLORS.black,
  } as TextStyle,
});

export default Header;
