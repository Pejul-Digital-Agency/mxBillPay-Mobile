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
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { currentPageActions } from '@/store/slices/currentPageSlice';

const TokenExpiryModal = () => {
  const [visible, setVisible] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const currentStateRef = useRef(AppState.currentState);
  const currentTabRef = useRef('');
  const backGroundTimeRef = useRef<number | null>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const naivgationListener = navigation.addListener('state', (e) => {
      const activeIndex = e.data?.state?.index;
      const acitveTabName = e.data?.state?.routes[activeIndex]?.name;
      console.log('TokenExpiryModal: ' + acitveTabName);
      currentTabRef.current = acitveTabName;
      dispatch(currentPageActions.setCurrentPage(acitveTabName));
      // setCurrentTab(acitveTabName);
    });

    return () => {
      navigation.removeListener('state', naivgationListener);
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible) {
          // Return true to prevent back button behavior
          return true;
        }
        console.log('active Page', currentTabRef.current);
        //Manage navigation here
        if (currentTabRef.current == '(tabs)') {
          console.log('its tabs');
          return true;
        }
        // console.log('push back');
        router.back();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [visible, token]);

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
      currentStateRef.current = state;
    } else if (state === 'active' && currentStateRef.current === 'background') {
      // stopTokenExpiryTimer();
      const backgroundTime = backGroundTimeRef.current;
      if (backgroundTime) {
        const timeDiff = Date.now() - backgroundTime;
        console.log(timeDiff);
        if (timeDiff > 0.1 * 60 * 1000) {
          dispatch(authSliceActions.clearToken());
          console.log('token expired');
          backGroundTimeRef.current = null;
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
        router.replace('/login');
      }}
    />
  );
};

export default TokenExpiryModal;
