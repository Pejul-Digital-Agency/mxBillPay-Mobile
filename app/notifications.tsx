import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { Image } from 'expo-image';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-virtualized-view';
import NotificationCard from '@/components/NotificationCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteSingleNotification,
  getUnreadNotifications,
  INotification,
  markAllRead,
  markSingleAsRead,
} from '@/utils/queries/accountQueries';
import Loader from './loader';
import { useAppSelector } from '@/store/slices/authSlice';
import { getTimeAgo, getTimeFromDate } from '@/utils/date';

const Notifications = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Number of notifications per page
  const { token } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getUnreadNotifications(token),
  });

  const {
    mutate: markSingleNotificationAsReads,
  } = useMutation({
    mutationKey: ['markSingleNotificationAsRead'],
    mutationFn: (id: string) => markSingleAsRead(id),
    onSuccess: () => {
      console.log('Notification marked as read');
      queryClient.invalidateQueries(['notifications']);
    },
  });
  const {
    mutate: deleteSingleNotificationss,
  } = useMutation({
    mutationKey: ['markSingleNotificationAsRead'],
    mutationFn: (id: string) => deleteSingleNotification(id),
    onSuccess: () => {
      console.log('Notification marked as read');
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: markAllNotificationsAsRead } = useMutation({
    mutationFn: (token: string) => markAllRead(token),
    onSuccess: () => {
      console.log('All notifications marked as read');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleCardPress = (notification: INotification) => {
    setSelectedNotification(notification);
    markSingleNotificationAsReads(notification.id.toString());
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setIsModalVisible(false);
  };
  const handleDeleteNotification = (id: string) => {
    deleteSingleNotificationss(id);
    setIsModalVisible(false);
  }
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(token);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Paginated Notifications
  const paginatedNotifications = notificationsData?.data?.slice(0, currentPage * ITEMS_PER_PAGE) || [];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            contentFit="contain"
            style={[styles.backIcon, { tintColor: dark ? COLORS.white : COLORS.black }]}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.black }]}>Notification</Text>
      </View>
      <TouchableOpacity onPress={handleMarkAllAsRead}>
        <Text style={{ color: COLORS.primary }}>Mark all as read</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      {isLoading && <Loader />}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={paginatedNotifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCardPress(item)}>
                <NotificationCard
                  title={item.title}
                  description={item.message}
                  date={item.created_at}
                  time={item.created_at}
                  type={item.type}
                  icon={item?.icon}
                  iconColor={item?.iconColor}
                  isNew={!item.read}
                />
              </TouchableOpacity>
            )}
          />
          {notificationsData?.data?.length > paginatedNotifications.length && (
            <TouchableOpacity onPress={handleLoadMore} style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedNotification && (
              <>
                {/* Icon */}
                {selectedNotification.icon && (
                  <View style={styles.modalIconContainer}>
                    <Image
                      source={selectedNotification.icon}
                      style={[
                        styles.modalIcon,
                        { tintColor: selectedNotification.iconColor || colors.primary },
                      ]}
                      contentFit="contain"
                    />
                  </View>
                )}

                {/* Title */}
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedNotification.title}
                </Text>

                {/* Type */}
                <Text style={[styles.modalType, { color: colors.gray }]}>
                  {selectedNotification.type}
                </Text>

                {/* Description */}
                <Text style={[styles.modalDescription, { color: colors.text }]}>
                  {selectedNotification.message}
                </Text>

                {/* Date */}
                <Text style={[styles.modalDate, { color: colors.text }]}>
                  {getTimeAgo(selectedNotification.created_at)}{' | '}
                  {getTimeFromDate(selectedNotification.created_at)}
                </Text>

                {/* Close Button */}
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNotification(selectedNotification.id)} style={[styles.deleteButton, { marginTop: 10 }]}>
                  <Text style={styles.closeButtonText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.white, padding: 16 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backIcon: { height: 24, width: 24, marginRight: 16 },
  headerTitle: { fontSize: 24, fontFamily: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIcon: {
    width: 40,
    height: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalType: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.gray,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDate: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: COLORS.red,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadMoreButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  loadMoreText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default Notifications;
