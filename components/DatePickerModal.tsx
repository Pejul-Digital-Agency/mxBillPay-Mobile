import React, { useState, FC } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { COLORS } from '../constants';

const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

interface DatePickerModalProps {
  open: boolean;
  endDate: string;
  selectedDate: string;
  onClose: () => void;
  onChangeStartDate: (date: string) => void;
}

const DatePickerModal: FC<DatePickerModalProps> = ({
  open,
  endDate,
  selectedDate,
  onClose,
  onChangeStartDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(selectedDate);

  const handleDateChange = (date: string) => {
    setSelectedStartDate(date);
    onChangeStartDate(date);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DatePicker
            mode="calendar" // Changed from "calendar" to "datepicker"
            maximumDate={endDate}
            selected={selectedStartDate}
            onDateChange={handleDateChange}
            options={{
              backgroundColor: COLORS.primary,
              textHeaderColor: COLORS.white,
              textDefaultColor: '#FFFFFF',
              selectedTextColor: COLORS.primary,
              mainColor: COLORS.white,
              textSecondaryColor: '#FFFFFF',
              borderColor: COLORS.primary,
            }}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: 'white' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 0,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DatePickerModal;
