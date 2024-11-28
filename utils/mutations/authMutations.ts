import { apiCall } from '../customApiCall';
import { API_ENDPOINTS } from '@/apiConfig';
import { InputValues as SignUpProps } from '@/app/signup';
import { InputValues as LoginProps } from '@/app/login';

export const signUpUser = async (data: SignUpProps): Promise<any> => {
  return await apiCall(API_ENDPOINTS.AUTH.Register, 'POST', data);
};

export const loginUser = async (
  data: LoginProps
): Promise<IUserLoginResponse> => {
  return await apiCall(API_ENDPOINTS.AUTH.Login, 'POST', data);
};

export const verifyEmailOTP = async ({
  data,
  token,
}: {
  data: { otp: string };
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUTH.VerfiyEmailOtp, 'POST', data, token);
};

export const verifyPasswordOTP = async (data: {
  otp: string;
  userId: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUTH.VerifyPasswordOtp, 'POST', data);
};

export const forgotPassword = async (data: { email: string }) => {
  return await apiCall(API_ENDPOINTS.AUTH.ForgotPassword, 'POST', data);
};

export const resetPassword = async (data: {
  newPassword: string;
  confirmPassword: string;
  userId: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUTH.ResetPassword, 'POST', data);
};

export const resendOtp = async ({
  data,
  token,
}: {
  data: { email: string };
  token: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUTH.ResendOtp, 'POST', data, token);
};

export const generateBvnLink = async ({
  data,
  token,
}: {
  data: { bvn: string; type: string };
  token: string;
}) => {
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.RequestBvnConsent,
    'POST',
    data,
    token
  );
};

export const verifyUser = async ({
  data,
  token,
}: {
  data: { password: string };
  token: string;
}): Promise<any> => {
  return await apiCall(API_ENDPOINTS.AUTH.VerifyUser, 'POST', data, token);
};

export interface IUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
  accountNumber: string;
  accountBalance: string;
  created_at: string;
  updated_at: string;
}

interface IUserLoginResponse {
  message: string;
  user: IUserProfile;
  token: string;
  status: string;
}
