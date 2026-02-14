import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CurrencyRate {
    id: number;
    Code: string;
    Ccy: string;
    CcyNm_RU: string;
    CcyNm_UZ: string;
    CcyNm_UZC: string;
    CcyNm_EN: string;
    Nominal: string;
    Rate: string;
    Diff: string;
    Date: string;
}

export const currencyApi = createApi({
    reducerPath: 'currencyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://cbu.uz/ru/arkhiv-kursov-valyut/json/',
    }),
    endpoints: (builder) => ({
        getUSDRate: builder.query<CurrencyRate[], void>({
            query: () => 'USD/',
            transformResponse: (response: CurrencyRate[]) => response,
        }),
    }),
});

export const { useGetUSDRateQuery } = currencyApi;


