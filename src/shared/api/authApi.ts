import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface ModeratorSignInPayload {
    username: string;
    password: string;
}

export interface OwnerSignInPayload {
    email: string;
    password: string;
}

export interface OwnerSignUpPayload {
    email: string;
    password: string;
    first_name: string;
    middle_name: string;
    last_name: string;
}

export interface SignInResponse {
    access_token: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/?$/, "/"),
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        signInModerator: builder.mutation<SignInResponse, ModeratorSignInPayload>({
            query: (body) => ({
                url: "auth/moderator/signin",
                method: "POST",
                body,
            }),
        }),
        signUpOwner: builder.mutation<void, OwnerSignUpPayload>({
            query: (body) => ({
                // Регистрация владельца по спецификации: /api/v1/auth/owner/signup
                url: "auth/owner/signup",
                method: "POST",
                body,
            }),
        }),
        signInOwner: builder.mutation<SignInResponse, OwnerSignInPayload>({
            query: (body) => ({
                // Логин владельца: /api/v1/auth/owner/signin
                url: "auth/owner/signin",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useSignInModeratorMutation,
    useSignUpOwnerMutation,
    useSignInOwnerMutation,
} = authApi;
