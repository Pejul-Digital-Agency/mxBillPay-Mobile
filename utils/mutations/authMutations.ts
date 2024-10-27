import { apiCall } from '../customApiCall';
import { API_ENDPOINTS } from '@/apiConfig';
import { InputValues as SignUpProps } from '@/app/signup';
import { InputValues as LoginProps } from '@/app/login';

export const signUpUser = async (data: SignUpProps): Promise<any> => {
  return await apiCall(API_ENDPOINTS.AUTH.Register, 'POST', data);
};

export const loginUser = async (data: LoginProps): Promise<any> => {
  return await apiCall(API_ENDPOINTS.AUTH.Login, 'POST', data);
};

export const verifyEmailOTP = async ({
  user_id,
  otp,
}: {
  user_id: string;
  otp: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUTH.VerfiyEmailOtp, 'POST', {
    user_id: user_id.toString(),
    otp,
  });
};

export const verifyPasswordOTP = async (data: {
  user_id: string;
  otp: string;
}) => {
  return await apiCall(API_ENDPOINTS.AUTH.VerifyPasswordOtp, 'POST', data);
};

export const forgotPassword = async (email: string) => {
  return await apiCall(API_ENDPOINTS.AUTH.ForgotPassword, 'POST', { email });
};

export const resetPassword = async (data: {
  user_id: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const { user_id, newPassword, confirmPassword } = data;
  return await apiCall(API_ENDPOINTS.AUTH.ResetPassword, 'POST', {
    user_id,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
};

export const resendOtp = async (data: { email: string; userId: string }) => {
  return await apiCall(API_ENDPOINTS.AUTH.ResendOtp, 'POST', data);
};

export const generateBvnLink = async (data: {
  bvn: string;
  userId: string;
  type: string;
}) => {
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.RequestBvnConsent,
    'POST',
    data
  );
};
