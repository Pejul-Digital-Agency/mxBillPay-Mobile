import axios from 'axios';
import { API_ENDPOINTS } from '@/apiConfig';
import { IClientCreation } from '@/app/fillyourprofile';
import { ICooperateClient } from '@/app/createcoroporateaccount';

export const createIndividualAccount = async (data: IClientCreation) => {
  try {
    console.log('reached');
    // const requestFormData = new FormData();

    // requestFormData.append('userId', '18');
    // requestFormData.append('firstName', data.firstName);
    // requestFormData.append('lastName', data.lastName);
    // requestFormData.append('bvn', data.bvn);
    // requestFormData.append('dob', data.dob);
    // requestFormData.append('phoneNumber', data.phoneNumber);
    // requestFormData.append(
    //   'profilePicture',
    //   new Blob([data.profilePicture.uri], {
    //     type: data.profilePicture.type,
    //   })
    // );

    // for (let [key, value] of requestFormData.entries()) {
    //   console.log(key, value);
    // }
    // console.log(requestFormData.get('profilePicture'));

    const response = await axios.post(
      API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateIndividualAccount,
      data
    );

    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong.');
    } else {
      console.log('thats culprit');
      throw new Error('Something went wrong.');
    }
  }
};

export const createCooperateAccount = async (data: ICooperateClient) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateCoorporateAccount,
      data
    );

    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong.');
    } else {
      console.log('thats culprit');
      throw new Error('Something went wrong.');
    }
  }
};
