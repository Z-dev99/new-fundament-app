import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export interface SupportRequest {
    id: string;
    first_name: string;
    phone_number: string;
    details: string;
    created_at: string;
}

export interface SupportRequestResponse {
    total: number;
    size: number;
    support_requests: SupportRequest[];
}

export interface CreateSupportRequestPayload {
    first_name: string;
    phone_number: string;
    details: string;
}

export const supportApi = createApi({
    reducerPath: 'supportApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSupportRequests: builder.query<SupportRequestResponse, { page?: number; page_size?: number }>({
            query: ({ page = 1, page_size = 12 }) => ({
                url: `/support_request`,
                params: { page, page_size },
            }),
        }),
        createSupportRequest: builder.mutation<SupportRequest, CreateSupportRequestPayload>({
            query: (body) => ({
                url: `/support_request`,
                method: 'POST',
                body,
            }),
        }),
        deleteSupportRequest: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `/support_request/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetSupportRequestsQuery,
    useCreateSupportRequestMutation,
    useDeleteSupportRequestMutation
} = supportApi;
