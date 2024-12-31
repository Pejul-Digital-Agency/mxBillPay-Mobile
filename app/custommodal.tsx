import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, FONTS, icons, images } from '@/constants';
import { Image } from 'expo-image';

interface modalProps extends React.ComponentProps<typeof TouchableOpacity> {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  btnText: string;
  btn2Text?: string;
  onPress2?: () => void;
  icon?: boolean;
  btn2?: boolean;
}

const CustomModal = ({
  modalVisible,
  setModalVisible,
  title,
  btnText,
  btn2Text,
  onPress2,
  icon,
  btn2,
  ...props
}: modalProps) => {
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      transparent
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {icon && (
            <Image source={images.alert} style={styles.alertIcon} />
          )}
          <Text style={{ textAlign: 'center', ...FONTS.h3 }}>{title}</Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: btn2Text ? 'space-between' : 'center',
            }}
          >
              {
              btn2 && (
                <TouchableOpacity style={[styles.modalButton,{marginRight:10}]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              )
            }
            <TouchableOpacity
              style={[styles.modalButton, { width: btn2Text ? '40%' : '50%' }]}
              {...props}
            >
              <Text style={styles.modalButtonText}>{btnText}</Text>
            </TouchableOpacity>
          
            {btn2Text && (
              <TouchableOpacity style={styles.modalButton} onPress={onPress2}>
                <Text style={styles.modalButtonText}>{btn2Text}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    alignItems: 'center',
    borderRadius: 15,
  },
  alertIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: '50%',
    marginTop: 20,
  },
  modalButtonText: {
    textAlign: 'center',
    color: COLORS.white,
    lineHeight: 17,
  },
});
