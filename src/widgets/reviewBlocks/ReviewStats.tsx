"use client";

import { motion } from "framer-motion";
import { TrendingUp, Heart, MessageSquare, Star } from "lucide-react";
import styles from "./ReviewBlocks.module.scss";

interface ReviewStatsProps {
    total: number;
    averageRating: number;
    recentCount: number;
}

export const ReviewStats = ({ total, averageRating, recentCount }: ReviewStatsProps) => {
    const stats = [
        {
            icon: <MessageSquare size={28} />,
            value: total,
            label: "Всего отзывов",
            color: "#002574",
            percentage: 100,
        },
        {
            icon: <Star size={28} />,
            value: `${averageRating}.0`,
            label: "Средний рейтинг",
            color: "#fbbf24",
            percentage: (averageRating / 5) * 100,
        },
        {
            icon: <TrendingUp size={28} />,
            value: recentCount,
            label: "За этот месяц",
            color: "#10b981",
            percentage: Math.min((recentCount / total) * 100 * 2, 100),
        },
        {
            icon: <Heart size={28} />,
            value: "98%",
            label: "Довольных клиентов",
            color: "#ef4444",
            percentage: 98,
        },
    ];

    return (
        <motion.section
            className={styles.reviewStats}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className={styles.container}>
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className={styles.statCard}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.05 }}
                        >
                            <div className={styles.statIcon} style={{ "--stat-color": stat.color } as React.CSSProperties}>
                                {stat.icon}
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                            <div className={styles.statBar}>
                                <motion.div
                                    className={styles.statBarFill}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${stat.percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                    style={{ backgroundColor: stat.color }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};
