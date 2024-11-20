import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, FONTS } from '@/constants';

interface modalProps extends React.ComponentProps<typeof TouchableOpacity> {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  btnText: string;
  btn2Text?: string;
  onPress2?: () => void;
}

const CustomModal = ({
  modalVisible,
  setModalVisible,
  title,
  btnText,
  btn2Text,
  onPress2,
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
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: btn2Text ? 'space-between' : 'center',
            }}
          >
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
