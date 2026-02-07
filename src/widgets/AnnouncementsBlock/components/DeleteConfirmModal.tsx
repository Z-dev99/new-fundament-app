"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import styles from "../styles.module.scss";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.deleteConfirmModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.deleteConfirmHeader}>
                    <div className={styles.deleteConfirmIcon}>
                        <AlertTriangle size={24} />
                    </div>
                    <h3>Подтвердите удаление</h3>
                    <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.deleteConfirmContent}>
                    <p>
                        Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.
                    </p>
                </div>

                <div className={styles.deleteConfirmActions}>
                    <button
                        className={styles.deleteConfirmCancelBtn}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Отмена
                    </button>
                    <button
                        className={styles.deleteConfirmDeleteBtn}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Удаление..." : "Удалить"}
                    </button>
                </div>
            </div>
        </div>
    );
};


