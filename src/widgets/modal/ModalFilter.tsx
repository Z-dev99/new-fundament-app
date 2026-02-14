"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./ModalFilter.module.css";
import type { AnnouncementsFilters } from "@/shared/api/announcementsApi";

interface Props {
    open: boolean;
    onClose: () => void;
    onApply?: (filters: Partial<AnnouncementsFilters>) => void;
    initialCount?: number;
}

const initialFilterState: Partial<AnnouncementsFilters> = {
    announcement_type: undefined,
    property_type: undefined,
    layout_type: undefined,
    currency: undefined,
    min_price: undefined,
    max_price: undefined,
    min_rooms: undefined,
    max_rooms: undefined,
    min_area_total: undefined,
    max_area_total: undefined,
    min_area_living: undefined,
    max_area_living: undefined,
    min_area_kitchen: undefined,
    max_area_kitchen: undefined,
    min_floor: undefined,
    max_floor: undefined,
    min_floors_total: undefined,
    max_floors_total: undefined,
    min_ceiling_height: undefined,
    max_ceiling_height: undefined,
    min_year_built: undefined,
    max_year_built: undefined,
    country: undefined,
    region: undefined,
    city: undefined,
    district: undefined,
    street: undefined,
    city_side: undefined,
    wall_material: undefined,
    bathroom_layout: undefined,
    heating_type: undefined,
    renovation_type: undefined,
    available_from: undefined,
    order_by: "created_at",
};

export const ModalFilter: React.FC<Props> = ({
    open,
    onClose,
    onApply,
    initialCount = 0
}) => {
    const [filters, setFilters] = useState<Partial<AnnouncementsFilters>>(initialFilterState);
    const [activeCount, setActiveCount] = useState(initialCount);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            document.body.classList.add("modal-filter-open");
        } else {
            document.body.style.overflow = "";
            document.body.classList.remove("modal-filter-open");
        }
        return () => {
            document.body.style.overflow = "";
            document.body.classList.remove("modal-filter-open");
        };
    }, [open]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    const handleInputChange = useCallback((field: keyof AnnouncementsFilters, value: string | number | undefined) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value === "" ? undefined : (typeof value === "string" && !isNaN(Number(value)) && value !== "" ? Number(value) : value)
        }));
    }, []);

    const handleNumberChange = useCallback((field: keyof AnnouncementsFilters, value: string) => {
        const numValue = value === "" ? undefined : (value ? Number(value) : undefined);
        setFilters((prev) => ({ ...prev, [field]: numValue }));
    }, []);

    const handleReset = useCallback(() => {
        setFilters(initialFilterState);
        setActiveCount(initialCount);
    }, [initialCount]);

    const handleApply = useCallback(() => {
        onApply?.(filters);
        // В реальном приложении здесь будет запрос к API для получения количества
        setActiveCount(1055);
    }, [filters, onApply]);

    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(([key, value]) => {
            if (value === undefined || value === "") return false;
            if (typeof value === "number") return true;
            return value !== "";
        });
    }, [filters]);

    if (!open) return null;

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title}>
                            <span className={styles.titleIcon}>🔍</span>
                            Фильтр объектов
                        </h2>
                    </div>
                    <button
                        className={styles.close}
                        onClick={onClose}
                        aria-label="Закрыть"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M15 5L5 15M5 5L15 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>💼</span>
                                Тип сделки
                            </label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={filters.announcement_type || ""}
                                    onChange={(e) => handleInputChange("announcement_type", e.target.value)}
                                >
                                    <option value="">Все типы</option>
                                    <option value="SALE">Продажа</option>
                                    <option value="RENT">Аренда</option>
                                </select>
                                <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🏠</span>
                                Тип недвижимости
                            </label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={filters.property_type || ""}
                                    onChange={(e) => handleInputChange("property_type", e.target.value)}
                                >
                                    <option value="">Все типы</option>
                                    <option value="APARTMENT">Квартира</option>
                                    <option value="HOUSE">Дом</option>
                                    <option value="COMMERCIAL">Коммерческая</option>
                                </select>
                                <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>💱</span>
                                Валюта
                            </label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={filters.currency || ""}
                                    onChange={(e) => handleInputChange("currency", e.target.value)}
                                >
                                    <option value="">Все валюты</option>
                                    <option value="UZS">Узбекский сум</option>
                                    <option value="USD">Доллар США</option>
                                </select>
                                <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>💰</span>
                                Стоимость
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.priceFrom || ""}
                                        onChange={(e) => handleNumberChange("priceFrom", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>{filters.currency === "USD" ? "$" : "сум"}</span>
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.priceTo || ""}
                                        onChange={(e) => handleNumberChange("priceTo", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>{filters.currency === "USD" ? "$" : "сум"}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🚪</span>
                                Комнатность
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.min_rooms || ""}
                                        onChange={(e) => handleNumberChange("min_rooms", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>комн.</span>
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.max_rooms || ""}
                                        onChange={(e) => handleNumberChange("max_rooms", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>комн.</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>📐</span>
                                Общая площадь
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.min_area_total || ""}
                                        onChange={(e) => handleNumberChange("min_area_total", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.max_area_total || ""}
                                        onChange={(e) => handleNumberChange("max_area_total", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🛋️</span>
                                Жилая площадь
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.min_area_living || ""}
                                        onChange={(e) => handleNumberChange("min_area_living", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.max_area_living || ""}
                                        onChange={(e) => handleNumberChange("max_area_living", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🍳</span>
                                Площадь кухни
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.min_area_kitchen || ""}
                                        onChange={(e) => handleNumberChange("min_area_kitchen", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.max_area_kitchen || ""}
                                        onChange={(e) => handleNumberChange("max_area_kitchen", e.target.value)}
                                    />
                                    <span className={styles.inputSuffix}>м²</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🏢</span>
                                Этаж
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.min_floor || ""}
                                        onChange={(e) => handleNumberChange("min_floor", e.target.value)}
                                    />
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.max_floor || ""}
                                        onChange={(e) => handleNumberChange("max_floor", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🏗️</span>
                                Этажей в доме
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.min_floors_total || ""}
                                        onChange={(e) => handleNumberChange("min_floors_total", e.target.value)}
                                    />
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.max_floors_total || ""}
                                        onChange={(e) => handleNumberChange("max_floors_total", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>📅</span>
                                Год постройки
                            </label>
                            <div className={styles.rangeInputs}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="От"
                                        value={filters.min_year_built || ""}
                                        onChange={(e) => handleNumberChange("min_year_built", e.target.value)}
                                    />
                                </div>
                                <div className={styles.rangeSeparator}>—</div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="До"
                                        value={filters.max_year_built || ""}
                                        onChange={(e) => handleNumberChange("max_year_built", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🌍</span>
                                Страна
                            </label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={filters.country || ""}
                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                >
                                    <option value="">Все страны</option>
                                    <option value="UZ">Узбекистан</option>
                                </select>
                                <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🗺️</span>
                                Регион
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Введите регион"
                                value={filters.region || ""}
                                onChange={(e) => handleInputChange("region", e.target.value)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🏙️</span>
                                Город
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Введите город"
                                value={filters.city || ""}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>📍</span>
                                Район
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Введите район"
                                value={filters.district || ""}
                                onChange={(e) => handleInputChange("district", e.target.value)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🛣️</span>
                                Улица
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Введите улицу"
                                value={filters.street || ""}
                                onChange={(e) => handleInputChange("street", e.target.value)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🧱</span>
                                Материал стен
                            </label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={filters.wall_material || ""}
                                    onChange={(e) => handleInputChange("wall_material", e.target.value)}
                                >
                                    <option value="">Любой</option>
                                    <option value="BRICK">Кирпич</option>
                                    <option value="PANEL">Панель</option>
                                    <option value="MONOLITH">Монолит</option>
                                </select>
                                <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🚿</span>
                                Санузел
                            </label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={filters.bathroom_layout || ""}
                                    onChange={(e) => handleInputChange("bathroom_layout", e.target.value)}
                                >
                                    <option value="">Любой</option>
                                    <option value="COMBINED">Совмещенный</option>
                                    <option value="SEPARATE">Раздельный</option>
                                </select>
                                <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                <span className={styles.labelIcon}>🔀</span>
                                Сортировка
                            </label>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={filters.order_by || ""}
                                    onChange={(e) => handleInputChange("order_by", e.target.value)}
                                >
                                    <option value="">По умолчанию</option>
                                    <option value="price_asc">Цена: по возрастанию</option>
                                    <option value="price_desc">Цена: по убыванию</option>
                                    <option value="area_asc">Площадь: по возрастанию</option>
                                    <option value="area_desc">Площадь: по убыванию</option>
                                    <option value="date_desc">Дата: новые сначала</option>
                                    <option value="date_asc">Дата: старые сначала</option>
                                </select>
                                <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button
                        className={styles.resetBtn}
                        onClick={handleReset}
                        disabled={!hasActiveFilters}
                        type="button"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M8 3V1M8 1L6 3M8 1L10 3M4 4C3.46957 4.53043 3.07143 5.17174 2.83939 5.87119C2.60735 6.57065 2.54796 7.31071 2.66667 8.03333M12 4C12.5304 4.53043 12.9286 5.17174 13.1606 5.87119C13.3927 6.57065 13.452 7.31071 13.3333 8.03333M2.66667 8.03333C2.66667 9.23742 3.15833 10.3923 4.03333 11.2673C4.90833 12.1423 6.06324 12.634 7.26733 12.634C8.47142 12.634 9.62633 12.1423 10.5013 11.2673C11.3763 10.3923 11.868 9.23742 11.868 8.03333"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        Сбросить
                    </button>
                    <button
                        className={styles.showBtn}
                        onClick={handleApply}
                        type="button"
                    >
                        <span>Применить фильтры</span>
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
        </div >
    );
};
