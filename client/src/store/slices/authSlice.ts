import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/axios";
import { IFetchSignupParams, RootState } from "../../types/types";
import { IAuthSliceState, IFetchSigninParams, IUserData } from "@/types/types";

export const fetchSignup = createAsyncThunk<IUserData, IFetchSignupParams>(
  "user/signup",
  async function (params, { rejectWithValue }) {
    try {
      const { data } = await axios.post<IUserData>("/api/register", params);
      if (data.token) {
        window.localStorage.setItem("token", String(data.token));
      } else {
        throw new Error("Не удалось найти токен");
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.status);
    }
  }
);

export const fetchSignin = createAsyncThunk<IUserData, IFetchSigninParams>(
  "user/signin",
  async function (params, { rejectWithValue }) {
    try {
      const { data } = await axios.post<IUserData>("/api/login", params);
      if (data.token) {
        window.localStorage.setItem("token", String(data.token));
      } else {
        throw new Error("Не удалось найти токен");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.status);
    }
  }
);

export const fetchAuthMe = createAsyncThunk<IUserData>(
  "user/auth",
  async function () {
    const { data } = await axios.get<IUserData>("/api/users/me");
    return data;
  }
);

const authSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: true,
  } as IAuthSliceState,
  reducers: {
    signout: (state) => {
      state.data = null;
      state.loading = false;
      window.localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchSignin.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
export const { signout } = authSlice.actions;

export const isAuthSelector = (state: RootState) => Boolean(state.user.data);
