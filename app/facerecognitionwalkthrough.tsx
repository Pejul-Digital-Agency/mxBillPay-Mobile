import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons } from '@/constants';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';

type Nav = {
  navigate: (value: string) => void
}

const FaceRecognitionWalkthrough = () => {
  const { colors, dark } = useTheme();
  const { navigate } = useNavigation<Nav>();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title=" " />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Face Recognition</Text>
          <Text style={[styles.subtitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Add a face recognition to make your account more secure.</Text>
          <View style={styles.faceContainer}>
            <View style={styles.faceViewContainer}>
              <View style={styles.faceView}>
                <Image
                  source={icons.facialRecognition}
                  contentFit='contain'
                  style={styles.faceIcon}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Skip"
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            borderRadius: 32,
            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
          }}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigate("facerecognitionscan")}
        />
        <Button
          title="Start"
          filled
          style={styles.continueButton}
          onPress={() => navigate("facerecognitionscan")}
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 22
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.greyscale900,
    textAlign: "center",
    paddingHorizontal: 3
  },
  faceContainer: {
    height: SIZES.width - 32,
    width: SIZES.width - 32,
    borderRadius: 999,
    backgroundColor: "rgba(36,107,253,.08)",
    marginVertical: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  faceViewContainer: {
    height: SIZES.width - 116,
    width: SIZES.width - 116,
    borderRadius: 999,
    backgroundColor: "rgba(36,107,253,.12)",
    alignItems: "center",
    justifyContent: "center"
  },
  faceView: {
    height: 180,
    width: 180,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  faceIcon: {
    height: 100,
    width: 100,
    tintColor: COLORS.white
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center"
  },
  skipButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: "#F5E7FF",
    borderColor: "#F5E7FF"
  },
  continueButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
});

export default FaceRecognitionWalkthrough