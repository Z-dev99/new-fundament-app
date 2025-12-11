import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface StatsResponse {
    apartments_sold_monthly: string;
    average_price_one_room: string;
    avg_sale_days: string;
    news_message: string;
}

export interface UpdateStatsPayload {
    apartments_sold_monthly: string;
    average_price_one_room: string;
    avg_sale_days: string;
    news_message: string;
}

export const statsApi = createApi({
    reducerPath: 'statsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    }),
    endpoints: (builder) => ({
        getStats: builder.query<StatsResponse, void>({
            query: () => '/stats',
        }),
        updateStats: builder.mutation<StatsResponse, UpdateStatsPayload>({
            query: (body) => ({
                url: '/stats',
                method: 'PUT',
                body,
            }),
        }),
    }),
});

export const { useGetStatsQuery, useUpdateStatsMutation } = statsApi;
