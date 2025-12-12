"use client";

import React, { useState } from "react";
import {
    useGetReviewsModerationQuery,
    usePatchReviewMutation,
    useDeleteReviewMutation
} from "@/shared/api/reviewsApi";

import styles from "./styles.module.scss";
import toast, { Toaster } from "react-hot-toast";

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
            console.error(err);
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
            console.error(err);
            toast.error("Ошибка при удалении отзыва");
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) return <p>Загрузка отзывов...</p>;
    if (error) return <p>Ошибка загрузки отзывов</p>;

    const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className={styles.moderatorBlock}>
            <Toaster position="top-right" />
            <h2>Отзывы для модерации</h2>
            {data?.reviews.length ? (
                <div className={styles.cards}>
                    {data.reviews.map((review) => (
                        <div key={review.id} className={styles.card}>
                            <div className={styles.header}>
                                <span className={styles.name}>
                                    {review.first_name} {review.last_name}
                                </span>
                                <span className={styles.date}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.reviewText}>{review.review}</div>
                            <div className={styles.actions}>
                                <button
                                    className="publish"
                                    disabled={processingId === review.id}
                                    onClick={() => handleApprove(review.id)}
                                >
                                    {processingId === review.id && isApproving ? "Публикуем..." : "Опубликовать"}
                                </button>
                                <button
                                    className="delete"
                                    disabled={processingId === review.id}
                                    onClick={() => handleDelete(review.id)}
                                >
                                    {processingId === review.id && isDeleting ? "Удаляем..." : "Удалить"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Нет отзывов для модерации</p>
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button onClick={handlePrev} disabled={page === 1}>
                        ← Назад
                    </button>
                    <span>
                        Страница {page} из {totalPages}
                    </span>
                    <button onClick={handleNext} disabled={page === totalPages}>
                        Вперед →
                    </button>
                </div>
            )}
        </div>
    );
};
