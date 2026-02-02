"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./FiltersBar.module.scss";
import { ModalFilter } from "../modal/ModalFilter";
import type { AnnouncementsFilters } from "@/shared/api/announcementsApi";

const IconFilter = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

interface FiltersBarProps {
    activeTab?: string;
    onFiltersChange?: (filters: any) => void;
    totalCount?: number;
}

export default function FiltersBar({ activeTab, onFiltersChange, totalCount }: FiltersBarProps = {}) {
    const [dealType, setDealType] = useState<"purchase" | "rent">("purchase");
    const [currency, setCurrency] = useState<"UZS" | "USD" | "EUR">("UZS");
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [areaFrom, setAreaFrom] = useState("");
    const [areaTo, setAreaTo] = useState("");
    const [rooms, setRooms] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFilters, setModalFilters] = useState<Partial<AnnouncementsFilters>>({});
    const [resultsCount, setResultsCount] = useState(totalCount || 1055);

    // Обновляем количество результатов из API
    useEffect(() => {
        if (totalCount !== undefined) {
            setResultsCount(totalCount);
        }
    }, [totalCount]);

    // Реагируем на изменение активного таба
    useEffect(() => {
        if (activeTab && totalCount === undefined) {
            // При изменении таба можно сбросить некоторые фильтры или обновить результаты
            // В реальном приложении здесь будет запрос к API с учетом activeTab
            const tabCounts: Record<string, number> = {
                "new-builds": 1055,
                "under-construction": 842,
                "ready": 623,
            };
            setResultsCount(tabCounts[activeTab] || 1055);
        }
    }, [activeTab, totalCount]);

    const toggleRoom = useCallback((n: number) => {
        setRooms((prev) => (prev === n ? null : n));
    }, []);

    const onApply = useCallback(() => {
        // Объединяем фильтры: основные имеют приоритет
        const finalDealType = dealType || (modalFilters.announcement_type === "SALE" ? "purchase" : modalFilters.announcement_type === "RENT" ? "rent" : "");
        // Поддерживаем оба варианта: priceFrom/priceTo и min_price/max_price
        const finalPriceFrom = priceFrom || (modalFilters.min_price ? String(modalFilters.min_price) : (modalFilters.priceFrom ? String(modalFilters.priceFrom) : ""));
        const finalPriceTo = priceTo || (modalFilters.max_price ? String(modalFilters.max_price) : (modalFilters.priceTo ? String(modalFilters.priceTo) : ""));
        const finalAreaFrom = areaFrom || (modalFilters.min_area_total ? String(modalFilters.min_area_total) : "");
        const finalAreaTo = areaTo || (modalFilters.max_area_total ? String(modalFilters.max_area_total) : "");
        const finalRooms = rooms !== null ? String(rooms) : (modalFilters.min_rooms ? String(modalFilters.min_rooms) : null);
        const finalCurrency = currency || modalFilters.currency || "UZS";

        const allFilters = {
            activeTab,
            dealType: finalDealType,
            priceFrom: finalPriceFrom,
            priceTo: finalPriceTo,
            areaFrom: finalAreaFrom,
            areaTo: finalAreaTo,
            rooms: finalRooms,
            currency: finalCurrency,
            // Дополнительные фильтры из модалки (теперь в формате API)
            city: modalFilters.city,
            district: modalFilters.district,
            street: modalFilters.street,
            wall_material: modalFilters.wall_material,
            bathroom_layout: modalFilters.bathroom_layout,
            property_type: modalFilters.property_type,
            order_by: modalFilters.order_by,
            country: modalFilters.country,
            region: modalFilters.region,
            min_area_living: modalFilters.min_area_living,
            max_area_living: modalFilters.max_area_living,
            min_area_kitchen: modalFilters.min_area_kitchen,
            max_area_kitchen: modalFilters.max_area_kitchen,
            min_floor: modalFilters.min_floor,
            max_floor: modalFilters.max_floor,
            min_floors_total: modalFilters.min_floors_total,
            max_floors_total: modalFilters.max_floors_total,
            min_ceiling_height: modalFilters.min_ceiling_height,
            max_ceiling_height: modalFilters.max_ceiling_height,
            min_year_built: modalFilters.min_year_built,
            max_year_built: modalFilters.max_year_built,
            layout_type: modalFilters.layout_type,
            city_side: modalFilters.city_side,
            heating_type: modalFilters.heating_type,
            renovation_type: modalFilters.renovation_type,
            available_from: modalFilters.available_from,
        };
        onFiltersChange?.(allFilters);
    }, [activeTab, dealType, currency, priceFrom, priceTo, areaFrom, areaTo, rooms, modalFilters, onFiltersChange]);

    const handleModalApply = useCallback((filters: Partial<AnnouncementsFilters>) => {
        setModalFilters(filters);
        // Синхронизация основных фильтров из модалки
        if (filters.announcement_type) {
            setDealType(filters.announcement_type === "SALE" ? "purchase" : "rent");
        }
        if (filters.currency) {
            setCurrency(filters.currency as "UZS" | "USD" | "EUR");
        }
        // Поддерживаем оба варианта: priceFrom/priceTo и min_price/max_price
        if (filters.min_price) {
            setPriceFrom(String(filters.min_price));
        } else if (filters.priceFrom) {
            setPriceFrom(String(filters.priceFrom));
        }
        if (filters.max_price) {
            setPriceTo(String(filters.max_price));
        } else if (filters.priceTo) {
            setPriceTo(String(filters.priceTo));
        }
        if (filters.min_area_total) setAreaFrom(String(filters.min_area_total));
        if (filters.max_area_total) setAreaTo(String(filters.max_area_total));
        if (filters.min_rooms) {
            setRooms(filters.min_rooms);
        }
        setModalOpen(false);
    }, []);

    // Применяем фильтры из модалки после их установки
    useEffect(() => {
        if (Object.keys(modalFilters).length > 0) {
            const timer = setTimeout(() => {
                onApply();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [modalFilters, onApply]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (modalFilters.city) count++;
        if (modalFilters.district) count++;
        if (modalFilters.street) count++;
        if (modalFilters.wall_material) count++;
        if (modalFilters.bathroom_layout) count++;
        if (modalFilters.property_type) count++;
        if (modalFilters.order_by) count++;
        if (modalFilters.country) count++;
        if (modalFilters.region) count++;
        if (modalFilters.min_area_living || modalFilters.max_area_living) count++;
        if (modalFilters.min_area_kitchen || modalFilters.max_area_kitchen) count++;
        if (modalFilters.min_floor || modalFilters.max_floor) count++;
        if (modalFilters.min_floors_total || modalFilters.max_floors_total) count++;
        if (modalFilters.min_year_built || modalFilters.max_year_built) count++;
        return count;
    }, [modalFilters]);

    const hasActiveFilters = useMemo(() => {
        return (
            priceFrom ||
            priceTo ||
            areaFrom ||
            areaTo ||
            rooms !== null ||
            activeFiltersCount > 0
        );
    }, [priceFrom, priceTo, areaFrom, areaTo, rooms, activeFiltersCount]);

    const handleClearFilters = useCallback(() => {
        setDealType("purchase");
        setCurrency("UZS");
        setPriceFrom("");
        setPriceTo("");
        setAreaFrom("");
        setAreaTo("");
        setRooms(null);
        setModalFilters({});
        // Применяем очищенные фильтры
        onFiltersChange?.({
            activeTab,
            dealType: "purchase",
            currency: "UZS",
            priceFrom: "",
            priceTo: "",
            areaFrom: "",
            areaTo: "",
            rooms: null,
        });
    }, [activeTab, onFiltersChange]);

    const getCurrencySymbol = (curr: "UZS" | "USD" | "EUR") => {
        switch (curr) {
            case "USD":
                return "$";
            case "EUR":
                return "€";
            default:
                return "сум";
        }
    };

    return (
        <>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.grid}>
                        <div className={styles.group}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>💼</span>
                                Тип сделки
                            </label>
                            <div className={styles.segment}>
                                <button
                                    type="button"
                                    className={`${styles.segmentBtn} ${dealType === "purchase" ? styles.active : ""}`}
                                    onClick={() => setDealType("purchase")}
                                >
                                    Покупка
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.segmentBtn} ${dealType === "rent" ? styles.active : ""}`}
                                    onClick={() => setDealType("rent")}
                                >
                                    Аренда
                                </button>
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>💰</span>
                                Стоимость
                            </label>
                            <div className={styles.priceRow}>
                                <div className={styles.currencySelect}>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as "UZS" | "USD" | "EUR")}
                                        className={styles.currencySelectInput}
                                    >
                                        <option value="UZS">UZS</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                                <div className={styles.inlineInputs}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="От"
                                            value={priceFrom}
                                            onChange={(e) => setPriceFrom(e.target.value)}
                                            className={styles.input}
                                        />
                                        <span className={styles.inputSuffix}>{getCurrencySymbol(currency)}</span>
                                    </div>
                                    <div className={styles.rangeSeparator}>—</div>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="До"
                                            value={priceTo}
                                            onChange={(e) => setPriceTo(e.target.value)}
                                            className={styles.input}
                                        />
                                        <span className={styles.inputSuffix}>{getCurrencySymbol(currency)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.bottomFilters}>
                        <div className={styles.group}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🚪</span>
                                Комнатность
                            </label>
                            <div className={styles.rooms}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        className={`${styles.roomBtn} ${rooms === n ? styles.roomActive : ""}`}
                                        onClick={() => toggleRoom(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>📐</span>
                                Площадь
                            </label>
                            <div className={styles.inlineInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="От"
                                        value={areaFrom}
                                        onChange={(e) => setAreaFrom(e.target.value)}
                                        className={styles.input}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="До"
                                        value={areaTo}
                                        onChange={(e) => setAreaTo(e.target.value)}
                                        className={styles.input}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.right}>
                            <button
                                type="button"
                                className={styles.moreBtn}
                                onClick={() => setModalOpen(true)}
                            >
                                <IconFilter />
                                <span>Ещё фильтры</span>
                                {activeFiltersCount > 0 && (
                                    <span className={styles.count}>{activeFiltersCount}</span>
                                )}
                            </button>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className={styles.clearBtn}
                                    onClick={handleClearFilters}
                                    title="Очистить все фильтры"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M8 3V1M8 1L6 3M8 1L10 3M4 4C3.46957 4.53043 3.07143 5.17174 2.83939 5.87119C2.60735 6.57065 2.54796 7.31071 2.66667 8.03333M12 4C12.5304 4.53043 12.9286 5.17174 13.1606 5.87119C13.3927 6.57065 13.452 7.31071 13.3333 8.03333M2.66667 8.03333C2.66667 9.23742 3.15833 10.3923 4.03333 11.2673C4.90833 12.1423 6.06324 12.634 7.26733 12.634C8.47142 12.634 9.62633 12.1423 10.5013 11.2673C11.3763 10.3923 11.868 9.23742 11.868 8.03333"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            )}

                            <button
                                type="button"
                                className={styles.applyBtn}
                                onClick={onApply}
                            >
                                <span>Показать {resultsCount.toLocaleString()} объектов</span>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path
                                        d="M6 3L12 9L6 15"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalFilter
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onApply={handleModalApply}
                initialCount={resultsCount}
            />
        </>
    );
}
