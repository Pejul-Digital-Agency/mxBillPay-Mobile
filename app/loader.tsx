import { COLORS } from '@/constants';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Loader = () => {
  const { dark, colors } = useTheme();
  const mainCircle = useRef(new Animated.Value(0)).current;
  const beforeCircle = useRef(new Animated.Value(0)).current;
  const afterCircle = useRef(new Animated.Value(0)).current;

  const createAnimation = (animatedValue: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 900,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
  };

  useEffect(() => {
    createAnimation(mainCircle, 160).start();
    createAnimation(beforeCircle, 320).start();
    createAnimation(afterCircle, 0).start();
  }, []);

  const animatedStyle = (animatedValue: Animated.Value) => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[styles.circle, animatedStyle(beforeCircle), { left: -5 }]}
        />
        <Animated.View style={[styles.circle, animatedStyle(mainCircle)]} />
        <Animated.View
          style={[styles.circle, animatedStyle(afterCircle), { left: 5 }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Backdrop with 50% opacity
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensures it's on top of other content
  },
  loaderContainer: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: COLORS.payment,
  },
});

export default Loader;
