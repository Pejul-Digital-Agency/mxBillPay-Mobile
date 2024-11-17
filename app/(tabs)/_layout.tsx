import { Tabs, useNavigation } from 'expo-router';
import { View, Text, Platform, BackHandler } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons, FONTS } from '../../constants';
import { useTheme } from '@/theme/ThemeProvider';
import { useAppSelector } from '@/store/slices/authSlice';
import TokenExpiryModal from '../tokenexpirymodal';
import { useEffect } from 'react';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { StatusBar } from 'react-native';

const TabLayout: React.FC = () => {
  const { token, userProfile } = useAppSelector((state) => state.auth);
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: Platform.OS !== 'ios',
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            elevation: 0,
            height: Platform.OS === 'ios' ? 90 : 60,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    paddingTop: 16,
                  }}
                >
                  <Image
                    source={focused ? icons.home4 : icons.home4Outline}
                    contentFit="contain"
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  />
                  <Text
                    style={{
                      ...FONTS.body4,
                      color: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  >
                    Home
                  </Text>
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: '',
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    paddingTop: 16,
                  }}
                >
                  <Image
                    source={focused ? icons.activity : icons.activityOutline}
                    contentFit="contain"
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  />
                  <Text
                    style={{
                      ...FONTS.body4,
                      color: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  >
                    Statistics
                  </Text>
                </View>
              );
            },
          }}
        />
        {/* <Tabs.Screen
          name="scanqrcode"
          options={{
            title: '',
            tabBarIcon: () => {
              return (
                <View
                  style={{
                    height: 64,
                    width: 64,
                    borderRadius: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary,
                    marginBottom: 16,
                  }}
                >
                  <Image
                    source={icons.scan2}
                    contentFit="contain"
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: COLORS.white,
                    }}
                  />
                </View>
              );
            },
          }}
        /> */}
        <Tabs.Screen
          name="mycard"
          options={{
            title: '',
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    paddingTop: 16,
                  }}
                >
                  <Image
                    source={focused ? icons.wallet2 : icons.wallet2Outline}
                    contentFit="contain"
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  />
                  <Text
                    style={{
                      ...FONTS.body4,
                      color: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  >
                    My Card
                  </Text>
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    paddingTop: 16,
                  }}
                >
                  <Image
                    source={focused ? icons.profile2 : icons.profile2Outline}
                    contentFit="contain"
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  />
                  <Text
                    style={{
                      ...FONTS.body4,
                      color: focused
                        ? COLORS.primary
                        : dark
                        ? COLORS.gray3
                        : COLORS.gray3,
                    }}
                  >
                    Profile
                  </Text>
                </View>
              );
            },
          }}
        />
      </Tabs>
      <TokenExpiryModal />
    </>
  );
};

export default TabLayout;
