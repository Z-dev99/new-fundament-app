"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Property.module.scss";

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

interface PropertyMapProps {
    latitude: string;
    longitude: string;
    title?: string;
}

// Компонент для центрирования карты на маркере
function MapCenter({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [map, center]);
    return null;
}

export default function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setPosition([lat, lng]);
            } else {
                // Ташкент по умолчанию, если координаты невалидны
                setPosition([41.2995, 69.2401]);
            }
        } else {
            // Ташкент по умолчанию
            setPosition([41.2995, 69.2401]);
        }
    }, [latitude, longitude]);

    if (!isClient || !position) {
        return (
            <div className={styles.mapLoader}>
                <div>Загрузка карты...</div>
            </div>
        );
    }

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={position}
                zoom={15}
                style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                className={styles.mapLeaflet}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapCenter center={position} />
                <Marker position={position} icon={icon}>
                    {title && (
                        <Popup>
                            <strong>{title}</strong>
                        </Popup>
                    )}
                </Marker>
            </MapContainer>
        </div>
    );
}


