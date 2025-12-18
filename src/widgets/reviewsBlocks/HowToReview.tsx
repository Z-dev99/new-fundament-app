"use client";

import { motion } from "framer-motion";
import { FileText, User, Send, CheckCircle } from "lucide-react";
import styles from "./ReviewsBlocks.module.scss";

export const HowToReview = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const steps = [
        {
            icon: <User size={28} />,
            title: "Заполните форму",
            description: "Укажите ваше имя и напишите отзыв о вашем опыте работы с нами",
        },
        {
            icon: <FileText size={28} />,
            title: "Опишите опыт",
            description: "Расскажите подробно о том, что вам понравилось или что можно улучшить",
        },
        {
            icon: <Send size={28} />,
            title: "Отправьте отзыв",
            description: "Мы проверим ваш отзыв и опубликуем его в ближайшее время",
        },
        {
            icon: <CheckCircle size={28} />,
            title: "Готово!",
            description: "Ваш отзыв поможет другим людям принять правильное решение",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.section
            className={styles.howToReview}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <div className={styles.container}>
                <motion.div className={styles.header} variants={itemVariants}>
                    <h2 className={styles.title}>Как оставить отзыв</h2>
                    <p className={styles.description}>
                        Простой процесс, который займет всего несколько минут вашего времени
                    </p>
                </motion.div>

                <div className={styles.stepsGrid}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={styles.stepCard}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className={styles.stepNumber}>{index + 1}</div>
                            <div className={styles.stepIcon}>{step.icon}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className={styles.cta}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.button
                        className={styles.ctaButton}
                        onClick={onOpenModal}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Начать сейчас
                    </motion.button>
                </motion.div>
            </div>
        </motion.section>
    );
};





