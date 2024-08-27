import { store } from "@/store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface IUserData {
  _id: string;
  username: string;
  email: string;
  accessLevel: "user" | "admin";
  token: string;
}

export interface IAuthSliceState {
  data: IUserData | null;
  loading: boolean;
}

export interface IFetchSigninParams {
  email: string;
  password: string;
}

export interface IFetchSignupParams {
  username: string;
  email: string;
  password: string;
}

export interface IItem {
  heroName: string;
  itemName: string;
  marketId: number;
  imageUrl: string;
  classId: number;
  instanceId: number;
  type: string;
  nameColor: string;

  steamMarket: {
    price: number;
    quantity: number;
    marketId: number;
    minBuyOrder: number;
    data: {
      byWeeksData: [Date, number, number][];
      monthData: [Date, number, number][]; 
    };
    stats: {
      minPriceYear: number;
      maxPriceYear: number;
      averagePriceYear: number;
      averageSalesYear: number;
    }
  };
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IItemsSliceState {
  itemsList: IItem[] | null;
  loading: boolean;
}

export interface IItemInfo {
  heroName: string;
  itemName: string;
  imageUrl: string;
  currentPrice: number;
}

export interface IUserItem {
  _id: string;
  userId: string;
  itemId: string;
  buyPrice: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  itemInfo: IItemInfo;
}

export interface IFetchUpdateItemReq {
  itemId: string;
  steamCurrentPrice?: boolean;
  d2marketCurrentPrice?: boolean; 
  steamGeneralData?: boolean;
}

export interface IFetchGetUserOwnedItems {
  _id: string;
  userId: string;
  itemId: string;
  buyPrice: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  itemInfo: IItemInfo;
}

export interface IFetchGetUserSoldItems extends IFetchGetUserOwnedItems {
  sellPrice: number,
}

