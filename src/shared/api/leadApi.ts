import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export interface LeadRequest {
    id: string;
    first_name: string;
    phone_number: string;
    announcement_id: string;
    created_at: string;
}

export interface LeadRequestResponse {
    total: number;
    size: number;
    support_requests: LeadRequest[];
}

export interface CreateLeadRequestPayload {
    first_name: string;
    phone_number: string;
    announcement_id: string;
}

export const leadApi = createApi({
    reducerPath: 'leadApi',
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
        getLeadRequests: builder.query<LeadRequestResponse, { page?: number; page_size?: number }>({
            query: ({ page = 1, page_size = 12 }) => ({
                url: `/lead_request`,
                params: { page, page_size },
            }),
        }),
        createLeadRequest: builder.mutation<LeadRequest, CreateLeadRequestPayload>({
            query: (body) => ({
                url: `/lead_request`,
                method: 'POST',
                body,
            }),
        }),
        deleteLeadRequest: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `/lead_request/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetLeadRequestsQuery,
    useCreateLeadRequestMutation,
    useDeleteLeadRequestMutation
} = leadApi;
