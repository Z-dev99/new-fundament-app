"use client";

import { useMemo } from "react";
import { useGetStatsQuery } from "@/shared/api/statsApi";
import styles from "./AnalyticsCards.module.scss";
import { motion } from "framer-motion";
import { TrendingUp, Home, Clock, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface CardType {
    title: string;
    value: number | string;
    suffix?: string;
    icon: React.ReactNode;
    gradient: string;
}

function formatNumber(value: number): string {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (value >= 1000) {
        return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return value.toString();
}

function formatPrice(value: number): string {
    if (value >= 1000000) {
        const millions = (value / 1000000).toFixed(1).replace(/\.0$/, "");
        return `${millions} млн`;
    }
    return value.toLocaleString("ru-RU");
}

function getPlural(value: number, one: string, few: string, many: string): string {
    const mod10 = value % 10;
    const mod100 = value % 100;

    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
}

export const AnalyticsCards: React.FC = () => {
    const { data, isLoading, error, refetch } = useGetStatsQuery();

    const cards: CardType[] = useMemo(() => {
        if (!data) return [];

        const apartmentsSold = Number(data.apartments_sold_monthly) || 0;
        const avgPrice = Number(data.average_price_one_room) || 0;
        const avgDays = Number(data.avg_sale_days) || 0;

        return [
            {
                title: "Квартир продано за последний месяц",
                value: apartmentsSold > 0 ? formatNumber(apartmentsSold) : "—",
                suffix: apartmentsSold > 0 ? "+" : "",
                icon: <TrendingUp size={24} />,
                gradient: "gradient1",
            },
            {
                title: "Средняя цена за однокомнатную квартиру",
                value: avgPrice > 0 ? formatPrice(avgPrice) : "—",
                suffix: avgPrice > 0 ? " сум" : "",
                icon: <Home size={24} />,
                gradient: "gradient2",
            },
            {
                title: "Среднее время продажи квартиры",
                value: avgDays > 0 ? avgDays : "—",
                suffix:
                    avgDays > 0
                        ? getPlural(avgDays, " день", " дня", " дней")
                        : "",
                icon: <Clock size={24} />,
                gradient: "gradient3",
            },
        ];
    }, [data]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className={styles.wrapper}>
                    <motion.div
                        className={styles.loadingContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Loader2 size={48} className={styles.spinner} />
                        <p>Загрузка аналитики...</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className={styles.wrapper}>
                    <motion.div
                        className={styles.errorContainer}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle size={48} className={styles.errorIcon} />
                        <p>Ошибка загрузки данных</p>
                        <button onClick={() => refetch()} className={styles.retryBtn}>
                            <RefreshCw size={16} />
                            Попробовать снова
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className={styles.wrapper}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span>Аналитика проданных квартир</span>
                </motion.h2>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            className={`${styles.card} ${styles[card.gradient]}`}
                            variants={cardVariants}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>{card.icon}</div>
                                <div className={styles.label}>{card.title}</div>
                            </div>
                            <div className={styles.valueWrapper}>
                                <div className={styles.value}>
                                    {card.value}
                                    {card.suffix && (
                                        <span className={styles.suffix}>{card.suffix}</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.rings} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
