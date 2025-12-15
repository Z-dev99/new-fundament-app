import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface Announcement {
    id: string;
    title: string;
    price: string | number;
    currency: string;
    type: string;
    property_type: string;
    rooms_count: number;
    area_total: string | number;
    floor: number;
    floors_total: number;
    city: string;
    district: string;
    images: string[];
}

export interface AnnouncementsResponse {
    total: number;
    size: number;
    announcements: Announcement[];
    topTen?: Announcement[];
}

export interface AnnouncementsFilters {
    page: number;
    page_size: number;
    announcement_type?: string | null; // RENT, SALE
    property_type?: string | null; // APARTMENT, HOUSE, ROOM, LAND, COMMERCIAL
    layout_type?: string | null; // STUDIO, SEPARATE_ROOMS, OPEN_PLAN
    country?: string | null;
    region?: string | null;
    city?: string | null;
    district?: string | null;
    street?: string | null;
    city_side?: string | null; // LEFT, RIGHT
    wall_material?: string | null; // BRICK, PANEL, MONOLITH, WOOD, BLOCK, FRAME, OTHER
    bathroom_layout?: string | null; // COMBINED, SEPARATE
    heating_type?: string | null; // CENTRAL, AUTONOMOUS, DECENTRALIZED
    renovation_type?: string | null; // SHELL, BLACK, COSMETIC, DESIGNER, EURO
    // Поддержка обоих вариантов для обратной совместимости
    min_price?: string | null;
    max_price?: string | null;
    priceFrom?: string | number | null; // Алиас для min_price (будет преобразован в min_price)
    priceTo?: string | number | null; // Алиас для max_price (будет преобразован в max_price)
    currency?: string | null;
    min_rooms?: number | null;
    max_rooms?: number | null;
    min_area_total?: string | null;
    max_area_total?: string | null;
    min_area_living?: string | null;
    max_area_living?: string | null;
    min_area_kitchen?: string | null;
    max_area_kitchen?: string | null;
    min_floor?: number | null;
    max_floor?: number | null;
    min_floors_total?: number | null;
    max_floors_total?: number | null;
    min_ceiling_height?: number | null;
    max_ceiling_height?: number | null;
    min_year_built?: number | null;
    max_year_built?: number | null;
    available_from?: string | null; // date-time format
    order_by?: string; // Default: "created_at"
}

export interface AddAnnouncementBody {
    title: string;
    description: string;
    type: "RENT" | "SALE";
    property_type: string;
    layout_type: string;
    rooms_count: number;
    floor: number;
    floors_total: number;
    area_total: string;
    area_living: string;
    area_kitchen: string;
    ceiling_height: number;
    year_built: number;
    wall_material: string;
    bathroom_layout: string;
    heating_type: string;
    renovation_type: string;
    city_side: string;
    price: string;
    currency: string;
    country: string;
    region: string;
    city: string;
    district: string;
    street: string;
    house_number: string;
    block: string;
    apartment: string;
    postal_code: string;
    latitude: string;
    longitude: string;
    cadastral_number: string;
    available_from: string;
    contact_phone: string;
    images: string[];
    // Опциональные поля (не входят в основной пример API, но могут использоваться)
    contact_email?: string;
    subscription_id?: string;
}

export interface UpdateAnnouncementBody extends Partial<AddAnnouncementBody> { }

export interface AnnouncementDetail extends Announcement {
    description: string;
    area_living: string;
    area_kitchen: string;
    ceiling_height: number;
    year_built: number;
    wall_material: "BRICK" | "PANEL" | "MONOLITH" | string;
    bathroom_layout: "COMBINED" | "SEPARATE" | string;
    house_number: string;
    block: string;
    apartment: string;
    postal_code: string;
    latitude: string;
    longitude: string;
    available_from: string;
    street?: string;
    heating_type?: string;
    renovation_type?: string;
    layout_type?: string;
    city_side?: string;
}

export interface AnnouncementContacts {
    phone_number: string;
    email: string;
}

const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://147.45.68.231:8081/api/v1/";
    // Нормализуем baseUrl - убираем все слэши в конце
    baseUrl = baseUrl.replace(/\/+$/, "");
    // Добавляем один слэш в конце для правильного объединения
    baseUrl = `${baseUrl}/`;

    const token = Cookies.get("token");

    // Нормализуем URL в args - убираем начальный слэш, если есть
    let normalizedArgs = args;
    if (typeof args === "object" && args.url) {
        normalizedArgs = {
            ...args,
            url: args.url.startsWith("/") ? args.url.substring(1) : args.url,
        };
    }

    const url = typeof normalizedArgs === "string" ? normalizedArgs : normalizedArgs.url;
    const method = typeof normalizedArgs === "string" ? "GET" : normalizedArgs.method || "GET";
    const body = typeof normalizedArgs === "string" ? undefined : normalizedArgs.body;
    
    // Если body - это FormData, не устанавливаем Content-Type (браузер установит автоматически с boundary)
    const isFormData = body instanceof FormData;

    const start = performance.now();
    const fullUrl = `${baseUrl}${url}`;

    console.groupCollapsed(
        `%c📡 API Request → ${method} ${fullUrl}`,
        "color:#00BFFF;font-weight:bold;"
    );
    console.log("Base URL:", baseUrl);
    console.log("Relative URL:", url);
    console.log("Full URL:", fullUrl);
    console.log("Method:", method);
    console.log("Headers:", { Authorization: token ? "Bearer ***" : "none" });
    if (body) {
        if (body instanceof FormData) {
            console.log("Body: FormData");
            for (const [key, value] of body.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
                } else {
                    console.log(`  ${key}:`, value);
                }
            }
        } else {
            console.log("Body:", body);
        }
    }
    console.groupEnd();

    try {
        const rawBaseQuery = fetchBaseQuery({
            baseUrl,
            prepareHeaders: (headers, { extra, endpoint }) => {
                if (token) headers.set("Authorization", `Bearer ${token}`);
                // Для FormData не устанавливаем Content-Type - браузер установит автоматически
                if (!isFormData && body) {
                    headers.set("Content-Type", "application/json");
                }
                return headers;
            },
        });

        const result = await rawBaseQuery(normalizedArgs, api, extraOptions);
        const duration = (performance.now() - start).toFixed(1);

        console.groupCollapsed(
            `%c📨 API Response ← ${method} ${fullUrl} (${duration} ms)`,
            "color:#32CD32;font-weight:bold;"
        );
        if (result.data) {
            console.log("Data:", result.data);
        }
        if (result.error) {
            console.error("Error:", result.error);
            if ('status' in result.error && result.error.status === "FETCH_ERROR") {
                console.error("Network error details:", {
                    message: 'error' in result.error ? result.error.error : 'Unknown error',
                });
            } else if ('status' in result.error && typeof result.error.status === 'number') {
                console.error("HTTP Error:", {
                    status: result.error.status,
                    data: 'data' in result.error ? result.error.data : undefined,
                });
            }
        }
        console.groupEnd();

        return result;
    } catch (error: any) {
        console.error("Unexpected error in baseQueryWithLogging:", error);
        throw error;
    }
};

export const announcementApi = createApi({
    reducerPath: "announcementApi",
    baseQuery: baseQueryWithLogging,
    tagTypes: ["Announcement"],
    endpoints: (builder) => ({
        getAnnouncements: builder.query<AnnouncementsResponse, AnnouncementsFilters>({
            query: (filters) => {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    // Пропускаем undefined, null и пустые строки
                    if (value !== undefined && value !== null && value !== "") {
                        // Преобразуем priceFrom -> min_price и priceTo -> max_price для обратной совместимости
                        // Приоритет у min_price/max_price, если они указаны
                        let paramKey = key;
                        if (key === 'priceFrom' && !filters.min_price) {
                            paramKey = 'min_price';
                            params.append(paramKey, String(value));
                        } else if (key === 'priceTo' && !filters.max_price) {
                            paramKey = 'max_price';
                            params.append(paramKey, String(value));
                        } else if (key !== 'priceFrom' && key !== 'priceTo') {
                            // Пропускаем priceFrom/priceTo, если уже есть min_price/max_price
                            params.append(paramKey, String(value));
                        }
                    }
                });
                const queryString = params.toString();
                return `announcements${queryString ? `?${queryString}` : ''}`;
            },
            // Отключаем кеширование для этого запроса, чтобы всегда получать свежие данные
            keepUnusedDataFor: 0,
            transformResponse: (response: AnnouncementsResponse) => ({
                ...response,
                topTen: response.announcements.slice(0, 10),
            }),
            providesTags: ["Announcement"],
        }),

        getMyAnnouncements: builder.query<AnnouncementsResponse, { page?: number; page_size?: number }>({
            query: ({ page = 1, page_size = 12 } = {}) =>
                `announcements/me?page=${page}&page_size=${page_size}`,
            providesTags: ["Announcement"],
        }),

        getFavoriteAnnouncements: builder.query<AnnouncementsResponse, { page?: number; page_size?: number }>({
            query: ({ page = 1, page_size = 12 } = {}) =>
                `announcements/favorites?page=${page}&page_size=${page_size}`,
            providesTags: ["Announcement"],
        }),

        getAnnouncementById: builder.query<AnnouncementDetail, string>({
            query: (id) => `announcements/${id}`,
            providesTags: ["Announcement"],
        }),

        addAnnouncement: builder.mutation<Announcement, { data: AddAnnouncementBody }>({
            queryFn: async ({ data }, { getState }) => {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://147.45.68.231:8081/api/v1/").replace(/\/+$/, "") + "/";
                const token = Cookies.get("token");
                const url = `${baseUrl}announcements`;

                console.group(`%c📤 addAnnouncement Request`, "color:#FF6B6B;font-weight:bold;");
                console.log("Base URL:", baseUrl);
                console.log("Full URL:", url);
                console.log("Data:", data);
                console.log("Images (file names):", data.images);

                // Проверка валидности URL
                try {
                    new URL(url);
                } catch (urlError) {
                    console.error("%c❌ Invalid URL:", "color:#FF6B6B;font-weight:bold;", url);
                    console.groupEnd();
                    return { 
                        error: { 
                            status: 'FETCH_ERROR' as const, 
                            error: 'Invalid URL format',
                        } 
                    };
                }

                try {
                    // Отправляем обычный JSON с названиями файлов в поле images
                    const headers: HeadersInit = {
                        'Content-Type': 'application/json',
                    };
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                    
                    console.log("%c📋 Sending JSON data...", "color:#4ECDC4;font-weight:bold;");
                    console.log("Headers:", headers);
                    console.log("Full URL:", url);
                    console.log("Body:", JSON.stringify(data, null, 2));
                    
                    let response: Response;
                    try {
                        response = await fetch(url, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(data),
                            credentials: 'include',
                        });
                    } catch (fetchError: any) {
                        console.error("%c❌ Fetch error details:", "color:#FF6B6B;font-weight:bold;", {
                            message: fetchError.message,
                            name: fetchError.name,
                            url: url,
                        });
                        console.groupEnd();
                        return { 
                            error: { 
                                status: 'FETCH_ERROR' as const, 
                                error: fetchError.message || 'Failed to fetch',
                            } 
                        };
                    }

                    console.log("%c📥 Response received", "color:#AA96DA;font-weight:bold;");
                    console.log("Status:", response.status, response.statusText);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                        console.error("Error data:", errorData);
                        console.groupEnd();
                        return { error: { status: response.status, data: errorData } };
                    }

                    const result = await response.json();
                    console.log("Success data:", result);
                    console.groupEnd();
                    return { data: result };
                } catch (error: any) {
                    console.error("%c❌ Request failed", "color:#FF6B6B;font-weight:bold;", error);
                    console.groupEnd();
                    return { error: { status: 'FETCH_ERROR', error: error.message } };
                }
            },
            invalidatesTags: ["Announcement"],
        }),

        updateAnnouncement: builder.mutation<Announcement, { id: string; data: UpdateAnnouncementBody; files?: File[] }>({
            queryFn: async ({ id, data, files }) => {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://147.45.68.231:8081/api/v1/").replace(/\/+$/, "") + "/";
                const token = Cookies.get("token");
                const url = `${baseUrl}announcements/${id}`;

                console.group(`%c📤 updateAnnouncement Request`, "color:#FF6B6B;font-weight:bold;");
                console.log("Base URL:", baseUrl);
                console.log("Full URL:", url);
                console.log("ID:", id);
                console.log("Data:", data);
                console.log("Files count:", files?.length || 0);
                if (files && files.length > 0) {
                    console.log("Files:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));
                }

                // Проверка валидности URL
                try {
                    new URL(url);
                } catch (urlError) {
                    console.error("%c❌ Invalid URL:", "color:#FF6B6B;font-weight:bold;", url);
                    console.groupEnd();
                    return {
                        error: {
                            status: 'FETCH_ERROR' as const,
                            error: 'Invalid URL format',
                        }
                    };
                }

                try {
                    // Если есть файлы, используем FormData с прямым fetch
                    if (files && files.length > 0) {
                        const formData = new FormData();

                        console.log("%c📋 Building FormData...", "color:#4ECDC4;font-weight:bold;");

                        // Добавляем все поля данных
                        Object.entries(data).forEach(([key, value]) => {
                            if (key === 'images') {
                                return;
                            }
                            if (value !== undefined && value !== null) {
                                if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                                    const stringValue = JSON.stringify(value);
                                    formData.append(key, stringValue);
                                    console.log(`  ${key}:`, stringValue);
                                } else {
                                    formData.append(key, String(value));
                                    console.log(`  ${key}:`, value);
                                }
                            }
                        });

                        // Добавляем файлы как 'images' - браузер автоматически установит Content-Type для каждого файла
                        files.forEach((file, index) => {
                            formData.append('images', file, file.name);
                            console.log(`  images[${index}]: File(${file.name}, ${file.size} bytes, ${file.type})`);
                        });

                        // Если есть существующие имена файлов
                        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                            const existingImagesJson = JSON.stringify(data.images);
                            formData.append('existing_images', existingImagesJson);
                            console.log(`  existing_images:`, existingImagesJson);
                        }

                        console.log("%c📦 FormData contents:", "color:#95E1D3;font-weight:bold;");
                        for (const [key, value] of formData.entries()) {
                            if (value instanceof File) {
                                console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
                            } else {
                                console.log(`  ${key}:`, value);
                            }
                        }

                        // Используем прямой fetch - браузер автоматически установит правильный Content-Type с boundary
                        const headers: HeadersInit = {};
                        if (token) {
                            headers['Authorization'] = `Bearer ${token}`;
                        }
                        // НЕ устанавливаем Content-Type - браузер установит автоматически multipart/form-data с boundary
                        
                        console.log("%c🚀 Sending request...", "color:#F38181;font-weight:bold;");
                        console.log("Method: PATCH");
                        console.log("Headers:", headers);
                        console.log("Full URL:", url);

                        let response: Response;
                        try {
                            response = await fetch(url, {
                                method: 'PATCH',
                                headers,
                                body: formData,
                                credentials: 'include',
                            });
                        } catch (fetchError: any) {
                            console.error("%c❌ Fetch error details:", "color:#FF6B6B;font-weight:bold;", {
                                message: fetchError.message,
                                name: fetchError.name,
                                url: url,
                            });
                            console.groupEnd();
                            return {
                                error: {
                                    status: 'FETCH_ERROR' as const,
                                    error: fetchError.message || 'Failed to fetch',
                                }
                            };
                        }

                        console.log("%c📥 Response received", "color:#AA96DA;font-weight:bold;");
                        console.log("Status:", response.status, response.statusText);
                        console.log("Headers:", Object.fromEntries(response.headers.entries()));

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                            console.error("Error data:", errorData);
                            console.groupEnd();
                            return { error: { status: response.status, data: errorData } };
                        }

                        const result = await response.json();
                        console.log("Success data:", result);
                        console.groupEnd();
                        return { data: result };
                    }

                    // Если файлов нет, отправляем обычный JSON
                    const headers: HeadersInit = {
                        'Content-Type': 'application/json',
                    };
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }

                    console.log("%c📋 Sending JSON data...", "color:#4ECDC4;font-weight:bold;");
                    console.log("Headers:", headers);
                    console.log("Full URL:", url);
                    console.log("Body:", JSON.stringify(data, null, 2));

                    let response: Response;
                    try {
                        response = await fetch(url, {
                            method: 'PATCH',
                            headers,
                            body: JSON.stringify(data),
                            credentials: 'include',
                        });
                    } catch (fetchError: any) {
                        console.error("%c❌ Fetch error details:", "color:#FF6B6B;font-weight:bold;", {
                            message: fetchError.message,
                            name: fetchError.name,
                            url: url,
                        });
                        console.groupEnd();
                        return {
                            error: {
                                status: 'FETCH_ERROR' as const,
                                error: fetchError.message || 'Failed to fetch',
                            }
                        };
                    }

                    console.log("%c📥 Response received", "color:#AA96DA;font-weight:bold;");
                    console.log("Status:", response.status, response.statusText);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                        console.error("Error data:", errorData);
                        console.groupEnd();
                        return { error: { status: response.status, data: errorData } };
                    }

                    const result = await response.json();
                    console.log("Success data:", result);
                    console.groupEnd();
                    return { data: result };
                } catch (error: any) {
                    console.error("%c❌ Request failed", "color:#FF6B6B;font-weight:bold;", error);
                    console.groupEnd();
                    return { error: { status: 'FETCH_ERROR', error: error.message } };
                }
            },
            invalidatesTags: ["Announcement"],
        }),

        deleteAnnouncement: builder.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `announcements/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Announcement"],
        }),

        getAnnouncementContacts: builder.query<AnnouncementContacts, string>({
            query: (id) => `announcements/${id}/contacts`,
        }),

        confirmAnnouncement: builder.mutation<Announcement, string>({
            query: (id) => ({
                url: `announcements/${id}/confirm`,
                method: "PATCH",
            }),
            invalidatesTags: ["Announcement"],
        }),

        rejectAnnouncement: builder.mutation<Announcement, string>({
            query: (id) => ({
                url: `announcements/${id}/reject`,
                method: "PATCH",
            }),
            invalidatesTags: ["Announcement"],
        }),

        getPresignedUrl: builder.mutation<{ presigned_url: string; file_name: string }, { file_name: string; content_type: string }>({
            query: ({ file_name, content_type }) => ({
                url: "announcements/upload-url",
                method: "POST",
                body: { file_name, content_type },
            }),
        }),
    }),
});

export const {
    useGetAnnouncementsQuery,
    useGetMyAnnouncementsQuery,
    useGetFavoriteAnnouncementsQuery,
    useGetAnnouncementByIdQuery,
    useAddAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
    useGetAnnouncementContactsQuery,
    useConfirmAnnouncementMutation,
    useRejectAnnouncementMutation,
    useGetPresignedUrlMutation,
} = announcementApi;


