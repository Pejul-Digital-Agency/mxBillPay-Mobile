import axios from 'axios';
import { apiCall } from '../customApiCall';
import { API_ENDPOINTS } from '@/apiConfig';

export const getUserProfile = async (
  token: string
): Promise<IUserProfileResponse> => {
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.GetUserProfileData,
    'GET',
    undefined,
    token
  );
};

interface IUserProfileResponse {
  status: string;
  data: IUserProfileData;
}

export interface IUserProfileData {
  id: number;
  user_id: number;
  account_number: string;
  profile_picture: string;
  account_type: string;
  status: string;
  bvn: string;
  created_at: string;
  updated_at: string;
  firstName: string;
  lastName: string;
  phone: string;
  accountBalance: string;
  accountId: string;
  client: string;
  clientId: string;
  savingsProductName: string;
  nickName: string | null;
  gender: string | null;
  occupation: string | null;
  user: User;
}

interface User {
  id: number;
  email: string;
  email_verified_at: string | null;
  otp: string | null;
  otp_verified: number;
  created_at: string;
  updated_at: string;
}
