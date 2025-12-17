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
    available_from?: string | null;
    order_by?: string;
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

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
    prepareHeaders: (headers) => {
        const token = Cookies.get("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const announcementApi = createApi({
    reducerPath: "announcementApi",
    baseQuery,
    tagTypes: ["Announcement"],
    endpoints: (builder) => ({
        getAnnouncements: builder.query<AnnouncementsResponse, AnnouncementsFilters>({
            query: (filters) => {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        let paramKey = key;
                        if (key === "priceFrom" && !filters.min_price) {
                            paramKey = "min_price";
                        } else if (key === "priceTo" && !filters.max_price) {
                            paramKey = "max_price";
                        }
                        if (paramKey !== "priceFrom" && paramKey !== "priceTo") {
                            params.append(paramKey, String(value));
                        }
                    }
                });
                const queryString = params.toString();
                return `announcements${queryString ? `?${queryString}` : ""}`;
            },
            keepUnusedDataFor: 0,
            transformResponse: (response: AnnouncementsResponse) => ({
                ...response,
                topTen: response.announcements.slice(0, 10),
            }),
            providesTags: ["Announcement"],
        }),

        getFavoriteAnnouncements: builder.query<
            AnnouncementsResponse,
            { page?: number; page_size?: number }
        >({
            query: ({ page = 1, page_size = 12 } = {}) =>
                `announcements/favorites?page=${page}&page_size=${page_size}`,
            providesTags: ["Announcement"],
        }),

        getAnnouncementById: builder.query<AnnouncementDetail, string>({
            query: (id) => `announcements/${id}`,
            providesTags: ["Announcement"],
        }),

        addAnnouncement: builder.mutation<Announcement, { data: AddAnnouncementBody }>({
            query: ({ data }) => ({
                url: "announcements",
                method: "POST",
                body: data,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["Announcement"],
        }),

        updateAnnouncement: builder.mutation<
            Announcement,
            { id: string; data: UpdateAnnouncementBody; files?: File[] }
        >({
            queryFn: async ({ id, data, files }) => {
                const token = Cookies.get("token");
                const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
                const url = `${baseUrl}announcements/${id}`;

                if (files && files.length > 0) {
                    const formData = new FormData();

                    Object.entries(data).forEach(([key, value]) => {
                        if (key === "images") return;
                        if (value !== undefined && value !== null) {
                            formData.append(
                                key,
                                typeof value === "object" ? JSON.stringify(value) : String(value)
                            );
                        }
                    });

                    files.forEach((file) => {
                        formData.append("images", file, file.name);
                    });

                    if (Array.isArray(data.images) && data.images.length > 0) {
                        formData.append("existing_images", JSON.stringify(data.images));
                    }

                    const headers: HeadersInit = {};
                    if (token) headers["Authorization"] = `Bearer ${token}`;

                    const response = await fetch(url, {
                        method: "PATCH",
                        headers,
                        body: formData,
                        credentials: "include",
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        return { error: { status: response.status, data: errorData } };
                    }

                    return { data: await response.json() };
                }

                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const response = await fetch(url, {
                    method: "PATCH",
                    headers,
                    body: JSON.stringify(data),
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    return { error: { status: response.status, data: errorData } };
                }

                return { data: await response.json() };
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

        getPresignedUrl: builder.mutation<
            { presigned_url: string; file_name: string },
            { file_name: string; content_type: string }
        >({
            query: (body) => ({
                url: "announcements/upload-url",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetAnnouncementsQuery,
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