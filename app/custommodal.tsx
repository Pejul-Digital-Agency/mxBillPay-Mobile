import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, FONTS } from '@/constants';

interface modalProps extends React.ComponentProps<typeof TouchableOpacity> {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  btnText: string;
}

const CustomModal = ({
  modalVisible,
  setModalVisible,
  title,
  btnText,
  ...props
}: modalProps) => {
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      transparent
      // onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={{ textAlign: 'center', ...FONTS.h3 }}>{title}</Text>
          <TouchableOpacity style={styles.modalButton} {...props}>
            <Text style={styles.modalButtonText}>{btnText}</Text>
          </TouchableOpacity>
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
