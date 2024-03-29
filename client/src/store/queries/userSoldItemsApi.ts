import { IFetchGetUserSoldItems } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const token = localStorage.getItem("token");

export const userSoldItemsApi = createApi({
  reducerPath: "UserSalesHistory",
  tagTypes: ["UserSalesHistory"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4445/api/solditems", headers: { Authorization: `Bearer ${token}` }}),
  endpoints: (builder) => ({

    getUserSalesHistory: builder.query<IFetchGetUserSoldItems[], string>({
      query: (userId: string) => ({url: `/${userId}`, headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` }}),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "UserSalesHistory" as const, id })), { type: "UserSalesHistory", id: "LIST" } ]
          : [{ type: "UserSalesHistory", id: "LIST" }],
    }),

    addSalesHistory: builder.mutation({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
        headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` }
      }),
      invalidatesTags: [{ type: "UserSalesHistory", id: "LIST" }],
    }),

    deleteSalesHistory: builder.mutation({
      query: (body) => ({
        url: `/${body.itemId}`,
        method: "DELETE",
        body,
        headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` }
      }),
      invalidatesTags: [{ type: "UserSalesHistory", id: "LIST" }],
    }),

  }),
});

export const {
  useAddSalesHistoryMutation,
  useDeleteSalesHistoryMutation,
  useGetUserSalesHistoryQuery
} = userSoldItemsApi;
