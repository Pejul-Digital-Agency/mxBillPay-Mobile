import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  currentPage: string;
}

const initialState: CounterState = {
  currentPage: '',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const currentPageActions = counterSlice.actions;

export default counterSlice.reducer;
