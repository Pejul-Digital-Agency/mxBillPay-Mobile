import { API_ENDPOINTS } from '@/apiConfig';
import { apiCall } from '../customApiCall';

export const getBillerCategories = async (): Promise<IBillerCategories> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.GetBillerCategories,
    'GET'
  );
};

export const getBillerItems = async (
  categoryId: string
): Promise<IBillerItemsListData> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.GetBillerItems + '/' + categoryId,
    'GET'
  );
};

export const getBillerItemDetails = async (
  itemId: string
): Promise<IBillerItemDetailsData> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.GetBillerItemDetails + '/' + itemId,
    'GET'
  );
};

export const validateCustomer = async (data: {
  phone: string;
  email: string;
}): Promise<any> => {
  return await apiCall(
    API_ENDPOINTS.BILL_MANAGEMENT.ValidateCustomer,
    'POST',
    data
  );
};

interface IBillerCategories {
  message: string;
  data: [
    {
      id: number;
      category: string;
      icon?: string;
      iconColor?: string;
    }
  ];
}

export interface IBillerItemsList {
  category: {
    id: number;
    category: string;
    icon?: string;
  };
  itemList: [
    {
      id: number;
      paymentitemname: string;
    }
  ];
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
};
interface IBillerItemDetailsData {
  message: string;
  data: IBillerItemDetails;
}
