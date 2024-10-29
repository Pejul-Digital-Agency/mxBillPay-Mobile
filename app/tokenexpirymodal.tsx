import {
  View,
  Text,
  AppStateEvent,
  AppStateStatic,
  AppStateStatus,
  BackHandler,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import CustomModal from './custommodal';
import { router } from 'expo-router';
import { authSliceActions, useAppSelector } from '@/store/slices/authSlice';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';

const TokenExpiryModal = () => {
  const [visible, setVisible] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const currentStateRef = useRef(AppState.currentState);
  const [expiryTimer, setExpiryTimer] = useState<NodeJS.Timeout | null>(null);
  const [backgroundTime, setBackgroundTime] = useState<number | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // console.log('pressed back');
        if (visible) {
          console.log('yes');
          // Return true to prevent back button behavior
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible]);

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
      if (expiryTimer) {
        clearTimeout(expiryTimer); // Clean up the expiryTimer on component unmount
      }
    };
  }, [token, expiryTimer]);

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'background' && currentStateRef.current === 'active') {
      console.log('expiry started');

      setBackgroundTime((prev) => Date.now());
      // startTokenExpiryTimer();
      currentStateRef.current = state;
    } else if (state === 'active' && currentStateRef.current === 'background') {
      // stopTokenExpiryTimer();
      console.log(backgroundTime);
      if (backgroundTime) {
        console.log('by');
        const timeDiff = Date.now() - backgroundTime;
        console.log(timeDiff);
        if (timeDiff > 2 * 60 * 1000) {
          dispatch(authSliceActions.clearToken());
          setBackgroundTime(null);
          setVisible(true);
        }
      }
      currentStateRef.current = state;
    }
  };

  // const startTokenExpiryTimer = () => {
  //   console.log('started timer');
  //   const timer = setTimeout(() => {
  //     console.log('session timeout');
  //     dispatch(authSliceActions.clearToken());
  //   }, 10 * 1000);
  //   setExpiryTimer(timer);
  // };

  // const stopTokenExpiryTimer = () => {
  //   if (expiryTimer) {
  //     clearTimeout(expiryTimer);
  //     setExpiryTimer(null);
  //   }
  // };

  useEffect(() => {
    if (!token) {
      setVisible(true);
    }
  }, [token]);
  return (
    <CustomModal
      key={'loginModal'}
      modalVisible={visible}
      setModalVisible={setVisible}
      btnText="Login"
      title="Sorry, your session has been expired, please login again to continue."
      onPress={() => {
        setVisible(false);
        router.push('/login');
      }}
    />
  );
};

export default TokenExpiryModal;
