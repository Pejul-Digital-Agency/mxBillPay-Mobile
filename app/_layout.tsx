import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { FONTS } from '@/constants/fonts';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LogBox } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import ScreenStacks from '../components/screenstacks';
import { AppStateProvider } from '@/store/AppStateContext';
import { PusherProvider } from '@/store/SocketContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [loaded] = useFonts(FONTS);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Provider store={store}>
        <PusherProvider>
          <AppStateProvider>
            <QueryClientProvider client={new QueryClient()}>
              <ScreenStacks />
            </QueryClientProvider>
          </AppStateProvider>
        </PusherProvider>
      </Provider>
    </ThemeProvider>
  );
}
