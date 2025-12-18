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
    announcement_type?: string;
    property_type?: string;
    order_by?: string;
    currency?: string;
    priceFrom?: number;
    priceTo?: number;
    min_price?: string;
    max_price?: string;
    min_rooms?: number;
    max_rooms?: number;
    min_area_total?: string;
    max_area_total?: string;
    min_area_living?: string;
    max_area_living?: string;
    min_area_kitchen?: string;
    max_area_kitchen?: string;
    min_floor?: number;
    max_floor?: number;
    min_floors_total?: number;
    max_floors_total?: number;
    min_year_built?: number;
    max_year_built?: number;
    min_ceiling_height?: number;
    max_ceiling_height?: number;
    available_from?: string;
    country?: string;
    region?: string;
    city?: string;
    district?: string;
    street?: string;
    wall_material?: string;
    bathroom_layout?: string;
    layout_type?: string;
    city_side?: string;
    heating_type?: string;
    renovation_type?: string;
    page?: number;
    page_size?: number;
}

export interface AddAnnouncementBody {
    title: string;
    description: string;
    type: "RENT" | "SALE";
    property_type: string;
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
    layout_type: string;
    heating_type: string;
    city_side: string;
    renovation_type: string;
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
    contact_email: string;
    images: string[];
    subscription_id: string;
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
        return result;
    } catch (error: any) {
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
                        params.append(key, value.toString());
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

        addAnnouncement: builder.mutation<
            string[],
            { data: AddAnnouncementBody; files?: File[] }
        >({
            queryFn: async ({ data, files }) => {
                const baseUrl =
                    (process.env.NEXT_PUBLIC_API_URL ||
                        "http://147.45.68.231:8081/api/v1/")
                        .replace(/\/+$/, "") + "/";

                const token = Cookies.get("token");
                const url = `${baseUrl}announcements`;

                try {
                    // =========================
                    // 1️⃣ Создание объявления
                    // =========================
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => null);
                        return {
                            error: {
                                status: response.status,
                                data: errorData ?? "Failed to create announcement",
                            },
                        };
                    }

                    // ✅ backend реально возвращает string[]
                    const presignedUrls: string[] = await response.json();
                    console.log("📥 Received presigned URLs:", JSON.stringify(presignedUrls, null, 2));
                    console.log(`📁 Files to upload: ${files?.length || 0}`);

                    // =========================
                    // 2️⃣ Загрузка файлов
                    // =========================
                    if (files && files.length > 0) {
                        console.log(`🚀 Starting file upload process for ${files.length} files...`);
                        if (presignedUrls.length !== files.length) {
                            return {
                                error: {
                                    status: "CUSTOM_ERROR" as const,
                                    error: `Files count mismatch: received ${presignedUrls.length} URLs but have ${files.length} files`,
                                },
                            };
                        }

                        // Последовательно загружаем каждый файл по соответствующей presigned URL
                        for (let i = 0; i < files.length; i++) {
                            const file = files[i];
                            const presignedUrl = presignedUrls[i];

                            console.log(`Uploading file ${i + 1}/${files.length}: ${file.name} to ${presignedUrl}`);

                            try {
                                const uploadResponse = await fetch(presignedUrl, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": file.type,
                                    },
                                    body: file,
                                });

                                if (!uploadResponse.ok) {
                                    const errorText = await uploadResponse.text().catch(() => "Unknown error");
                                    console.error(`Failed to upload file ${i + 1}: ${uploadResponse.status} ${uploadResponse.statusText}`, errorText);
                                    return {
                                        error: {
                                            status: "CUSTOM_ERROR" as const,
                                            error: `Failed to upload ${file.name}: ${uploadResponse.statusText}`,
                                        },
                                    };
                                }

                                console.log(`Successfully uploaded file ${i + 1}/${files.length}: ${file.name}`);
                            } catch (uploadError: any) {
                                console.error(`Error uploading file ${i + 1}:`, uploadError);
                                return {
                                    error: {
                                        status: "FETCH_ERROR" as const,
                                        error: `Failed to upload ${file.name}: ${uploadError.message}`,
                                    },
                                };
                            }
                        }

                        console.log(`All ${files.length} files uploaded successfully`);
                    }

                    // ✅ ВАЖНО: возвращаем ТО ЖЕ, что вернул backend
                    return { data: presignedUrls };
                } catch (error: any) {
                    return {
                        error: {
                            status: "FETCH_ERROR" as const,
                            error: error.message || "Unknown error",
                        },
                    };
                }
            },
            invalidatesTags: ["Announcement"],
        }),


        updateAnnouncement: builder.mutation<string[], { id: string; data: UpdateAnnouncementBody; files?: File[] }>({
            queryFn: async ({ id, data, files }) => {
                const baseUrl =
                    (process.env.NEXT_PUBLIC_API_URL ||
                        "http://147.45.68.231:8081/api/v1/")
                        .replace(/\/+$/, "") + "/";

                const token = Cookies.get("token");
                const url = `${baseUrl}announcements/${id}`;

                try {
                    // =========================
                    // 1️⃣ Обновление объявления (отправка JSON данных)
                    // =========================
                    const response = await fetch(url, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => null);
                        console.log("Error response:", JSON.stringify(errorData, null, 2));
                        return {
                            error: {
                                status: response.status,
                                data: errorData ?? "Failed to update announcement",
                            },
                        };
                    }

                    // ✅ backend возвращает string[] (presigned URLs)
                    const presignedUrls: string[] = await response.json();
                    console.log("📥 Received presigned URLs:", JSON.stringify(presignedUrls, null, 2));
                    console.log(`📁 Files to upload: ${files?.length || 0}`);

                    // =========================
                    // 2️⃣ Загрузка файлов (если есть новые файлы)
                    // =========================
                    if (files && files.length > 0) {
                        // Если нет presigned URLs, но есть файлы - ошибка
                        if (!presignedUrls || presignedUrls.length === 0) {
                            return {
                                error: {
                                    status: "CUSTOM_ERROR" as const,
                                    error: "No presigned URLs received for file upload",
                                },
                            };
                        }

                        console.log(`🚀 Starting file upload process for ${files.length} files...`);
                        if (presignedUrls.length !== files.length) {
                            return {
                                error: {
                                    status: "CUSTOM_ERROR" as const,
                                    error: `Files count mismatch: received ${presignedUrls.length} URLs but have ${files.length} files`,
                                },
                            };
                        }

                        // Последовательно загружаем каждый файл по соответствующей presigned URL
                        for (let i = 0; i < files.length; i++) {
                            const file = files[i];
                            const presignedUrl = presignedUrls[i];

                            console.log(`Uploading file ${i + 1}/${files.length}: ${file.name} to ${presignedUrl}`);

                            try {
                                const uploadResponse = await fetch(presignedUrl, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": file.type,
                                    },
                                    body: file,
                                });

                                if (!uploadResponse.ok) {
                                    const errorText = await uploadResponse.text().catch(() => "Unknown error");
                                    console.error(`Failed to upload file ${i + 1}: ${uploadResponse.status} ${uploadResponse.statusText}`, errorText);
                                    return {
                                        error: {
                                            status: "CUSTOM_ERROR" as const,
                                            error: `Failed to upload ${file.name}: ${uploadResponse.statusText}`,
                                        },
                                    };
                                }

                                console.log(`Successfully uploaded file ${i + 1}/${files.length}: ${file.name}`);
                            } catch (uploadError: any) {
                                console.error(`Error uploading file ${i + 1}:`, uploadError);
                                return {
                                    error: {
                                        status: "FETCH_ERROR" as const,
                                        error: `Failed to upload ${file.name}: ${uploadError.message}`,
                                    },
                                };
                            }
                        }

                        console.log(`All ${files.length} files uploaded successfully`);
                    }

                    // ✅ ВАЖНО: возвращаем ТО ЖЕ, что вернул backend
                    return { data: presignedUrls };
                } catch (error: any) {
                    return {
                        error: {
                            status: "FETCH_ERROR" as const,
                            error: error.message || "Unknown error",
                        },
                    };
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


