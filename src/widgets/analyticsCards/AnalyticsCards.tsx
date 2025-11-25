"use client";

import styles from "./AnalyticsCards.module.scss";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const cards = [
    {
        title: "КВАРТИР ПРОДАНО ЗА ПОСЛЕДНИЙ МЕСЯЦ",
        value: 400,
        suffix: "+",
    },
    {
        title: "СРЕДНЯЯ ЦЕНА ЗА ОДНОКОМНАТНУЮ КВАРТИРУ",
        value: 400,
        suffix: " млн сум",
    },
    {
        title: "СРЕДНЕЕ ВРЕМЯ ПРОДАЖИ КВАРТИРЫ",
        value: 30,
        suffix: " дней",
    },
];

export const AnalyticsCards = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const [counts, setCounts] = useState(cards.map(() => 0));

    useEffect(() => {
        if (!isInView) return;

        cards.forEach((card, index) => {
            let start = 0;
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
    }, [isInView]);

    return (
        <div className="container">
            <div ref={ref} className={styles.wrapper}>
                <h2 className={styles.title}>
                    <span>Аналитика</span> проданных квартир
                </h2>

                <div className={styles.grid}>
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            whileHover={{ scale: 1.03 }}
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
