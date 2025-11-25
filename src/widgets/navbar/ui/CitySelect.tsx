"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CitySelect.module.scss";

const cities = [
    "Ташкент", "Нукус", "Андижан", "Бухара", "Фергана", "Джизак", "Хива", "Наманган",
    "Навои", "Кашкадарья", "Самарканд", "Сурхандарья", "Сырдарья", "Хорезм"
];

export const CitySelect = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("Ташкент");

    const toggle = () => setOpen(!open);

    const chooseCity = (city: string) => {
        setSelected(city);
        setOpen(false);
    };

    return (
        <div className={styles.selectWrapper}>
            <button className={styles.select} onClick={toggle}>
                <span>{selected}</span>
                <ChevronDown
                    size={18}
                    className={`${styles.icon} ${open ? styles.rotated : ""}`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        {cities.map((city) => (
                            <li
                                key={city}
                                className={styles.item}
                                onClick={() => chooseCity(city)}
                            >
                                {city}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};
