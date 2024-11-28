import { API_ENDPOINTS } from '@/apiConfig';
import { apiCall } from '../customApiCall';

export const getBillerCategories = async ({
  token,
}: {
  token: string;
}): Promise<IBillerCategoriesResponse> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.GetBillerCategories,
    'GET',
    undefined,
    token
  );
};

export const getBillerProviders = async (
  categoryId: string,
  token: string
): Promise<IBillerProvidersResponse> => {
  return await apiCall(
    `${API_ENDPOINTS.BILL_MANAGEMENT.GetBillerProviders}/${categoryId}`,
    'GET',
    undefined,
    token
  );
};

export const getBillerItems = async ({
  categoryId,
  providerId,
  token,
}: {
  categoryId: string;
  providerId: string;
  token: string;
}): Promise<IBillerItemsListData> => {
  return await apiCall(
    `${API_ENDPOINTS.BILL_MANAGEMENT.GetBillerItems}/${categoryId}/${providerId}`,
    'GET',
    undefined,
    token
  );
};

export const getBillerItemDetails = async ({
  itemId,
  token,
}: {
  itemId: string;
  token: string;
}): Promise<IBillerItemDetailsData> => {
  return await apiCall(
    `${API_ENDPOINTS.BILL_MANAGEMENT.GetBillerItemDetails}/${itemId}`,
    'GET',
    undefined,
    token
  );
};

export const getBanks = async (token: string): Promise<IBanksResponse> => {
  return await apiCall(
    API_ENDPOINTS.MONEY_TRANSFER.GetBanks,
    'GET',
    undefined,
    token
  );
};

export const getTransactionStatus = async ({
  transactionId,
  token,
}: {
  transactionId: string;
  token: string;
}) => {
  return await apiCall(
    API_ENDPOINTS.MONEY_TRANSFER.GetTransactionStatus,
    'GET',
    transactionId,
    token
  );
};

interface IBillerCategoriesResponse {
  message: string;
  data: IBillerCategory[];
}
export interface IBillerCategory {
  id: number;
  category: string;
  icon?: string;
  iconColor?: string;
}

interface IBillerProvidersResponse {
  status: 'success' | 'error';
  data: IProviderData[];
}

export interface IProviderData {
  id: number;
  title: string;
  slug: string;
  logo: string;
}
export interface IBillerItemsList {
  category: {
    id: number;
    category: string;
    icon?: string;
    iconColor?: string;
  };
  itemList: IBillerItem[];
}

export interface IBillerItem {
  id: number;
  paymentitemname: string;
  percentageComission: string;
  logo: string;
}

interface IBillerItemsListData {
  message: string;
  data: IBillerItemsList;
}

export type IBillerItemDetails = {
  id: number;
  category_id: number;
  paymentitemname: string;
  paymentCode: string;
  productId: string;
  paymentitemid: string;
  currencySymbol: string;
  isAmountFixed: number;
  itemFee: string;
  itemCurrencySymbol: string;
  pictureId: string;
  billerType: string;
  payDirectitemCode: string;
  currencyCode: string;
  division: string;
  fixed_commission: string;
  percentage_commission: string;
  created_at: string;
  updated_at: string;
  billerId: string;
  icon?: string;
  iconColor?: string;
};

interface IBillerItemDetailsData {
  message: string;
  data: IBillerItemDetails;
}

interface IBanksResponse {
  status: string;
  data: IBankDetails[];
}

export interface IBankDetails {
  id: number;
  name: string;
  code: string;
  logo: string | null;
}
