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
    // Нормализуем baseUrl - убираем все слэши в конце и добавляем один
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
                        // Для 404 и 401 не логируем как ошибку - это нормальная ситуация для публичного эндпоинта
                        if (response.status !== 404 && response.status !== 401) {
                            console.error(`❌ API Error ← GET ${url} (${duration} ms)`, {
                                status: response.status,
                                statusText: response.statusText,
                                error: errorData,
                            });
                        }
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

        getBannerByType: builder.query<Banner[], BannerType>({
            queryFn: async (type) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banners/${type}`;
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
                        // Для 404 не логируем как ошибку - это нормальная ситуация, когда баннер еще не добавлен
                        if (response.status !== 404) {
                            console.error(`❌ API Error ← GET ${url} (${duration} ms)`, {
                                status: response.status,
                                statusText: response.statusText,
                                error: errorData,
                            });
                        }
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

        createBanner: builder.mutation<void, CreateBannerPayload>({
            queryFn: async ({ banner_type, file }) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banners/${banner_type}`;
                const startTime = performance.now();

                console.log(`📡 API Request → POST ${url}`);
                console.log(`File:`, file.name, `Size:`, file.size, `Type:`, file.type);

                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const headers: HeadersInit = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                    // Не устанавливаем Content-Type - браузер установит его автоматически с boundary для FormData

                    const response = await fetch(url, {
                        method: 'POST',
                        headers,
                        body: formData,
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

                    console.log(`📨 API Response ← POST ${url} (${duration} ms) - Success`);
                    // POST возвращает 201 без тела ответа
                    return { data: undefined };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← POST ${url} (${duration} ms)`, error);
                    return { error: { status: 'FETCH_ERROR' as const, error: error.message } };
                }
            },
        }),

        deleteBanner: builder.mutation<void, string>({
            queryFn: async (banner_id) => {
                const token = Cookies.get('token');
                const url = `${baseUrl}banners/${banner_id}`;
                const startTime = performance.now();

                console.log(`📡 API Request → DELETE ${url}`);
                console.log(`Banner ID:`, banner_id);

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

                    // DELETE возвращает 204 без тела ответа
                    console.log(`📨 API Response ← DELETE ${url} (${duration} ms) - Success`);
                    return { data: undefined };
                } catch (error: any) {
                    const duration = (performance.now() - startTime).toFixed(1);
                    console.error(`❌ API Fetch Error ← DELETE ${url} (${duration} ms)`, error);
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
