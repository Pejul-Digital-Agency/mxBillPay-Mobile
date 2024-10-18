import axios from 'axios';
import { API_ENDPOINTS } from '@/apiConfig';
import { IClientCreation } from '@/app/fillyourprofile';

export const createClient = async (data: IClientCreation) => {
  try {
    console.log('reached');
    const requestFormData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'profilePicture') {
        requestFormData.append('profilePicture', data.profilePicture as any);
      } else {
        requestFormData.append(key, data[key as keyof object]);
      }
    });
    console.log(API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateAccount);
    const response = await axios.post(
      API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateAccount,
      requestFormData
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong.');
    } else {
      console.log('thats culprit');
      throw new Error('Something went wrong.');
    }
  }
};
