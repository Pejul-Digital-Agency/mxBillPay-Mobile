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
    CheckBvnStatus: API_DOMAIN + '/check-user-status',
    CheckBvnVerified: API_DOMAIN + '/check-bvn-status',
    VerifyUser: API_DOMAIN + '/verify-user',
  },
  ACCOUNT_MANAGEMENT: {
    GetUserProfileData: API_DOMAIN + '/edit-profile-details',
    RequestBvnConsent: API_DOMAIN + '/accounts/bvn-consent',
    CreateIndividualAccount: API_DOMAIN + '/accounts/individual',
    CreateCoorporateAccount: API_DOMAIN + '/accounts/coorporate',
    ReleaseAccount: API_DOMAIN + '/accounts/release',
    DeleteAccount: API_DOMAIN + '/accounts',
    UpdatePassword: API_DOMAIN + '/update-password',
    UpdateEmail: API_DOMAIN + '/update-email',
    GetNotifications: API_DOMAIN + '/unread-notifications',
    markAllNotificationsAsRead: API_DOMAIN + '/mark-all-read',
    GetBillPaymentHistory: API_DOMAIN + '/get-billpayments',
    GetTransferHistory: API_DOMAIN + '/get-transfer',
    UpdateProfile: API_DOMAIN + '/update-profile',
    GetBalance: API_DOMAIN + '/balance',
    GetMonthlyStats: API_DOMAIN + '/monthly-stats',
    GetQuarterlyStats: API_DOMAIN + '/quarterly-stats',
    GetYearlyStats: API_DOMAIN + '/yearly-stats',
    GetSocialMediaLinks:API_DOMAIN+'/social-media-links',
    GetFaqs: API_DOMAIN + '/faq',
    GetSlides: API_DOMAIN + '/slides',
  },
  BILL_MANAGEMENT: {
    GetBillerCategories: API_DOMAIN + '/biller-categories-fetch',
    GetBillerProviders: API_DOMAIN + '/get-provider',
    GetBillerItems: API_DOMAIN + '/biller-items-fetch',
    GetBillerItemDetails: API_DOMAIN + '/biller-Item-details',
    ValidateCustomer: API_DOMAIN + '/Validate-Customer',
    PayBills: API_DOMAIN + '/payBills',
    DeleteBill: API_DOMAIN + '/bills',
    TransactionDetails: API_DOMAIN + '/transaction-details',
    
  },
  MONEY_TRANSFER: {
    GetBanks: API_DOMAIN + '/fetch-banks',
    Trasnsfer: API_DOMAIN + '/transfer',
    GetRecepientDetails: API_DOMAIN + '/recepient-details',
    GetTransactionStatus: API_DOMAIN + '/transaction-Status',
    GetFundAccountNo: API_DOMAIN + '/fund-account',
  },
};

export { API_DOMAIN, API_ENDPOINTS };
