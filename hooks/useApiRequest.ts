import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the return type for the hook
interface UseApiRequestReturn<T> {
  isError: string | null;
  setIsError: (value: string | null) => void;
  isLoading: boolean;
  isSuccess: boolean;
  setIsSuccess: (value: boolean) => void;
  resData: T | null;
  fetchRequest: (
    url: string,
    data?: any,
    method?: 'POST' | 'GET'
  ) => Promise<void>;
}

const useApiRequest = <T = any>(): UseApiRequestReturn<T> => {
  const [isError, setIsError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resData, setResData] = useState<T | null>(null);

  async function fetchRequest(
    url: string,
    data?: any,
    method: 'POST' | 'GET' = 'POST'
  ) {
    setResData(null);
    setIsError(null);
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const config: AxiosRequestConfig = {
        method: method as 'POST' | 'GET', // Casting to match axios types
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data ? JSON.stringify(data) : null,
      };

      // Make the request using axios
      const response: AxiosResponse<T> = await axios(config);

      // If the request is successful, save the response data
      setResData(response?.data || null);
      setIsSuccess(true);
    } catch (error: any) {
      console.log(error);

      // Handle errors from axios request
      setIsError(
        error.response?.data?.message ||
          error.message ||
          'Unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isError,
    setIsError,
    isLoading,
    isSuccess,
    setIsSuccess,
    resData,
    fetchRequest,
  };
};

export default useApiRequest;
