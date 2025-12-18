"use client";

import { motion } from "framer-motion";
import { Shield, Award, Clock, Star, CheckCircle, Users } from "lucide-react";
import styles from "./ReviewsBlocks.module.scss";

export const WhyTrustUs = () => {
    const reasons = [
        {
            icon: <Star size={28} />,
            title: "Высокий рейтинг",
            value: "5.0",
            suffix: "/5.0",
            description: "Средняя оценка наших клиентов",
            color: "#fbbf24",
        },
        {
            icon: <Users size={28} />,
            title: "Довольные клиенты",
            value: "5000+",
            description: "Людей оставили нам отзывы",
            color: "#10b981",
        },
        {
            icon: <Clock size={28} />,
            title: "Быстрый ответ",
            value: "24/7",
            description: "Мы всегда готовы помочь вам",
            color: "#3b82f6",
        },
        {
            icon: <Shield size={28} />,
            title: "Надежность",
            value: "100%",
            description: "Проверенные отзывы от реальных клиентов",
            color: "#8b5cf6",
        },
    ];

    return (
        <motion.section
            className={styles.whyTrustUs}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>Почему доверяют нам</h2>
                    <p className={styles.description}>
                        Мы гордимся тем, что наши клиенты выбирают нас снова и снова
                    </p>
                </motion.div>

                <div className={styles.reasonsGrid}>
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            className={styles.reasonCard}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -12, scale: 1.03 }}
                        >
                            <div
                                className={styles.reasonIcon}
                                style={{ "--reason-color": reason.color } as React.CSSProperties}
                            >
                                {reason.icon}
                            </div>
                            <div className={styles.reasonValue}>
                                <span className={styles.valueNumber}>{reason.value}</span>
                                {reason.suffix && <span className={styles.valueSuffix}>{reason.suffix}</span>}
                            </div>
                            <h3 className={styles.reasonTitle}>{reason.title}</h3>
                            <p className={styles.reasonDescription}>{reason.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};





