"use client";

import React from "react";
import Image from "next/image";
import { Edit, X } from "lucide-react";
import { useGetAnnouncementByIdQuery } from "@/shared/api/announcementsApi";
import { getImageUrl } from "../utils";
import styles from "../styles.module.scss";

interface DetailModalProps {
    announcementId: string;
    onClose: () => void;
    onEdit: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ announcementId, onClose, onEdit }) => {
    const { data, isLoading, error } = useGetAnnouncementByIdQuery(announcementId);

    if (isLoading) {
        return (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Загрузка...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.errorContainer}>
                        <p>Ошибка загрузки объявления</p>
                        <button className={styles.closeBtn} onClick={onClose}>
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Детали объявления</h2>
                    <div className={styles.modalActions}>
                        <button className={styles.editBtn} onClick={onEdit}>
                            <Edit size={18} />
                            Редактировать
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.modalContent}>
                    <div className={styles.detailSection}>
                        <h3>Основная информация</h3>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Название:</span>
                                <span className={styles.detailValue}>{data.title}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Тип:</span>
                                <span className={styles.detailValue}>{data.type}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Тип недвижимости:</span>
                                <span className={styles.detailValue}>{data.property_type}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Цена:</span>
                                <span className={styles.detailValue}>
                                    {data.price} {data.currency}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Комнат:</span>
                                <span className={styles.detailValue}>{data.rooms_count}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Площадь:</span>
                                <span className={styles.detailValue}>{data.area_total} м²</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Этаж:</span>
                                <span className={styles.detailValue}>
                                    {data.floor} из {data.floors_total}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Город:</span>
                                <span className={styles.detailValue}>{data.city}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Район:</span>
                                <span className={styles.detailValue}>{data.district}</span>
                            </div>
                        </div>
                    </div>

                    {data.description && (
                        <div className={styles.detailSection}>
                            <h3>Описание</h3>
                            <p className={styles.descriptionText}>{data.description}</p>
                        </div>
                    )}

                    {data.images && data.images.length > 0 && (
                        <div className={styles.detailSection}>
                            <h3>Фотографии ({data.images.length})</h3>
                            <div className={styles.imagesGrid}>
                                {data.images.map((img, idx) => (
                                    <div key={idx} className={styles.imagePreview}>
                                        <Image
                                            src={getImageUrl(img)}
                                            alt={`Фото ${idx + 1}`}
                                            width={200}
                                            height={150}
                                            className={styles.image}
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
