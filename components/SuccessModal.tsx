import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Image } from 'expo-image';
import Button from './Button';
import React from 'react';
import { COLORS, illustrations, SIZES } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';

type ModalProps = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  onPress: () => void;
  buttonTitle?: string;
};

const SuccessModal = ({
  modalVisible,
  setModalVisible,
  onPress,
  buttonTitle,
}: ModalProps) => {
  const { dark } = useTheme();
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={[styles.modalContainer]}>
          <View
            style={[
              styles.modalSubContainer,
              {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
              },
            ]}
          >
            <Image
              source={illustrations.passwordSuccess}
              contentFit="contain"
              style={styles.modalIllustration}
            />
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text
              style={[
                styles.modalSubtitle,
                {
                  color: dark ? COLORS.grayTie : COLORS.greyscale900,
                },
              ]}
            >
              Your account has been created successfully. We will get back to
              you on your email as soon as your account is verified
            </Text>
            <Button
              title={buttonTitle || 'Continue'}
              filled
              onPress={onPress}
              style={{
                width: '100%',
                marginTop: 12,
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.black2,
    textAlign: 'center',
    marginVertical: 12,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22,
  },
});
