import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export type BannerType = 'LEFT_SIDE' | 'RIGHT_SIDE' | 'MIDDLE_SIDE';

export interface Banner {
    id: string;
    banner_type: BannerType;
    file_name: string;
}

export interface CreateBannerPayload {
    banner_type: BannerType;
    file: File;
}

const baseUrl = (() => {
    let url = process.env.NEXT_PUBLIC_API_URL || "https://fundament.uz/api/v1/";
    url = url.replace(/\/+$/, "");
    return `${url}/`;
})();

export const bannersApi = createApi({
    reducerPath: 'bannersApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
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
            queryFn: async () => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banners`;

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        headers,
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json();
                    return { data };
                } catch (error: any) {
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        getBannerByType: builder.query<Banner[], BannerType>({
            queryFn: async (type) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banners/${type}`;

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        headers,
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json();
                    return { data };
                } catch (error: any) {
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        createBanner: builder.mutation<void, CreateBannerPayload>({
            queryFn: async ({ banner_type, file }) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banners/${banner_type}`;

                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'POST',
                        headers,
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        return { error: { status: response.status, data: errorData } };
                    }

                    return { data: undefined };
                } catch (error: any) {
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        deleteBanner: builder.mutation<void, string>({
            queryFn: async (banner_id) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banners/${banner_id}`;

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers,
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        return { error: { status: response.status, data: errorData } };
                    }

                    return { data: undefined };
                } catch (error: any) {
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

    }),
});

export const {
    useGetBannerByTypeQuery,
    useCreateBannerMutation,
    useDeleteBannerMutation,
} = bannersApi;
