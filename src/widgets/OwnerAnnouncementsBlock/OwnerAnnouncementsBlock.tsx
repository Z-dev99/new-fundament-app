"use client";

import { useState, useEffect } from "react";
import {
    useGetMyAnnouncementsQuery,
    useDeleteAnnouncementMutation,
} from "@/shared/api/announcementsApi";
import { DetailModal } from "@/widgets/AnnouncementsBlock/components/DetailModal";
import { EditModal } from "@/widgets/AnnouncementsBlock/components/EditModal";
import { DeleteConfirmModal } from "@/widgets/AnnouncementsBlock/components/DeleteConfirmModal";
import { AnnouncementCard } from "@/widgets/AnnouncementsBlock/components/AnnouncementCard";
import styles from "@/widgets/AnnouncementsBlock/styles.module.scss";
import toast, { Toaster } from "react-hot-toast";
import {
    Megaphone,
    Plus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export const OwnerAnnouncementsBlock: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "detail" | "edit" | "add">("list");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useGetMyAnnouncementsQuery({
        page,
        page_size: pageSize,
    });
    const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();

    useEffect(() => {
        if (!isLoading) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [page, isLoading]);

    const handleView = (id: string) => {
        setSelectedId(id);
        setViewMode("detail");
    };

    const handleEdit = (id?: string) => {
        setSelectedId(id || null);
        setViewMode(id ? "edit" : "add");
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmId) return;

        try {
            setDeleteId(deleteConfirmId);
            await deleteAnnouncement(deleteConfirmId).unwrap();
            toast.success("Объявление успешно удалено!");
            refetch();
            setDeleteConfirmId(null);
        } catch (err: any) {
            toast.error(err.data?.message || "Ошибка при удалении объявления");
        } finally {
            setDeleteId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmId(null);
    };

    const handleCloseModal = () => {
        setViewMode("list");
        setSelectedId(null);
    };

    const handleSuccess = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className={styles.announcementsBlock}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка ваших объявлений...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.announcementsBlock}>
                <div className={styles.errorContainer}>
                    <p>Ошибка загрузки ваших объявлений</p>
                </div>
            </div>
        );
    }

    const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };
    const handleNext = () => {
        setPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className={styles.announcementsBlock}>
            <Toaster position="top-right" />

            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>
                        <Megaphone size={28} />
                    </div>
                    <div>
                        <h2>Мои объявления</h2>
                        <p className={styles.subtitle}>
                            {data?.total
                                ? `${data.total} объявлени${data.total > 1 ? "й" : "е"}`
                                : "У вас пока нет объявлений"}
                        </p>
                    </div>
                </div>
                <button className={styles.addBtn} onClick={() => handleEdit()}>
                    <Plus size={20} />
                    Добавить объявление
                </button>
            </div>

            {data?.announcements.length ? (
                <>
                    <div className={styles.cards}>
                        {data.announcements.map((announcement, index) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                index={index}
                                isDeleting={deleteId === announcement.id}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                            />
                        ))}
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
                    <Megaphone size={64} />
                    <h3>У вас пока нет объявлений</h3>
                    <p>Добавьте первое объявление, нажав кнопку выше</p>
                </div>
            )}

            {viewMode === "detail" && selectedId && (
                <DetailModal
                    announcementId={selectedId}
                    onClose={handleCloseModal}
                    onEdit={() => handleEdit(selectedId)}
                />
            )}

            {(viewMode === "edit" || viewMode === "add") && (
                <EditModal
                    announcementId={viewMode === "edit" ? selectedId || undefined : undefined}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                />
            )}

            <DeleteConfirmModal
                isOpen={!!deleteConfirmId}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting && deleteId === deleteConfirmId}
            />
        </div>
    );
};

