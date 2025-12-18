"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./PropertyBlocks.module.scss";
import {
    Phone,
    FileText,
    CheckCircle2,
    Handshake,
    Calendar,
    Key,
} from "lucide-react";

export const HowToMakeDeal: React.FC = () => {
    const steps = [
        {
            icon: <Phone size={24} />,
            step: "01",
            title: "Свяжитесь с нами",
            description: "Позвоните или оставьте заявку на сайте. Наш менеджер свяжется с вами в течение 15 минут",
        },
        {
            icon: <FileText size={24} />,
            step: "02",
            title: "Оформление документов",
            description: "Проверяем все необходимые документы и готовим договор. Юристы проверят чистоту сделки",
        },
        {
            icon: <CheckCircle2 size={24} />,
            step: "03",
            title: "Проверка объекта",
            description: "Организуем просмотр объекта. Наши эксперты проведут финальную проверку",
        },
        {
            icon: <Handshake size={24} />,
            step: "04",
            title: "Заключение сделки",
            description: "Подписываем договор и завершаем все формальности в присутствии нотариуса",
        },
        {
            icon: <Key size={24} />,
            step: "05",
            title: "Получение ключей",
            description: "Передаем ключи и документы. Объект полностью ваш!",
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
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.section
            className={styles.howToMakeDeal}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className="container">
                <motion.div className={styles.header} variants={itemVariants}>
                    <h2 className={styles.title}>Как оформить сделку</h2>
                    <p className={styles.subtitle}>
                        Простой и понятный процесс от заявки до получения ключей
                    </p>
                </motion.div>

                <div className={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={styles.stepCard}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        >
                            <div className={styles.stepNumber}>{step.step}</div>
                            <div className={styles.stepIcon}>{step.icon}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className={styles.stepConnector}>
                                    <div className={styles.connectorLine}></div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};
