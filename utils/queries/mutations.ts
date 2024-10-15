import axios from 'axios';
import { API_DOMAIN, API_ENDPOINTS } from '@/apiConfig';
import { InputValues as SignUpProps } from '@/app/signup';
import { InputValues as LoginProps } from '@/app/login';

export const signUpUser = async (data: SignUpProps): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_DOMAIN}${API_ENDPOINTS.AUTH.Register}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};
export const loginUser = async (data: LoginProps): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_DOMAIN}${API_ENDPOINTS.AUTH.Login}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};
