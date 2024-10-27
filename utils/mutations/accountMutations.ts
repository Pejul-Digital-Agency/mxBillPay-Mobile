import axios from 'axios';
import { API_ENDPOINTS } from '@/apiConfig';
import { IClientCreation } from '@/app/fillyourprofile';
import { ICooperateClient } from '@/app/createcoroporateaccount';
import { apiCall } from '../customApiCall';

export const createIndividualAccount = async (data: FormData) => {
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateIndividualAccount,
    'POST',
    data
  );
};

export const createCooperateAccount = async (data: ICooperateClient) => {
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateCoorporateAccount,
    'POST',
    data
  );
};
