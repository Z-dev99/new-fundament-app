"use client";

import React, { useState } from "react";
import {
    useGetReviewsQuery,
    useDeleteReviewMutation
} from "@/shared/api/reviewsApi";
import styles from "./styles.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { MessageSquare, Trash2, User, Calendar, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export const PublishedReviews: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [processingId, setProcessingId] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useGetReviewsQuery({ page, page_size: pageSize });
    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить этот отзыв?")) return;
        setProcessingId(id);
        try {
            await deleteReview(id).unwrap();
            toast.success("Отзыв удалён!");
            refetch();
        } catch (err) {
            toast.error("Ошибка при удалении отзыва");
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка отзывов...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Ошибка загрузки отзывов</p>
            </div>
        );
    }

    const totalPages = data ? Math.ceil(data.total / pageSize) : 1;
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className={styles.moderatorBlock}>
            <Toaster position="top-right" />
            
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon} style={{ background: "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)", color: "#43e97b" }}>
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <h2>Опубликованные отзывы</h2>
                        <p className={styles.subtitle}>
                            {data?.total ? `${data.total} опубликованных отзыв${data.total > 1 ? 'ов' : ''}` : 'Нет опубликованных отзывов'}
                        </p>
                    </div>
                </div>
            </div>

            {data?.reviews.length ? (
                <>
                    <div className={styles.cards}>
                        {data.reviews.map((review, index) => {
                            const isProcessing = processingId === review.id;
                            const gradientClass = `gradient${(index % 3) + 1}`;

                            return (
                                <div key={review.id} className={`${styles.card} ${styles[gradientClass]}`}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userIcon}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <span className={styles.name}>
                                                    {review.first_name} {review.last_name}
                                                </span>
                                                <div className={styles.date}>
                                                    <Calendar size={14} />
                                                    <span>{formatDate(review.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.reviewText}>
                                        <div className={styles.quoteIcon}>"</div>
                                        <p>{review.review}</p>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.deleteBtn}
                                            disabled={isProcessing}
                                            onClick={() => handleDelete(review.id)}
                                        >
                                            {isProcessing && isDeleting ? (
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
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.paginationBtn}
                                onClick={handlePrev}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={18} />
                                Назад
                            </button>
                            <div className={styles.paginationInfo}>
                                <span className={styles.currentPage}>{page}</span>
                                <span className={styles.separator}>из</span>
                                <span className={styles.totalPages}>{totalPages}</span>
                            </div>
                            <button
                                className={styles.paginationBtn}
                                onClick={handleNext}
                                disabled={page === totalPages}
                            >
                                Вперед
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.emptyState}>
                    <CheckCircle2 size={64} />
                    <h3>Нет опубликованных отзывов</h3>
                    <p>Опубликованные отзывы появятся здесь после модерации</p>
                </div>
            )}
        </div>
    );
};
