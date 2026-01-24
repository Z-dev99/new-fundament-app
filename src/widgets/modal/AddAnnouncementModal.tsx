"use client";

import React from "react";
import { X, MessageCircle, ArrowRight } from "lucide-react";
import styles from "./AddAnnouncementModal.module.scss";
import { BaseModal } from "@/shared/ui/BaseModal";

type Props = {
    open: boolean;
    onClose: () => void;
};

const MODERATOR_TELEGRAM = process.env.NEXT_PUBLIC_MODERATOR_TELEGRAM || "https://t.me/Pdwbd";

export const AddAnnouncementModal: React.FC<Props> = ({ open, onClose }) => {
    const handleContactModerator = () => {
        window.open(MODERATOR_TELEGRAM, "_blank");
    };

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            classNameBackdrop={styles.modalBackdrop}
            classNameModal={styles.modalContainer}
            width={500}
        >
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
                    <X size={20} />
                </button>
                
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <MessageCircle size={48} />
                    </div>
                    
                    <h2 className={styles.title}>Добавление объявления</h2>
                    
                    <p className={styles.description}>
                        Для добавления объявления на платформу необходимо обратиться к модератору. 
                        Наш специалист поможет вам разместить ваше объявление и ответит на все вопросы.
                    </p>
                    
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>✓</div>
                            <span>Быстрое размещение</span>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>✓</div>
                            <span>Помощь в оформлении</span>
                        </div>
                        <div className={styles.feature}>
                            <div className={styles.featureIcon}>✓</div>
                            <span>Консультация специалиста</span>
                        </div>
                    </div>
                    
                    <button
                        className={styles.contactBtn}
                        onClick={handleContactModerator}
                    >
                        <MessageCircle size={20} />
                        <span>Связаться с модератором</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};



