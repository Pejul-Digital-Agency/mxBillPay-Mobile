import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { Image } from 'expo-image';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-virtualized-view';
// import { notifications } from '@/data';
import NotificationCard from '@/components/NotificationCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUnreadNotifications, markAllRead } from '@/utils/queries/accountQueries';
import { useAppSelector } from '@/store/slices/authSlice';
import { isPending } from '@reduxjs/toolkit';
import Loader from './loader';

const Notifications = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { token } = useAppSelector((state) => state.auth);
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getUnreadNotifications(token),
  });
  // const queryClient = useQueryClient();
  /**
   * Render header
   */
  const { mutate: markAllNotificationsAsRead } = useMutation({
    mutationFn: (token: string) => markAllRead(token),
    onSuccess: (status:string) => {
      console.log("All notifications marked as read");
      //navigate to home
     
     
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleMarkAllAsRead = () => {
    // Call a function to mark all notifications as read
    console.log("All notifications marked as read");
    markAllNotificationsAsRead(token);
    
  };
  const renderHeader = () => {

    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              contentFit="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.black,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.black,
              },
            ]}
          >
            Notification
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
            <Text style={{ color: dark ? COLORS.secondaryWhite : COLORS.black }}>
              Mark All Read
            </Text>
          </TouchableOpacity>
         
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {isLoading && <Loader />}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={notificationsData?.data || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <NotificationCard
                title={item.title}
                description={item.message}
                date={item.created_at}
                time={item.created_at}
                type={item.type}
                icon={item?.icon}
                iconColor={item?.iconColor}
                // isNew={item.isNew}
                isNew={true}
              />
            )}
          />
        </ScrollView>
      </View>
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
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  scrollView: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.black,
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    marginRight: 10, // Spacing between "Mark All Read" and settings icon
  },
});

export default Notifications;
