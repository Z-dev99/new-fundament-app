"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.scss";

// Исправляем иконки маркера для Leaflet
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapPickerProps {
    latitude: string;
    longitude: string;
    onLocationSelect: (lat: number, lng: number) => void;
}

// Компонент для обработки кликов на карте
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onLocationSelect(lat, lng);
        },
    });
    return null;
}

// Компонент для управления центром карты
function MapCenter({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [map, center]);
    return null;
}

export default function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Убеждаемся, что компонент смонтирован на клиенте
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Инициализируем позицию из пропсов или используем Ташкент по умолчанию
    useEffect(() => {
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setPosition([lat, lng]);
            }
        } else {
            // Ташкент по умолчанию
            setPosition([41.2995, 69.2401]);
        }
    }, [latitude, longitude]);

    const handleMapClick = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    const geocodeAddress = async (address: string) => {
        if (!address.trim()) {
            setSearchError("");
            return;
        }

        setIsSearching(true);
        setSearchError("");

        try {
            // Используем Nominatim API от OpenStreetMap для геокодирования
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=uz&accept-language=ru`,
                {
                    headers: {
                        'User-Agent': 'FundamentApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Ошибка при поиске адреса");
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                if (!isNaN(lat) && !isNaN(lng)) {
                    const newPosition: [number, number] = [lat, lng];
                    setPosition(newPosition);
                    onLocationSelect(lat, lng);
                    setSearchError("");
                } else {
                    setSearchError("Не удалось найти координаты");
                }
            } else {
                setSearchError("Адрес не найден. Попробуйте другой адрес");
            }
        } catch {
            setSearchError("Ошибка при поиске адреса. Попробуйте позже");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchError("");

        // Очищаем предыдущий таймаут
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Если поле пустое, не ищем
        if (!value.trim()) {
            return;
        }

        // Задержка перед поиском (debounce)
        searchTimeoutRef.current = setTimeout(() => {
            geocodeAddress(value);
        }, 800);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            geocodeAddress(searchQuery);
        }
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Всегда рендерим поле поиска, даже если компонент еще не полностью загружен
    return (
        <>
            {/* Поле поиска адреса - ОТДЕЛЬНО ОТ КАРТЫ - ВСЕГДА ВИДИМО */}
            <div style={{
                width: "100%",
                marginBottom: "12px",
                position: "relative",
                display: "block",
                visibility: "visible",
                opacity: 1
            }}>
                <div style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Search
                        size={18}
                        style={{
                            position: "absolute",
                            left: "14px",
                            color: "#6b7280",
                            zIndex: 2,
                            pointerEvents: "none"
                        }}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearchSubmit(e as any);
                            }
                        }}
                        placeholder="Введите адрес для поиска (например: Ташкент, ул. Навои, д. 1)"
                        style={{
                            width: "100%",
                            padding: "12px 16px 12px 44px",
                            borderRadius: "8px",
                            border: "2px solid #e5e7eb",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            color: "#111827",
                            background: "#ffffff",
                            outline: "none",
                            boxSizing: "border-box",
                            minHeight: "44px",
                            display: "block",
                            margin: 0,
                            cursor: "text",
                            transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#667eea";
                            e.target.style.boxShadow = "0 0 0 4px rgba(102, 126, 234, 0.1)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#e5e7eb";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                    {isSearching && (
                        <Loader2
                            size={18}
                            style={{
                                position: "absolute",
                                right: "14px",
                                color: "#667eea",
                                zIndex: 2,
                                animation: "spin 0.8s linear infinite"
                            }}
                        />
                    )}
                </div>
                {searchError && (
                    <div style={{
                        marginTop: "8px",
                        padding: "8px 12px",
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        color: "#dc2626",
                        fontSize: "13px"
                    }}>
                        {searchError}
                    </div>
                )}
            </div>

            {/* Карта - ОТДЕЛЬНО ОТ ПОЛЯ ПОИСКА */}
            {isMounted && (
                <div className={styles.mapPickerContainer}>
                    {/* Карта - ПОД полем поиска */}
                    {position ? (
                        <div style={{ order: 2, width: "100%" }}>
                            <MapContainer
                                center={position}
                                zoom={13}
                                style={{ height: "300px", width: "100%", borderRadius: "0 0 8px 8px", marginTop: 0 }}
                                className={styles.mapContainer}
                                key={`${position[0]}-${position[1]}`}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapCenter center={position} />
                                <MapClickHandler onLocationSelect={handleMapClick} />
                                <Marker position={position} icon={icon} />
                            </MapContainer>
                        </div>
                    ) : (
                        <div style={{
                            order: 2,
                            width: "100%",
                            height: "300px",
                            borderRadius: "0 0 8px 8px",
                            border: "2px solid #e5e7eb",
                            borderTop: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f9fafb"
                        }}>
                            <div className={styles.mapLoader}>Загрузка карты...</div>
                        </div>
                    )}
                    <div className={styles.mapHint} style={{ order: 3 }}>
                        Введите адрес в поле выше или кликните на карте, чтобы выбрать местоположение
                    </div>
                </div>
            )}
        </>
    );
}















