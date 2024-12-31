import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

const TextOverlay = () => {
  return (
    <View style={styles.overlayContainer}>
      <Text style={styles.overlayText}>Hello</Text>
    </View>
  );
};

export default TextOverlay;

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlayText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: 'bold',
  },
});
