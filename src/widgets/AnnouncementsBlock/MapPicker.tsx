"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
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

export default function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);

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

    if (!position) {
        return <div className={styles.mapLoader}>Загрузка карты...</div>;
    }

    return (
        <div className={styles.mapPickerContainer}>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "400px", width: "100%", borderRadius: "8px" }}
                className={styles.mapContainer}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationSelect={handleMapClick} />
                {position && <Marker position={position} icon={icon} />}
            </MapContainer>
            <div className={styles.mapHint}>
                Кликните на карте, чтобы выбрать местоположение
            </div>
        </div>
    );
}






