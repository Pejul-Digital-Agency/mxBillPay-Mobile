const API_DOMAIN = 'https://mxbillpay.hmstech.org/api';

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
    GetUserProfileData: API_DOMAIN + '/profile-detail',
    RequestBvnConsent: API_DOMAIN + '/accounts/bvn-consent',
    CreateIndividualAccount: API_DOMAIN + '/accounts/individual',
    CreateCoorporateAccount: API_DOMAIN + '/accounts/coorporate',
    ReleaseAccount: API_DOMAIN + '/accounts/release',
    DeleteAccount: API_DOMAIN + '/accounts',
  },
  BILL_MANAGEMENT: {
    GetBillerCategories: API_DOMAIN + '/biller-categories-fetch',
    GetBillerItems: API_DOMAIN + '/biller-items-fetch',
    GetBillerItemDetails: API_DOMAIN + '/biller-Item-details',
    ValidateCustomer: API_DOMAIN + '/Validate-Customer',
    PayBills: API_DOMAIN + '/payBills',
    DeleteBill: API_DOMAIN + '/bills',
  },
  MONEY_TRANSFER: {
    GetBanks: API_DOMAIN + '/fetch-banks',
    Trasnsfer: API_DOMAIN + '/transfer',
    GetRecepientDetails: API_DOMAIN + '/recepient-details',
    GetTransactionStatus: API_DOMAIN + '/transaction-Status',
  },
};

export { API_DOMAIN, API_ENDPOINTS };
