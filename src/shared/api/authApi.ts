import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export interface SignInPayload {
    username: string;
    password: string;
}

export interface SignInResponse {
    access_token: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
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
        signInModerator: builder.mutation<SignInResponse, SignInPayload>({
            query: (body) => ({
                url: '/auth/moderator/signin',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useSignInModeratorMutation } = authApi;
