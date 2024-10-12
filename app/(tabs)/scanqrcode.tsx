import { BarcodeScanningResult, Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useTheme } from '@/theme/ThemeProvider';

const ScanQRCode = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [facing, setFacing] = useState<any>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string>('');
  const { dark } = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setScannedData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={[styles.area, {
      backgroundColor: dark ? COLORS.dark1 : "#1F222A"
    }]}>
      <View style={[styles.container, {
        backgroundColor: dark ? COLORS.dark1 : "#1F222A"
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            contentFit='contain'
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Scan QR Code</Text>
          <Text style={styles.subtitle}>Point the camera box at the QR Code to scan</Text>
          <View style={styles.scanView}>
            <View style={styles.scanContainer}>
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                facing={facing}
                style={styles.camera}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}>
              </CameraView>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.btn}>
          <Image
            source={icons.image2}
            contentFit='contain'
            style={styles.btnIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("userallpay")}
          style={styles.cameraBtn}>
          <Image
            source={icons.scan2}
            contentFit='contain'
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Image
            source={icons.folder2}
            contentFit='contain'
            style={styles.btnIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#1F222A"
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1F222A"
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginVertical: 22
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.white,
    textAlign: "center",
    paddingHorizontal: 3
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: COLORS.white
  },
  scanView: {
    alignItems: "center",
    marginVertical: 64
  },
  scanContainer: {
    width: 332,
    height: 332,
    borderRadius: 32,
    backgroundColor: COLORS.white
  },
  cardImage: {
    width: 340,
    height: 340,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 112,
    right: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 64
  },
  btn: {
    height: 56,
    width: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.grayscale100
  },
  btnIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary
  },
  cameraBtn: {
    height: 108,
    width: 108,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    height: 44,
    width: 44,
    tintColor: COLORS.white
  },
  camera: {
    width: SIZES.width - 32,
    height: SIZES.width - 32,
  }
})

export default ScanQRCode