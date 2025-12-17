import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export type BannerType = 'LEFT_SIDE' | 'RIGHT_SIDE' | 'MIDDLE_SIDE';

export interface Banner {
    banner_type: BannerType;
    file_name: string;
}

export interface CreateBannerPayload {
    banner_type: BannerType;
    file_name: string;
}

export const bannersApi = createApi({
    reducerPath: 'bannersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/?$/, "/"),
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getBanners: builder.query<Banner[], void>({
            query: () => 'banner',
        }),

        getBannerByType: builder.query<Banner, BannerType>({
            query: (type) => `banner/${type}`,
        }),

        createBanner: builder.mutation<Banner, CreateBannerPayload>({
            query: ({ banner_type, file_name }) => ({
                url: 'banner',
                method: 'POST',
                body: { banner_type, file_name },
            }),
        }),

        deleteBannerByType: builder.mutation<{ success: boolean }, BannerType>({
            query: (type) => ({
                url: `banner/${type}`,
                method: 'DELETE',
            }),
        }),

        deleteBannerByFileName: builder.mutation<{ success: boolean }, { banner_type: BannerType; file_name: string }>({
            query: ({ banner_type, file_name }) => ({
                url: `banner/${banner_type}/${file_name}`,
                method: 'DELETE',
            }),
        }),

        getPresignedUrl: builder.mutation<{ presigned_url: string; file_name: string }, { file_name: string; content_type: string }>({
            query: ({ file_name, content_type }) => ({
                url: 'banner/upload-url',
                method: 'POST',
                body: { file_name, content_type },
            }),
        }),
    }),
});

export const {
    useGetBannersQuery,
    useGetBannerByTypeQuery,
    useCreateBannerMutation,
    useDeleteBannerByTypeMutation,
    useDeleteBannerByFileNameMutation,
    useGetPresignedUrlMutation,
} = bannersApi;
