import {
  View,
  Text,
  AppStateEvent,
  AppStateStatic,
  AppStateStatus,
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
  const dispatch = useDispatch();

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
      startTokenExpiryTimer();
      currentStateRef.current = state;
    } else if (state === 'active' && currentStateRef.current === 'background') {
      stopTokenExpiryTimer();
      currentStateRef.current = state;
    }
  };

  const startTokenExpiryTimer = () => {
    const timer = setTimeout(() => {
      dispatch(authSliceActions.clearToken());
    }, 2 * 60 * 1000);
    setExpiryTimer(timer);
  };

  const stopTokenExpiryTimer = () => {
    if (expiryTimer) {
      clearTimeout(expiryTimer);
      setExpiryTimer(null);
    }
  };

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
      onClick={() => {
        setVisible(false);
        router.push('/login');
      }}
    />
  );
};

export default TokenExpiryModal;
