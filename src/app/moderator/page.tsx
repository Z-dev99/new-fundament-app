"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const tabs = [
    "Объекты",
    "Заявки пользователей",
    "Отзывы",
    "Постеры",
    "Аналитика",
    "Обратная связь пользователей",
];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("Главная");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={styles.dashboard}>
            <button
                className={styles.hamburger}
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                ☰
            </button>
            <AnimatePresence>
                {(sidebarOpen || window.innerWidth > 1024) && (
                    <motion.aside
                        className={styles.sidebar}
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "tween", duration: 0.25 }}
                    >
                        <div className={styles.logoBlock}>
                            <Image
                                src="/logos/logo.svg"
                                alt="Fundament logo"
                                width={140}
                                height={60}
                            />
                        </div>
                        <nav className={styles.menu}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`${styles.menuItem} ${activeTab === tab ? styles.active : ""
                                        }`}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            <main className={styles.main}>
                <AnimatePresence mode="wait">
                    {activeTab !== "Главная" && (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={styles.tabContent}
                        >
                            <h2>{activeTab}</h2>
                            <p>Контент для вкладки "{activeTab}" будет здесь.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
