// AppStateContext.tsx
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  BackHandler,
  AppState,
  AppStateStatus,
  ToastAndroid,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { authSliceActions, useAppSelector } from './slices/authSlice';

interface AppStateContextProps {
  expired: boolean;
  currentPage: string;
  setExpired: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined
);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expired, setExpired] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const currentStateRef = useRef(AppState.currentState);
  const [currentPage, setCurrentPage] = useState('');
  const backGroundTimeRef = useRef<number | null>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const [backPressedOnce, setBackPressedOnce] = useState(false);

  useEffect(() => {
    const naivgationListener = navigation.addListener('state', (e) => {
      const activeIndex = e.data?.state?.index;
      const acitveTabName = e.data?.state?.routes[activeIndex]?.name;
      console.log('TokenExpiryModal: ' + acitveTabName);
      setCurrentPage(acitveTabName);
      // setCurrentTab(acitveTabName);
    });

    return () => {
      navigation.removeListener('state', naivgationListener);
    };
  }, []);
  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!navigation.canGoBack()) {
          if (backPressedOnce) {
            console.log('exiting app');
            BackHandler.exitApp();
            return true;
          }
          setBackPressedOnce(true);
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          setTimeout(() => {
            setBackPressedOnce(false);
          }, 2000);
          return true;
        }

        navigation.goBack(); // Handle back action if not in a modal
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation, backPressedOnce]);

  // Handle app state changes (when app goes to background or comes back to foreground)
  useEffect(() => {
    let subscription: undefined | ReturnType<typeof AppState.addEventListener>;
    if (token) {
      subscription = AppState.addEventListener('change', handleAppStateChange);
    }

    return () => {
      // Clean up subscription on component unmount
      //subscription is cleaned up because there is not any innate object as removeEventListener, so we have to define variable for event listener and then remove it on component unmount
      if (subscription) {
        subscription.remove();
      }
    };
  }, [token]);

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'background' && currentStateRef.current === 'active') {
      console.log('expiry started');
      backGroundTimeRef.current = Date.now();
      //   if(token){
      //   }
      currentStateRef.current = state;
    } else if (state === 'active' && currentStateRef.current === 'background') {
      // stopTokenExpiryTimer();
      const backgroundTime = backGroundTimeRef.current;
      if (backgroundTime) {
        // const timeDiff = Date.now() - backgroundTime;
        // console.log(timeDiff);
        // if (timeDiff > 2 * 60 * 1000) {
        //   dispatch(authSliceActions.clearToken());
        //   console.log('token expired');
        //   backGroundTimeRef.current = null;
        //   //   setExpired(true);
        // }
      }
      currentStateRef.current = state;
    }
  };

  useEffect(() => {
    console.log('AppStateContext: ' + token);
    if (
      !token &&
      currentPage &&
      currentPage != 'otpverification' &&
      currentPage != 'index' &&
      currentPage != 'login' &&
      currentPage != 'signup'
    ) {
      console.log('truthiying');
      setExpired(true);
    }
  }, [token]);

  return (
    <AppStateContext.Provider
      value={{
        expired,
        currentPage,
        setExpired: setExpired,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within an AppProvider');
  }
  return context;
};
