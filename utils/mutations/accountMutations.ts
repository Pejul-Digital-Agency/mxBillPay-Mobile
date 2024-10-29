import axios from 'axios';
import { API_ENDPOINTS } from '@/apiConfig';
import { IClientCreation } from '@/app/fillyourprofile';
import { ICooperateClient } from '@/app/createcoroporateaccount';
import { apiCall } from '../customApiCall';

export const createIndividualAccount = async ({
  data,
  token,
}: {
  data: FormData;
  token: string;
}) => {
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateIndividualAccount,
    'POST',
    data,
    token
  );
};

export const createCooperateAccount = async ({
  data,
  token,
}: {
  data: ICooperateClient;
  token: string;
}) => {
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.CreateCoorporateAccount,
    'POST',
    data,
    token
  );
};

export const validateCustomer = async ({
  data,
  token,
}: {
  data: { customerId: string; id: string };
  token: string;
}): Promise<any> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.ValidateCustomer,
    'POST',
    data,
    token
  );
};

export const payBillFn = async ({
  data,
  token,
}: {
  data: IPayBill;
  token: string;
}): Promise<any> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.PayBills,
    'POST',
    data,
    token
  );
};

export interface IPayBill {
  billerId: string;
  amount: string;
  customerId: string;
  billerItemId: string;
  phoneNumber: string;
  // paymentMethod: string;
}
