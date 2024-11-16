import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  useColorScheme,
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

type Nav = {
  navigate: (value: string) => void;
};

const Profile = () => {
  const refRBSheet = useRef<any>(null);
  const { dark, colors, setScheme } = useTheme();
  const { navigate, reset } = useNavigation<NavigationProp<any>>();
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Dispatch clearToken to reset auth state
    dispatch(authSliceActions.clearToken());
    dispatch(authSliceActions.setUser({}));
    // Reset navigation stack and navigate to login screen
    reset({
      index: 0,
      routes: [{ name: 'login' }],
    });
  };

  const renderTopContainer = () => {
    return (
      <>
        <View style={styles.topContainer}>
          <View style={styles.userInfo}>
            <View style={styles.userDetails}>
              <Image
                source={userProfile?.profilePicture || icons.profile}
                contentFit="cover"
                style={styles.profilePicture}
              />
              <Text style={styles.greetingText}>
                {'Hi, ' + userProfile?.firstName + ' ' + userProfile?.lastName}
              </Text>
            </View>
            <TouchableOpacity onPress={() => console.log('pressec settings')}>
              <Image
                source={icons.settingOutline}
                contentFit="contain"
                tintColor={COLORS.dark2}
                style={styles.settingsIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceDetails}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.currencySymbol}>{`₦`}</Text>
                <Text style={styles.accountBalance}>
                  {userProfile?.accountBalance}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.cashbackContainer}>
            <Text>& Cashback</Text>
            <Text style={styles.cashbackText}>{` ₦200.00`}</Text>
          </View>
        </View>
      </>
    );
  };
  /**
   * Render header
   */
  // const renderHeader = () => {
  //   return (
  //     <TouchableOpacity style={styles.headerContainer}>
  //       <View style={styles.headerLeft}>
  //         {/* <Image
  //           source={images.logo}
  //           contentFit='contain'
  //           style={styles.logo}
  //         /> */}
  //         <Text
  //           style={[
  //             styles.headerTitle,
  //             {
  //               color: dark ? COLORS.white : COLORS.greyscale900,
  //             },
  //           ]}
  //         >
  //           Profile
  //         </Text>
  //       </View>
  //       {/* removing three dots */}
  //       {/* <TouchableOpacity>
  //         <Image
  //           source={icons.moreCircle}
  //           contentFit='contain'
  //           style={[styles.headerIcon, {
  //             tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
  //           }]}
  //         />
  //       </TouchableOpacity> */}
  //     </TouchableOpacity>
  //   );
  // };
  /**
   * Render User Profile
   */
  // const renderProfile = () => {
  //   const [image, setImage] = useState(images.user1);

  //   const pickImage = async () => {
  //     try {
  //       const tempUri = await launchImagePicker();

  //       if (!tempUri) return;

  //       // Set the image
  //       setImage({ uri: tempUri });
  //     } catch (error) {}
  //   };
  //   return (
  //     <View style={styles.profileContainer}>
  //       <View>
  //         <Image
  //           source={userProfile?.profilePicture || icons.profile}
  //           contentFit="cover"
  //           style={styles.avatar}
  //         />
  //         {/* <TouchableOpacity
  //           onPress={pickImage}
  //           style={styles.picContainer}>
  //           <MaterialIcons name="edit" size={16} color={COLORS.white} />
  //         </TouchableOpacity> */}
  //       </View>
  //       <Text
  //         style={[
  //           styles.title,
  //           { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 },
  //         ]}
  //       >
  //         {userProfile?.firstName} {userProfile?.lastName}
  //       </Text>
  //       <Text
  //         style={[
  //           styles.subtitle,
  //           { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 },
  //         ]}
  //       >
  //         {userProfile?.email}
  //       </Text>
  //     </View>
  //   );
  // };
  /**
   * Render Settings
   */
  const renderSettings = () => {
    // const [isDarkMode, setIsDarkMode] = useState(false);
    const systemTheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

    // Sync the switch with the system theme on initial load
    useEffect(() => {
      setIsDarkMode(systemTheme === 'dark');
    }, [systemTheme]);
    const toggleDarkMode = () => {
      setIsDarkMode((prev) => !prev);
      dark ? setScheme('light') : setScheme('dark');
    };

    return (
      <View
        style={[
          styles.settingsContainer,
          {
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.white,
          },
        ]}
      >
        {/* <SettingsItem
          icon={icons.bell}
          name="My Notification"
          onPress={() => navigate('notifications')}
        /> */}
        {/* <SettingsItem
          icon={icons.location2Outline}
          name="Address"
          onPress={() => navigate("address")}
        /> */}
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
          subtitle="Turn off notifications to save on battery"
        />
        {/* <SettingsItem
          icon={icons.wallet2Outline}
          name="Payment"
          onPress={() => navigate("settingspayment")}
        /> */}
        <SettingsItem
          icon={icons.shield}
          name="Security"
          subtitle="Protect your account"
          onPress={() => navigate('settingssecurity')}
        />
        {/* <TouchableOpacity
          onPress={() => navigate("settingslanguage")}
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.more}
              contentFit='contain'
              style={[styles.settingsIcon, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Language & Region</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.rightLanguage, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>English (US)</Text>
            <Image
              source={icons.arrowRight}
              contentFit='contain'
              style={[styles.settingsArrowRight, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={images.eyefill}
              contentFit="contain"
              style={[
                styles.settingsIcon,
                {
                  tintColor: COLORS.primary,
                  // tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
            <View>
              <Text
                style={[
                  styles.settingsName,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                Dark Mode
              </Text>
              <Text
                style={{
                  color: dark ? COLORS.white : COLORS.greyscale900,
                  fontSize: 12,
                  marginLeft: 12,
                }}
              >
                Switch between light and dark mode
              </Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>
        <SettingsItem
          icon={icons.lock2}
          name="Privacy Policy"
          onPress={() => navigate('settingsprivacypolicy')}
          subtitle="Read our privacy policy"
        />
        <SettingsItem
          icon={images.infoCircleFilled}
          name="Help Center"
          onPress={() => navigate('settingshelpcenter')}
          subtitle="Contact our support team"
        />
        {/* <SettingsItem
          icon={icons.people4}
          name="Invite Friends"
          onPress={() => navigate("settingsinvitefriends")}
        /> */}
        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={styles.logoutContainer}
        >
          <View style={styles.logoutLeftContainer}>
            <Image
              source={icons.logout}
              contentFit="contain"
              style={[
                styles.logoutIcon,
                {
                  tintColor: 'red',
                },
              ]}
            />
            <Text
              style={[
                styles.logoutName,
                {
                  color: 'red',
                },
              ]}
            >
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100 },
      ]}
    >
      <StatusBar style={dark ? 'light' : 'dark'} backgroundColor="#79C2F8" />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={['#79C2F8', '#B6CFE4']}
          style={{
            padding: 16,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          {renderTopContainer()}
          {/* {renderHeader()}
          {renderProfile()} */}
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSettings()}
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
        <View style={styles.bottomContainer}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // padding: 16,
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
    // marginVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 50,
  },
  greetingText: {
    color: COLORS.greyscale900,
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
    fontWeight: '400', // Use '400' for "regular" weight
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
    marginVertical: 12,
    marginHorizontal: 6,
    // zIndex: 100,
    paddingHorizontal: 16,
    // backgroundColor: COLORS.white,
    borderRadius: 16,
    // shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
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
