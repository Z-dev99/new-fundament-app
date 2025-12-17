"use client";

import React from "react";
import Image from "next/image";
import { Eye, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import type { Announcement } from "@/shared/api/announcementsApi";
import { getImageUrl } from "../utils";
import styles from "../styles.module.scss";

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

    return (
        <div className={`${styles.card} ${styles[gradientClass]}`}>
            <div className={styles.cardHeader}>
                <div className={styles.cardImage}>
                    {announcement.images && announcement.images.length > 0 ? (
                        <Image
                            src={getImageUrl(announcement.images[0])}
                            alt={announcement.title}
                            width={300}
                            height={200}
                            className={styles.image}
                            unoptimized
                        />
                    ) : (
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
                <button className={styles.editBtn} onClick={() => onEdit(announcement.id)}>
                    <Edit size={18} />
                    Редактировать
                </button>
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



