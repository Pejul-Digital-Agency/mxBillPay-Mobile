import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../store';

// Define a type for the slice state
interface IUserAction {
  type: string;
  payload: {
    userId: string;
    userEmail: string;
  };
}
interface ITokenAction {
  type: string;
  payload: string;
}

type initialStateType = {
  token: string;
  isLoggedIn: boolean;
  userId: string;
  userEmail: string;
};
const initialState: initialStateType = {
  token: '',
  isLoggedIn: false,
  userId: '',
  userEmail: '',
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: IUserAction) => {
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
    },
    setToken: (state, action: ITokenAction) => {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    clearToken: (state) => {
      state.token = '';
      state.isLoggedIn = false;
    },
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
