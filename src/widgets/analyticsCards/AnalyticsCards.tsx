"use client";

import { useGetStatsQuery } from "@/shared/api/statsApi";
import styles from "./AnalyticsCards.module.scss";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CardType {
    title: string;
    value: number;
    suffix?: string;
}

export const AnalyticsCards: React.FC = () => {
    const { data, isLoading, error } = useGetStatsQuery();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const cards: CardType[] = data
        ? [
            {
                title: "КВАРТИР ПРОДАНО ЗА ПОСЛЕДНИЙ МЕСЯЦ",
                value: Number(data.apartments_sold_monthly) || 0,
                suffix: "+",
            },
            {
                title: "СРЕДНЯЯ ЦЕНА ЗА ОДНОКОМНАТНУЮ КВАРТИРУ",
                value: Number(data.average_price_one_room) || 0,
                suffix: " млн сум",
            },
            {
                title: "СРЕДНЕЕ ВРЕМЯ ПРОДАЖИ КВАРТИРЫ",
                value: Number(data.avg_sale_days) || 0,
                suffix: " дней",
            },
        ]
        : [];

    const [counts, setCounts] = useState<number[]>(cards.map(() => 0));

    useEffect(() => {
        if (!isInView || !cards.length) return;
        cards.forEach((card, index) => {
            const start = 0;
            const end = card.value;
            const duration = 1200;
            const startTime = performance.now();

            const animate = (now: number) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const current = Math.floor(start + (end - start) * progress);

                setCounts((prev) => {
                    const updated = [...prev];
                    updated[index] = current;
                    return updated;
                });
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        });
    }, [isInView, data]);
    if (isLoading)
        return (
            <div className="container">
                <div className={styles.wrapper}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={styles.card}
                    >
                        <p className={styles.label}>Загрузка аналитики...</p>
                    </motion.div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="container">
                <div className={styles.wrapper}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={styles.card}
                    >
                        <p className={styles.label}>Ошибка загрузки данных. Попробуйте обновить страницу.</p>
                    </motion.div>
                </div>
            </div>
        );

    return (
        <div className="container">
            <div ref={ref} className={styles.wrapper}>
                <h2 className={styles.title}>
                    <span>Аналитика проданных квартир</span>
                </h2>

                <div className={styles.grid}>
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <div className={styles.label}>{card.title}</div>
                            <div className={styles.value}>
                                {counts[i]}
                                {card.suffix}
                            </div>
                            <div className={styles.rings} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
