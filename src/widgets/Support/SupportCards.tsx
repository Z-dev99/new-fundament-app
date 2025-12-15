"use client";

import { useGetSupportRequestsQuery, useDeleteSupportRequestMutation } from "@/shared/api/supportApi";
import { useState } from "react";
import styles from "./styles.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { MessageCircle, User, Phone, FileText, Calendar, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export const SupportCards: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

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
            toast.error("Ошибка при удалении заявки");
        } finally {
            setDeletingId(null);
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

    const formatPhone = (phone: string) => {
        if (phone.startsWith("998")) {
            return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10)}`;
        }
        return phone;
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка заявок...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Ошибка загрузки заявок</p>
            </div>
        );
    }

    const totalPages = data ? Math.ceil(data.total / pageSize) : 1;
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className={styles.supportBlock}>
            <Toaster position="top-right" />

            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>
                        <MessageCircle size={28} />
                    </div>
                    <div>
                        <h2>Обратная связь от пользователей</h2>
                        <p className={styles.subtitle}>
                            {data?.total ? `${data.total} сообщени${data.total > 1 ? 'й' : 'е'} от пользователей` : 'Нет сообщений'}
                        </p>
                    </div>
                </div>
            </div>

            {data?.support_requests.length ? (
                <>
                    <div className={styles.cards}>
                        {data.support_requests.map((req, index) => {
                            const isDeleting = deletingId === req.id;
                            const gradientClass = `gradient${(index % 3) + 1}`;

                            return (
                                <div key={req.id} className={`${styles.card} ${styles[gradientClass]}`}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userIcon}>
                                                <User size={20} />
                                            </div>
                                            <div className={styles.userDetails}>
                                                <span className={styles.name}>{req.first_name}</span>
                                                <div className={styles.date}>
                                                    <Calendar size={14} />
                                                    <span>{formatDate(req.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.messageContent}>
                                        <div className={styles.messageIcon}>
                                            <FileText size={18} />
                                        </div>
                                        <div className={styles.messageText}>
                                            <p>{req.details}</p>
                                        </div>
                                    </div>

                                    <div className={styles.cardContent}>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoIcon}>
                                                <Phone size={18} />
                                            </div>
                                            <div className={styles.infoContent}>
                                                <span className={styles.infoLabel}>Телефон</span>
                                                <a href={`tel:${req.phone_number}`} className={styles.infoValue}>
                                                    {formatPhone(req.phone_number)}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(req.id)}
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
                    <MessageCircle size={64} />
                    <h3>Нет сообщений</h3>
                    <p>Пока нет обращений от пользователей</p>
                </div>
            )}
        </div>
    );
};