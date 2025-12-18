import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export type BannerType = 'LEFT_SIDE' | 'RIGHT_SIDE' | 'MIDDLE_SIDE';

export interface Banner {
    id?: string;
    banner_type: BannerType;
    file_name: string;
}

export interface CreateBannerPayload {
    banner_type: BannerType;
    file_name: string;
}

export interface CreateBannerResponse {
    id?: string;
    banner_type: BannerType;
    file_name: string;
    presigned_url: string;
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/?$/, "/");

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
                const url = `${baseUrl}banner`;
                const startTime = performance.now();

                console.log(`📡 API Request → GET ${url}`);

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        headers,
                    });

                    const duration = (performance.now() - startTime).toFixed(1);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`❌ API Error ← GET ${url} (${duration} ms)`, {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData,
                        });
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json();
                    console.log(`📨 API Response ← GET ${url} (${duration} ms)`, {
                        data,
                    });
                    console.log(`Body:`, JSON.stringify(data, null, 2));

                    return { data };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← GET ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        getBannerByType: builder.query<Banner, BannerType>({
            queryFn: async (type) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banner/${type}`;
                const startTime = performance.now();

                console.log(`📡 API Request → GET ${url}`);

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        headers,
                    });

                    const duration = (performance.now() - startTime).toFixed(1);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`❌ API Error ← GET ${url} (${duration} ms)`, {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData,
                        });
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json();
                    console.log(`📨 API Response ← GET ${url} (${duration} ms)`, {
                        data,
                    });
                    console.log(`Body:`, JSON.stringify(data, null, 2));

                    return { data };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← GET ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        createBanner: builder.mutation<CreateBannerResponse, CreateBannerPayload>({
            queryFn: async ({ banner_type, file_name }) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banner`;
                const startTime = performance.now();
                const body = { banner_type, file_name };

                console.log(`📡 API Request → POST ${url}`);
                console.log(`Body:`, JSON.stringify(body, null, 2));

                try {
                    const headers: HeadersInit = {
                        'Content-Type': 'application/json',
                    };
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(body),
                    });

                    const duration = (performance.now() - startTime).toFixed(1);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`❌ API Error ← POST ${url} (${duration} ms)`, {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData,
                        });
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json();
                    console.log(`📨 API Response ← POST ${url} (${duration} ms)`, {
                        data,
                    });
                    console.log(`Body:`, JSON.stringify(data, null, 2));

                    return { data };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← POST ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        deleteBannerByType: builder.mutation<{ success: boolean }, BannerType>({
            queryFn: async (type) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banner/${type}`;
                const startTime = performance.now();

                console.log(`📡 API Request → DELETE ${url}`);

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers,
                    });

                    const duration = (performance.now() - startTime).toFixed(1);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`❌ API Error ← DELETE ${url} (${duration} ms)`, {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData,
                        });
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json().catch(() => ({ success: true }));
                    console.log(`📨 API Response ← DELETE ${url} (${duration} ms)`, {
                        data,
                    });
                    console.log(`Body:`, JSON.stringify(data, null, 2));

                    return { data };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← DELETE ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        deleteBannerByFileName: builder.mutation<{ success: boolean }, { banner_type: BannerType; file_name: string }>({
            queryFn: async ({ banner_type, file_name }) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banner/${banner_type}/${encodeURIComponent(file_name)}`;
                const startTime = performance.now();

                console.log(`📡 API Request → DELETE ${url}`);
                console.log(`Params:`, { banner_type, file_name });

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers,
                    });

                    const duration = (performance.now() - startTime).toFixed(1);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`❌ API Error ← DELETE ${url} (${duration} ms)`, {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData,
                        });
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json().catch(() => ({ success: true }));
                    console.log(`📨 API Response ← DELETE ${url} (${duration} ms)`, {
                        data,
                    });
                    console.log(`Body:`, JSON.stringify(data, null, 2));

                    return { data };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← DELETE ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        deleteBannerById: builder.mutation<{ success: boolean }, string>({
            queryFn: async (id) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banner/${id}`;
                const startTime = performance.now();

                console.log(`📡 API Request → DELETE ${url}`);
                console.log(`ID:`, id);

                try {
                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers,
                    });

                    const duration = (performance.now() - startTime).toFixed(1);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`❌ API Error ← DELETE ${url} (${duration} ms)`, {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData,
                        });
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json().catch(() => ({ success: true }));
                    console.log(`📨 API Response ← DELETE ${url} (${duration} ms)`, {
                        data,
                    });
                    console.log(`Body:`, JSON.stringify(data, null, 2));

                    return { data };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← DELETE ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        getPresignedUrl: builder.mutation<{ presigned_url: string; file_name: string }, { file_name: string; content_type: string }>({
            queryFn: async ({ file_name, content_type }) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banner/upload-url`;
                const startTime = performance.now();
                const body = { file_name, content_type };

                console.log(`📡 API Request → POST ${url}`);
                console.log(`Body:`, JSON.stringify(body, null, 2));

                try {
                    const headers: HeadersInit = {
                        'Content-Type': 'application/json',
                    };
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(body),
                    });

                    const duration = (performance.now() - startTime).toFixed(1);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`❌ API Error ← POST ${url} (${duration} ms)`, {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData,
                        });
                        return { error: { status: response.status, data: errorData } };
                    }

                    const data = await response.json();
                    console.log(`📨 API Response ← POST ${url} (${duration} ms)`, {
                        data,
                    });
                    console.log(`Body:`, JSON.stringify(data, null, 2));

                    return { data };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← POST ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),
    }),
});

export const {
    useGetBannersQuery,
    useGetBannerByTypeQuery,
    useCreateBannerMutation,
    useDeleteBannerByTypeMutation,
    useDeleteBannerByFileNameMutation,
    useDeleteBannerByIdMutation,
    useGetPresignedUrlMutation,
} = bannersApi;
