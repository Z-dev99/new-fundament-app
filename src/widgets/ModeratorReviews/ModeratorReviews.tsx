"use client";

import React, { useState } from "react";
import {
    useGetReviewsModerationQuery,
    usePatchReviewMutation,
    useDeleteReviewMutation
} from "@/shared/api/reviewsApi";
import styles from "./styles.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { MessageSquare, CheckCircle2, Trash2, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export const ModeratorReviews: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [processingId, setProcessingId] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useGetReviewsModerationQuery({ page, page_size: pageSize });
    const [patchReview, { isLoading: isApproving }] = usePatchReviewMutation();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await patchReview(id).unwrap();
            toast.success("Отзыв опубликован!");
            refetch();
        } catch (err) {
            toast.error("Ошибка при публикации отзыва");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить отзыв?")) return;
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
                    <div className={styles.headerIcon}>
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h2>Отзывы для модерации</h2>
                        <p className={styles.subtitle}>
                            {data?.total ? `${data.total} отзыв${data.total > 1 ? 'ов' : ''} ожидают проверки` : 'Нет отзывов для модерации'}
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
                                            className={styles.approveBtn}
                                            disabled={isProcessing}
                                            onClick={() => handleApprove(review.id)}
                                        >
                                            {isProcessing && isApproving ? (
                                                <>
                                                    <span className={styles.spinnerSmall}></span>
                                                    Публикуем...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 size={18} />
                                                    Опубликовать
                                                </>
                                            )}
                                        </button>
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
                    <MessageSquare size={64} />
                    <h3>Нет отзывов для модерации</h3>
                    <p>Все отзывы проверены и опубликованы</p>
                </div>
            )}
        </div>
    );
};