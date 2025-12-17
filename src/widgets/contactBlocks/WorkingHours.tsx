"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import styles from "./ContactBlocks.module.scss";

export const WorkingHours = () => {
    const workingHours = [
        { day: "Понедельник - Пятница", hours: "09:00 - 18:00" },
        { day: "Суббота", hours: "10:00 - 16:00" },
        { day: "Воскресенье", hours: "Выходной" },
    ];

    return (
        <motion.div
            className={styles.workingHours}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className={styles.iconWrapper}>
                <Clock size={32} />
            </div>
            <h3 className={styles.title}>График работы</h3>
            <div className={styles.hoursList}>
                {workingHours.map((item, index) => (
                    <div key={index} className={styles.hoursItem}>
                        <span className={styles.day}>{item.day}</span>
                        <span className={styles.hours}>{item.hours}</span>
                    </div>
                ))}
            </div>
            <div className={styles.locationHint}>
                <MapPin size={16} />
                <span>Мы находимся в центре города, легко добраться на общественном транспорте</span>
            </div>
        </motion.div>
    );
};
