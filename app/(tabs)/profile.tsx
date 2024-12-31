import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Alert,
} from 'react-native';
// import React, { useState, useEffect } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { MaterialIcons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '@/components/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, SIZES, icons, images } from '@/constants';
import { Image } from 'expo-image';
import SettingsItem from '@/components/SettingsItem';
// import { launchImagePicker } from '@/utils/ImagePickerHelper';
import { useNavigation } from 'expo-router';
import { authSliceActions, useAppDispatch } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/slices/authSlice';
import { NavigationProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

type Nav = {
  navigate: (value: string) => void;
};

const Profile = () => {
  const refRBSheet = useRef<any>(null);
  const refRBSheet2 = useRef<any>(null);
  const { dark, colors, setScheme } = useTheme();
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const { token, userProfile, userAccount } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    // Dispatch clearToken to reset auth state
    await SecureStore.deleteItemAsync('authCredentials');
    dispatch(authSliceActions.clearToken());
    dispatch(authSliceActions.setUser({}));
    // Reset navigation stack and navigate to login screen
    reset({
      index: 0,
      routes: [{ name: 'login' }],
    });
  };

  const handleDelete = async () => {


    try {
      const response = await axios.get('https://mxbillpay.hmstech.org/api/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`, // Replace with the actual token logic
        },
      });

      if (response.status === 200) {
        Alert.alert('Account Deleted', 'Your account has been successfully deleted.');

        // Dispatch actions to reset auth state
        dispatch(authSliceActions.clearToken());
        dispatch(authSliceActions.setUser({}));

        // Reset navigation stack and navigate to login screen
        reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
      } else {
        Alert.alert('Error', 'Failed to delete the account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'An error occurred while deleting your account. Please try again later.');
    }
  };
  const renderTopContainer = () => {
    return (
      <>
        <View style={styles.topContainer}>
          <View style={styles.userInfo}>
            <View style={styles.userDetails}>
              <Image
                source={userProfile?.profilePicture || images.profile}
                contentFit="cover"
                style={styles.profilePicture}
              />
              {/* <Text style={{color: COLORS.white}} >{userProfile?.profilePicture}</Text> */}
              <Text style={styles.greetingText}>
                {'Hi, ' + userProfile?.firstName + ' ' + userProfile?.lastName}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: COLORS.grayscale200 },
      ]}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: COLORS.grayscale200, position: 'relative' },
        ]}
      >
        <View
          style={{
            padding: 16,
            height: 210,
            zIndex: -1,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: COLORS.primary,
          }}
        >
          {renderTopContainer()}
        </View>

        <ScrollView
          contentContainerStyle={{ marginHorizontal: 10, marginBottom: 20 }}
          style={{ zIndex: 100, marginTop: -70 }}
        >
          <View style={[styles.sectionContainer, { zIndex: 100 }]}>
            <SettingsItem
              icon={icons.profile2}
              name="Edit Profile"
              onPress={() => navigate('editprofile')}
              subtitle="Update your profile details"
            />
            <SettingsItem
              icon={icons.bell}
              name="Notification Settings"
              onPress={() => navigate('settingsnotifications')}
              subtitle="Manage your notifications"
            />
            <SettingsItem
              icon={icons.shield}
              name="Security"
              subtitle="Protect your account"
              onPress={() => navigate('settingssecurity')}
            />
          </View>
          <View style={styles.sectionContainer}>
            <SettingsItem
              icon={images.infoCircleFilled}
              name="Help Center"
              onPress={() => navigate('settingshelpcenter')}
              subtitle="Contact our support team"
            />
            <SettingsItem
              icon={icons.lock2}
              name="Privacy Policy"
              onPress={() => navigate('settingsprivacypolicy')}
              subtitle="Read our privacy policy"
            />
            <SettingsItem
              icon={icons.rating}
              name="Rate Us"
              onPress={() => { }}
              subtitle="Love our App"
            />
          </View>
          <View style={styles.sectionContainer}>
            <SettingsItem
              icon={icons.logout}
              name="Log Out"
              onPress={() => refRBSheet.current.open()}
              // onPress={() => { handleLo }}
              subtitle="Sign out of your account"
            />
          </View>
          <View style={[styles.sectionContainer]}>
            <SettingsItem
              icon={icons.trash}
              color={COLORS.red}
              name="Delete Account"
              onPress={() => refRBSheet2.current.open()}
              subtitle="Delete your Mx Bill Pay Account"
            />
          </View>
        </ScrollView>
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={240}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            height: 4,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 240,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          },
        }}
      >
        <Text style={styles.bottomTitle}>Logout</Text>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            },
          ]}
        />
        <Text
          style={[
            styles.bottomSubtitle,
            {
              color: dark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Are you sure you want to log out?
        </Text>
        <View style={[styles.bottomContainer]}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Logout"
            filled
            style={styles.logoutButton}
            onPress={handleLogout}
          />
        </View>
      </RBSheet>
      <RBSheet
        ref={refRBSheet2}
        closeOnPressMask={true}
        height={240}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            height: 4,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 240,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          },
        }}
      >
        <Text style={styles.bottomTitle}>Delete!</Text>
        <View
          style={[
            styles.separateLine,
            {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            },
          ]}
        />
        <Text
          style={[
            styles.bottomSubtitle,
            {
              color: dark ? COLORS.white : COLORS.black,
            },
          ]}
        >
          Are you sure you want to delete your account?
        </Text>
        <View style={[styles.bottomContainer]}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet2.current.close()}
          />
          <Button
            title="Yes, Delete"
            filled
            style={styles.logoutButton}
            onPress={handleDelete}
          />
        </View>
      </RBSheet>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  sectionContainer: {
    marginVertical: 4,

    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: COLORS.black, // Shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flex: 1,
    marginBottom: 32,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  profileContainer: {
    alignItems: 'center',
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: 0.4,
    paddingVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999,
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: 'medium',
    marginTop: 4,
  },
  topContainer: {
    flexDirection: 'column',
    marginVertical: 12,
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 12,
  },
  userDetails: {
    alignItems: 'center',
    gap: 12,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 50,
    // tintColor: COLORS.white,
  },
  greetingText: {
    color: '#c49b03',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsIcon: {
    width: 28,
    height: 28,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  balanceDetails: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 1,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: '400',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  accountBalance: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  cashbackContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 50,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  cashbackText: {
    color: COLORS.primary,
  },
  settingsContainer: {
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    marginBottom: 20,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsItemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIconTop: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  settingsName: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: COLORS.greyscale900,
    marginRight: 8,
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  logoutLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900,
  },
  logoutName: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.greyscale900,
    marginLeft: 12,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32,
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: 'semiBold',
    color: 'red',
    textAlign: 'center',
    marginTop: 12,
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: 'semiBold',
    color: COLORS.greyscale900,
    textAlign: 'center',
    marginVertical: 28,
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12,
  },
});

export default Profile;
