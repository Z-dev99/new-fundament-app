"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./PropertyBlocks.module.scss";
import {
    Shield,
    Award,
    MapPin,
    Building2,
    CheckCircle,
    Star,
} from "lucide-react";

interface WhyThisPropertyProps {
    propertyType?: string;
    district?: string;
}

export const WhyThisProperty: React.FC<WhyThisPropertyProps> = ({ propertyType, district }) => {
    const reasons = [
        {
            icon: <CheckCircle size={24} />,
            title: "Проверенная недвижимость",
            description: "Все объекты проходят тщательную проверку перед публикацией",
        },
        {
            icon: <MapPin size={24} />,
            title: "Удобное расположение",
            description: district ? `В престижном районе ${district}` : "В удобном районе города",
        },
        {
            icon: <Building2 size={24} />,
            title: propertyType || "Качественный объект",
            description: "Соответствие всем современным стандартам качества",
        },
        {
            icon: <Shield size={24} />,
            title: "Безопасная сделка",
            description: "Полное юридическое сопровождение и защита ваших интересов",
        },
        {
            icon: <Award size={24} />,
            title: "Выгодные условия",
            description: "Конкурентная цена и гибкие условия оплаты",
        },
        {
            icon: <Star size={24} />,
            title: "Профессиональная поддержка",
            description: "Наша команда поможет на всех этапах сделки",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
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
            className={styles.whyThisProperty}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className="container">
                <motion.div className={styles.header} variants={itemVariants}>
                    <h2 className={styles.title}>Почему именно этот объект?</h2>
                    <p className={styles.subtitle}>
                        Уникальные преимущества, которые делают этот объект особенным
                    </p>
                </motion.div>

                <motion.div className={styles.reasonsGrid} variants={containerVariants}>
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            className={styles.reasonCard}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className={styles.reasonIcon}>{reason.icon}</div>
                            <h3 className={styles.reasonTitle}>{reason.title}</h3>
                            <p className={styles.reasonDescription}>{reason.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};
