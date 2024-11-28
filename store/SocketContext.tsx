import { createContext, ReactNode, useContext } from 'react';
import { Pusher, PusherChannel } from '@pusher/pusher-websocket-react-native';
import { useState, useEffect } from 'react';
import { useAppSelector } from './slices/authSlice';

// Define the type for your context
type PusherContextType = {
  channel: PusherChannel | null;
};

// Create the context with a default value
const PusherContext = createContext<PusherContextType>({
  channel: null,
});
export const { Provider } = PusherContext;

export const PusherProvider = ({ children }: { children: ReactNode }) => {
  const [channel, setChannel] = useState<PusherChannel | null>(null);
  const { token, userProfile } = useAppSelector((state) => state.auth);

  const API_KEY = '0ad9e7f7e71dc1522ad6';
  const API_CLUSTER = 'ap1';

  useEffect(() => {
    let pusher: Pusher;
    let channel: PusherChannel;
    (async () => {
      pusher = Pusher.getInstance();
      try {
        await pusher.init({
          apiKey: API_KEY,
          cluster: API_CLUSTER,
        });
        await pusher.connect();
        channel = await pusher.subscribe({
          channelName: `user.${userProfile?.email}`,
        });

        setChannel(channel);
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      if (pusher) {
        pusher.disconnect();
      }
      if (channel) {
        channel.unsubscribe();
      }
      setChannel(null);
    };
  }, [token]);

  return (
    <PusherContext.Provider value={{ channel }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  if (!PusherContext) {
    throw new Error('usePusher must be used within a PusherProvider');
  }
  return useContext(PusherContext);
};
