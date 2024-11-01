import axios from 'axios';
import { API_ENDPOINTS } from '../../apiConfig';
import { apiCall } from '../customApiCall';

export const getReceipientDetails = async ({
  data,
  token,
}: {
  data: IRecepeintDetailsRequest;
  token: string;
}): Promise<IRecepeintDetailsResponse> => {
  return await apiCall(
    API_ENDPOINTS.MONEY_TRANSFER.GetRecepientDetails,
    'POST',
    data,
    token
  );
};

export const transferMoney = async ({
  data,
  token,
}: {
  data: ITransferRequest;
  token: string;
}): Promise<ITransferResponse> => {
  return await apiCall(
    API_ENDPOINTS.MONEY_TRANSFER.Trasnsfer,
    'POST',
    data,
    token
  );
};

interface IRecepeintDetailsRequest {
  accountNo: string;
  bank: string;
  transfer_type: string;
}

export interface IRecepeintDetails {
  name: string;
  clientId: string;
  bvn: string;
  account: {
    number: string;
    id: string;
  };
  status: string;
  currency: string;
  bank: string;
}
type IRecepeintDetailsResponse = {
  status: string;
  message: string;
  data: IRecepeintDetails;
};

export interface ITransferRequest {
  toClientId: string;
  toClient: string; // Beneficiary's client name
  toClientName: string;
  toSavingsId: string;
  toBvn: string;
  toAccount: string; // Beneficiary's account number
  toBank: string; // Beneficiary's bank code, its 9999
  amount: string; // Amount to transfer
  remark: string; // Transaction remark
  transferType: 'intra' | 'inter'; // Specify transfer type (intra or inter)
}

interface ITransferResponse {
  status: string;
  message: string;
  data: {
    txnId: string;
  };
}
