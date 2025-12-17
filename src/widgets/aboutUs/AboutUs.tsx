"use client";

import { motion } from "framer-motion";
import styles from "./AboutUs.module.scss";
import {
    Building2,
    Shield,
    Award,
    Users,
    Home,
    TrendingUp,
    CheckCircle,
    Target,
    Heart,
    Zap,
} from "lucide-react";

interface FeatureItem {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface StatItem {
    value: string;
    label: string;
    icon: React.ReactNode;
}

export const AboutUs = () => {
    const features: FeatureItem[] = [
        {
            icon: <Shield size={32} />,
            title: "Надежность",
            description: "Более 10 лет на рынке недвижимости с гарантией качества сделок",
        },
        {
            icon: <Award size={32} />,
            title: "Профессионализм",
            description: "Команда экспертов с глубокими знаниями рынка недвижимости",
        },
        {
            icon: <Users size={32} />,
            title: "Индивидуальный подход",
            description: "Каждому клиенту мы подбираем оптимальное решение",
        },
        {
            icon: <Home size={32} />,
            title: "Большой выбор",
            description: "Тысячи объектов недвижимости на любой вкус и бюджет",
        },
        {
            icon: <TrendingUp size={32} />,
            title: "Выгодные условия",
            description: "Лучшие цены и гибкие условия покупки и аренды",
        },
        {
            icon: <CheckCircle size={32} />,
            title: "Проверенные объекты",
            description: "Все объекты проходят тщательную проверку перед размещением",
        },
    ];

    const stats: StatItem[] = [
        {
            value: "10+",
            label: "Лет опыта",
            icon: <Target size={24} />,
        },
        {
            value: "5000+",
            label: "Довольных клиентов",
            icon: <Heart size={24} />,
        },
        {
            value: "10000+",
            label: "Объектов в базе",
            icon: <Building2 size={24} />,
        },
        {
            value: "24/7",
            label: "Поддержка",
            icon: <Zap size={24} />,
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
        <section className={styles.aboutUs}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>
                        <span>О компании</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Мы — ведущая компания на рынке недвижимости, помогающая людям найти дом мечты уже более 10 лет.
                        Наша миссия — сделать процесс покупки и аренды недвижимости простым, безопасным и выгодным для каждого клиента.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.featuresGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.featureCard}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className={styles.statsSection}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className={styles.statCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            >
                                <div className={styles.statIcon}>{stat.icon}</div>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className={styles.missionSection}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.missionContent}>
                        <h3 className={styles.missionTitle}>Наша миссия</h3>
                        <p className={styles.missionText}>
                            Мы стремимся стать надежным партнером для каждого, кто ищет недвижимость.
                            Наша цель — не просто продать или сдать в аренду объект, а помочь людям найти
                            место, где они будут чувствовать себя комфортно и счастливо. Мы верим, что каждый
                            заслуживает свой идеальный дом, и делаем все возможное, чтобы это стало реальностью.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};


