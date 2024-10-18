const API_DOMAIN: string = 'https://mxbillpay.hmstech.org/api';

const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + '/auth/login',
    Register: API_DOMAIN + '/auth/register',
    Logout: API_DOMAIN + '/auth/logout',
    VerfiyEmailOtp: API_DOMAIN + '/auth/verify-email',
    ResendOtp: API_DOMAIN + '/auth/resend-otp',
    ForgotPassword: API_DOMAIN + '/auth/forget-password',
    VerifyPasswordOtp: API_DOMAIN + '/auth/reset-password-otp-verification',
    ResetPassword: API_DOMAIN + '/auth/reset-password',
  },
  ACCOUNT_MANAGEMENT: {
    RequestBvnConsent: API_DOMAIN + '/accounts/bvn-consent',
    CreateAccount: API_DOMAIN + '/accounts/individual',
    ReleaseAccount: API_DOMAIN + '/accounts/release',
    DeleteAccount: API_DOMAIN + '/accounts',
  },
  BILL_MANAGEMENT: {
    BillList: API_DOMAIN + '/bills',
    CreateBill: API_DOMAIN + '/bills',
    UpdateBill: API_DOMAIN + '/bills',
    DeleteBill: API_DOMAIN + '/bills',
  },
};

export { API_DOMAIN, API_ENDPOINTS };
