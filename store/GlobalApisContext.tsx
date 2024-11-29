import {
  getTransferHistory,
  ITrasnferTransaction,
} from '@/utils/queries/accountQueries';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useAppSelector } from './slices/authSlice';
import { ApiError } from '@/utils/customApiCall';
import { G } from 'react-native-svg';

interface GlobalApisContextProps {
  transactionsHistory: ITrasnferTransaction[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const initialValue = {
  transactionsHistory: undefined,
  isLoading: false,
  isError: false,
  error: null,
};

const GlobalApisContext = createContext<GlobalApisContextProps>(initialValue);

export const GlobalApisContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAppSelector((state) => state.auth);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['transactionsHistory'],
    queryFn: async () => getTransferHistory(token),
    enabled: !!token,
  });

  return (
    <GlobalApisContext.Provider
      value={{ error, isError, isLoading, transactionsHistory: data?.data }}
    >
      {children}
    </GlobalApisContext.Provider>
  );
};

export const useGlobalApis = () => {
  const context = useContext(GlobalApisContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalApis must be used within a GlobalApisContextProvider'
    );
  }
  return context;
};
