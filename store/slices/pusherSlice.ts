import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pusher, PusherChannel } from '@pusher/pusher-websocket-react-native';

interface PusherState {
  channel: PusherChannel | null;
  events: Array<any>; // Store events received from Pusher
}

const initialState: PusherState = {
  channel: null,
  events: [],
};

// Async thunk to initialize Pusher and subscribe to a channel
export const initializePusher = createAsyncThunk<
  //here PusherChannel is defined as it needs the return values type as in this case, is that of channel variable
  PusherChannel,
  //string is the type for thunkAPI
  string,
  { rejectValue: string }
>('pusher/initialize', async (userId, thunkAPI) => {
  const API_KEY = '0ad9e7f7e71dc1522ad6';
  const API_CLUSTER = 'ap1';

  try {
    const pusher = Pusher.getInstance();
    await pusher.init({ apiKey: API_KEY, cluster: API_CLUSTER });
    await pusher.connect();
    const channel = await pusher.subscribe({ channelName: `user.${userId}` });

    return channel;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue('Failed to initialize Pusher channel');
  }
});

// Slice to manage Pusher-related state
const pusherSlice = createSlice({
  name: 'pusher',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<any>) => {
      state.events.push(action.payload);
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
  extraReducers: (builder) => {
    //this reducer runs when the initialize pusher action is fulfilled and thus declares value to channel in the state
    builder.addCase(initializePusher.fulfilled, (state, action) => {
      state.channel = action.payload;
    });
  },
});

// Export actions to dispatch them in components
export const { addEvent, clearEvents } = pusherSlice.actions;

// Export reducer to include in store
export default pusherSlice.reducer;
