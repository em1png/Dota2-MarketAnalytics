import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/authSlice";
import itemsReducer from "./slices/itemsSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userOwnedItemsApi } from "./queries/userOwnedItemsApi";
import { userSoldItemsApi } from "./queries/userSoldItemsApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer,
    [userOwnedItemsApi.reducerPath]: userOwnedItemsApi.reducer,
    [userSoldItemsApi.reducerPath]: userSoldItemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userOwnedItemsApi.middleware, userSoldItemsApi.middleware)
});

setupListeners(store.dispatch)
