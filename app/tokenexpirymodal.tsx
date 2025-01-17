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
import {
  NavigationProp,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
// import { currentPageActions } from '@/store/slices/currentPageSlice';
import { useAppStateContext } from '@/store/AppStateContext';

const TokenExpiryModal = () => {
  const { expired, setExpired, currentPage } = useAppStateContext();
  const navigation = useNavigation<NavigationProp<any>>();
   const { navigate, reset } = useNavigation<NavigationProp<any>>();
  // const {navigate} = useNavigation();
  console.log(expired);
  return (
    <CustomModal
      key={'loginModal'}
      modalVisible={expired}
      setModalVisible={setExpired}
      btnText="Login"
      title="Sorry, your session has been expired, please login again to continue."
      onPress={() => {
        setExpired(false);

        navigate('login');
      }}
    />
  );
};

export default TokenExpiryModal;
