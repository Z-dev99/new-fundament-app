"use client";

import React, { useState, useCallback, useMemo } from "react";
import styles from "./CardsList.module.css";
import { CardItem } from "./CardItem";
import { Pagination } from "./Pagination";
import { useGetAnnouncementsQuery } from "@/shared/api/announcementsApi";
import type { AnnouncementsFilters } from "@/shared/api/announcementsApi";
import FiltersBar from "@/widgets/filtersBar/FiltersBar";

interface Props {
    activeTab?: string;
}

const PER_PAGE = 24;

const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    if (imagePath.startsWith('data:')) {
        return imagePath;
    }
    return `https://fundament.uz/img/${imagePath}`;
};

export const CardsList: React.FC<Props> = ({ activeTab = "new-builds" }) => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Partial<AnnouncementsFilters>>({
        currency: "UZS",
    });

    const currentFilters = useMemo(() => {
        const result: Partial<AnnouncementsFilters> = {
            page,
            page_size: PER_PAGE,
            currency: filters.currency || "UZS",
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (key !== 'page' && key !== 'page_size' && value !== undefined && value !== null && value !== "") {
                (result as Record<string, any>)[key] = value;
            }
        });

        return result as AnnouncementsFilters;
    }, [filters, page]);

    const { data, isLoading, isError, error, isFetching } = useGetAnnouncementsQuery(currentFilters, {
        refetchOnMountOrArgChange: true,
    });

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage >= 1) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    const handleFiltersChange = useCallback((newFilters: any) => {
        const apiFilters: Partial<AnnouncementsFilters> = {
            currency: newFilters.currency || "UZS",
        };

        if (newFilters.dealType === "purchase") {
            apiFilters.announcement_type = "SALE";
        } else if (newFilters.dealType === "rent") {
            apiFilters.announcement_type = "RENT";
        }

        if (newFilters.priceFrom) apiFilters.min_price = String(newFilters.priceFrom);
        if (newFilters.priceTo) apiFilters.max_price = String(newFilters.priceTo);

        if (newFilters.rooms) {
            const roomsNum = Number(newFilters.rooms);
            apiFilters.min_rooms = roomsNum;
            apiFilters.max_rooms = roomsNum;
        }

        if (newFilters.areaFrom) apiFilters.min_area_total = String(newFilters.areaFrom);
        if (newFilters.areaTo) apiFilters.max_area_total = String(newFilters.areaTo);

        if (newFilters.city) apiFilters.city = newFilters.city;
        if (newFilters.district) apiFilters.district = newFilters.district;
        if (newFilters.street) apiFilters.street = newFilters.street;
        if (newFilters.wall_material) apiFilters.wall_material = newFilters.wall_material;
        if (newFilters.bathroom_layout) apiFilters.bathroom_layout = newFilters.bathroom_layout;
        if (newFilters.property_type) apiFilters.property_type = newFilters.property_type;
        if (newFilters.order_by) apiFilters.order_by = newFilters.order_by;
        if (newFilters.country) apiFilters.country = newFilters.country;
        if (newFilters.region) apiFilters.region = newFilters.region;

        // Площади теперь строки
        if (newFilters.min_area_living) apiFilters.min_area_living = String(newFilters.min_area_living);
        if (newFilters.max_area_living) apiFilters.max_area_living = String(newFilters.max_area_living);
        if (newFilters.min_area_kitchen) apiFilters.min_area_kitchen = String(newFilters.min_area_kitchen);
        if (newFilters.max_area_kitchen) apiFilters.max_area_kitchen = String(newFilters.max_area_kitchen);

        // Новые поля из API
        if (newFilters.layout_type) apiFilters.layout_type = newFilters.layout_type;
        if (newFilters.city_side) apiFilters.city_side = newFilters.city_side;
        if (newFilters.heating_type) apiFilters.heating_type = newFilters.heating_type;
        if (newFilters.renovation_type) apiFilters.renovation_type = newFilters.renovation_type;
        if (newFilters.min_ceiling_height) apiFilters.min_ceiling_height = Number(newFilters.min_ceiling_height);
        if (newFilters.max_ceiling_height) apiFilters.max_ceiling_height = Number(newFilters.max_ceiling_height);
        if (newFilters.available_from) apiFilters.available_from = newFilters.available_from;
        if (newFilters.min_floor) apiFilters.min_floor = Number(newFilters.min_floor);
        if (newFilters.max_floor) apiFilters.max_floor = Number(newFilters.max_floor);
        if (newFilters.min_floors_total) apiFilters.min_floors_total = Number(newFilters.min_floors_total);
        if (newFilters.max_floors_total) apiFilters.max_floors_total = Number(newFilters.max_floors_total);
        if (newFilters.min_ceiling_height) apiFilters.min_ceiling_height = Number(newFilters.min_ceiling_height);
        if (newFilters.max_ceiling_height) apiFilters.max_ceiling_height = Number(newFilters.max_ceiling_height);
        if (newFilters.min_year_built) apiFilters.min_year_built = Number(newFilters.min_year_built);
        if (newFilters.max_year_built) apiFilters.max_year_built = Number(newFilters.max_year_built);
        if (newFilters.available_from) apiFilters.available_from = newFilters.available_from;

        setFilters(apiFilters);
        setPage(1);
    }, []);

    const items = useMemo(() => {
        if (!data?.announcements || !Array.isArray(data.announcements)) {
            return [];
        }

        const mapped = data.announcements.map((announcement) => ({
            id: announcement.id,
            title: announcement.title || "Без названия",
            price: `${Number(announcement.price || 0).toLocaleString("ru-RU")} ${announcement.currency === "USD" ? "$" :
                announcement.currency === "EUR" ? "€" :
                    "сум"
                }`,
            address: `${announcement.city || ""}${announcement.district ? `, ${announcement.district}` : ""}`.trim() || "Адрес не указан",
            rooms: String(announcement.rooms_count || 0),
            area: String(announcement.area_total || 0),
            images: announcement.images && Array.isArray(announcement.images) && announcement.images.length > 0
                ? announcement.images.map(img => getImageUrl(String(img)))
                : [],
        }));

        return mapped;
    }, [data, page]);

    const totalPages = useMemo(() => {
        if (!data?.total) return 1;
        return Math.max(1, Math.ceil(data.total / PER_PAGE));
    }, [data?.total]);

    const isInitialLoading = isLoading && !data;
    const hasData = data && data.announcements && Array.isArray(data.announcements);
    const hasItems = items.length > 0;

    return (
        <div className={styles.wrapper}>
            <FiltersBar
                activeTab={activeTab}
                onFiltersChange={handleFiltersChange}
                totalCount={data?.total}
            />

            {data?.total !== undefined && (
                <div className={styles.resultsInfo}>
                    Найдено объявлений: <strong>{data.total.toLocaleString("ru-RU")}</strong>
                </div>
            )}

            {isInitialLoading && (
                <div className={styles.emptyState}>
                    <div className={styles.loader}></div>
                    <p>Загрузка объявлений...</p>
                </div>
            )}

            {isError && !isInitialLoading && (
                <div className={styles.emptyState}>
                    <p>Ошибка загрузки объявлений</p>
                    <p style={{ fontSize: "14px", color: "#999", marginTop: "8px" }}>
                        {error && "data" in error ? String(error.data) : "Попробуйте обновить страницу"}
                    </p>
                </div>
            )}

            {isFetching && hasData && (
                <div style={{
                    textAlign: "center",
                    padding: "10px",
                    color: "#666",
                    fontSize: "14px"
                }}>
                    Обновление данных...
                </div>
            )}

            {!isInitialLoading && !isError && hasData && !hasItems && (
                <div className={styles.emptyState}>
                    <p>Объявления не найдены</p>
                    <p style={{ fontSize: "14px", color: "#999", marginTop: "8px" }}>
                        Попробуйте изменить параметры фильтрации
                    </p>
                </div>
            )}

            {!isInitialLoading && !isError && hasItems && (
                <div
                    key={`grid-${page}-${JSON.stringify(filters)}`}
                    className={styles.grid}
                >
                    {items.map((card) => (
                        <div
                            key={card.id}
                            className={styles.cardWrapper}
                        >
                            <CardItem
                                {...card}
                                images={card.images}
                            />
                        </div>
                    ))}
                </div>
            )}

            {!isInitialLoading && !isError && totalPages > 1 && hasData && (
                <Pagination
                    page={page}
                    pages={totalPages}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};
