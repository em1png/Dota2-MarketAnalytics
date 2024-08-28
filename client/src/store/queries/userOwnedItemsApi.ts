import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userOwnedItemsApi = createApi({
  reducerPath: "userItems",
  tagTypes: ["UserItems"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://45.147.179.138:4445/api/owneditems" }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (userId: string) => ({url: `/${userId}`, headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` }}),
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }: {_id: string}) => {
            return ({ type: "UserItems" as const, _id })}), { type: "UserItems", id: "LIST" } ]
          : [{ type: "UserItems", id: "LIST" }],
    }),

    addItem: builder.mutation({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
        headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` }
      }),
      invalidatesTags: [{ type: "UserItems", id: "LIST" }],
    }),

    editItem: builder.mutation({
      query: (body) => ({
        url: `/${body.itemId}`,
        method: "PATCH",
        body,
        headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` }
      }),
      invalidatesTags: [{ type: "UserItems", id: "LIST" }],
    }),

    deleteItem: builder.mutation({
      query: (body) => ({
        url: `/${body.itemId}`,
        method: "DELETE",
        body,
        headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` }
      }),
      invalidatesTags: [{ type: "UserItems", id: "LIST" }],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useEditItemMutation
} = userOwnedItemsApi;
