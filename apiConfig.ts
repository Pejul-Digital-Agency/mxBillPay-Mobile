const API_DOMAIN: string = 'https://mxbillpay.hmstech.org/api';

const API_ENDPOINTS = {
  AUTH: {
    Login: API_DOMAIN + '/login',
    Register: API_DOMAIN + '/register',
    Logout: API_DOMAIN + '/logout',
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
