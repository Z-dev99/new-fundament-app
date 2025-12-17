"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, Eye, Users } from "lucide-react";
import styles from "./ReviewBlocks.module.scss";

export const WhyTrustUs = () => {
    const features = [
        {
            icon: <Shield size={32} />,
            title: "Проверенные отзывы",
            description: "Все отзывы проходят модерацию для обеспечения честности и достоверности",
        },
        {
            icon: <CheckCircle size={32} />,
            title: "Реальные клиенты",
            description: "Отзывы оставляют только реальные люди, которые воспользовались нашими услугами",
        },
        {
            icon: <Eye size={32} />,
            title: "Публичность",
            description: "Все отзывы публикуются открыто, мы не скрываем мнение наших клиентов",
        },
        {
            icon: <Users size={32} />,
            title: "Сообщество",
            description: "Присоединяйтесь к тысячам довольных клиентов и поделитесь своим опытом",
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
            className={styles.whyTrustUs}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <div className={styles.container}>
                <motion.div className={styles.header} variants={itemVariants}>
                    <h2 className={styles.title}>Почему нам доверяют</h2>
                    <p className={styles.subtitle}>
                        Мы ценим прозрачность и честность в общении с нашими клиентами
                    </p>
                </motion.div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.featureCard}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};
