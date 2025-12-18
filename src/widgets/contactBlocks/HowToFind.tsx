"use client";

import { motion } from "framer-motion";
import { Navigation, Bus, Car, MapPin } from "lucide-react";
import styles from "./ContactBlocks.module.scss";

export const HowToFind = () => {
    const instructions = [
        {
            icon: <Navigation size={24} />,
            title: "Навигатор",
            description: "Используйте координаты: 41.285915, 69.233924 для навигации",
        },
        {
            icon: <Bus size={24} />,
            title: "Общественный транспорт",
            description: "Автобусы: 12, 35, 67, 89. Остановка «Мукими»",
        },
        {
            icon: <Car size={24} />,
            title: "На машине",
            description: "Парковка доступна рядом с офисом. Первые 2 часа бесплатно",
        },
        {
            icon: <MapPin size={24} />,
            title: "Пешком",
            description: "5 минут пешком от метро «Мустакиллик майдони»",
        },
    ];

    return (
        <motion.div
            className={styles.howToFind}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h3 className={styles.sectionTitle}>Как нас найти</h3>
            <p className={styles.sectionDescription}>
                Несколько способов добраться до нашего офиса быстро и удобно
            </p>
            <div className={styles.instructionsGrid}>
                {instructions.map((instruction, index) => (
                    <motion.div
                        key={index}
                        className={styles.instructionCard}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    >
                        <div className={styles.instructionIcon}>{instruction.icon}</div>
                        <div className={styles.instructionContent}>
                            <h4 className={styles.instructionTitle}>{instruction.title}</h4>
                            <p className={styles.instructionDescription}>{instruction.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};





