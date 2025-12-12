"use client";

import { useGetSupportRequestsQuery, useDeleteSupportRequestMutation } from "@/shared/api/supportApi";
import { useState } from "react";
import styles from "./styles.module.scss";
import toast, { Toaster } from "react-hot-toast";

export const SupportCards: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10; // размер страницы

    const { data, isLoading, error, refetch } = useGetSupportRequestsQuery({ page, page_size: pageSize });
    const [deleteRequest, { isLoading: isDeleting }] = useDeleteSupportRequestMutation();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить эту заявку?")) return;

        try {
            setDeletingId(id);
            await deleteRequest(id).unwrap();
            toast.success("Заявка успешно удалена!");
            refetch();
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при удалении заявки");
        } finally {
            setDeletingId(null);
        }
    };

    const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    if (isLoading) return <p>Загрузка заявок...</p>;
    if (error) return <p>Ошибка загрузки заявок</p>;

    return (
        <div className={styles.supportBlock}>
            <Toaster position="top-right" />
            <h2>Обратная связь от пользователей</h2>

            <div className={styles.cards}>
                {data?.support_requests.length ? (
                    data.support_requests.map((req) => (
                        <div key={req.id} className={styles.card}>
                            <div className={styles.header}>
                                <span className={styles.name}>{req.first_name}</span>
                                <span className={styles.date}>
                                    {new Date(req.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.details}>{req.details}</div>
                            <div className={styles.phone}>Телефон: {req.phone_number}</div>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(req.id)}
                                disabled={isDeleting && deletingId === req.id}
                            >
                                {isDeleting && deletingId === req.id ? "Удаляем..." : "Удалить"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Нет заявок</p>
                )}
            </div>

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
        </div>
    );
};
