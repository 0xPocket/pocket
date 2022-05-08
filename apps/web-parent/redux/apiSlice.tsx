import { UserChild } from '@lib/types/interfaces';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pocketApi = createApi({
  reducerPath: 'pocketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChildren: builder.query<UserChild[], any>({
      query: () => ({ url: 'users/parents/children', method: 'GET' }),
    }),
  }),
});

export const { useGetChildrenQuery } = pocketApi;
