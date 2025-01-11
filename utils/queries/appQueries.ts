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

export const getTrsansactionDetails = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<TransactionResponse> => {
  return await apiCall(
    `${API_ENDPOINTS.BILL_MANAGEMENT.TransactionDetails}/${id}`,
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

export const getSocialMediaLinks = async (): Promise<SocialMediaResponse> => {
  console.log("social media api  called")
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.GetSocialMediaLinks,
    'GET',
    undefined,
  );
};

export const getFaqs = async (): Promise<FaqRespone> => {
  console.log("Faq a[o ca;;ed")
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.GetFaqs,
    'GET',
    undefined,
  );
};
export const getSlide = async (): Promise<SlideResponse> => {
  console.log("Slides called")
  return await apiCall(
    API_ENDPOINTS.ACCOUNT_MANAGEMENT.GetSlides,
    'GET',
    undefined,
  );
};
interface SlideResponse {
  status: 'success' | 'error';
  data: Slide[]
}

interface Slide {
  id: number;
  image: string;
}
interface IBillerCategoriesResponse {
  message: string;
  data: IBillerCategory[];
}
export interface IBillerCategory {
  id: number;
  category: string;
  isCategory: 0 | 1;
  icon?: string;
  categoryTitile?: string;
  categoryDescription?: string;
  selectTitle?: string;
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
  description: string;
  providerTitle: string;
  selectTitle: string;
  logo: string;
  status?: boolean
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
  amount: string;
  paymentitemname: string;
  percentageComission: string;
  fixedComission: string;
  paymentCode: string;
  divisionId: string;
  productId: string;
  category_id: number;
  // productId:string
  logo: string;
  billerId: string;
  // percentageComission
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
  amount?: number;
};

interface IBillerItemDetailsData {
  message: string;
  data: IBillerItemDetails;
}

interface IBanksResponse {
  status: string;
  data: IBankDetails[];
}
interface SocialMediaResponse {
  status: string;
  data: SocialMediaLinks[];
}
interface SocialMediaLinks {
  title?: string;
  link?: string;
  icon?: string;
}
interface FaqRespone {
  status: string;
  data: Faq[];
}
interface Faq {
  id: number;
  question: string;
  answer: string;

}

export interface IBankDetails {
  id: number;
  name: string;
  code: string;
  logo: string | null;
}
export interface TransactionResponse {
  status: string;
  data: TransactionDetails[]
}
export interface TransactionDetails {
  id: number;
  amount?: string;
  transactionDate?: string;
  transactionId?: string;
  category?: string;
  item?: string;
  billerType?: string;
  status?: string;
  provider?: string;
}