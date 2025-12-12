"use client";

import { useGetStatsQuery } from "@/shared/api/statsApi";
import styles from "./AnalyticsCards.module.scss";
import { motion } from "framer-motion";

interface CardType {
    title: string;
    value: number;
    suffix?: string;
}

export const AnalyticsCards: React.FC = () => {
    const { data, isLoading, error } = useGetStatsQuery();

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

    function getPlural(value: number, one: string, few: string, many: string) {
        const mod10 = value % 10;
        const mod100 = value % 100;

        if (mod10 === 1 && mod100 !== 11) return one;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
        return many;
    }

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
                suffix: getPlural(Number(data.avg_sale_days), " день", " дня", " дней"),
            },
        ]
        : [];


    return (
        <div className="container">
            <div className={styles.wrapper}>
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
                                {card.value}
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
