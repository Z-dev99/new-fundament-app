import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Интерфейсы
export interface Review {
    id: string;
    review: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

export interface ReviewResponse {
    total: number;
    size: number;
    reviews: Review[];
}

export interface CreateReviewPayload {
    review: string;
    first_name: string;
    last_name: string;
}

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getReviews: builder.query<ReviewResponse, { page?: number; page_size?: number }>({
            query: ({ page = 1, page_size = 12 }) => `/review?page=${page}&page_size=${page_size}`,
        }),

        getReviewsModeration: builder.query<ReviewResponse, { page?: number; page_size?: number }>({
            query: ({ page = 1, page_size = 12 }) => ({
                url: `/review/moderation?page=${page}&page_size=${page_size}`,
                method: "GET",
            }),
        }),

        patchReview: builder.mutation<Review, string>({
            query: (id) => ({
                url: `/review/${id}`,
                method: "PATCH",
            }),
        }),

        deleteReview: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `/review/${id}`,
                method: "DELETE",
            }),
        }),

        createReview: builder.mutation<Review, CreateReviewPayload>({
            query: (body) => ({
                url: `/review`,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetReviewsQuery,
    useGetReviewsModerationQuery,
    usePatchReviewMutation,
    useDeleteReviewMutation,
    useCreateReviewMutation,
} = reviewApi;
