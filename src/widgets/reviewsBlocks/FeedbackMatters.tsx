"use client";

import { motion } from "framer-motion";
import { Heart, MessageSquare, TrendingUp, Users } from "lucide-react";
import styles from "./ReviewsBlocks.module.scss";

export const FeedbackMatters = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const benefits = [
        {
            icon: <Heart size={32} />,
            title: "Ваше мнение важно",
            description: "Каждый отзыв помогает нам становиться лучше и улучшать сервис",
        },
        {
            icon: <Users size={32} />,
            title: "Помогайте другим",
            description: "Ваш опыт может помочь другим людям принять правильное решение",
        },
        {
            icon: <TrendingUp size={32} />,
            title: "Влияйте на развитие",
            description: "Мы анализируем все отзывы и используем их для улучшения работы",
        },
        {
            icon: <MessageSquare size={32} />,
            title: "Быстро и просто",
            description: "Оставить отзыв можно буквально за пару минут, не требуется регистрация",
        },
    ];

    return (
        <motion.section
            className={styles.feedbackMatters}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className={styles.container}>
                <div className={styles.content}>
                    <motion.div
                        className={styles.textContent}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className={styles.title}>Нам важно ваше мнение</h2>
                        <p className={styles.description}>
                            Мы стремимся предоставлять лучший сервис и ценим обратную связь от каждого клиента.
                            Ваш отзыв не только помогает нам улучшаться, но и поддерживает сообщество, помогая
                            другим людям делать осознанный выбор.
                        </p>
                        <motion.button
                            className={styles.actionButton}
                            onClick={onOpenModal}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageSquare size={20} />
                            Оставить отзыв
                        </motion.button>
                    </motion.div>

                    <div className={styles.benefitsGrid}>
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                className={styles.benefitCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <div className={styles.benefitIcon}>{benefit.icon}</div>
                                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                                <p className={styles.benefitDescription}>{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
};





