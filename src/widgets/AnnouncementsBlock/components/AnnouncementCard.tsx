"use client";

import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import { Eye, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import type { Announcement } from "@/shared/api/announcementsApi";
import { getImageUrl } from "../utils";
import styles from "../styles.module.scss";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

interface AnnouncementCardProps {
    announcement: Announcement;
    index: number;
    isDeleting: boolean;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
    announcement,
    index,
    isDeleting,
    onView,
    onEdit,
    onDelete,
}) => {
    const gradientClass = `gradient${(index % 3) + 1}`;
    const [imageError, setImageError] = useState(false);
    const imageUrl = announcement.images && announcement.images.length > 0 
        ? getImageUrl(announcement.images[0]) 
        : null;

    // Проверяем загрузку изображения
    useEffect(() => {
        if (imageUrl) {
            const img = new window.Image();
            img.onerror = () => setImageError(true);
            img.onload = () => setImageError(false);
            img.src = imageUrl;
        }
    }, [imageUrl]);

    return (
        <div className={`${styles.card} ${styles[gradientClass]}`}>
            <div className={styles.cardHeader}>
                <div className={styles.cardImage}>
                    {announcement.images && announcement.images.length > 0 && !imageError ? (
                        <NextImage
                            src={imageUrl || PLACEHOLDER_IMAGE}
                            alt={announcement.title}
                            width={300}
                            height={200}
                            className={styles.image}
                            unoptimized
                            onError={() => setImageError(true)}
                        />
                    ) : announcement.images && announcement.images.length > 0 && imageError ? null : (
                        <div className={styles.noImage}>
                            <ImageIcon size={32} />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{announcement.title}</h3>
                <div className={styles.cardInfo}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Тип:</span>
                        <span className={styles.infoValue}>{announcement.type}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Цена:</span>
                        <span className={styles.infoValue}>
                            {announcement.price} {announcement.currency}
                        </span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Комнат:</span>
                        <span className={styles.infoValue}>{announcement.rooms_count}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Площадь:</span>
                        <span className={styles.infoValue}>{announcement.area_total} м²</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Город:</span>
                        <span className={styles.infoValue}>{announcement.city}</span>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.viewBtn} onClick={() => onView(announcement.id)}>
                    <Eye size={18} />
                    Просмотр
                </button>
                {/* <button className={styles.editBtn} onClick={() => onEdit(announcement.id)}>
                    <Edit size={18} />
                    Редактировать
                </button> */}
            </div>

            <div className={styles.deleteAction}>
                <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(announcement.id)}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <span className={styles.spinnerSmall}></span>
                            Удаляем...
                        </>
                    ) : (
                        <>
                            <Trash2 size={18} />
                            Удалить
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};












