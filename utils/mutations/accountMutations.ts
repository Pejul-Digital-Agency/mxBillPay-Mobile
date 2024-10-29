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

export const validateCustomer = async (data: {
  customerId: string;
  id: string;
}): Promise<any> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.ValidateCustomer,
    'POST',
    data
  );
};

export const payBillFn = async (data: IPayBill): Promise<any> => {
  return await apiCall(API_ENDPOINTS.BILL_MANAGEMENT.PayBills, 'POST', data);
};

export interface IPayBill {
  billerId: string;
  amount: number;
  customerId: string;
  billerItemId: string;
  phoneNumber: string;
  userId: string;
  // paymentMethod: string;
}
