import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Modal, Platform } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SIZES } from '@/constants';
import { IBillerItemsList } from '@/utils/queries/appQueries';

interface PickerProps {
  placeholder: string;
  selectedValue: IBillerItemsList['itemList'][0] | null; // Represents the full selected item
  setSelectedValue: (item: IBillerItemsList['itemList'][0]) => void;
  options: IBillerItemsList['itemList']; // List of all available items
}

export default function CustomPicker(props: PickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false); // To toggle dropdown modal
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredOptions, setFilteredOptions] = useState(props.options); // Filtered options list

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = props.options.filter((item) =>
      item.paymentitemname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOptions(filtered);
  };
  console.log("Place holder:", props.placeholder);
  console.log("selected item", props.selectedValue);


  const handleSelect = (item: IBillerItemsList['itemList'][0]) => {
    props.setSelectedValue(item); // Set selected item
    setIsModalVisible(false); // Close modal
    setSearchQuery(''); // Reset search query
    setFilteredOptions(props.options); // Reset filtered options
  };

  return (
    <View>
      {/* Display Selected Value */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          { borderColor: COLORS.greyscale500, backgroundColor: COLORS.greyscale500 },
        ]}
        onPress={() => setIsModalVisible(true)} // Open dropdown
      >
        <Image
          source={'https://cdn-icons-png.flaticon.com/512/7310/7310495.png'}
          style={{ width: 20, height: 20, marginRight: 10 }}
          tintColor="#BCBCBC"
          contentFit="contain"
        />
        <Text style={styles.selectedText}>
          {props.selectedValue && Object.keys(props.selectedValue).length > 0
            ? props.selectedValue.paymentitemname
            : props.placeholder}
        </Text>

      </TouchableOpacity>

      {/* Modal for Dropdown */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#BCBCBC"
              value={searchQuery}
              onChangeText={handleSearch}
            />

            {/* Render Filtered Options */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleSelect(item)} // Select item
                >
                  <Text style={styles.itemText}>{item.paymentitemname}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No items match your search</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  picker: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    fontSize: 10,
  },
  selectedText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginTop: Platform.OS === 'ios' ? 70 : 30, // Add more margin for iOS
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.greyscale500,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  //  marginTop: 10,
    paddingHorizontal: 10,
    fontSize: 13,
    color: COLORS.black,
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale500,
  },
  itemText: {
    fontSize: 13,
    color: COLORS.black,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.greyscale500,
  },
});
