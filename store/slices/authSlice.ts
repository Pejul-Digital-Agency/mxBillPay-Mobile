import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../store';
import { IUserProfile } from '@/utils/mutations/authMutations';

// Define a type for the slice state

interface IUserAccount {
  balance: number;
  totalIncome: number;
  totalBillPayment: number;
}
interface IUserAction {
  userProfile?: IUserProfile | null;
  userId?: string;
  userEmail?: string;
}

type initialStateType = {
  token: string;
  isLoggedIn: boolean;
  userId: string;
  userEmail: string;
  userProfile: IUserProfile | null;
  userAccount: IUserAccount | null;
};
const initialState: initialStateType = {
  token: '',
  isLoggedIn: false,
  userId: '',
  userEmail: '',
  userProfile: null,
  userAccount: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserAction>) => {
      if (action.payload.userId) {
        state.userId = action.payload.userId;
      }
      if (action.payload.userProfile) {
        state.userProfile = action.payload.userProfile;
      }
      if (action.payload.userEmail) {
        state.userEmail = action.payload.userEmail;
      }
    },
    setUserAccount: (state, action: PayloadAction<IUserAccount>) => {
      state.userAccount = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    clearToken: (state) => {
      state.token = '';
      state.isLoggedIn = false;
      state.userId = '';
      state.userProfile = null;
      state.userEmail = '';
    },
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
