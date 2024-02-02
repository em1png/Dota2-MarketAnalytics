import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/axios";
import { IFetchUpdateItemReq, IItem, IItemsSliceState, RootState } from "@/types/types";

export const fetchItems = createAsyncThunk<IItem[]>("items/fetchItems", async () => {
    const { data } = await axios.get<IItem[]>(`/api/items`);
    return data;
});

export const updateItem = createAsyncThunk<IItem, IFetchUpdateItemReq>("items/updateItem", async (params, { dispatch }) => {
  try {
    const { data } = await axios.patch(`/api/items/${params.itemId}`, params);
    dispatch(fetchItems());

    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
});

export const deleteItem = createAsyncThunk<IItem, IFetchUpdateItemReq>("items/deleteItem", async (params, { dispatch }) => {
  try {
    const { data } = await axios.delete(`/api/items/${params.itemId}`);
    dispatch(fetchItems());

    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
});

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    itemsList: null,
    loading: true,
  } as IItemsSliceState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.itemsList = action.payload;
        state.loading = false;
      })
  },
});

export default itemsSlice.reducer;

export const itemsListSelector = (state: RootState) => state.items.itemsList;