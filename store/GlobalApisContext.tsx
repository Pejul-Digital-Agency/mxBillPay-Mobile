import {
  getTransferHistory,
  ITrasnferTransaction,
} from '@/utils/queries/accountQueries';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext } from 'react';
import { useAppSelector } from './slices/authSlice';
import { apiCall, ApiError } from '@/utils/customApiCall';
import axios from 'axios';
import { API_ENDPOINTS } from '@/apiConfig';

type ITransferTransactionResponse = {
  status: 'success' | 'error';
  data: ITrasnferTransaction[];
};

interface GlobalApisContextProps {
  transactionsHistory: ITransferTransactionResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  fetchData: () => void;
}

const initialValue = {
  transactionsHistory: null,
  isLoading: false,
  isError: false,
  error: null,
  fetchData: () => {},
};

const GlobalApisContext = createContext<GlobalApisContextProps>(initialValue);

export const GlobalApisContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAppSelector((state) => state.auth);
  const [data, setData] = React.useState<ITransferTransactionResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState<ApiError | null>(null);
  const [japlu, setJaplu] = React.useState<any>('nothing');

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      console.log('invoked');
      const response = await axios.get(
        API_ENDPOINTS.ACCOUNT_MANAGEMENT.GetTransferHistory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('resolved');
      setJaplu(response?.data?.data);
      setData(response?.data as ITransferTransactionResponse);
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      setError(err as ApiError);
    }
  };

  React.useEffect(() => {
    if (token) fetchData();
  }, [token]);

  console.log('global', data);
  console.log('japlu: ', japlu);
  return (
    <GlobalApisContext.Provider
      value={{
        error,
        isError,
        isLoading,
        transactionsHistory: data,
        fetchData,
      }}
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
