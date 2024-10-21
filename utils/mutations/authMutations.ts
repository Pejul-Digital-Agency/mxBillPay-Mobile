import axios from 'axios';
import { API_ENDPOINTS } from '@/apiConfig';
import { InputValues as SignUpProps } from '@/app/signup';
import { InputValues as LoginProps } from '@/app/login';

export const signUpUser = async (data: SignUpProps): Promise<any> => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.Register, data);
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
    const response = await axios.post(API_ENDPOINTS.AUTH.Login, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const verifyEmailOTP = async ({
  user_id,
  otp,
}: {
  user_id: string;
  otp: string;
}): Promise<any> => {
  console.log(otp);
  try {
    console.log('userId', user_id);
    const response = await axios.post(API_ENDPOINTS.AUTH.VerfiyEmailOtp, {
      user_id: user_id.toString(),
      otp,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};
export const verifyPasswordOTP = async ({
  user_id,
  otp,
}: {
  user_id: string;
  otp: string;
}): Promise<any> => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.VerifyPasswordOtp, {
      user_id,
      otp,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.ForgotPassword, {
      email,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const resetPassword = async (data: {
  user_id: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any> => {
  const { user_id, newPassword, confirmPassword } = data;
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.ResetPassword, {
      user_id,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};
export const resendOtp = async (data: { email: string; userId: string }) => {
  try {
    const response = await axios.post(API_ENDPOINTS.AUTH.ResendOtp, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Something went wrong');
    } else {
      throw new Error('Something went wrong');
    }
  }
};
