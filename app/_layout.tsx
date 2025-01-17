import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { LogBox, Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useSelector } from 'react-redux';
import ScreenStacks from '../components/screenstacks';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { store } from '@/store/store';
import { AppStateProvider } from '@/store/AppStateContext';
import { PusherProvider } from '@/store/SocketContext';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, saveFcmTokenToServer } from '@/utils/notificationService';
import { RootState } from '@/store/store'; // Adjust import to match your RootState definition


SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs();

const queryClient = new QueryClient();

// Component to handle notification logic
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const data = notification?.request?.content?.data;
    const userId = data?.userId;

    console.log("Filtering notification by userId:", userId);

    // Retrieve userProfile from app state or context
    const currentUserId = store.getState().auth.userProfile?.userId;

    // Allow or suppress notifications based on userId matching
    if (parseInt(userId) === currentUserId) {
      console.log("Notification matches the current user. Allowing alert.");
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    }

    console.warn("Notification does not match the current user. Ignoring.");
    return {
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

// QueryClient for React Query
// const queryClient = new QueryClient();

const NotificationHandler: React.FC = () => {
  const { token, userProfile } = useSelector((state: RootState) => state.auth);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>(null);

  useEffect(() => {
    console.log("NotificationHandler Mounted");

    if (!token || !userProfile) {
      console.log("No auth token or user profile. Skipping notification setup.");
      return;
    }

    const setupNotifications = async () => {
      const fcmToken = await registerForPushNotificationsAsync();
      if (fcmToken) {
        setExpoPushToken(fcmToken);
        await saveFcmTokenToServer(fcmToken, token);
      }
    };

    setupNotifications();
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Foreground Notification:", notification);
      const data = notification.request.content.data;
      const userId = data?.userId;

      if (parseInt(userId) === userProfile?.userId) {
        const body = notification.request.content.body || "You have a new notification!";

      } else {
        console.warn(`Notification not for current user: ${userProfile?.userId}`);
      }
    });
    notificationListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification Interaction (Background/Terminated):", response);
      const data = response.notification.request.content.data;
      const userId = data?.userId;

      if (parseInt(userId) === userProfile?.userId) {
        console.log("Notification is for the current user:", userProfile?.userId);
        const body = response.notification.request.content.body || "You have a new notification!";
        Alert.alert("New Notification", body);

        // Example: Add navigation logic if the notification contains a route
        const route = data?.route;
        if (route) {
          console.log(`Navigate to route: ${route}`);
          // Add navigation logic here if needed
        }
      } else {
        console.warn(`Notification not for current user: ${userProfile?.userId}`);
      }
    });
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
    };
  }, [token, userProfile]);

  return null;
};




// Root layout component
export default function RootLayout() {


  return (
    <ThemeProvider>
      <Provider store={store}>
        <PusherProvider>
          <AppStateProvider>
            <QueryClientProvider client={queryClient}>
              <NotificationHandler />
              <ScreenStacks />
            </QueryClientProvider>
          </AppStateProvider>
        </PusherProvider>
      </Provider>
    </ThemeProvider>
  );
}
